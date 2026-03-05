import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { auth, handleAuthError, getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";
import Navbar from "@/components/Navbar";
import {
  FileText,
  Plus,
  Search,
  Clock,
  Sparkles,
  Trash2,
  Edit3,
  PenLine,
  Calendar,
  FolderOpen,
  TrendingUp,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resumeApi } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Track which resume is being edited
  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Filter resumes based on search
  const filteredResumes = useMemo(() => {
    if (!searchQuery.trim()) return resumes;
    return resumes.filter(r =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [resumes, searchQuery]);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get first name from display name or email
  const getFirstName = () => {
    if (session?.user?.displayName) {
      return session.user.displayName.split(' ')[0];
    }
    if (session?.user?.email) {
      return session.user.email.split('@')[0];
    }
    return "there";
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          navigate("/auth");
          return;
        }
        setSession({ user });
      } catch (err) {
        console.error("Session check error:", err);
        navigate("/auth");
      }
    };

    checkSession();

    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setSession({ user });
      } else {
        navigate("/auth");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session) fetchResumes();
  }, [session]);

  const fetchResumes = async (retryCount = 0) => {
    try {
      if (!session?.user) return;
      const resumesData = await resumeApi.listByUser();
      setResumes(resumesData);
    } catch (error) {
      console.error("Fetch resumes error:", error);
      if (retryCount < 1) {
        setTimeout(() => fetchResumes(retryCount + 1), 1000);
        return;
      }
      handleAuthError(error);
      toast({
        title: "Error",
        description: error.message.includes("authenticated")
          ? "Session expired. Please log in again."
          : "Failed to load resumes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewResume = async () => {
    try {
      const currentUser = session?.user || auth.currentUser;
      if (!currentUser) {
        navigate("/auth");
        return;
      }
      if (isCreating) return;
      setIsCreating(true);

      const initialContent = {
        personalInfo: {
          fullName: currentUser.displayName || "",
          email: currentUser.email || "",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
        },
        summary: "",
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        skills: {
          frontend: [],
          backend: [],
          databases: [],
          cloud: [],
          tools: [],
          other: []
        }
      };

      const result = await resumeApi.create("New Resume", initialContent, {
        template: "modern",
        creation_method: "dashboard"
      });

      navigate(`/builder/${result.resumeId}`);
    } catch (error) {
      handleAuthError(error);
      toast({
        title: "Error",
        description: "Failed to create resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await resumeApi.delete(id);
      setResumes(resumes.filter(r => r.id !== id));
      toast({
        title: "Success",
        description: "Resume deleted successfully."
      });
    } catch (err) {
      handleAuthError(err);
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const saveTitle = async (id) => {
    if (!tempTitle.trim() || isSaving) {
      setEditingId(null);
      return;
    }

    // Check if title actually changed
    const originalResume = resumes.find(r => r.id === id);
    if (originalResume && originalResume.title === tempTitle) {
      setEditingId(null);
      return;
    }

    setIsSaving(true);
    try {
      await resumeApi.update(id, null, null, tempTitle);
      setResumes(resumes.map(r => r.id === id ? { ...r, title: tempTitle } : r));
      setEditingId(null);
      toast({
        title: "Success",
        description: "Resume renamed."
      });
    } catch (error) {
      console.error("Save title error:", error);
      toast({
        title: "Error",
        description: "Failed to rename resume.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const stats = useMemo(() => {
    const now = new Date();
    const thisWeek = resumes.filter(r => {
      const updated = new Date(r.updated_at);
      const diffDays = (now - updated) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }).length;

    return {
      total: resumes.length,
      thisWeek,
      latest: resumes[0] ? new Date(resumes[0].updated_at).toLocaleDateString() : 'N/A'
    };
  }, [resumes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-20 flex flex-col items-center justify-center relative overflow-hidden">
        <Navbar user={session?.user} />
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-violet-600/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-fuchsia-600/20 blur-[150px] rounded-full mix-blend-screen" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/5 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-gray-400 animate-pulse font-medium tracking-wide">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-gray-100 overflow-x-hidden pt-20 selection:bg-purple-500/30">
      <Navbar user={session?.user} />

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(124,58,237,0.15)_0%,transparent_70%)] blur-[100px] opacity-70"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] left-[-10%] w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(79,70,229,0.15)_0%,transparent_70%)] blur-[100px] opacity-70"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8 py-10 max-w-7xl">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full shadow-lg mb-4 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Workspace</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white">
              {getGreeting()}, <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">{getFirstName()}</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed">
              Manage your career artifacts and craft the perfect impression.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={createNewResume}
            disabled={isCreating}
            className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-bold overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed border border-white/20 hover:border-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Plus className="relative z-10 w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            <span className="relative z-10">{isCreating ? "Initializing..." : "New Resume"}</span>
          </motion.button>
        </motion.div>

        {/* METRICS GRID */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {/* Total */}
          <div className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-white/10 to-white/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-[#0a0a0a] backdrop-blur-xl rounded-[23px] p-6 lg:p-8 flex items-center gap-5">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                <FolderOpen className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">Total Resumes</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-bold text-white tracking-tight">{stats.total}</p>
                </div>
              </div>
            </div>
          </div>

          {/* This Week */}
          <div className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-white/10 to-white/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-[#0a0a0a] backdrop-blur-xl rounded-[23px] p-6 lg:p-8 flex items-center gap-5">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">Updated This Week</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-bold text-white tracking-tight">{stats.thisWeek}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Last Activity */}
          <div className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-white/10 to-white/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full bg-[#0a0a0a] backdrop-blur-xl rounded-[23px] p-6 lg:p-8 flex items-center gap-5">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">Last Activity</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-lg font-bold text-white tracking-tight leading-none mt-1">{stats.latest}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SEARCH BAR */}
        {resumes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="relative max-w-xl group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative flex items-center bg-[#111] border border-white/10 rounded-2xl p-2 pl-4 focus-within:border-purple-500/50 transition-colors">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search your workspaces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 pl-3 py-2 text-lg outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* RESUMES SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
              <FileText className="w-6 h-6 text-purple-400" />
              {resumes.length === 0 ? "Let's Begin" : "Active Documents"}
            </h2>
            {filteredResumes.length !== resumes.length && (
              <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-sm font-medium text-gray-300">
                Found {filteredResumes.length}
              </div>
            )}
          </div>

          {resumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-[2rem] p-[1px] bg-gradient-to-b from-white/10 to-transparent"
            >
              <div className="relative bg-[#050505] rounded-[2rem] p-16 md:p-24 text-center border-t border-white/5 backdrop-blur-2xl">
                {/* Background glow for empty state */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-3xl border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl">
                      <FileText className="w-10 h-10 text-purple-400" />
                    </div>
                    <div className="absolute -top-3 -right-3 h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] border border-gray-100">
                      <Sparkles className="w-5 h-5 text-gray-900" />
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">Start Your Journey</h2>
                  <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto font-light leading-relaxed">
                    Build a world-class resume. Our AI engine optimizes your experience to beat ATS systems and impress recruiters.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(168, 85, 247, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={createNewResume}
                    disabled={isCreating}
                    className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-bold shadow-2xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span className="text-lg">{isCreating ? "Initializing..." : "Create First Document"}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : filteredResumes.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center bg-[#0a0a0a] rounded-3xl border border-white/5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No documents found</h3>
              <p className="text-gray-500">We couldn't find anything matching your search query.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredResumes.map((resume, index) => (
                  <motion.div
                    key={resume.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ delay: index * 0.05, duration: 0.4, type: "spring", stiffness: 100 }}
                    className="group relative flex flex-col h-[280px]"
                  >
                    {/* Glowing background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 pointer-events-none" />

                    <div className="relative h-full bg-[#0a0a0a] hover:bg-[#111] border border-white/10 hover:border-white/20 rounded-3xl p-6 flex flex-col transition-all duration-300 z-10">

                      {/* Top Head */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-all duration-300">
                          <FileText className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteResume(resume.id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 min-h-0 mt-2">
                        {editingId === resume.id ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={tempTitle}
                              onChange={(e) => setTempTitle(e.target.value)}
                              onBlur={() => saveTitle(resume.id)}
                              onKeyDown={(e) => e.key === "Enter" && saveTitle(resume.id)}
                              className="w-full bg-[#1a1a1a] border border-purple-500/50 rounded-xl px-3 py-2 text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div className="group/title flex items-center gap-2">
                            <h3
                              className="font-bold text-xl text-white truncate max-w-[80%] cursor-text hover:text-purple-300 transition-colors"
                              onClick={() => {
                                setEditingId(resume.id);
                                setTempTitle(resume.title);
                              }}
                            >
                              {resume.title}
                            </h3>
                            <button
                              title="Edit Name"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(resume.id);
                                setTempTitle(resume.title);
                              }}
                              className="opacity-0 group-hover/title:opacity-100 p-1 text-gray-500 hover:text-white transition-all transform -translate-x-2 group-hover/title:translate-x-0"
                            >
                              <PenLine className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-4 text-xs font-medium text-gray-500 bg-white/5 w-fit px-3 py-1.5 rounded-full border border-white/5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(resume.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4 mt-auto">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/builder/${resume.id}`)}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white text-gray-300 hover:text-black rounded-xl font-bold transition-all duration-300 overflow-hidden relative group/btn border border-white/10 hover:border-white shadow-[0_4px_14px_0_rgba(255,255,255,0.05)] hover:shadow-[0_4px_20px_0_rgba(255,255,255,0.15)]"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Open Workspace</span>
                        </motion.button>
                      </div>

                    </div>
                  </motion.div>
                ))}

                {/* Create New Card */}
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: filteredResumes.length * 0.05, duration: 0.4 }}
                  className="h-[280px]"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createNewResume}
                    disabled={isCreating}
                    className="w-full h-full group relative bg-transparent border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 transition-colors duration-500 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 pointer-events-none" />
                    <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 flex items-center justify-center transition-all duration-500">
                      <Plus className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <span className="relative font-bold mt-2 text-gray-500 group-hover:text-white transition-colors duration-300">
                      {isCreating ? "Initializing..." : "Blank Document"}
                    </span>
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

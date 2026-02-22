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
  MoreVertical,
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
    if (!confirm("Are you sure you want to delete this resume?")) return;
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
      <div className="mt-5 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-black dark:to-purple-950 pt-20">
        <Navbar user={session?.user} />
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-black dark:to-purple-950 text-gray-900 dark:text-gray-100 pt-20">
      <Navbar user={session?.user} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {getGreeting()}, {getFirstName()}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                Ready to craft your perfect resume?
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={createNewResume}
              disabled={isCreating}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              {isCreating ? "Creating..." : "New Resume"}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                <FolderOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Resumes</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Updated This Week</p>
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Activity</p>
                <p className="text-2xl font-bold">{stats.latest}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {resumes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              Your Resumes
            </h2>
            {filteredResumes.length !== resumes.length && (
              <span className="text-sm text-gray-500">
                Showing {filteredResumes.length} of {resumes.length}
              </span>
            )}
          </div>

          {resumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden border-2 border-dashed border-purple-300 dark:border-purple-800 rounded-2xl p-12 text-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full translate-x-1/2 translate-y-1/2" />
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <FileText className="w-10 h-10" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="w-4 h-4 text-yellow-900" />
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Start Your Journey</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Create your first AI-powered resume and land your dream job.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={createNewResume}
                  disabled={isCreating}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Zap className="w-5 h-5" />
                  {isCreating ? "Creating..." : "Create Your First Resume"}
                </motion.button>
              </div>
            </motion.div>
          ) : filteredResumes.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No resumes found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredResumes.map((resume, index) => (
                  <motion.div
                    key={resume.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white shadow-lg shadow-purple-500/20">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {editingId === resume.id ? (
                            <input
                              type="text"
                              value={tempTitle}
                              onChange={(e) => setTempTitle(e.target.value)}
                              onBlur={() => saveTitle(resume.id)}
                              onKeyDown={(e) => e.key === "Enter" && saveTitle(resume.id)}
                              className="w-full border-2 border-purple-500 rounded-lg px-2 py-1 text-sm bg-white dark:bg-gray-800 focus:outline-none"
                              autoFocus
                            />
                          ) : (
                            <h3
                              className="font-semibold truncate cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                              onClick={() => {
                                setEditingId(resume.id);
                                setTempTitle(resume.title);
                              }}
                            >
                              {resume.title}
                            </h3>
                          )}
                        </div>
                        {editingId !== resume.id && (
                          <button
                            onClick={() => {
                              setEditingId(resume.id);
                              setTempTitle(resume.title);
                            }}
                            className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/50 rounded-lg transition-all"
                          >
                            <PenLine className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-5">
                      <Clock className="w-4 h-4" />
                      <span>Updated {new Date(resume.updated_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/builder/${resume.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteResume(resume.id)}
                        className="p-2.5 border-2 border-red-200 dark:border-red-900 text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={createNewResume}
                disabled={isCreating}
                className="group border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-400 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 min-h-[180px] transition-all"
              >
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                  <Plus className="w-8 h-8 text-gray-400 group-hover:text-purple-500" />
                </div>
                <span className="font-medium text-gray-500 group-hover:text-purple-600">
                  {isCreating ? "Creating..." : "Create New Resume"}
                </span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

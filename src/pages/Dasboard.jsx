import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, handleAuthError, getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resumeApi } from "@/services/api";

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Track which resume is being edited
  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");

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

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (session) fetchResumes();
  }, [session]);

  const fetchResumes = async () => {
    try {
      if (!session?.user) return;
      
      const resumesData = await resumeApi.listByUser();
      setResumes(resumesData);
    } catch (error) {
      handleAuthError(error);
      toast({
        title: "Error",
        description: "Failed to load resumes. Please try logging in again.",
        variant: "destructive"
      });
      console.error("Fetch resumes error:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewResume = async () => {
    try {
      const currentUser = session?.user || auth.currentUser;
      if (!currentUser) {
        toast({
          title: "Session expired",
          description: "Please sign in again to create a resume.",
          variant: "destructive"
        });
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
        template: "modern", // Default template
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
      console.error("Create resume error:", error);
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
      console.error("Delete resume error:", err);
    }
  };

  const saveTitle = async (id) => {
    if (!tempTitle.trim()) return;
    try {
      // Pass null for content to only update title
      await resumeApi.update(id, null, { title: tempTitle });

      setResumes(resumes.map(r => r.id === id ? { ...r, title: tempTitle } : r));
      setEditingId(null);
      setTempTitle("");
      toast({
        title: "Success",
        description: "Resume title updated."
      });
    } catch (error) {
      handleAuthError(error);
      toast({
        title: "Error",
        description: "Failed to rename resume. Please try again.",
        variant: "destructive"
      });
      console.error("Save title error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar user={session?.user} />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      <Navbar user={session?.user} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Resumes</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Create and manage your resumes</p>
          </div>
          <button
            onClick={createNewResume}
            disabled={isCreating}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "+ New Resume"}
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center bg-card">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white flex items-center justify-center">
                <FileText/>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-1">No resumes yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first resume to get started</p>
            <button
              onClick={createNewResume}
              disabled={isCreating}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isCreating ? "Creating..." : "+ Create Resume"}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map(resume => (
              <div key={resume.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500 dark:hover:shadow-purple-700 transition bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-500 text-lg">📄</span>
                  {editingId === resume.id ? (
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onBlur={() => saveTitle(resume.id)}
                      onKeyDown={(e) => e.key === "Enter" && saveTitle(resume.id)}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm flex-1 bg-background text-foreground"
                      autoFocus
                    />
                  ) : (
                    <h3
                      className="font-bold cursor-pointer hover:text-purple-500 transition flex-1"
                      onClick={() => {
                        setEditingId(resume.id);
                        setTempTitle(resume.title);
                      }}
                    >
                      {resume.title}
                    </h3>
                  )}
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Last updated: {new Date(resume.updated_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/builder/${resume.id}`)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteResume(resume.id)}
                    className="px-3 py-2 border border-red-400 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

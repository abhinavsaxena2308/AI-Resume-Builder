import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { FileText } from "lucide-react";

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Track which resume is being edited
  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate("/auth");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session) fetchResumes();
  }, [session]);

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("id, title, created_at, updated_at")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      alert("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const createNewResume = async () => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("resumes")
        .insert([{ user_id: session.user.id, title: "New Resume", created_at: now, updated_at: now }])
        .select()
        .single();

      if (error) throw error;
      navigate(`/builder/${data.id}`);
    } catch (error) {
      alert("Failed to create resume");
    }
  };

  const deleteResume = async (id) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try {
      const { error } = await supabase.from("resumes").delete().eq("id", id);
      if (error) throw error;
      setResumes(resumes.filter(r => r.id !== id));
    } catch (err) {
      alert("Failed to delete resume");
    }
  };

  const saveTitle = async (id) => {
    if (!tempTitle.trim()) return;
    try {
      const { error } = await supabase.from("resumes").update({ title: tempTitle }).eq("id", id);
      if (error) throw error;

      setResumes(resumes.map(r => r.id === id ? { ...r, title: tempTitle } : r));
      setEditingId(null);
      setTempTitle("");
    } catch (error) {
      alert("Failed to rename resume");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar user={session?.user} />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition"
          >
            + New Resume
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white flex items-center justify-center">
                <FileText/>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-1">No resumes yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first resume to get started</p>
            <button
              onClick={createNewResume}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition"
            >
              + Create Resume
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map(resume => (
              <div key={resume.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-500 text-lg">📄</span>
                  {editingId === resume.id ? (
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onBlur={() => saveTitle(resume.id)}
                      onKeyDown={(e) => e.key === "Enter" && saveTitle(resume.id)}
                      className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm flex-1"
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

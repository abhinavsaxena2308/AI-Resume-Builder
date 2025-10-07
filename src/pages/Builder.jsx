import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import ResumeForm from "@/components/resume/ResumeForm";
import ResumePreview from "@/components/resume/ResumePreview";

const Builder = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
  });
  const navigate = useNavigate();
  const { id } = useParams(); // Resume ID

    const handleLogout = async () => {
      try {
        await supabase.auth.signOut();
        navigate("/auth");
      } catch (err) {
        console.error("Logout error:", err);
      }
    };

  // Fetch user and resume
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!user || error) {
        navigate("/auth");
        return;
      }
      setUser(user);

      // Fetch existing resume if editing
      if (id) {
        const { data, error } = await supabase
          .from("resumes")
          .select("content")
          .eq("id", id)
          .single();

        if (error) {
          alert("Failed to load resume.");
        } else {
          setResumeData(data.content || resumeData);
        }
      }
      setLoading(false);
    };

    checkUser();
  }, [id, navigate]);

  // Auto-save every 5 seconds
  useEffect(() => {
    if (!id) return;
    const interval = setInterval(() => saveResume(), 5000);
    return () => clearInterval(interval);
  }, [resumeData, id]);

  const saveResume = useCallback(async () => {
    if (!id) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("resumes")
        .update({ content: resumeData, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      alert("Failed to save resume");
    } finally {
      setSaving(false);
    }
  }, [resumeData, id]);

  const handleDownloadPDF = () => {
    alert("PDF download will be available soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted text-gray-900 dark:text-gray-100">
      {/* <Navbar user={user} /> */}
      <header className="border-b bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-700  border rounded-full p-2 dark:text-gray-200 hover:bg-purple-400 hover:text-white transition"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-xl font-bold flex items-center gap-2">
            Resume Builder
            {saving && <span className="text-sm text-green-600 animate-pulse">Saving...</span>}
          </h1>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 text-white rounded-lg font-medium transition"
            >
              Download PDF
            </button>
            <button
              onClick={saveResume}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 text-white rounded-lg font-medium transition"
            >
              Save
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 text-white rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ResumeForm data={resumeData} onChange={setResumeData} />
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Builder;

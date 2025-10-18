import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import ResumeForm from "@/components/resume/ResumeForm";
import ResumePreview from "@/components/resume/ResumePreview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Menu, X } from "lucide-react";

const Builder = () => {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null); // reference to preview for PDF

  const [menuOpen, setMenuOpen] = useState(false);
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
  const { id } = useParams();

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

  // ✅ Actual PDF download functionality
  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setDownloading(true);

    try {
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);

      pdf.save(
        `${resumeData.personalInfo.fullName || "My_Resume"}_${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("Failed to download resume. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="border-b bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-700 border rounded-full p-2 dark:text-gray-200 hover:shadow-lg hover:shadow-purple-400 transition"
        >
          ← Back to Dashboard
        </button>

        {/* Title */}
        <h1 className="text-xl font-bold flex items-center gap-2">
          
          {saving && <span className="text-sm text-green-600 animate-pulse">Saving...</span>}
        </h1>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 hover:opacity-90 text-white rounded-lg font-medium transition"
          >
            {downloading ? "Generating..." : "Download PDF"}
          </button>
          <button
            onClick={saveResume}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 hover:opacity-90 text-white rounded-lg font-medium transition"
          >
            Save
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 hover:opacity-90 text-white rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu with bounce & scale effect */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          menuOpen ? "max-h-96 opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
        } bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t px-4 pb-4 space-y-2 transform origin-top`}
      >
        <button
          onClick={handleDownloadPDF}
          className="w-full text-left px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium transition transform hover:scale-105 hover:opacity-90"
        >
          {downloading ? "Generating..." : "Download PDF"}
        </button>
        <button
          onClick={saveResume}
          className="w-full text-left px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium transition transform hover:scale-105 hover:opacity-90"
        >
          Save
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium transition transform hover:scale-105 hover:opacity-90"
        >
          Logout
        </button>
      </div>
    </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ResumeForm data={resumeData} onChange={setResumeData} />
          </div>

          {/* Wrap Preview for PDF capture */}
          <div className="lg:sticky lg:top-24 lg:self-start bg-card shadow-lg rounded-lg p-4" ref={previewRef}>
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Builder;

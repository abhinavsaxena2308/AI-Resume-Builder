import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, getCurrentUser } from "@/integrations/firebase/client";
import { signOut } from "firebase/auth";
import EnhancedResumeForm from "@/components/EnhancedResumeForm";
import { resumeApi, API_BASE_URL } from "@/services/api";
import TemplateSelector from "@/components/ResumeTemplates/TemplateSelector";
import TemplateModern from "@/components/ResumeTemplates/TemplateModern";
import TemplateClassic from "@/components/ResumeTemplates/TemplateClassic";
import TemplateCreative from "@/components/ResumeTemplates/TemplateCreative";
import AiSuggestionsPopup from "@/components/AiSuggestionsPopup";
import {
  Menu, X, Sparkles, Save, Download, ArrowLeft, LogOut,
  CheckCircle2, Clock, Eye, EyeOff, ChevronRight, FileText,
  Loader2, LayoutTemplate, PenLine, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const Builder = () => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // "idle" | "saving" | "saved" | "error"
  const [downloading, setDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [userType, setUserType] = useState("");
  const [isSuggestionsPopupOpen, setIsSuggestionsPopupOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("form"); // "form" | "preview" on mobile
  const [showPreview, setShowPreview] = useState(false); // mobile preview toggle

  useEffect(() => {
    const savedTemplate = localStorage.getItem("selectedTemplate");
    if (savedTemplate) setSelectedTemplate(savedTemplate);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedTemplate", selectedTemplate);
  }, [selectedTemplate]);

  const initialResumeData = {
    personalInfo: { fullName: "", email: "", phone: "", location: "", linkedin: "", github: "" },
    summary: "",
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    skills: { frontend: [], backend: [], databases: [], cloud: [], tools: [], other: [] },
  };

  const [resumeData, setResumeData] = useState(initialResumeData);
  const lastSavedSnapshotRef = useRef(null);
  const savingRef = useRef(false);
  const serializedResumeData = useMemo(() => JSON.stringify(resumeData), [resumeData]);
  const navigate = useNavigate();
  const { id } = useParams();

  // Compute completeness score
  const completeness = useMemo(() => {
    const checks = [
      !!resumeData.personalInfo?.fullName,
      !!resumeData.personalInfo?.email,
      !!resumeData.personalInfo?.phone,
      !!resumeData.summary,
      resumeData.experience?.length > 0,
      resumeData.education?.length > 0,
      resumeData.projects?.length > 0,
      Object.values(resumeData.skills || {}).flat().length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [resumeData]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) { navigate("/auth"); return; }
      setUser(user);

      if (id) {
        try {
          const data = await resumeApi.getById(id);
          if (!data) {
            toast({ title: "Error", description: "Resume not found.", variant: "destructive" });
            setLoading(false); return;
          }
          if (data?.user_id && data.user_id !== user.uid) {
            toast({ title: "Access denied", description: "You don't have permission to access this resume.", variant: "destructive" });
            navigate("/dashboard"); return;
          }
          const loadedData = data.content || { ...initialResumeData };
          if (!loadedData.personalInfo) loadedData.personalInfo = { ...initialResumeData.personalInfo };
          if (!loadedData.summary) loadedData.summary = "";
          if (!loadedData.experience) loadedData.experience = [];
          if (!loadedData.education) loadedData.education = [];
          if (!loadedData.projects) loadedData.projects = [];
          if (!loadedData.certifications) loadedData.certifications = [];
          if (!loadedData.skills || Array.isArray(loadedData.skills)) {
            const newSkills = { ...initialResumeData.skills };
            if (Array.isArray(loadedData.skills)) newSkills.frontend = [...loadedData.skills];
            loadedData.skills = newSkills;
          }
          lastSavedSnapshotRef.current = JSON.stringify(loadedData);
          setResumeData(loadedData);
        } catch (error) {
          toast({ title: "Error", description: "Failed to load resume.", variant: "destructive" });
          console.error("Error loading resume:", error);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [id, navigate, toast]);

  const saveResume = useCallback(async ({ showToast = false, skipIfUnchanged = true } = {}) => {
    if (!id) return;
    if (skipIfUnchanged && lastSavedSnapshotRef.current === serializedResumeData) {
      if (showToast) toast({ title: "No changes", description: "Resume is already up to date." });
      return;
    }
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setSaveStatus("saving");
    try {
      const saveWithRetry = async (attempt = 0) => {
        try {
          await resumeApi.update(id, resumeData, { template: selectedTemplate, last_edited_section: "unknown" });
        } catch (error) {
          if (attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
            return saveWithRetry(attempt + 1);
          }
          throw error;
        }
      };
      await saveWithRetry();
      lastSavedSnapshotRef.current = serializedResumeData;
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
      if (showToast) toast({ title: "Saved!", description: "Resume saved successfully." });
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
      if (showToast) toast({ title: "Error", description: "Failed to save resume", variant: "destructive" });
      console.error("Save resume error:", error);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }, [resumeData, id, toast, serializedResumeData, selectedTemplate]);

  // Debounced auto-save
  useEffect(() => {
    if (!id) return;
    const timeout = setTimeout(() => {
      void saveResume({ showToast: false, skipIfUnchanged: true });
    }, 1500);
    return () => clearTimeout(timeout);
  }, [serializedResumeData, id, saveResume]);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    const url = `${API_BASE_URL}/api/generate-pdf`;
    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, template: selectedTemplate }),
      });
    } catch (error) {
      console.warn(`Failed to fetch from ${url}`, error);
    }
    if (!response) {
      setDownloading(false);
      toast({ title: "Error", description: "Unable to connect to PDF service. Ensure backend is running.", variant: "destructive" });
      return;
    }
    if (!response.ok) {
      setDownloading(false);
      const errorData = await response.json().catch(() => ({}));
      toast({ title: "Error", description: errorData.error || "Failed to generate PDF.", variant: "destructive" });
      return;
    }
    try {
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${resumeData.personalInfo.fullName || "Resume"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(objectUrl);
      document.body.removeChild(a);
      toast({ title: "Downloaded!", description: "PDF downloaded successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to download. Please try again.", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  const handleApplySuggestions = (section, content) => {
    switch (section) {
      case "summarySuggestion":
        setResumeData(prev => ({ ...prev, summary: content }));
        toast({ title: "Summary Applied", description: "AI summary has been applied to your resume." });
        break;
      case "recommendedSkills":
        const currentSkills = resumeData.skills.frontend || [];
        const newSkills = content.filter(skill => !currentSkills.includes(skill));
        if (newSkills.length > 0) {
          setResumeData(prev => ({ ...prev, skills: { ...prev.skills, frontend: [...currentSkills, ...newSkills] } }));
          toast({ title: "Skills Added", description: `${newSkills.length} new skills added.` });
        } else {
          toast({ title: "No New Skills", description: "All recommended skills are already present." });
        }
        break;
      default:
        toast({ title: "Not Implemented", description: `Applying ${section} is not yet supported.` });
    }
  };

  const isResumeComplete = () => {
    const { personalInfo, experience = [], education = [] } = resumeData;
    return personalInfo?.fullName && personalInfo?.email && experience.length > 0 && education.length > 0;
  };

  const SaveStatusBadge = () => {
    if (saveStatus === "saving") return (
      <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
        <Loader2 className="w-3 h-3 animate-spin" /> Saving…
      </span>
    );
    if (saveStatus === "saved") return (
      <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
        <CheckCircle2 className="w-3 h-3" /> Saved
      </span>
    );
    if (saveStatus === "error") return (
      <span className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium">
        <AlertCircle className="w-3 h-3" /> Error saving
      </span>
    );
    return (
      <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium">
        <Clock className="w-3 h-3" /> Auto-saving on
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-black dark:to-purple-950">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 rounded-full" />
          <div className="w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin absolute top-0" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading your resume…</p>
      </div>
    );
  }

  const currentTemplate = () => {
    if (selectedTemplate === "modern") return <TemplateModern {...resumeData} />;
    if (selectedTemplate === "classic") return <TemplateClassic {...resumeData} />;
    if (selectedTemplate === "creative") return <TemplateCreative {...resumeData} />;
    return <TemplateModern {...resumeData} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* AI Suggestions Popup */}
      <AiSuggestionsPopup
        isOpen={isSuggestionsPopupOpen}
        onClose={() => setIsSuggestionsPopupOpen(false)}
        resumeData={resumeData}
        onApplySuggestions={handleApplySuggestions}
      />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 gap-3 max-w-[1600px] mx-auto w-full">

          {/* Left: Back */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          {/* Center: Title + save badge */}
          <div className="flex flex-col items-center gap-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-500 shrink-0" />
              <h1 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[140px] sm:max-w-xs">
                {resumeData.personalInfo?.fullName || "Untitled Resume"}
              </h1>
            </div>
            <SaveStatusBadge />
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-2">
            {/* AI Suggestions */}
            <button
              onClick={() => setIsSuggestionsPopupOpen(true)}
              disabled={!isResumeComplete()}
              title={!isResumeComplete() ? "Fill name, email, experience & education first" : "Get AI Suggestions"}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-sm shadow-purple-500/20 hover:shadow-purple-500/40 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">AI Suggestions</span>
            </button>

            {/* Save manually */}
            <button
              onClick={() => saveResume({ showToast: true })}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">Save</span>
            </button>

            {/* Download PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm shadow-purple-500/20 hover:shadow-purple-500/40 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completeness}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </header>

      {/* ── MOBILE TAB BAR ── */}
      <div className="lg:hidden sticky top-[57px] z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="flex">
          <button
            onClick={() => setActivePanel("form")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${activePanel === "form" ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-500" : "text-gray-500 dark:text-gray-400"}`}
          >
            <PenLine className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => setActivePanel("preview")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all ${activePanel === "preview" ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-500" : "text-gray-500 dark:text-gray-400"}`}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button
            onClick={() => setIsSuggestionsPopupOpen(true)}
            disabled={!isResumeComplete()}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-violet-600 dark:text-violet-400 disabled:opacity-40 transition-all`}
          >
            <Sparkles className="w-4 h-4" /> AI
          </button>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full">

        {/* ── FORM PANEL ── */}
        <div className={`
          ${activePanel === "form" ? "flex" : "hidden"} lg:flex
          flex-col w-full lg:w-[520px] xl:w-[580px] shrink-0
          border-r border-gray-200/60 dark:border-gray-800/60
          bg-white dark:bg-gray-900
          overflow-y-auto
        `}>
          {/* Form panel header */}
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-5 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Resume Details</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">All changes auto-save every 1.5s</p>
              </div>
              {/* Completeness pill */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
                  <div className={`w-1.5 h-1.5 rounded-full ${completeness >= 80 ? "bg-emerald-500" : completeness >= 50 ? "bg-amber-500" : "bg-red-400"}`} />
                  {completeness}% complete
                </div>
              </div>
            </div>

            {/* Completeness bar in form panel */}
            <div className="mt-3 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${completeness >= 80 ? "bg-gradient-to-r from-emerald-400 to-green-500" : completeness >= 50 ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-gradient-to-r from-purple-500 to-pink-500"}`}
                animate={{ width: `${completeness}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Quick tips */}
            {completeness < 100 && (
              <div className="mt-2 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <ChevronRight className="w-3 h-3" />
                {!resumeData.personalInfo?.fullName ? "Add your full name • " : ""}
                {!resumeData.summary ? "Write a summary • " : ""}
                {!resumeData.experience?.length ? "Add experience • " : ""}
                {!resumeData.education?.length ? "Add education" : ""}
              </div>
            )}
          </div>

          {/* Form content */}
          <div className="flex-1 px-5 py-5">
            <EnhancedResumeForm
              data={resumeData}
              onChange={setResumeData}
              aiSuggestions={aiSuggestions}
              userType={userType}
            />
          </div>
        </div>

        {/* ── PREVIEW PANEL ── */}
        <div className={`
          ${activePanel === "preview" ? "flex" : "hidden"} lg:flex
          flex-col flex-1 min-w-0
          bg-gray-100 dark:bg-gray-950
          overflow-y-auto
        `}>
          {/* Preview panel header */}
          <div className="sticky top-0 z-10 bg-gray-100/95 dark:bg-gray-950/95 backdrop-blur-md px-5 pt-4 pb-3 border-b border-gray-200/60 dark:border-gray-800/60">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-purple-500" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Live Preview</h2>
                <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">Updates as you type</span>
              </div>
              {/* Template selector in header */}
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
              />
            </div>
          </div>

          {/* Preview content */}
          <div className="flex-1 p-4 md:p-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl shadow-gray-300/40 dark:shadow-black/40 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mx-auto" style={{ maxWidth: "794px" }}>
              {/* A4 ratio indicator */}
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                  {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Template · A4
                </span>
                <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                  <Eye className="w-3 h-3" /> Preview
                </div>
              </div>
              <div className="overflow-x-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTemplate}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentTemplate()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Download CTA at bottom of preview */}
            <div className="mt-6 mx-auto max-w-[794px]">
              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {downloading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF…</>
                ) : (
                  <><Download className="w-4 h-4" /> Download as PDF</>
                )}
              </motion.button>

              <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                PDF is generated server-side for perfect formatting
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;

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
import DownloadResume from "@/components/DownloadResume";
import AiSuggestionsPopup from "@/components/AiSuggestionsPopup";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Builder = () => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [userType, setUserType] = useState("");
  const [isSuggestionsPopupOpen, setIsSuggestionsPopupOpen] = useState(false);

  // Load selected template from localStorage
  useEffect(() => {
    const savedTemplate = localStorage.getItem("selectedTemplate");
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }
  }, []);

  // Save selected template to localStorage
  useEffect(() => {
    localStorage.setItem("selectedTemplate", selectedTemplate);
  }, [selectedTemplate]);

  const [menuOpen, setMenuOpen] = useState(false);
  
  // Initialize resume data with proper structure
  const initialResumeData = {
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
    projects: [],
    certifications: [],
    skills: {
      frontend: [],
      backend: [],
      databases: [],
      cloud: [],
      tools: [],
      other: []
    },
  };

  const [resumeData, setResumeData] = useState(initialResumeData);
  const lastSavedSnapshotRef = useRef(null);
  const savingRef = useRef(false);
  const serializedResumeData = useMemo(() => JSON.stringify(resumeData), [resumeData]);

  const navigate = useNavigate();
  const { id } = useParams();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Fetch user and resume
  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);

      if (id) {
        try {
          const data = await resumeApi.getById(id);
          
          if (!data) {
            toast({
              title: "Error",
              description: "Resume not found.",
              variant: "destructive"
            });
            setLoading(false);
            return;
          }
          
          // Ownership check: users can only view/edit their own resumes
          if (data?.user_id && data.user_id !== user.uid) {
            toast({
              title: "Access denied",
              description: "You don't have permission to access this resume.",
              variant: "destructive",
            });
            navigate("/dashboard");
            return;
          }
          // Ensure the loaded data has the correct structure
          const loadedData = data.content || { ...initialResumeData };
          
          // Make sure all sections exist
          if (!loadedData.personalInfo) loadedData.personalInfo = { ...initialResumeData.personalInfo };
          if (!loadedData.summary) loadedData.summary = "";
          if (!loadedData.experience) loadedData.experience = [];
          if (!loadedData.education) loadedData.education = [];
          if (!loadedData.projects) loadedData.projects = [];
          if (!loadedData.certifications) loadedData.certifications = [];
          
          // Make sure skills are in the correct format
          if (!loadedData.skills || Array.isArray(loadedData.skills)) {
            // Convert old skills format to new grouped format
            const newSkills = { ...initialResumeData.skills };
            
            // If it was an array, put all skills in the first category
            if (Array.isArray(loadedData.skills)) {
              newSkills.frontend = [...loadedData.skills];
            }
            
            loadedData.skills = newSkills;
          }
          lastSavedSnapshotRef.current = JSON.stringify(loadedData);
          setResumeData(loadedData);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load resume.",
            variant: "destructive"
          });
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
      if (showToast) {
        toast({
          title: "No changes",
          description: "Resume is already up to date.",
        });
      }
      return;
    }
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      const saveWithRetry = async (attempt = 0) => {
        try {
          await resumeApi.update(id, resumeData, { 
            template: selectedTemplate,
            last_edited_section: "unknown" // Could track this
          });
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
      
      if (showToast) {
        toast({
          title: "Success",
          description: "Resume saved successfully.",
        });
      }
    } catch (error) {
      if (showToast) {
        toast({
          title: "Error",
          description: "Failed to save resume",
          variant: "destructive",
        });
      }
      console.error("Save resume error:", error);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }, [resumeData, id, toast, serializedResumeData]);

  // Debounced auto-save (reduces writes + avoids toast spam)
  useEffect(() => {
    if (!id) return;
    const timeout = setTimeout(() => {
      void saveResume({ showToast: false, skipIfUnchanged: true });
    }, 1200);
    return () => clearTimeout(timeout);
  }, [serializedResumeData, id, saveResume]);

  // PDF download functionality using backend
  const handleDownloadPDF = async () => {
    setDownloading(true);

    const url = `${API_BASE_URL}/api/generate-pdf`;

    let response;
    let success = false;

    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, template: selectedTemplate }),
      });

      if (response.ok) {
        success = true;
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${url}`, error);
    }

    if (!response) {
      setDownloading(false);
      toast({
        title: "Error",
        description: "Unable to connect to PDF generation service. Please ensure the backend server is running.",
        variant: "destructive"
      });
      return;
    }

    if (!response.ok) {
      setDownloading(false);
      const errorData = await response.json().catch(() => ({}));
      toast({
        title: "Error",
        description: errorData.error || "Failed to generate PDF from both production and local servers.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a blob from the response and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personalInfo.fullName || "Resume"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Success",
        description: "PDF downloaded successfully!"
      });
    } catch (error) {
      console.error("PDF download failed:", error);
      toast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleApplySuggestions = (section, content) => {
    switch (section) {
      case "summarySuggestion":
        setResumeData(prev => ({
          ...prev,
          summary: content,
        }));
        toast({
          title: "Summary Updated",
          description: "Suggested summary has been applied to your resume.",
        });
        break;
      case "recommendedSkills":
        // Add all recommended skills that aren't already present
        const currentSkills = resumeData.skills.frontend || [];
        const newSkills = content.filter(skill => !currentSkills.includes(skill));
        if (newSkills.length > 0) {
          setResumeData(prev => ({
            ...prev,
            skills: {
              ...prev.skills,
              frontend: [...currentSkills, ...newSkills],
            }
          }));
          toast({
            title: "Skills Added",
            description: `${newSkills.length} new skills added to your resume.`,
          });
        } else {
          toast({
            title: "No New Skills",
            description: "All recommended skills are already in your resume.",
          });
        }
        break;
      default:
        toast({
          title: "Not Implemented",
          description: `Applying ${section} is not yet supported.`,
        });
    }
  };

  // Check if resume is complete before allowing AI suggestions
  const isResumeComplete = () => {
    const { personalInfo, experience = [], education = [] } = resumeData;
    return (
      personalInfo?.fullName &&
      personalInfo?.email &&
      experience.length > 0 &&
      education.length > 0
    );
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
      {/* AI Suggestions Popup */}
      <AiSuggestionsPopup
        isOpen={isSuggestionsPopupOpen}
        onClose={() => setIsSuggestionsPopupOpen(false)}
        resumeData={resumeData}
        onApplySuggestions={handleApplySuggestions}
      />
      
      <header className="border-b border-border bg-white/50 dark:bg-black/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-700 border rounded-full p-2 dark:text-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-purple-400 dark:hover:shadow-purple-600 transition"
        >
          ← Back to Dashboard
        </button>

        {/* Get Suggestions Button */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Button
            onClick={() => setIsSuggestionsPopupOpen(true)}
            disabled={!isResumeComplete()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Get Suggestions
          </Button>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-110 hover:opacity-90 text-white rounded-lg font-medium transition"
          >
            {downloading ? "Generating..." : "Download PDF"}
          </button>
          <button
            onClick={() => saveResume({ showToast: true })}
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
        } bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t border-border px-4 pb-4 space-y-2 transform origin-top`}
      >
        <div className="py-2">
          <Button
            onClick={() => setIsSuggestionsPopupOpen(true)}
            disabled={!isResumeComplete()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Get Suggestions
          </Button>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="w-full text-left px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium transition transform hover:scale-105 hover:opacity-90"
        >
          {downloading ? "Generating..." : "Download PDF"}
        </button>
        <button
          onClick={() => saveResume({ showToast: true })}
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
            <EnhancedResumeForm 
              data={resumeData} 
              onChange={setResumeData} 
              aiSuggestions={aiSuggestions}
              userType={userType}
            />
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start bg-card shadow-lg rounded-lg p-4 border border-border">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelect={setSelectedTemplate}
            />
            {selectedTemplate === "modern" && <TemplateModern {...resumeData} />}
            {selectedTemplate === "classic" && <TemplateClassic {...resumeData} />}
            {selectedTemplate === "creative" && <TemplateCreative {...resumeData} />}

            {/* Download Button */}
            <DownloadResume
              resumeData={resumeData}
              selectedTemplate={selectedTemplate}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Builder;

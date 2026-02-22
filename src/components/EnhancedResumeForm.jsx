import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Sparkles, Trash2, Loader2, ChevronDown, ChevronUp,
  User, Briefcase, GraduationCap, FolderGit2, Award, Code2,
  KeyRound, Mail, Phone, MapPin, Linkedin, Github, Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AiSuggestionsPopup from "@/components/AiSuggestionsPopup";
import { motion, AnimatePresence } from "framer-motion";

/* ── Reusable collapsible section wrapper ── */
const Section = ({ icon: Icon, title, description, badge, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 shrink-0">
            <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
              {badge !== undefined && badge !== null && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${badge > 0 ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
                  {badge}
                </span>
              )}
            </div>
            {description && <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{description}</p>}
          </div>
        </div>
        <div className="shrink-0 ml-2 text-gray-400 group-hover:text-purple-500 transition-colors">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-gray-100 dark:border-gray-800 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Field row component ── */
const FieldRow = ({ label, icon: Icon, children, className = "" }) => (
  <div className={`space-y-1.5 ${className}`}>
    <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
      {Icon && <Icon className="w-3 h-3" />} {label}
    </Label>
    {children}
  </div>
);

const inputCls = "h-9 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-500 focus:ring-purple-400/20 rounded-lg placeholder:text-gray-300 dark:placeholder:text-gray-600 transition-colors";
const textareaCls = "text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-500 focus:ring-purple-400/20 rounded-lg placeholder:text-gray-300 dark:placeholder:text-gray-600 transition-colors resize-none";

const EnhancedResumeForm = ({ data, onChange, aiSuggestions, userType }) => {
  const [newSkill, setNewSkill] = useState({ name: "", category: "frontend" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState({});
  const { toast } = useToast();

  const skillCategories = useMemo(() => {
    if (userType === "Coder") return [
      { id: "frontend", name: "Frontend" }, { id: "backend", name: "Backend" },
      { id: "databases", name: "Databases" }, { id: "cloud", name: "Cloud & DevOps" },
      { id: "tools", name: "Tools & Testing" }, { id: "other", name: "Other" }
    ];
    if (userType === "Designer") return [
      { id: "design", name: "Design Tools" }, { id: "prototyping", name: "Prototyping" },
      { id: "frontend", name: "Frontend Dev" }, { id: "userResearch", name: "User Research" },
      { id: "other", name: "Other" }
    ];
    if (userType === "Researcher") return [
      { id: "research", name: "Research Methods" }, { id: "dataAnalysis", name: "Data Analysis" },
      { id: "writing", name: "Academic Writing" }, { id: "presentation", name: "Presentation" },
      { id: "other", name: "Other" }
    ];
    return [
      { id: "technical", name: "Technical Skills" }, { id: "soft", name: "Soft Skills" },
      { id: "tools", name: "Tools" }, { id: "other", name: "Other" }
    ];
  }, [userType]);

  const initializeSkills = useCallback((skillsData) => {
    if (!skillsData) skillsData = [];
    if (typeof skillsData === "object" && !Array.isArray(skillsData)) {
      const hasCategories = skillCategories.some(cat => skillsData.hasOwnProperty(cat.id));
      if (hasCategories) {
        const validated = { ...skillsData };
        skillCategories.forEach(cat => { if (!validated.hasOwnProperty(cat.id)) validated[cat.id] = []; });
        return validated;
      }
    }
    if (Array.isArray(skillsData)) {
      const newSkills = {};
      skillCategories.forEach(cat => { newSkills[cat.id] = []; });
      if (skillCategories.length > 0 && skillsData.length > 0) newSkills[skillCategories[0].id] = [...skillsData];
      return newSkills;
    }
    const newSkills = {};
    skillCategories.forEach(cat => { newSkills[cat.id] = []; });
    return newSkills;
  }, [skillCategories]);

  const ensureDataStructure = useCallback((resumeData) => {
    const d = { ...resumeData };
    if (!d.personalInfo) d.personalInfo = { fullName: "", email: "", phone: "", location: "", linkedin: "", github: "" };
    if (!d.summary) d.summary = "";
    if (!d.experience) d.experience = [];
    if (!d.education) d.education = [];
    if (!d.projects) d.projects = [];
    if (!d.certifications) d.certifications = [];
    d.skills = initializeSkills(d.skills);
    return d;
  }, [initializeSkills]);

  const sd = useMemo(() => ensureDataStructure(data), [data, ensureDataStructure]);

  // ── Handlers ──
  const handlePI = (field, value) => onChange({ ...sd, personalInfo: { ...sd.personalInfo, [field]: value } });

  const addExperience = () => onChange({ ...sd, experience: [...sd.experience, { id: crypto.randomUUID(), title: "", company: "", duration: "", description: "" }] });
  const updateExperience = (id, field, value) => onChange({ ...sd, experience: sd.experience.map(e => e.id === id ? { ...e, [field]: value } : e) });
  const removeExperience = (id) => onChange({ ...sd, experience: sd.experience.filter(e => e.id !== id) });

  const addEducation = () => onChange({ ...sd, education: [...sd.education, { id: crypto.randomUUID(), degree: "", institution: "", year: "" }] });
  const updateEducation = (id, field, value) => onChange({ ...sd, education: sd.education.map(e => e.id === id ? { ...e, [field]: value } : e) });
  const removeEducation = (id) => onChange({ ...sd, education: sd.education.filter(e => e.id !== id) });

  const addProject = () => onChange({ ...sd, projects: [...sd.projects, { id: crypto.randomUUID(), name: "", description: "", technologies: "", link: "" }] });
  const updateProject = (id, field, value) => onChange({ ...sd, projects: sd.projects.map(p => p.id === id ? { ...p, [field]: value } : p) });
  const removeProject = (id) => onChange({ ...sd, projects: sd.projects.filter(p => p.id !== id) });

  const addCertification = () => onChange({ ...sd, certifications: [...sd.certifications, { id: crypto.randomUUID(), name: "", issuer: "", date: "", link: "" }] });
  const updateCertification = (id, field, value) => onChange({ ...sd, certifications: sd.certifications.map(c => c.id === id ? { ...c, [field]: value } : c) });
  const removeCertification = (id) => onChange({ ...sd, certifications: sd.certifications.filter(c => c.id !== id) });

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    const categorySkills = sd.skills[newSkill.category] || [];
    if (categorySkills.includes(newSkill.name.trim())) {
      toast({ title: "Duplicate Skill", description: "This skill already exists in that category.", variant: "destructive" });
      return;
    }
    onChange({ ...sd, skills: { ...sd.skills, [newSkill.category]: [...categorySkills, newSkill.name.trim()] } });
    setNewSkill(prev => ({ ...prev, name: "" }));
  };
  const removeSkill = (category, skill) => onChange({ ...sd, skills: { ...sd.skills, [category]: sd.skills[category].filter(s => s !== skill) } });

  const handleAcceptSuggestion = (section, field, suggestionText, itemId = null) => {
    if (section === "summary" && field === "summarySuggestion") {
      onChange({ ...sd, summary: suggestionText });
      toast({ title: "Applied", description: "AI summary suggestion applied." });
    } else if (section === "skills" && field === "recommendedSkills" && Array.isArray(suggestionText)) {
      const updatedSkills = { ...sd.skills };
      suggestionText.forEach((skill, i) => {
        const cat = skillCategories[i % skillCategories.length].id;
        if (!updatedSkills[cat].includes(skill)) updatedSkills[cat] = [...updatedSkills[cat], skill];
      });
      onChange({ ...sd, skills: updatedSkills });
      toast({ title: "Skills Added", description: `${suggestionText.length} skills added.` });
    }
    const key = `${section}-${field}-${itemId || "general"}`;
    setActiveSuggestions(prev => ({ ...prev, [key]: false }));
  };

  const handleDiscardSuggestion = (section, field, itemId = null) => {
    const key = `${section}-${field}-${itemId || "general"}`;
    setActiveSuggestions(prev => ({ ...prev, [key]: false }));
    toast({ title: "Dismissed", description: "AI suggestion dismissed." });
  };

  const toggleSuggestion = (section, field, itemId = null) => {
    const key = `${section}-${field}-${itemId || "general"}`;
    setActiveSuggestions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const generateSummary = async () => {
    if (!sd.personalInfo?.fullName || !sd.experience?.length) {
      toast({ title: "Missing info", description: "Add your name and at least one experience first.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: sd.personalInfo.fullName, experience: sd.experience, skills: Object.values(sd.skills).flat() }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to generate summary");
      onChange({ ...sd, summary: result.summary });
      toast({ title: "Generated!", description: "AI summary has been created." });
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to generate summary", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const getSuggestion = useCallback((section, field, itemId = null) => {
    if (!aiSuggestions) return null;
    if (section === "summary" && field === "summarySuggestion") return aiSuggestions.summarySuggestion;
    if (section === "skills" && field === "recommendedSkills") return aiSuggestions.recommendedSkills;
    if (section === "experience" && field === "enhancedBullets") return aiSuggestions.enhancedBullets?.experience;
    if (section === "projects" && field === "enhancedBullets") return aiSuggestions.enhancedBullets?.projects;
    return null;
  }, [aiSuggestions]);

  const totalSkills = Object.values(sd.skills).flat().length;

  return (
    <div className="space-y-4">

      {/* ── PERSONAL INFO ── */}
      <Section icon={User} title="Personal Information" description="Contact details & social links">
        <div className="grid grid-cols-2 gap-3">
          <FieldRow label="Full Name" icon={User} className="col-span-2">
            <Input value={sd.personalInfo.fullName} onChange={e => handlePI("fullName", e.target.value)} placeholder="Jane Doe" className={inputCls} />
          </FieldRow>
          <FieldRow label="Email" icon={Mail}>
            <Input value={sd.personalInfo.email} onChange={e => handlePI("email", e.target.value)} placeholder="jane@example.com" type="email" className={inputCls} />
          </FieldRow>
          <FieldRow label="Phone" icon={Phone}>
            <Input value={sd.personalInfo.phone} onChange={e => handlePI("phone", e.target.value)} placeholder="+1 234 567 8900" className={inputCls} />
          </FieldRow>
          <FieldRow label="Location" icon={MapPin}>
            <Input value={sd.personalInfo.location} onChange={e => handlePI("location", e.target.value)} placeholder="New York, USA" className={inputCls} />
          </FieldRow>
          <FieldRow label="LinkedIn" icon={Linkedin}>
            <Input value={sd.personalInfo.linkedin} onChange={e => handlePI("linkedin", e.target.value)} placeholder="linkedin.com/in/jane" className={inputCls} />
          </FieldRow>
          <FieldRow label="GitHub" icon={Github}>
            <Input value={sd.personalInfo.github} onChange={e => handlePI("github", e.target.value)} placeholder="github.com/jane" className={inputCls} />
          </FieldRow>
        </div>
      </Section>

      {/* ── SUMMARY ── */}
      <Section icon={KeyRound} title="Professional Summary" description="AI-powered career overview">
        <div className="space-y-3">
          <Textarea
            value={sd.summary}
            onChange={e => onChange({ ...sd, summary: e.target.value })}
            placeholder="A passionate software engineer with 5+ years of experience building scalable web applications…"
            rows={4}
            className={textareaCls}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500">{sd.summary?.length || 0} characters</span>
            <Button
              onClick={generateSummary}
              disabled={isGenerating}
              size="sm"
              className="bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90 text-xs h-8 px-3 gap-1.5 shadow-sm shadow-purple-500/20"
            >
              {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Generate with AI
            </Button>
          </div>
        </div>
      </Section>

      {/* ── EXPERIENCE ── */}
      <Section icon={Briefcase} title="Work Experience" description="Your professional background" badge={sd.experience.length}>
        <div className="space-y-3">
          {sd.experience.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <Briefcase className="w-6 h-6 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-400 dark:text-gray-500">No experience added yet</p>
            </div>
          )}
          <AnimatePresence>
            {sd.experience.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-md">
                    #{idx + 1}
                  </span>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="Job Title" className="col-span-2 sm:col-span-1">
                    <Input value={exp.title} onChange={e => updateExperience(exp.id, "title", e.target.value)} placeholder="Software Engineer" className={inputCls} />
                  </FieldRow>
                  <FieldRow label="Company">
                    <Input value={exp.company} onChange={e => updateExperience(exp.id, "company", e.target.value)} placeholder="Google" className={inputCls} />
                  </FieldRow>
                  <FieldRow label="Duration" className="col-span-2">
                    <Input value={exp.duration} onChange={e => updateExperience(exp.id, "duration", e.target.value)} placeholder="Jan 2022 – Present" className={inputCls} />
                  </FieldRow>
                  <FieldRow label="Description / Responsibilities" className="col-span-2">
                    <Textarea
                      value={exp.description}
                      onChange={e => updateExperience(exp.id, "description", e.target.value)}
                      placeholder="• Built and maintained REST APIs serving 1M+ users&#10;• Led migration to microservices reducing latency by 40%"
                      rows={3}
                      className={textareaCls}
                    />
                  </FieldRow>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <Button onClick={addExperience} size="sm" variant="outline" className="w-full border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all gap-1.5">
            <Plus className="h-4 w-4" /> Add Experience
          </Button>
        </div>
      </Section>

      {/* ── EDUCATION ── */}
      <Section icon={GraduationCap} title="Education" description="Academic background" badge={sd.education.length}>
        <div className="space-y-3">
          {sd.education.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <GraduationCap className="w-6 h-6 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-400 dark:text-gray-500">No education added yet</p>
            </div>
          )}
          <AnimatePresence>
            {sd.education.map((edu, idx) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-md">#{idx + 1}</span>
                  <button onClick={() => removeEducation(edu.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="Degree / Qualification" className="col-span-2 sm:col-span-1">
                    <Input value={edu.degree} onChange={e => updateEducation(edu.id, "degree", e.target.value)} placeholder="B.S. Computer Science" className={inputCls} />
                  </FieldRow>
                  <FieldRow label="Institution">
                    <Input value={edu.institution} onChange={e => updateEducation(edu.id, "institution", e.target.value)} placeholder="MIT" className={inputCls} />
                  </FieldRow>
                  <FieldRow label="Year / Duration" className="col-span-2">
                    <Input value={edu.year} onChange={e => updateEducation(edu.id, "year", e.target.value)} placeholder="2018 – 2022" className={inputCls} />
                  </FieldRow>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <Button onClick={addEducation} size="sm" variant="outline" className="w-full border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all gap-1.5">
            <Plus className="h-4 w-4" /> Add Education
          </Button>
        </div>
      </Section>

      {/* ── PROJECTS ── */}
      <Section icon={FolderGit2} title="Projects" description="Notable work & side projects" badge={sd.projects.length} defaultOpen={false}>
        <div className="space-y-3">
          {sd.projects.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <FolderGit2 className="w-6 h-6 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-400 dark:text-gray-500">No projects added yet</p>
            </div>
          )}
          <AnimatePresence>
            {sd.projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-md">#{idx + 1}</span>
                  <button onClick={() => removeProject(project.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="Project Name" className="col-span-2 sm:col-span-1">
                    <Input value={project.name} onChange={e => updateProject(project.id, "name", e.target.value)} placeholder="My Awesome Project" className={inputCls} />
                  </FieldRow>
                  <FieldRow label="Technologies">
                    <Input value={project.technologies} onChange={e => updateProject(project.id, "technologies", e.target.value)} placeholder="React, Node.js, AWS" className={inputCls} />
                  </FieldRow>
                  <FieldRow label="Link / URL" className="col-span-2">
                    <Input value={project.link} onChange={e => updateProject(project.id, "link", e.target.value)} placeholder="https://github.com/..." className={inputCls} />
                  </FieldRow>
                  <FieldRow label="Description" className="col-span-2">
                    <Textarea value={project.description} onChange={e => updateProject(project.id, "description", e.target.value)} placeholder="Built a full-stack app that…" rows={3} className={textareaCls} />
                  </FieldRow>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <Button onClick={addProject} size="sm" variant="outline" className="w-full border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all gap-1.5">
            <Plus className="h-4 w-4" /> Add Project
          </Button>
        </div>
      </Section>

      {/* ── CERTIFICATIONS ── */}
      <Section icon={Award} title="Certifications" description="Professional certifications & courses" badge={sd.certifications.length} defaultOpen={false}>
        <div className="space-y-3">
          {sd.certifications.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <Award className="w-6 h-6 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-400 dark:text-gray-500">No certifications added yet</p>
            </div>
          )}
          <AnimatePresence>
            {sd.certifications.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-md">#{idx + 1}</span>
                  <button onClick={() => removeCertification(cert.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="Certification Name" className="col-span-2 sm:col-span-1">
                    <Input value={cert.name} onChange={e => updateCertification(cert.id, "name", e.target.value)} placeholder="AWS Solutions Architect" className={inputCls} />
                  </FieldRow>
                  <FieldRow label="Issuing Organization">
                    <Input value={cert.issuer} onChange={e => updateCertification(cert.id, "issuer", e.target.value)} placeholder="Amazon Web Services" className={inputCls} />
                  </FieldRow>
                  <FieldRow label="Date">
                    <Input value={cert.date} onChange={e => updateCertification(cert.id, "date", e.target.value)} placeholder="March 2024" className={inputCls} />
                  </FieldRow>
                  <FieldRow label="Credential Link" className="col-span-2">
                    <Input value={cert.link} onChange={e => updateCertification(cert.id, "link", e.target.value)} placeholder="https://credentials.example.com/..." className={inputCls} />
                  </FieldRow>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <Button onClick={addCertification} size="sm" variant="outline" className="w-full border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all gap-1.5">
            <Plus className="h-4 w-4" /> Add Certification
          </Button>
        </div>
      </Section>

      {/* ── SKILLS ── */}
      <Section icon={Code2} title="Skills" description="Technical & soft skills by category" badge={totalSkills}>
        <div className="space-y-4">
          {/* Add skill input */}
          <div className="flex gap-2">
            <Input
              value={newSkill.name}
              onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())}
              placeholder="Type a skill and press Enter…"
              className={`flex-1 ${inputCls}`}
            />
            <select
              value={newSkill.category}
              onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
              className="text-sm h-9 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400"
            >
              {skillCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <Button onClick={addSkill} size="sm" className="h-9 w-9 p-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 shadow-sm shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">Press <kbd className="px-1 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-xs font-mono bg-gray-100 dark:bg-gray-800">Enter</kbd> to add quickly</p>

          {/* Skills grouped by category */}
          <div className="space-y-3">
            {skillCategories.map(cat => {
              const catSkills = sd.skills[cat.id] || [];
              if (catSkills.length === 0) return null;
              return (
                <div key={cat.id} className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{cat.name}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {catSkills.map((skill, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-800 group"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(cat.id, skill)}
                          className="text-purple-400 hover:text-red-500 transition-colors ml-0.5"
                        >
                          ×
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>
              );
            })}
            {totalSkills === 0 && (
              <div className="text-center py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <Code2 className="w-5 h-5 mx-auto mb-1 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-400 dark:text-gray-500">Start typing a skill above</p>
              </div>
            )}
          </div>
        </div>
      </Section>

    </div>
  );
};

export default EnhancedResumeForm;

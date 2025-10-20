import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import AiSuggestionsPopup from "@/components/AiSuggestionsPopup";

const EnhancedResumeForm = ({ data, onChange, aiSuggestions, userType }) => {
  const [newSkill, setNewSkill] = useState({ name: "", category: "frontend" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState({}); // Track which suggestions are active
  const { toast } = useToast();
  const { theme } = useTheme();

  // Debugging: Log when aiSuggestions change
  useEffect(() => {
    console.log("AI Suggestions updated:", aiSuggestions);
  }, [aiSuggestions]);

  // Debugging: Log when data changes
  useEffect(() => {
    console.log("Resume data updated:", data);
    console.log("Skills in data:", data.skills);
  }, [data]);

  // Define skill categories based on user type
  const getSkillCategories = () => {
    if (userType === "Coder") {
      return [
        { id: "frontend", name: "Frontend" },
        { id: "backend", name: "Backend" },
        { id: "databases", name: "Databases" },
        { id: "cloud", name: "Cloud & DevOps" },
        { id: "tools", name: "Tools & Testing" },
        { id: "other", name: "Other" }
      ];
    } else if (userType === "Designer") {
      return [
        { id: "design", name: "Design Tools" },
        { id: "prototyping", name: "Prototyping" },
        { id: "frontend", name: "Frontend Development" },
        { id: "userResearch", name: "User Research" },
        { id: "other", name: "Other" }
      ];
    } else if (userType === "Researcher") {
      return [
        { id: "research", name: "Research Methods" },
        { id: "dataAnalysis", name: "Data Analysis" },
        { id: "writing", name: "Academic Writing" },
        { id: "presentation", name: "Presentation" },
        { id: "other", name: "Other" }
      ];
    } else {
      // Default for Student and Other
      return [
        { id: "technical", name: "Technical Skills" },
        { id: "soft", name: "Soft Skills" },
        { id: "tools", name: "Tools" },
        { id: "other", name: "Other" }
      ];
    }
  };

  // Initialize skills structure if it doesn't exist or is in old format
  const initializeSkills = (skillsData) => {
    // Handle case where skillsData is undefined or null
    if (!skillsData) {
      skillsData = [];
    }
    
    // Check if skills is already in the new grouped format
    if (typeof skillsData === 'object' && !Array.isArray(skillsData)) {
      // Check if it has the expected category keys
      const categories = getSkillCategories();
      const hasCategories = categories.some(cat => skillsData.hasOwnProperty(cat.id));
      if (hasCategories) {
        // Ensure all categories exist even if empty
        const validatedSkills = { ...skillsData };
        categories.forEach(category => {
          if (!validatedSkills.hasOwnProperty(category.id)) {
            validatedSkills[category.id] = [];
          }
        });
        return validatedSkills;
      }
    }
    
    // If it's an array (old format) or doesn't have categories, convert it
    if (Array.isArray(skillsData)) {
      // Convert old array format to new grouped format
      const categories = getSkillCategories();
      const newSkills = {};
      categories.forEach(category => {
        newSkills[category.id] = [];
      });
      // Put all existing skills in the first category
      if (categories.length > 0 && skillsData.length > 0) {
        newSkills[categories[0].id] = [...skillsData];
      }
      return newSkills;
    }
    
    // If it's not an array and not in the correct format, initialize empty structure
    const categories = getSkillCategories();
    const newSkills = {};
    categories.forEach(category => {
      newSkills[category.id] = [];
    });
    return newSkills;
  };

  // Ensure data has the correct structure
  const ensureDataStructure = (resumeData) => {
    const updatedData = { ...resumeData };
    
    // Ensure all required sections exist with proper defaults
    if (!updatedData.personalInfo) {
      updatedData.personalInfo = {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: ""
      };
    }
    
    if (!updatedData.summary) {
      updatedData.summary = "";
    }
    
    if (!updatedData.experience) {
      updatedData.experience = [];
    }
    
    if (!updatedData.education) {
      updatedData.education = [];
    }
    
    if (!updatedData.projects) {
      updatedData.projects = [];
    }
    
    if (!updatedData.certifications) {
      updatedData.certifications = [];
    }
    
    // Ensure skills are in the correct format
    updatedData.skills = initializeSkills(updatedData.skills);
    
    return updatedData;
  };

  // Get the properly structured data
  const structuredData = ensureDataStructure(data);

  const handlePersonalInfoChange = (field, value) => {
    onChange({
      ...structuredData,
      personalInfo: { ...structuredData.personalInfo, [field]: value },
    });
  };

  const addExperience = () => {
    onChange({
      ...structuredData,
      experience: [
        ...structuredData.experience,
        {
          id: crypto.randomUUID(),
          title: "",
          company: "",
          duration: "",
          description: "",
        },
      ],
    });
  };

  const updateExperience = (id, field, value) => {
    onChange({
      ...structuredData,
      experience: structuredData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id) => {
    onChange({
      ...structuredData,
      experience: structuredData.experience.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    onChange({
      ...structuredData,
      education: [
        ...structuredData.education,
        {
          id: crypto.randomUUID(),
          degree: "",
          institution: "",
          year: "",
        },
      ],
    });
  };

  const updateEducation = (id, field, value) => {
    onChange({
      ...structuredData,
      education: structuredData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id) => {
    onChange({
      ...structuredData,
      education: structuredData.education.filter((edu) => edu.id !== id),
    });
  };

  // Projects section
  const addProject = () => {
    onChange({
      ...structuredData,
      projects: [
        ...structuredData.projects,
        {
          id: crypto.randomUUID(),
          name: "",
          description: "",
          technologies: "",
          link: "",
        },
      ],
    });
  };

  const updateProject = (id, field, value) => {
    onChange({
      ...structuredData,
      projects: structuredData.projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      ),
    });
  };

  const removeProject = (id) => {
    onChange({
      ...structuredData,
      projects: structuredData.projects.filter((project) => project.id !== id),
    });
  };

  // Certifications section
  const addCertification = () => {
    onChange({
      ...structuredData,
      certifications: [
        ...structuredData.certifications,
        {
          id: crypto.randomUUID(),
          name: "",
          issuer: "",
          date: "",
          link: "",
        },
      ],
    });
  };

  const updateCertification = (id, field, value) => {
    onChange({
      ...structuredData,
      certifications: structuredData.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  const removeCertification = (id) => {
    onChange({
      ...structuredData,
      certifications: structuredData.certifications.filter((cert) => cert.id !== id),
    });
  };

  // Skills section
  const addSkill = () => {
    console.log("Adding skill:", newSkill);
    if (newSkill.name.trim()) {
      const categorySkills = structuredData.skills[newSkill.category] || [];
      // Check if skill already exists in this category to prevent duplicates
      if (!categorySkills.includes(newSkill.name.trim())) {
        const updatedSkills = {
          ...structuredData.skills,
          [newSkill.category]: [...categorySkills, newSkill.name.trim()],
        };
        console.log("Updated skills:", updatedSkills);
        onChange({
          ...structuredData,
          skills: updatedSkills,
        });
        setNewSkill({ name: "", category: "frontend" });
      } else {
        // Skill already exists, show a toast or handle accordingly
        toast({
          title: "Duplicate Skill",
          description: "This skill already exists in the selected category.",
          variant: "destructive",
        });
      }
    }
  };

  const removeSkill = (category, skill) => {
    onChange({
      ...structuredData,
      skills: {
        ...structuredData.skills,
        [category]: structuredData.skills[category].filter((s) => s !== skill),
      },
    });
  };

  // Handle AI suggestion actions
  const handleAcceptSuggestion = (section, field, suggestionText, itemId = null) => {
    console.log("Accepting suggestion:", section, field, suggestionText);
    // Apply the suggestion
    if (section === "summary" && field === "summarySuggestion") {
      onChange({ ...structuredData, summary: suggestionText });
      toast({
        title: "Suggestion Applied",
        description: "AI summary suggestion has been applied to your resume.",
      });
    } else if (section === "skills" && field === "recommendedSkills" && Array.isArray(suggestionText)) {
      // For grouped skills, we'll distribute them based on user type
      const categories = getSkillCategories();
      const updatedSkills = { ...structuredData.skills };
      
      suggestionText.forEach((skill, index) => {
        const categoryIndex = index % categories.length;
        const category = categories[categoryIndex].id;
        if (!updatedSkills[category].includes(skill)) {
          updatedSkills[category] = [...updatedSkills[category], skill];
        }
      });
      
      onChange({
        ...structuredData,
        skills: updatedSkills,
      });
      
      toast({
        title: "Skills Added",
        description: `${suggestionText.length} new skills added to your resume.`,
      });
    }
    
    // Close the suggestion popup
    const suggestionKey = `${section}-${field}-${itemId || 'general'}`;
    setActiveSuggestions(prev => ({
      ...prev,
      [suggestionKey]: false
    }));
  };

  const handleDiscardSuggestion = (section, field, itemId = null) => {
    console.log("Discarding suggestion:", section, field);
    
    // Close the suggestion popup
    const suggestionKey = `${section}-${field}-${itemId || 'general'}`;
    setActiveSuggestions(prev => ({
      ...prev,
      [suggestionKey]: false
    }));
    
    toast({
      title: "Suggestion Discarded",
      description: "AI suggestion has been dismissed.",
    });
  };

  const handleEditSuggestion = (suggestionText) => {
    // For now, we'll just show a toast
    toast({
      title: "Edit Suggestion",
      description: "In a full implementation, this would open an editor with the suggestion.",
    });
  };

  // Toggle suggestion visibility
  const toggleSuggestion = (section, field, itemId = null) => {
    const suggestionKey = `${section}-${field}-${itemId || 'general'}`;
    setActiveSuggestions(prev => ({
      ...prev,
      [suggestionKey]: !prev[suggestionKey]
    }));
  };

  // ✅ UPDATED FUNCTION: Calls your Express backend instead of Supabase Edge Function
  const generateSummary = async () => {
    if (!structuredData.personalInfo?.fullName || !structuredData.experience || structuredData.experience.length === 0) {
      toast({
        title: "Missing information",
        description: "Please add your name and at least one work experience first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: structuredData.personalInfo.fullName,
          experience: structuredData.experience,
          skills: Object.values(structuredData.skills).flat(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate summary");
      }

      onChange({
        ...structuredData,
        summary: result.summary,
      });

      toast({
        title: "Summary generated!",
        description: "Your professional summary has been created by AI.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Get suggestion for a specific field
  const getSuggestion = useCallback((section, field, itemId = null) => {
    if (!aiSuggestions) {
      console.log("No AI suggestions available");
      return null;
    }

    console.log("Getting suggestion for:", section, field);
    console.log("Available suggestions:", aiSuggestions);

    // For summary suggestion
    if (section === "summary" && field === "summarySuggestion") {
      const suggestion = aiSuggestions.summarySuggestion;
      console.log("Summary suggestion:", suggestion);
      return suggestion;
    }

    // For skills
    if (section === "skills" && field === "recommendedSkills") {
      const suggestion = aiSuggestions.recommendedSkills;
      console.log("Skills suggestion:", suggestion);
      return suggestion;
    }

    // For experience bullets
    if (section === "experience" && field === "enhancedBullets") {
      const suggestion = aiSuggestions.enhancedBullets?.experience;
      console.log("Experience bullets suggestion:", suggestion);
      return suggestion;
    }

    // For project bullets
    if (section === "projects" && field === "enhancedBullets") {
      const suggestion = aiSuggestions.enhancedBullets?.projects;
      console.log("Projects bullets suggestion:", suggestion);
      return suggestion;
    }

    console.log("No matching suggestion found for:", section, field);
    return null;
  }, [aiSuggestions]);

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your contact details and basic info</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {["fullName", "email", "phone", "location", "linkedin", "github"].map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                <Input
                  id={field}
                  value={structuredData.personalInfo[field]}
                  onChange={(e) => handlePersonalInfoChange(field, e.target.value)}
                  placeholder={
                    field === "fullName" ? "John Doe" :
                    field === "email" ? "john@example.com" : ""
                  }
                  className="bg-background text-foreground border-border"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Professional Summary</CardTitle>
              <CardDescription>AI-powered career summary</CardDescription>
            </div>
            <Button
              onClick={generateSummary}
              disabled={isGenerating}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Generate with AI
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={structuredData.summary}
            onChange={(e) => onChange({ ...structuredData, summary: e.target.value })}
            placeholder="A brief professional summary highlighting your experience and goals..."
            rows={4}
            className="bg-background text-foreground border-border"
          />
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Your professional background</CardDescription>
            </div>
            <Button onClick={addExperience} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {structuredData.experience.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No experience added yet. Click "Add Experience" to get started.
            </p>
          )}
          {structuredData.experience.map((exp) => (
            <div key={exp.id} className="p-4 border rounded-lg space-y-3 bg-background border-border">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Experience Entry</h4>
                <Button onClick={() => removeExperience(exp.id)} size="sm" variant="ghost" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {["title", "company", "duration", "description"].map((field) => (
                  <div key={field} className={`space-y-2 ${field === "duration" || field === "description" ? "sm:col-span-2" : ""} relative`}>
                    <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                    <div className="relative">
                      {field === "description" ? (
                        <Textarea
                          value={exp[field]}
                          onChange={(e) => updateExperience(exp.id, field, e.target.value)}
                          placeholder={`Enter ${field}...`}
                          rows={field === "description" ? 3 : 1}
                          className="bg-background text-foreground border-border"
                        />
                      ) : (
                        <Input
                          value={exp[field]}
                          onChange={(e) => updateExperience(exp.id, field, e.target.value)}
                          placeholder={`Enter ${field}...`}
                          className="bg-background text-foreground border-border"
                        />
                      )}
                      {getSuggestion("experience", field, exp.id) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2 text-xs"
                          onClick={() => toggleSuggestion("experience", field, exp.id)}
                        >
                          AI
                        </Button>
                      )}
                    </div>
                    <AiSuggestionsPopup
                      suggestion={getSuggestion("experience", field, exp.id)}
                      fieldName={field}
                      onAccept={(suggestion) => handleAcceptSuggestion("experience", field, suggestion, exp.id)}
                      onEdit={handleEditSuggestion}
                      onDiscard={() => handleDiscardSuggestion("experience", field, exp.id)}
                      isVisible={activeSuggestions[`experience-${field}-${exp.id}`]}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Education</CardTitle>
              <CardDescription>Your academic background</CardDescription>
            </div>
            <Button onClick={addEducation} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {structuredData.education.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No education added yet. Click "Add Education" to get started.
            </p>
          )}
          {structuredData.education.map((edu) => (
            <div key={edu.id} className="p-4 border rounded-lg space-y-3 bg-background border-border relative">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Education Entry</h4>
                <Button onClick={() => removeEducation(edu.id)} size="sm" variant="ghost" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {["degree", "institution", "year"].map((field) => (
                  <div key={field} className={`space-y-2 ${field === "year" ? "sm:col-span-2" : ""} relative`}>
                    <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                    <div className="relative">
                      <Input
                        value={edu[field]}
                        onChange={(e) => updateEducation(edu.id, field, e.target.value)}
                        placeholder={`Enter ${field}...`}
                        className="bg-background text-foreground border-border"
                      />
                      {getSuggestion("education", field, edu.id) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2 text-xs"
                          onClick={() => toggleSuggestion("education", field, edu.id)}
                        >
                          AI
                        </Button>
                      )}
                    </div>
                    <AiSuggestionsPopup
                      suggestion={getSuggestion("education", field, edu.id)}
                      fieldName={field}
                      onAccept={(suggestion) => handleAcceptSuggestion("education", field, suggestion, edu.id)}
                      onEdit={handleEditSuggestion}
                      onDiscard={() => handleDiscardSuggestion("education", field, edu.id)}
                      isVisible={activeSuggestions[`education-${field}-${edu.id}`]}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Your notable projects</CardDescription>
            </div>
            <Button onClick={addProject} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {structuredData.projects.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No projects added yet. Click "Add Project" to get started.
            </p>
          )}
          {structuredData.projects.map((project) => (
            <div key={project.id} className="p-4 border rounded-lg space-y-3 bg-background border-border relative">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Project Entry</h4>
                <Button onClick={() => removeProject(project.id)} size="sm" variant="ghost" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {["name", "technologies", "link"].map((field) => (
                  <div key={field} className="space-y-2 relative">
                    <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                    <div className="relative">
                      <Input
                        value={project[field]}
                        onChange={(e) => updateProject(project.id, field, e.target.value)}
                        placeholder={`Enter ${field}...`}
                        className="bg-background text-foreground border-border"
                      />
                      {getSuggestion("projects", field, project.id) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2 text-xs"
                          onClick={() => toggleSuggestion("projects", field, project.id)}
                        >
                          AI
                        </Button>
                      )}
                    </div>
                    <AiSuggestionsPopup
                      suggestion={getSuggestion("projects", field, project.id)}
                      fieldName={field}
                      onAccept={(suggestion) => handleAcceptSuggestion("projects", field, suggestion, project.id)}
                      onEdit={handleEditSuggestion}
                      onDiscard={() => handleDiscardSuggestion("projects", field, project.id)}
                      isVisible={activeSuggestions[`projects-${field}-${project.id}`]}
                    />
                  </div>
                ))}
                <div className="space-y-2 sm:col-span-2 relative">
                  <Label>Description</Label>
                  <div className="relative">
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateProject(project.id, "description", e.target.value)}
                      placeholder="Enter project description..."
                      rows={3}
                      className="bg-background text-foreground border-border"
                    />
                    {getSuggestion("projects", "description", project.id) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute right-2 top-2 h-6 px-2 text-xs"
                        onClick={() => toggleSuggestion("projects", "description", project.id)}
                      >
                        AI
                      </Button>
                    )}
                  </div>
                  <AiSuggestionsPopup
                    suggestion={getSuggestion("projects", "description", project.id)}
                    fieldName="Description"
                    onAccept={(suggestion) => handleAcceptSuggestion("projects", "description", suggestion, project.id)}
                    onEdit={handleEditSuggestion}
                    onDiscard={() => handleDiscardSuggestion("projects", "description", project.id)}
                    isVisible={activeSuggestions[`projects-description-${project.id}`]}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>Your professional certifications</CardDescription>
            </div>
            <Button onClick={addCertification} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {structuredData.certifications.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No certifications added yet. Click "Add Certification" to get started.
            </p>
          )}
          {structuredData.certifications.map((cert) => (
            <div key={cert.id} className="p-4 border rounded-lg space-y-3 bg-background border-border relative">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Certification Entry</h4>
                <Button onClick={() => removeCertification(cert.id)} size="sm" variant="ghost" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {["name", "issuer", "date", "link"].map((field) => (
                  <div key={field} className="space-y-2 relative">
                    <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                    <div className="relative">
                      <Input
                        value={cert[field]}
                        onChange={(e) => updateCertification(cert.id, field, e.target.value)}
                        placeholder={`Enter ${field}...`}
                        className="bg-background text-foreground border-border"
                      />
                      {getSuggestion("certifications", field, cert.id) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2 text-xs"
                          onClick={() => toggleSuggestion("certifications", field, cert.id)}
                        >
                          AI
                        </Button>
                      )}
                    </div>
                    <AiSuggestionsPopup
                      suggestion={getSuggestion("certifications", field, cert.id)}
                      fieldName={field}
                      onAccept={(suggestion) => handleAcceptSuggestion("certifications", field, suggestion, cert.id)}
                      onEdit={handleEditSuggestion}
                      onDiscard={() => handleDiscardSuggestion("certifications", field, cert.id)}
                      isVisible={activeSuggestions[`certifications-${field}-${cert.id}`]}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Your technical and soft skills grouped by category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="skillName">Skill</Label>
              <Input
                id="skillName"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="Enter a skill..."
                className="bg-background text-foreground border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skillCategory">Category</Label>
              <select
                id="skillCategory"
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                className="w-full bg-background text-foreground border border-border rounded-md p-2"
              >
                {getSkillCategories().map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button onClick={addSkill} size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition">
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
          
          {/* Display skills by category */}
          <div className="space-y-4 mt-4">
            {getSkillCategories().map((category) => {
              const categorySkills = structuredData.skills[category.id] || [];
              return categorySkills.length > 0 ? (
                <div key={category.id} className="space-y-2">
                  <h4 className="font-medium text-lg">{category.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1 bg-secondary text-secondary-foreground">
                        {skill}
                        <button 
                          onClick={() => removeSkill(category.id, skill)} 
                          className="ml-2 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null;
            })}
          </div>
          
          {/* AI Suggestion for Skills */}
          {getSuggestion("skills", "recommendedSkills") && (
            <div className="mt-4 relative">
              <Button
                size="sm"
                variant="outline"
                className="absolute right-0 top-0 h-6 px-2 text-xs"
                onClick={() => toggleSuggestion("skills", "recommendedSkills")}
              >
                AI
              </Button>
              <div className="pt-8">
                <Label>AI Recommended Skills</Label>
                <div className="text-sm text-muted-foreground mt-1">
                  Click the AI button to see suggested skills
                </div>
              </div>
              <AiSuggestionsPopup
                suggestion={getSuggestion("skills", "recommendedSkills")?.join(", ")}
                fieldName="Skills"
                onAccept={(suggestion) => handleAcceptSuggestion("skills", "recommendedSkills", getSuggestion("skills", "recommendedSkills"))}
                onEdit={handleEditSuggestion}
                onDiscard={() => handleDiscardSuggestion("skills", "recommendedSkills")}
                isVisible={activeSuggestions[`skills-recommendedSkills-general`]}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedResumeForm;
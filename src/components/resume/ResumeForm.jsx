import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResumeForm = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handlePersonalInfoChange = (field, value) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const addExperience = () => {
    onChange({
      ...data,
      experience: [
        ...data.experience,
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
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id) => {
    onChange({
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    onChange({
      ...data,
      education: [
        ...data.education,
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
      ...data,
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      onChange({
        ...data,
        skills: [...data.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill) => {
    onChange({
      ...data,
      skills: data.skills.filter((s) => s !== skill),
    });
  };

  const generateSummary = async () => {
    if (!data.personalInfo.fullName || data.experience.length === 0) {
      toast({
        title: "Missing information",
        description: "Please add your name and at least one work experience first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("generate-summary", {
        body: {
          name: data.personalInfo.fullName,
          experience: data.experience,
          skills: data.skills,
        },
      });

      if (error) throw error;

      onChange({
        ...data,
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

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
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
                  value={data.personalInfo[field]}
                  onChange={(e) => handlePersonalInfoChange(field, e.target.value)}
                  placeholder={field === "fullName" ? "John Doe" : field === "email" ? "john@example.com" : ""}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
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
              {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Generate with AI
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.summary}
            onChange={(e) => onChange({ ...data, summary: e.target.value })}
            placeholder="A brief professional summary highlighting your experience and goals..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
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
          {data.experience.length === 0 && <p className="text-muted-foreground text-center py-8">No experience added yet. Click "Add Experience" to get started.</p>}
          {data.experience.map((exp) => (
            <div key={exp.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Experience Entry</h4>
                <Button onClick={() => removeExperience(exp.id)} size="sm" variant="ghost" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {["title", "company", "duration", "description"].map((field) => (
                  <div key={field} className={`space-y-2 ${field === "duration" || field === "description" ? "sm:col-span-2" : ""}`}>
                    <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                    {field === "description" ? (
                      <Textarea
                        value={exp[field]}
                        onChange={(e) => updateExperience(exp.id, field, e.target.value)}
                        placeholder={`Enter ${field}...`}
                        rows={field === "description" ? 3 : 1}
                      />
                    ) : (
                      <Input
                        value={exp[field]}
                        onChange={(e) => updateExperience(exp.id, field, e.target.value)}
                        placeholder={`Enter ${field}...`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
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
          {data.education.length === 0 && <p className="text-muted-foreground text-center py-8">No education added yet. Click "Add Education" to get started.</p>}
          {data.education.map((edu) => (
            <div key={edu.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Education Entry</h4>
                <Button onClick={() => removeEducation(edu.id)} size="sm" variant="ghost" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {["degree", "institution", "year"].map((field) => (
                  <div key={field} className={`space-y-2 ${field === "year" ? "sm:col-span-2" : ""}`}>
                    <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                    <Input
                      value={edu[field]}
                      onChange={(e) => updateEducation(edu.id, field, e.target.value)}
                      placeholder={`Enter ${field}...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Your technical and soft skills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
              placeholder="Add a skill..."
            />
            <Button onClick={addSkill} size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Plus className="h-4 w-4 " />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-3 py-1">
                {skill}
                <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-destructive">×</button>
              </Badge>
            ))}
          </div>
          {data.skills.length === 0 && <p className="text-muted-foreground text-center py-4">No skills added yet. Add your first skill above.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeForm;

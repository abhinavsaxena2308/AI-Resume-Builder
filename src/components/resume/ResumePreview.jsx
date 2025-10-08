import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

const ResumePreview = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <Card className="shadow-xl" id="resume-preview">
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center border-b-2 border-primary pb-4">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {personalInfo.fullName || "Your Name"}
            </h1>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              {personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {personalInfo.email}
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {personalInfo.phone}
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {personalInfo.location}
                </div>
              )}
            </div>
            
            {(personalInfo.linkedin || personalInfo.github) && (
              <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground mt-2">
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-1">
                    <Linkedin className="h-3 w-3" />
                    {personalInfo.linkedin}
                  </div>
                )}
                {personalInfo.github && (
                  <div className="flex items-center gap-1">
                    <Github className="h-3 w-3" />
                    {personalInfo.github}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary */}
          {summary && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-2 uppercase tracking-wide">
                Professional Summary
              </h2>
              <p className="text-sm text-foreground leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-3 uppercase tracking-wide border-b border-border pb-1">
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-foreground">{exp.title}</h3>
                      <span className="text-sm text-muted-foreground">{exp.duration}</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">{exp.company}</p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-3 uppercase tracking-wide border-b border-border pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-foreground">{edu.degree}</h3>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{edu.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-3 uppercase tracking-wide border-b border-border pb-1">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!personalInfo.fullName &&
            !summary &&
            experience.length === 0 &&
            education.length === 0 &&
            skills.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Your resume preview will appear here as you fill in the form
                </p>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumePreview;

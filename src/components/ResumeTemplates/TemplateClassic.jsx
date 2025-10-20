import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const TemplateClassic = ({
  personalInfo,
  summary,
  experience,
  education,
  projects,
  certifications,
  skills
}) => {
  const { theme } = useTheme();
  
  // Flatten skills object into a single array for display
  const flattenedSkills = Object.values(skills || {}).flat();
  
  return (
    <Card className="shadow-xl border border-border rounded-lg bg-card text-card-foreground max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="font-serif">
          {/* Header */}
          <div className="text-center pb-6 mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              {personalInfo.fullName || "Your Name"}
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              {personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>

            {(personalInfo.linkedin || personalInfo.github) && (
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mt-2">
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-1">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <span>{personalInfo.linkedin}</span>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="flex items-center gap-1">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <span>{personalInfo.github}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary */}
          {summary && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-foreground uppercase tracking-wide mb-2 border-b border-border pb-1">
                Professional Summary
              </h2>
              <p className="text-sm text-foreground leading-relaxed">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-foreground uppercase tracking-wide mb-3 border-b border-border pb-1">
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-base text-foreground">{exp.title}</h3>
                      <span className="text-sm text-muted-foreground">{exp.duration}</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">{exp.company}</p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-foreground uppercase tracking-wide mb-3 border-b border-border pb-1">
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-base text-foreground">{project.name}</h3>
                      <span className="text-sm text-muted-foreground">{project.date}</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">{project.technologies}</p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-foreground uppercase tracking-wide mb-3 border-b border-border pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-foreground text-base">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{edu.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-foreground uppercase tracking-wide mb-3 border-b border-border pb-1">
                Certifications
              </h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-foreground text-base">{cert.name}</h3>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{cert.date}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {flattenedSkills && flattenedSkills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-foreground uppercase tracking-wide mb-3 border-b border-border pb-1">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {flattenedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted text-foreground rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {!personalInfo.fullName &&
            !summary &&
            (!experience || experience.length === 0) &&
            (!education || education.length === 0) &&
            (!projects || projects.length === 0) &&
            (!certifications || certifications.length === 0) &&
            (!flattenedSkills || flattenedSkills.length === 0) && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-sm">
                  Your resume preview will appear here as you fill in the form.
                </p>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateClassic;
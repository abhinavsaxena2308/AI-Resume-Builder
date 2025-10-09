import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

const ResumePreview = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <Card className="shadow-2xl border border-border rounded-xl bg-white dark:bg-gray-900" id="resume-preview">
      <CardContent className="p-10">
        <div className="text-gray-800 dark:text-gray-100">
          {/* Header */}
          <div className="text-center pb-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">
              {personalInfo.fullName || "Your Name"}
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              {personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>

            {(personalInfo.linkedin || personalInfo.github) && (
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mt-2">
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-1">
                    <Linkedin className="h-4 w-4 text-primary" />
                    <span>{personalInfo.linkedin}</span>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="flex items-center gap-1">
                    <Github className="h-4 w-4 text-primary" />
                    <span>{personalInfo.github}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Horizontal line */}
          <hr className="border-t border-border my-4" />

          {/* Summary */}
          {summary && (
            <section>
              <h2 className="text-lg font-semibold text-primary uppercase tracking-wide mb-2">
                Professional Summary
              </h2>
              <p className="text-base text-foreground leading-relaxed">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold text-primary uppercase tracking-wide mb-3 border-b border-border pb-1">
                Work Experience
              </h2>
              <div className="space-y-5">
                {experience.map((exp) => (
                  <div key={exp.id} className="border-l-4 border-primary pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-foreground">{exp.title}</h3>
                      <span className="text-sm text-muted-foreground">{exp.duration}</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{exp.company}</p>
                    <p className="text-sm text-foreground mt-1 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold text-primary uppercase tracking-wide mb-3 border-b border-border pb-1">
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

          {/* Skills */}
          {skills && skills.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold text-primary uppercase tracking-wide mb-3 border-b border-border pb-1">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium dark:bg-purple-800 dark:text-purple-100"
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
            (!skills || skills.length === 0) && (
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

export default ResumePreview;

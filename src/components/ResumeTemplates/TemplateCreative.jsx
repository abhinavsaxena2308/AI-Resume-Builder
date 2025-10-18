import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

const TemplateCreative = ({
  personalInfo,
  summary,
  experience,
  education,
  skills
}) => {
  return (
    <Card className="shadow-2xl border-2 border-purple-200 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="text-gray-800">
          {/* Header */}
          <div className="text-center pb-6 mb-6 border-b-2 border-purple-200">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {personalInfo.fullName || "Your Name"}
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-purple-500" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-pink-500" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
            </div>

            {(personalInfo.linkedin || personalInfo.github) && (
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-2">
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-1">
                    <Linkedin className="h-4 w-4 text-blue-500" />
                    <span>{personalInfo.linkedin}</span>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="flex items-center gap-1">
                    <Github className="h-4 w-4 text-gray-700" />
                    <span>{personalInfo.github}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary */}
          {summary && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wide mb-3">
                Professional Summary
              </h2>
              <div className="bg-white bg-opacity-50 rounded-lg p-4 border-l-4 border-purple-400">
                <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
              </div>
            </section>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wide mb-4">
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="bg-white bg-opacity-50 rounded-lg p-4 border-l-4 border-pink-400">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-base text-gray-900">{exp.title}</h3>
                      <span className="text-sm text-gray-600 bg-purple-100 px-2 py-1 rounded">{exp.duration}</span>
                    </div>
                    <p className="text-sm font-medium text-pink-600 mb-2">{exp.company}</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wide mb-4">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-white bg-opacity-50 rounded-lg p-4 border-l-4 border-green-400">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{edu.degree}</h3>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                      </div>
                      <span className="text-sm text-gray-600 bg-green-100 px-2 py-1 rounded">{edu.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wide mb-4">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 rounded-full text-sm font-medium"
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
                <p className="text-gray-500 text-sm">
                  Your resume preview will appear here as you fill in the form.
                </p>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCreative;

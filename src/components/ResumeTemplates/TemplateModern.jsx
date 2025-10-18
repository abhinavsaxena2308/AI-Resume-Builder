import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

const TemplateModern = ({
  personalInfo,
  summary,
  experience,
  education,
  skills
}) => {
  return (
    <Card className="shadow-2xl border border-border rounded-xl bg-white max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Header & Summary */}
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center pb-6 border-b-2 border-blue-200">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {personalInfo.fullName || "Your Name"}
              </h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                {personalInfo.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span>{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-green-500" />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
              </div>

              {(personalInfo.linkedin || personalInfo.github) && (
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-2">
                  {personalInfo.linkedin && (
                    <div className="flex items-center gap-1">
                      <Linkedin className="h-4 w-4 text-blue-600" />
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
              <section>
                <h2 className="text-lg font-semibold text-blue-600 uppercase tracking-wide mb-2 border-b border-blue-200 pb-1">
                  Professional Summary
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
              </section>
            )}
          </div>

          {/* Right Column - Experience, Education, Skills */}
          <div className="space-y-6">
            {/* Experience */}
            {experience && experience.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-blue-600 uppercase tracking-wide mb-3 border-b border-blue-200 pb-1">
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-base text-gray-900">{exp.title}</h3>
                        <span className="text-sm text-gray-600">{exp.duration}</span>
                      </div>
                      <p className="text-sm font-medium text-blue-600 mb-2">{exp.company}</p>
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
              <section>
                <h2 className="text-lg font-semibold text-blue-600 uppercase tracking-wide mb-3 border-b border-blue-200 pb-1">
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{edu.degree}</h3>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                      </div>
                      <span className="text-sm text-gray-600">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-blue-600 uppercase tracking-wide mb-3 border-b border-blue-200 pb-1">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

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
      </CardContent>
    </Card>
  );
};

export default TemplateModern;

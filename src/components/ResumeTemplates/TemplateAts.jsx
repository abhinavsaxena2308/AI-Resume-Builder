import { Card, CardContent } from "@/components/ui/card";

const TemplateAts = ({
    personalInfo,
    summary,
    experience,
    education,
    projects,
    certifications,
    skills
}) => {
    // Flatten skills object into a single array for display
    const flattenedSkills = Object.values(skills || {}).flat();

    return (
        <Card className="shadow-none border-0 bg-white text-black max-w-[800px] mx-auto font-serif">
            <CardContent className="p-10 space-y-6">

                {/* Header - Contact Info */}
                <div className="text-center pb-4 border-b border-black">
                    <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">
                        {personalInfo.fullName || "YOUR NAME"}
                    </h1>
                    <div className="flex flex-wrap justify-center items-center text-sm gap-2">
                        {[
                            personalInfo.email,
                            personalInfo.phone,
                            personalInfo.location,
                            personalInfo.linkedin,
                            personalInfo.github
                        ]
                            .filter(Boolean)
                            .map((item, index, arr) => (
                                <span key={index}>
                                    {item}
                                    {index < arr.length - 1 && <span className="mx-2">|</span>}
                                </span>
                            ))}
                    </div>
                </div>

                {/* Professional Summary */}
                {summary && (
                    <section>
                        <h2 className="text-xl font-bold uppercase border-b border-black pb-1 mb-3">
                            Professional Summary
                        </h2>
                        <p className="text-sm leading-relaxed text-justify">{summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold uppercase border-b border-black pb-1 mb-3">
                            Professional Experience
                        </h2>
                        <div className="space-y-4">
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-base">{exp.title}</h3>
                                        <span className="text-sm font-semibold">{exp.duration}</span>
                                    </div>
                                    <div className="italic text-sm mb-2">{exp.company}</div>
                                    <p className="text-sm leading-relaxed whitespace-pre-line">
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
                        <h2 className="text-xl font-bold uppercase border-b border-black pb-1 mb-3">
                            Education
                        </h2>
                        <div className="space-y-3">
                            {education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="font-bold text-base">{edu.degree}</h3>
                                        <div className="text-sm italic">{edu.institution}</div>
                                    </div>
                                    <span className="text-sm font-semibold">{edu.year}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold uppercase border-b border-black pb-1 mb-3">
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div key={project.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-base">
                                            {project.name} {project.technologies ? `| ${project.technologies}` : ""}
                                        </h3>
                                        <span className="text-sm font-semibold">{project.date}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed whitespace-pre-line">
                                        {project.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold uppercase border-b border-black pb-1 mb-3">
                            Certifications
                        </h2>
                        <div className="space-y-2">
                            {certifications.map((cert) => (
                                <div key={cert.id} className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-bold text-sm">{cert.name}</span>
                                        <span className="text-sm italic ml-2">({cert.issuer})</span>
                                    </div>
                                    <span className="text-sm font-semibold">{cert.date}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {flattenedSkills && flattenedSkills.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold uppercase border-b border-black pb-1 mb-3">
                            Skills
                        </h2>
                        <p className="text-sm leading-relaxed">
                            {flattenedSkills.join(", ")}
                        </p>
                    </section>
                )}

                {/* Empty State Logic */}
                {!personalInfo.fullName &&
                    !summary &&
                    (!experience || experience.length === 0) &&
                    (!education || education.length === 0) &&
                    (!projects || projects.length === 0) &&
                    (!certifications || certifications.length === 0) &&
                    (!flattenedSkills || flattenedSkills.length === 0) && (
                        <div className="text-center py-20 text-gray-400 text-sm">
                            Your ATS-optimized resume preview will appear here. No graphics or colors will be used to ensure perfect parsing.
                        </div>
                    )}

            </CardContent>
        </Card>
    );
};

export default TemplateAts;

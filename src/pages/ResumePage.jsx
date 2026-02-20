import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";

const ResumePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      if (currentUser) setUser(currentUser);
    });

    const unsubscribe = onAuthStateChange((authUser) => {
      if (authUser) setUser(authUser);
      else setUser(null);
    });

    return () => unsubscribe();
  }, []);

  const resume = {
    name: "Alex Johnson",
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    email: "alex.johnson@example.com",
    linkedin: "linkedin.com/in/alexjohnson",
    portfolio: "alexjohnson.dev",
    summary:
      "Senior Software Engineer with 7+ years of experience building scalable web applications, leading cross-functional teams, and delivering high-impact features in fast-paced environments.",
    experience: [
      {
        company: "TechNova Inc.",
        title: "Senior Software Engineer",
        location: "San Francisco, CA",
        start: "Jan 2021",
        end: "Present",
        bullets: [
          "Led a team of 5 engineers to rebuild the core analytics platform, improving query performance by 45%.",
          "Designed and implemented a microservices architecture that reduced deployment time from hours to minutes.",
          "Collaborated with product and design to ship 10+ features that increased user engagement by 25%.",
        ],
      },
      {
        company: "BrightCode Labs",
        title: "Software Engineer",
        location: "Remote",
        start: "Jun 2017",
        end: "Dec 2020",
        bullets: [
          "Implemented end-to-end features in a React and Node.js stack serving 100K+ monthly active users.",
          "Reduced page load times by 30% through code splitting, caching, and performance profiling.",
          "Mentored junior engineers and led code reviews to maintain high quality and consistency.",
        ],
      },
    ],
    education: [
      {
        degree: "B.Sc. in Computer Science",
        institution: "University of California, Berkeley",
        location: "Berkeley, CA",
        graduation: "May 2017",
        details: "Graduated with Honors; Relevant coursework: Algorithms, Distributed Systems, Databases.",
      },
    ],
    skills: {
      languages: ["JavaScript", "TypeScript", "Python", "SQL"],
      technologies: ["React", "Node.js", "Next.js", "Express", "GraphQL"],
      tools: ["Git", "Docker", "Kubernetes", "Jest", "Cypress"],
      certifications: ["AWS Certified Developer – Associate", "Scrum Master Certified (SMC)"],
    },
    projects: [
      {
        name: "Real-time Collaboration Platform",
        role: "Lead Engineer",
        description:
          "Built a real-time collaboration tool with live cursors, comments, and presence indicators using WebSockets and Redis.",
      },
      {
        name: "Personal Portfolio",
        role: "Full-stack Developer",
        description:
          "Designed and developed a personal portfolio showcasing projects, blog posts, and speaking engagements.",
      },
    ],
    awards: [
      "Employee of the Year, TechNova Inc. (2023)",
      "Best Open Source Contribution Award, BrightCode Labs (2019)",
    ],
    volunteer: [
      "Volunteer Mentor, Code for Good – mentoring aspiring developers on web development fundamentals.",
    ],
    memberships: ["Member, IEEE Computer Society", "Member, Women Who Code"],
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-black dark:to-purple-950 text-gray-900 dark:text-gray-100 pt-20 print:bg-white print:text-black print:pt-0">
      <Navbar user={user} />
      <main className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 max-w-4xl print:max-w-full print:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 print:mb-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 print:text-black">
              {resume.name}
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 print:text-black">
              {resume.title}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1 text-sm text-gray-700 dark:text-gray-300 print:text-black">
            <a href={`tel:${resume.phone}`} className="hover:text-purple-600 dark:hover:text-purple-400 print:no-underline">
              {resume.phone}
            </a>
            <a href={`mailto:${resume.email}`} className="hover:text-purple-600 dark:hover:text-purple-400 print:no-underline">
              {resume.email}
            </a>
            <a
              href={`https://${resume.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-600 dark:hover:text-purple-400 print:no-underline"
            >
              {resume.linkedin}
            </a>
            <a
              href={`https://${resume.portfolio}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-600 dark:hover:text-purple-400 print:no-underline"
            >
              {resume.portfolio}
            </a>
            <span>{resume.location}</span>
          </div>
        </div>

        <div className="flex justify-end mb-6 gap-3 print:hidden">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="border-border text-gray-800 dark:text-gray-100 hover:bg-accent"
          >
            Download / Print PDF
          </Button>
        </div>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100 print:text-black">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed print:text-black">
            {resume.summary}
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 print:text-black">
            Work Experience
          </h2>
          <div className="space-y-4">
            {resume.experience.map((role) => (
              <div key={`${role.company}-${role.title}`} className="border-b border-gray-200 dark:border-gray-800 pb-3 last:border-none">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 print:text-black">
                      {role.title}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 print:text-black">
                      {role.company} • {role.location}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 print:text-black">
                    {role.start} – {role.end}
                  </p>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300 list-disc list-inside print:text-black">
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 print:text-black">
            Education
          </h2>
          <div className="space-y-3">
            {resume.education.map((edu) => (
              <div key={edu.institution}>
                <p className="font-semibold text-gray-900 dark:text-gray-100 print:text-black">
                  {edu.degree}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 print:text-black">
                  {edu.institution} • {edu.location}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 print:text-black">
                  Graduated {edu.graduation}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 print:text-black">
                  {edu.details}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 print:text-black">
            Skills
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300 print:text-black">
            <div>
              <p className="font-semibold mb-1">Languages</p>
              <p>{resume.skills.languages.join(", ")}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Technologies</p>
              <p>{resume.skills.technologies.join(", ")}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Tools</p>
              <p>{resume.skills.tools.join(", ")}</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Certifications</p>
              <p>{resume.skills.certifications.join(", ")}</p>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 print:text-black">
            Projects
          </h2>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 print:text-black">
            {resume.projects.map((project) => (
              <div key={project.name}>
                <p className="font-semibold">
                  {project.name} • {project.role}
                </p>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100 print:text-black">
            Awards
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1 print:text-black">
            {resume.awards.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100 print:text-black">
            Volunteer Work
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1 print:text-black">
            {resume.volunteer.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100 print:text-black">
            Professional Memberships
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1 print:text-black">
            {resume.memberships.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default ResumePage;


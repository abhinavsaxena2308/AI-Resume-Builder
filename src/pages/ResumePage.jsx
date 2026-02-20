import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";
import { User, FileText, Briefcase, GraduationCap, Star, Code, Award, BadgeCheck, ChevronDown } from "lucide-react";

const ResumePage = () => {
  const [user, setUser] = useState(null);
  const sectionsRef = useRef({});

  const [activeSection, setActiveSection] = useState("personal");

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

  const sections = [
    {
      id: "personal",
      icon: User,
      label: "Personal Information",
      description: "What to include in your header and how to keep it professional.",
    },
    {
      id: "summary",
      icon: FileText,
      label: "Professional Summary",
      description: "Write a concise, impact-focused summary that sets the tone.",
    },
    {
      id: "experience",
      icon: Briefcase,
      label: "Work Experience",
      description: "Showcase your achievements with quantifiable, outcome-driven bullets.",
    },
    {
      id: "education",
      icon: GraduationCap,
      label: "Education",
      description: "Present your academic background clearly and effectively.",
    },
    {
      id: "skills",
      icon: Star,
      label: "Skills",
      description: "Highlight skills that match the role and prove your strengths.",
    },
    {
      id: "projects",
      icon: Code,
      label: "Projects",
      description: "Use projects to demonstrate real-world impact and initiative.",
    },
    {
      id: "certifications",
      icon: BadgeCheck,
      label: "Certifications",
      description: "Add relevant certifications that strengthen your candidacy.",
    },
    {
      id: "awards",
      icon: Award,
      label: "Awards",
      description: "Show recognition that differentiates you from other candidates.",
    },
  ];

  const scrollToSection = (id) => {
    const element = sectionsRef.current[id];
    if (element) {
      const rect = element.getBoundingClientRect();
      const offset = window.scrollY + rect.top - 96;
      window.scrollTo({ top: offset, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const TipCard = ({
    title,
    badge,
    items,
    example,
  }) => {
    const [open, setOpen] = useState(false);

    return (
      <div className="rounded-xl border border-gray-200/70 dark:border-gray-800/70 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors"
        >
          <div className="flex flex-col items-start gap-1 text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </span>
              <span className="text-[11px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                {badge}
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        {open && (
          <div className="px-4 py-3 sm:px-5 sm:py-4 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 space-y-2">
            <ul className="list-disc list-inside space-y-1">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {example && (
              <div className="mt-2 rounded-lg bg-gray-50 dark:bg-gray-900/80 px-3 py-2 text-xs sm:text-[13px] text-gray-700 dark:text-gray-200">
                <span className="font-semibold">Example: </span>
                {example}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-black dark:to-purple-950 text-gray-900 dark:text-gray-100 pt-20">
      <Navbar user={user} />
      <main className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 max-w-5xl">
        <header className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold tracking-wide text-purple-600 uppercase mb-2">
            Resume Writing Guide
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Build a modern resume that recruiters actually read
          </h1>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-3xl">
            Use this step-by-step guidance to refine every section of your resume. Each part includes
            writing tips, formatting recommendations, common mistakes to avoid, and examples aligned
            with current hiring standards.
          </p>
        </header>

        <section className="mb-8 sticky top-16 z-30 bg-gradient-to-b from-gray-50/95 via-gray-50/95 to-gray-50/60 dark:from-black/95 dark:via-black/95 dark:to-black/60 backdrop-blur-sm border-y border-gray-200/60 dark:border-gray-800/60">
          <div className="py-3 sm:py-4 overflow-x-auto">
            <div className="flex gap-2 sm:gap-3 min-w-max sm:min-w-0">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-2 rounded-full whitespace-nowrap ${
                    activeSection === section.id
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-white/90 dark:bg-gray-900/80 border-gray-200/70 dark:border-gray-800/70 text-gray-800 dark:text-gray-100"
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">{section.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-8 sm:space-y-10">
          <section
            id="personal"
            ref={(el) => {
              sectionsRef.current.personal = el;
            }}
            className="scroll-mt-28"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-700 dark:text-purple-300">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Present your contact details clearly while protecting your privacy.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <TipCard
                title="What to include"
                badge="Best practice"
                items={[
                  "Full name, city and country (or city and state) are usually enough for location.",
                  "Use a single professional email you check regularly.",
                  "Add one or two relevant links such as LinkedIn and portfolio or GitHub.",
                ]}
                example="Alex Johnson • San Francisco, CA • alex.johnson@example.com • linkedin.com/in/alexjohnson • alexjohnson.dev"
              />
              <TipCard
                title="Formatting recommendations"
                badge="Formatting"
                items={[
                  "Place personal information at the top in a single, easy-to-scan block.",
                  "Use a font size slightly larger for your name to create hierarchy.",
                  "Avoid adding icons that could confuse applicant tracking systems.",
                ]}
              />
              <TipCard
                title="Common mistakes to avoid"
                badge="Mistakes"
                items={[
                  "Including full street address when not required, which can create privacy concerns.",
                  "Using unprofessional email addresses such as nicknames or jokes.",
                  "Linking to inactive or incomplete profiles that do not support your application.",
                ]}
              />
              <TipCard
                title="Modern examples"
                badge="Example"
                items={[
                  "Align to one or two lines for better readability on both desktop and mobile.",
                  "Use vertical separators or simple bullets between contact details instead of slashes.",
                ]}
                example="Alex Johnson | San Francisco, CA | alex.johnson@example.com | linkedin.com/in/alexjohnson | alexjohnson.dev"
              />
            </div>
          </section>

          <section
            id="summary"
            ref={(el) => {
              sectionsRef.current.summary = el;
            }}
            className="scroll-mt-28"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-700 dark:text-purple-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Professional Summary
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Frame your experience in three to four lines focused on impact.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <TipCard
                title="How to write it"
                badge="Writing"
                items={[
                  "Lead with your role, years of experience, and core specializations.",
                  "Highlight two or three career achievements relevant to your target role.",
                  "Mention the type of environments you thrive in, such as high-growth startups or enterprise teams.",
                ]}
                example="Senior Software Engineer with 7+ years of experience building scalable web applications and leading cross-functional teams to deliver growth-driving features."
              />
              <TipCard
                title="Formatting recommendations"
                badge="Formatting"
                items={[
                  "Use a short paragraph or three bullet points instead of a dense block of text.",
                  "Keep it to three to five lines so recruiters can scan it quickly.",
                  "Avoid first-person pronouns; focus on what you deliver rather than narrative style.",
                ]}
              />
              <TipCard
                title="Common mistakes to avoid"
                badge="Mistakes"
                items={[
                  "Using generic phrases like “hard-working” without evidence.",
                  "Copying a job description instead of summarizing your unique value.",
                  "Turning the summary into a life story rather than a focused pitch.",
                ]}
              />
              <TipCard
                title="Strong example"
                badge="Example"
                items={[
                  "Summaries that mention scope (team size, users, revenue impact) feel more credible.",
                ]}
                example="Product-focused engineer who has shipped features used by over 200K monthly active users, improving retention by 15% and reducing support tickets by 20%."
              />
            </div>
          </section>

          <section
            id="experience"
            ref={(el) => {
              sectionsRef.current.experience = el;
            }}
            className="scroll-mt-28"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-700 dark:text-purple-300">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Work Experience
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Translate your responsibilities into measurable achievements that match the role.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <TipCard
                title="Writing strong bullets"
                badge="Writing"
                items={[
                  "Start each bullet with an action verb such as Led, Built, Designed, or Optimized.",
                  "Follow the pattern: action + scope + tools + measurable outcome where possible.",
                  "Prioritize bullets that directly support your target job description.",
                ]}
                example="Led a team of 5 engineers to rebuild the analytics platform, improving query performance by 45% and reducing report generation time from minutes to seconds."
              />
              <TipCard
                title="Formatting timeline and titles"
                badge="Formatting"
                items={[
                  "List experiences in reverse chronological order, most recent first.",
                  "Include job title, company, location, and clear start/end dates on one line where possible.",
                  "Align dates to the right for a clean visual scan.",
                ]}
              />
              <TipCard
                title="Common mistakes to avoid"
                badge="Mistakes"
                items={[
                  "Listing responsibilities copied from a job description instead of achievements.",
                  "Leaving long employment gaps unexplained when you have relevant activities to mention.",
                  "Using dense paragraphs instead of bullet points that are easy to scan.",
                ]}
              />
              <TipCard
                title="Real-world examples"
                badge="Example"
                items={[
                  "Use numbers even when estimates: ranges, percentages, and relative improvements still help.",
                ]}
                example="Implemented code-splitting and performance optimizations that reduced page load time by ~30% and improved Lighthouse performance scores from 65 to 90+."
              />
            </div>
          </section>

          <section
            id="education"
            ref={(el) => {
              sectionsRef.current.education = el;
            }}
            className="scroll-mt-28"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-700 dark:text-purple-300">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Education
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Present your academic background in a way that supports your current goals.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <TipCard
                title="Essential details"
                badge="Best practice"
                items={[
                  "Include degree, institution, location, and graduation month/year.",
                  "Mention honors, scholarships, or GPA if they strengthen your candidacy.",
                  "Highlight relevant coursework if you have limited work experience.",
                ]}
                example="B.Sc. in Computer Science, University of California, Berkeley — Graduated May 2017, with Honors."
              />
              <TipCard
                title="Formatting recommendations"
                badge="Formatting"
                items={[
                  "Place education above experience if you are early in your career or a recent graduate.",
                  "Use consistent formatting for all entries, especially for dates and locations.",
                  "Remove older or less relevant education once you have several years of experience.",
                ]}
              />
              <TipCard
                title="Common mistakes to avoid"
                badge="Mistakes"
                items={[
                  "Including every course you have ever taken instead of a curated list.",
                  "Listing high school details once you have a university degree and professional experience.",
                  "Writing long descriptions of thesis work without connecting it to the target role.",
                ]}
              />
              <TipCard
                title="Strong example entries"
                badge="Example"
                items={[
                  "Summarize academic projects or research in one concise bullet instead of multiple lines.",
                ]}
                example="Capstone project: built a distributed event-processing pipeline that handled 50K messages per minute using Kafka and Spark."
              />
            </div>
          </section>

          <section
            id="skills"
            ref={(el) => {
              sectionsRef.current.skills = el;
            }}
            className="scroll-mt-28"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-700 dark:text-purple-300">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Skills
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Showcase skills that align with the job and are supported by your experience.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <TipCard
                title="How to organize skills"
                badge="Best practice"
                items={[
                  "Group skills into categories such as Languages, Frameworks, Tools, and Cloud.",
                  "Prioritize skills that appear in the job description and match your expertise.",
                  "Keep the list focused; aim for depth over an exhaustive catalogue.",
                ]}
                example="Languages: JavaScript, TypeScript, Python • Frameworks: React, Next.js • Cloud: AWS, GCP • Tools: Git, Docker, Kubernetes"
              />
              <TipCard
                title="Formatting recommendations"
                badge="Formatting"
                items={[
                  "Use comma-separated lists or short bullet points rather than long sentences.",
                  "Avoid rating skills with stars or percentages, which hiring managers often ignore.",
                  "Place the skills section near the top if you are applying for technical roles.",
                ]}
              />
              <TipCard
                title="Common mistakes to avoid"
                badge="Mistakes"
                items={[
                  "Listing tools you have never used or cannot discuss in an interview.",
                  "Mixing basic tools such as MS Word with specialized technologies unless requested.",
                  "Creating a skills section that does not correlate with your work experience or projects.",
                ]}
              />
              <TipCard
                title="Real-world examples"
                badge="Example"
                items={[
                  "Match terminology used in job postings so your resume aligns with recruiter searches.",
                ]}
                example="If a role mentions 'React' and 'TypeScript', list those explicitly rather than only 'front-end frameworks' or 'typed JavaScript'."
              />
            </div>
          </section>

          <section
            id="projects"
            ref={(el) => {
              sectionsRef.current.projects = el;
            }}
            className="scroll-mt-28"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-700 dark:text-purple-300">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Projects
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Use projects to prove your skills with tangible outcomes and technologies.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <TipCard
                title="Choosing projects"
                badge="Best practice"
                items={[
                  "Select projects that demonstrate skills your target job actually requires.",
                  "Include professional, freelance, and strong personal projects where you had clear impact.",
                  "Limit the number of projects and go deeper on the most relevant ones.",
                ]}
              />
              <TipCard
                title="How to describe projects"
                badge="Writing"
                items={[
                  "Mention your role, technologies used, and the problem you solved.",
                  "Highlight outcomes such as performance improvements, adoption, or user growth.",
                  "Include links to live demos or repositories when appropriate.",
                ]}
                example="Lead Engineer for a real-time collaboration platform using React, Node.js, and WebSockets, supporting 1K+ concurrent users with presence indicators and live cursors."
              />
              <TipCard
                title="Common mistakes to avoid"
                badge="Mistakes"
                items={[
                  "Listing every side project without context or outcomes.",
                  "Using vague descriptions such as 'built a website' without scope or impact.",
                  "Including projects you are not comfortable walking through in detail.",
                ]}
              />
              <TipCard
                title="Formatting guidelines"
                badge="Formatting"
                items={[
                  "Use the same structure as work experience: role, project name, technologies, outcomes.",
                  "Place projects above experience if they better demonstrate fit for a career transition.",
                ]}
              />
            </div>
          </section>

          <section
            id="certifications"
            ref={(el) => {
              sectionsRef.current.certifications = el;
            }}
            className="scroll-mt-28"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-700 dark:text-purple-300">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Certifications
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Showcase certifications that validate your skills and domain expertise.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <TipCard
                title="Which certifications to list"
                badge="Best practice"
                items={[
                  "Prioritize certifications that are relevant to the role and industry.",
                  "Include issuing organizations and completion or expiration dates.",
                  "Group less critical certificates into a single line if space is limited.",
                ]}
                example="AWS Certified Developer – Associate (2024), Scrum Master Certified (SMC) (2023)"
              />
              <TipCard
                title="Formatting recommendations"
                badge="Formatting"
                items={[
                  "Use bullet points or a concise list depending on how many certifications you have.",
                  "Keep formatting consistent: Certification Name — Provider, Year.",
                  "Place the section near skills or education for a logical flow.",
                ]}
              />
              <TipCard
                title="Common mistakes to avoid"
                badge="Mistakes"
                items={[
                  "Listing outdated or unrelated certifications that distract from your main profile.",
                  "Inflating credentials or adding courses that are not formal certifications.",
                ]}
              />
              <TipCard
                title="Real-world examples"
                badge="Example"
                items={[
                  "Focus on certifications that recruiters might use as search filters in applicant tracking systems.",
                ]}
              />
            </div>
          </section>

          <section
            id="awards"
            ref={(el) => {
              sectionsRef.current.awards = el;
            }}
            className="scroll-mt-28 pb-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-700 dark:text-purple-300">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Awards
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Use awards and recognition to reinforce your track record of high performance.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <TipCard
                title="What to highlight"
                badge="Best practice"
                items={[
                  "Include awards tied to work performance, leadership, or domain excellence.",
                  "Mention the organization and year so hiring managers can understand context.",
                  "Summarize very old awards only if they are prestigious or highly relevant.",
                ]}
                example="Employee of the Year, TechNova Inc. (2023); Best Open Source Contribution Award, BrightCode Labs (2019)."
              />
              <TipCard
                title="Common mistakes to avoid"
                badge="Mistakes"
                items={[
                  "Listing informal recognitions that are hard to verify or interpret.",
                  "Overloading the section with minor awards instead of focusing on signal.",
                ]}
              />
              <TipCard
                title="Formatting guidelines"
                badge="Formatting"
                items={[
                  "Use a short bulleted list or a single line if you have only one or two awards.",
                  "Place awards near the end of the resume as a supporting credibility booster.",
                ]}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ResumePage;

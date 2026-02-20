import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Target, Briefcase, BookOpen, Clock, Sparkles } from "lucide-react";
import { getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";

const CareerTips = () => {
  const navigate = useNavigate();
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

  const tipSections = [
    {
      icon: Target,
      title: "Define Your Target Role",
      description:
        "Clarify the role, level, and industry you are aiming for so your resume, projects, and networking all point in the same direction.",
      imageAlt: "AI-generated illustration of a professional mapping out career goals",
      imageSrc: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
      items: [
        "Shortlist 3–5 target job titles",
        "Collect 5–10 job descriptions to analyze patterns",
        "Highlight recurring skills and requirements",
      ],
    },
    {
      icon: Briefcase,
      title: "Show Impact, Not Tasks",
      description:
        "Translate your experience into measurable outcomes that recruiters and hiring managers can quickly understand.",
      imageAlt: "AI-generated illustration of measurable career achievements and metrics",
      imageSrc: "https://images.pexels.com/photos/1181400/pexels-photo-1181400.jpeg",
      items: [
        "Use action verbs and quantify results where possible",
        "Focus on impact, scale, and complexity of your work",
        "Align achievements with business or user outcomes",
      ],
    },
    {
      icon: BookOpen,
      title: "Tailor For Every Application",
      description:
        "Adapt your resume to each opportunity while keeping a strong, reusable base version in the builder.",
      imageAlt: "AI-generated illustration of tailoring a resume for different roles",
      imageSrc: "https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg",
      items: [
        "Mirror keywords from the job description naturally",
        "Reorder sections to surface the most relevant experience",
        "Emphasize recent and role-aligned projects",
      ],
    },
    {
      icon: Clock,
      title: "Optimize For Recruiter Time",
      description:
        "Most resumes get a quick scan first. Make yours easy to parse and visually consistent.",
      imageAlt: "AI-generated illustration showing time-saving resume review",
      imageSrc: "https://images.pexels.com/photos/1181393/pexels-photo-1181393.jpeg",
      items: [
        "Keep layout clean with clear hierarchy and whitespace",
        "Use consistent date formats, headings, and bullet styles",
        "Avoid dense paragraphs; prefer concise bullet points",
      ],
    },
    {
      icon: Sparkles,
      title: "Leverage AI Assistance",
      description:
        "Use the AI resume builder to generate strong first drafts, then refine with your domain knowledge.",
      imageAlt: "AI-generated illustration of AI assisting with resume writing",
      imageSrc: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
      items: [
        "Generate tailored summaries for different target roles",
        "Ask AI to rephrase bullets for clarity and impact",
        "Use suggestions as a starting point, not the final word",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-black dark:to-purple-950 text-gray-900 dark:text-gray-100 pt-20">
      <Navbar user={user} />
      <main className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 max-w-6xl">
        <section className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Career Tips
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Level Up Your Career Story
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Turn your experience into a clear, compelling narrative that passes ATS filters and resonates with real recruiters.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 text-base sm:text-lg rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:opacity-95 transition-all"
            >
              Start Improving My Resume
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/examples")}
              className="border-border text-gray-800 dark:text-gray-100 hover:bg-accent px-6 py-3 text-sm sm:text-base rounded-xl"
            >
              View Resume Examples
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {tipSections.map((tip) => (
            <article
              key={tip.title}
              className="h-full rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden"
            >
              <div className="relative w-full h-40 sm:h-48 overflow-hidden">
                <img
                  src={tip.imageSrc}
                  alt={tip.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
                    <tip.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {tip.title}
                  </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {tip.description}
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {tip.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/60 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Ready To Apply These Tips?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl">
              Use the AI Resume Builder to transform these principles into a polished, ATS-ready resume tailored to your next role.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:opacity-95 transition-all w-full sm:w-auto"
            >
              Open Resume Builder
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-border text-gray-800 dark:text-gray-100 hover:bg-accent px-6 py-3 rounded-xl w-full sm:w-auto"
            >
              Back To Home
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CareerTips;

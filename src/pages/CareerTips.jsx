import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Target,
  Briefcase,
  BookOpen,
  Clock,
  Sparkles,
  ArrowRight,
  Lightbulb,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
      imageSrc: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
      color: "blue",
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
      imageSrc: "https://images.pexels.com/photos/1181400/pexels-photo-1181400.jpeg",
      color: "purple",
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
      imageSrc: "https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg",
      color: "pink",
      items: [
        "Mirror keywords from the job description naturally",
        "Reorder sections to surface relevant experience",
        "Emphasize recent and role-aligned projects",
      ],
    },
    {
      icon: Clock,
      title: "Optimize For Reviewers",
      description:
        "Most resumes get a quick scan first. Make yours easy to parse and visually consistent.",
      imageSrc: "https://images.pexels.com/photos/1181393/pexels-photo-1181393.jpeg",
      color: "orange",
      items: [
        "Keep layout clean with clear hierarchy",
        "Use consistent date formats and bullet styles",
        "Avoid dense paragraphs; prefer concise bullets",
      ],
    },
    {
      icon: Sparkles,
      title: "Leverage AI Assistance",
      description:
        "Use the AI resume builder to generate strong first drafts, then refine with your domain knowledge.",
      imageSrc: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
      color: "cyan",
      items: [
        "Generate tailored summaries for different roles",
        "Ask AI to rephrase bullets for clarity",
        "Use suggestions as a starting point",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-gray-900 dark:text-gray-100 overflow-x-hidden font-sans pt-16">
      <Navbar user={user} />

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.3, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[120px]"
        />
      </div>

      <main className="container relative z-10 mx-auto px-6 max-w-7xl">
        {/* Header Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center py-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Lightbulb className="w-4 h-4" />
            Expert Guidance
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight"
          >
            Level Up Your <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Career Story
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Turn your experience into a clear, compelling narrative that passes ATS filters and resonates with top recruiters instantly.
          </motion.p>
        </motion.section>

        {/* Tips Grid */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {tipSections.map((tip, idx) => (
            <motion.article
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/20 dark:shadow-black/40 transition-all duration-300"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={tip.imageSrc}
                  alt={tip.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <tip.icon className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {tip.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed truncate-2-lines">
                  {tip.description}
                </p>
                <ul className="space-y-3">
                  {tip.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </motion.section>

        {/* Footer CTA */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[2.5rem] overflow-hidden p-10 mb-20 text-center border border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl text-white mb-6 shadow-lg shadow-purple-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold mb-4">Ready To Apply These Tips?</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8 text-lg">
              Use our AI-powered builder to transform these principles into a high-converting, professional resume in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/25 transition-all"
              >
                Open Builder
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="px-8 py-3.5 border border-gray-200 dark:border-gray-800 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-gray-300"
              >
                Back To Home
              </motion.button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default CareerTips;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ResumePreview from "@/components/resume/ResumePreview";
import { motion } from "framer-motion";
import { Eye, Sparkles, Rocket, FileText, CheckCircle2 } from "lucide-react";
import { getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";

const ViewExamples = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) setUser(user);
    });

    const unsubscribe = onAuthStateChange((user) => {
      if (user) setUser(user);
      else setUser(null);
    });

    return () => unsubscribe();
  }, []);

  // Sample resume data for examples
  const exampleResumes = [
    {
      personalInfo: {
        fullName: "Abhinav Saxena",
        email: "abhinav@example.com",
        phone: "(555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/abhinav",
        github: "github.com/abhinav",
      },
      summary: "Innovative Full-Stack Engineer specializing in AI-driven web applications, scalable microservices, and modern UI/UX.",
      experience: [
        {
          id: 1,
          title: "Lead Software Architect",
          company: "Nexus AI",
          duration: "2021 - Present",
          description: "Architected modern LLM-based solutions, scaling the infrastructure to handle 1M+ daily active requests with 99.9% uptime.",
        },
        {
          id: 2,
          title: "Full Stack Developer",
          company: "TechFront Inc",
          duration: "2018 - 2021",
          description: "Developed and maintained multiple high-traffic client applications using React, Node.js, and PostgreSQL.",
        },
      ],
      education: [
        {
          id: 1,
          degree: "MS in Computer Science",
          institution: "Stanford University",
          year: "2018",
        },
      ],
      skills: ["React", "Node.js", "Python", "TypeScript", "AWS", "Docker"],
    },
    {
      personalInfo: {
        fullName: "Abhinav Saxena",
        email: "abhinav@example.com",
        phone: "(555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/abhinav",
        github: "github.com/abhinav",
      },
      summary: "Innovative Full-Stack Engineer specializing in AI-driven web applications, scalable microservices, and modern UI/UX.",
      experience: [
        {
          id: 1,
          title: "Lead Software Architect",
          company: "Nexus AI",
          duration: "2021 - Present",
          description: "Architected modern LLM-based solutions, scaling the infrastructure to handle 1M+ daily active requests with 99.9% uptime.",
        },
        {
          id: 2,
          title: "Full Stack Developer",
          company: "TechFront Inc",
          duration: "2018 - 2021",
          description: "Developed and maintained multiple high-traffic client applications using React, Node.js, and PostgreSQL.",
        },
      ],
      education: [
        {
          id: 1,
          degree: "MS in Computer Science",
          institution: "Stanford University",
          year: "2018",
        },
      ],
      skills: ["React", "Node.js", "Python", "TypeScript", "AWS", "Docker"],
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-gray-900 dark:text-gray-100 overflow-x-hidden pt-16">
      <Navbar user={user} />

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]"
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 h-full min-h-[calc(100vh-80px)] flex flex-col py-8">

        {/* HEADER SECTION */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl mx-auto text-center mb-12 mt-6"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50 dark:border-gray-800/50 mb-8">
            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-widest">
              Template Gallery
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          >
            Professionally Crafted<br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Success Stories
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Explore our high-converting layouts. Engineered to pass ATS filters and designed to catch the human eye instantly.
          </motion.p>
        </motion.div>

        {/* TEMPLATES GRID */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-10 max-w-7xl mx-auto w-full mb-20"
        >
          {exampleResumes.map((resume, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="flex flex-col group"
            >
              {/* Card Meta Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {index === 0 ? "Modern Engineer" : "Classic Professional"}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" /> ATS Optimized
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(user ? "/dashboard" : "/auth")}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl text-sm font-semibold border border-purple-200 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-400 dark:hover:border-purple-500 transition-all text-purple-700 dark:text-purple-300 shadow-sm"
                >
                  <Eye className="h-4 w-4" />
                  Use This
                </motion.button>
              </div>

              {/* Resume Preview Box */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 p-6 border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/20 group-hover:border-purple-200 dark:group-hover:border-purple-800/50">
                {/* Subtle gradient overlay to make preview pop */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/50 pointer-events-none z-10" />

                <div className="relative z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-[0.98] group-hover:scale-100 origin-top">
                  <ResumePreview data={resume} template={index === 1 ? "classic" : "modern"} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* MINIMAL CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl mx-auto mb-16 text-center"
        >
          <div className="relative p-1 border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-[2.5rem] overflow-hidden">
            <div className="absolute inset-0 bg-white dark:bg-black m-[2px] rounded-[2.4rem] z-0" />
            <div className="relative z-10 py-16 px-6">
              <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-6" />
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Found Your Match?</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8">
                Instantly inject your data into these templates and let our AI engine optimize the rest.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px -10px rgba(168,85,247,0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
                className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-lg shadow-lg"
              >
                <Rocket className="w-5 h-5" />
                Get Started Now
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ViewExamples;

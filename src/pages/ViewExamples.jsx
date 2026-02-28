import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ResumePreview from "@/components/resume/ResumePreview";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Sparkles, Rocket, FileText, CheckCircle2, LayoutTemplate } from "lucide-react";
import { getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";

const ViewExamples = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);

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
      templateId: "modern",
      title: "Modern Engineer",
      desc: "Clean, contemporary look perfect for tech roles and modern companies.",
      data: {
        personalInfo: {
          fullName: "Alex Rivera",
          email: "alex.rivera@example.com",
          phone: "+1 (555) 019-2834",
          location: "Austin, TX",
          linkedin: "linkedin.com/in/arivera",
          github: "github.com/arivera",
        },
        summary: "Forward-thinking Full-Stack Engineer with 5+ years of experience architecting scalable, cloud-native web applications. Proven track record in optimizing application performance, leading cross-functional teams, and implementing AI-driven features to drive user engagement and business growth.",
        experience: [
          {
            id: 1,
            title: "Senior Full Stack Engineer",
            company: "TechNova Solutions",
            duration: "Jan 2021 - Present",
            description: "• Architected robust microservices using Node.js and Docker, improving system resilience by 40%.\n• Spearheaded the migration of a legacy monolithic frontend to React, reducing load times by 2.5s.\n• Mentored 4 junior developers and established code review best practices.",
          },
          {
            id: 2,
            title: "Software Developer",
            company: "WebSphere Inc",
            duration: "Jun 2018 - Dec 2020",
            description: "• Developed interactive user interfaces using React and Redux for 5 enterprise clients.\n• Optimised database queries in PostgreSQL, reducing average request latency by 30%.\n• Collaborated closely with design team to implement responsive, accessible web applications.",
          },
        ],
        education: [
          {
            id: 1,
            degree: "B.S. in Computer Science",
            institution: "University of Texas at Austin",
            year: "2018",
          },
        ],
        projects: [
          {
            id: 1,
            name: "AI Code Assistant",
            technologies: "React, Node.js, OpenAI API",
            date: "2023",
            description: "An open-source IDE extension that provides real-time AI code suggestions and auto-completions, gaining over 10k downloads."
          }
        ],
        skills: {
          frontend: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
          backend: ["Node.js", "Express", "Python", "GraphQL"],
          cloud: ["AWS", "Docker", "Kubernetes", "CI/CD"]
        }
      }
    },
    {
      templateId: "classic",
      title: "Classic Professional",
      desc: "Traditional and formal layout suitable for finance, law, or established enterprises.",
      data: {
        personalInfo: {
          fullName: "Jameson Caldwell",
          email: "j.caldwell@example.com",
          phone: "+44 20 7123 4567",
          location: "London, UK",
          linkedin: "linkedin.com/in/jamesoncaldwell",
        },
        summary: "Detail-oriented Financial Analyst with over 8 years of experience in corporate finance, risk management, and strategic financial planning. Adept at driving cost-reduction strategies and presenting complex financial data to C-level executives. Consistently surpassed portfolio growth targets by 15% YoY.",
        experience: [
          {
            id: 1,
            title: "Lead Financial Analyst",
            company: "Goldman & Partners",
            duration: "2019 - Present",
            description: "• Directed the quarterly financial forecasting process for a $500M portfolio, identifying 12% in potential cost savings.\n• Lead a team of 3 analysts to restructure debt profiles, saving the company $2.1M annually.\n• Presented comprehensive financial risk assessments to executive board members.",
          },
          {
            id: 2,
            title: "Financial Planning Associate",
            company: "Sterling Capital",
            duration: "2015 - 2019",
            description: "• Constructed dynamic financial models for M&A evaluation, contributing to $120M in successful acquisitions.\n• Reconciled monthly financial statements and prepared variance analysis reports.\n• Implemented automated reporting dashboards using Tableau and SQL.",
          },
        ],
        education: [
          {
            id: 1,
            degree: "Master of Business Administration (MBA)",
            institution: "London Business School",
            year: "2015",
          },
          {
            id: 2,
            degree: "B.Sc. in Economics",
            institution: "University of Warwick",
            year: "2013",
          },
        ],
        certifications: [
          {
            id: 1,
            name: "Chartered Financial Analyst (CFA)",
            issuer: "CFA Institute",
            date: "2018"
          }
        ],
        skills: {
          finance: ["Financial Modeling", "Variance Analysis", "Risk Assessment", "M&A", "Corporate Finance"],
          tools: ["Tableau", "Bloomberg Terminal", "Advanced Excel", "SQL"]
        }
      }
    },
    {
      templateId: "ats",
      title: "ATS Standard",
      desc: "Strictly formatted for perfect Applicant Tracking System parsing. Pure text focus.",
      data: {
        personalInfo: {
          fullName: "Priya Sharma",
          email: "priya.sharma@example.com",
          phone: "+91 98765 43210",
          location: "Bangalore, India",
          linkedin: "linkedin.com/in/priyasharma",
          github: "github.com/psharma-dev"
        },
        summary: "Highly motivated Machine Learning Engineer with 4 years of hands-on experience in building and deploying predictive models and natural language processing pipelines. Strong background in statistics, data wrangling, and MLOps. Passionate about leveraging data to solve complex real-world problems and optimize operational efficiency.",
        experience: [
          {
            id: 1,
            title: "Machine Learning Engineer",
            company: "DataMinds Solutions",
            duration: "July 2020 - Present",
            description: "• Engineered an NLP-based customer feedback classification system, achieving 94% accuracy and reducing manual categorization time by 80 hours/month.\n• Deployed ML models using AWS SageMaker and created REST APIs using FastAPI for seamless frontend integration.\n• Optimized data pipelines using Apache Spark, processing 5TB of log data daily.",
          },
          {
            id: 2,
            title: "Data Science Intern",
            company: "Innovate Tech Labs",
            duration: "Jan 2020 - June 2020",
            description: "• Assisted in developing predictive churn models with random forests and gradient boosting, boosting retention strategies.\n• Performed exploratory data analysis (EDA) and created insightful dashboards using Python and Plotly.",
          },
        ],
        education: [
          {
            id: 1,
            degree: "B.Tech in Artificial Intelligence and Data Science",
            institution: "Indian Institute of Technology (IIT), Madras",
            year: "2020",
          },
        ],
        projects: [
          {
            id: 1,
            name: "Automated Resume Parser",
            technologies: "Python, spaCy, Flask",
            date: "2022",
            description: "Built a customized NER model using spaCy to extract entities (skills, experience, education) from PDF resumes with 91% F1 score."
          }
        ],
        certifications: [
          {
            id: 1,
            name: "AWS Certified Machine Learning - Specialty",
            issuer: "Amazon Web Services",
            date: "2023"
          }
        ],
        skills: {
          languages: ["Python", "SQL", "R", "C++"],
          frameworks: ["TensorFlow", "PyTorch", "Scikit-Learn", "FastAPI"],
          data: ["Pandas", "NumPy", "Apache Spark", "Hadoop"],
          cloud: ["AWS (SageMaker, EC2)", "Docker"]
        }
      }
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

  const activeExample = exampleResumes[activeTemplateIndex];

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

      <div className="container relative z-10 mx-auto px-6 h-full min-h-[calc(100vh-80px)] flex flex-col py-8 pb-32">

        {/* HEADER SECTION */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl mx-auto text-center mb-10 mt-6"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50 dark:border-gray-800/50 mb-8">
            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-widest">
              Template Gallery
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
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

        {/* TEMPLATE TOGGLER & PREVIEW VIEWER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-6xl mx-auto w-full flex flex-col items-center"
        >
          {/* Toggles */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 p-2 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-800/50">
            {exampleResumes.map((template, idx) => (
              <button
                key={template.templateId}
                onClick={() => setActiveTemplateIndex(idx)}
                className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTemplateIndex === idx
                    ? "text-white shadow-md shadow-purple-500/20"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60"
                  }`}
              >
                {activeTemplateIndex === idx && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4" />
                  {template.title}
                </span>
              </button>
            ))}
          </div>

          <div className="w-full grid lg:grid-cols-[1fr_350px] gap-8 items-start">

            {/* Preview Box Component */}
            <div className="flex-1 order-2 lg:order-1 w-full flex justify-center">
              <div className="w-full max-w-[850px] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-gray-300/50 dark:shadow-black/60 p-4 sm:p-8 border border-gray-200 dark:border-gray-700 relative overflow-hidden transition-all duration-500">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTemplateIndex}
                    initial={{ opacity: 0, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="origin-top"
                  >
                    <ResumePreview data={activeExample.data} template={activeExample.templateId} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar info */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24 flex flex-col gap-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200/60 dark:border-gray-700/60">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
                  {activeExample.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {activeExample.desc}
                </p>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Perfect for:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    {activeExample.templateId === "modern" && (
                      <>
                        <li>• Tech & Design roles</li>
                        <li>• Startups & Forward-thinking companies</li>
                        <li>• Emphasising a diverse skill set</li>
                      </>
                    )}
                    {activeExample.templateId === "classic" && (
                      <>
                        <li>• Finance, Law, & Healthcare</li>
                        <li>• Traditional corporate roles</li>
                        <li>• Executive & Management positions</li>
                      </>
                    )}
                    {activeExample.templateId === "ats" && (
                      <>
                        <li>• Online job portal algorithms</li>
                        <li>• Strict single-column parsers</li>
                        <li>• Standardized application systems</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:shadow-purple-500/20 transition-all text-base"
              >
                <Eye className="w-5 h-5" />
                Use This Template
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ViewExamples;

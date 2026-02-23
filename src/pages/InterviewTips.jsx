import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ClipboardList,
  MessageCircle,
  Hand,
  MailCheck,
  ArrowRight,
  CheckCircle2,
  Video
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";

const InterviewTips = () => {
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

  const sections = [
    {
      key: "preparation",
      icon: ClipboardList,
      title: "Preparation Strategies",
      imageSrc: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
      points: [
        "Research the company, role, and team structure in depth.",
        "Prepare concise stories using the STAR method for achievements.",
        "Align your skills with the job description requirements.",
      ],
    },
    {
      key: "questions",
      icon: MessageCircle,
      title: "Common Questions",
      imageSrc: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg",
      points: [
        "Practice answers for questions about your background.",
        "Prepare role-specific technical or case study examples.",
        "Develop questions to ask the interviewer about the role.",
      ],
    },
    {
      key: "body-language",
      icon: Hand,
      title: "Presence & Impact",
      imageSrc: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
      points: [
        "Maintain open posture and steady eye contact.",
        "Use natural gestures to emphasize key points.",
        "Match your tone and pace while staying authentic.",
      ],
    },
    {
      key: "follow-up",
      icon: MailCheck,
      title: "Follow-up Protocols",
      imageSrc: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
      points: [
        "Send a personalized thank-you email within 24 hours.",
        "Reiterate your interest and highlight key discussion points.",
        "Politely follow up if you have not heard back in time.",
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
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]"
        />
      </div>

      <main className="container relative z-10 mx-auto px-6 max-w-7xl">
        {/* Header Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center py-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Video className="w-4 h-4" />
            Interview Mastery
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight"
          >
            Ace Every <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Conversation
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Use structured preparation and thoughtful follow-up to bridge the gap between candidate and team member.
          </motion.p>
        </motion.section>

        {/* Tips Grid */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {sections.map((section, idx) => (
            <motion.article
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="group relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/20 dark:shadow-black/40 transition-all duration-300 flex flex-col sm:flex-row"
            >
              <div className="relative w-full sm:w-48 h-40 sm:h-auto overflow-hidden">
                <img
                  src={section.imageSrc}
                  alt={section.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-transparent" />
              </div>

              <div className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                    <section.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-2.5">
                  {section.points.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </motion.section>

        {/* Footer CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[2.5rem] overflow-hidden p-8 mb-12 text-center border border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="text-left">
              <h2 className="text-2xl font-bold mb-2">Turn Interviews Into Offers</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                Pair these strategies with your AI-optimized resume to present a consistent, compelling story from application to offer.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 text-sm"
              >
                Practice Now <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/career-tips")}
                className="px-6 py-3 border border-gray-200 dark:border-gray-800 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-gray-300 text-sm"
              >
                More Tips
              </motion.button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default InterviewTips;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.png";
import { auth, getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";
import { signOut } from "firebase/auth";
import { useTheme } from "@/contexts/ThemeContext";
import {
  FileText,
  Sparkles,
  Zap,
  Target,
  Eye,
  Download,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  Award,
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

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

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-black dark:to-purple-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md z-50 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
              <FileText className="w-5 h-5" />
            </div>
            <span className="ml-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Resume Builder
            </span>
          </motion.div>

          <motion.nav 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {user ? (
              <>
                <button 
                  onClick={() => navigate("/dashboard")} 
                  className="hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Hi, {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 border border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl font-medium hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors"
                >
                  Dashboard
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/auth")}
                  className="hidden sm:block text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                >
                  Sign In
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/auth")}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                >
                  Get Started Free
                </motion.button>
              </>
            )}
          </motion.nav>
        </div>
      </header>


      {/* Hero Section */}
      <section className="relative container mx-auto px-6 mt-20 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-800">
                <Sparkles className="w-4 h-4" />
                AI-Powered Resume Creation
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Build Your{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Perfect Resume
              </span>{" "}
              <br className="hidden sm:block" />
              in Minutes
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl">
              Create professional, ATS-friendly resumes with AI assistance. 
              Stand out from the crowd and land your dream job faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
              >
                <Zap className="w-5 h-5" />
                {user ? "Go to Dashboard" : "Start Building Free"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/examples")}
                className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all text-gray-700 dark:text-gray-300"
              >
                <Eye className="w-5 h-5" />
                View Examples
              </motion.button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white dark:border-gray-900" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">1000+ users</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">4.9/5 rating</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl opacity-20 blur-xl" />
            
            {/* Main image */}
            <div className="relative">
              <img
                src={heroImage}
                alt="Resume Builder Interface"
                decoding="async"
                fetchpriority="high"
                loading="eager"
                className="relative rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900"
              />
              
              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -left-4 sm:left-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-xl border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ATS Score</p>
                    <p className="font-bold text-green-600 dark:text-green-400">95/100</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -top-4 -right-4 sm:right-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-xl border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">AI Powered</p>
                    <p className="font-bold text-purple-600 dark:text-purple-400">Smart Writing</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative container mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Users, value: "10K+", label: "Active Users" },
            { icon: FileText, value: "50K+", label: "Resumes Created" },
            { icon: Briefcase, value: "85%", label: "Interview Rate" },
            { icon: Award, value: "4.9/5", label: "User Rating" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative container mx-auto px-6 py-16 lg:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Powerful Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Resume Builder
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to create a standout resume that gets you hired.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              title: "AI-Powered Writing",
              desc: "Generate professional summaries and descriptions with AI that understands your career goals.",
              bgLight: "bg-purple-100",
              bgDark: "dark:bg-purple-900/40",
              textLight: "text-purple-600",
              textDark: "dark:text-purple-400"
            },
            {
              icon: Target,
              title: "ATS-Optimized",
              desc: "Our templates are designed to pass Applicant Tracking Systems and reach human recruiters.",
              bgLight: "bg-green-100",
              bgDark: "dark:bg-green-900/40",
              textLight: "text-green-600",
              textDark: "dark:text-green-400"
            },
            {
              icon: Eye,
              title: "Real-Time Preview",
              desc: "See your resume come to life as you type. What you see is exactly what you get.",
              bgLight: "bg-blue-100",
              bgDark: "dark:bg-blue-900/40",
              textLight: "text-blue-600",
              textDark: "dark:text-blue-400"
            },
            {
              icon: Download,
              title: "Easy Export",
              desc: "Download your resume as a PDF with one click. Ready to send to employers instantly.",
              bgLight: "bg-orange-100",
              bgDark: "dark:bg-orange-900/40",
              textLight: "text-orange-600",
              textDark: "dark:text-orange-400"
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              desc: "Create a professional resume in minutes, not hours. Our AI does the heavy lifting.",
              bgLight: "bg-yellow-100",
              bgDark: "dark:bg-yellow-900/40",
              textLight: "text-yellow-600",
              textDark: "dark:text-yellow-400"
            },
            {
              icon: CheckCircle2,
              title: "Smart Suggestions",
              desc: "Get intelligent recommendations for skills, keywords, and content improvements.",
              bgLight: "bg-pink-100",
              bgDark: "dark:bg-pink-900/40",
              textLight: "text-pink-600",
              textDark: "dark:text-pink-400"
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300"
            >
              <div className={`inline-flex p-3 rounded-xl mb-4 ${feature.bgLight} ${feature.bgDark} group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.textLight} ${feature.textDark}`} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative container mx-auto px-6 py-16 lg:py-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-500/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500/5 rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium mb-4">
            <Target className="w-4 h-4" />
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create your perfect resume in three simple steps
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-32 left-[16%] right-[16%] h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full" />
          
          {/* Animated dots on line */}
          <div className="hidden lg:flex absolute top-32 left-[16%] right-[16%] justify-between -translate-y-1/2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.2 }}
                className="w-3 h-3 rounded-full bg-white border-2 border-purple-500 shadow-lg"
              />
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
            {[
              { 
                step: "01", 
                icon: FileText,
                title: "Enter Your Details", 
                desc: "Fill in your information, experience, and skills. Our smart form guides you through the process.",
                color: "purple"
              },
              { 
                step: "02", 
                icon: Sparkles,
                title: "AI Enhancement", 
                desc: "Let our AI polish your content, suggest improvements, and optimize for ATS systems.",
                color: "pink"
              },
              { 
                step: "03", 
                icon: Download,
                title: "Download & Apply", 
                desc: "Export your professional resume as PDF and start applying to your dream jobs.",
                color: "purple"
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                className="relative"
              >
                {/* Mobile connector line */}
                {idx < 2 && (
                  <div className="lg:hidden absolute left-1/2 top-full w-0.5 h-8 bg-gradient-to-b from-purple-500 to-pink-500 -translate-x-1/2" />
                )}
                
                <div className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-8 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 h-full">
                  {/* Step number badge */}
                  <div className="absolute -top-4 left-8 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-bold shadow-lg">
                    Step {item.step}
                  </div>
                  
                  {/* Icon */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${item.color}-500 to-pink-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-${item.color}-500/30 group-hover:shadow-${item.color}-500/50 transition-shadow`}
                  >
                    <item.icon className="w-8 h-8" />
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                  
                  {/* Arrow indicator */}
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full items-center justify-center shadow-lg border border-gray-200 dark:border-gray-700">
                    {idx < 2 && <ArrowRight className="w-3 h-3 text-purple-500" />}
                    {idx === 2 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-gray-500 dark:text-gray-400 mb-4">Ready to get started?</p>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
            >
              {user ? "Go to Dashboard" : "Create Your Resume"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative container mx-auto px-6 py-16 lg:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-4">
            {/* <Heart className="w-4 h-4" /> */}
            Loved by Users
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of satisfied professionals who landed their dream jobs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah Johnson",
              role: "Software Engineer at Google",
              content: "This AI resume builder helped me land my dream job at Google! The ATS optimization feature is incredible.",
              rating: 5
            },
            {
              name: "Michael Chen",
              role: "Product Manager at Meta",
              content: "I was struggling with my resume for months. Within 30 minutes of using this tool, I had a professional resume ready.",
              rating: 5
            },
            {
              name: "Emily Davis",
              role: "Data Scientist at Amazon",
              content: "The AI suggestions were spot-on! It knew exactly what skills to highlight for my target role. Highly recommend!",
              rating: 5
            },
          ].map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative container mx-auto px-6 py-16 lg:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
            <CheckCircle2 className="w-4 h-4" />
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Got questions? We've got answers
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              question: "Is AI Resume Builder free to use?",
              answer: "Yes! You can create and download professional resumes completely free. We believe everyone deserves access to great career tools."
            },
            {
              question: "How does the AI writing assistance work?",
              answer: "Our AI analyzes your experience and skills, then generates professional summaries and bullet points tailored to your target role. It's powered by Google's Gemini AI for the best results."
            },
            {
              question: "Are the resumes ATS-friendly?",
              answer: "Absolutely! All our templates are designed to pass through Applicant Tracking Systems. We use clean formatting and proper structure that ATS software can easily parse."
            },
            {
              question: "Can I edit my resume after creating it?",
              answer: "Yes! Your resumes are automatically saved to your account. You can come back anytime to edit, update, or create new versions of your resume."
            },
            {
              question: "What file formats can I download?",
              answer: "Currently, we support PDF downloads which is the most widely accepted format by employers. The PDF maintains perfect formatting across all devices."
            },
          ].map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl"
            >
              <h3 className="text-lg font-semibold mb-2 flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-bold">
                  ?
                </span>
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 ml-9">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-6 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_auto] animate-gradient" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
          
          <div className="relative p-12 md:p-16 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Start for Free Today
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Join thousands of successful job seekers who built their winning resumes with AI Resume Builder. No credit card required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(user ? "/dashboard" : "/auth")}
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
                >
                  <Zap className="w-5 h-5" />
                  {user ? "Go to Dashboard" : "Create Your Resume Now"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/examples")}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl font-semibold hover:bg-white/30 transition-all"
                >
                  <Eye className="w-5 h-5" />
                  View Examples
                </motion.button>
              </div>

              <p className="mt-6 text-sm text-white/70 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                No credit card required • Free forever • Cancel anytime
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;

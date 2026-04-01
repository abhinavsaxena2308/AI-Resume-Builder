import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { auth, getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";
import { signOut } from "firebase/auth";
import { useTheme } from "@/contexts/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  Briefcase,
  Gift,
  X,
  ChevronRight,
  Brain,
  Shield,
  Clock,
  TrendingUp,
  BookOpen,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import premiumOfferImg from "@/assets/premium.png";
import bgImage from "@/assets/bg.png";

const VideoBackground = lazy(() => import("@/components/VideoBackground"));

/* ── Reusable animation variants ── */
const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const stagger = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const Index = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    getCurrentUser().then((u) => { if (u) setUser(u); });
    const unsub = onAuthStateChange((u) => setUser(u || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    const seen = sessionStorage.getItem("hasSeenPremiumModal");
    if (!seen) {
      const t = setTimeout(() => {
        setIsPremiumModalOpen(true);
        sessionStorage.setItem("hasSeenPremiumModal", "true");
      }, 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const handleGetPremium = () => {
    setIsSuccess(true);
    setTimeout(() => setIsPremiumModalOpen(false), 2000);
  };

  /* ── Premium Modal ── */
  const PremiumModal = () => (
    <AnimatePresence>
      {isPremiumModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSuccess && setIsPremiumModalOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-900 rounded-2xl p-8 shadow-2xl border border-white/[0.08] overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            {!isSuccess ? (
              <>
                <button
                  onClick={() => setIsPremiumModalOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-gold-300/20 blur-xl rounded-3xl" />
                    <img
                      src={premiumOfferImg}
                      alt="Premium Offer"
                      className="relative w-full h-48 object-cover rounded-xl border border-white/10"
                    />
                    <div className="absolute -bottom-4 right-4 p-3 bg-zinc-800 rounded-xl shadow-xl border border-white/10">
                      <Gift className="w-6 h-6 text-gold-400" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-extrabold mb-3 text-gold-gradient">Premium Gift!</h2>
                  <p className="text-zinc-400 mb-6 text-base leading-relaxed">
                    Unlock our most advanced AI features and ATS-premium layouts for{" "}
                    <span className="font-bold text-green-400">FREE</span> for your first 3 resumes!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGetPremium}
                    className="btn-invertase-glow w-full !py-4 !text-lg !rounded-xl"
                  >
                    <span>Claim My Premium Access</span>
                  </motion.button>
                  <p className="mt-4 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">No credit card required • Limited time offer</p>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-green-500/15 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Successfully Activated!</h3>
                <p className="text-zinc-400">Your account has been upgraded to Premium.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden font-sans">
      <PremiumModal />

      <Suspense fallback={<div className="fixed inset-0 bg-[#09090b]" />}>
        <VideoBackground />
      </Suspense>

      <Navbar user={user} />

      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 pt-28 pb-20 px-8 md:px-16 lg:px-24 min-h-[85vh] flex items-center">
        <div className="max-w-6xl w-full mx-auto">
          <div className="max-w-3xl">
            {/* Top badge */}
            <motion.div {...stagger(0)} className="flex justify-start mb-6">
              <span className="badge-pill !px-4 !py-1.5 !text-[11px] ring-1 ring-gold-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Resume Creation
              </span>
            </motion.div>

            {/* Premium Left-Aligned Headline - Tighter and smaller for viewport fitting */}
            <motion.h1
              {...stagger(0.1)}
              className="text-5xl sm:text-[70px] lg:text-[85px] font-bold text-hero-gradient text-invertase-headline mb-6 tracking-tighter leading-[0.9] !text-left drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            >
              Build your <span className="text-white">future</span>
              <br />
              <span className="text-gold-gradient drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]">with AI precision.</span>
            </motion.h1>

            {/* Sub-headline - Smaller and more compact */}
            <motion.p
              {...stagger(0.2)}
              className="text-lg sm:text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed !text-left font-medium"
            >
              The intelligent way to craft ATS-optimized resumes.
              Accelerate your career with Google Gemini-powered engineering.
            </motion.p>

            <motion.div
              {...stagger(0.3)}
              className="flex flex-col sm:flex-row items-center justify-start gap-10 mb-20"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
                className="btn-invertase-glow"
              >
                <span>{user ? "Go to Dashboard" : "Start Building Free"}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/examples")}
                className="btn-invertase-glow-secondary"
              >
                <span>Explore our services</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </motion.button>
            </motion.div>

            {/* Trusted By Section (Exact Image Match) */}
            {/* <motion.div
              {...stagger(0.4)}
              className="w-full"
            >
              <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-[0.1em] mb-10">
                TRUSTED BY INDUSTRY LEADERS
              </p>
              <div className="flex flex-wrap items-center justify-start gap-x-14 gap-y-10 opacity-60 grayscale contrast-125">
                <div className="h-8 flex items-center justify-center font-bold text-2xl tracking-tighter text-white">Google</div>
                <div className="h-8 flex items-center justify-center font-bold text-2xl tracking-tighter text-white">amazon</div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-zinc-400 rounded-sm flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-zinc-900 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
                    </div>
                  </div>
                  <span className="font-semibold text-xl text-zinc-300">Canonical</span>
                </div>
              </div>
            </motion.div> */}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS SECTION
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-8 md:px-16 border-y border-white/[0.05] bg-[#09090b]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { icon: Users, value: "12K+", label: "Active Users" },
            { icon: FileText, value: "65K+", label: "Resumes Created" },
            { icon: Briefcase, value: "92%", label: "Interview Rate" },
            { icon: Award, value: "4.9/5", label: "User Rating" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              {...stagger(i * 0.08)}
              className="text-left group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 mb-5 group-hover:bg-gold-500/15 transition-all duration-300 group-hover:scale-110">
                <stat.icon className="w-6 h-6 text-gold-400" />
              </div>
              <p className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">{stat.value}</p>
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES SECTION  (Invertase "Our services" style)
      ══════════════════════════════════════════════════ */}
      <section id="features" className="relative z-10 py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="mb-14">
            <div className="section-tag">
              <Zap className="w-3.5 h-3.5" />
              Core Features
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-4 text-invertase-headline">
              Why choose{" "}
              <span className="text-gold-gradient">AI Resume Builder</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl">
              Everything you need to craft a resume that gets noticed — built with cutting-edge AI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Brain,
                title: "AI-Powered Writing",
                desc: "Generate professional summaries and bullet points tailored to your target role, powered by Google's Gemini AI.",
                tag: "Smart Content",
              },
              {
                icon: Target,
                title: "ATS-Optimized",
                desc: "All templates are engineered to pass Applicant Tracking Systems with proper structure and keyword density.",
                tag: "Job-Ready",
              },
              {
                icon: Eye,
                title: "Real-Time Preview",
                desc: "Watch your resume come to life instantly as you type. What you see is exactly what employers receive.",
                tag: "Live Editor",
              },
              {
                icon: Download,
                title: "Easy PDF Export",
                desc: "One-click export to perfectly formatted PDF, ready to send to recruiters and upload to job boards.",
                tag: "Export",
              },
              {
                icon: Clock,
                title: "Lightning Fast",
                desc: "Create a professional, polished resume in minutes rather than hours. Your time is valuable.",
                tag: "Efficient",
              },
              {
                icon: Shield,
                title: "Smart Suggestions",
                desc: "Intelligent, context-aware recommendations for skills, keywords, and phrasing that align with top job listings.",
                tag: "Intelligent",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                {...stagger(i * 0.07)}
                className="invertase-card p-6 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center group-hover:bg-gold-500/15 transition-colors">
                    <f.icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-white text-base">{f.title}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/15">
                        {f.tag}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-gold-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS (Numbered steps)
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-5 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="mb-14">
            <div className="section-tag">
              <Target className="w-3.5 h-3.5" />
              Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-4 text-invertase-headline">
              Three steps to your{" "}
              <span className="text-gold-gradient">dream job</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl">
              Our streamlined workflow makes creating a standout resume effortless.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: FileText,
                title: "Enter Your Details",
                desc: "Fill in your experience, skills, and education. Our intelligent form guides you step-by-step, ensuring nothing important is missed.",
              },
              {
                step: "02",
                icon: Sparkles,
                title: "AI Enhancement",
                desc: "Our AI polishes your content, rewrites bullet points for impact, optimizes keywords, and tailors the copy to your target role.",
              },
              {
                step: "03",
                icon: Download,
                title: "Download & Apply",
                desc: "Export a perfect PDF and start applying. Your resume is saved to your account so you can update it any time.",
              },
            ].map((item, i) => (
              <motion.div key={i} {...stagger(i * 0.12)} className="relative group">
                {/* Connector line on desktop */}
                {i < 2 && (
                  <div className="hidden lg:block absolute top-10 left-full w-6 h-px bg-gradient-to-r from-gold-500/40 to-transparent z-10" />
                )}
                <div className="invertase-card p-7 h-full">
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0">
                      <div className="text-5xl font-black text-gold-500/10 group-hover:text-gold-500/15 transition-colors leading-none select-none">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-3 group-hover:bg-gold-500/15 transition-colors">
                        <item.icon className="w-4 h-4 text-gold-400" />
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...stagger(0.5)} className="mt-10 text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              className="btn-invertase-glow"
            >
              <span>{user ? "Go to Dashboard" : "Create My Resume"}</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TIPS / BLOG SECTION (Invertase "Blog" style)
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-5 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <motion.div {...fadeUp}>
              <div className="section-tag">
                <BookOpen className="w-3.5 h-3.5" />
                Resources
              </div>
              <h2 className="text-3xl sm:text-4xl text-white text-invertase-headline">
                Career insights &amp; resources
              </h2>
            </motion.div>
            <motion.button
              {...stagger(0.15)}
              onClick={() => navigate("/career-tips")}
              className="flex-shrink-0 text-sm text-zinc-400 hover:text-gold-400 transition-colors flex items-center gap-1 font-medium"
            >
              View all <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                category: "Career Tips",
                path: "/career-tips",
                title: "How to Write a Resume That Gets Noticed",
                desc: "Learn the proven framework for structuring your resume to capture recruiter attention in the first 6 seconds.",
                icon: TrendingUp,
                time: "5 min read",
              },
              {
                category: "Interview Tips",
                path: "/interview-tips",
                title: "Mastering Behavioral Interview Questions",
                desc: "Use the STAR method to answer tricky behavioral questions with confidence and impress any interviewer.",
                icon: MessageSquare,
                time: "7 min read",
              },
              {
                category: "Resume Tips",
                path: "/resume-tips",
                title: "ATS Optimization: Beat the Bots",
                desc: "Understand how Applicant Tracking Systems work and format your resume to always make it through.",
                icon: Shield,
                time: "6 min read",
              },
            ].map((post, i) => (
              <motion.div
                key={i}
                {...stagger(i * 0.1)}
                onClick={() => navigate(post.path)}
                className="invertase-card p-6 cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-md bg-gold-500/10 border border-gold-500/15 flex items-center justify-center">
                    <post.icon className="w-3.5 h-3.5 text-gold-400" />
                  </div>
                  <span className="text-xs font-semibold text-gold-400">{post.category}</span>
                  <span className="ml-auto text-xs text-zinc-600">{post.time}</span>
                </div>
                <h3 className="text-white font-bold text-base mb-2 leading-snug group-hover:text-gold-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-4">{post.desc}</p>
                <div className="flex items-center gap-1 text-gold-400 text-sm font-medium">
                  Read article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FAQ SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-5 border-t border-white/[0.05]">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <div className="section-tag mx-auto w-fit">
              <CheckCircle2 className="w-3.5 h-3.5" />
              FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl text-white mb-4 text-invertase-headline">
              Frequently asked questions
            </h2>
            <p className="text-zinc-400">Everything you need to know.</p>
          </motion.div>

          <div className="space-y-3">
            {[
              {
                q: "Is AI Resume Builder free to use?",
                a: "Yes! You can create and download professional resumes completely free. We believe everyone deserves access to great career tools.",
              },
              {
                q: "How does the AI writing assistance work?",
                a: "Our AI analyzes your experience and skills, then generates professional summaries and bullet points tailored to your target role. Powered by Google's Gemini AI.",
              },
              {
                q: "Are the resumes ATS-friendly?",
                a: "Absolutely. All templates are designed to pass Applicant Tracking Systems. We use clean formatting and proper structure that ATS software can parse easily.",
              },
              {
                q: "Can I edit my resume after creating it?",
                a: "Yes! Your resumes are automatically saved to your account. Return anytime to edit, update, or create new versions.",
              },
              {
                q: "What file formats can I download?",
                a: "We support PDF downloads — the most widely accepted format by employers — maintaining perfect formatting across all devices.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                {...stagger(i * 0.06)}
                className="invertase-card p-6"
              >
                <h3 className="text-white font-semibold mb-2 flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center text-xs font-bold mt-0.5">
                    ?
                  </span>
                  {faq.q}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed ml-8">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA BANNER (Invertase bottom CTA style)
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-5 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl border border-gold-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-900 p-12 md:p-16 text-center"
          >
            {/* Exact Invertase Hero Background */}
            <div className="absolute inset-0 z-0 bg-invertase-hero" />

            {/* Grid Texture */}
            <div className="absolute inset-0 z-0 grid-bg opacity-30" />

            {/* Animated Background Orbs (Subtle) */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold-600/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
            <div className="absolute inset-0 border border-gold-500/10 rounded-2xl" />

            <div className="relative">
              <div className="badge-pill mx-auto w-fit mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Start for Free Today
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white mb-8 text-invertase-headline">
                Ready to land your{" "}
                <span className="text-gold-gradient">dream job?</span>
              </h2>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <button
                  onClick={() => navigate(user ? "/dashboard" : "/auth")}
                  className="btn-invertase-glow py-4 px-10 text-lg"
                >
                  <span>Build My Resume Now</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/examples")}
                  className="btn-invertase-glow-secondary py-4 px-10 text-lg"
                >
                  <span>View Examples</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8">
                Join thousands of successful job seekers who built their winning resumes with AI Resume Builder.
                No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(user ? "/dashboard" : "/auth")}
                  className="btn-gold text-base"
                >
                  <Zap className="w-4 h-4" />
                  {user ? "Go to Dashboard" : "Create My Resume — Free"}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <button
                  onClick={() => navigate("/examples")}
                  className="btn-ghost text-base"
                >
                  Browse Templates
                </button>
              </div>
              <p className="mt-6 text-xs text-zinc-600">
                Free forever • No credit card • Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

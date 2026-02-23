import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Sparkles,
    Target,
    Layout,
    Search,
    ArrowRight,
    CheckCircle2,
    FileSearch,
    Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";

const ResumeTips = () => {
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

    const resumeTips = [
        {
            icon: Target,
            title: "ATS Optimization",
            description: "Ensure your resume beats the bots and reaches a human recruiter by using proper structure and keywords.",
            color: "blue",
            items: [
                "Include standard headings (Experience, Education, Skills)",
                "Use job-specific keywords from the description",
                "Avoid icons or graphics inside text fields",
                "Keep the structure simple and linear"
            ]
        },
        {
            icon: Layout,
            title: "Clean Formatting",
            description: "Recruiters spend an average of 6 seconds on their first scan. Make it count with a clear hierarchy.",
            color: "purple",
            items: [
                "Use professional, easy-to-read fonts",
                "Maintain consistent margins and padding",
                "Keep the resume to 1-2 pages maximum",
                "Use bold text for titles and company names"
            ]
        },
        {
            icon: Search,
            title: "Keyword Focus",
            description: "Mirroring the job description is the fastest way to show you're the right fit for the role.",
            color: "pink",
            items: [
                "Match skill terms exactly as they appear",
                "Repeat key technical skills 2-3 times",
                "Focus on tools mentioned in 'Requirements'",
                "Avoid excessive buzzwords without proof"
            ]
        },
        {
            icon: Zap,
            title: "Quantifiable Results",
            description: "Move beyond listing duties. Show exactly how much value you created with numbers.",
            color: "orange",
            items: [
                "Use the formula: [Action Verb] + [Task] + [Result]",
                "Mention revenue growth or cost savings",
                "Include team sizes or user base numbers",
                "Highlight percentage improvements"
            ]
        },
        {
            icon: FileSearch,
            title: "Error-Free Drafting",
            description: "A single typo can cost you an interview. Precision is a key professional skill.",
            color: "cyan",
            items: [
                "Use the builder's built-in spell checker",
                "Double-check dates and contact details",
                "Ensure consistent punctuation in bullets",
                "Verify all links (LinkedIn/GitHub) work"
            ]
        }
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
                    className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[120px]"
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
                        <FileSearch className="w-4 h-4" />
                        Resume Secrets
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight"
                    >
                        Master Your <br />
                        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                            Professional Pitch
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed"
                    >
                        Insights on layout, keywords, and ATS optimization to help your resume land in the "Yes" pile every single time.
                    </motion.p>
                </motion.section>

                {/* Tips Section - Modern Minimal Cards */}
                <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
                >
                    {resumeTips.map((tip, idx) => (
                        <motion.article
                            key={idx}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                            className="group relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-3xl p-6 shadow-xl shadow-gray-200/20 dark:shadow-black/40 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                                    <tip.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h2 className="text-xl font-bold">{tip.title}</h2>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                                {tip.description}
                            </p>

                            <div className="space-y-3">
                                {tip.items.map((item, iIdx) => (
                                    <div key={iIdx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Decorative line */}
                            <div className="absolute top-0 right-0 p-8">
                                <div className="w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors duration-500" />
                            </div>
                        </motion.article>
                    ))}
                </motion.section>

                {/* Bottom CTA Block */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-[3rem] overflow-hidden p-1 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 mb-20"
                >
                    <div className="relative bg-white dark:bg-black rounded-[2.9rem] py-12 px-6 flex flex-col items-center">
                        <div className="p-4 bg-purple-100 dark:bg-purple-900/40 rounded-2xl mb-6">
                            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-center">Put These Tips Into Action</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10 text-center">
                            Don't just read about it. Our AI-builder is pre-configured with these professional standards.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(user ? "/dashboard" : "/auth")}
                                className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/25 transition-all"
                            >
                                Go to Builder
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/examples")}
                                className="px-10 py-4 border-2 border-gray-200 dark:border-gray-800 rounded-2xl font-bold bg-white/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-gray-300"
                            >
                                View Examples
                            </motion.button>
                        </div>
                    </div>
                </motion.section>
            </main>
        </div>
    );
};

export default ResumeTips;

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Scale, ShieldCheck, Zap, Globe, ArrowDown } from "lucide-react";
import { getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";

const TermsOfService = () => {
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    const colorMap = {
        orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
        emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
        blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    };

    const steps = [
        {
            icon: ShieldCheck,
            title: "User Responsibility",
            color: "orange",
            content: "You are responsible for the accuracy of the information provided in your resume. Ensure you have the right to use any content you upload."
        },
        {
            icon: Zap,
            title: "Service Usage",
            color: "emerald",
            content: "Our AI-powered tools are designed to assist, but do not guarantee employment. Use the generated content as a professional baseline."
        },
        {
            icon: Globe,
            title: "Global Compliance",
            color: "blue",
            content: "By using our platform, you agree to comply with all local and international laws regarding digital content and personal data."
        }
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-gray-900 dark:text-gray-100 overflow-x-hidden pt-16">
            <Navbar user={user} />

            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
            </div>

            <main className="container relative z-10 mx-auto px-6 max-w-3xl py-8 md:py-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                        <Scale className="w-3 h-3" />
                        Legal Framework
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">Terms of Service</h1>
                    <p className="text-xs text-gray-400">Last Updated: Feb 2026</p>
                </motion.div>

                {/* Flow Chart Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative flex flex-col items-center"
                >
                    {steps.map((step, idx) => (
                        <div key={idx} className="w-full flex flex-col items-center">
                            <motion.div
                                variants={itemVariants}
                                className="w-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg shadow-gray-200/10 dark:shadow-black/20 flex flex-col md:flex-row-reverse items-center gap-6"
                            >
                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[step.color]}`}>
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <div className="text-center md:text-right flex-1">
                                    <h2 className="text-lg font-bold mb-1">{step.title}</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {step.content}
                                    </p>
                                </div>
                            </motion.div>

                            {idx < steps.length - 1 && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 40 }}
                                    transition={{ delay: idx * 0.3 + 0.5, duration: 0.5 }}
                                    className="w-px bg-gradient-to-b from-orange-500/50 to-emerald-500/50 relative"
                                >
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-1 bg-white dark:bg-black rounded-full border border-gray-200 dark:border-gray-800">
                                        <ArrowDown className="w-3 h-3 text-orange-500" />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* Acceptance Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-12 text-center"
                >
                    <p className="text-xs text-gray-400 italic">
                        By using the AI Resume Builder, you acknowledge that you have read and agreed to these terms.
                    </p>
                </motion.div>
            </main>
        </div>
    );
};

export default TermsOfService;

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, ArrowDown } from "lucide-react";
import { getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";

const PrivacyPolicy = () => {
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
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    const steps = [
        {
            icon: Shield,
            title: "Data Collection",
            color: "blue",
            content: "We collect only essential information required to build your resume: name, contact details, work history, and education background."
        },
        {
            icon: Eye,
            title: "Data Usage",
            color: "purple",
            content: "Your data is used exclusively for generating resumes. We never sell your personal data. All information is encrypted and secure."
        },
        {
            icon: FileText,
            title: "Your Rights",
            color: "pink",
            content: "You have full control. View, modify, or delete your resumes and account information at any time through your dashboard."
        }
    ];

    const colorMap = {
        blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
        purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
        pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-gray-900 dark:text-gray-100 overflow-x-hidden pt-16">
            <Navbar user={user} />

            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <main className="container relative z-10 mx-auto px-6 max-w-3xl py-8 md:py-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                        <Lock className="w-3 h-3" />
                        Privacy Protocol
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">Privacy Policy</h1>
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
                                className="w-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg shadow-gray-200/10 dark:shadow-black/20 flex flex-col md:flex-row items-center gap-6"
                            >
                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[step.color]}`}>
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <div className="text-center md:text-left">
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
                                    className="w-px bg-gradient-to-b from-purple-500/50 to-blue-500/50 relative"
                                >
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-1 bg-white dark:bg-black rounded-full border border-gray-200 dark:border-gray-800">
                                        <ArrowDown className="w-3 h-3 text-purple-500" />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* Secure Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-12 flex flex-col items-center gap-3 opacity-60"
                >
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                        <Shield className="w-4 h-4" />
                        End-to-End Encrypted Data Storage
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;

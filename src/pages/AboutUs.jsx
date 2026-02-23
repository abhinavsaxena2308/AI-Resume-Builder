import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/integrations/firebase/client";
import {
    Sparkles,
    Workflow,
    Code2,
    Rocket,
    Github,
    Linkedin,
    Twitter,
    Database,
    BrainCircuit,
    Laptop,
    X,
    Send
} from "lucide-react";

const AboutUs = () => {
    const [user, setUser] = useState(null);
    const [activeNode, setActiveNode] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    useEffect(() => {
        getCurrentUser().then((u) => {
            if (u) setUser(u);
        });
    }, []);

    const flowSteps = [
        {
            icon: Database,
            title: "Data Collection",
            desc: "We gather your raw experience and skills effortlessly.",
            color: "from-blue-500 to-cyan-500",
            shadow: "shadow-blue-500/20"
        },
        {
            icon: BrainCircuit,
            title: "AI Processing",
            desc: "Gemini AI refines, enhances, and optimizes your content.",
            color: "from-purple-500 to-pink-500",
            shadow: "shadow-purple-500/20"
        },
        {
            icon: Laptop,
            title: "ATS Generation",
            desc: "Perfectly formatted PDF resumes tailored to pass ATS.",
            color: "from-orange-500 to-red-500",
            shadow: "shadow-orange-500/20"
        }
    ];

    const teamMembers = [
        {
            name: "Abhinav Saxena",
            role: "Founder & Lead Engineer",
            image: "https://avatars.githubusercontent.com/u/124580551?v=4",
            skills: ["React", "AI", "Node.js"],
            bio: "Crafting the future of automated career growth.",
        },
        // {
        //     name: "Alex Designer",
        //     role: "UX/UI Director",
        //     image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=ffdfbf,c0aede",
        //     skills: ["Figma", "Design", "CSS"],
        //     bio: "Making complex systems look effortlessly beautiful.",
        // }
    ];

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("Contact Form Submitted:", formData);
        setIsModalOpen(false);
        setFormData({ name: "", email: "", message: "" });
    };

    // Animations
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
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-gray-900 dark:text-gray-100 overflow-hidden font-sans pt-20">
            <Navbar user={user} />

            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ rotate: -360, scale: [1, 1.5, 1] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px]"
                />
            </div>

            <div className="container relative z-10 mx-auto px-4 h-full min-h-[calc(100vh-80px)] flex flex-col justify-center py-6">

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-8"
                >
                    {/* Left Side: The "Flowchart" / How it Works section (Taking minimal vertical space) */}
                    <motion.div variants={itemVariants} className="w-full md:w-1/2 flex flex-col justify-center">

                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider mb-6 w-max">
                            <Workflow className="w-4 h-4" />
                            The Architecture
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            How The Magic <br /> Happens
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 max-w-md">
                            Hover over our engine components to see how we turn your raw data into career-ready masterpieces instantly.
                        </p>

                        {/* Interactive Flowchart */}
                        <div className="relative">
                            {/* Connecting Line */}
                            <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-orange-500 rounded-full opacity-20" />

                            <div className="flex flex-col gap-6">
                                {flowSteps.map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        onHoverStart={() => setActiveNode(idx)}
                                        className="relative flex items-center gap-6 cursor-pointer group"
                                    >
                                        {/* Animated Arrow connecting to node */}
                                        <AnimatePresence>
                                            {activeNode === idx && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="absolute left-[22px] w-6 h-[2px] bg-purple-500 z-10"
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: 24 }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                />
                                            )}
                                        </AnimatePresence>

                                        {/* Node Icon */}
                                        <motion.div
                                            layout
                                            className={`relative z-20 w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg ${activeNode === idx ? step.shadow : ''} transition-all duration-300`}
                                            animate={{
                                                scale: activeNode === idx ? 1.15 : 1,
                                                rotate: activeNode === idx ? [0, -5, 5, 0] : 0
                                            }}
                                            transition={{ rotate: { duration: 0.5 } }}
                                        >
                                            <step.icon className="w-6 h-6" />
                                            {activeNode === idx && (
                                                <span className="absolute inset-0 rounded-2xl border-2 border-white/40 animate-ping opacity-50" />
                                            )}
                                        </motion.div>

                                        {/* Node Content */}
                                        <div className="flex-1">
                                            <h3 className={`text-xl font-bold transition-colors duration-300 ${activeNode === idx ? 'text-purple-600 dark:text-purple-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                                {step.title}
                                            </h3>
                                            <AnimatePresence>
                                                {activeNode === idx && (
                                                    <motion.p
                                                        initial={{ opacity: 0, height: 0, mt: 0 }}
                                                        animate={{ opacity: 1, height: "auto", mt: 4 }}
                                                        exit={{ opacity: 0, height: 0, mt: 0 }}
                                                        className="text-gray-500 dark:text-gray-400 text-sm overflow-hidden"
                                                    >
                                                        {step.desc}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: The Team section */}
                    <motion.div variants={itemVariants} className="w-full md:w-1/2 flex flex-col mt-10 md:mt-0">
                        <div className="flex flex-col gap-6 w-full max-w-lg mx-auto md:ml-auto md:mr-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full text-xs font-bold uppercase tracking-wider w-max mb-2">
                                <Code2 className="w-4 h-4" />
                                The Brains Behind It
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                {teamMembers.filter(m => m.name === "Abhinav Saxena").map((member, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        className="group relative w-full max-w-md bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/20 dark:shadow-black/40 overflow-hidden"
                                    >
                                        {/* Hover Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Avatar */}
                                        <div className="relative w-32 h-32 mx-auto mb-6 rounded-full p-1.5 bg-gradient-to-tr from-purple-500 to-pink-500 overflow-visible shadow-lg shadow-purple-500/20">
                                            <motion.img
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover rounded-full bg-white dark:bg-gray-800"
                                            />
                                            <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-gray-900 shadow-sm" />
                                        </div>

                                        <div className="text-center relative z-10">
                                            <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                {member.name}
                                            </h3>
                                            <p className="text-sm font-semibold text-pink-500 mb-4 tracking-wide uppercase">{member.role}</p>
                                            <p className="text-base text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                                                {member.bio}
                                            </p>

                                            <div className="flex flex-wrap justify-center gap-2 mb-6 relative z-20">
                                                {member.skills.map((skill, sIdx) => (
                                                    <span key={sIdx} className="text-xs px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-xl font-medium border border-purple-100 dark:border-purple-800/30">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-center gap-3">
                                                <motion.a whileHover={{ scale: 1.2, color: "#a855f7" }} href="#" className="text-gray-400 transition-colors pointer-events-auto">
                                                    <Github className="w-4 h-4" />
                                                </motion.a>
                                                <motion.a whileHover={{ scale: 1.2, color: "#ec4899" }} href="#" className="text-gray-400 transition-colors pointer-events-auto">
                                                    <Linkedin className="w-4 h-4" />
                                                </motion.a>
                                                <motion.a whileHover={{ scale: 1.2, color: "#3b82f6" }} href="#" className="text-gray-400 transition-colors pointer-events-auto">
                                                    <Twitter className="w-4 h-4" />
                                                </motion.a>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Bottom Mini CTA */}
                            <motion.div
                                onClick={() => setIsModalOpen(true)}
                                whileHover={{ scale: 1.01 }}
                                className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-between shadow-lg shadow-purple-500/25 relative overflow-hidden group border border-white/10 cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                                <div className="relative z-10">
                                    <h4 className="font-bold text-lg mb-1">Want to join us?</h4>
                                    <p className="text-white/80 text-sm">We're always looking for talent.</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="relative z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-md"
                                >
                                    <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </motion.button>
                            </motion.div>

                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Contact Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Join Our Mission</h2>
                                    <p className="text-white/80 text-sm mt-1">Let's build something great together.</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body / Form */}
                            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all dark:text-white"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all dark:text-white"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none dark:text-white"
                                        placeholder="I'd love to join the team as a..."
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                    Send Message
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AboutUs;

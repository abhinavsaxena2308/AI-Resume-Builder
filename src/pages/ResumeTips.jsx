import { useState, useEffect, useRef } from "react";
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
    Zap,
    User,
    Briefcase,
    GraduationCap,
    Star,
    Code,
    Award,
    BadgeCheck,
    ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";

const ResumeTips = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const sectionsRef = useRef({});
    const [activeTab, setActiveTab] = useState("personal");

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
        }
    ];

    const guideSections = [
        { id: "personal", icon: User, label: "Header", title: "Personal Information" },
        { id: "summary", icon: FileText, label: "Summary", title: "Professional Summary" },
        { id: "experience", icon: Briefcase, label: "Work", title: "Work Experience" },
        { id: "education", icon: GraduationCap, label: "Education", title: "Education" },
        { id: "skills", icon: Star, label: "Skills", title: "Skills & Expertise" },
        { id: "projects", icon: Code, label: "Projects", title: "Key Projects" },
    ];

    const scrollToSection = (id) => {
        const element = sectionsRef.current[id];
        if (element) {
            const offset = element.offsetTop - 100;
            window.scrollTo({ top: offset, behavior: "smooth" });
            setActiveTab(id);
        }
    };

    const TipCard = ({ title, badge, items, example }) => {
        const [open, setOpen] = useState(false);
        return (
            <div className="rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shadow-sm overflow-hidden">
                <button
                    onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">{title}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                            {badge}
                        </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4"
                        >
                            <ul className="space-y-2 mb-4">
                                {items.map((item, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            {example && (
                                <div className="p-3 bg-gray-50 dark:bg-black/40 rounded-xl border border-gray-200/50 dark:border-gray-800/50 italic text-xs">
                                    <span className="font-bold non-italic text-purple-600 mr-1 italic">Pro Example:</span> "{example}"
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-gray-900 dark:text-gray-100 overflow-x-hidden font-sans pt-16">
            <Navbar user={user} />

            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[120px]" />
            </div>

            <main className="container relative z-10 mx-auto px-6 max-w-7xl">
                {/* HERO HEADER */}
                <section className="text-center py-8 md:py-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        Resume Mastery Guide
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
                    >
                        Build a Resume That <br />
                        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                            Actually Gets Read
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
                    >
                        Combine ATS optimization algorithms with human-centric design. This guide breaks down every section of your professional profile with data-backed tips and examples.
                    </motion.p>
                </section>

                {/* TOP LEVEL SECRETS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {resumeTips.map((tip, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-3xl border border-gray-200/50 dark:border-gray-800/50 hover:border-purple-500/30 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <tip.icon className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{tip.description}</p>
                            <ul className="space-y-2">
                                {tip.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* SECTION BY SECTION GUIDE */}
                <div className="relative grid lg:grid-cols-[250px_1fr] gap-12 mb-12">
                    {/* Navigation Sidebar */}
                    <aside className="hidden lg:block sticky top-24 self-start space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-4">Section Guide</h4>
                        {guideSections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === section.id
                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                <section.icon className="w-4 h-4" />
                                <span className="text-sm font-bold">{section.label}</span>
                            </button>
                        ))}
                    </aside>

                    {/* Detailed Content */}
                    <div className="space-y-16">
                        <section ref={el => sectionsRef.current.personal = el} className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                                    <User className="w-7 h-7 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-extrabold uppercase tracking-tight">Personal Information</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <TipCard title="Contact Essentials" badge="Core" items={["Full Name (Professional)", "City, State/Country", "One Phone Number", "Email Address (No nicknames)"]} example="Alex Chen | Austin, TX | alex.chen@email.com" />
                                <TipCard title="Links & Profiles" badge="Digital" items={["LinkedIn (Updated)", "Portfolio (If creative)", "GitHub (If technical)"]} />
                                <TipCard title="Formatting" badge="Standard" items={["Single line or small block", "Clean font style", "No photos/images"]} />
                                <TipCard title="Avoid" badge="Safety" items={["Full home address", "Marital status", "Secondary emails"]} />
                            </div>
                        </section>

                        <section ref={el => sectionsRef.current.summary = el} className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                                    <FileText className="w-7 h-7 text-purple-600" />
                                </div>
                                <h2 className="text-3xl font-extrabold uppercase tracking-tight">Professional Summary</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <TipCard title="The Elevator Pitch" badge="Writing" items={["Who are you professionally?", "What are your 2 biggest hits?", "What value do you offer?"]} example="Senior Data Analyst with 5+ years of experience in e-commerce, specializing in predictive modeling and revenue optimization." />
                                <TipCard title="Formatting" badge="Structure" items={["3-4 sentences max", "Avoid dense blocks", "Punchy action verbs"]} />
                            </div>
                        </section>

                        <section ref={el => sectionsRef.current.experience = el} className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-2xl">
                                    <Briefcase className="w-7 h-7 text-pink-600" />
                                </div>
                                <h2 className="text-3xl font-extrabold uppercase tracking-tight">Work Experience</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <TipCard title="Result-Oriented Bullets" badge="Strategy" items={["Use numbers ($, %, #)", "Focus on outcomes, not tasks", "Standard Action + Task + Result formula"]} example="Optimized checkout flow resulting in a 12% decrease in cart abandonment and $50k monthly revenue increase." />
                                <TipCard title="Organization" badge="Layout" items={["Reverse chronological", "Consistent company titles", "Right-aligned dates"]} />
                            </div>
                        </section>

                        <section ref={el => sectionsRef.current.education = el} className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl">
                                    <GraduationCap className="w-7 h-7 text-orange-600" />
                                </div>
                                <h2 className="text-3xl font-extrabold uppercase tracking-tight">Education</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <TipCard title="Academic Highlights" badge="Standard" items={["Degree Name", "University/Institution", "Graduation Year", "Honors/GPA (If high)"]} />
                                <TipCard title="Placement" badge="Flow" items={["Place at bottom if experienced", "Place at top if recent grad", "Only major coursework"]} />
                            </div>
                        </section>

                        <section ref={el => sectionsRef.current.skills = el} className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl">
                                    <Star className="w-7 h-7 text-cyan-600" />
                                </div>
                                <h2 className="text-3xl font-extrabold uppercase tracking-tight">Skills & Expertise</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <TipCard title="Hard Skills" badge="Focus" items={["Languages & Frameworks", "Tools & Software", "Technical Methodologies"]} />
                                <TipCard title="Grouping" badge="Recruiters" items={["Categorize by type", "Prioritize JD keywords", "Depth over volume"]} />
                            </div>
                        </section>

                        <section ref={el => sectionsRef.current.projects = el} className="scroll-mt-24">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
                                    <Code className="w-7 h-7 text-emerald-600" />
                                </div>
                                <h2 className="text-3xl font-extrabold uppercase tracking-tight">Key Projects</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <TipCard title="Demonstrating Skill" badge="Signal" items={["Name/Role in project", "Tech stack used", "Objective of the project", "Link to repo/demo"]} />
                                <TipCard title="Impact" badge="Proof" items={["Scale of use", "Performance metrics", "Unique problem solved"]} />
                            </div>
                        </section>
                    </div>
                </div>

                {/* FINAL CTA */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-[3rem] overflow-hidden p-10 text-center bg-gray-900 dark:bg-gray-900/60 border border-gray-800 mb-12 shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Ready to Build?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
                            Don't just memorize the rules. Our builder is engineered to apply these standards automatically while you type.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => navigate(user ? "/dashboard" : "/auth")}
                                className="px-10 py-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform rounded-2xl text-lg font-bold"
                            >
                                Start Building Free
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate("/examples")}
                                className="px-10 py-7 border-gray-700 bg-transparent text-white hover:bg-gray-800 rounded-2xl text-lg font-bold"
                            >
                                View Examples
                            </Button>
                        </div>
                    </div>
                </motion.section>
            </main>
        </div>
    );
};

export default ResumeTips;

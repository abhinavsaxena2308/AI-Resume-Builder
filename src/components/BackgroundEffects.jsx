import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FileText,
    Sparkles,
    Workflow,
    Code2,
    Database,
    Rocket,
    CheckCircle2,
    Briefcase
} from "lucide-react";

const BackgroundEffects = () => {
    const location = useLocation();
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Do not render on builder or dashboard pages
    const isExcluded = location.pathname.includes("/builder") || location.pathname.includes("/dashboard");

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isExcluded) return null;

    // Icons used for floating effect
    const icons = [FileText, Sparkles, Workflow, Code2, Database, Rocket, CheckCircle2, Briefcase];

    // Generate deterministic but random-looking floating icons
    const floatingIcons = Array.from({ length: 15 }).map((_, i) => {
        const Icon = icons[i % icons.length];
        const size = Math.random() * 20 + 20; // 20px to 40px
        const initialX = Math.random() * dimensions.width;
        const initialY = Math.random() * dimensions.height;

        return { id: i, Icon, size, initialX, initialY };
    });

    // Generate raindrop lines
    const raindrops = Array.from({ length: 25 }).map((_, i) => {
        const delay = Math.random() * 5;
        const duration = Math.random() * 2 + 3; // 3 to 5 seconds
        const left = Math.random() * 100; // 0 to 100%

        return { id: i, delay, duration, left };
    });

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

            {/* 1. Raindrops Effect */}
            <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.2]">
                {raindrops.map((drop) => (
                    <motion.div
                        key={`rain-${drop.id}`}
                        className="absolute top-0 w-[1px] h-20 bg-gradient-to-b from-transparent via-purple-500 to-pink-500"
                        style={{ left: `${drop.left}%` }}
                        initial={{ y: -100, opacity: 0 }}
                        animate={{
                            y: dimensions.height + 100,
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: drop.duration,
                            repeat: Infinity,
                            delay: drop.delay,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* 2. Floating Icons Effect */}
            <div className="absolute inset-0 opacity-[0.2] dark:opacity-[0.08]">
                {floatingIcons.map((obj) => (
                    <motion.div
                        key={`icon-${obj.id}`}
                        className="absolute text-purple-600 dark:text-purple-400"
                        style={{ x: obj.initialX, y: obj.initialY }}
                        animate={{
                            y: [obj.initialY, obj.initialY - 50, obj.initialY + 50, obj.initialY],
                            x: [obj.initialX, obj.initialX + 30, obj.initialX - 30, obj.initialX],
                            rotate: [0, 90, 180, 360],
                            scale: [1, 1.2, 0.9, 1]
                        }}
                        transition={{
                            duration: Math.random() * 15 + 20, // 20s to 35s
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <obj.Icon size={obj.size} />
                    </motion.div>
                ))}
            </div>

        </div>
    );
};

export default BackgroundEffects;

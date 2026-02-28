import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const templates = [
  {
    id: "modern",
    name: "Modern",
    color: "from-blue-500 to-cyan-500",
    dot: "bg-blue-500",
    desc: "Clean & contemporary",
  },
  {
    id: "classic",
    name: "Classic",
    color: "from-gray-500 to-slate-600",
    dot: "bg-gray-500",
    desc: "Traditional & formal",
  },
  {
    id: "ats",
    name: "ATS-Friendly",
    color: "from-emerald-500 to-teal-600",
    dot: "bg-emerald-500",
    desc: "Optimized for parsers",
  },
];

const TemplateSelector = ({ selectedTemplate, onSelect }) => {
  return (
    <div className="flex gap-2">
      {templates.map((t) => {
        const active = selectedTemplate === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            title={t.desc}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${active
              ? "bg-white dark:bg-gray-800 border-purple-400 dark:border-purple-600 text-purple-700 dark:text-purple-300 shadow-sm"
              : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
          >
            <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${t.color} shrink-0`} />
            {t.name}
            {active && <CheckCircle2 className="w-3 h-3 text-purple-500 ml-0.5" />}
          </button>
        );
      })}
    </div>
  );
};

export default TemplateSelector;

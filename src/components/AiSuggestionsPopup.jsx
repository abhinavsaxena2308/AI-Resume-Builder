import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Loader2, Lightbulb, X, CheckCircle2, ListChecks,
  FileText, Code2, Wand2, ChevronRight, AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useGeminiSuggestions from "@/hooks/useGeminiSuggestions";
import { motion, AnimatePresence } from "framer-motion";

const userTypeConfig = {
  Coder: { emoji: "💻", label: "Coder / Developer", color: "blue" },
  Researcher: { emoji: "🔬", label: "Researcher / Academic", color: "green" },
  Student: { emoji: "🎓", label: "Student", color: "amber" },
  Designer: { emoji: "🎨", label: "Designer / Creative", color: "pink" },
  Other: { emoji: "✨", label: "Other Professional", color: "purple" },
};

const AiSuggestionsPopup = ({ isOpen, onClose, resumeData, onApplySuggestions }) => {
  const { toast } = useToast();
  const { loading, error, suggestions, fetchSuggestions } = useGeminiSuggestions();
  const [userType, setUserType] = useState("");
  const [appliedSections, setAppliedSections] = useState({});

  const handleGetSuggestions = async () => {
    if (!userType) {
      toast({ title: "Select your role", description: "Please choose your profession type first.", variant: "destructive" });
      return;
    }
    try {
      await fetchSuggestions(userType, resumeData);
      toast({ title: "Suggestions ready!", description: "AI has generated personalized suggestions for your resume." });
    } catch (err) {
      toast({ title: "Error", description: err.message || "Failed to generate suggestions", variant: "destructive" });
    }
  };

  const handleApplySection = (section) => {
    if (onApplySuggestions && suggestions) {
      onApplySuggestions(section, suggestions[section]);
      setAppliedSections(prev => ({ ...prev, [section]: true }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm shadow-purple-500/30">
                  <Wand2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">AI Resume Suggestions</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Personalized recommendations based on your role</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Role selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                I am a…
              </label>
              <div className="flex gap-2">
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger className="flex-1 h-9 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg">
                    <SelectValue placeholder="Select your profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(userTypeConfig).map(([value, { emoji, label }]) => (
                      <SelectItem key={value} value={value}>
                        <span className="flex items-center gap-2">
                          <span>{emoji}</span> {label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleGetSuggestions}
                  disabled={loading || !userType}
                  className="h-9 px-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90 shadow-sm shadow-purple-500/20 disabled:opacity-40 gap-1.5 text-sm"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  {loading ? "Generating…" : "Get Suggestions"}
                </Button>
              </div>
            </div>

            {/* Error state */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="relative">
                  <div className="w-12 h-12 border-3 border-purple-200 dark:border-purple-900 rounded-full" />
                  <div className="w-12 h-12 border-3 border-transparent border-t-purple-500 rounded-full animate-spin absolute top-0" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Generating suggestions…</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Our AI is analyzing your profile</p>
                </div>
              </div>
            )}

            {/* Empty / initial state */}
            {!suggestions && !loading && !error && (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 flex items-center justify-center">
                  <Lightbulb className="h-7 w-7 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Select your role to get started</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    We'll generate role-specific recommendations for your summary, skills, and resume structure
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {Object.entries(userTypeConfig).map(([value, { emoji, label }]) => (
                    <button
                      key={value}
                      onClick={() => setUserType(value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${userType === value ? "bg-purple-100 dark:bg-purple-900/50 border-purple-400 text-purple-700 dark:text-purple-300" : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-300 dark:hover:border-purple-700"}`}
                    >
                      {emoji} {label.split(" / ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {suggestions && !loading && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    Suggestions generated for {userTypeConfig[userType]?.emoji} {userTypeConfig[userType]?.label}
                  </p>
                </div>

                {/* Recommended Sections */}
                {suggestions.recommendedSections?.length > 0 && (
                  <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-4 py-3 bg-blue-50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/30 flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-blue-500" />
                      <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Recommended Sections</h3>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {suggestions.recommendedSections.map((section, i) => (
                          <Badge key={i} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 cursor-default text-xs">
                            <ChevronRight className="w-3 h-3 mr-0.5" />{section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary Suggestion */}
                {suggestions.summarySuggestion && (
                  <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-4 py-3 bg-purple-50 dark:bg-purple-950/20 border-b border-purple-100 dark:border-purple-900/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-500" />
                        <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300">Suggested Summary</h3>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleApplySection("summarySuggestion")}
                        disabled={appliedSections.summarySuggestion}
                        className={`h-7 px-3 text-xs gap-1 ${appliedSections.summarySuggestion ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:text-purple-600"}`}
                      >
                        {appliedSections.summarySuggestion ? <><CheckCircle2 className="w-3 h-3" /> Applied</> : "Apply"}
                      </Button>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
                        "{suggestions.summarySuggestion}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Recommended Skills */}
                {suggestions.recommendedSkills?.length > 0 && (
                  <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-4 py-3 bg-pink-50 dark:bg-pink-950/20 border-b border-pink-100 dark:border-pink-900/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-pink-500" />
                        <h3 className="text-sm font-semibold text-pink-800 dark:text-pink-300">
                          Recommended Skills
                          <span className="ml-1.5 text-xs font-normal text-pink-500">({suggestions.recommendedSkills.length})</span>
                        </h3>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleApplySection("recommendedSkills")}
                        disabled={appliedSections.recommendedSkills}
                        className={`h-7 px-3 text-xs gap-1 ${appliedSections.recommendedSkills ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:text-purple-600"}`}
                      >
                        {appliedSections.recommendedSkills ? <><CheckCircle2 className="w-3 h-3" /> Added</> : "Add All"}
                      </Button>
                    </div>
                    <div className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {suggestions.recommendedSkills.map((skill, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.04 }}
                            className="px-2.5 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 shrink-0">
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Powered by Google Gemini AI · Suggestions are role-based templates, not based on your data
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AiSuggestionsPopup;
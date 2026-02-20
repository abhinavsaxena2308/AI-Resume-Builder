import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Sparkles, ClipboardList, MessageCircle, Hand, MailCheck } from "lucide-react";
import { getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";

const InterviewTips = () => {
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

  const sections = [
    {
      key: "preparation",
      icon: ClipboardList,
      title: "Preparation Strategies",
      imageAlt: "AI-generated illustration of a candidate preparing for an interview",
      imageSrc: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
      points: [
        "Research the company, role, and team structure in depth.",
        "Prepare concise stories using the STAR method for key achievements.",
        "Align your skills and examples with the job description requirements.",
      ],
    },
    {
      key: "questions",
      icon: MessageCircle,
      title: "Common Questions",
      imageAlt: "AI-generated illustration of a conversation during an interview",
      imageSrc: "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg",
      points: [
        "Practice answers for questions about your background and motivations.",
        "Prepare role-specific technical or case study examples.",
        "Develop thoughtful questions to ask the interviewer about the role.",
      ],
    },
    {
      key: "body-language",
      icon: Hand,
      title: "Body Language & Presence",
      imageAlt: "AI-generated illustration emphasizing confident body language in an interview",
      imageSrc: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg",
      points: [
        "Maintain open posture, steady eye contact, and relaxed shoulders.",
        "Use natural gestures to emphasize key points without overdoing it.",
        "Match your tone and pace to the conversation while staying authentic.",
      ],
    },
    {
      key: "follow-up",
      icon: MailCheck,
      title: "Follow-up Protocols",
      imageAlt: "AI-generated illustration of a follow-up email after an interview",
      imageSrc: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
      points: [
        "Send a personalized thank-you email within 24 hours.",
        "Reiterate your interest and highlight one or two key discussion points.",
        "Politely follow up if you have not heard back within the agreed timeframe.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-black dark:to-purple-950 text-gray-900 dark:text-gray-100 pt-20">
      <Navbar user={user} />
      <main className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 max-w-6xl">
        <section className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Interview Tips
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Ace Your Next Interview With Confidence
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Use structured preparation, strong communication, and thoughtful follow-up to stand out in every interview round.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 text-base sm:text-lg rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:opacity-95 transition-all"
            >
              Practice With My Resume
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/examples")}
              className="border-border text-gray-800 dark:text-gray-100 hover:bg-accent px-6 py-3 text-sm sm:text-base rounded-xl"
            >
              View Strong Resume Examples
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section.key}
              className="rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden"
            >
              <div className="relative w-full h-40 sm:h-48 overflow-hidden">
                <img
                  src={section.imageSrc}
                  alt={section.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
                    <section.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {section.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-12 sm:mt-16 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/60 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Turn Interview Insights Into Offers
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl">
              Use these interview strategies together with your AI-optimized resume to present a consistent, compelling story from application to offer.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:opacity-95 transition-all w-full sm:w-auto"
            >
              Open Resume Builder
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/career-tips")}
              className="border-border text-gray-800 dark:text-gray-100 hover:bg-accent px-6 py-3 rounded-xl w-full sm:w-auto"
            >
              Explore Career Tips
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InterviewTips;


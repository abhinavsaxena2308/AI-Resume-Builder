import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { Link } from "react-router-dom"; 
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Update HTML class and save theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // Load Supabase user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
      else setUser(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-800" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI Resume Builder
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition"
              >
                Hi, {user.user_metadata?.full_name || user.email}
              </button>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition"
              >
                Sign Up
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="px-3 py-2 border rounded-3xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="inline-block px-4 py-2 bg-purple-100  text-purple-800 dark:bg-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
            AI-Powered Resume Creation
          </span>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            Build Your{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Perfect Resume
            </span>{" "}
            in Minutes
          </h1>

          <p className="text-xl text-gray-700 dark:text-gray-300">
            Create professional, ATS-friendly resumes with AI assistance. Stand out and land your dream job faster.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition"
            >
              {user ? "Go to Dashboard" : "Start Building Free"}
            </button>
            <button
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              View Examples
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>
          <img
            src={heroImage}
            alt="Resume Builder Interface"
            className="relative rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-bold">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI Resume Builder
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to create a standout resume that gets you hired.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">AI-Powered Writing</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Generate professional summaries and descriptions with AI that understands your career goals.
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Professional Templates</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Choose from beautifully designed templates that are ATS-friendly and optimized for modern hiring.
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Instant Preview</h3>
            <p className="text-gray-700 dark:text-gray-300">
              See your resume come to life in real-time as you type. What you see is exactly what you get.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="p-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Your Resume?</h2>
          <p className="text-xl mb-6">
            Join thousands of job seekers who have successfully landed their dream jobs with our AI-powered resume builder.
          </p>
          <button
            onClick={() => navigate(user ? "/dashboard" : "/auth")}
            className="px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:opacity-90 transition"
          >
            {user ? "Go to Dashboard" : "Create Your Resume Now"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm py-8">
        <p className="text-center text-gray-600 dark:text-gray-400">© 2025 AI Resume Builder. Built with AI and care.</p>
      </footer>
    </div>
  );
};

export default Index;

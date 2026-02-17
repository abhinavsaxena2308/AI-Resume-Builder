import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.png";
import { auth, getCurrentUser, onAuthStateChange } from "@/integrations/firebase/client";
import { signOut } from "firebase/auth";
import { useTheme } from "@/contexts/ThemeContext";
import { FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) setUser(user);
    });

    const unsubscribe = onAuthStateChange((user) => {
      if (user) setUser(user);
      else setUser(null);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        theme === "light"
          ? "bg-white text-gray-900"
          : "bg-black text-gray-100"
      }`}
    >
      <header className="w-full bg-white dark:bg-black shadow-md sticky top-0 z-50 border-b border-border">
  <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
    {/* Left Section */}
    <div
      className="flex items-center cursor-pointer"
      onClick={() => navigate("/")}
    >
      <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg flex items-center justify-center text-purple-800 dark:text-purple-400 font-bold">
        <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <span className="ml-2 text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        AI Resume Builder
      </span>
    </div>

    {/* Right Section */}
    <nav className="flex items-center space-x-2 sm:space-x-4">
      {user ? (
        <>
          {/* User Name */}
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 sm:gap-2 text-gray-700 border rounded-full px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base dark:text-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-purple-400 dark:hover:shadow-purple-600 transition">
            Hi, {user.displayName || user.email}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition text-sm sm:text-base"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          {/* Get Started Button (when not logged in) */}
          <button
            onClick={() => navigate("/auth")}
            className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition text-sm sm:text-base"
          >
            Get Started
          </button>
        </>
      )}
    </nav>
  </div>
</header>


      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm font-medium">
            ⭐ AI-Powered Resume Creation
          </span>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            Build Your{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Perfect Resume
            </span>{" "}
            in Minutes
          </h1>

          <p className="text-xl text-gray-700 dark:text-gray-300">
            Create professional, ATS-friendly resumes with AI assistance. Stand
            out and land your dream job faster.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition"
            >
              {user ? "Go to Dashboard" : "Start Building Free"}
            </button>
            <button
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
              onClick={() => navigate("/examples")}
            >
              View Examples
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Removed background glow */}
          <img
            src={heroImage}
            alt="Resume Builder Interface"
            className={`relative rounded-2xl shadow-2xl border ${
              theme === "light"
                ? "border-gray-200 bg-white"
                : "border-gray-700 bg-black"
            }`}
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
          {[
            {
              title: "AI-Powered Writing",
              desc: "Generate professional summaries and descriptions with AI that understands your career goals.",
            },
            {
              title: "Professional Templates",
              desc: "Choose from beautifully designed templates that are ATS-friendly and optimized for modern hiring.",
            },
            {
              title: "Instant Preview",
              desc: "See your resume come to life in real-time as you type. What you see is exactly what you get.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className={`p-6 border rounded-xl transition-all duration-300 hover:shadow-lg ${
                theme === "light"
                  ? "bg-white border-gray-200 hover:border-purple-300"
                  : "bg-gray-900 border-gray-700 hover:border-purple-500"
              }`}
            >
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="p-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Build Your Resume?
          </h2>
          <p className="text-xl mb-6">
            Join thousands of job seekers who have successfully landed their
            dream jobs with our AI-powered resume builder.
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
      <footer
        className={`border-t py-8 backdrop-blur-sm transition-colors duration-500 ${
          theme === "light"
            ? "bg-white/90 border-gray-200 text-gray-600"
            : "bg-gray-900/80 border-gray-700 text-gray-400"
        }`}
      >
        <p className="text-center">
          © 2025 AI Resume Builder. Want to{" "}
          <a
            href="https://github.com/abhinavsaxena2308/AI-Resume-Builder"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-700 dark:text-purple-400 hover:underline"
          >
            Contribute
          </a>
          ?
        </p>
      </footer>
    </div>
  );
};

export default Index;

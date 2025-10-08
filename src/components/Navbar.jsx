import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FileText } from "lucide-react";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    }
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
        {/* Left Section */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg flex items-center justify-center text-purple-800 font-bold">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="ml-2 text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI Resume Builder
          </span>
        </div>

        {/* Right Section */}
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 sm:gap-2 text-gray-700 border rounded-full px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base dark:text-gray-200 hover:shadow-lg hover:shadow-purple-400 transition"
          >
            ← Back to Home
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition text-sm sm:text-base"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition text-sm sm:text-base"
            >
              Get Started
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

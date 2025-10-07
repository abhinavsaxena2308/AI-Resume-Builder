import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client"; // make sure you have supabase client
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
      navigate("/auth");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
            <FileText />
          </div>
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
            AI Resume Builder
          </span>
        </div>

        <nav className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="px-3 py-2 border rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-gray-300 dark:border-gray-600  hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? "☀️ " : "🌙 "}
          </button>

          {user ? (
            <>
              {/* <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition"
              >
                Dashboard
              </button> */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 border bg-gradient-to-r from-purple-500 to-pink-500 text-white dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition"
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

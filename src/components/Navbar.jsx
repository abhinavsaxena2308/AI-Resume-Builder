import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, handleAuthError } from "@/integrations/firebase/client";
import { signOut } from "firebase/auth";
import { FileText, User, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Handle scroll effect for dynamic navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      handleAuthError(err);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  // NavItem component for reusability and consistent hover effects
  const NavItem = ({ label, hasDropdown, onClick, onMouseEnter, onMouseLeave, isActive }) => (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative group px-4 py-2 text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-200"
      aria-expanded={isActive}
    >
      <span className="relative z-10 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
        {label}
      </span>
      {hasDropdown && (
        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-transform duration-300 group-hover:rotate-180" />
      )}
      {/* Dynamic Hover Underline Effect */}
      <span className="absolute left-4 right-4 bottom-0 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
    </button>
  );

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${isScrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-sm py-2"
          : "bg-white dark:bg-black border-transparent py-4"
        }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center p-1.5 transition-transform duration-300 group-hover:scale-110 shadow-sm border border-purple-200 dark:border-purple-800">
            <FileText className="w-full h-full text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
            AI Resume
          </span>
        </div>

        {/* Desktop Navigation Center */}
        <nav className="hidden md:flex flex-1 items-center justify-center space-x-2">
          <NavItem
            label="Templates"
            onClick={() => handleNavClick("/examples")}
          />

          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("tips")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <NavItem
              label="Tips"
              hasDropdown={true}
              isActive={activeDropdown === "tips"}
            />
            {/* Dropdown for Tips */}
            <AnimatePresence>
              {activeDropdown === "tips" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl shadow-purple-500/10 border border-gray-100 dark:border-gray-800 py-2 overflow-hidden"
                >
                  <button
                    onClick={() => handleNavClick("/career-tips")}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Career Tips
                  </button>
                  <button
                    onClick={() => handleNavClick("/interview-tips")}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Interview Tips
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavItem
            label="About Us"
            onClick={() => handleNavClick("/#about")}
          />
        </nav>

        {/* Desktop Right Actions (Auth/Dashboard) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {location.pathname !== "/dashboard" && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Dashboard
                </button>
              )}
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                  <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
            >
              <User className="w-4 h-4" />
              <span>Login / Sign Up</span>
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-600 dark:text-gray-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 overflow-hidden shadow-xl"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              <button onClick={() => handleNavClick("/examples")} className="text-left text-lg font-medium text-gray-800 dark:text-gray-200">
                Templates
              </button>
              <div className="flex flex-col gap-2 pl-4 border-l-2 border-purple-200 dark:border-purple-900/50">
                <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Tips</span>
                <button onClick={() => handleNavClick("/career-tips")} className="text-left text-gray-700 dark:text-gray-300">Career Tips</button>
                <button onClick={() => handleNavClick("/interview-tips")} className="text-left text-gray-700 dark:text-gray-300">Interview Tips</button>
              </div>
              <button onClick={() => handleNavClick("/#about")} className="text-left text-lg font-medium text-gray-800 dark:text-gray-200">
                About Us
              </button>

              <div className="h-px w-full bg-gray-200 dark:bg-gray-800 my-2" />

              {user ? (
                <>
                  <button onClick={() => handleNavClick("/dashboard")} className="text-left text-lg font-medium text-purple-600 dark:text-purple-400">
                    Dashboard
                  </button>
                  <button onClick={handleLogout} className="text-left text-lg font-medium text-red-500">
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavClick("/auth")}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium"
                >
                  <User className="w-5 h-5" />
                  <span>Login / Sign Up</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

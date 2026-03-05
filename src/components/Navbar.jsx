import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, handleAuthError } from "@/integrations/firebase/client";
import { signOut } from "firebase/auth";
import { FileText, User, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

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

  const NavLink = ({ label, hasDropdown, onClick, onMouseEnter, onMouseLeave, isActive }) => (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-expanded={isActive}
      className="relative group flex items-center gap-1 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200"
    >
      {label}
      {hasDropdown && (
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${isActive ? "rotate-180 text-gold-400" : "group-hover:text-zinc-300"}`}
        />
      )}
      {/* animated underline */}
      <span className="absolute bottom-0 left-3 right-3 h-px bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full opacity-70" />
    </button>
  );

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? "bg-zinc-950/90 backdrop-blur-md border-b border-white/[0.07] shadow-2xl shadow-black/30 py-2"
        : "bg-transparent border-b border-transparent py-4"
        }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex justify-between items-center">

        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/25 group-hover:shadow-gold-500/40 transition-shadow duration-300">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            AI Resume<span className="text-gold-500">.</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink label="Home" onClick={() => handleNavClick("/")} />
          <NavLink label="Templates" onClick={() => handleNavClick("/examples")} />

          {/* Tips dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("tips")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <NavLink
              label="Tips"
              hasDropdown
              isActive={activeDropdown === "tips"}
            />
            <AnimatePresence>
              {activeDropdown === "tips" && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-zinc-900 rounded-xl border border-white/[0.08] shadow-2xl shadow-black/40 py-1.5 overflow-hidden"
                >
                  {[
                    { label: "Career Tips", path: "/career-tips" },
                    { label: "Interview Tips", path: "/interview-tips" },
                    { label: "Resume Tips", path: "/resume-tips" },
                  ].map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(item.path)}
                      className="w-full text-left px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-gold-500/10 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-gold-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink label="About" onClick={() => handleNavClick("/about-us")} />
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {location.pathname !== "/dashboard" && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-sm text-zinc-400 hover:text-white transition-colors font-medium"
                >
                  Dashboard
                </button>
              )}
              <div className="w-px h-5 bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold-500/15 border border-gold-500/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-gold-400" />
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-zinc-500 hover:text-red-400 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/auth")}
                className="btn-invertase-glow-secondary !px-4 !py-2 !text-xs"
              >
                Login
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/auth")}
                className="btn-invertase-glow !px-4 !py-2 !text-xs"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-zinc-950 border-t border-white/[0.07] overflow-hidden"
          >
            <div className="px-5 py-5 flex flex-col gap-1">
              {[
                { label: "Home", path: "/" },
                { label: "Templates", path: "/examples" },
                { label: "About", path: "/about-us" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className="text-left py-3 px-3 text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium text-base"
                >
                  {item.label}
                </button>
              ))}

              <div className="pl-3 py-1 border-l border-gold-500/30 ml-3 flex flex-col gap-1">
                <span className="text-xs text-gold-500 uppercase tracking-widest font-semibold mb-1">Tips</span>
                {[
                  { label: "Career Tips", path: "/career-tips" },
                  { label: "Interview Tips", path: "/interview-tips" },
                  { label: "Resume Tips", path: "/resume-tips" },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className="text-left py-2 text-zinc-400 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="h-px bg-white/[0.07] my-3" />

              {user ? (
                <>
                  <button
                    onClick={() => handleNavClick("/dashboard")}
                    className="btn-invertase-glow !w-full !justify-center py-3 mb-2"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn-invertase-glow-secondary !w-full !justify-center py-3"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavClick("/auth")}
                  className="btn-invertase-glow !w-full !justify-center py-3"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
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

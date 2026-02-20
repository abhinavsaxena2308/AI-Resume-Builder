import { useNavigate } from "react-router-dom";
import { auth, handleAuthError } from "@/integrations/firebase/client";
import { signOut } from "firebase/auth";
import { FileText } from "lucide-react";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      handleAuthError(err);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-black shadow-md z-50 border-b border-border">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={handleBack}
        >
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg flex items-center justify-center text-purple-800 dark:text-purple-400 font-bold">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="ml-2 text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI Resume Builder
          </span>
        </div>

        <nav className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 sm:gap-2 text-gray-700 border rounded-full px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base dark:text-gray-200 dark:border-gray-700 hover:shadow-lg hover:shadow-purple-400 dark:hover:shadow-purple-600 transition"
          >
            {user ? "← Dashboard" : "← Back to Home"}
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

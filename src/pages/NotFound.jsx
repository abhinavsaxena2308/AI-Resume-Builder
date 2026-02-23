import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#050505] text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="flex justify-center">
          {/* <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-2xl text-red-600 dark:text-red-400">
            <AlertCircle className="w-12 h-12" />
          </div> */}
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Oops! Page Not Found
        </h1>

        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          We couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        <div className="flex justify-center pt-4">
          <Button
            onClick={() => navigate("/")}
            className="px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform rounded-xl text-lg font-bold flex items-center gap-2 text-white "
          >
            <Home className="w-5 h-5" />
            Go Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
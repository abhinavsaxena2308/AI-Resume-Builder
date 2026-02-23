import { useNavigate } from "react-router-dom";
import { FileText, Github } from "lucide-react";
import { auth } from "@/integrations/firebase/client";

const Footer = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  return (
    <footer className="border-t border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Resume
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Build professional resumes with AI assistance. Land your dream job faster.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/abhinavsaxena2308/AI-Resume-Builder"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
              >
                <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <button
                  onClick={() => navigate("/examples")}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Templates
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate(user ? "/dashboard" : "/auth")}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Resume Builder
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/examples")}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Examples
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <button
                  onClick={() => navigate("/career-tips")}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Career Tips
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/interview-tips")}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Interview Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/resume-tips")}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Resume Tips
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <button
                  onClick={() => navigate("/about-us")}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/privacy-policy")}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/terms-of-service")}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200/50 dark:border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} AI Resume Builder. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            Made by{" "}
            <a
              href="https://github.com/abhinavsaxena2308"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              Abhinav Saxena
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


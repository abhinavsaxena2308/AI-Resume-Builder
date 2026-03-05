import { useNavigate } from "react-router-dom";
import { FileText, Github, ArrowUpRight } from "lucide-react";
import { auth } from "@/integrations/firebase/client";

const Footer = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const links = {
    Product: [
      { label: "Templates", path: "/examples" },
      { label: "Resume Builder", path: user ? "/dashboard" : "/auth" },
      { label: "Examples", path: "/examples" },
    ],
    Resources: [
      { label: "Career Tips", path: "/career-tips" },
      { label: "Interview Guide", path: "/interview-tips" },
      { label: "Resume Tips", path: "/resume-tips" },
    ],
    Company: [
      { label: "About Us", path: "/about-us" },
      { label: "Privacy Policy", path: "/privacy-policy" },
      { label: "Terms of Service", path: "/terms-of-service" },
    ],
  };

  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-zinc-950">
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div
              className="flex items-center gap-2.5 mb-4 cursor-pointer group w-fit"
              onClick={() => navigate("/")}
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20 group-hover:shadow-gold-500/35 transition-shadow">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                AI Resume<span className="text-gold-500">.</span>
              </span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed mb-5 max-w-[200px]">
              Build professional, ATS-friendly resumes with AI assistance. Land your dream job faster.
            </p>
            <a
              href="https://github.com/abhinavsaxena2308/AI-Resume-Builder"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-invertase-glow-secondary !px-4 !py-2 !text-xs group"
            >
              <Github className="w-4 h-4" />
              <span>Star on GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                {section}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="text-sm text-zinc-500 hover:text-white transition-colors text-left"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} AI Resume Builder. All rights reserved.
          </p>
          <p className="text-sm text-zinc-600 flex items-center gap-1">
            Made by{" "}
            <a
              href="https://github.com/abhinavsaxena2308"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-gold-400 transition-colors font-medium"
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

import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import Footer from "@/components/Footer";
import BackgroundEffects from "@/components/BackgroundEffects";
import ScrollToTop from "@/components/ScrollToTop";
import { AnimatePresence, motion } from "framer-motion";

const queryClient = new QueryClient();
const Index = lazy(() => import("./pages/index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dasboard"));
const Builder = lazy(() => import("./pages/Builder"));
const ViewExamples = lazy(() => import("./pages/ViewExamples"));
const CareerTips = lazy(() => import("./pages/CareerTips"));
const ResumeTips = lazy(() => import("./pages/ResumeTips"));
const InterviewTips = lazy(() => import("./pages/InterviewTips"));
const TestAiFeature = lazy(() => import("./pages/TestAiFeature"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const NotFound = lazy(() => import("./pages/NotFound"));

const RouteLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
    <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin" />
  </div>
);

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const AppRoutes = () => {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith("/builder") || location.pathname.startsWith("/auth");

  return (
    <>
      <ScrollToTop />
      <BackgroundEffects />
      <Suspense fallback={<RouteLoading />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Index /></PageTransition>} />
            <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/builder/:id" element={<PageTransition><Builder /></PageTransition>} />
            <Route path="/examples" element={<PageTransition><ViewExamples /></PageTransition>} />
            <Route path="/career-tips" element={<PageTransition><CareerTips /></PageTransition>} />
            <Route path="/resume-tips" element={<PageTransition><ResumeTips /></PageTransition>} />
            <Route path="/interview-tips" element={<PageTransition><InterviewTips /></PageTransition>} />
            <Route path="/test-ai" element={<PageTransition><TestAiFeature /></PageTransition>} />
            <Route path="/about-us" element={<PageTransition><AboutUs /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      {!hideFooter && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ThemeToggle />
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

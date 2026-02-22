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

const queryClient = new QueryClient();
const Index = lazy(() => import("./pages/index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dasboard"));
const Builder = lazy(() => import("./pages/Builder"));
const ViewExamples = lazy(() => import("./pages/ViewExamples"));
const CareerTips = lazy(() => import("./pages/CareerTips"));
const InterviewTips = lazy(() => import("./pages/InterviewTips"));
const TestAiFeature = lazy(() => import("./pages/TestAiFeature"));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const NotFound = lazy(() => import("./pages/NotFound"));

const RouteLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
    <div className="w-10 h-10 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => {
  const location = useLocation();
  const hideFooter = location.pathname.includes("/builder");

  return (
    <>
      <BackgroundEffects />
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder/:id" element={<Builder />} />
          <Route path="/examples" element={<ViewExamples />} />
          <Route path="/career-tips" element={<CareerTips />} />
          <Route path="/interview-tips" element={<InterviewTips />} />
          <Route path="/test-ai" element={<TestAiFeature />} />
          <Route path="/resume-page" element={<ResumePage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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

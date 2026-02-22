import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, handleAuthError, getCurrentUser } from "@/integrations/firebase/client";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, updateProfile } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2, ArrowLeft, Github, Chrome } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import authPic from "@/assets/auth-pic.png";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) navigate("/dashboard");
    });
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      const trimmedPassword = password;
      const trimmedFullName = fullName.trim();

      if (!trimmedEmail || !trimmedPassword) {
        toast({ title: "Error", description: "Email and password are required.", variant: "destructive" });
        setLoading(false);
        return;
      }

      if (trimmedPassword.length < 6) {
        toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
        setLoading(false);
        return;
      }

      if (isSignUp && !trimmedFullName) {
        toast({ title: "Error", description: "Full name is required.", variant: "destructive" });
        setLoading(false);
        return;
      }

      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        if (trimmedFullName) {
          await updateProfile(userCredential.user, { displayName: trimmedFullName });
        }
        toast({ title: "Success!", description: "Account created. Please sign in." });
        setIsSignUp(false);
      } else {
        await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        toast({ title: "Welcome!", description: "Signed in successfully." });
        navigate("/dashboard");
      }
    } catch (error) {
      handleAuthError(error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setOauthLoading(provider);
    try {
      let authProvider;
      if (provider === "google") {
        authProvider = new GoogleAuthProvider();
      } else if (provider === "github") {
        authProvider = new GithubAuthProvider();
      } else {
        throw new Error("Unsupported provider");
      }

      await signInWithPopup(auth, authProvider);
      toast({ title: "Success!", description: "Signed in successfully." });
      navigate("/dashboard");
    } catch (error) {
      handleAuthError(error);
      toast({ title: "Error", description: error.message || "OAuth login failed", variant: "destructive" });
    } finally {
      setOauthLoading("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#050505] overflow-hidden relative">
      {/* Mobile Background Image (Only visible on small screens) */}
      <div className="lg:hidden absolute inset-0 z-0">
        <img
          src={authPic}
          alt="Auth Background Mobile"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 3/4 Image Section (75%) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:block lg:w-3/4 relative h-full overflow-hidden bg-purple-100 dark:bg-purple-950/20"
      >
        <img
          src={authPic}
          alt="Authentication Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-50 dark:to-[#050505]" />
        <div className="absolute inset-0 bg-black/5" />
      </motion.div>

      {/* 1/4 Auth Form Section (25%) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/4 h-full flex flex-col justify-center p-6 bg-transparent lg:bg-white lg:dark:bg-[#080808] lg:border-l border-gray-100 dark:border-white/5 lg:shadow-2xl z-10 overflow-y-auto relative"
      >
        <div className="w-full max-w-sm mx-auto bg-white/90 dark:bg-black/80 lg:bg-transparent lg:dark:bg-transparent backdrop-blur-md lg:backdrop-blur-none rounded-3xl p-6 lg:p-0 shadow-2xl lg:shadow-none border border-white/20 lg:border-0">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-600 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "signup" : "signin"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {isSignUp ? "Join Us" : "Welcome Back"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isSignUp ? "Let's build your standout resume." : "Sign in to access your dashboard."}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs text-gray-700 dark:text-gray-300 font-medium">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Abhinav Saxena"
                      required
                      className="bg-gray-50 dark:bg-[#111] dark:border-white/10 rounded-xl h-10 text-sm"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-gray-700 dark:text-gray-300 font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="bg-gray-50 dark:bg-[#111] dark:border-white/10 rounded-xl h-10 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-xs text-gray-700 dark:text-gray-300 font-medium">Password</Label>
                    {!isSignUp && (
                      <button type="button" className="text-[10px] text-purple-600 hover:underline">Forgot?</button>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    required
                    className="bg-gray-50 dark:bg-[#111] dark:border-white/10 rounded-xl h-10 text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all text-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isSignUp ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t dark:border-white/5" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white dark:bg-[#080808] px-2 text-gray-500 font-medium tracking-widest">Or</span>
                </div>
              </div>

              {/* OAuth */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleOAuthLogin("google")}
                  variant="outline"
                  className="h-10 dark:bg-[#111] dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all gap-2 text-xs"
                  disabled={oauthLoading !== "" && oauthLoading !== "google"}
                >
                  <Chrome className="h-3.5 w-3.5" />
                  Google
                </Button>
                <Button
                  onClick={() => handleOAuthLogin("github")}
                  variant="outline"
                  className="h-10 dark:bg-[#111] dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all gap-2 text-xs"
                  disabled={oauthLoading !== "" && oauthLoading !== "github"}
                >
                  <Github className="h-3.5 w-3.5" />
                  GitHub
                </Button>
              </div>

              {/* Toggle */}
              <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-purple-600 font-bold hover:underline"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;

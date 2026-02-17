import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, handleAuthError, getCurrentUser } from "@/integrations/firebase/client";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, updateProfile } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

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
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update profile with full name
        if (fullName) {
          await updateProfile(userCredential.user, { displayName: fullName });
        }
        toast({ title: "Success!", description: "Account created. Please sign in." });
        setIsSignUp(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
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
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 shadow-xl bg-card text-card-foreground">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-foreground">{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
          <CardDescription>
            {isSignUp ? "Start building your perfect resume" : "Sign in to continue building your resume"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Email/password form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="bg-background text-foreground border-border"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-background text-foreground border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
                className="bg-background text-foreground border-border"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : isSignUp ? (
                "Sign Up"
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* OAuth Buttons */}
          <div className="mt-4 flex flex-col gap-3">
            <Button
              onClick={() => handleOAuthLogin("github")}
              variant="outline"
              className="flex justify-center items-center gap-2 border-border hover:bg-accent relative"
              disabled={oauthLoading !== "" && oauthLoading !== "github"}
            >
              {oauthLoading === "github" && <Loader2 className="absolute left-3 h-4 w-4 animate-spin" />}
              {/* <GitHub className="h-5 w-5" /> */}
              Continue with GitHub
            </Button>

            <Button
              onClick={() => handleOAuthLogin("google")}
              variant="outline"
              className="flex justify-center items-center gap-2 border-border hover:bg-accent relative"
              disabled={oauthLoading !== "" && oauthLoading !== "google"}
            >
              {oauthLoading === "google" && <Loader2 className="absolute left-3 h-4 w-4 animate-spin" />}
              {/* <Google className="h-5 w-5" /> */}
              Continue with Google
            </Button>
          </div>

          {/* Toggle SignIn/SignUp */}
          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button onClick={() => setIsSignUp(false)} className="text-purple-900 dark:text-purple-400 hover:underline font-medium">
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button onClick={() => setIsSignUp(true)} className="text-purple-900 dark:text-purple-400 hover:underline font-medium">
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Back to home */}
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-purple-900 dark:hover:text-purple-400">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
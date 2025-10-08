import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2} from "lucide-react";

// Google icon as SVG
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" className="h-5 w-5">
    <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272v95.4h146.9c-6.4 34.8-25.6 64.4-54.7 84.2v69.8h88.4c51.6-47.5 81.9-117.7 81.9-199h-.1z"/>
    <path fill="#34A853" d="M272 544.3c73.6 0 135.4-24.3 180.6-66.1l-88.4-69.8c-24.6 16.5-56.1 26.2-92.2 26.2-70.8 0-130.8-47.7-152.3-112.2H30.6v70.7C75.7 488.4 168.4 544.3 272 544.3z"/>
    <path fill="#FBBC05" d="M119.7 325.1c-5.5-16.5-8.6-34.1-8.6-52.1s3.1-35.6 8.6-52.1V150.2H30.6C11.1 188.5 0 228.3 0 272s11.1 83.5 30.6 121.8l89.1-68.7z"/>
    <path fill="#EA4335" d="M272 107.7c38.8 0 73.6 13.3 101.1 39.5l75.8-75.8C407.4 24.5 345.6 0 272 0 168.4 0 75.7 55.9 30.6 150.2l89.1 68.7c21.5-64.5 81.5-112.2 152.3-112.2z"/>
  </svg>
);

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
  }, [navigate]);

  // Standard email/password auth
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast({ title: "Success!", description: "Account created. Please sign in." });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome!", description: "Signed in successfully." });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // OAuth login
  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`, // Must match GitHub OAuth app redirect
        },
      });
      if (error) throw error;
    } catch (error) {
      toast({ title: "Error", description: error.message || "OAuth login failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
          <CardDescription>
            {isSignUp
              ? "Start building your perfect resume"
              : "Sign in to continue building your resume"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Email/password form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
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
              className="flex-1 justify-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {/* <LucideGitHub className="h-5 w-5" /> */}
              Continue with GitHub
            </Button>

            <Button
              onClick={() => handleOAuthLogin("google")}
              variant="outline"
              className="flex-1 justify-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {/* <GoogleIcon /> */}
              Continue with Google
            </Button>
          </div>

          {/* Toggle SignIn/SignUp */}
          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button onClick={() => setIsSignUp(false)} className="text-purple-900 hover:underline font-medium">
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button onClick={() => setIsSignUp(true)} className="text-purple-900 hover:underline font-medium">
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Back to home */}
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-purple-900">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

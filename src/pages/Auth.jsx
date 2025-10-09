import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2 } from "lucide-react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
  }, [navigate]);

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

  const handleOAuthLogin = async (provider) => {
    setOauthLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_URL },
      });
      if (error) throw error;
    } catch (error) {
      toast({ title: "Error", description: error.message || "OAuth login failed", variant: "destructive" });
    } finally {
      setOauthLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
          <CardDescription>
            {isSignUp ? "Start building your perfect resume" : "Sign in to continue building your resume"}
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
              className="flex justify-center items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              disabled={oauthLoading !== "" && oauthLoading !== "github"}
            >
              {oauthLoading === "github" && <Loader2 className="absolute left-3 h-4 w-4 animate-spin" />}
              {/* <GitHub className="h-5 w-5" /> */}
              Continue with GitHub
            </Button>

            <Button
              onClick={() => handleOAuthLogin("google")}
              variant="outline"
              className="flex justify-center items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
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

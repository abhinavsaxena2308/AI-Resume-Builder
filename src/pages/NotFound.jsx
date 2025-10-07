import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-extrabold animate-pulse text-primary">404</h1>
        <p className="text-xl text-muted-foreground">Oops! Page not found</p>
        <Link
          to="/"
          className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white font-medium hover:opacity-90 transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

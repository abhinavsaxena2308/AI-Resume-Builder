import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Always dark — Invertase aesthetic is exclusively dark mode
  const theme = "dark";

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  const toggleTheme = () => {
    // No-op: design is always dark
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
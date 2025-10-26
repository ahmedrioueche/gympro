import { useState, useEffect } from "react";

type ThemeMode = "light" | "dark";

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem("themeMode");
      if (saved === "light" || saved === "dark") {
        return saved;
      }
    } catch {
      console.error("Failed to read theme from localStorage");
    }
    return "light"; // default to light
  });

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { mode, toggleMode };
}

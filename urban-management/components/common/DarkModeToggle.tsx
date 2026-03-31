"use client";

import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const newIsDark = !isDark;
    
    if (newIsDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {isDark ? "🌞" : "🌙"}
    </button>
  );
}
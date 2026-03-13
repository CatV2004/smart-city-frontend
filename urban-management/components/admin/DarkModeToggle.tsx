"use client";

export default function DarkModeToggle() {

  const toggle = () => {
    const root = document.documentElement;

    const isDark = root.classList.toggle("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      🌙
    </button>
  );
}
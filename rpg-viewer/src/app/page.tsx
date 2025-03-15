"use client";

import { useState, useEffect } from "react";
import FileSelector from "@/components/FileSelector";
import YamlDisplay from "@/components/YamlDisplay";
import { CrossReferenceProvider } from "@/components/CrossReferenceContext";
import { trpc } from "@/trpc/client";
import { setTRPCProxy } from "@/utils/yamlUtils";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Get tRPC context for components that need it outside React hooks
  const trpcContext = trpc.useContext();

  // Only run on client side after mount
  useEffect(() => {
    // Set mounted to true to indicate we're on the client
    setMounted(true);

    // Check if dark mode is stored in localStorage
    const storedDarkMode = localStorage.getItem("darkMode");
    const isDarkMode = storedDarkMode ? storedDarkMode === "true" : false;

    // Update state and document class based on localStorage
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Set tRPC proxy to allow utils to access tRPC outside of React hooks
    if (trpcContext) {
      setTRPCProxy(trpcContext);
    }
  }, [trpcContext]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    // Update localStorage and class
    localStorage.setItem("darkMode", newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Return a skeleton UI while not mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <main className="min-h-screen flex flex-col items-center p-6 md:p-12 lg:p-24 transition-colors duration-300 bg-slate-50">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-center">RPG Data Viewer</h1>
            <div className="w-10 h-10"></div> {/* Placeholder for button */}
          </div>
          <p className="text-center text-gray-600 mb-10">
            View and explore your Shattered Spire RPG data
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1"></div>
            <div className="md:col-span-3"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen flex flex-col items-center p-6 md:p-12 lg:p-24 transition-colors duration-300 ${
        darkMode
          ? "dark:bg-gray-950 dark:text-gray-200"
          : "bg-slate-50 text-gray-800"
      }`}
    >
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center">RPG Data Viewer</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
          View and explore your Shattered Spire RPG data
        </p>

        <CrossReferenceProvider onFileChange={setSelectedFile}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <FileSelector
                onFileSelect={setSelectedFile}
                currentFile={selectedFile}
              />
            </div>

            <div className="md:col-span-3">
              <YamlDisplay filename={selectedFile} />
            </div>
          </div>
        </CrossReferenceProvider>
      </div>
    </main>
  );
}

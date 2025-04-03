"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./sidebar";
import Header from "./header";
import { useLocation } from "react-router-dom";
import LazyFooter from "./lazy-footer";
import { useAuth } from "@/hooks/use-auth";

interface AppLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Close sidebar on mobile for non-authenticated users on home page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        // On desktop, keep sidebar open except on home page for non-authenticated users
        setIsSidebarOpen(!(isHomePage && !isAuthenticated));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isHomePage, isAuthenticated]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkMode", (!isDarkMode).toString());

    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {isLoading ? (
        <div className="fixed inset-0 bg-indigo-600 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-24 h-24 border-4 border-white border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            <h2 className="text-white text-2xl font-bold">TutorConnect</h2>
            <p className="text-indigo-200 mt-2">
              Loading amazing learning experiences...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Main content wrapper */}
          <div className="flex flex-1">
            {/* Sidebar overlay for mobile */}
            <AnimatePresence>
              {isSidebarOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                  />
                  <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    transition={{ duration: 0.3 }}
                    className="fixed md:sticky top-0 z-20 min-h-screen w-64 bg-white dark:bg-gray-800 shadow-md"
                  >
                    <Sidebar isOpen={isSidebarOpen} isHomePage={isHomePage} />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main content and header */}
            <div className="flex flex-col flex-1">
              <Header
                toggleSidebar={toggleSidebar}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
              />

              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>

          {/* Footer - outside the flex container to ensure it spans full width */}
          <LazyFooter />
        </>
      )}
    </div>
  );
}

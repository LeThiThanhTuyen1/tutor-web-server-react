"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";
import LazyFooter from "./lazy-footer";
import { useAuth } from "@/hooks/use-auth";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth()
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(!isHomePage || isAuthenticated);
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
        <div className="flex flex-1 h-screen overflow-hidden">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ duration: 0.3 }}
                className="h-full flex-shrink-0 w-64 z-20 bg-white dark:bg-gray-800 shadow-md"
              >
                <Sidebar isOpen={isSidebarOpen} isHomePage={isHomePage} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col flex-1 overflow-hidden">
            <Header
              toggleSidebar={toggleSidebar}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />

            <main className="flex-1 overflow-y-auto">{children}</main>
            <LazyFooter />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { NavLink, Link } from "react-router-dom";
import {
  BookOpen,
  Home,
  User,
  Users,
  Calendar,
  LogIn,
  SettingsIcon,
  Bell,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hook/use-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/tooltip";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { user, isAuthenticated } = useAuth();

  const navItems = {
    Public: [
      { name: "Home", path: "/", icon: <Home className="h-5 w-5" /> },
      { name: "Tutors", path: "/tutors", icon: <Users className="h-5 w-5" /> },
      {
        name: "Courses",
        path: "/courses",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        name: "Settings",
        path: "/setting",
        icon: <SettingsIcon className="h-5 w-5" />,
      },
    ],
    Admin: [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <Home className="h-5 w-5" />,
      },
      {
        name: "Manage Users",
        path: "/admin/users",
        icon: <User className="h-5 w-5" />,
      },
      {
        name: "Manage Courses",
        path: "/admin/courses",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        name: "Manage Contracts",
        path: "/admin/contracts/manage",
        icon: <FileText className="h-5 w-5" />,
      },
    ],
    Tutor: [
      {
        name: "My Dashboard",
        path: "/tutor/dashboard",
        icon: <Home className="h-5 w-5" />,
      },
      {
        name: "My Courses",
        path: "/tutor/courses",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        name: "My Schedule",
        path: "/tutor/schedules",
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        name: "Notifications",
        path: "/tutor/notifications",
        icon: <Bell className="h-5 w-5" />,
      },
    ],
    Student: [
      {
        name: "My Dashboard",
        path: "/student/dashboard",
        icon: <Home className="h-5 w-5" />,
      },
      {
        name: "My Courses",
        path: "/student/courses",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        name: "My Schedule",
        path: "/student/schedules",
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        name: "Notifications",
        path: "/student/notifications",
        icon: <Bell className="h-5 w-5" />,
      },
    ],
  };

  const role = user?.role || "Public";

  return (
    <TooltipProvider>
      <motion.aside
        animate={{ width: isOpen ? 256 : 80 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full shadow-lg p-4 z-20"
      >
        {/* Header Logo */}
        <div className="p-4 flex items-center justify-center w-full border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center w-full justify-center">
            <div className="h-8 w-8 bg-indigo-700 p-2 rounded-md flex items-center justify-center text-white font-bold">
              TC
            </div>
            {isOpen && <h1 className="ml-2 text-lg font-bold">TutorConnect</h1>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {Object.keys(navItems).map(
            (category) =>
              (category === "Public" || category === role) && (
                <div
                  key={category}
                  className="mb-6 bg-white/10 p-3 rounded-lg shadow-md"
                >
                  <ul className="space-y-2">
                    {navItems[category].map((item) => (
                      <motion.li
                        key={item.path}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isOpen ? (
                          <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                              `flex items-center px-3 py-2 rounded-lg transition-all ${
                                isActive
                                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`
                            }
                          >
                            <span className="flex-shrink-0">{item.icon}</span>
                            <span className="ml-3">{item.name}</span>
                          </NavLink>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                  `justify-center flex flex-col items-center py-3 gap-y-3 rounded-lg transition-all ${
                                    isActive
                                      ? "bg-indigo-100 text-indigo-700 dark:text-indigo-200"
                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                  }`
                                }
                              >
                                <span>{item.icon}</span>
                              </NavLink>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>{item.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )
          )}
        </nav>

        {/* User or Auth */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {isAuthenticated ? (
            <div
              className={`flex items-center ${isOpen ? "" : "justify-center"}`}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right">
                    <p>{user?.name}</p>
                    <p className="text-xs capitalize">{user?.role}</p>
                  </TooltipContent>
                )}
              </Tooltip>
              {isOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`flex flex-col gap-2 ${
                isOpen ? "" : "items-center justify-center"
              }`}
            >
              {isOpen ? (
                <>
                  <Link
                    to="/auth/login"
                    className="flex items-center px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="flex items-center px-3 py-2 text-sm rounded-md border border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to="/auth/login"
                        className="flex items-center justify-center p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      >
                        <LogIn className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Login</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to="/auth/signup"
                        className="flex items-center justify-center p-2 rounded-md border border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                      >
                        <User className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Sign Up</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}

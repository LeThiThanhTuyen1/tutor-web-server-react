import { NavLink, Link } from "react-router-dom";
import {
  BookOpen,
  Home,
  User,
  Users,
  Calendar,
  LogIn,
  SettingsIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  isOpen: boolean;
  isHomePage?: boolean;
}

export default function Sidebar({ isOpen, isHomePage = false }: SidebarProps) {
  const { user, isAuthenticated } = useAuth()

  const getNavItems = () => {
    const publicItems = [
      { name: "Home", path: "/", icon: <Home className="h-5 w-5" /> },
      { name: "Tutors", path: "/tutors", icon: <Users className="h-5 w-5" /> },
      {
        name: "Course",
        path: "/courses",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        name: "Setting",
        path: "/setting",
        icon: <SettingsIcon className="h-5 w-5" />,
      },
    ];

    if (isAuthenticated) {
      if (user?.role === "Admin") {
        return [
          ...publicItems,
          {
            name: "Dashboard",
            path: "/admin/dashboard",
            icon: <Home className="h-5 w-5" />,
          },
          {
            name: "Manage Tutors",
            path: "/admin/tutors",
            icon: <User className="h-5 w-5" />,
          },
          {
            name: "Manage Courses",
            path: "/admin/courses",
            icon: <BookOpen className="h-5 w-5" />,
          },
        ];
      }

      if (user?.role === "Tutor") {
        return [
          ...publicItems,
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
            path: "/schedules",
            icon: <Calendar className="h-5 w-5" />,
          },
        ];
      }

      return [
        ...publicItems,
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
          path: "/schedules",
          icon: <Calendar className="h-5 w-5" />,
        },
      ];
    }

    return publicItems;
  };

  const navItems = getNavItems();

  return (
    <aside
      className={`bg-gradient-to-br from-purple-600 to-indigo-600 border-r transition-all duration-300 rounded-lg shadow-lg
        ${isOpen ? "w-64" : "w-20"} flex flex-col h-full
        ${isHomePage ? "bg-opacity-90 backdrop-blur-sm" : ""}
      `}
    >
      <div className="p-4 flex items-center justify-between border-b border-purple-400 rounded-t-lg">
        <div
          className={`flex items-center ${
            isOpen ? "" : "justify-center w-full"
          }`}
        >
          <div className="h-8 w-8 bg-indigo-700 rounded-md flex items-center justify-center font-bold text-white">
            TC
          </div>
          {isOpen && (
            <h1 className="ml-2 text-lg font-bold text-white">TutorConnect</h1>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <motion.li
              key={item.path}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-3 py-2 rounded-lg
                  ${
                    isActive
                      ? "bg-purple-300 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                      : "text-white hover:bg-indigo-500"
                  }
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-purple-400 rounded-b-lg">
        {isAuthenticated ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              {user?.name?.charAt(0) || "U"}
            </div>
            {isOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-200 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {isOpen ? (
              <>
                <Link
                  to="/auth/login"
                  className="flex items-center px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  className="flex items-center px-3 py-2 text-sm rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                to="/auth/login"
                className="flex items-center justify-center p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <LogIn className="h-5 w-5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

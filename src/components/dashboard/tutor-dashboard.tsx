"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Users, BookOpen, Star, ArrowUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { useAuth } from "@/hook/use-auth";
import { Link } from "react-router-dom";
import { fadeIn, staggerContainer } from "../layout/animation";
import {
  getTutorDashboard,
  TutorDashboardData,
} from "@/services/tutorService";
import { API_BASE_URL } from "@/config/axiosInstance";

export function TutorDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [dashboardData, setDashboardData] = useState<TutorDashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Fetch data from API
    const fetchData = async () => {
      setLoading(true);
      const response = await getTutorDashboard();
      if (response.succeeded) {
        setDashboardData(response.data);
      } else {
        setError(response.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const container = staggerContainer(0.1);

  if (loading) {
    return (
      <div className="p-6">
        <motion.div
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          animate="show"
        >
          <h1 className="text-3xl font-bold mb-2">Loading...</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching your dashboard data...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <motion.div
          variants={fadeIn("up", 0.1)}
          initial="hidden"
          animate="show"
        >
          <h1 className="text-3xl font-bold mb-2">Error</h1>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button
            className="mt-4 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div variants={fadeIn("up", 0.1)} initial="hidden" animate="show">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {greeting}, {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your teaching today.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={fadeIn("up", 0.1)}>
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-blue-500 dark:text-blue-400">
                      <strong>Active Courses</strong>
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData?.stats.courses || 0}
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        {dashboardData?.stats.coursesChange || 0}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn("up", 0.2)}>
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-purple-500 dark:text-purple-400">
                      <strong>Total Students</strong>
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData?.stats.students || 0}
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        {dashboardData?.stats.studentsChange || 0}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn("up", 0.3)}>
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-red-500 dark:text-red-400">
                      <strong>Teaching Hours</strong>
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData?.stats.hours || 0}
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        {dashboardData?.stats.hoursChange || 0}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn("up", 0.4)}>
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-amber-500 dark:text-amber-400">
                      <strong>Average Rating</strong>
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData?.stats.rating.toFixed(1) || 0}
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        0.2
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
                    <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts and Upcoming Classes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={fadeIn("up", 0.5)}>
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Student Enrollment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData?.barData || []}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="students"
                        fill="#4f46e5"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn("up", 0.6)}>
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Teaching Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dashboardData?.barData || []}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="hours"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Upcoming Classes and Recent Contracts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={fadeIn("up", 0.7)}>
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">
                  Upcoming Classes
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/schedules">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.upcomingClasses.map((classItem) => (
                    <div
                      key={classItem.id}
                      className="flex flex-col p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{classItem.courseName}</h3>
                        <Badge
                          variant="outline"
                          className={
                            classItem.mode === "online"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              : classItem.mode === "in-person"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                          }
                        >
                          {classItem.mode}
                        </Badge>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {classItem.time}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <Users className="h-4 w-4 mr-1" />
                        {classItem.students} students
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn("up", 0.8)}>
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">
                  Recent Contracts
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contracts">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.recentContracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage
                          src={`${API_BASE_URL}/${contract.studentProfile}`}
                          alt={contract.student}
                        />
                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                          {contract.student?.charAt(0) || "N/A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">
                            {contract.student || "Unknown"}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {contract.lastUpdated}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {contract.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={fadeIn("up", 0.9)}>
          <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                  asChild
                >
                  <Link to="/tutor/courses/new">Create New Course</Link>
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600/90 dark:hover:bg-purple-700/90"
                  asChild
                >
                  <Link to="/schedules">Manage Schedule</Link>
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600/90 dark:hover:bg-blue-700/90"
                  asChild
                >
                  <Link to="/notifications">View Notifications</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

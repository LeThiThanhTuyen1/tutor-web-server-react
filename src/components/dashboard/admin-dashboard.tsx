"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  GraduationCap,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { useAuth } from "@/hook/use-auth";
import { fadeIn, staggerContainer } from "../layout/animation";
import {
  getAdminDashboard,
  AdminDashboardData,
} from "@/services/adminService";

export function AdminDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const fetchData = async () => {
      setLoading(true);
      const response = await getAdminDashboard();
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden animate-pulse"
          >
            <div className="w-full h-48 bg-gray-300 dark:bg-gray-600"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <motion.div variants={fadeIn("up", 0.1)} initial="hidden" animate="show">
          <h1 className="text-3xl font-bold mb-2">Error</h1>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  const pieData = dashboardData?.courseStatuses.map((status) => ({
    name: status.status,
    value: status.count,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, 
  })) || [];

  return (
    <div className="p-6">
      <motion.div variants={fadeIn("up", 0.1)} initial="hidden" animate="show">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {greeting}, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your platform today.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div variants={fadeIn("up", 0.1)}>
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-blue-500 dark:text-blue-400">
                      <strong>Total Students</strong>
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData?.stats.totalStudents || 0}
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span
                        className={`flex items-center ${
                          dashboardData?.stats.studentsChange >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {dashboardData?.stats.studentsChange >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(dashboardData?.stats.studentsChange || 0)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
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
                      <strong>Total Courses</strong>
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData?.stats.totalCourses || 0}
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span
                        className={`flex items-center ${
                          dashboardData?.stats.coursesChange >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {dashboardData?.stats.coursesChange >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(dashboardData?.stats.coursesChange || 0)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                      <strong>Total Tutors</strong>
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {dashboardData?.stats.totalTutors || 0}
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span
                        className={`flex items-center ${
                          dashboardData?.stats.tutorsChange >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {dashboardData?.stats.tutorsChange >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(dashboardData?.stats.tutorsChange || 0)}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* <motion.div variants={fadeIn("up", 0.4)}>
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Revenue
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      ${mockStats.revenue.toLocaleString()}
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-red-600 dark:text-red-400">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        3%
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div> */}
        </div>

        {/* Tabs for different views */}
        <motion.div variants={fadeIn("up", 0.5)}>
          <Tabs
            defaultValue="overview"
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              {/* Bỏ tab revenue nhưng giữ code để tham khảo */}
              {/* <TabsTrigger value="revenue">Revenue</TabsTrigger> */}
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
                          data={dashboardData?.monthlyActivities.map((activity) => ({
                            name: activity.month,
                            students: activity.newStudents,
                          }))}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e0e0e0"
                          />
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

                <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      Course Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="students">
              <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Student Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dashboardData?.monthlyActivities.map((activity) => ({
                          name: activity.month,
                          students: activity.newStudents,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="students"
                          stroke="#4f46e5"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses">
              <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Course Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dashboardData?.monthlyActivities.map((activity) => ({
                          name: activity.month,
                          value: activity.newCourses,
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          fill="#8884d8"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* <TabsContent value="revenue">
              <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Revenue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={mockBarData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`$${value}`, "Revenue"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10b981"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent> */}
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
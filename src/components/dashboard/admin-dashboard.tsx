"use client"

import { useState, useEffect } from "react"
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
} from "recharts"
import { motion } from "framer-motion"
import { Users, BookOpen, GraduationCap, ArrowUp, ArrowDown, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { Button } from "@/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { fadeIn, staggerContainer } from "../layout/animation"

// Mock data for the dashboard
const mockStats = {
  courses: 42,
  students: 187,
  tutors: 24,
  revenue: 12580,
}

const mockBarData = [
  { name: "Jan", students: 20, revenue: 2400 },
  { name: "Feb", students: 35, revenue: 4500 },
  { name: "Mar", students: 42, revenue: 5200 },
  { name: "Apr", students: 38, revenue: 4800 },
  { name: "May", students: 55, revenue: 6700 },
  { name: "Jun", students: 70, revenue: 8900 },
]

const mockPieData = [
  { name: "Mathematics", value: 35, color: "#4f46e5" },
  { name: "Science", value: 25, color: "#0ea5e9" },
  { name: "Languages", value: 20, color: "#8b5cf6" },
  { name: "Arts", value: 10, color: "#ec4899" },
  { name: "Other", value: 10, color: "#f97316" },
]

const mockRecentActivity = [
  {
    id: 1,
    action: "New tutor registered",
    description: "Michael Johnson joined as a Mathematics tutor",
    time: "2 hours ago",
    icon: GraduationCap,
  },
  {
    id: 2,
    action: "New course created",
    description: "Advanced Python Programming was added by Sarah Williams",
    time: "Yesterday",
    icon: BookOpen,
  },
  {
    id: 3,
    action: "Payment received",
    description: "$350 payment received for Premium Subscription",
    time: "2 days ago",
    icon: DollarSign,
  },
]

export function AdminDashboard() {
  const { user } = useAuth()
  const [greeting, setGreeting] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  const container = staggerContainer(0.1)

  return (
    <div className="p-6">
      <motion.div variants={fadeIn("up", 0.1)} initial="hidden" animate="show">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {greeting}, {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your platform today.</p>
        </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={fadeIn("up", 0.1)}>
            <Card className="border-indigo-100 dark:border-indigo-900">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
                    <h3 className="text-2xl font-bold mt-1">{mockStats.students}</h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        12%
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
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
            <Card className="border-indigo-100 dark:border-indigo-900">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</p>
                    <h3 className="text-2xl font-bold mt-1">{mockStats.courses}</h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        8%
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
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
            <Card className="border-indigo-100 dark:border-indigo-900">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tutors</p>
                    <h3 className="text-2xl font-bold mt-1">{mockStats.tutors}</h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        5%
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn("up", 0.4)}>
            <Card className="border-indigo-100 dark:border-indigo-900">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <h3 className="text-2xl font-bold mt-1">${mockStats.revenue.toLocaleString()}</h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-red-600 dark:text-red-400">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        3%
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs for different views */}
        <motion.div variants={fadeIn("up", 0.5)}>
          <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="border-indigo-100 dark:border-indigo-900">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Student Enrollment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="students" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-indigo-100 dark:border-indigo-900">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Course Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mockPieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {mockPieData.map((entry, index) => (
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

              <Card className="border-indigo-100 dark:border-indigo-900">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start p-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-4">
                          <activity.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students">
              <Card className="border-indigo-100 dark:border-indigo-900">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Student Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="students" stroke="#4f46e5" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses">
              <Card className="border-indigo-100 dark:border-indigo-900">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Course Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockPieData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                          {mockPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue">
              <Card className="border-indigo-100 dark:border-indigo-900">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                        <Line type="monotone" dataKey="revenue" stroke="#10b981" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeIn("up", 0.6)}>
          <Card className="border-indigo-100 dark:border-indigo-900">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90">
                  <Users className="h-4 w-4 mr-2" />
                  Add New Student
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600/90 dark:hover:bg-purple-700/90">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Add New Tutor
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600/90 dark:hover:bg-blue-700/90">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create New Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Users, BookOpen, Calendar, Star, ArrowUp, Clock, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { Button } from "@/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { Badge } from "@/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { Link } from "react-router-dom"
import { fadeIn, staggerContainer } from "../layout/animation"

// Mock data for the dashboard
const mockStats = {
  courses: 8,
  students: 42,
  hours: 128,
  rating: 4.8,
}

const mockBarData = [
  { name: "Jan", students: 5, hours: 20 },
  { name: "Feb", students: 8, hours: 32 },
  { name: "Mar", students: 12, hours: 48 },
  { name: "Apr", students: 10, hours: 40 },
  { name: "May", students: 15, hours: 60 },
  { name: "Jun", students: 18, hours: 72 },
]

const mockUpcomingClasses = [
  {
    id: 1,
    courseName: "Advanced Mathematics",
    time: "Today, 2:00 PM - 3:30 PM",
    students: 8,
    mode: "online",
  },
  {
    id: 2,
    courseName: "Introduction to Physics",
    time: "Tomorrow, 10:00 AM - 11:30 AM",
    students: 12,
    mode: "in-person",
  },
  {
    id: 3,
    courseName: "Data Structures",
    time: "Friday, 4:00 PM - 5:30 PM",
    students: 6,
    mode: "hybrid",
  },
]

const mockRecentMessages = [
  {
    id: 1,
    student: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "Hello, I have a question about the upcoming class...",
    time: "10 minutes ago",
    unread: true,
  },
  {
    id: 2,
    student: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "Thank you for the feedback on my assignment!",
    time: "2 hours ago",
    unread: false,
  },
]

export function TutorDashboard() {
  const { user } = useAuth()
  const [greeting, setGreeting] = useState("")

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
          <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your teaching today.</p>
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
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Courses</p>
                    <h3 className="text-2xl font-bold mt-1">{mockStats.courses}</h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />2
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
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
            <Card className="border-indigo-100 dark:border-indigo-900">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
                    <h3 className="text-2xl font-bold mt-1">{mockStats.students}</h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />5
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
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
            <Card className="border-indigo-100 dark:border-indigo-900">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Teaching Hours</p>
                    <h3 className="text-2xl font-bold mt-1">{mockStats.hours}</h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        12
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Rating</p>
                    <h3 className="text-2xl font-bold mt-1">{mockStats.rating}</h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        0.2
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
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
          </motion.div>

          <motion.div variants={fadeIn("up", 0.6)}>
            <Card className="border-indigo-100 dark:border-indigo-900">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Teaching Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Upcoming Classes and Recent Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={fadeIn("up", 0.7)}>
            <Card className="border-indigo-100 dark:border-indigo-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">Upcoming Classes</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/schedule/tutor">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUpcomingClasses.map((classItem) => (
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
            <Card className="border-indigo-100 dark:border-indigo-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">Recent Messages</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/messages">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${
                        message.unread ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
                      }`}
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={message.avatar} alt={message.student} />
                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                          {message.student.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{message.student}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">{message.message}</p>
                      </div>
                      {message.unread && <div className="h-2 w-2 bg-indigo-600 rounded-full flex-shrink-0 mt-2"></div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={fadeIn("up", 0.9)}>
          <Card className="border-indigo-100 dark:border-indigo-900">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                  asChild
                >
                  <Link to="/courses/new">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Create New Course
                  </Link>
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600/90 dark:hover:bg-purple-700/90"
                  asChild
                >
                  <Link to="/schedule/tutor">
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Schedule
                  </Link>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600/90 dark:hover:bg-blue-700/90" asChild>
                  <Link to="/messages">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Messages
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}


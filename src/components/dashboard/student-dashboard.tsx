"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  BookOpen,
  GraduationCap,
  Clock,
  Star,
  ArrowUp,
  Calendar,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { useAuth } from "@/hook/use-auth";
import { Link } from "react-router-dom";
import { fadeIn, staggerContainer } from "../layout/animation";
import { Progress } from "@/ui/progess";

// Mock data for the dashboard
const mockStats = {
  courses: 4,
  completedCourses: 2,
  hoursLearned: 48,
  averageScore: 92,
};

const mockPieData = [
  { name: "Mathematics", value: 35, color: "#4f46e5" },
  { name: "Science", value: 25, color: "#0ea5e9" },
  { name: "Languages", value: 20, color: "#8b5cf6" },
  { name: "Arts", value: 10, color: "#ec4899" },
  { name: "Other", value: 10, color: "#f97316" },
];

const mockCourses = [
  {
    id: 1,
    name: "Advanced Mathematics",
    tutor: "David Kim",
    progress: 75,
    nextLesson: "Today, 4:00 PM",
  },
  {
    id: 2,
    name: "Introduction to Physics",
    tutor: "Sarah Johnson",
    progress: 45,
    nextLesson: "Tomorrow, 10:00 AM",
  },
  {
    id: 3,
    name: "Data Structures",
    tutor: "Michael Chen",
    progress: 60,
    nextLesson: "Friday, 4:00 PM",
  },
];

const mockTutors = [
  {
    id: 1,
    name: "David Kim",
    subject: "Mathematics",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    subject: "Physics",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Michael Chen",
    subject: "Computer Science",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.7,
  },
];

export function StudentDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const container = staggerContainer(0.1);

  return (
    <div className="p-6">
      <motion.div variants={fadeIn("up", 0.1)} initial="hidden" animate="show">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {greeting}, {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your learning today.
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
            <Card className="border-indigo-100 dark:border-indigo-900">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Enrolled Courses
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {mockStats.courses}
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />1
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
            <Card className="border-indigo-100 dark:border-indigo-900">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Completed Courses
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {mockStats.completedCourses}
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />1
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Hours Learned
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {mockStats.hoursLearned}
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />8
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        vs last month
                      </span>
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
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Average Score
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {mockStats.averageScore}%
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        3%
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

        {/* Course Progress and Learning Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={fadeIn("up", 0.5)}>
            <Card className="border-indigo-100 dark:border-indigo-900">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Course Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockCourses.map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{course.name}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                        <span>Tutor: {course.tutor}</span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {course.nextLesson}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn("up", 0.6)}>
            <Card className="border-indigo-100 dark:border-indigo-900">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Learning Distribution
                </CardTitle>
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
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
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
          </motion.div>
        </div>

        {/* My Tutors and Recommended Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={fadeIn("up", 0.7)}>
            <Card className="border-indigo-100 dark:border-indigo-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">
                  My Tutors
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/tutors">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTutors.map((tutor) => (
                    <div
                      key={tutor.id}
                      className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={tutor.avatar} alt={tutor.name} />
                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                          {tutor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{tutor.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {tutor.subject}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">
                          {tutor.rating}
                        </span>
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
                <CardTitle className="text-xl font-semibold">
                  Recommended Courses
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/courses">Browse All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mr-3">
                        <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{course.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          Tutor: {course.tutor}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                      >
                        Popular
                      </Badge>
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
                  <Link to="/courses">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Courses
                  </Link>
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600/90 dark:hover:bg-purple-700/90"
                  asChild
                >
                  <Link to="/tutors">
                    <Search className="h-4 w-4 mr-2" />
                    Find Tutors
                  </Link>
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600/90 dark:hover:bg-blue-700/90"
                  asChild
                >
                  <Link to="/schedule/student">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Schedule
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

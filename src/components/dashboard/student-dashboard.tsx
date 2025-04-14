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
  ArrowDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { useAuth } from "@/hook/use-auth";
import { Link } from "react-router-dom";
import { fadeIn, staggerContainer } from "../layout/animation";
import { Progress } from "@/ui/progess";
import {
  getStudentCourses,
  getStudentStats,
  getStudentSubjects,
  getStudentTutors,
  StudentCourse,
  Tutor,
} from "@/services/studentService";
import { API_BASE_URL } from "@/config/axiosInstance";

export function StudentDashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Fetch data from API
    const fetchData = async () => {
      setLoading(true);

      const statsResponse = await getStudentStats();
      if (statsResponse.succeeded) {
        setStats(statsResponse.data);
      } else {
        setError(statsResponse.message);
      }

      const subjectsResponse = await getStudentSubjects();
      if (subjectsResponse.succeeded) {
        setSubjects(subjectsResponse.data);
      } else {
        setError(subjectsResponse.message);
      }

      const coursesResponse = await getStudentCourses();
      if (coursesResponse.succeeded) {
        setCourses(coursesResponse.data);
      } else {
        setError(coursesResponse.message);
      }

      const tutorsResponse = await getStudentTutors();
      if (tutorsResponse.succeeded) {
        setTutors(tutorsResponse.data);
      } else {
        setError(tutorsResponse.message);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const container = staggerContainer(0.1);

  // const courseDiff = ;
  // const completedDiff = ;
  // const hoursDiff = ;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div variants={fadeIn("up", 0.1)}>
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-blue-500 dark:text-blue-400">
                      <strong>Enrolled Courses</strong>
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {stats!.courses}
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span
                        className={`flex items-center ${
                          stats!.courses - stats!.coursesLastMonth >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {stats!.courses - stats!.coursesLastMonth >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(stats!.courses - stats!.coursesLastMonth)}
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
                      <strong>Completed Courses</strong>
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {stats!.completedCourses}
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span
                        className={`flex items-center ${
                          stats!.completedCourses - stats!.completedCoursesLastMonth >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {stats!.completedCourses - stats!.completedCoursesLastMonth >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(stats!.completedCourses - stats!.completedCoursesLastMonth)}
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
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-red-500 dark:text-red-400">
                      <strong>Hours Learned</strong>
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {stats!.hoursLearned}
                    </h3>
                    <div className="flex items-center mt-1 text-sm">
                      <span
                        className={`flex items-center ${
                          stats!.hoursLearned - stats!.hoursLearnedLastMonth >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {stats!.hoursLearned - stats!.hoursLearnedLastMonth >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(stats!.hoursLearned - stats!.hoursLearnedLastMonth)}
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
        </div>

        {/* Tutor and Learning Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={fadeIn("up", 0.7)}>
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
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
                  {tutors.map((tutor) => (
                    <div
                      key={tutor.id}
                      className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage
                          src={`${API_BASE_URL}/${tutor.profileImage}`}
                          alt={tutor.tutorName}
                        />
                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                          {tutor.tutorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {tutor.tutorName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {tutor.subjects}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">
                          {typeof tutor.rating === "number"
                            ? tutor.rating.toFixed(1)
                            : 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn("up", 0.6)}>
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
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
                        data={subjects}
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
                        {subjects.map((entry, index) => (
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

        {/*Courses Progress and Recommended Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={fadeIn("up", 0.5)}>
            <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Course Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {courses.map((course) => (
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
                          {course.nextLesson.substring(0, 5)}
                        </span>
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
                  Recommended Courses
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/courses">Browse All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
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
          <Card className="border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800 rounded-lg">
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
                  <Link to="/courses">Browse Courses</Link>
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600/90 dark:hover:bg-purple-700/90"
                  asChild
                >
                  <Link to="/tutors">Find Tutors</Link>
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600/90 dark:hover:bg-blue-700/90"
                  asChild
                >
                  <Link to="/schedules">View Schedule</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

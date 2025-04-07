"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Clock,
  BookOpen,
  Calendar,
  ViewIcon as ViewWeek,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { useToast } from "@/hook/use-toast";
import { ToastContainer } from "@/ui/toast";
import type React from "react";
import {
  getStudentCourseByUserId,
  getTutorCourseByUserId,
} from "@/services/courseService";
import { useAuth } from "@/hook/use-auth";
import WeeklyTableSchedule from "./weekly-table-schedule";
import CourseTableSchedule from "./course-table-schedule";
import { CircleDollarSign, Video, Users } from "lucide-react";

// Types
interface Schedule {
  id: number;
  tutorId: number;
  courseId: number;
  dayOfWeek: number;
  startHour: string;
  endHour: string;
  mode: string;
  location: string;
  status: string;
}

interface Course {
  id: number;
  courseName: string;
  tutorId: number;
  tutorName: string;
  description: string;
  startDate: string;
  endDate: string;
  fee: number;
  maxStudents: number;
  status: string;
  createdAt: string;
  schedule: Schedule[];
}

const formatTime = (time: string) => {
  const [hour, minute] = time.split(":");
  const period = Number.parseInt(hour) >= 12 ? "PM" : "AM";
  const formattedHour = Number.parseInt(hour) % 12 || 12;
  return `${formattedHour}:${minute} ${period}`;
};

const MODE_ICONS: { [key: string]: React.ReactNode } = {
  online: <Video className="h-3 w-3 mr-1 text-green-500 dark:text-green-400" />,
  inPerson: <Users className="h-3 w-3 mr-1 text-blue-500 dark:text-blue-400" />,
  hybrid: (
    <CircleDollarSign className="h-3 w-3 mr-1 text-orange-500 dark:text-orange-400" />
  ),
};

// Main component
export default function ScheduleView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast, toasts, dismiss } = useToast();
  const { user } = useAuth();
  const role = user?.role;
  const max = 1000;

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);

      const fetchCoursesByRole =
        role === "Tutor" ? getTutorCourseByUserId : getStudentCourseByUserId;

      const response = await fetchCoursesByRole({
        pageNumber: 1,
        pageSize: max,
      });

      if (response.succeeded) {
        setCourses(response.data || []);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load your schedule",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to load your schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [role]);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Filter active courses (not canceled)
  const activeCourses = useMemo(() => {
    return courses.filter((course) => course.status !== "canceled");
  }, [courses]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
            My Class Schedule
          </h1>

          <Button
            onClick={fetchCourses}
            variant="outline"
            className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
          >
            Refresh Schedule
          </Button>
        </div>

        {/* Schedule Views */}
        <Card className="border border-indigo-100 dark:border-indigo-900 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3">
            <CardTitle className="flex items-center text-lg">
              <Clock className="h-5 w-5 mr-2" />
              My Schedule
            </CardTitle>
          </CardHeader>

          <CardContent className="p-3 dark:bg-gray-700 bg-white">
            {loading ? (
              <div className=" flex justify-center py-8">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
                  <p className="text-indigo-600 dark:text-indigo-400">
                    Loading your schedule...
                  </p>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="weekly" className=" w-full">
                <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
                  <TabsTrigger
                    value="weekly"
                    className="flex items-center text-xs"
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Weekly View
                  </TabsTrigger>
                  <TabsTrigger
                    value="courses"
                    className="flex items-center text-xs"
                  >
                    <ViewWeek className="h-3.5 w-3.5 mr-1" />
                    Course View
                  </TabsTrigger>
                  {/* <TabsTrigger
                    value="list"
                    className="flex items-center text-xs"
                  >
                    <LayoutList className="h-3.5 w-3.5 mr-1" />
                    List View
                  </TabsTrigger> */}
                </TabsList>

                <TabsContent value="weekly" className="mt-0">
                  <WeeklyTableSchedule courses={activeCourses} />
                </TabsContent>

                <TabsContent value="courses" className="mt-0">
                  <CourseTableSchedule courses={activeCourses} />
                </TabsContent>

                <TabsContent value="list" className="mt-0">
                  {activeCourses.length > 0 ? (
                    <div className="space-y-4">
                      {activeCourses.map((course) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 border border-indigo-100 dark:border-indigo-800 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
                        >
                          <div className="flex flex-col space-y-2">
                            <div className="flex justify-between items-start">
                              <h3 className="text-base font-semibold text-indigo-700 dark:text-indigo-300">
                                {course.courseName}
                              </h3>
                              <div className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                {course.status.charAt(0).toUpperCase() +
                                  course.status.slice(1)}
                              </div>
                            </div>

                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Tutor: {course.tutorName}
                            </div>

                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {new Date(course.startDate).toLocaleDateString()}{" "}
                              - {new Date(course.endDate).toLocaleDateString()}
                            </div>

                            {course.schedule && course.schedule.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <div className="text-xs font-medium mb-1">
                                  Schedule:
                                </div>
                                <div className="grid grid-cols-1 gap-1">
                                  {course.schedule.map((schedule, idx) => {
                                    const dayOfWeek = [
                                      "Sunday",
                                      "Monday",
                                      "Tuesday",
                                      "Wednesday",
                                      "Thursday",
                                      "Friday",
                                      "Saturday",
                                    ][schedule.dayOfWeek];
                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-center text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 p-1 rounded"
                                      >
                                        <span className="font-medium mr-2">
                                          {dayOfWeek}
                                        </span>
                                        <Clock className="h-3 w-3 mr-1 text-indigo-500 dark:text-indigo-400" />
                                        <span className="mr-2">
                                          {formatTime(schedule.startHour)} -{" "}
                                          {formatTime(schedule.endHour)}
                                        </span>
                                        <span className="capitalize flex items-center">
                                          {MODE_ICONS[schedule.mode]}
                                          <span className="ml-1">
                                            {schedule.mode}
                                          </span>
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow">
                      <BookOpen className="h-12 w-12 mx-auto text-indigo-300 dark:text-indigo-700 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No courses found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        You are not enrolled in any courses at the moment.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
    </div>
  );
}

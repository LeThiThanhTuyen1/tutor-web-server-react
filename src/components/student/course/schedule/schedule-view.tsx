"use client";

import {
  useState,
  useCallback,
  useMemo,
  Suspense,
  lazy,
  useEffect,
} from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  List,
  Loader2,
  Clock,
  BookOpen,
  User,
  Calendar,
  MapPin,
  Globe,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastContainer } from "@/ui/toast";
import React from "react"; // Import React
import {
  getStudentCourseByUserId,
  getTutorCourseByUserId,
} from "@/services/courseService";
import { cn } from "@/ui/cn";
import { useAuth } from "@/hooks/use-auth";

// Lazy load the calendar view for better performance
const CalendarView = lazy(() => import("./schedule-calendar-view"));

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

// Day of week mapping
const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Status styles
const STATUS_STYLES: Record<string, string> = {
  ongoing:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  canceled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  coming:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  scheduled:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
};

// Mode icons
const MODE_ICONS: Record<string, JSX.Element> = {
  online: <Globe className="h-4 w-4" />,
  offline: <MapPin className="h-4 w-4" />,
};

// Format time (e.g., "14:30:00" to "2:30 PM")
const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// ScheduleItem component - memoized
const ScheduleItem = React.memo(
  ({ schedule, course }: { schedule: Schedule; course: Course }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border border-indigo-100 dark:border-indigo-800 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
            <Clock className="h-8 w-8" />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {course.courseName}
              </h3>
              <Badge
                variant="outline"
                className={cn("text-xs", STATUS_STYLES[schedule.status])}
              >
                {schedule.status.charAt(0).toUpperCase() +
                  schedule.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400" />
                <span>
                  {formatTime(schedule.startHour)} -{" "}
                  {formatTime(schedule.endHour)}
                </span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <User className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400" />
                <span>{course.tutorName}</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400">
                {MODE_ICONS[schedule.mode] || (
                  <Globe className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400" />
                )}
                <span className="capitalize ml-1">{schedule.mode}</span>
              </div>

              {schedule.location && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400" />
                  <span className="truncate">{schedule.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);
ScheduleItem.displayName = "ScheduleItem";

// DaySchedule component - memoized
const DaySchedule = React.memo(
  ({
    day,
    schedules,
    courses,
  }: {
    day: string;
    schedules: Schedule[];
    courses: Record<number, Course>;
  }) => {
    if (schedules.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-indigo-800 dark:text-indigo-300 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          {day}
        </h3>

        <div className="space-y-3">
          {schedules.map((schedule) => (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              course={
                courses[schedule.courseId] || {
                  id: 0,
                  courseName: "Unknown Course",
                  tutorId: 0,
                  tutorName: "Unknown Tutor",
                  description: "",
                  startDate: "",
                  endDate: "",
                  fee: 0,
                  maxStudents: 0,
                  status: "",
                  createdAt: "",
                  schedule: [],
                }
              }
            />
          ))}
        </div>
      </div>
    );
  }
);
DaySchedule.displayName = "DaySchedule";

// WeeklyListView component - memoized
const WeeklyListView = React.memo(({ courses }: { courses: Course[] }) => {
  // Group schedules by day of week
  const schedulesByDay = useMemo(() => {
    const days: Record<number, Schedule[]> = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    };

    const courseMap: Record<number, Course> = {};

    courses.forEach((course) => {
      // Skip canceled courses
      if (course.status === "canceled") return;

      courseMap[course.id] = course;

      course.schedule.forEach((schedule) => {
        // Add courseId to schedule for reference
        const scheduleWithCourseId = {
          ...schedule,
          courseId: course.id,
        };

        if (days[schedule.dayOfWeek]) {
          days[schedule.dayOfWeek].push(scheduleWithCourseId);
        }
      });
    });

    // Sort schedules by start time
    Object.keys(days).forEach((day) => {
      days[Number(day)].sort((a, b) => {
        return a.startHour.localeCompare(b.startHour);
      });
    });

    return { days, courseMap };
  }, [courses]);

  return (
    <div className="space-y-4">
      {DAYS_OF_WEEK.map((day, index) => (
        <DaySchedule
          key={day}
          day={day}
          schedules={schedulesByDay.days[index]}
          courses={schedulesByDay.courseMap}
        />
      ))}

      {Object.values(schedulesByDay.days).every((day) => day.length === 0) && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <BookOpen className="h-12 w-12 mx-auto text-indigo-300 dark:text-indigo-700 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No scheduled classes
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You don't have any scheduled classes for this week.
          </p>
        </div>
      )}
    </div>
  );
});
WeeklyListView.displayName = "WeeklyListView";

// Main component
export default function ScheduleView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast, toasts, dismiss } = useToast();
  const { user } = useAuth();
  const role = user?.role;
  const max = 1000;
  // Fetch student courses

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
  // const activeCourses = useMemo(() => {
  //   return courses.filter((course) => course.status !== "canceled");
  // }, [courses]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6">
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
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardTitle className="flex items-center text-xl">
              <Clock className="h-5 w-5 mr-2" />
              Weekly Schedule
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
                  <p className="text-indigo-600 dark:text-indigo-400">
                    Loading your schedule...
                  </p>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
                  <TabsTrigger value="list" className="flex items-center">
                    <List className="h-4 w-4 mr-2" />
                    List View
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Calendar View
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="mt-0">
                  <WeeklyListView courses={courses} />
                </TabsContent>

                <TabsContent value="calendar" className="mt-0">
                  <Suspense
                    fallback={
                      <div className="flex justify-center py-12">
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
                          <p className="text-indigo-600 dark:text-indigo-400">
                            Loading calendar view...
                          </p>
                        </div>
                      </div>
                    }
                  >
                    <CalendarView courses={courses} />
                  </Suspense>
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

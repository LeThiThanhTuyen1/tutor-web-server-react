/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCourseById, cancelCourse } from "@/services/courseService";
import { Skeleton } from "@/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  School,
  User,
  Users,
  Video,
  X,
  Edit,
} from "lucide-react";
import { cn } from "../layout/cn";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { CancelCourseModal } from "@/ui/modals/cancel-course";
import { Badge } from "@/ui/badge";

// Status styles
const STATUS_STYLES: Record<string, string> = {
  ongoing:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  canceled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  coming:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

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

// Mode icons
const MODE_ICONS: Record<string, React.ReactNode> = {
  online: <Video className="h-4 w-4" />,
  "in-person": <MapPin className="h-4 w-4" />,
  hybrid: <School className="h-4 w-4" />,
};

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if the current user is the tutor of this course
  const isTutor = user?.role === "Tutor";

  useEffect(() => {
    async function fetchData() {
      if (id) {
        setLoading(true);
        try {
          const courseData = await getCourseById(Number(id));
          setCourse(courseData);
        } catch (error) {
          console.error("Error fetching course data:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchData();
  }, [id]);

  // Format time (e.g., "14:30" to "2:30 PM")
  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Handle course cancellation
  const handleCancelCourse = async () => {
    if (!id) return;

    try {
      setIsCancelling(true);
      const response = await cancelCourse(Number(id));

      if (response.succeeded) {
        toast({
          title: "Success",
          description: "Course has been cancelled successfully",
          variant: "success",
        });

        // Refresh course data
        const updatedCourse = await getCourseById(Number(id));
        setCourse(updatedCourse);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to cancel course",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
      setIsCancelDialogOpen(false);
    }
  };

  // Check if course can be cancelled (only coming or ongoing courses)
  const canCancel =
    isTutor &&
    course &&
    (course.status === "ongoing" || course.status === "coming");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-8 w-32" />
          </div>
          <Card className="border border-indigo-100 dark:border-indigo-900 mb-6">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-indigo-100 dark:border-indigo-900 mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>

          <div className="mt-8">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 md:p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-indigo-950 dark:text-indigo-50 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-no hover:bg-no mb-6 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const hasSchedules = course.schedule && course.schedule.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate(-1)}
          className="bg-no hover:bg-no mb-6 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Course Overview Card */}
          <Card className="border border-indigo-100 dark:border-indigo-900 overflow-hidden bg-white dark:bg-gray-800">
            <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <CardTitle className="text-2xl font-bold text-indigo-950 dark:text-indigo-50">
                  {course.courseName}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-sm font-medium",
                    STATUS_STYLES[course.status] ||
                      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                  )}
                >
                  {course.status.charAt(0).toUpperCase() +
                    course.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {course.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <User className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Tutor:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {course.tutorName}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Duration:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(course.startDate).toLocaleDateString()} -{" "}
                      {new Date(course.endDate).toLocaleDateString()}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <DollarSign className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Fee:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ${course.fee}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Users className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Max Students:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {course.maxStudents}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Created:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Schedule Card */}
          <Card className="border border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-indigo-950 dark:text-indigo-50 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                Course Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasSchedules ? (
                <Tabs defaultValue="table" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="table">Table View</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="table" className="w-full">
                    <div className="rounded-md border border-indigo-300 dark:border-indigo-900">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Mode</TableHead>
                            <TableHead>Location</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {course.schedule.map(
                            (schedule: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {DAYS_OF_WEEK[schedule.dayOfWeek]}
                                </TableCell>
                                <TableCell>
                                  {formatTime(schedule.startHour)} -{" "}
                                  {formatTime(schedule.endHour)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    {MODE_ICONS[
                                      schedule.mode.toLowerCase()
                                    ] || <School className="h-4 w-4 mr-1" />}
                                    <span className="ml-1 capitalize">
                                      {schedule.mode}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {schedule.location || "N/A"}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="calendar">
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {DAYS_OF_WEEK.map((day, index) => (
                        <div
                          key={day}
                          className="font-medium p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-t-md"
                        >
                          {day.substring(0, 3)}
                        </div>
                      ))}

                      {DAYS_OF_WEEK.map((day, dayIndex) => {
                        const daySchedules = course.schedule.filter(
                          (s: any) => s.dayOfWeek === dayIndex
                        );
                        return (
                          <div
                            key={day}
                            className={cn(
                              "min-h-24 p-2 border border-indigo-100 dark:border-indigo-900 rounded-b-md",
                              daySchedules.length > 0
                                ? "bg-indigo-50/50 dark:bg-indigo-900/20"
                                : ""
                            )}
                          >
                            {daySchedules.length > 0 ? (
                              <div className="space-y-2">
                                {daySchedules.map(
                                  (schedule: any, index: number) => (
                                    <div
                                      key={index}
                                      className="text-xs p-1.5 bg-indigo-100 dark:bg-indigo-800 rounded text-left"
                                    >
                                      <div className="font-medium">
                                        {formatTime(schedule.startHour)} -{" "}
                                        {formatTime(schedule.endHour)}
                                      </div>
                                      <div className="flex items-center mt-1 text-indigo-700 dark:text-indigo-300">
                                        {MODE_ICONS[
                                          schedule.mode.toLowerCase()
                                        ] || (
                                          <School className="h-3 w-3 mr-1" />
                                        )}
                                        <span className="ml-1 capitalize">
                                          {schedule.mode}
                                        </span>
                                      </div>
                                      {schedule.location && (
                                        <div className="mt-1 text-gray-600 dark:text-gray-400 truncate">
                                          <MapPin className="h-3 w-3 inline mr-1" />
                                          {schedule.location}
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                                No classes
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-indigo-300 dark:text-indigo-700" />
                  <p>No schedule information available for this course.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {!isTutor && (
              <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90">
                <Link to={`/enrollment/${course.id}`}>Enroll Now</Link>
              </Button>
            )}

            <Button
              variant="outline"
              className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
            >
              <Link to={`/tutor/${course.tutorId}`}>View Tutor</Link>
            </Button>

            {/* Edit Button - Only for tutors */}
            {isTutor && (
              <Button
                variant="outline"
                className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
              >
                <Link
                  to={`/tutor/courses/${course.id}/edit`}
                  className="flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Course
                </Link>
              </Button>
            )}

            {/* Cancel Button - Only for tutors and courses that can be cancelled */}
            {canCancel && (
              <Button
                variant="outline"
                onClick={() => setIsCancelDialogOpen(true)}
                disabled={
                  course.status === "canceled" || course.status === "completed"
                }
                className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel Course
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Cancel Course Confirmation Modal */}
      <CancelCourseModal
        isOpen={isCancelDialogOpen}
        onCancel={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelCourse}
        isCancelling={isCancelling}
      />
    </div>
  );
}

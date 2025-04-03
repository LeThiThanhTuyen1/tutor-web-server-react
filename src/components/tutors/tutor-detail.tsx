/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Mail,
  Phone,
  Search,
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
import { useCourse } from "@/hooks/use-course";
import { Input } from "@/ui/input";
import LazyImage from "../home/lazy-image";
import { API_BASE_URL } from "@/config/axiosInstance";
import { ContractModal } from "@/ui/modals/contract-modal";
import { enrollCourse } from "@/services/enrollmentService";
import { STATUS_STYLES } from "../courses/course-card";

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
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [activeStudentTab, setActiveStudentTab] = useState("all");
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { totalStudents, students, getStudentsByCourseId } = useCourse();
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Use our custom hook to access course state and actions
  const { currentCourse, loading, getCourseById, cancelCourse } = useCourse();

  // Check if the current user is the tutor of this course
  const isTutor = user?.role === "Tutor";

  useEffect(() => {
    if (id) {
      getCourseById(Number(id));
      if (isTutor) {
        getStudentsByCourseId(Number(id));
      }
    }
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
      await cancelCourse(Number(id));

      toast({
        title: "Success",
        description: "Course has been cancelled successfully",
        variant: "success",
      });
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

  // Handle course enrollment
  const handleEnrollCourse = async () => {
    if (!id) return;

    try {
      setIsEnrolling(true);
      const response = await enrollCourse(Number(id));

      if (response.succeeded) {
        toast({
          title: "Success",
          description: "You have successfully enrolled in this course",
          variant: "success",
        });

        // Refresh the course details
        getCourseById(Number(id));
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to enroll in this course",
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
      setIsEnrolling(false);
      setIsContractDialogOpen(false);
    }
  };

  // Filter students based on search term and active tab
  const filteredStudents = students
    ? students.filter((student) => {
        const matchesSearch = studentSearchTerm
          ? student.name
              ?.toLowerCase()
              .includes(studentSearchTerm.toLowerCase()) ||
            student.email
              ?.toLowerCase()
              .includes(studentSearchTerm.toLowerCase())
          : true;

        const matchesTab =
          activeStudentTab === "all"
            ? true
            : student.status?.toLowerCase() === activeStudentTab?.toLowerCase();

        return matchesSearch && matchesTab;
      })
    : [];

  // Get counts for each status
  const studentCounts = students
    ? {
        all: students.length,
        active: students.filter((s) => s.status?.toLowerCase() === "active")
          .length,
        inactive: students.filter((s) => s.status?.toLowerCase() === "inactive")
          .length,
        pending: students.filter((s) => s.status?.toLowerCase() === "pending")
          .length,
      }
    : { all: 0, active: 0, inactive: 0, pending: 0 };

  // Check if course can be cancelled (only coming or ongoing courses)
  const canCancel =
    isTutor &&
    currentCourse &&
    (currentCourse.status === "ongoing" || currentCourse.status === "coming");

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

  if (!currentCourse) {
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

  const hasSchedules =
    currentCourse.schedule && currentCourse.schedule.length > 0;

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
                  {currentCourse.courseName}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-sm font-medium",
                    STATUS_STYLES[currentCourse.status] ||
                      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                  )}
                >
                  {currentCourse.status.charAt(0).toUpperCase() +
                    currentCourse.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {currentCourse.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <User className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Tutor:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {currentCourse.tutorName}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Duration:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(currentCourse.startDate).toLocaleDateString()} -{" "}
                      {new Date(currentCourse.endDate).toLocaleDateString()}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <DollarSign className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Fee:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ${currentCourse.fee}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Users className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Max Students:{" "}
                    {isTutor ? (
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {totalStudents || 0}/{currentCourse.maxStudents}
                      </span>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {currentCourse.maxStudents}
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Created:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(currentCourse.createdAt).toLocaleDateString()}
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
                          {currentCourse.schedule.map(
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
                                      schedule.mode?.toLowerCase()
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
                        const daySchedules = currentCourse.schedule.filter(
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
                                          schedule.mode?.toLowerCase()
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

          {/* Students List - Only visible to tutors */}
          {isTutor && (
            <Card className="border border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-indigo-950 dark:text-indigo-50 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  Enrolled Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : students && students.length > 0 && isTutor ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search students..."
                          value={studentSearchTerm}
                          onChange={(e) => setStudentSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Tabs
                      defaultValue="all"
                      onValueChange={setActiveStudentTab}
                    >
                      <TabsList className="mb-4">
                        <TabsTrigger value="all">
                          All ({studentCounts.all})
                        </TabsTrigger>
                        <TabsTrigger value="active">
                          Active ({studentCounts.active})
                        </TabsTrigger>
                        <TabsTrigger value="inactive">
                          Inactive ({studentCounts.inactive})
                        </TabsTrigger>
                        <TabsTrigger value="pending">
                          Pending ({studentCounts.pending})
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="all" className="mt-0">
                        {renderStudentList(filteredStudents)}
                      </TabsContent>

                      <TabsContent value="active" className="mt-0">
                        {renderStudentList(filteredStudents)}
                      </TabsContent>

                      <TabsContent value="inactive" className="mt-0">
                        {renderStudentList(filteredStudents)}
                      </TabsContent>

                      <TabsContent value="pending" className="mt-0">
                        {renderStudentList(filteredStudents)}
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-2 text-indigo-300 dark:text-indigo-700" />
                    <p>No students enrolled in this course yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {!isTutor && (
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                onClick={() => setIsContractDialogOpen(true)}
                disabled={isEnrolling}
              >
                {isEnrolling ? "Enrolling..." : "Enroll Now"}
              </Button>
            )}

            <Button
              variant="outline"
              className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
            >
              <Link to={`/tutor/${currentCourse.tutorId}`}>View Tutor</Link>
            </Button>

            {/* Edit Button - Only for tutors */}
            {isTutor && (
              <Button
                variant="outline"
                className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
              >
                <Link
                  to={`/tutor/courses/${currentCourse.id}/edit`}
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
                  currentCourse.status === "canceled" ||
                  currentCourse.status === "completed"
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

      {/* Contract Modal for Enrollment */}
      {!isTutor && currentCourse && (
        <ContractModal
          isOpen={isContractDialogOpen}
          onClose={() => setIsContractDialogOpen(false)}
          onConfirm={handleEnrollCourse}
          isProcessing={isEnrolling}
          courseTitle={currentCourse.courseName}
          tutorName={currentCourse.tutorName}
          studentName={user?.name || "Student"}
          fee={currentCourse.fee}
        />
      )}
    </div>
  );
}

// Helper function to render student list
function renderStudentList(students: any[]) {
  if (students.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        <p>No students match your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {students.map((student) => (
        <div
          key={student.id}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 border border-indigo-100 dark:border-indigo-800">
              <LazyImage
                src={`${API_BASE_URL}/${student.profileImage}`}
                alt={student.fullName}
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {student.name}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <span>{student.fullName}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Mail className="h-3.5 w-3.5 mr-1 text-indigo-500 dark:text-indigo-400" />
                      <span>{student.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Phone className="h-3.5 w-3.5 mr-1 text-indigo-500 dark:text-indigo-400" />
                      <span>{student.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      student.status?.toLowerCase() === "active"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : student.status?.toLowerCase() === "inactive"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    )}
                  >
                    {student.status}
                  </Badge>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Enrolled on{" "}
                  {new Date(student.enrolledAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

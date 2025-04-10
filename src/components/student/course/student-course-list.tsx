"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  XCircle,
  Eye,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Checkbox } from "@/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Tabs, TabsContent } from "@/ui/tabs";
import { useToast } from "@/hook/use-toast";
import { ToastContainer } from "@/ui/toast";
import { CancelCourseModal } from "@/ui/modals/cancel-course";
import { PaginationFilter } from "@/types/paginated-response";
import { cn } from "@/ui/cn";
import { Link, useSearchParams } from "react-router-dom"; // Thêm useSearchParams
import { Badge } from "@/ui/badge";
import { useCourse } from "@/hook/use-course";
import { formatRelativeDate } from "@/components/courses/course-utils";
import { STATUS_STYLES } from "@/components/courses/course-card";
import { initiatePayment, unenrollStudent } from "@/services/enrollmentService";

export default function StudentCourseList() {
  const { studentCourses, loading, totalPages, getStudentCourses } = useCourse();
  const [filteredCourses, setFilteredCourses] = useState(studentCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [courseToCancel, setCourseToCancel] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const { toast, toasts, dismiss } = useToast();
  const [pagination, setPagination] = useState<PaginationFilter>({
    pageNumber: 1,
    pageSize: 9,
  });
  const searchParams = useSearchParams()[0]; // Lấy query parameters

  useEffect(() => {
    getStudentCourses(pagination);

    // Xử lý query parameters từ redirect sau thanh toán
    const success = searchParams.get("success");
    const enrollmentId = searchParams.get("enrollmentId");
    const code = searchParams.get("code");

    if (success === "true" && enrollmentId) {
      toast({
        title: "Payment Successful",
        description: "Your payment was completed successfully!",
        variant: "success",
      });
      getStudentCourses(pagination); // Làm mới danh sách để cập nhật trạng thái
    } else if (success === "false") {
      toast({
        title: "Payment Failed",
        description: `Payment failed with code: ${code || "Unknown error"}`,
        variant: "destructive",
      });
    }
  }, [pagination, searchParams]);

  useEffect(() => {
    let result = studentCourses;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (course) =>
          course.courseName.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((course) => course.status === statusFilter);
    }

    setFilteredCourses(result);
  }, [studentCourses, searchTerm, statusFilter]);

  const handlePayment = async (enrollmentId: number) => {
    try {
      const paymentUrl = await initiatePayment(enrollmentId);
      window.location.href = paymentUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate payment",
        variant: "destructive",
      });
    }
  };

  const toggleCourseSelection = (courseId: number) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handlePageChange = (pageNumber: number) => {
    setPagination((prev) => ({
      ...prev,
      pageNumber,
    }));
  };

  const handleCancelCourse = (courseId: number) => {
    setCourseToCancel(courseId);
    setIsCancelDialogOpen(true);
  };

  const confirmCancelCourse = async () => {
    if (!courseToCancel) return;

    try {
      setIsCancelling(true);
      await unenrollStudent(courseToCancel);
      toast({
        title: "Success",
        description: "Course has been cancelled successfully",
        variant: "success",
      });
      getStudentCourses(pagination);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
      setIsCancelDialogOpen(false);
      setCourseToCancel(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">My Courses</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <Tabs defaultValue="list" className="w-full">
            <TabsContent value="list" className="p-0">
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "You haven't enrolled in any courses yet"}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCourses.map((course) => (
                    <motion.li
                      key={course.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedCourses.includes(course.id)}
                          onCheckedChange={() => toggleCourseSelection(course.id)}
                          className="mt-1 h-5 w-5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                  {course.courseName}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs font-medium",
                                    STATUS_STYLES[course.status] ||
                                      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                  )}
                                >
                                  {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Enroll {formatRelativeDate(course.enrolledAt)}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {course.status === "pending" && (
                                <>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleCancelCourse(course.id)}
                                    className="flex-1 text-white md:w-full bg-red-600 hover:bg-red-700 dark:bg-red-600/90 dark:hover:bg-red-700/90"
                                  >
                                    <XCircle className="h-3.5 w-3.5 mr-1" />
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handlePayment(course.id)}
                                  >
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    Pay
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="default"
                                size="sm"
                                className="flex-1 md:w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                              >
                                <Link to={`/courses/${course.id}`} className="flex items-center">
                                  <Eye className="h-3.5 w-3.5 mr-1" />
                                  View
                                </Link>
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 text-sm">
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <User className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                              <span>Tutor: {course.tutorName}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <DollarSign className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                              <span>${course.fee}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                              <span className="truncate">
                                {new Date(course.startDate).toLocaleDateString()} -{" "}
                                {new Date(course.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="mt-6 p-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={pagination.pageNumber === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(i + 1)}
                  className={pagination.pageNumber === i + 1 ? "bg-indigo-600" : ""}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
      <CancelCourseModal
        isOpen={isCancelDialogOpen}
        onCancel={() => setIsCancelDialogOpen(false)}
        onConfirm={confirmCancelCourse}
        isCancelling={isCancelling}
      />
      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
    </div>
  );
}
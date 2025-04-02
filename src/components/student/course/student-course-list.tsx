"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Trash2, Search, BookOpen, XCircle, Eye } from "lucide-react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Card, CardContent } from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Tabs, TabsContent } from "@/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ToastContainer } from "@/ui/toast";
import { CancelCourseModal } from "@/ui/modals/cancel-course";
import {
  Course,
  formatRelativeDate,
  STATUS_STYLES,
} from "@/components/courses/course-utils";
import {
  cancelCourse,
  getStudentCourseByUserId,
} from "@/services/courseService";
import { PaginationFilter } from "@/types/paginated-response";
import { cn } from "@/components/layout/cn";
import { Link } from "react-router-dom";
import { Badge } from "@/ui/badge";

export default function StudentCourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [courseToCancel, setCourseToCancel] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast, toasts, dismiss } = useToast();
  const [pagination, setPagination] = useState<PaginationFilter>({
    pageNumber: 1,
    pageSize: 9,
  });
  // Fetch tutor courses
  // Cập nhật fetchCourses để giữ nguyên pageNumber
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getStudentCourseByUserId(pagination);
      setCourses(response.data || []);
      setFilteredCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to load courses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [pagination]); 

  const handlePageChange = (pageNumber: number) => {
    setPagination((prev) => ({
      ...prev,
      pageNumber,
    }));
  };

  // Khi pagination thay đổi thì fetchCourses tự động gọi lại
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Filter courses based on search term and status
  useEffect(() => {
    let result = courses;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (course) =>
          course.courseName.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((course) => course.status === statusFilter);
    }

    setFilteredCourses(result);
  }, [courses, searchTerm, statusFilter]);

  // Toggle course selection
  const toggleCourseSelection = (courseId: number) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Select all courses
  //   const toggleSelectAll = () => {
  //     if (selectedCourses.length === filteredCourses.length) {
  //       setSelectedCourses([]);
  //     } else {
  //       setSelectedCourses(filteredCourses.map((course) => course.id));
  //     }
  //   };

  // Open cancel dialog
  const handleCancelCourse = (courseId: number) => {
    setCourseToCancel(courseId);
    setIsCancelDialogOpen(true);
  };

  // Confirm course cancellation
  const confirmCancelCourse = async () => {
    if (!courseToCancel) return;

    try {
      setIsCancelling(true);
      const response = await cancelCourse(courseToCancel);

      if (response.succeeded) {
        toast({
          title: "Success",
          description: "Course has been cancelled successfully",
          variant: "success",
        });
        fetchCourses();
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
      setCourseToCancel(null);
    }
  };

  // Delete selected
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        {/* Header with actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">My Courses</h1>
        </div>

        {/* Search and filters */}

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
                  <SelectItem value="coming">Coming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Course list */}
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
                      : "You haven't created any courses yet"}
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
                          onCheckedChange={() =>
                            toggleCourseSelection(course.id)
                          }
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
                                  {course.status.charAt(0).toUpperCase() +
                                    course.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Created {formatRelativeDate(course.createdAt)}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {course.status === "coming" && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleCancelCourse(course.id)}
                                  className="flex-1 text-white md:w-full bg-red-600 hover:bg-red-700 dark:bg-red-600/90 dark:hover:bg-red-700/90"
                                >
                                  <XCircle className="h-3.5 w-3.5 mr-1" />
                                  Cancel
                                </Button>
                              )}
                              <Button
                                variant="default"
                                size="sm"
                                className="flex-1 md:w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                              >
                                <Link
                                  to={`/courses/${course.id}`}
                                  className="flex items-center"
                                >
                                  <Eye className="h-3.5 w-3.5 mr-1" />
                                  View
                                </Link>
                              </Button>
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

      {/* Cancel Course Modal */}
      <CancelCourseModal
        isOpen={isCancelDialogOpen}
        onCancel={() => setIsCancelDialogOpen(false)}
        onConfirm={confirmCancelCourse}
        isCancelling={isCancelling}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full animate-in fade-in-50 zoom-in-95">
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2 flex items-center text-red-600">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Delete Courses
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete {selectedCourses.length}{" "}
                  selected course(s)? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  // onClick={deleteSelectedCourses}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
    </div>
  );
}

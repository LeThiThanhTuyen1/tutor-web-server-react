"use client";

import { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  XCircle,
  Eye,
  DollarSign,
  MoreHorizontal,
  RefreshCw,
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
import { useToast } from "@/hook/use-toast";
import { ToastContainer } from "@/ui/toast";
import { CancelCourseModal } from "@/ui/modals/cancel-course";
import type { PaginationFilter } from "@/types/paginated-response";
import { cn } from "@/ui/cn";
import { Link, useSearchParams } from "react-router-dom";
import { Badge } from "@/ui/badge";
import { useCourse } from "@/hook/use-course";
import { STATUS_STYLES } from "@/components/courses/course-card";
import { initiatePayment, unenrollStudent } from "@/services/enrollmentService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Skeleton } from "@/ui/skeleton";

export default function StudentCourseTable() {
  const { studentCourses, loading, totalPages, getStudentCourses } =
    useCourse();
  const [filteredCourses, setFilteredCourses] = useState(studentCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [courseToCancel, setCourseToCancel] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast, toasts, dismiss } = useToast();
  const [pagination, setPagination] = useState<PaginationFilter>({
    pageNumber: 1,
    pageSize: 10, // Increased page size for table view
  });
  const searchParams = useSearchParams()[0];

  useEffect(() => {
    getStudentCourses(pagination);

    // Handle payment redirect
    const success = searchParams.get("success");
    const enrollmentId = searchParams.get("enrollmentId");
    const code = searchParams.get("code");

    if (success === "true" && enrollmentId) {
      toast({
        title: "Payment Successful",
        description: "Your payment was completed successfully!",
        variant: "success",
      });
      getStudentCourses(pagination);
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
          course.tutorName?.toLowerCase().includes(term)
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

  const toggleAllCourses = (checked: boolean) => {
    if (checked) {
      setSelectedCourses(filteredCourses.map((course) => course.id));
    } else {
      setSelectedCourses([]);
    }
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

  const refreshCourses = async () => {
    setIsRefreshing(true);
    await getStudentCourses(pagination);
    setIsRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshCourses}
              disabled={isRefreshing}
              className="h-9"
            >
              <RefreshCw
                className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by course or tutor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        onCheckedChange={(checked) =>
                          toggleAllCourses(checked as boolean)
                        }
                        checked={
                          filteredCourses.length > 0 &&
                          selectedCourses.length === filteredCourses.length
                        }
                        className="ml-2"
                      />
                    </TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Tutor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCourses.includes(course.id)}
                          onCheckedChange={() =>
                            toggleCourseSelection(course.id)
                          }
                          className="ml-2"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-[200px] truncate">
                          {course.courseName}
                        </div>
                      </TableCell>
                      <TableCell>{course.tutorName}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>{formatDate(course.startDate)}</div>
                          <div>{formatDate(course.endDate)}</div>
                        </div>
                      </TableCell>
                      <TableCell>${course.fee}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/courses/${course.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              {course.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handlePayment(course.id)}
                                    className="text-yellow-500"
                                  >
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Make Payment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleCancelCourse(course.id)
                                    }
                                    className="text-red-600"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel Enrollment
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 p-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={
                    pagination.pageNumber === i + 1 ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handlePageChange(i + 1)}
                  className={
                    pagination.pageNumber === i + 1 ? "bg-indigo-600" : ""
                  }
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

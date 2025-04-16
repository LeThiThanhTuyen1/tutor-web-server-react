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
  History,
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
import {
  initiatePayment,
  unenrollStudent,
  getBillHistory,
  confirmPayment,
} from "@/services/enrollmentService";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/tabs";

export default function StudentCourseTable() {
  const {
    studentCourses,
    loading: coursesLoading,
    totalPages: totalCoursePages,
    getStudentCourses,
  } = useCourse();
  const [filteredCourses, setFilteredCourses] = useState(studentCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [courseToCancel, setCourseToCancel] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast, toasts, dismiss } = useToast();
  const [coursePagination, setCoursePagination] = useState<PaginationFilter>({
    pageNumber: 1,
    pageSize: 10,
  });

  // State for bill history
  const [billHistory, setBillHistory] = useState<any[]>([]);
  const [billPagination, setBillPagination] = useState<PaginationFilter>({
    pageNumber: 1,
    pageSize: 10,
  });
  const [totalBillPages, setTotalBillPages] = useState(0);
  const [billLoading, setBillLoading] = useState(false);

  const searchParams = useSearchParams()[0];

  // Fetch student courses
  useEffect(() => {
    getStudentCourses(coursePagination);
  }, [coursePagination]);

  // Fetch bill history
  useEffect(() => {
    const fetchBillHistory = async () => {
      setBillLoading(true);
      try {
        const response = await getBillHistory(billPagination);
        if (response.succeeded) {
          setBillHistory(response.data);
          setTotalBillPages(response.totalPages);
        } else {
          console.log(response.message);
        }
      } catch (error) {
        console.log("Fail to fetch bill history.");
      } finally {
        setBillLoading(false);
      }
    };

    fetchBillHistory();
  }, [billPagination]);

  // Handle payment redirect and confirmation
  useEffect(() => {
    const success = searchParams.get("success");
    const enrollmentId = searchParams.get("enrollmentId");
    const sessionId = searchParams.get("sessionId");
    const message = searchParams.get("message");

    if (success === "true" && enrollmentId && sessionId) {
      // Confirm the payment manually
      const confirmPaymentManually = async () => {
        try {
          const response = await confirmPayment(sessionId);
          if (response.succeeded) {
            toast({
              title: "Payment Confirmed",
              description: "Your payment was confirmed successfully!",
              variant: "success",
            });
            // Refresh courses and bill history
            getStudentCourses(coursePagination);
            const billResponse = await getBillHistory(billPagination);
            if (billResponse.succeeded) {
              setBillHistory(billResponse.data);
              setTotalBillPages(billResponse.totalPages);
            }
          } else {
            toast({
              title: "Payment Confirmation Failed",
              description: response.message || "Unable to confirm payment",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "An error occurred while confirming payment",
            variant: "destructive",
          });
        }
      };

      confirmPaymentManually();
    } else if (success === "false") {
      toast({
        title: "Payment Failed",
        description: message || "Payment was cancelled or failed",
        variant: "destructive",
      });
    }
  }, [searchParams]);

  // Filter courses based on search and status
  useEffect(() => {
    let result = studentCourses;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (course: any) =>
          course.courseName.toLowerCase().includes(term) ||
          course.tutorName?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((course: any) => course.status === statusFilter);
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
      setSelectedCourses(filteredCourses.map((course: any) => course.id));
    } else {
      setSelectedCourses([]);
    }
  };

  const handleCoursePageChange = (pageNumber: number) => {
    setCoursePagination((prev) => ({
      ...prev,
      pageNumber,
    }));
  };

  const handleBillPageChange = (pageNumber: number) => {
    setBillPagination((prev) => ({
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
      const response = await unenrollStudent(courseToCancel);
      if (response.succeeded) {
        toast({
          title: "Success",
          description: "Course has been cancelled successfully",
          variant: "success",
        });
        getStudentCourses(coursePagination);
      }
      else {
        toast({
          title: "Error",
          description: response.message,
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

  const refreshCourses = async () => {
    setIsRefreshing(true);
    await getStudentCourses(coursePagination);
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
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="bill-history">Bill History</TabsTrigger>
        </TabsList>

        {/* My Courses Tab */}
        <TabsContent value="courses">
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
                    className={cn(
                      "h-4 w-4 mr-2",
                      isRefreshing && "animate-spin"
                    )}
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
              {coursesLoading ? (
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
                      {filteredCourses.map((course: any) => (
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
                                    <Link to={`/courses/${course.courseId}`}>
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
                                          handleCancelCourse(course.courseId)
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

            {totalCoursePages > 1 && (
              <div className="mt-6 p-4">
                <div className="flex justify-center">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalCoursePages }, (_, i) => (
                      <Button
                        key={i}
                        variant={
                          coursePagination.pageNumber === i + 1
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleCoursePageChange(i + 1)}
                        className={
                          coursePagination.pageNumber === i + 1
                            ? "bg-indigo-600"
                            : ""
                        }
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Bill History Tab */}
        <TabsContent value="bill-history">
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl font-bold">Bill History</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {billLoading ? (
                <div className="p-4">
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                </div>
              ) : billHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No payment history found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    You haven't made any payments yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billHistory.map((bill: any) => (
                        <TableRow key={bill.paymentId}>
                          <TableCell className="font-medium">
                            <div className="max-w-[200px] truncate">
                              {bill.courseName}
                            </div>
                          </TableCell>
                          <TableCell>${bill.amount}</TableCell>
                          <TableCell>
                            {bill.paymentMethod || "Stripe"}
                          </TableCell>
                          <TableCell>{bill.transactionId}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs font-medium",
                                bill.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              )}
                            >
                              {bill.status.charAt(0).toUpperCase() +
                                bill.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(bill.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {totalBillPages > 1 && (
              <div className="mt-6 p-4">
                <div className="flex justify-center">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalBillPages }, (_, i) => (
                      <Button
                        key={i}
                        variant={
                          billPagination.pageNumber === i + 1
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleBillPageChange(i + 1)}
                        className={
                          billPagination.pageNumber === i + 1
                            ? "bg-indigo-600"
                            : ""
                        }
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

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

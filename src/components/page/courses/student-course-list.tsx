/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hook/use-toast";
import { ToastContainer } from "@/components/ui/toast";
import { CancelCourseModal } from "@/components/ui/modals/cancel-course";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCourse } from "@/hook/use-course";
import { PaginationFilter } from "@/store/authSlice";
import {
  initiatePayment,
  getBillHistory,
  confirmPayment,
  unenrollStudent,
} from "@/services/enrollmentService";
import CourseFilters from "./course-filters";
import CourseTable from "./course-table";
import BillHistoryTable from "./bill-history";

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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [coursePagination, setCoursePagination] = useState<PaginationFilter>({
    pageNumber: 1,
    pageSize: 10,
  });

  const [billHistory, setBillHistory] = useState<any[]>([]);
  const [billPagination, setBillPagination] = useState<PaginationFilter>({
    pageNumber: 1,
    pageSize: 10,
  });
  const [totalBillPages, setTotalBillPages] = useState(0);
  const [billLoading, setBillLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const removeUrlParams = () => {
    window.history.replaceState(null, document.title, window.location.pathname);
  };

  useEffect(() => {
    getStudentCourses(coursePagination);
  }, [coursePagination]);

  useEffect(() => {
    const fetchBillHistory = async () => {
      setBillLoading(true);
      try {
        const response = await getBillHistory(billPagination);
        if (response.succeeded) {
          setBillHistory(response.data || []);
          setTotalBillPages(response.totalPages);
        } else {
          console.log(response.message);
        }
      } catch (error) {
        console.log("Không thể tải lịch sử hóa đơn.");
      } finally {
        setBillLoading(false);
      }
    };

    fetchBillHistory();
  }, [billPagination]);

  useEffect(() => {
    const success = searchParams.get("success");
    const enrollmentId = searchParams.get("enrollmentId");
    const sessionId = searchParams.get("sessionId");
    const message = searchParams.get("message");
    const paymentMethod = searchParams.get("paymentMethod"); 
    
    if (success === "true" && enrollmentId) {
      setIsProcessingPayment(true);
      const handlePaymentSuccess = async () => {
        try {
          if (paymentMethod === "stripe" && sessionId) {
            const response = await confirmPayment(sessionId);
            if (response.succeeded) {
              await getStudentCourses(coursePagination);
              const billResponse = await getBillHistory(billPagination);
              if (billResponse.succeeded) {
                setBillHistory(billResponse.data || []);
                setTotalBillPages(billResponse.totalPages);
              }
              toast({
                title: "Thanh toán thành công",
                description: "Thanh toán của bạn đã được xác nhận!",
                variant: "success",
              });
            } else {
              toast({
                title: "Xác nhận thanh toán thất bại",
                description: response.message || "Không thể xác nhận thanh toán",
                variant: "destructive",
              });
            }
          } else if (paymentMethod === "vnpay") {
            await getStudentCourses(coursePagination);
            const billResponse = await getBillHistory(billPagination);
            if (billResponse.succeeded) {
              setBillHistory(billResponse.data || []);
              setTotalBillPages(billResponse.totalPages);
            }
            toast({
              title: "Thanh toán thành công",
              description: "Thanh toán của bạn đã được xác nhận!",
              variant: "success",
            });
          }
        } catch (error) {
          toast({
            title: "Lỗi",
            description: "Đã xảy ra lỗi khi xử lý thanh toán",
            variant: "destructive",
          });
        } finally {
          removeUrlParams();
          setIsProcessingPayment(false);
        }
      };

      handlePaymentSuccess();
    } else if (success === "false") {
      toast({
        title: "Thanh toán thất bại",
        description: message || "Thanh toán đã bị hủy hoặc thất bại",
        variant: "destructive",
      });
      removeUrlParams();
    }
  }, [searchParams, coursePagination, billPagination]);

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

  const handlePayment = async (enrollmentId: number, paymentMethod: 'stripe' | 'vnpay') => {
    try {
      const paymentUrl = await initiatePayment(enrollmentId, paymentMethod);
      window.location.href = paymentUrl;
    } catch (error) {
      toast({
        title: "Lỗi",
        description: `Không thể khởi tạo thanh toán bằng ${paymentMethod === 'stripe' ? 'Stripe' : 'VNPay'}`,
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
          title: "Thành công",
          description: "Khóa học đã được hủy thành công",
          variant: "success",
        });
        getStudentCourses(coursePagination);
      } else {
        toast({
          title: "Lỗi",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi không mong muốn",
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

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Khóa học của tôi</TabsTrigger>
          <TabsTrigger value="bill-history">Lịch sử hóa đơn</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="flex flex-col space-y-4">
            <CourseFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              isRefreshing={isRefreshing}
              refreshCourses={refreshCourses}
            />
            <CourseTable
              courses={filteredCourses}
              loading={coursesLoading}
              selectedCourses={selectedCourses}
              toggleCourseSelection={toggleCourseSelection}
              toggleAllCourses={toggleAllCourses}
              handleCancelCourse={handleCancelCourse}
              handlePayment={handlePayment}
              totalPages={totalCoursePages}
              currentPage={coursePagination.pageNumber}
              onPageChange={handleCoursePageChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="bill-history">
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl font-bold">Lịch sử hóa đơn</h1>
            <BillHistoryTable
              billHistory={billHistory}
              loading={billLoading}
              totalPages={totalBillPages}
              currentPage={billPagination.pageNumber}
              onPageChange={handleBillPageChange}
            />
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
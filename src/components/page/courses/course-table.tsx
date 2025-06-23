import {
  BookOpen,
  XCircle,
  Eye,
  DollarSign,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/components/ui/cn";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { STATUS_STYLES } from "@/components/page/courses/course-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hook/use-auth";

// Component hiển thị bảng danh sách khóa học
interface CourseTableProps {
  courses: any[];
  loading: boolean;
  selectedCourses: number[];
  toggleCourseSelection: (courseId: number) => void;
  toggleAllCourses: (checked: boolean) => void;
  handleCancelCourse: (courseId: number) => void;
  handlePayment: (enrollmentId: number, paymentMethod: 'stripe' | 'vnpay') => void;
  totalPages: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

export default function CourseTable({
  courses,
  loading,
  selectedCourses,
  toggleCourseSelection,
  toggleAllCourses,
  handleCancelCourse,
  handlePayment,
  totalPages,
  currentPage,
  onPageChange,
}: CourseTableProps) {
  const { user } = useAuth();

  // Định dạng ngày
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
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
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Không tìm thấy khóa học
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {courses.length === 0
              ? "Bạn chưa đăng ký khóa học nào"
              : "Hãy điều chỉnh tìm kiếm hoặc bộ lọc"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {user?.role !== "Student" && (
                  <TableHead className="w-[50px]">
                    <Checkbox
                      onCheckedChange={(checked) =>
                        toggleAllCourses(checked as boolean)
                      }
                      checked={
                        courses.length > 0 &&
                        selectedCourses.length === courses.length
                      }
                      className="ml-2"
                    />
                  </TableHead>
                )}
                <TableHead>Khóa học</TableHead>
                <TableHead>Giảng viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Môn học</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Học phí</TableHead>
                <TableHead className="text-right max-w-[80px]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course: any) => (
                <TableRow key={course.id}>
                  {user.role !== "Student" && (
                    <TableCell>
                      <Checkbox
                        checked={selectedCourses.includes(course.id)}
                        onCheckedChange={() => toggleCourseSelection(course.id)}
                        className="ml-2"
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">
                    <div className="max-w truncate">{course.courseName}</div>
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
                      {course.status === "pending"
                        ? "Chờ thanh toán"
                        : course.status === "completed"
                        ? "Đã hoàn thành"
                        : course.status.charAt(0).toUpperCase() +
                          course.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[80px] truncate">{course.subject}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>{formatDate(course.startDate)}</div>
                      <div>{formatDate(course.endDate)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {course.fee.toLocaleString("vi-VN")} VND
                  </TableCell>
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
                              Xem chi tiết
                            </Link>
                          </DropdownMenuItem>
                          {course.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handlePayment(course.id, "stripe")
                                }
                                className="text-yellow-500"
                              >
                                <DollarSign className="h-4 w-4 mr-2" />
                                Thanh toán với Stripe
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handlePayment(course.id, "vnpay")
                                }
                                className="text-green-600"
                              >
                                <DollarSign className="h-4 w-4 mr-2" />
                                Thanh toán với VNPay
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCancelCourse(course.id)}
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Hủy đăng ký
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
      {totalPages > 1 && (
        <div className="mt-6 p-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(i + 1)}
                  className={currentPage === i + 1 ? "bg-indigo-600" : ""}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
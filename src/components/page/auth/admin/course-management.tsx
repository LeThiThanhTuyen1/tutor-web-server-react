import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Search, RefreshCw, Edit2 } from "lucide-react";
import { getAllCourses, deleteCourses } from "@/services/courseService";
import { useToast } from "@/hook/use-toast";
import Pagination from "../../layout/pagination";
import { ToastContainer } from "@/components/ui/toast";
import { Link } from "react-router-dom";

const STATUS_LABELS: Record<string, string> = {
  ongoing: "Đang diễn ra",
  completed: "Đã hoàn thành",
  canceled: "Đã hủy",
  coming: "Sắp ra mắt",
  pending: "Đang chờ",
  approved: "Đã được duyệt",
  rejected: "Đã bị từ chối",
  active: "Đã kích hoạt",
};

export function CourseTable() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Tất cả");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(1);
  const { toast, toasts, dismiss } = useToast();

  // Lấy danh sách khóa học từ API
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await getAllCourses({ pageNumber: page, pageSize });
      if (response.succeeded) {
        setCourses(response.data || []);
        setTotalPages(response.totalPages || 1);
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Lỗi khi lấy dữ liệu khóa học.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi không mong muốn xảy ra.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page]);

  // Chọn tất cả khóa học
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCourses(courses.map((course) => course.id));
    } else {
      setSelectedCourses([]);
    }
  };

  const handleSelectCourse = (courseId: number, checked: boolean) => {
    if (checked) {
      setSelectedCourses((prev) => [...prev, courseId]);
    } else {
      setSelectedCourses((prev) => prev.filter((id) => id !== courseId));
    }
  };

  const handleDeleteSingle = (courseId: number) => {
    setCourseToDelete(courseId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteMultiple = () => {
    if (selectedCourses.length === 0) return;
    setCourseToDelete(null);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const statusLabel = STATUS_LABELS[statusLower] || status;

    switch (statusLower) {
      case "canceled":
        return <Badge className="bg-red-500 hover:bg-red-600">Đã hủy</Badge>;
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            Đã hoàn thành
          </Badge>
        );
      case "ongoing":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600">
            Đang diễn ra
          </Badge>
        );
      case "coming":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">Sắp ra mắt</Badge>
        );
      default:
        return <Badge>{statusLabel}</Badge>;
    }
  };

  const confirmDelete = async () => {
    const idsToDelete = courseToDelete ? [courseToDelete] : selectedCourses;

    try {
      const response = await deleteCourses(idsToDelete);
      if (response.succeeded) {
        toast({
          title: "Thành công",
          description: `Xóa ${idsToDelete.length} khóa học thành công`,
          variant: "success",
        });
      } else {
        if (response.results) {
          const successCount = response.results.filter(
            (r: any) => r.succeeded
          ).length;
          const failedCount = response.results.length - successCount;
          const failedMessages = response.results
            .filter((r: any) => !r.succeeded)
            .map((r: any) => `Khóa học #${r.id}: ${r.message}`)
            .join(", ");

          toast({
            title: "Thành công",
            description: `Xóa ${successCount} khóa học thành công nhưng không thể xóa ${failedCount} khóa học: ${failedMessages}`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Lỗi",
            description: response.message || "Lỗi khi xóa khóa học.",
            variant: "destructive",
          });
        }
      }
      fetchCourses();
      setSelectedCourses([]);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Lỗi không mong muốn xảy ra.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      (course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tutorName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "Tất cả" ||
        course.status.toLowerCase() === statusFilter)
  );

  return (
    <div className="container mx-auto py-8 px-12">
      {/* Tiêu đề */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý khóa học</h1>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Nhập tên khóa học hoặc gia sư..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-gray-800 pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tất cả">Tất cả trạng thái</SelectItem>
              <SelectItem value="ongoing">Đang diễn ra</SelectItem>
              <SelectItem value="completed">Đã hoàn thành</SelectItem>
              <SelectItem value="canceled">Đã hủy</SelectItem>
              <SelectItem value="coming">Sắp diễn ra</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCourses}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={handleDeleteMultiple}
            disabled={selectedCourses.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </Button>
        </div>
      </div>

      {/* Bảng khóa học */}
      <div className="border rounded-md bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  className="border border-gray-800"
                  checked={
                    courses.length > 0 &&
                    selectedCourses.length === filteredCourses.length
                  }
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead>Mã ID</TableHead>
              <TableHead>Tên khóa học</TableHead>
              <TableHead>Gia sư</TableHead>
              <TableHead>Học phí</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày học</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell
                    colSpan={8}
                    className="h-12 animate-pulse bg-gray-100 dark:bg-gray-800"
                  ></TableCell>
                </TableRow>
              ))
            ) : filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <Checkbox
                      className="border border-gray-800"
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={(checked) =>
                        handleSelectCourse(course.id, !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell>{course.id}</TableCell>
                  <TableCell className="font-medium">
                    {course.courseName}
                  </TableCell>
                  <TableCell>{course.tutorName}</TableCell>
                  <TableCell>
                    {course.fee.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </TableCell>
                  <TableCell>{getStatusBadge(course.status)}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>
                        {new Date(course.startDate).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </div>
                      <div>
                        {new Date(course.endDate).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50"
                    >
                      <Link to={`/tutor/courses/${course.id}/edit`}>
                        <Edit2 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSingle(course.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Không có khóa học nào được tìm thấy.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Hiển thị thông báo toast */}
      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="bottom-0 left-0 right-0 py-4 flex justify-center">
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" }); 
            }}
          />
        </div>
      )}

      {/* Hộp thoại xác nhận xóa */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              {courseToDelete
                ? "Bạn có chắc muốn xóa khóa học này? Thao tác không thể hoàn tác."
                : `Bạn có chắc muốn xóa ${selectedCourses.length} khóa học được chọn này? Hành động này không thể hoàn tác.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

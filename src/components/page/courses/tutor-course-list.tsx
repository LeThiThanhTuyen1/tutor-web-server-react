import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hook/use-toast";
import { ToastContainer } from "@/components/ui/toast";
import { CancelCourseModal } from "@/components/ui/modals/cancel-course";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationModal } from "@/components/ui/modals/delete-confirm";
import { useCourse } from "@/hook/use-course";
import { PaginationFilter } from "@/store/authSlice";
import {
  Search,
  RefreshCw,
  XCircle,
  Edit2,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  ongoing: "Đang diễn ra",
  completed: "Đã hoàn thành",
  canceled: "Đã hủy",
  coming: "Sắp ra mắt",
};

export default function TutorCourseList() {
  const {
    tutorCourses,
    loading,
    totalPages,
    getTutorCourses,
    cancelCourse,
    deleteCourses,
  } = useCourse();

  const [filteredCourses, setFilteredCourses] = useState(tutorCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [courseToCancel, setCourseToCancel] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast, toasts, dismiss } = useToast();
  const [pagination, setPagination] = useState<PaginationFilter>({
    pageNumber: 1,
    pageSize: 9,
  });

  useEffect(() => {
    getTutorCourses(pagination);
  }, [pagination, refreshKey]);

  useEffect(() => {
    let result = tutorCourses;

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
  }, [tutorCourses, searchTerm, statusFilter]);

  const toggleCourseSelection = useCallback((courseId: number) => {
    setSelectedCourses((prev) => {
      const isSelected = prev.includes(courseId);
      return isSelected
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId];
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedCourses(
      selectedCourses.length === filteredCourses.length
        ? []
        : filteredCourses.map((course) => course.id)
    );
  }, [selectedCourses.length, filteredCourses]);

  const handleDeleteSelected = useCallback(async () => {
    if (selectedCourses.length === 0) return;

    try {
      await deleteCourses(selectedCourses);
      toast({
        title: "Thành công",
        description: `Xóa ${selectedCourses.length} khóa học thành công`,
        variant: "success",
      });
      setSelectedCourses([]);
      setRefreshKey((prev) => prev + 1);

      if (
        pagination.pageNumber > 1 &&
        tutorCourses.length <= selectedCourses.length
      ) {
        setPagination((prev) => ({ ...prev, pageNumber: 1 }));
      }
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa khóa học",
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
    }
  }, [selectedCourses, tutorCourses.length, pagination, deleteCourses]);

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({ ...prev, pageNumber: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const handleCancelCourse = useCallback((courseId: number) => {
    setCourseToCancel(courseId);
    setIsCancelDialogOpen(true);
  }, []);

  const confirmCancelCourse = useCallback(async () => {
    if (!courseToCancel) return;

    try {
      setIsCancelling(true);
      await cancelCourse(courseToCancel);
      toast({
        title: "Thành công",
        description: "Hủy khóa học thành công",
        variant: "success",
      });
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi hủy khóa học",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
      setIsCancelDialogOpen(false);
      setCourseToCancel(null);
    }
  }, [courseToCancel, cancelCourse]);

  const getStatusBadge = useCallback((status: string) => {
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
  }, []);

  return (
    <div className="container mx-auto py-8 px-12">
      {/* Tiêu đề */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý khóa học</h1>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700" size="sm">
          <Link to="/tutor/courses/new" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Thêm khóa học
          </Link>
        </Button>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Nhập tên khóa học..."
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
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="ongoing">Đang diễn ra</SelectItem>
              <SelectItem value="completed">Đã hoàn thành</SelectItem>
              <SelectItem value="canceled">Đã hủy</SelectItem>
              <SelectItem value="coming">Sắp ra mắt</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshKey((prev) => prev + 1)}
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
            onClick={() => setIsDeleteModalOpen(true)}
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
                    filteredCourses.length > 0 &&
                    selectedCourses.length === filteredCourses.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Mã ID</TableHead>
              <TableHead>Tên khóa học</TableHead>
              <TableHead>Học phí</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Lịch học</TableHead>
              <TableHead>Môn học</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell
                    colSpan={7}
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
                      onCheckedChange={() => toggleCourseSelection(course.id)}
                    />
                  </TableCell>
                  <TableCell>{course.id}</TableCell>
                  <TableCell className="font-medium">
                    {course.courseName}
                  </TableCell>
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
                  <TableCell>{course.subject}</TableCell>
                  <TableCell className="text-right">
                    {(course.status === "coming" ||
                      course.status === "ongoing") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelCourse(course.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {(course.status === "coming" ||
                      course.status === "ongoing") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50"
                      >
                        <Link to={`/tutor/courses/${course.id}/edit`}>
                          <Edit2 className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCourses([course.id]);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50"
                    >
                      <Link to={`/courses/${course.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
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
        <div className="py-4 flex justify-center">
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
      )}

      {/* Modal hủy khóa học */}
      <CancelCourseModal
        isOpen={isCancelDialogOpen}
        onCancel={() => setIsCancelDialogOpen(false)}
        onConfirm={confirmCancelCourse}
        isCancelling={isCancelling}
      />

      {/* Modal xác nhận xóa */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={handleDeleteModalClose}
        onConfirm={handleDeleteSelected}
        count={selectedCourses.length}
      />
    </div>
  );
}

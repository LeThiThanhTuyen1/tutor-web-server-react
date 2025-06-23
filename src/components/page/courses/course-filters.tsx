import { Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/components/ui/cn";

interface CourseFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  isRefreshing: boolean;
  refreshCourses: () => Promise<void>;
}

export default function CourseFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  isRefreshing,
  refreshCourses,
}: CourseFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h1 className="text-2xl font-bold">Khóa học của tôi</h1>
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
          Làm mới
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo khóa học hoặc giảng viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Đang chờ</SelectItem>
                <SelectItem value="completed">Đã hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

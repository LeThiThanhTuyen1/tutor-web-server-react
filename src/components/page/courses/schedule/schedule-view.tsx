import { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Clock,
  BookOpen,
  Calendar,
  ViewIcon as ChevronLeft,
  ChevronRight,
  LayoutList,
  CalendarDays,
  CalendarIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hook/use-toast";
import { ToastContainer } from "@/components/ui/toast";
import type React from "react";
import {
  getStudentCourseByUserId,
  getTutorCourseByUserId,
} from "@/services/courseService";
import { useAuth } from "@/hook/use-auth";
import WeeklyTableSchedule from "./weekly-table-schedule";
import { Video, Users } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DailyTableSchedule from "./daily-table-schedule";
import { DatePicker } from "@/components/ui/date-picker";
import { STATUS_STYLES } from "../course-card";

// Types
interface Schedule {
  id: number;
  tutorId: number;
  courseId: number;
  dayOfWeek: number;
  startHour: string;
  endHour: string;
  mode: string;
  location: string;
  status: string;
}

interface Course {
  id: number;
  courseName: string;
  tutorId: number;
  tutorName: string;
  description: string;
  startDate: string;
  endDate: string;
  fee: number;
  maxStudents: number;
  status: string;
  createdAt: string;
  schedule: Schedule[];
}

const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const MODE_ICONS: { [key: string]: React.ReactNode } = {
  online: (
    <Video
      className="h-3 w-3 mr-1 text-green-500 dark:text-green-400"
      aria-hidden="true"
    />
  ),
  offline: (
    <Users
      className="h-3 w-3 mr-1 text-green-500 dark:text-green-400"
      aria-hidden="true"
    />
  ),
};

// Helper function to get the start of the week for a given date
const getStartOfWeek = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  return result;
};

// Helper function to format date range
const formatDateRange = (startDate: Date, endDate: Date) => {
  return `${startDate.toLocaleDateString(
    "vi-VN"
  )} - ${endDate.toLocaleDateString("vi-VN")}`;
};

// Main component
export default function ScheduleView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast, toasts, dismiss } = useToast();
  const { user } = useAuth();
  const role = user?.role;
  const max = 1000;

  // State for date navigation
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"daily" | "weekly">("weekly");

  // Calculate week range
  const weekRange = useMemo(() => {
    const startOfWeek = getStartOfWeek(currentDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { startOfWeek, endOfWeek };
  }, [currentDate]);

  // Calculate week number
  const weekNumber = useMemo(() => {
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const millisecondsPerDay = 86400000;
    const dayOfYear = Math.floor(
      (currentDate.getTime() - startOfYear.getTime()) / millisecondsPerDay
    );
    return Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
  }, [currentDate]);

  // Navigation functions
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPrevious = () => {
    if (currentView === "daily") {
      const prevDay = new Date(currentDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setCurrentDate(prevDay);
    } else {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setCurrentDate(prevWeek);
    }
  };

  const STATUS_TRANSLATIONS: { [key: string]: string } = {
    ongoing: "Đang diễn ra",
    completed: "Đã hoàn thành",
    canceled: "Đã hủy",
    pending: "Đang chờ thanh toán",
    coming: "Sắp diễn ra",
  };

  const goToNext = () => {
    if (currentView === "daily") {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCurrentDate(nextDay);
    } else {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setCurrentDate(nextWeek);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
    }
  };

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);

      const fetchCoursesByRole =
        role === "Tutor" ? getTutorCourseByUserId : getStudentCourseByUserId;

      const response = await fetchCoursesByRole({
        pageNumber: 1,
        pageSize: max,
      });

      if (response.succeeded) {
        setCourses(response.data || []);
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Không thể tải lịch",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải khóa học:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lịch. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [role]);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Filter active courses (not canceled)
  const activeCourses = useMemo(() => {
    return courses.filter(
      (course) => course.status !== "canceled" && course.status !== "completed"
    );
  }, [courses]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "daily") {
      setCurrentView("daily");
    } else if (value === "weekly") {
      setCurrentView("weekly");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
            {role === "Tutor" ? "Lịch dạy của tôi" : "Lịch học của tôi"}
          </h1>

          <Button
            onClick={fetchCourses}
            variant="outline"
            className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
            aria-label="Làm mới lịch học"
          >
            Làm mới lịch
          </Button>
        </div>

        {/* Schedule Views */}
        <Card className="border border-indigo-100 dark:border-indigo-900 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3">
            <CardTitle className="flex items-center text-lg">
              <Clock className="h-5 w-5 mr-2" aria-hidden="true" />
              {role === "Tutor" ? "Lịch dạy của tôi" : "Lịch học của tôi"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-3 dark:bg-gray-700 bg-white">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="flex flex-col items-center">
                  <Loader2
                    className="h-8 w-8 text-indigo-600 animate-spin mb-2"
                    aria-hidden="true"
                  />
                  <p className="text-indigo-600 dark:text-indigo-400">
                    {role === "Tutor"
                      ? "Đang tải lịch dạy"
                      : "Đang tải lịch học"}
                  </p>
                </div>
              </div>
            ) : (
              <Tabs
                defaultValue="weekly"
                className="w-full"
                onValueChange={handleTabChange}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                  <TabsList className="grid grid-cols-3 w-full max-w-md">
                    <TabsTrigger
                      value="weekly"
                      className="flex items-center text-sm"
                      aria-label="Chế độ xem theo tuần"
                    >
                      <Calendar
                        className="h-3.5 w-3.5 mr-1"
                        aria-hidden="true"
                      />
                      Xem theo tuần
                    </TabsTrigger>
                    <TabsTrigger
                      value="daily"
                      className="flex items-center text-sm"
                      aria-label="Chế độ xem theo ngày"
                    >
                      <CalendarDays
                        className="h-3.5 w-3.5 mr-1"
                        aria-hidden="true"
                      />
                      Xem theo ngày
                    </TabsTrigger>
                    <TabsTrigger
                      value="list"
                      className="flex items-center text-sm"
                      aria-label="Chế độ xem danh sách"
                    >
                      <LayoutList
                        className="h-3.5 w-3.5 mr-1"
                        aria-hidden="true"
                      />
                      Xem danh sách
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevious}
                      className="h-8 px-2 text-gray-700 dark:text-gray-300"
                      aria-label={
                        currentView === "daily" ? "Ngày trước" : "Tuần trước"
                      }
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      <span className="ml-1 text-xs">
                        {currentView === "daily" ? "Ngày trước" : "Tuần trước"}
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToToday}
                      className="h-8 px-3 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                      aria-label="Hôm nay"
                    >
                      <span className="text-xs">Hôm nay</span>
                    </Button>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                          aria-label="Chọn ngày"
                        >
                          <CalendarIcon
                            className="h-3.5 w-3.5 mr-1"
                            aria-hidden="true"
                          />
                          <span className="text-xs">Chọn ngày</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <DatePicker
                          mode="single"
                          selected={currentDate}
                          onSelect={handleDateChange}
                          initialFocus
                          // locale="vi-VN"
                        />
                      </PopoverContent>
                    </Popover>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNext}
                      className="h-8 px-2 text-gray-700 dark:text-gray-300"
                      aria-label={
                        currentView === "daily" ? "Ngày sau" : "Tuần sau"
                      }
                    >
                      <span className="mr-1 text-xs">
                        {currentView === "daily" ? "Ngày sau" : "Tuần sau"}
                      </span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                <TabsContent value="weekly" className="mt-0">
                  <WeeklyTableSchedule
                    courses={activeCourses}
                    currentDate={currentDate}
                    weekNumber={weekNumber}
                    dateRange={formatDateRange(
                      weekRange.startOfWeek,
                      weekRange.endOfWeek
                    )}
                  />
                </TabsContent>

                <TabsContent value="daily" className="mt-0">
                  <DailyTableSchedule
                    courses={activeCourses}
                    currentDate={currentDate}
                  />
                </TabsContent>

                <TabsContent value="list" className="mt-0">
                  {activeCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeCourses.map((course) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 border border-indigo-100 dark:border-indigo-800 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
                        >
                          <div className="flex flex-col space-y-2">
                            <div className="flex justify-between items-start">
                              <h3 className="text-base font-semibold text-indigo-700 dark:text-indigo-300">
                                {course.courseName}
                              </h3>
                              <div className="text-xs px-2 py-0.5 rounded-lg text-indigo-800 dark:text-indigo-300">
                                <span className={`px-3 rounded-lg ${STATUS_STYLES[course.status]}`}>
                                  {STATUS_TRANSLATIONS[course.status] ||
                                    course.status}
                                </span>
                              </div>
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Gia sư: {course.tutorName}
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(course.startDate).toLocaleDateString(
                                "vi-VN"
                              )}{" "}
                              -{" "}
                              {new Date(course.endDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>

                            {course.schedule && course.schedule.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <div className="text-sm font-medium mb-1">
                                  Lịch:
                                </div>
                                <div className="grid grid-cols-1 gap-1">
                                  {course.schedule.map(
                                    (schedule: any, idx: number) => {
                                      const dayOfWeek = [
                                        "Chủ nhật",
                                        "Thứ hai",
                                        "Thứ ba",
                                        "Thứ tư",
                                        "Thứ năm",
                                        "Thứ sáu",
                                        "Thứ bảy",
                                      ][schedule.dayOfWeek];
                                      return (
                                        <div
                                          key={idx}
                                          className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 p-1 rounded"
                                        >
                                          <span className="font-medium mr-2">
                                            {dayOfWeek}
                                          </span>
                                          <Clock
                                            className="h-3 w-3 mr-1 text-indigo-500 dark:text-indigo-400"
                                            aria-hidden="true"
                                          />
                                          <span className="mr-2">
                                            {formatTime(schedule.startHour)} -{" "}
                                            {formatTime(schedule.endHour)}
                                          </span>
                                          <span className="capitalize flex items-center">
                                            {MODE_ICONS[schedule.mode]}
                                            <span className="ml-1">
                                              {schedule.mode === "online"
                                                ? "Trực tuyến"
                                                : "Trực tiếp"}
                                            </span>
                                          </span>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow">
                      <BookOpen
                        className="h-12 w-12 mx-auto text-indigo-300 dark:text-indigo-700 mb-4"
                        aria-hidden="true"
                      />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Không tìm thấy khóa học
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Hiện tại bạn chưa đăng ký khóa học nào.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
    </div>
  );
}

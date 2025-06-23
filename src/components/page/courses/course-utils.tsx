import { formatDistanceToNow, isValid, parseISO } from "date-fns";

// Format date to relative time (e.g., "2 ngày trước")
export const formatRelativeDate = (date: string) => {
  try {
    const isoDate = date.includes("T") ? date : date.replace(" ", "T");
    const parsedDate = parseISO(isoDate);

    if (!isValid(parsedDate)) throw new Error("Ngày không hợp lệ");

    return formatDistanceToNow(parsedDate, { addSuffix: true});
  } catch (error) {
    console.error("Lỗi định dạng ngày:", error);
    return "Ngày không hợp lệ";
  }
};

// Course interface
export interface Course {
  id: number;
  tutorId: number;
  tutorName: string;
  courseName: string;
  description: string;
  startDate: string;
  endDate: string;
  fee: number;
  maxStudents: number;
  status: string;
  createdAt: string;
  schedule: CourseSchedule[];
  enrolledStudents?: number;
}

// Course schedule interface
export interface CourseSchedule {
  id?: number;
  dayOfWeek: number;
  startHour: string;
  endHour: string;
  mode: string;
  location: string;
}

// Day of week mapping
export const DAYS_OF_WEEK = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

// Teaching modes
export const TEACHING_MODES = ["trực tuyến", "trực tiếp"];

// Format currency for Vietnamese Dong
export const formatCurrency = (amount: number): string => {
  try {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  } catch (error) {
    console.error("Lỗi định dạng tiền tệ:", error);
    return `${amount} VND`;
  }
};

// Translate course status
export const translateStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case "ongoing":
      return "Đang diễn ra";
    case "completed":
      return "Đã hoàn thành";
    case "canceled":
      return "Đã hủy";
    case "coming":
      return "Sắp tới";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

// Format schedule display
export const formatSchedule = (schedule: CourseSchedule): string => {
  const day = DAYS_OF_WEEK[schedule.dayOfWeek] || "Không xác định";
  const mode = TEACHING_MODES.includes(schedule.mode)
    ? schedule.mode.charAt(0).toUpperCase() + schedule.mode.slice(1)
    : schedule.mode;
  return `${day}, ${schedule.startHour} - ${schedule.endHour} (${mode}${
    schedule.location ? `, ${schedule.location}` : ""
  })`;
};
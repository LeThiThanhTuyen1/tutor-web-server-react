import { formatDistanceToNow, isValid, parseISO } from "date-fns"

// Format date to relative time (e.g., "2 days ago")
export const formatRelativeDate = (date: string) => {
    try {
      const isoDate = date.includes("T") ? date : date.replace(" ", "T");
      const parsedDate = parseISO(isoDate);
  
      if (!isValid(parsedDate)) throw new Error("Invalid date");

      return formatDistanceToNow(parsedDate, { addSuffix: true });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

// Course interface
export interface Course {
  id: number
  tutorId: number
  tutorName: string
  courseName: string
  description: string
  startDate: string
  endDate: string
  fee: number
  maxStudents: number
  status: string
  createdAt: string
  schedule: CourseSchedule[]
  enrolledStudents?: number
}

// Course schedule interface
export interface CourseSchedule {
  id?: number
  dayOfWeek: number
  startHour: string
  endHour: string
  mode: string
  location: string
}

// Day of week mapping
export const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


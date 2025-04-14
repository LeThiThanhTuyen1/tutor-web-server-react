import api from "@/config/axiosInstance";

export interface AdminStats {
  totalTutors: number;
  totalStudents: number;
  totalCourses: number;
  totalSchedules: number;
  pendingEnrollments: number;
  tutorsChange: number;
  studentsChange: number;
  coursesChange: number;
}

export interface CourseStatus {
  status: string;
  count: number;
}

export interface MonthlyActivity {
  month: string;
  newTutors: number;
  newStudents: number;
  newCourses: number;
}

export interface RecentEnrollment {
  id: number;
  studentName: string;
  courseName: string;
  status: string;
  enrolledAt: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  courseStatuses: CourseStatus[];
  monthlyActivities: MonthlyActivity[];
  recentEnrollments: RecentEnrollment[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  profileImage: string;
  location: string;
  school: string;
}

export interface PagedResponse<T> {
  data: T | null;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  nextPage: string | null;
  previousPage: string | null;
  succeeded: false,
  message: string,
  firstPage: null,
  lastPage: null,
}

export interface Response<T> {
  data: T | null;
  succeeded: boolean;
  message: string;
  errors?: string[];
}

export const getAdminDashboard = async (): Promise<Response<AdminDashboardData>> => {
  try {
    const response = await api.get("/Admin/dashboard");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching admin dashboard:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to fetch dashboard data";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};

export const getPagedUsers = async (
  page: number = 1,
  pageSize: number = 10
): Promise<Response<PagedResponse<User[]>>> => {
  try {
    const response = await api.get("/Admin/users", {
      params: { page, pageSize },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching paged users:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to fetch users";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};

export const deleteUsers = async (
  userIds: number[]
): Promise<Response<string>> => {
  try {
    const response = await api.delete("/Admin/users", {
      data: userIds,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error deleting users:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to delete users";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};
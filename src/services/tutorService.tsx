import api from "@/config/axiosInstance";

export interface TutorStats {
  courses: number;
  students: number;
  hours: number;
  rating: number;
  coursesChange: number;
  studentsChange: number;
  hoursChange: number;
}

export interface BarData {
  name: string;
  students: number;
  hours: number;
}

export interface UpcomingClass {
  id: number;
  courseName: string;
  time: string;
  students: number;
  mode: string;
}

export interface StudentProgress {
  [x: string]: string;
  id: string;
  student: string;
  course: string;
  progress: string;
  lastUpdated: string;
}

export interface TutorDashboardData {
  stats: TutorStats;
  barData: BarData[];
  upcomingClasses: UpcomingClass[];
  recentContracts: StudentProgress[];
}

// **Search Tutors**
export const searchTutors = async (searchCriteria: any, pagination: any) => {
  try {
    const response = await api.get("/Tutors/search", {
      params: { ...searchCriteria, ...pagination },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error searching tutors:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};

// **Get Tutor Dashboard**
export const getTutorDashboard = async (): Promise<{
  data: TutorDashboardData | null;
  succeeded: boolean;
  message: string;
  errors?: string[];
}> => {
  try {
    const response = await api.get("/Tutor/dashboard");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching tutor dashboard:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to fetch dashboard data";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};

// **Get All Tutors**
export const getAllTutors = async (pagination: any) => {
  try {
    const response = await api.get("/Tutors", {
      params: pagination,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching tutors:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};

// **Get Tutor by ID**
export const getTutorById = async (id: number) => {
  try {
    const response = await api.get(`/Tutor/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching tutor:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};

// **Delete Multiple Tutors**
export const deleteTutors = async (tutorIds: number[]) => {
  try {
    const response = await api.delete("/Tutors/delete", {
      data: tutorIds,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error deleting tutors:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};

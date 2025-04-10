import api from "@/config/axiosInstance";

// Định nghĩa các interface cho DTO
export interface StudentStats {
  courses: number;
  completedCourses: number;
  hoursLearned: number;
  averageScore: number;
}

export interface SubjectPie {
  name: string;
  value: number;
  color: string;
}

export interface StudentCourse {
  id: number;
  name: string;
  tutor: string;
  progress: number;
  nextLesson: string;
}

export interface Tutor {
  id: number;
  tutorName: string;
  subjects: string;
  profileImage: string;
  rating: number;
}

export interface StudentDTO {
  id: number;
  fullName: string;
  email: string;
  profileImage: string;
  role: string;
  location: string;
  school: string;
}

export interface ListResponse<T> {
  succeeded: boolean;
  message?: string;
  data?: T;
}

export const getStudentStats = async () => {
  try {
    const response = await api.get("/student/stats");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching student stats:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};

export const getStudentSubjects = async () => {
  try {
    const response = await api.get("/student/subjects");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching student subjects:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};

export const getStudentCourses = async () => {
  try {
    const response = await api.get("/student/courses");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching student courses:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};

export const getStudentTutors = async () => {
  try {
    const response = await api.get("/student/tutors");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching student tutors:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};
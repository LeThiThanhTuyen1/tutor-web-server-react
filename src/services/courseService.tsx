import api from "@/config/axiosInstance";
import { PaginationFilter } from "@/types/paginated-response";

interface Course {
  id: number;
  courseName: string;
  tutorName: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  fee: number;
  maxStudents: number;
  createdAt: string;
}

interface CourseResponse {
  data: Course[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  succeeded: boolean;
  message?: string;
}

export const getAllCourses = async (
  filter: PaginationFilter,
  searchTerm?: string,
  status?: string
): Promise<CourseResponse> => {
  try {
    const response = await api.get("/Courses", {
      params: {
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
        ...(searchTerm && { searchTerm }),
        ...(status && { status }),
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    return {
      data: [],
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
      totalPages: 0,
      totalRecords: 0,
      succeeded: false,
      message: error.response?.data?.message || "Failed to fetch courses",
    };
  }
};

export const getCourseById = async (id: number) => {
  try {
    const response = await api.get(`/Course/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
    return {
      data: null,
      succeeded: false,
      message: `Failed to fetch course with ID ${id}`,
    };
  }
};

export const getTutorCourseByUserId = async (filter: PaginationFilter) => {
  try {
    const response = await api.get("/Courses/tutor", {
      params: {
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      data: [],
      pageNumber: 1,
      pageSize: filter.pageSize,
      totalPages: 0,
      totalRecords: 0,
      succeeded: false,
      message: "Failed to fetch courses",
    };
  }
};

export const getStudentCourseByUserId = async (filter: PaginationFilter) => {
  try {
    const response = await api.get("/Courses/student", {
      params: {
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      data: [],
      pageNumber: 1,
      pageSize: filter.pageSize,
      totalPages: 0,
      totalRecords: 0,
      succeeded: false,
      message: "Failed to fetch courses",
    };
  }
};

export const createCourse = async (
  course: Omit<any, "id" | "createdAt" | "tutorName">
) => {
  try {
    const response = await api.post("/Course", course);
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    if (error instanceof Error && "response" in error) {
      return (error as any).response.data;
    }

    return {
      data: null,
      succeeded: false,
      message: "Failed to create course.",
      errors: ["An unexpected error occurred."],
    };
  }
};

export const updateCourse = async (
  id: number,
  course: Omit<any, "id" | "createdAt" | "tutorName">
) => {
  try {
    const response = await api.put(`/Course/${id}`, course);
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    if (error instanceof Error && "response" in error) {
      return (error as any).response.data;
    }

    return {
      data: null,
      succeeded: false,
      message: "Failed to edit course.",
      errors: ["An unexpected error occurred."],
    };
  }
};

export const cancelCourse = async (id: number) => {
  try {
    const response = await api.post(`/Course/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error(`Error canceling course with ID ${id}:`, error);
    return {
      succeeded: false,
      message: `Failed to cancel course with ID ${id}`,
    };
  }
};

export const getStudentsByCourseId = async (id: number) => {
  try {
    const response = await api.get(`/Course/${id}/students`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching students for course ID ${id}:`, error);
    return {
      data: [],
      succeeded: false,
      message: `Failed to fetch students for course ID ${id}`,
    };
  }
};

export const deleteCourses = async (courseIds: number[]) => {
  try {
    const response = await api.delete("/Courses", { data: courseIds });
    return response.data;
  } catch (error) {
    console.error("Error deleting courses:", error);
    return {
      succeeded: false,
      message: "Failed to delete courses",
    };
  }
};

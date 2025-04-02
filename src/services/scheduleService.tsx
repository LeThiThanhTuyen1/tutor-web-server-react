import api from "@/config/axiosInstance";
import { PaginationFilter } from "@/types/paginated-response";


export const getAllSchedules = async (filter: PaginationFilter) => {
  try {
    const response = await api.get("/Schedules", {
      params: {
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return {
      data: [],
      pageNumber: 1,
      pageSize: filter.pageSize,
      totalPages: 0,
      totalRecords: 0,
      succeeded: false,
      message: "Failed to fetch schedules",
    };
  }
};

export const getScheduleById = async (id: number) => {
  try {
    const response = await api.get(`/Schedule/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching schedule with ID ${id}:`, error);
    return {
      data: null,
      succeeded: false,
      message: `Failed to fetch schedule with ID ${id}`,
    };
  }
};

export const getSchedulesByTutorId = async (filter: PaginationFilter) => {
  try {
    const response = await api.get("/Schedules/tutor", {
      params: {
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules for tutor:", error);
    return {
      data: [],
      pageNumber: 1,
      pageSize: filter.pageSize,
      totalPages: 0,
      totalRecords: 0,
      succeeded: false,
      message: "Failed to fetch schedules for tutor",
    };
  }
};

export const getSchedulesByStudentId = async (filter: PaginationFilter) => {
  try {
    const response = await api.get("/Schedules/student", {
      params: {
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules for student:", error);
    return {
      data: [],
      pageNumber: 1,
      pageSize: filter.pageSize,
      totalPages: 0,
      totalRecords: 0,
      succeeded: false,
      message: "Failed to fetch schedules for student",
    };
  }
};

export const createSchedule = async (
  schedule: Omit<any, "id" | "createdAt">
) => {
  try {
    const response = await api.post("/Schedule", schedule);
    return response.data;
  } catch (error) {
    console.error("Error creating schedule:", error);
    return {
      data: null,
      succeeded: false,
      message: "Failed to create schedule",
    };
  }
};

export const updateSchedule = async (
  id: number,
  schedule: Omit<any, "id" | "createdAt">
) => {
  try {
    const response = await api.put(`/Schedule/${id}`, schedule);
    return response.data;
  } catch (error) {
    console.error(`Error updating schedule with ID ${id}:`, error);
    return {
      succeeded: false,
      message: `Failed to update schedule with ID ${id}`,
    };
  }
};

export const cancelSchedule = async (id: number) => {
  try {
    const response = await api.post(`/Schedule/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error(`Error canceling schedule with ID ${id}:`, error);
    return {
      succeeded: false,
      message: `Failed to cancel schedule with ID ${id}`,
    };
  }
};

export const getStudentsByScheduleId = async (id: number) => {
  try {
    const response = await api.get(`/Schedule/${id}/students`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching students for schedule ID ${id}:`, error);
    return {
      data: [],
      succeeded: false,
      message: `Failed to fetch students for schedule ID ${id}`,
    };
  }
};

export const deleteSchedules = async (scheduleIds: number[]) => {
  try {
    const response = await api.delete("/Schedules", { data: scheduleIds });
    return response.data;
  } catch (error) {
    console.error("Error deleting schedules:", error);
    return {
      succeeded: false,
      message: "Failed to delete schedules",
    };
  }
};

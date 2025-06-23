// services/enrollmentService.ts
import api from "@/config/axiosInstance";
import { PagedResponse, Response } from "./adminService";
import { PaginationFilter } from "@/store/authSlice";

export interface BillHistoryModel {
  paymentId: number;
  courseName: string;
  amount: number;
  userId: number;
  createdAt: string;
  status: string;
  transactionId: string;
  paymentMethod?: string;
  vnPayResponseCode?: string;
}

export const enrollCourse = async (courseId: number) => {
  try {
    const response = await api.post("/Enrollment/register", { courseId });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return {
        succeeded: false,
        message: error.response.data.message,
        errors: error.response.data.errors || ["Unknown Error"],
      };
    }

    console.error("Error registering course:", error);
    return {
      succeeded: false,
      message: "Failed to register for course",
      errors: ["Network Error or Unhandled Error"],
    };
  }
};

export const unenrollStudent = async (
  courseId: number
): Promise<Response<string>> => {
  try {
    const response = await api.delete("/Enrollment/unenroll", {
      data: { courseId },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error unenrolling student:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to unenroll student";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};

export const getBillHistory = async (filter: PaginationFilter): Promise<PagedResponse<BillHistoryModel[]>> => {
  try {
    const response = await api.get<PagedResponse<BillHistoryModel[]>>("/Payment/billhistory", {
      params: {
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching bill history:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to fetch bill history";
    return {
      data: [],
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
      totalPages: 0,
      totalRecords: 0,
      succeeded: false,
      message: errorMessage,
      firstPage: null,
      lastPage: null,
      nextPage: null,
      previousPage: null,
    };
  }
};

export const initiatePayment = async (enrollmentId: number, paymentMethod: 'stripe' | 'vnpay') => {
  try {
    const response = await api.post(`/Payment/enroll-and-pay`, { enrollmentId, paymentMethod });
    return response.data.paymentUrl;
  } catch (error: any) {
    console.error(`Error initiating payment for enrollment ${enrollmentId} with method ${paymentMethod}:`, error);
    throw error;
  }
};

export const confirmPayment = async (sessionId: string): Promise<Response<string>> => {
  try {
    const response = await api.post<Response<string>>("/Payment/confirm-payment", { sessionId });
    return response.data;
  } catch (error: any) {
    console.error(`Error confirming payment for session ${sessionId}:`, error);
    const errorMessage =
      error.response?.data?.message || "Failed to confirm payment";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};
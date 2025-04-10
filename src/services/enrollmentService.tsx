import api from "@/config/axiosInstance";
import { Response } from "./adminService";

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

export const initiatePayment = async (enrollmentId: number) => {
  try {
    const response = await api.post(
      `/Payment/enroll-and-pay?enrollmentId=${enrollmentId}`
    );
    return response.data.paymentUrl;
  } catch (error) {
    console.error(`Error initiating payment for enrollment ${enrollmentId}:`, error);
    throw error;
  }
};
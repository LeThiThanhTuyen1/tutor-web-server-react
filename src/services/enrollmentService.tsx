import api from "@/config/axiosInstance";

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

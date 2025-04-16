import api from "@/config/axiosInstance";

// Create a new notification
export const createNotification = async (
  userId: number,
  message: string,
  type = "info"
) => {
  try {
    const response = await api.post("/Notification/create", {
      userId,
      message,
      type,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating notification:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};

export const getAllNotifications = async () => {
  try {
    const response = await api.get(`/Notifications`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return {
      data: [],
      succeeded: false,
      message: errorMessage,
    };
  }
};

export const getUnreadNotifications = async () => {
  try {
    const response = await api.get(`/Notifications/unread`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching unread notifications:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return {
      data: [],
      succeeded: false,
      message: errorMessage,
    };
  }
};

export const getReadNotifications = async () => {
  try {
    const response = await api.get(`/Notifications/read`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching read notifications:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return {
      data: [],
      succeeded: false,
      message: errorMessage,
    };
  }
};

export const markAsRead = async (id: number) => {
  try {
    const response = await api.post(`/Notification/mark-as-read/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return {
      data: null,
      succeeded: false,
      message: errorMessage,
    };
  }
};

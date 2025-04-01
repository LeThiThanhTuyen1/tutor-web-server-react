import api from "@/config/axiosInstance";

// **Get Tutor Feedbacks by Tutor ID**
export const getTutorFeedbacks = async (tutorId: number) => {
  try {
    const response = await api.get(`/Feedbacks/tutors/${tutorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};

// **Get Feedback By User (Student -> Tutor)**
export const getFeedbackByUser = async (tutorId: number) => {
  try {
    const response = await api.get(`/Feedback/tutor/${tutorId}/user`);
    return response.data;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};

// **Add Feedback**
export const addFeedback = async (
  tutorId: number,
  rating: number,
  comment: string
) => {
  try {
    const response = await api.post("/Student/feedback", {
      tutorId,
      rating,
      comment,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error adding feedback:", error);
    throw error?.response?.data || error;
  }
};

// **Update Feedback**
export const updateFeedback = async (
  feedbackId: number,
  rating: number,
  comment: string
) => {
  try {
    const response = await api.put(`/Student/feedback/${feedbackId}`, {
      rating,
      comment,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error updating feedback:", error);
    throw error?.response?.data || error;
  }
};

// **Delete Feedback**
export const deleteFeedback = async (feedbackId: number) => {
  try {
    const response = await api.delete(`/Student/feedback/${feedbackId}`);
    console.log("Feedback deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw error;
  }
};

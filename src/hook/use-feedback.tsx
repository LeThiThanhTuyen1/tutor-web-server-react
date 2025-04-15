import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  fetchTutorFeedbacks,
  fetchUserFeedback,
  submitFeedback,
  editFeedback,
  removeFeedback,
  resetFeedbackError,
  clearFeedbackState,
} from "@/store/feedbackSlice";

export const useFeedback = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    feedbacks,
    userFeedback,
    loading,
    error,
    totalRatings,
    averageRating,
    ratingDistribution,
  } = useSelector((state: RootState) => state.feedback);

  return {
    // State
    feedbacks,
    userFeedback,
    loading,
    error,
    totalRatings,
    averageRating,
    ratingDistribution,

    // Actions
    getTutorFeedbacks: (tutorId: number) =>
      dispatch(fetchTutorFeedbacks(tutorId)),

    getUserFeedback: (tutorId: number) => dispatch(fetchUserFeedback(tutorId)),

    addFeedback: (tutorId: number, rating: number, comment: string) =>
      dispatch(submitFeedback({ tutorId, rating, comment })),

    updateFeedback: (id: number, rating: number, comment: string) =>
      dispatch(editFeedback({ id, rating, comment })),

    deleteFeedback: (id: number) => dispatch(removeFeedback(id)),

    resetError: () => dispatch(resetFeedbackError()),

    clearFeedback: () => dispatch(clearFeedbackState()),
  };
};

"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import { getTutorFeedbacks } from "@/services/feedbackService";

interface RatingContextType {
  refreshRating: (tutorId: number) => Promise<void>;
  tutorRatings: Record<number, number>;
  tutorFeedbackCounts: Record<number, number>;
  isRefreshing: boolean;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export const RatingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tutorRatings, setTutorRatings] = useState<Record<number, number>>({});
  const [tutorFeedbackCounts, setTutorFeedbackCounts] = useState<
    Record<number, number>
  >({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshingTutors, setRefreshingTutors] = useState<Set<number>>(
    new Set()
  );

  const refreshRating = useCallback(
    async (tutorId: number) => {
      if (refreshingTutors.has(tutorId)) {
        return;
      }

      setRefreshingTutors((prev) => new Set(prev).add(tutorId));
      setIsRefreshing(true);

      try {
        // Fetch tutor data and feedback data
        const [feedbackResponse] = await Promise.all([
          // getTutorById(tutorId),
          getTutorFeedbacks(tutorId),
        ]);
        // Ensure feedbacks is an array
        const feedbacks = Array.isArray(feedbackResponse.data)
          ? feedbackResponse.data
          : [];

        // Calculate average rating
        const totalRating = feedbacks.reduce(
          (sum: number, feedback: any) => sum + (feedback.rating || 0),
          0
        );
        const averageRating =
          feedbacks.length > 0 ? totalRating / feedbacks.length : 0;

        // Update state
        setTutorRatings((prev) => ({ ...prev, [tutorId]: averageRating }));
        setTutorFeedbackCounts((prev) => ({
          ...prev,
          [tutorId]: feedbacks.length,
        }));
      } catch (error) {
        console.error("Error refreshing rating data:", error);
      } finally {
        setRefreshingTutors((prev) => {
          const newSet = new Set(prev);
          newSet.delete(tutorId);
          return newSet;
        });

        if (refreshingTutors.size <= 1) {
          setIsRefreshing(false);
        }
      }
    },
    [refreshingTutors]
  );

  return (
    <RatingContext.Provider
      value={{
        refreshRating,
        tutorRatings,
        tutorFeedbackCounts,
        isRefreshing,
      }}
    >
      {children}
    </RatingContext.Provider>
  );
};

export const useRating = () => {
  const context = useContext(RatingContext);
  if (context === undefined) {
    throw new Error("useRating must be used within a RatingProvider");
  }
  return context;
};

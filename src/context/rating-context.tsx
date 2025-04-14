"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import { getTutorById } from "@/services/tutorService";
import { getTutorFeedbacks } from "@/services/feedbackService";
import { Console } from "console";

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
      // Skip if already refreshing this tutor
      if (refreshingTutors.has(tutorId)) {
        return;
      }

      setRefreshingTutors((prev) => {
        const newSet = new Set(prev);
        newSet.add(tutorId);
        return newSet;
      });

      setIsRefreshing(true);
      try {
        // Fetch updated tutor data and feedback
        const [tutorResponse, feedbackResponse] = await Promise.all([
          getTutorById(tutorId),
          getTutorFeedbacks(tutorId),
        ]);

        const tutor = tutorResponse.data;
        const feedbacks = feedbackResponse.data || [];
        // Calculate average rating
        console.log(feedbacks)
        const totalRating = feedbacks.reduce(
          (sum: number, feedback: any) => sum + feedback.rating,
          0
        );
        const averageRating =
          feedbacks.length > 0 ? totalRating / feedbacks.length : 0;
console.log(totalRating, averageRating)
        // Update state
        setTutorRatings((prev) => ({ ...prev, [tutorId]: averageRating }));
        setTutorFeedbackCounts((prev) => ({
          ...prev,
          [tutorId]: feedbacks.length,
        }));
        console.log(tutorRatings)
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

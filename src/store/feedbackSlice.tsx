// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import {
//   getTutorFeedbacks,
//   getFeedbackByUser,
//   addFeedback as addFeedbackService,
//   updateFeedback as updateFeedbackService,
//   deleteFeedback as deleteFeedbackService,
// } from "@/services/feedbackService"

// // Define types
// export interface Feedback {
//   id: number
//   tutorId: number
//   studentId: number
//   studentName: string
//   studentImg?: string
//   rating: number
//   comment: string
//   reply?: string
//   helpfulCount?: number
//   createdAt: string
//   updatedAt?: string
// }

// interface FeedbackState {
//   feedbacks: Feedback[]
//   userFeedback: Feedback | null
//   loading: boolean
//   error: string | null
//   totalRatings: number
//   averageRating: number
//   ratingDistribution: Record<number, number>
// }

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getTutorFeedbacks,
  getFeedbackByUser,
  addFeedback as addFeedbackService,
  updateFeedback as updateFeedbackService,
  deleteFeedback as deleteFeedbackService,
} from "@/services/feedbackService"

// Define types
export interface Feedback {
  id: number
  tutorId: number
  studentId: number
  studentName: string
  studentImg?: string
  rating: number
  comment: string
  reply?: string
  helpfulCount?: number
  createdAt: string
  updatedAt?: string
}

interface FeedbackState {
  feedbacks: Feedback[]
  userFeedback: Feedback | null
  loading: boolean
  error: string | null
  totalRatings: number
  averageRating: number
  ratingDistribution: Record<number, number>
}

const initialState: FeedbackState = {
  feedbacks: [],
  userFeedback: null,
  loading: false,
  error: null,
  totalRatings: 0,
  averageRating: 0,
  ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
}

// Calculate rating statistics
const calculateRatingStats = (feedbacks: Feedback[]) => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  feedbacks.forEach((feedback) => {
    const rating = Math.round(feedback.rating)
    if (rating >= 1 && rating <= 5) {
      distribution[rating as keyof typeof distribution]++
    }
  })

  const total = feedbacks.length
  const average = total > 0 ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / total : 0

  return {
    ratingDistribution: distribution,
    totalRatings: total,
    averageRating: average,
  }
}

// Async thunks
export const fetchTutorFeedbacks = createAsyncThunk(
  "feedback/fetchTutorFeedbacks",
  async (tutorId: number, { rejectWithValue }) => {
    try {
      const response = await getTutorFeedbacks(tutorId)
      return response.data || []
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch feedback")
    }
  },
)

export const fetchUserFeedback = createAsyncThunk(
  "feedback/fetchUserFeedback",
  async (tutorId: number, { rejectWithValue }) => {
    try {
      const response = await getFeedbackByUser(tutorId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user feedback")
    }
  },
)

export const submitFeedback = createAsyncThunk(
  "feedback/submitFeedback",
  async ({ tutorId, rating, comment }: { tutorId: number; rating: number; comment: string }, { rejectWithValue }) => {
    try {
      const response = await addFeedbackService(tutorId, rating, comment)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to submit feedback")
    }
  },
)

export const editFeedback = createAsyncThunk(
  "feedback/editFeedback",
  async ({ id, rating, comment }: { id: number; rating: number; comment: string }, { rejectWithValue }) => {
    try {
      await updateFeedbackService(id, rating, comment)
      return { id, rating, comment, updatedAt: new Date().toISOString() }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update feedback")
    }
  },
)

export const removeFeedback = createAsyncThunk("feedback/removeFeedback", async (id: number, { rejectWithValue }) => {
  try {
    await deleteFeedbackService(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete feedback")
  }
})

// Create the slice
const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    resetFeedbackError: (state) => {
      state.error = null
    },
    clearFeedbackState: (state) => {
      state.feedbacks = []
      state.userFeedback = null
      state.error = null
      state.totalRatings = 0
      state.averageRating = 0
      state.ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    },
  },
  extraReducers: (builder) => {
    // Fetch tutor feedbacks
    builder
      .addCase(fetchTutorFeedbacks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTutorFeedbacks.fulfilled, (state, action) => {
        state.loading = false

        // Filter out user's feedback if it exists
        const allFeedbacks = action.payload
        const otherFeedbacks = state.userFeedback
          ? allFeedbacks.filter((feedback: Feedback) => feedback.id !== state.userFeedback?.id)
          : allFeedbacks

        state.feedbacks = otherFeedbacks

        // Calculate statistics including user feedback if it exists
        const statsData = state.userFeedback ? [state.userFeedback, ...otherFeedbacks] : otherFeedbacks

        const stats = calculateRatingStats(statsData)
        state.ratingDistribution = stats.ratingDistribution
        state.totalRatings = stats.totalRatings
        state.averageRating = stats.averageRating
      })
      .addCase(fetchTutorFeedbacks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch user feedback
    builder
      .addCase(fetchUserFeedback.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserFeedback.fulfilled, (state, action) => {
        state.loading = false
        state.userFeedback = action.payload

        // Recalculate statistics
        if (state.feedbacks.length > 0 || state.userFeedback) {
          const statsData = state.userFeedback ? [state.userFeedback, ...state.feedbacks] : state.feedbacks

          const stats = calculateRatingStats(statsData)
          state.ratingDistribution = stats.ratingDistribution
          state.totalRatings = stats.totalRatings
          state.averageRating = stats.averageRating
        }
      })
      .addCase(fetchUserFeedback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Submit feedback
    builder
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false
        state.userFeedback = action.payload

        // Recalculate statistics
        const statsData = [action.payload, ...state.feedbacks]
        const stats = calculateRatingStats(statsData)
        state.ratingDistribution = stats.ratingDistribution
        state.totalRatings = stats.totalRatings
        state.averageRating = stats.averageRating
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Edit feedback
    builder
      .addCase(editFeedback.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(editFeedback.fulfilled, (state, action) => {
        state.loading = false

        if (state.userFeedback) {
          state.userFeedback = {
            ...state.userFeedback,
            rating: action.payload.rating,
            comment: action.payload.comment,
            updatedAt: action.payload.updatedAt,
          }

          // Recalculate statistics
          const statsData = [state.userFeedback, ...state.feedbacks]
          const stats = calculateRatingStats(statsData)
          state.ratingDistribution = stats.ratingDistribution
          state.totalRatings = stats.totalRatings
          state.averageRating = stats.averageRating
        }
      })
      .addCase(editFeedback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Remove feedback
    builder
      .addCase(removeFeedback.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeFeedback.fulfilled, (state) => {
        state.loading = false
        state.userFeedback = null

        // Recalculate statistics
        const stats = calculateRatingStats(state.feedbacks)
        state.ratingDistribution = stats.ratingDistribution
        state.totalRatings = stats.totalRatings
        state.averageRating = stats.averageRating
      })
      .addCase(removeFeedback.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { resetFeedbackError, clearFeedbackState } = feedbackSlice.actions
export default feedbackSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllCourses,
  getCourseById,
  getTutorCourseByUserId,
  getStudentCourseByUserId,
  createCourse,
  updateCourse,
  cancelCourse,
  deleteCourses,
} from "@/services/courseService";
import { PaginationFilter } from "@/types/paginated-response";

// Define types
export interface Course {
  id: number;
  courseName: string;
  description: string;
  tutorId: number;
  tutorName: string;
  startDate: string;
  endDate: string;
  fee: number;
  maxStudents: number;
  status: string;
  createdAt: string;
  enrolledStudents?: number;
  schedule: Array<{
    id: number;
    courseId: number;
    tutorId: number;
    dayOfWeek: number;
    startHour: string;
    endHour: string;
    mode: string;
    location: string;
    status: string;
  }>;
}

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  tutorCourses: Course[];
  studentCourses: Course[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalItems: number;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  tutorCourses: [],
  studentCourses: [],
  loading: false,
  error: null,
  totalPages: 1,
  totalItems: 0,
};

// Async thunks
export const fetchAllCourses = createAsyncThunk(
  "courses/fetchAll",
  async (pagination: PaginationFilter, { rejectWithValue }) => {
    try {
      const response = await getAllCourses(pagination);
      if (!response.succeeded) {
        return rejectWithValue(response.message || "Failed to fetch courses");
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getCourseById(id);
      if (!response) {
        return rejectWithValue("Failed to fetch course");
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

export const fetchTutorCourses = createAsyncThunk(
  "courses/fetchTutorCourses",
  async (pagination: PaginationFilter, { rejectWithValue }) => {
    try {
      const response = await getTutorCourseByUserId(pagination);
      if (!response.succeeded) {
        return rejectWithValue(response.message || "Failed to fetch tutor courses");
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

export const fetchStudentCourses = createAsyncThunk(
  "courses/fetchStudentCourses",
  async (pagination: PaginationFilter, { rejectWithValue }) => {
    try {
      const response = await getStudentCourseByUserId(pagination);
      if (!response.succeeded) {
        return rejectWithValue(response.message || "Failed to fetch student courses");
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

export const createNewCourse = createAsyncThunk(
  "courses/createCourse",
  async (courseData: any, { rejectWithValue }) => {
    try {
      const response = await createCourse(courseData);
      if (!response.succeeded) {
        return rejectWithValue(response.message || "Failed to create course");
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

export const updateExistingCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, courseData }: { id: number; courseData: any }, { rejectWithValue }) => {
    try {
      const response = await updateCourse(id, courseData);
      if (!response.succeeded) {
        return rejectWithValue(response.message || "Failed to update course");
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

export const cancelExistingCourse = createAsyncThunk(
  "courses/cancelCourse",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await cancelCourse(id);
      if (!response.succeeded) {
        return rejectWithValue(response.message || "Failed to cancel course");
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

export const deleteSelectedCourses = createAsyncThunk(
  "courses/deleteCourses",
  async (ids: number[], { rejectWithValue }) => {
    try {
      const response = await deleteCourses(ids);
      if (!response.succeeded) {
        return rejectWithValue(response.message || "Failed to delete courses");
      }
      return ids;
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

// Create the slice
const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    resetCourseError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all courses
    builder
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data || [];
        state.totalPages = action.payload.totalPages || 1;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch course by ID
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch tutor courses
    builder
      .addCase(fetchTutorCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTutorCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.tutorCourses = action.payload.data || [];
        state.totalPages = action.payload.totalPages || 1;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(fetchTutorCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch student courses
    builder
      .addCase(fetchStudentCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.studentCourses = action.payload.data || [];
        state.totalPages = action.payload.totalPages || 1;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(fetchStudentCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create course
    builder
      .addCase(createNewCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
        // Optionally add to appropriate list based on context
      })
      .addCase(createNewCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update course
    builder
      .addCase(updateExistingCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
        
        // Update in tutor courses if present
        const tutorIndex = state.tutorCourses.findIndex(course => course.id === action.payload.id);
        if (tutorIndex !== -1) {
          state.tutorCourses[tutorIndex] = action.payload;
        }
        
        // Update in all courses if present
        const allIndex = state.courses.findIndex(course => course.id === action.payload.id);
        if (allIndex !== -1) {
          state.courses[allIndex] = action.payload;
        }
      })
      .addCase(updateExistingCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Cancel course
    builder
      .addCase(cancelExistingCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelExistingCourse.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update status in tutor courses
        const tutorIndex = state.tutorCourses.findIndex(course => course.id === action.payload);
        if (tutorIndex !== -1) {
          state.tutorCourses[tutorIndex].status = "canceled";
        }
        
        // Update status in all courses
        const allIndex = state.courses.findIndex(course => course.id === action.payload);
        if (allIndex !== -1) {
          state.courses[allIndex].status = "canceled";
        }
        
        // Update current course if it's the one being canceled
        if (state.currentCourse && state.currentCourse.id === action.payload) {
          state.currentCourse.status = "canceled";
        }
      })
      .addCase(cancelExistingCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete courses
    builder
      .addCase(deleteSelectedCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSelectedCourses.fulfilled, (state, action) => {
        state.loading = false;
        const deletedIds = action.payload as number[];
        
        // Remove from tutor courses
        state.tutorCourses = state.tutorCourses.filter(course => !deletedIds.includes(course.id));
        
        // Remove from all courses
        state.courses = state.courses.filter(course => !deletedIds.includes(course.id));
        
        // Clear current course if it was deleted
        if (state.currentCourse && deletedIds.includes(state.currentCourse.id)) {
          state.currentCourse = null;
        }
      })
      .addCase(deleteSelectedCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentCourse, resetCourseError } = courseSlice.actions;
export default courseSlice.reducer;

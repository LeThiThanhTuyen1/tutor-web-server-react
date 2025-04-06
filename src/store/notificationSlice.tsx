import {
  getAllNotifications,
  markAsRead,
} from "@/services/notificationService";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { console } from "inspector";

export interface Notification {
  id: number;
  message: string;
  sentAt: string;
  isRead: boolean;
  type?: string;
  userId?: number;
  createdAt?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetched: null,
};

// Calculate unread count
const calculateUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter((notification) => !notification.isRead).length;
};

// Async thunks
export const fetchAllNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllNotifications();
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await markAsRead(id); // API call
      const { data, succeeded, message } = response;

      if (!succeeded || !data?.success) {
        return rejectWithValue(message || "Failed to mark as read");
      }

      return data.notificationId; // return correct ID from server
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

// Create the slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotificationError: (state) => {
      state.error = null;
    },
    // Add a new notification directly (for real-time updates)
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Check if notification already exists to avoid duplicates
      const exists = state.notifications.some(
        (n) => n.id === action.payload.id
      );
      if (!exists) {
        state.notifications.unshift(action.payload);
        // Update unread count if the notification is unread
        if (!action.payload.isRead) {
          state.unreadCount += 1;
        }
      }
    },
    // Update unread count manually if needed
    updateUnreadCount: (state) => {
      state.unreadCount = calculateUnreadCount(state.notifications);
    },
  },
  extraReducers: (builder) => {
    // Fetch all notifications
    builder
      .addCase(fetchAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = calculateUnreadCount(action.payload);
        state.lastFetched = Date.now();
      })
      .addCase(fetchAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Mark notification as read
    builder
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const notificationIndex = state.notifications.findIndex(
          (notification) => notification.id === action.payload
        );
        if (notificationIndex !== -1) {
          // Only decrement unread count if it was previously unread
          if (!state.notifications[notificationIndex].isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications[notificationIndex].isRead = true;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetNotificationError, addNotification, updateUnreadCount } =
  notificationSlice.actions;
export default notificationSlice.reducer;

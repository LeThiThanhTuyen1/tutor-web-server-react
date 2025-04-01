// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { notificationService } from '@/services/notificationService';

// export interface Notification {
//   id: number;
//   title: string;
//   message: string;
//   isRead: boolean;
//   createdAt: string;
//   type: string;
//   link?: string;
// }

// interface NotificationState {
//   notifications: Notification[];
//   unreadCount: number;
//   isLoading: boolean;
//   error: string | null;
//   lastFetched: number | null;
// }

// const initialState: NotificationState = {
//   notifications: [],
//   unreadCount: 0,
//   isLoading: false,
//   error: null,
//   lastFetched: null,
// };

// // Async thunks
// export const fetchNotifications = createAsyncThunk(
//   'notifications/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await notificationService.getUserNotifications();
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
//     }
//   }
// );

// export const fetchUnreadNotifications = createAsyncThunk(
//   'notifications/fetchUnread',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await notificationService.getUnreadNotifications();
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread notifications');
//     }
//   }
// );

// export const markAsRead = createAsyncThunk(
//   'notifications/markAsRead',
//   async (id: number, { rejectWithValue }) => {
//     try {
//       await notificationService.markAsRead(id);
//       return id;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
//     }
//   }
// );

// const notificationSlice = createSlice({
//   name: 'notifications',
//   initialState,
//   reducers: {
//     clearNotifications: (state) => {
//       state.notifications = [];
//       state.unreadCount = 0;
//     },
//     addNotification: (state, action: PayloadAction<Notification>) => {
//       state.notifications.unshift(action.payload);
//       if (!action.payload.isRead) {
//         state.unreadCount += 1;
//       }
//     },
//     setUnreadCount: (state, action: PayloadAction<number>) => {
//       state.unreadCount = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch all notifications
//       .addCase(fetchNotifications.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchNotifications.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.notifications = action.payload;
//         state.unreadCount = action.payload.filter((notification: Notification) => !notification.isRead).length;
//         state.lastFetched = Date.now();
//       })
//       .addCase(fetchNotifications.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       })
      
//       // Fetch unread notifications
//       .addCase(fetchUnreadNotifications.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
//         state.isLoading = false;
//         // Merge unread notifications with existing read ones
//         const unreadIds = new Set(action.payload.map((n: Notification) => n.id));
//         const readNotifications = state.notifications.filter(n => n.isRead);
//         state.notifications = [...action.payload, ...readNotifications]
//           .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
//         state.unreadCount = action.payload.length;
//         state.lastFetched = Date.now();
//       })
//       .addCase(fetchUnreadNotifications.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       })
      
//       // Mark as read
//       .addCase(markAsRead.pending, (state) => {
//         state.error = null;
//       })
//       .addCase(markAsRead.fulfilled, (state, action) => {
//         const notificationId = action.payload;
//         const notification = state.notifications.find(n => n.id === notificationId);
//         if (notification && !notification.isRead) {
//           notification.isRead = true;
//           state.unreadCount = Math.max(0, state.unreadCount - 1);
//         }
//       })
//       .addCase(markAsRead.rejected, (state, action) => {
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearNotifications, addNotification, setUnreadCount } = notificationSlice.actions;
// export default notificationSlice.reducer;

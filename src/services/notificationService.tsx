// // notificationService.ts
// import { store } from "@/store/store";
// import {
//   fetchNotifications,
//   fetchUnreadNotifications,
//   markAsRead,
// } from "@/store/notificationSlice";

// // 🟢 Function-based Notification Service
// export const notificationService = {
//   fetchNotifications: async () => {
//     try {
//       const notifications = await store.dispatch(fetchNotifications()).unwrap();
//       return notifications;
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       throw new Error(error as string);
//     }
//   },

//   fetchUnreadNotifications: async () => {
//     try {
//       const unreadNotifications = await store
//         .dispatch(fetchUnreadNotifications())
//         .unwrap();
//       return unreadNotifications;
//     } catch (error) {
//       console.error("Error fetching unread notifications:", error);
//       throw new Error(error as string);
//     }
//   },

//   markAsRead: async (id: number) => {
//     try {
//       const updatedId = await store.dispatch(markAsRead(id)).unwrap();
//       return updatedId;
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//       throw new Error(error as string);
//     }
//   },

//   getNotifications: () => {
//     return store.getState().notifications.notifications;
//   },

//   getUnreadCount: () => {
//     return store.getState().notifications.unreadCount;
//   },
// };

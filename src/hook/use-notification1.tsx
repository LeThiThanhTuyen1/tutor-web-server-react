// import { useEffect, useState, useCallback, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "@/store/store";
// import { fetchAllNotifications, markNotificationAsRead, updateUnreadCount, addNotification } from "@/store/notificationSlice";
// import { useAuth } from "./use-auth";
// import { initializeSignalRConnection, isConnected } from "@/services/signalRService";

// export const useNotification = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const token = localStorage.getItem("accessToken");
//   const connectionInitialized = useRef(false);
  
//   // Track the ids of notifications we've already processed
//   const processedNotifications = useRef<Set<number>>(new Set());

//   // Get notification state from Redux
//   const { notifications, unreadCount, loading, error } = useSelector((state: RootState) => state.notifications);

//   // Get unread notifications
//   const unreadNotifications = notifications.filter((notification) => !notification.isRead);

//   // Get read notifications
//   const readNotifications = notifications.filter((notification) => notification.isRead);

//   // Initialize SignalR connection when the hook is first used
//   useEffect(() => {
//     if (token && !connectionInitialized.current) {
//       // Set up SignalR connection with callback for new notifications
//       initializeSignalRConnection(token, (message) => {
//         console.log("📬 New notification received in useNotification:", message);

//         // Ensure message has an ID and userId, and check if it was already processed
//         if (message && message.userId === user?.id && !processedNotifications.current.has(message.id)) {
//           console.log("Processing new notification:", message);
//           // Mark the notification as processed
//           processedNotifications.current.add(message.id);
          
//           // Dispatch to add notification to the store
//           dispatch(addNotification(message));
//           dispatch(fetchAllNotifications()); // Refresh notifications
//         } else {
//           console.log("Duplicate notification ignored or for another user:", message);
//         }
//       });

//       connectionInitialized.current = true;
//     }

//     // Check connection status periodically and reconnect if needed
//     const intervalId = setInterval(() => {
//       if (token && !isConnected() && connectionInitialized.current) {
//         console.log("SignalR connection lost, attempting to reconnect...");
//         initializeSignalRConnection(token);
//       }
//     }, 30000); // Check every 30 seconds

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [token, dispatch, user]);

//   // Fetch notifications on mount and when user changes
//   useEffect(() => {
//     if (user) {
//       console.log("Fetching notifications for user:", user);
//       dispatch(fetchAllNotifications());  // Lấy danh sách thông báo khi người dùng thay đổi
//     }
//   }, [dispatch, user]);

//   // Ensure unread count is correct
//   useEffect(() => {
//     dispatch(updateUnreadCount());
//     console.log(unreadCount);
//   }, [notifications, dispatch, unreadCount]);

//   // Mark a notification as read
//   const markAsRead = useCallback(
//     (id: number) => {
//       console.log("Marking notification as read:", id);
//       dispatch(markNotificationAsRead(id));
//     },
//     [dispatch]
//   );  

//   // Force refresh notifications
//   const refreshNotifications = useCallback(() => {
//     return dispatch(fetchAllNotifications());
//   }, [dispatch]);

//   return {
//     notifications,
//     unreadNotifications,
//     readNotifications,
//     unreadCount,
//     loading: loading || isLoading,
//     error,
//     markAsRead,
//     refreshNotifications,
//   };
// };

import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
  fetchAllNotifications,
  markNotificationAsRead,
} from "@/store/notificationSlice";
import { useAuth } from "./use-auth";
import { initializeSignalRConnection, isConnected } from "@/services/signalRService";

export const useNotification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [isLoading] = useState(false);
  const token = localStorage.getItem("accessToken");
  const connectionInitialized = useRef(false);

  const { notifications, unreadCount, loading, error, lastFetched } = useSelector(
    (state: RootState) => state.notifications
  );

  // Initialize SignalR connection
  useEffect(() => {
    if (token && !connectionInitialized.current) {
      initializeSignalRConnection(token); // No callback needed here; signalRService handles it
      connectionInitialized.current = true;
    }

    const handleConnectionStatusChange = () => {
      if (token && !isConnected() && connectionInitialized.current) {
        console.log("SignalR connection lost, attempting to reconnect...");
        initializeSignalRConnection(token);
      }
    };

    const intervalId = setInterval(handleConnectionStatusChange, 30000);
    return () => clearInterval(intervalId);
  }, [token, dispatch, user]);

  // Fetch notifications on mount if not already fetched
  useEffect(() => {
    if (user && !lastFetched) {
      dispatch(fetchAllNotifications());
    }
  }, [dispatch, user, lastFetched]);

  // Mark a notification as read
  const markAsRead = useCallback(
    async (id: number) => {
      const notification = notifications.find((n) => n.id === id);
      if (!notification || notification.isRead) return;
      console.log("Marking notification as read:", id);
      await dispatch(markNotificationAsRead(id)).unwrap();
    },
    [dispatch, notifications]
  );

  // Force refresh notifications
  const refreshNotifications = useCallback(() => {
    return dispatch(fetchAllNotifications());
  }, [dispatch]);

  return {
    notifications,
    unreadNotifications: notifications.filter((n) => !n.isRead),
    readNotifications: notifications.filter((n) => n.isRead),
    unreadCount,
    lastFetched,
    loading: loading || isLoading,
    error,
    markAsRead,
    refreshNotifications,
  };
};
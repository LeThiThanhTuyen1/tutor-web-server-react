import * as signalR from "@microsoft/signalr";
import { store } from "@/store/store";
import { addNotification } from "@/store/notificationSlice";
import { API_BASE_URL } from "@/config/axiosInstance";

let connection: signalR.HubConnection | null = null;

export const initializeSignalRConnection = (
  token: string,
  onReceiveNotification?: (message: any) => void
) => {

  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    return connection;
  }

  if (connection) {
    connection
      .stop()
      .catch((err) =>
        console.error("Error stopping existing connection:", err)
      );
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/notificationHub`, {
      accessTokenFactory: () => token,
      transport: signalR.HttpTransportType.WebSockets,
      skipNegotiation: true,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(signalR.LogLevel.Information)
    .build();

    connection.on("ReceiveNotification", (message) => {
      console.log("📬 Received notification via SignalR:", message);
      console.log("Received message ID:", message.id);
      if (message && typeof message === "object" && message.id) {
          const existingNotifications = store.getState().notifications.notifications;
          console.log("Current notifications in store:", existingNotifications);
          const isNotificationExists = existingNotifications.some(
              (notification) => notification.id === message.id
          );
          if (!isNotificationExists) {
              console.log("Adding notification to store");
              store.dispatch(addNotification(message));
          } else {
              console.log("Notification already exists in store. Skipping.");
          }
      } else {
          console.warn("Invalid notification format:", message);
      }
  });

  connection.onreconnecting((error) => {
    console.warn("Reconnecting to SignalR:", error);
  });

  connection.onreconnected((connectionId) => {
    console.log("Reconnected to SignalR:", connectionId);
    // Do NOT fetchAllNotifications here; rely on existing state
  });

  connection.onclose((error) => {
    if (error) {
      console.error("Connection closed with error:", error);
      setTimeout(
        () => initializeSignalRConnection(token, onReceiveNotification),
        5000
      );
    } else {
      console.log("Connection closed normally.");
    }
  });

  connection
    .start()
    .then(() => {
      console.log("✅ SignalR connection established successfully");
      // Do NOT fetchAllNotifications here; let useNotification handle initial fetch
    })
    .catch((error) => {
      console.error("❌ Error establishing SignalR connection:", error);
      connection = null;
      setTimeout(
        () => initializeSignalRConnection(token, onReceiveNotification),
        5000
      );
    });

  return connection;
};

export const stopSignalRConnection = async () => {
  if (connection) {
    try {
      await connection.stop();
      connection = null;
      console.log("SignalR connection stopped");
    } catch (error) {
      console.error("Error stopping SignalR connection:", error);
    }
  }
};

export const getSignalRConnection = () => {
  return connection;
};

export const isConnected = () => {
  return (
    connection && connection.state === signalR.HubConnectionState.Connected
  );
};
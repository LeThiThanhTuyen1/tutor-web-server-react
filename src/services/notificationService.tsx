// services/NotificationService.js
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

let connection: HubConnection;

export const connectToNotificationHub = async (
  userId,
  onReceiveNotification
) => {
  try {
    connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/notificationHub", {
        accessTokenFactory: () => localStorage.getItem("accessToken"),
      })
      .configureLogging(LogLevel.Information)
      .build();

    connection.on("ReceiveNotification", (notification) => {
      console.log("Received Notification:", notification);
      onReceiveNotification(notification);
    });

    await connection.start();
    console.log("SignalR connected");
  } catch (error) {
    console.error("Connection failed: ", error);
  }
};

export const disconnectFromNotificationHub = async () => {
  if (connection) {
    await connection.stop();
    console.log("SignalR disconnected");
  }
};

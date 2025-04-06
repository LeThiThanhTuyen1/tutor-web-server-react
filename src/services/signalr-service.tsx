// signalr-service.ts
import { API_BASE_URL } from "@/config/axiosInstance";
import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection;
export const SignalRService = {
  start: (onReceive: (notification: any) => void) => {
    connection = new signalR.HubConnectionBuilder()
       .withUrl(`${API_BASE_URL}/notificationHub`, {
         transport: signalR.HttpTransportType.WebSockets,
         skipNegotiation: true, // Try this to avoid negotiation issues
       })
       .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // More aggressive reconnection strategy
       .configureLogging(signalR.LogLevel.Information)
       .build()

    connection.on("ReceiveNotification", (notification) => {
      onReceive(notification);
    });

    connection
      .start()
      .then(() => console.log("SignalR connected"))
      .catch((err) => console.error("SignalR connection error:", err));
  },

  stop: async () => {
    if (connection) {
      await connection.stop();
    }
  },
};

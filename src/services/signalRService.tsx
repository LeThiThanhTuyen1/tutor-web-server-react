import * as signalR from "@microsoft/signalr"
import { store } from "@/store/store"
import { addNotification, fetchAllNotifications } from "@/store/notificationSlice"
import { API_BASE_URL } from "@/config/axiosInstance"

// SignalR connection instance
let connection: signalR.HubConnection | null = null

// Function to initialize SignalR connection
export const initializeSignalRConnection = (token: string, onReceiveNotification?: (message: any) => void) => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    // If connection already exists and is connected, return it
    return connection
  }

  // If there's an existing connection but it's not in Connected state, stop it
  if (connection) {
    connection.stop().catch((err) => console.error("Error stopping existing connection:", err))
  }

  // Initialize the connection
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/notificationHub`, {
      accessTokenFactory: () => token,
      transport: signalR.HttpTransportType.WebSockets,
      skipNegotiation: true, // Try this to avoid negotiation issues
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // More aggressive reconnection strategy
    .configureLogging(signalR.LogLevel.Information)
    .build()

  // Handle receiving notifications
  connection.on("ReceiveNotification", (message) => {
    console.log("📬 Received notification via SignalR:", message);
    console.log("asdasd", typeof(message));
  
    if (message) {
      // Check if notification already exists in the store
      const existingNotifications = store.getState().notifications.notifications;
      const isNotificationExists = existingNotifications.some(
        (notification) => notification.id === message.id // Assuming 'id' is a unique identifier
      );
  
      if (!isNotificationExists) {
        console.log("add notification");
        store.dispatch(addNotification(message));
      } else {
        console.log("Notification already exists in store. Not adding again.");
      }
    }
  
    // Only call the callback if needed
    if (onReceiveNotification) {
      onReceiveNotification(message);
    }
  });

  // Handle connection events
  connection.onreconnecting((error) => {
    console.warn("Reconnecting to SignalR:", error)
  })

  connection.onreconnected((connectionId) => {
    console.log("Reconnected to SignalR:", connectionId)
    // Refresh notifications after reconnection
    store.dispatch(fetchAllNotifications())
  })

  connection.onclose((error) => {
    if (error) {
      console.error("Connection closed with error:", error)
      // Try to reconnect after a brief delay
      setTimeout(() => initializeSignalRConnection(token, onReceiveNotification), 5000)
    } else {
      console.log("Connection closed normally.")
    }
  })

  // Start the connection
  connection
    .start()
    .then(() => {
      console.log("✅ SignalR connection established successfully")
      // Refresh notifications after connection is established
      store.dispatch(fetchAllNotifications())
    })
    .catch((error) => {
      console.error("❌ Error establishing SignalR connection:", error)
      connection = null
      // Try to reconnect after a brief delay
      setTimeout(() => initializeSignalRConnection(token, onReceiveNotification), 5000)
    })

  return connection
}

// Function to stop SignalR connection
export const stopSignalRConnection = async () => {
  if (connection) {
    try {
      await connection.stop()
      connection = null
      console.log("SignalR connection stopped")
    } catch (error) {
      console.error("Error stopping SignalR connection:", error)
    }
  }
}

// Function to get the current connection
export const getSignalRConnection = () => {
  return connection
}

// Function to check connection status
export const isConnected = () => {
  return connection && connection.state === signalR.HubConnectionState.Connected
}


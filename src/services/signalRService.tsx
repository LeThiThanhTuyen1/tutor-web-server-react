// import * as signalR from "@microsoft/signalr";
// import { store } from "@/store/store";
// import { addNotification, setConnection } from "@/store/notificationSlice";

// class SignalRService {
//   private connection: signalR.HubConnection | null = null;

//   public async initializeConnection() {
//     try {
//       // Create SignalR connection
//       this.connection = new signalR.HubConnectionBuilder()
//         .withUrl("/notificationHub") // Update with your actual hub URL
//         .withAutomaticReconnect()
//         .build();

//       // Set up event handlers
//       this.connection.on("ReceiveNotification", (notification) => {
//         store.dispatch(addNotification(notification));
//       });

//       // Start connection
//       await this.connection.start();
//       console.log("SignalR connected");

//       // Save connection in Redux store
//       store.dispatch(setConnection(this.connection));

//       return true;
//     } catch (error) {
//       console.error("Error connecting to SignalR:", error);
//       return false;
//     }
//   }

//   public disconnectSignalR() {
//     if (this.connection) {
//       this.connection.stop();
//       store.dispatch(setConnection(null));
//     }
//   }
// }

// const signalRService = new SignalRService();
// export default signalRService;

// import { useMemo } from "react";
// import { MessageSquare, Bell, Calendar, Info, AlertCircle } from 'lucide-react';
// import { Link } from "react-router-dom";
// import type { Notification } from "@/store/notificationSlice";
// import { formatRelativeTime } from "@/utils/date-utils"

// interface NotificationListProps {
//   notifications: Notification[];
//   isLoading: boolean;
//   onNotificationClick: (id: number) => void;
// }

// export default function NotificationList({ 
//   notifications, 
//   isLoading, 
//   onNotificationClick 
// }: NotificationListProps) {
//   // Get notification icon based on type
//   const getNotificationIcon = (type: string) => {
//     switch (type.toLowerCase()) {
//       case 'message':
//         return <MessageSquare className="h-5 w-5 text-blue-500" />;
//       case 'reminder':
//         return <Calendar className="h-5 w-5 text-purple-500" />;
//       case 'alert':
//         return <AlertCircle className="h-5 w-5 text-red-500" />;
//       default:
//         return <Info className="h-5 w-5 text-indigo-500" />;
//     }
//   };

//   // Format notification time
//   const formatNotificationTime = (dateString: string) => {
//     try {
//       return formatDistanceToNow(new Date(dateString), { addSuffix: true });
//     } catch (error) {
//       return "some time ago";
//     }
//   };

//   // Memoized sorted notifications
//   const sortedNotifications = useMemo(() => {
//     return [...notifications].sort((a, b) => {
//       // Sort by read status (unread first)
//       if (a.isRead !== b.isRead) {
//         return a.isRead ? 1 : -1;
//       }
//       // Then sort by date (newest first)
//       return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//     });
//   }, [notifications]);

//   if (isLoading && notifications.length === 0) {
//     return (
//       <div className="p-4 text-center text-gray-500 dark:text-gray-400">
//         <Bell className="h-5 w-5 mx-auto mb-2 animate-pulse" />
//         <p>Loading notifications...</p>
//       </div>
//     );
//   }

//   if (notifications.length === 0) {
//     return (
//       <div className="p-8 text-center text-gray-500 dark:text-gray-400">
//         <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
//         <p>No notifications yet</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-h-[400px] overflow-y-auto">
//       {sortedNotifications.map((notification) => (
//         <div 
//           key={notification.id}
//           className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
//             !notification.isRead ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
//           }`}
//         >
//           {notification.link ? (
//             <Link 
//               to={notification.link} 
//               className="flex items-start"
//               onClick={() => onNotificationClick(notification.id)}
//             >
//               <NotificationContent notification={notification} />
//             </Link>
//           ) : (
//             <div 
//               className="flex items-start cursor-pointer"
//               onClick={() => onNotificationClick(notification.id)}
//             >
//               <NotificationContent notification={notification} />
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// // Extracted notification content component for reuse
// function NotificationContent({ notification }: { notification: Notification }) {
//   // Get notification icon based on type
//   const getNotificationIcon = (type: string) => {
//     switch (type.toLowerCase()) {
//       case 'message':
//         return <MessageSquare className="h-5 w-5 text-blue-500" />;
//       case 'reminder':
//         return <Calendar className="h-5 w-5 text-purple-500" />;
//       case 'alert':
//         return <AlertCircle className="h-5 w-5 text-red-500" />;
//       default:
//         return <Info className="h-5 w-5 text-indigo-500" />;
//     }
//   };

//   // Format notification time
//   const formatNotificationTime = (dateString: string) => {
//     try {
//       return formatDistanceToNow(new Date(dateString), { addSuffix: true });
//     } catch (error) {
//       return "some time ago";
//     }
//   };

//   return (
//     <>
//       <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3 flex-shrink-0">
//         {getNotificationIcon(notification.type)}
//       </div>
//       <div>
//         <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>
//           {notification.title}
//         </h4>
//         <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//           {notification.message}
//         </p>
//         <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 block">
//           {formatNotificationTime(notification.createdAt)}
//         </span>
//       </div>
//       {!notification.isRead && (
//         <span className="h-2 w-2 rounded-full bg-indigo-600 ml-auto mt-2 flex-shrink-0"></span>
//       )}
//     </>
//   );
// }

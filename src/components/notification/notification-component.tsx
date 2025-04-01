// "use client";

// import {
//   useEffect,
//   useState,
//   useMemo,
//   useCallback,
//   lazy,
//   Suspense,
// } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Bell } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { RootState } from "@/store/store";
// import { fetchNotifications, markAsRead } from "@/store/notificationSlice";
// import { Skeleton } from "@/ui/skeleton";
// import { Button } from "@/ui/button";

// // Lazy-loaded components
// const NotificationList = lazy(() => import("./notification-dropdown"));

// export default function NotificationComponent() {
//   const dispatch = useDispatch();
//   const { notifications, unreadCount, isLoading, lastFetched } = useSelector(
//     (state: RootState) => state.notifications
//   );
//   const [isOpen, setIsOpen] = useState(false);

//   // Memoized notification data
//   const memoizedNotifications = useMemo(() => notifications, [notifications]);

//   // Fetch notifications with debounce and caching
//   useEffect(() => {
//     const fetchData = async () => {
//       // Only fetch if we haven't fetched in the last 60 seconds
//       const shouldFetch = !lastFetched || Date.now() - lastFetched > 60000;

//       if (shouldFetch) {
//         dispatch(fetchNotifications() as any);
//       }
//     };

//     fetchData();

//     // Set up polling for new notifications
//     const intervalId = setInterval(fetchData, 60000); // Poll every minute

//     return () => clearInterval(intervalId);
//   }, [dispatch, lastFetched]);

//   // Handle notification click
//   const handleNotificationClick = useCallback(
//     (id: number) => {
//       dispatch(markAsRead(id) as any);
//     },
//     [dispatch]
//   );

//   // Toggle notification panel
//   const toggleNotifications = useCallback(() => {
//     setIsOpen((prev) => !prev);
//   }, []);

//   // Close notification panel when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as HTMLElement;
//       if (isOpen && !target.closest(".notification-container")) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen]);

//   return (
//     <div className="relative notification-container">
//       <Button
//         variant="ghost"
//         size="icon"
//         onClick={toggleNotifications}
//         className="relative p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
//       >
//         <Bell className="h-5 w-5" />
//         {unreadCount > 0 && (
//           <motion.span
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-[10px] text-white flex items-center justify-center"
//           >
//             {unreadCount > 9 ? "9+" : unreadCount}
//           </motion.span>
//         )}
//       </Button>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 10 }}
//             transition={{ duration: 0.2 }}
//             className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20"
//           >
//             <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//               <h3 className="font-medium">Notifications</h3>
//               {unreadCount > 0 && (
//                 <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-1 rounded-full">
//                   {unreadCount} unread
//                 </span>
//               )}
//             </div>

//             <Suspense fallback={<NotificationSkeleton />}>
//               <NotificationList
//                 notifications={memoizedNotifications}
//                 isLoading={isLoading}
//                 onNotificationClick={handleNotificationClick}
//               />
//             </Suspense>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// // Skeleton loader for notifications
// function NotificationSkeleton() {
//   return (
//     <div className="max-h-[400px] overflow-y-auto py-2">
//       {Array.from({ length: 3 }).map((_, index) => (
//         <div
//           key={index}
//           className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
//         >
//           <div className="flex items-start">
//             <Skeleton className="h-8 w-8 rounded-full mr-3" />
//             <div className="flex-1">
//               <Skeleton className="h-4 w-3/4 mb-2" />
//               <Skeleton className="h-3 w-full mb-2" />
//               <Skeleton className="h-3 w-1/3" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

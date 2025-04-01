// "use client"

// import type React from "react"

// import { useState, useCallback, useMemo } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Plus, Trash2, Edit, Calendar, Clock, MapPin, Video, School } from "lucide-react"
// import { Button } from "@/ui/button"
// import { Card } from "@/ui/card"
// import { deleteSchedules } from "@/services/scheduleService"
// import { useToast } from "@/hooks/use-toast"
// import { Badge } from "@/ui/badge.tsx"
// import { cn } from "@/components/layout/cn"
// import { fadeIn } from "@/components/layout/animation"

// // Day of week mapping
// const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// // Mode icons and colors
// const MODE_ICONS: Record<string, React.ReactNode> = {
//   online: <Video className="h-4 w-4" />,
//   "in-person": <MapPin className="h-4 w-4" />,
//   hybrid: <School className="h-4 w-4" />,
// }

// const MODE_COLORS: Record<string, string> = {
//   online: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
//   "in-person": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
//   hybrid: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
// }

// interface ScheduleListProps {
//   schedules: any[]
//   onChange: (schedules: any[]) => void
//   courseId?: number
// }

// export default function ScheduleList({ schedules, onChange, courseId }: ScheduleListProps) {
//   const [isAddingSchedule, setIsAddingSchedule] = useState(false)
//   const [editingSchedule, setEditingSchedule] = useState<any>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const { toast } = useToast()

//   // Format time (e.g., "14:30" to "2:30 PM")
//   const formatTime = useCallback((time: string) => {
//     if (!time) return ""
//     const [hours, minutes] = time.split(":").map(Number)
//     const period = hours >= 12 ? "PM" : "AM"
//     const formattedHours = hours % 12 || 12
//     return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`
//   }, [])

//   // Handle adding a new schedule
//   const handleAddSchedule = useCallback(
//     (scheduleData: any) => {
//       setIsSubmitting(true)

//       // Create a new schedule object
//       const newSchedule = {
//         ...scheduleData,
//         id: Date.now(), // Temporary ID for new schedules
//         courseId: courseId || 0,
//         status: "active",
//       }

//       // Add to schedules array
//       const updatedSchedules = [...schedules, newSchedule]
//       onChange(updatedSchedules)

//       // Reset form state
//       setIsAddingSchedule(false)
//       setIsSubmitting(false)

//       toast({
//         title: "Success",
//         description: "Schedule added successfully",
//         variant: "success",
//       })
//     },
//     [schedules, onChange, courseId, toast],
//   )

//   // Handle updating an existing schedule
//   const handleUpdateSchedule = useCallback(
//     (scheduleData: any) => {
//       setIsSubmitting(true)

//       // Update the schedule in the array
//       const updatedSchedules = schedules.map((schedule) =>
//         schedule.id === editingSchedule.id ? { ...schedule, ...scheduleData } : schedule,
//       )

//       onChange(updatedSchedules)

//       // Reset form state
//       setEditingSchedule(null)
//       setIsSubmitting(false)

//       toast({
//         title: "Success",
//         description: "Schedule updated successfully",
//         variant: "success",
//       })
//     },
//     [schedules, editingSchedule, onChange, toast],
//   )

//   // Handle deleting a schedule
//   const handleDeleteSchedule = useCallback(
//     async (scheduleId: number) => {
//       // If the schedule has a real ID (not a temporary one), delete it from the server
//       if (courseId && scheduleId < Date.now() - 10000000000) {
//         // Check if it's a real ID
//         try {
//           const response = await deleteSchedules([scheduleId])

//           if (!response.succeeded) {
//             toast({
//               title: "Error",
//               description: response.message || "Failed to delete schedule",
//               variant: "destructive",
//             })
//             return
//           }
//         } catch (error) {
//           console.error("Error deleting schedule:", error)
//           toast({
//             title: "Error",
//             description: "Failed to delete schedule",
//             variant: "destructive",
//           })
//           return
//         }
//       }

//       // Remove from local state
//       const updatedSchedules = schedules.filter((schedule) => schedule.id !== scheduleId)
//       onChange(updatedSchedules)

//       toast({
//         title: "Success",
//         description: "Schedule deleted successfully",
//         variant: "success",
//       })
//     },
//     [schedules, onChange, courseId, toast],
//   )

//   // Cancel adding/editing
//   const handleCancel = useCallback(() => {
//     setIsAddingSchedule(false)
//     setEditingSchedule(null)
//   }, [])

//   // Sort schedules by day of week
//   const sortedSchedules = useMemo(() => {
//     return [...schedules].sort((a, b) => a.dayOfWeek - b.dayOfWeek)
//   }, [schedules])

//   // Check if there are any schedules
//   const hasSchedules = schedules.length > 0

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-semibold text-indigo-950 dark:text-indigo-50 flex items-center">
//           <Calendar className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
//           Course Schedules
//         </h3>

//         {!isAddingSchedule && !editingSchedule && (
//           <Button
//             onClick={() => setIsAddingSchedule(true)}
//             className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add Schedule
//           </Button>
//         )}
//       </div>

//       {/* Add/Edit Schedule Form */}
//       <AnimatePresence mode="wait">
//         {isAddingSchedule && (
//           <motion.div
//             key="add-schedule"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card className="border border-indigo-100 dark:border-indigo-900 p-4 mb-6">
//               <h4 className="text-md font-medium mb-4">Add New Schedule</h4>
//               <ScheduleForm onSubmit={handleAddSchedule} onCancel={handleCancel} isSubmitting={isSubmitting} />
//             </Card>
//           </motion.div>
//         )}

//         {editingSchedule && (
//           <motion.div
//             key="edit-schedule"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card className="border border-indigo-100 dark:border-indigo-900 p-4 mb-6">
//               <h4 className="text-md font-medium mb-4">Edit Schedule</h4>
//               <ScheduleForm
//                 initialData={editingSchedule}
//                 onSubmit={handleUpdateSchedule}
//                 onCancel={handleCancel}
//                 isSubmitting={isSubmitting}
//               />
//             </Card>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Schedules List */}
//       {hasSchedules ? (
//         <div className="space-y-4">
//           <AnimatePresence initial={false}>
//             {sortedSchedules.map((schedule: any, index: number) => (
//               <motion.div
//                 key={schedule.id}
//                 variants={fadeIn("up", index * 0.05)}
//                 initial="hidden"
//                 animate="show"
//                 exit={{ opacity: 0, height: 0, overflow: "hidden" }}
//                 transition={{ duration: 0.3 }}
//                 className="bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900 rounded-lg p-4"
//               >
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                   <div className="flex-1">
//                     <div className="flex items-center mb-2">
//                       <Badge className="mr-2 font-medium">{DAYS_OF_WEEK[schedule.dayOfWeek]}</Badge>
//                       <Badge
//                         variant="outline"
//                         className={cn(
//                           "text-xs font-medium",
//                           MODE_COLORS[schedule.mode.toLowerCase()] ||
//                             "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
//                         )}
//                       >
//                         <span className="flex items-center">
//                           {MODE_ICONS[schedule.mode.toLowerCase()] || <School className="h-3 w-3 mr-1" />}
//                           <span className="ml-1 capitalize">{schedule.mode}</span>
//                         </span>
//                       </Badge>
//                     </div>

//                     <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
//                       <Clock className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
//                       <span>
//                         {formatTime(schedule.startHour)} - {formatTime(schedule.endHour)}
//                       </span>
//                     </div>

//                     {schedule.location && (
//                       <div className="flex items-center text-gray-600 dark:text-gray-400">
//                         <MapPin className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
//                         <span>{schedule.location}</span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex gap-2 self-end sm:self-center">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => setEditingSchedule(schedule)}
//                       className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
//                     >
//                       <Edit className="h-4 w-4 mr-2" />
//                       Edit
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleDeleteSchedule(schedule.id)}
//                       className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
//                     >
//                       <Trash2 className="h-4 w-4 mr-2" />
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>
//       ) : (
//         !isAddingSchedule && (
//           <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
//             <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
//             <h3 className="text-lg font-medium mb-2">No Schedules Yet</h3>
//             <p className="text-gray-500 dark:text-gray-400 mb-4">
//               Add schedules to specify when this course will be held.
//             </p>
//             <Button
//               onClick={() => setIsAddingSchedule(true)}
//               className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Add First Schedule
//             </Button>
//           </div>
//         )
//       )}

//       {hasSchedules && !isAddingSchedule && !editingSchedule && (
//         <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
//           <div className="text-sm text-gray-500 dark:text-gray-400">
//             {schedules.length} {schedules.length === 1 ? "schedule" : "schedules"} configured
//           </div>
//           <Button
//             onClick={() => setIsAddingSchedule(true)}
//             className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add Another Schedule
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }


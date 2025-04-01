// "use client"

// import { useState, useEffect, useMemo } from "react"
// import { z } from "zod"
// import { Form, useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Clock, MapPin, Video, School, AlertCircle } from "lucide-react"
// import { Button } from "@/ui/button"
// import { Input } from "@/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"

// // Day of week mapping
// const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// // Define the form schema with Zod
// const scheduleFormSchema = z
//   .object({
//     dayOfWeek: z.coerce.number().min(0).max(6),
//     startHour: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
//     endHour: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
//     mode: z.enum(["online", "in-person", "hybrid"]),
//     location: z.string().optional(),
//   })
//   .refine(
//     (data) => {
//       // Parse times to compare them
//       const [startHours, startMinutes] = data.startHour.split(":").map(Number)
//       const [endHours, endMinutes] = data.endHour.split(":").map(Number)

//       const startTime = startHours * 60 + startMinutes
//       const endTime = endHours * 60 + endMinutes

//       return endTime > startTime
//     },
//     {
//       message: "End time must be after start time",
//       path: ["endHour"],
//     },
//   )

// type ScheduleFormValues = z.infer<typeof scheduleFormSchema>

// interface ScheduleFormProps {
//   initialData?: any
//   onSubmit: (data: ScheduleFormValues) => void
//   onCancel: () => void
//   isSubmitting?: boolean
// }

// export default function ScheduleForm({ initialData, onSubmit, onCancel, isSubmitting = false }: ScheduleFormProps) {
//   const [showLocationField, setShowLocationField] = useState(
//     initialData?.mode === "in-person" || initialData?.mode === "hybrid",
//   )

//   // Set up form with react-hook-form and zod validation
//   const form = useForm<ScheduleFormValues>({
//     resolver: zodResolver(scheduleFormSchema),
//     defaultValues: useMemo(
//       () => ({
//         dayOfWeek: initialData?.dayOfWeek ?? 1, // Default to Monday
//         startHour: initialData?.startHour ?? "09:00",
//         endHour: initialData?.endHour ?? "10:30",
//         mode: initialData?.mode ?? "online",
//         location: initialData?.location ?? "",
//       }),
//       [initialData],
//     ),
//   })

//   // Update form when initialData changes
//   useEffect(() => {
//     if (initialData) {
//       form.reset({
//         dayOfWeek: initialData.dayOfWeek ?? 1,
//         startHour: initialData.startHour ?? "09:00",
//         endHour: initialData.endHour ?? "10:30",
//         mode: initialData.mode ?? "online",
//         location: initialData.location ?? "",
//       })
//       setShowLocationField(initialData.mode === "in-person" || initialData.mode === "hybrid")
//     }
//   }, [initialData, form])

//   // Handle mode change to show/hide location field
//   const handleModeChange = (value: string) => {
//     form.setValue("mode", value as "online" | "in-person" | "hybrid")
//     setShowLocationField(value === "in-person" || value === "hybrid")

//     // Clear location if switching to online
//     if (value === "online") {
//       form.setValue("location", "")
//     }
//   }

//   // Handle form submission
//   const handleSubmit = (data: ScheduleFormValues) => {
//     onSubmit(data)
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="dayOfWeek"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Day of Week</FormLabel>
//                 <Select
//                   onValueChange={(value) => field.onChange(Number.parseInt(value))}
//                   defaultValue={field.value.toString()}
//                 >
//                   <FormControl>
//                     <SelectTrigger className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500">
//                       <SelectValue placeholder="Select day" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {DAYS_OF_WEEK.map((day, index) => (
//                       <SelectItem key={day} value={index.toString()}>
//                         {day}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="mode"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Mode</FormLabel>
//                 <Select onValueChange={handleModeChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500">
//                       <SelectValue placeholder="Select mode" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="online" className="flex items-center">
//                       <div className="flex items-center">
//                         <Video className="h-4 w-4 mr-2 text-blue-500" />
//                         Online
//                       </div>
//                     </SelectItem>
//                     <SelectItem value="in-person">
//                       <div className="flex items-center">
//                         <MapPin className="h-4 w-4 mr-2 text-green-500" />
//                         In-Person
//                       </div>
//                     </SelectItem>
//                     <SelectItem value="hybrid">
//                       <div className="flex items-center">
//                         <School className="h-4 w-4 mr-2 text-purple-500" />
//                         Hybrid
//                       </div>
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="startHour"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Start Time</FormLabel>
//                 <FormControl>
//                   <div className="relative">
//                     <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
//                     <TimePickerInput
//                       value={field.value}
//                       onChange={field.onChange}
//                       className={cn(
//                         "pl-10 bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500",
//                         form.formState.errors.startHour && "border-red-500",
//                       )}
//                     />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="endHour"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>End Time</FormLabel>
//                 <FormControl>
//                   <div className="relative">
//                     <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
//                     <TimePickerInput
//                       value={field.value}
//                       onChange={field.onChange}
//                       className={cn(
//                         "pl-10 bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500",
//                         form.formState.errors.endHour && "border-red-500",
//                       )}
//                     />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {showLocationField && (
//           <FormField
//             control={form.control}
//             name="location"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Location</FormLabel>
//                 <FormControl>
//                   <div className="relative">
//                     <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
//                     <Input
//                       placeholder="Enter location"
//                       {...field}
//                       className="pl-10 bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
//                     />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         )}

//         {Object.keys(form.formState.errors).length > 0 && (
//           <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-md flex items-start">
//             <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
//             <div>
//               <p className="font-medium">Please fix the following errors:</p>
//               <ul className="list-disc list-inside text-sm mt-1 space-y-1">
//                 {Object.entries(form.formState.errors).map(([key, error]) => (
//                   <li key={key}>{error.message as string}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}

//         <div className="flex justify-end gap-3 pt-2">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={onCancel}
//             className="border-indigo-200 dark:border-indigo-800"
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
//           >
//             {isSubmitting ? "Saving..." : initialData ? "Update Schedule" : "Add Schedule"}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }


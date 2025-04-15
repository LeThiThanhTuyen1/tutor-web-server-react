"use client"

import type React from "react"

import { useMemo } from "react"
import { cn } from "@/ui/cn"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import { MapPin, Globe, AlertTriangle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/tooltip"

// Types
interface Schedule {
  id: number
  tutorId: number
  courseId: number
  dayOfWeek: number
  startHour: string
  endHour: string
  mode: string
  location: string
  status: string
}

interface Course {
  id: number
  courseName: string
  tutorId: number
  tutorName: string
  description: string
  startDate: string
  endDate: string
  fee: number
  maxStudents: number
  status: string
  createdAt: string
  schedule: Schedule[]
}

interface ScheduleWithCourse extends Schedule {
  courseId: number
  hasConflict: boolean
  course: Course
}

// Day of week mapping
// const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// Mode icons
const MODE_ICONS: Record<string, React.JSX.Element> = {
  online: <Globe className="h-3 w-3" />,
  offline: <MapPin className="h-3 w-3" />,
}

// Format time (e.g., "14:30:00" to "2:30 PM")
const formatTime = (time: string) => {
  if (!time) return ""
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const formattedHours = hours % 12 || 12
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`
}

// Convert time to minutes for easier comparison
const timeToMinutes = (timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number)
  return hours * 60 + minutes
}

// Check if two time ranges overlap
const hasTimeOverlap = (start1: string, end1: string, start2: string, end2: string) => {
  const start1Minutes = timeToMinutes(start1)
  const end1Minutes = timeToMinutes(end1)
  const start2Minutes = timeToMinutes(start2)
  const end2Minutes = timeToMinutes(end2)

  return (
    (start1Minutes < end2Minutes && end1Minutes > start2Minutes) ||
    (start2Minutes < end1Minutes && end2Minutes > start1Minutes)
  )
}

// Generate time slots for the day (hourly from 7 AM to 10 PM)
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 7; hour <= 22; hour++) {
    slots.push({
      start: `${hour.toString().padStart(2, "0")}:00:00`,
      end: `${(hour + 1).toString().padStart(2, "0")}:00:00`,
    })
  }
  return slots
}

// Schedule cell component
const ScheduleCell = ({ schedules }: { schedules: ScheduleWithCourse[] }) => {
  if (schedules.length === 0) {
    return null
  }

  return (
    <div className="space-y-1">
      {schedules.map((schedule) => (
        <TooltipProvider key={schedule.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "p-1 rounded text-xs cursor-pointer",
                  schedule.hasConflict
                    ? "bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                    : "bg-indigo-50 border border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800",
                )}
              >
                {schedule.hasConflict && (
                  <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                    <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                    <span className="text-[9px] font-medium">Conflict</span>
                  </div>
                )}
                <div className="font-medium text-[10px] text-indigo-700 dark:text-indigo-300 truncate max-w-[100px]">
                  {schedule.course.courseName}
                </div>
                <div className="flex items-center mt-0.5 text-[9px] text-gray-600 dark:text-gray-400">
                  {MODE_ICONS[schedule.mode]}
                  <span className="ml-0.5 capitalize">{schedule.mode}</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <div className="text-xs">
                <div className="font-bold mb-1">{schedule.course.courseName}</div>
                <div className="mb-1">
                  <span className="font-semibold">Time:</span> {formatTime(schedule.startHour)} -{" "}
                  {formatTime(schedule.endHour)}
                </div>
                <div className="mb-1">
                  <span className="font-semibold">Tutor:</span> {schedule.course.tutorName}
                </div>
                <div className="mb-1">
                  <span className="font-semibold">Mode:</span> {schedule.mode}
                </div>
                {schedule.location && (
                  <div>
                    <span className="font-semibold">Location:</span> {schedule.location}
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}

// Main component
interface DailyTableScheduleProps {
  courses: Course[]
  currentDate: Date
}

const DailyTableSchedule = ({ courses, currentDate }: DailyTableScheduleProps) => {
  // Get the current day of the week (0-6)
  const currentDayOfWeek = currentDate.getDay()
  const formattedDate = currentDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Process schedules for the current day
  const { schedulesByTime, timeSlots } = useMemo(() => {
    // Create a map to store schedules by time slot
    const scheduleMap: Record<string, ScheduleWithCourse[]> = {}

    // Collect all schedules with course info for the current day
    const allSchedules: ScheduleWithCourse[] = []

    // Process courses and their schedules
    courses.forEach((course) => {
      // Skip canceled courses
      if (course.status === "canceled") return

      // Process each schedule, if it exists
      if (Array.isArray(course.schedule)) {
        course.schedule.forEach((schedule) => {
          // Only include schedules for the current day of the week
          if (schedule.dayOfWeek === currentDayOfWeek) {
            const scheduleWithCourse: ScheduleWithCourse = {
              ...schedule,
              courseId: course.id,
              hasConflict: false,
              course,
            }

            allSchedules.push(scheduleWithCourse)
          }
        })
      }
    })

    // Check for conflicts
    for (let i = 0; i < allSchedules.length; i++) {
      for (let j = i + 1; j < allSchedules.length; j++) {
        const s1 = allSchedules[i]
        const s2 = allSchedules[j]

        if (hasTimeOverlap(s1.startHour, s1.endHour, s2.startHour, s2.endHour)) {
          s1.hasConflict = true
          s2.hasConflict = true
        }
      }
    }

    // Generate time slots for the day
    const timeSlots = generateTimeSlots()

    // Initialize empty arrays for each time slot
    timeSlots.forEach(({ start, end }) => {
      const timeKey = `${start}-${end}`
      scheduleMap[timeKey] = []
    })

    // Add schedules to the appropriate time slot
    allSchedules.forEach((schedule) => {
      // Find all time slots that overlap with this schedule
      timeSlots.forEach(({ start, end }) => {
        const timeKey = `${start}-${end}`
        if (hasTimeOverlap(schedule.startHour, schedule.endHour, start, end)) {
          scheduleMap[timeKey].push(schedule)
        }
      })
    })

    return { schedulesByTime: scheduleMap, timeSlots }
  }, [courses, currentDayOfWeek])

  return (
    <div className="w-full overflow-hidden">
      <Card className="border border-indigo-100 dark:border-indigo-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-indigo-800 dark:text-indigo-300">{formattedDate}</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="w-full overflow-x-auto" style={{ maxWidth: "100%" }}>
            <div className="min-w-[600px] max-w-full">
              <Table className="w-full border-collapse">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-xs p-1">Time</TableHead>
                    <TableHead className="text-center text-xs p-1">Classes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeSlots.map(({ start, end }) => {
                    const timeKey = `${start}-${end}`
                    const schedules = schedulesByTime[timeKey] || []
                    const hasSchedules = schedules.length > 0

                    return (
                      <TableRow key={timeKey} className={hasSchedules ? "bg-gray-50 dark:bg-gray-800/50" : ""}>
                        <TableCell className="font-medium text-xs p-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
                            {formatTime(start)} - {formatTime(end)}
                          </div>
                        </TableCell>
                        <TableCell className="p-1 align-top">
                          <ScheduleCell schedules={schedules} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {Object.values(schedulesByTime).every((schedules) => schedules.length === 0) && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
              <p>No classes scheduled for this day.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DailyTableSchedule

"use client"

import type React from "react"
import { useMemo } from "react"
import { cn } from "@/ui/cn"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import { MapPin, Globe, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"

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
const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Status styles
// const STATUS_STYLES: Record<string, string> = {
//   ongoing: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
//   completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
//   canceled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
//   coming: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
//   scheduled: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
//   conflict: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
// }

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

// Get all unique time slots from schedules
const getUniqueTimeSlots = (schedules: ScheduleWithCourse[]) => {
  const timeSlots = new Set<string>()

  schedules.forEach((schedule) => {
    const key = `${schedule.startHour}-${schedule.endHour}`
    timeSlots.add(key)
  })

  return Array.from(timeSlots)
    .map((slot) => {
      const [start, end] = slot.split("-")
      return { start, end }
    })
    .sort((a, b) => {
      return timeToMinutes(a.start) - timeToMinutes(b.start)
    })
}

// Schedule cell component
const ScheduleCell = ({ schedules }: { schedules: ScheduleWithCourse[] }) => {
  if (schedules.length === 0) {
    return null
  }

  return (
    <div className="space-y-1">
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className={cn(
            "p-1 rounded text-xs",
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
      ))}
    </div>
  )
}

// Main component
const WeeklyTableSchedule = ({ courses }: { courses: Course[] }) => {
  // Process schedules and check for conflicts
  const { schedulesByTimeAndDay, timeSlots, weekNumber, dateRange } = useMemo(() => {
    // Create a map to store schedules by time slot and day
    const scheduleMap: Record<string, Record<number, ScheduleWithCourse[]>> = {}

    // Create a map to store courses by ID for quick lookup
    const courseMap: Record<number, Course> = {}

    // Collect all schedules with course info
    const allSchedules: ScheduleWithCourse[] = []

    // Process courses and their schedules
    courses.forEach((course) => {
      // Skip canceled courses
      if (course.status === "canceled") return

      // Store course in map
      courseMap[course.id] = course

      // Process each schedule
      course.schedule.forEach((schedule) => {
        const scheduleWithCourse: ScheduleWithCourse = {
          ...schedule,
          courseId: course.id,
          hasConflict: false,
          course,
        }

        allSchedules.push(scheduleWithCourse)
      })
    })

    // Check for conflicts
    for (let i = 0; i < allSchedules.length; i++) {
      for (let j = i + 1; j < allSchedules.length; j++) {
        const s1 = allSchedules[i]
        const s2 = allSchedules[j]

        if (s1.dayOfWeek === s2.dayOfWeek && hasTimeOverlap(s1.startHour, s1.endHour, s2.startHour, s2.endHour)) {
          s1.hasConflict = true
          s2.hasConflict = true
        }
      }
    }

    // Get unique time slots
    const timeSlots = getUniqueTimeSlots(allSchedules)

    // Organize schedules by time slot and day
    timeSlots.forEach(({ start, end }) => {
      const timeKey = `${start}-${end}`
      scheduleMap[timeKey] = {}

      // Initialize empty arrays for each day
      DAYS_OF_WEEK.forEach((_, dayIndex) => {
        scheduleMap[timeKey][dayIndex] = []
      })

      // Add schedules to the appropriate day and time slot
      allSchedules.forEach((schedule) => {
        if (schedule.startHour === start && schedule.endHour === end) {
          scheduleMap[timeKey][schedule.dayOfWeek].push(schedule)
        }
      })
    })

    // Calculate current week number and date range
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)

    // Calculate date range for current week
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    const dateRange = {
      start: startOfWeek.toLocaleDateString(),
      end: endOfWeek.toLocaleDateString(),
    }

    return { schedulesByTimeAndDay: scheduleMap, timeSlots, weekNumber, dateRange }
  }, [courses])

  return (
    <div className="w-full overflow-hidden">
      <Card className="border border-indigo-100 dark:border-indigo-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-indigo-800 dark:text-indigo-300">
            Week {weekNumber}: {dateRange.start} - {dateRange.end}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="w-full overflow-x-auto" style={{ maxWidth: "100%" }}>
            <div className="min-w-[600px] max-w-full">
              <Table className="w-full border-collapse">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-xs p-1">Time</TableHead>
                    {DAYS_SHORT.map((day, index) => (
                      <TableHead key={day} className="text-center text-xs p-1 w-[14.28%]">
                        {day}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeSlots.map(({ start, end }) => {
                    const timeKey = `${start}-${end}`
                    const hasAnySchedule = Object.values(schedulesByTimeAndDay[timeKey]).some(
                      (schedules) => schedules.length > 0,
                    )

                    if (!hasAnySchedule) return null

                    return (
                      <TableRow key={timeKey}>
                        <TableCell className="font-medium text-xs p-1 whitespace-nowrap">
                          {formatTime(start)}-{formatTime(end)}
                        </TableCell>
                        {DAYS_OF_WEEK.map((_, dayIndex) => {
                          const daySchedules = schedulesByTimeAndDay[timeKey][dayIndex]
                          return (
                            <TableCell key={dayIndex} className="p-1 align-top">
                              <ScheduleCell schedules={daySchedules} />
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {timeSlots.length === 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
              <p>No classes scheduled for this week.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default WeeklyTableSchedule


"use client"

import { useMemo } from "react"
import { cn } from "@/ui/cn"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import { MapPin, Globe, AlertTriangle } from 'lucide-react'
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
const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

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
interface WeeklyTableScheduleProps {
  courses: Course[]
  currentDate: Date
  weekNumber: number
  dateRange: string
}

const WeeklyTableSchedule = ({ courses, currentDate, weekNumber, dateRange }: WeeklyTableScheduleProps) => {
  // Process schedules and check for conflicts
  const { schedulesByTimeAndDay, timeSlots } = useMemo(() => {
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

      // Process each schedule, if it exists
      if (Array.isArray(course.schedule)) {
        course.schedule.forEach((schedule) => {
          const scheduleWithCourse: ScheduleWithCourse = {
            ...schedule,
            courseId: course.id,
            hasConflict: false,
            course,
          }

          allSchedules.push(scheduleWithCourse)
        })
      }
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

    return { schedulesByTimeAndDay: scheduleMap, timeSlots }
  }, [courses])

  // Get the current day of the week (0-6)
  const currentDayOfWeek = currentDate.getDay()

  // Generate dates for the week
  const weekDates = useMemo(() => {
    const dates = []
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDayOfWeek)

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }
    return dates
  }, [currentDate, currentDayOfWeek])

  return (
    <div className="w-full overflow-hidden">
      <Card className="border border-indigo-100 dark:border-indigo-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-indigo-800 dark:text-indigo-300">Week {weekNumber}: {dateRange}</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="w-full overflow-x-auto" style={{ maxWidth: "100%" }}>
            <div className="min-w-[600px] max-w-full">
              <Table className="w-full border-collapse">
                <TableHeader>
                  <TableRow>
                    {DAYS_SHORT.map((day, index) => (
                      <TableHead
                        key={day}
                        className={cn(
                          "text-center text-xs p-1 w-[14.28%]",
                          currentDayOfWeek === index && "bg-indigo-50 dark:bg-indigo-900/20"
                        )}
                      >
                        <div>{day}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">
                          {weekDates[index].toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeSlots.map(({ start, end }) => {
                    const timeKey = `${start}-${end}`
                    const hasAnySchedule = Object.values(schedulesByTimeAndDay[timeKey]).some(
                      (schedules) => schedules.length > 0
                    )

                    if (!hasAnySchedule) return null

                    return (
                      <TableRow key={timeKey} className="group">
                        {DAYS_OF_WEEK.map((_, dayIndex) => {
                          const daySchedules = schedulesByTimeAndDay[timeKey][dayIndex]
                          return (
                            <TableCell
                              key={dayIndex}
                              className={cn(
                                "p-1 align-top relative",
                                currentDayOfWeek === dayIndex && "bg-indigo-50/50 dark:bg-indigo-900/10"
                              )}
                            >
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent side="left" className="text-xs">
                                    {formatTime(start)} - {formatTime(end)}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
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

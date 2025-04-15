"use client"

import type React from "react"
import { useMemo } from "react"
import { Badge } from "@/ui/badge"
import { cn } from "@/ui/cn"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import { Clock, MapPin, Globe, AlertTriangle, User, Calendar } from "lucide-react"

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

interface ScheduleWithConflict extends Schedule {
  hasConflict: boolean
  conflictingCourses?: string[]
}

// Day of week mapping
const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// Status styles
const STATUS_STYLES: Record<string, string> = {
  ongoing: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  canceled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  coming: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  scheduled: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  conflict: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
}

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

// Main component
const CourseTableSchedule = ({ courses }: { courses: Course[] }) => {
  // Process courses and check for conflicts
  const processedCourses = useMemo(() => {
    // Skip canceled courses
    const activeCourses = courses.filter((course) => course.status !== "canceled")

    // Create a map of all schedules for conflict checking
    const allSchedules: Array<{
      courseId: number
      courseName: string
      schedule: Schedule
    }> = []

    activeCourses.forEach((course) => {
      course.schedule.forEach((schedule) => {
        allSchedules.push({
          courseId: course.id,
          courseName: course.courseName,
          schedule,
        })
      })
    })

    // Check for conflicts and mark schedules
    const coursesWithConflicts = activeCourses.map((course) => {
      const schedulesWithConflicts = course.schedule.map((schedule) => {
        const conflicts: string[] = []

        allSchedules.forEach((otherSchedule) => {
          if (
            otherSchedule.courseId !== course.id &&
            otherSchedule.schedule.dayOfWeek === schedule.dayOfWeek &&
            hasTimeOverlap(
              schedule.startHour,
              schedule.endHour,
              otherSchedule.schedule.startHour,
              otherSchedule.schedule.endHour,
            )
          ) {
            conflicts.push(otherSchedule.courseName)
          }
        })

        return {
          ...schedule,
          hasConflict: conflicts.length > 0,
          conflictingCourses: conflicts,
        } as ScheduleWithConflict
      })

      return {
        ...course,
        schedule: schedulesWithConflicts,
        hasAnyConflict: schedulesWithConflicts.some((s) => s.hasConflict),
      }
    })

    return coursesWithConflicts
  }, [courses])

  return (
    <div className="w-full overflow-hidden">
      <div className="w-full overflow-x-auto" style={{ maxWidth: "100%" }}>
        <div className="min-w-[600px] max-w-full">
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow>
                <TableHead className="text-md p-1 w-[25%]">Course</TableHead>
                <TableHead className="text-md p-1 w-[15%]">Tutor</TableHead>
                <TableHead className="text-md p-1 w-[15%]">Status</TableHead>
                <TableHead className="text-md p-1 w-[45%]">Schedule</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedCourses.length > 0 ? (
                processedCourses.map((course) => (
                  <TableRow
                    key={course.id}
                    className={course.hasAnyConflict ? "bg-yellow-50/50 dark:bg-yellow-900/10" : ""}
                  >
                    <TableCell className="p-2 align-top">
                      <div className="font-medium text-sm text-indigo-700 dark:text-indigo-300">
                        {course.courseName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(course.startDate).toLocaleDateString()} -{" "}
                        {new Date(course.endDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="p-2 align-top">
                      <div className="text-xs flex items-center">
                        <User className="h-3 w-3 mr-1 text-indigo-500 dark:text-indigo-400" />
                        {course.tutorName}
                      </div>
                    </TableCell>
                    <TableCell className="p-2 align-top">
                      <Badge variant="outline" className={cn("text-xs", STATUS_STYLES[course.status])}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2 align-top">
                      <div className="space-y-2">
                        {course.schedule.map((schedule, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "p-1.5 rounded text-xs",
                              schedule.hasConflict
                                ? "bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                                : "bg-gray-50 border border-gray-100 dark:bg-gray-800/40 dark:border-gray-700",
                            )}
                          >
                            <div className="flex flex-wrap gap-1 items-center">
                              <span className="font-medium">{DAYS_OF_WEEK[schedule.dayOfWeek]}</span>
                              <span className="text-gray-600 dark:text-gray-400">
                                <Clock className="h-3 w-3 inline mr-0.5" />
                                {formatTime(schedule.startHour)} - {formatTime(schedule.endHour)}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400 flex items-center">
                                {MODE_ICONS[schedule.mode]}
                                <span className="ml-0.5 capitalize">{schedule.mode}</span>
                              </span>
                              {schedule.location && (
                                <span className="text-gray-600 dark:text-gray-400 flex items-center">
                                  <MapPin className="h-3 w-3 mr-0.5" />
                                  <span className="truncate max-w-[100px]">{schedule.location}</span>
                                </span>
                              )}
                            </div>

                            {schedule.hasConflict && schedule.conflictingCourses && (
                              <div className="mt-1 text-yellow-600 dark:text-yellow-400 text-[10px]">
                                <AlertTriangle className="h-2.5 w-2.5 inline mr-0.5" />
                                <span>Conflicts with: {schedule.conflictingCourses.join(", ")}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                    No courses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default CourseTableSchedule

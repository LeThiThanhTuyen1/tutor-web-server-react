"use client"

import { useMemo, useState, useCallback, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Clock, MapPin, Globe, User, AlertTriangle } from "lucide-react"
import { Button } from "@/ui/button"
import React from "react"
import { cn } from "@/ui/cn"
import { CustomTooltip } from "@/ui/custom-tooltip"
import { Badge } from "@/ui/badge"

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

// Day of week mapping
const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// Status styles
const STATUS_STYLES: Record<string, string> = {
  ongoing:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  canceled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  coming: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  scheduled:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  conflict:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
}

// Mode icons
const MODE_ICONS: Record<string, JSX.Element> = {
  online: <Globe className="h-4 w-4" />,
  offline: <MapPin className="h-4 w-4" />,
}

// Format time (e.g., "14:30:00" to "2:30 PM")
const formatTime = (time: string) => {
  if (!time) return ""
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const formattedHours = hours % 12 || 12
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`
}

// Parse time to get hours and minutes
const parseTime = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number)
  return { hours, minutes, seconds: seconds || 0 }
}

// Convert time to minutes for easier comparison
const timeToMinutes = (timeString: string) => {
  const { hours, minutes } = parseTime(timeString)
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

// Generate time slots for the calendar
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 7; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`)
  }
  return slots
}

// ScheduleEvent component - memoized
const ScheduleEvent = React.memo(
  ({
    schedule,
    course,
    hasConflict,
    conflictInfo,
    zIndex,
    leftOffset = 0,
    width = 100,
  }: {
    schedule: Schedule & { courseId: number }
    course: Course
    hasConflict: boolean
    conflictInfo?: string
    zIndex: number
    leftOffset?: number
    width?: number
  }) => {
    // Calculate position and height based on start and end times
    const position = useMemo(() => {
      const start = parseTime(schedule.startHour)
      const end = parseTime(schedule.endHour)

      // Calculate top position relative to the current time slot
      const startHour = start.hours
      const startMinute = start.minutes
      const endHour = end.hours
      const endMinute = end.minutes

      // Calculate offset from the current time slot (in minutes)
      const startOffset = startMinute / 60

      // Calculate duration in hours
      const durationHours = endHour - startHour + (endMinute - startMinute) / 60

      return {
        top: `${startOffset * 60}px`,
        height: `${durationHours * 60}px`,
        zIndex: zIndex,
        left: `${leftOffset}%`,
        width: `${width}%`,
      }
    }, [schedule.startHour, schedule.endHour, zIndex, leftOffset, width])

    // Tooltip content
    const tooltipContent = (
      <div className="space-y-3 p-2 max-w-xs">
        <div className="font-semibold text-base">
          {course.courseName}
          {hasConflict && (
            <Badge variant="outline" className={cn("ml-2 text-xs", STATUS_STYLES.conflict)}>
              Conflict
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <span className="text-sm">
              {formatTime(schedule.startHour)} - {formatTime(schedule.endHour)}
            </span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <span className="text-sm">{course.tutorName}</span>
          </div>
          <div className="flex items-center">
            {MODE_ICONS[schedule.mode] || (
              <Globe className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            )}
            <span className="capitalize text-sm">{schedule.mode}</span>
          </div>
          {schedule.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <span className="text-sm">{schedule.location}</span>
            </div>
          )}
          {hasConflict && conflictInfo && (
            <div className="flex items-start mt-1 pt-1 border-t border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-yellow-700 dark:text-yellow-300">{conflictInfo}</span>
            </div>
          )}
        </div>
      </div>
    )

    return (
      <CustomTooltip content={tooltipContent} side="right" align="start">
        <motion.div
          className={cn(
            "absolute p-2 rounded-md border shadow-sm cursor-pointer overflow-hidden",
            hasConflict ? STATUS_STYLES.conflict : STATUS_STYLES[schedule.status] || STATUS_STYLES.scheduled,
          )}
          style={position}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-sm font-semibold truncate">{course.courseName}</div>
          <div className="text-xs flex items-center mt-1">
            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">
              {formatTime(schedule.startHour)} - {formatTime(schedule.endHour)}
            </span>
          </div>
          {hasConflict && (
            <div className="text-xs flex items-center mt-1 text-yellow-700 dark:text-yellow-400">
              <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />
              <span>Schedule conflict</span>
            </div>
          )}
        </motion.div>
      </CustomTooltip>
    )
  },
)
ScheduleEvent.displayName = "ScheduleEvent"

// Main calendar view component
const CalendarView = ({ courses }: { courses: Course[] }) => {
  const [currentWeek, setCurrentWeek] = useState(0)
  const timeSlots = useMemo(() => generateTimeSlots(), [])
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // Group schedules by day of week and time slot
  const schedulesByDay = useMemo(() => {
    const days: Record<number, Array<Schedule & { courseId: number; hasConflict: boolean; conflictWith: number[] }>> = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    }

    const courseMap: Record<number, Course> = {}

    courses.forEach((course) => {
      // Skip canceled courses
      if (course.status === "canceled") return

      courseMap[course.id] = course

      course.schedule.forEach((schedule) => {
        // Add courseId to schedule for reference
        const scheduleWithCourseId = {
          ...schedule,
          courseId: course.id,
          hasConflict: false,
          conflictWith: [],
        }

        if (days[schedule.dayOfWeek] !== undefined) {
          days[schedule.dayOfWeek].push(scheduleWithCourseId)
        }
      })
    })

    // Check for conflicts within each day
    Object.keys(days).forEach((day) => {
      const daySchedules = days[Number(day)]

      // Sort schedules by start time
      daySchedules.sort((a, b) => {
        return a.startHour.localeCompare(b.startHour)
      })

      // Check each schedule against others for conflicts
      for (let i = 0; i < daySchedules.length; i++) {
        for (let j = i + 1; j < daySchedules.length; j++) {
          if (
            hasTimeOverlap(
              daySchedules[i].startHour,
              daySchedules[i].endHour,
              daySchedules[j].startHour,
              daySchedules[j].endHour,
            )
          ) {
            daySchedules[i].hasConflict = true
            daySchedules[j].hasConflict = true
            daySchedules[i].conflictWith.push(j)
            daySchedules[j].conflictWith.push(i)
          }
        }
      }
    })

    return { days, courseMap }
  }, [courses])

  // Navigate to previous/next week
  const navigateToPreviousWeek = useCallback(() => {
    setCurrentWeek((prev) => prev - 1)
  }, [])

  const navigateToNextWeek = useCallback(() => {
    setCurrentWeek((prev) => prev + 1)
  }, [])

  // Reset to current week
  const resetToCurrentWeek = useCallback(() => {
    setCurrentWeek(0)
  }, [])

  // Get week label
  const weekLabel = useMemo(() => {
    if (currentWeek === 0) return "Current Week"
    if (currentWeek < 0) return `${Math.abs(currentWeek)} ${Math.abs(currentWeek) === 1 ? "Week" : "Weeks"} Ago`
    return `${currentWeek} ${currentWeek === 1 ? "Week" : "Weeks"} From Now`
  }, [currentWeek])

  // Calculate layout for overlapping events
  const getEventLayout = (dayIndex: number, slotIndex: number, scheduleIndex: number) => {
    const daySchedules = schedulesByDay.days[dayIndex]
    const schedule = daySchedules[scheduleIndex]
    const { hours: slotHour } = parseTime(timeSlots[slotIndex])
    const { hours: scheduleStartHour } = parseTime(schedule.startHour)

    if (scheduleStartHour !== slotHour) return null

    // If no conflicts, use full width
    if (!schedule.hasConflict) {
      return { leftOffset: 0, width: 100, zIndex: 10 }
    }

    // If has conflicts, calculate width and offset
    const conflictCount = schedule.conflictWith.length + 1
    const width = 95 / conflictCount
    const position = schedule.conflictWith.filter((idx) => idx < scheduleIndex).length
    const leftOffset = position * width

    return { leftOffset, width, zIndex: 10 + scheduleIndex }
  }

  // Generate conflict info text
  const getConflictInfo = (dayIndex: number, scheduleIndex: number) => {
    const daySchedules = schedulesByDay.days[dayIndex]
    const schedule = daySchedules[scheduleIndex]

    if (!schedule.hasConflict) return ""

    const conflictingCourses = schedule.conflictWith.map((idx) => {
      const conflictSchedule = daySchedules[idx]
      const course = schedulesByDay.courseMap[conflictSchedule.courseId]
      return `${course.courseName} (${formatTime(conflictSchedule.startHour)} - ${formatTime(conflictSchedule.endHour)})`
    })

    return `Conflicts with: ${conflictingCourses.join(", ")}`
  }

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={navigateToPreviousWeek}
          className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous Week
        </Button>

        <div className="text-center">
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">{weekLabel}</span>
          {currentWeek !== 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={resetToCurrentWeek}
              className="text-indigo-600 dark:text-indigo-400 p-0 h-auto ml-2"
            >
              Reset
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={navigateToNextWeek}
          className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
        >
          Next Week
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Calendar legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Scheduled</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Ongoing</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Coming</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Conflict</span>
        </div>
      </div>

      {/* Calendar grid */}
      <div
        ref={containerRef}
        className="bg-white dark:bg-gray-800 rounded-lg border border-indigo-100 dark:border-indigo-900 overflow-hidden shadow-sm"
      >
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b border-indigo-100 dark:border-indigo-900">
          <div className="p-2 text-center font-medium text-gray-500 dark:text-gray-400 border-r border-indigo-100 dark:border-indigo-900">
            Time
          </div>
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="p-2 text-center font-medium text-indigo-700 dark:text-indigo-300 border-r border-indigo-100 dark:border-indigo-900 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="relative">
          {/* Time slots */}
          {timeSlots.map((slot, slotIndex) => (
            <div
              key={slot}
              className="grid grid-cols-8 border-b border-indigo-100 dark:border-indigo-900 last:border-b-0"
            >
              <div className="p-2 text-center text-xs text-gray-500 dark:text-gray-400 border-r border-indigo-100 dark:border-indigo-900 h-[60px]">
                {formatTime(slot)}
              </div>

              {/* Day columns */}
              {DAYS_OF_WEEK.map((_, dayIndex) => (
                <div
                  key={dayIndex}
                  className="relative border-r border-indigo-100 dark:border-indigo-900 last:border-r-0 h-[60px]"
                >
                  {/* Render schedules for this day and time slot */}
                  {schedulesByDay.days[dayIndex].map((schedule, scheduleIndex) => {
                    const { hours: scheduleStartHour } = parseTime(schedule.startHour)
                    const { hours: slotHour } = parseTime(slot)

                    if (scheduleStartHour !== slotHour) return null

                    const layout = getEventLayout(dayIndex, slotIndex, scheduleIndex)
                    if (!layout) return null

                    return (
                      <ScheduleEvent
                        key={schedule.id}
                        schedule={schedule}
                        course={schedulesByDay.courseMap[schedule.courseId]}
                        hasConflict={schedule.hasConflict}
                        conflictInfo={getConflictInfo(dayIndex, scheduleIndex)}
                        zIndex={layout.zIndex}
                        leftOffset={layout.leftOffset}
                        width={layout.width}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* No schedules message */}
      {Object.values(schedulesByDay.days).every((day) => day.length === 0) && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow mt-4">
          <Clock className="h-12 w-12 mx-auto text-indigo-300 dark:text-indigo-700 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No scheduled classes</h3>
          <p className="text-gray-500 dark:text-gray-400">You don't have any scheduled classes for this week.</p>
        </div>
      )}
    </div>
  )
}

export default React.memo(CalendarView)


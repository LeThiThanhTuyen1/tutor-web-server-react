"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Clock, BookOpen, Calendar, ViewIcon as ChevronLeft, ChevronRight, LayoutList, CalendarDays, CalendarIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { Button } from "@/ui/button"
import { useToast } from "@/hook/use-toast"
import { ToastContainer } from "@/ui/toast"
import type React from "react"
import { getStudentCourseByUserId, getTutorCourseByUserId } from "@/services/courseService"
import { useAuth } from "@/hook/use-auth"
import WeeklyTableSchedule from "./weekly-table-schedule"
import { CircleDollarSign, Video, Users } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover"
import DailyTableSchedule from "./daily-table-schedule"
import { DatePicker } from "@/ui/date-picker"

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

const formatTime = (time: string) => {
  const [hour, minute] = time.split(":")
  const period = Number.parseInt(hour) >= 12 ? "PM" : "AM"
  const formattedHour = Number.parseInt(hour) % 12 || 12
  return `${formattedHour}:${minute} ${period}`
}

const MODE_ICONS: { [key: string]: React.ReactNode } = {
  online: <Video className="h-3 w-3 mr-1 text-green-500 dark:text-green-400" />,
  inPerson: <Users className="h-3 w-3 mr-1 text-blue-500 dark:text-blue-400" />,
  hybrid: <CircleDollarSign className="h-3 w-3 mr-1 text-orange-500 dark:text-orange-400" />,
}

// Helper function to get the start of the week for a given date
const getStartOfWeek = (date: Date) => {
  const result = new Date(date)
  const day = result.getDay()
  result.setDate(result.getDate() - day)
  return result
}

// Helper function to format date range
const formatDateRange = (startDate: Date, endDate: Date) => {
  return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
}

// Main component
export default function ScheduleView() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const { toast, toasts, dismiss } = useToast()
  const { user } = useAuth()
  const role = user?.role
  const max = 1000

  // State for date navigation
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<"daily" | "weekly">("weekly")

  // Calculate week range
  const weekRange = useMemo(() => {
    const startOfWeek = getStartOfWeek(currentDate)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    return { startOfWeek, endOfWeek }
  }, [currentDate])

  // Calculate week number
  const weekNumber = useMemo(() => {
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1)
    const millisecondsPerDay = 86400000
    const dayOfYear = Math.floor((currentDate.getTime() - startOfYear.getTime()) / millisecondsPerDay)
    return Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7)
  }, [currentDate])

  // Navigation functions
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const goToPrevious = () => {
    if (currentView === "daily") {
      const prevDay = new Date(currentDate)
      prevDay.setDate(prevDay.getDate() - 1)
      setCurrentDate(prevDay)
    } else {
      const prevWeek = new Date(currentDate)
      prevWeek.setDate(prevWeek.getDate() - 7)
      setCurrentDate(prevWeek)
    }
  }

  const goToNext = () => {
    if (currentView === "daily") {
      const nextDay = new Date(currentDate)
      nextDay.setDate(nextDay.getDate() + 1)
      setCurrentDate(nextDay)
    } else {
      const nextWeek = new Date(currentDate)
      nextWeek.setDate(nextWeek.getDate() + 7)
      setCurrentDate(nextWeek)
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date)
    }
  }

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)

      const fetchCoursesByRole = role === "Tutor" ? getTutorCourseByUserId : getStudentCourseByUserId

      const response = await fetchCoursesByRole({
        pageNumber: 1,
        pageSize: max,
      })

      if (response.succeeded) {
        setCourses(response.data || [])
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load your schedule",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast({
        title: "Error",
        description: "Failed to load your schedule. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [role])

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  // Filter active courses (not canceled)
  const activeCourses = useMemo(() => {
    return courses.filter((course) => course.status !== "canceled")
  }, [courses])

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "daily") {
      setCurrentView("daily")
    } else if (value === "weekly") {
      setCurrentView("weekly")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">My Class Schedule</h1>

          <Button
            onClick={fetchCourses}
            variant="outline"
            className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
          >
            Refresh Schedule
          </Button>
        </div>

        {/* Schedule Views */}
        <Card className="border border-indigo-100 dark:border-indigo-900 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3">
            <CardTitle className="flex items-center text-lg">
              <Clock className="h-5 w-5 mr-2" />
              My Schedule
            </CardTitle>
          </CardHeader>

          <CardContent className="p-3 dark:bg-gray-700 bg-white">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
                  <p className="text-indigo-600 dark:text-indigo-400">Loading your schedule...</p>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="weekly" className="w-full" onValueChange={handleTabChange}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                  <TabsList className="grid grid-cols-3 w-full max-w-md">
                    <TabsTrigger value="weekly" className="flex items-center text-xs">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Weekly View
                    </TabsTrigger>
                    <TabsTrigger value="daily" className="flex items-center text-xs">
                      <CalendarDays className="h-3.5 w-3.5 mr-1" />
                      Daily View
                    </TabsTrigger>
                    <TabsTrigger value="list" className="flex items-center text-xs">
                      <LayoutList className="h-3.5 w-3.5 mr-1" />
                      List View
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPrevious}
                      className="h-8 px-2 text-gray-700 dark:text-gray-300"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="ml-1 text-xs">
                        {currentView === "daily" ? "Previous Day" : "Previous Week"}
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToToday}
                      className="h-8 px-3 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                    >
                      <span className="text-xs">Today</span>
                    </Button>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                        >
                          <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                          <span className="text-xs">Pick Date</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <DatePicker
                          mode="single"
                          selected={currentDate}
                          onSelect={handleDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNext}
                      className="h-8 px-2 text-gray-700 dark:text-gray-300"
                    >
                      <span className="mr-1 text-xs">{currentView === "daily" ? "Next Day" : "Next Week"}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <TabsContent value="weekly" className="mt-0">
                  <WeeklyTableSchedule
                    courses={activeCourses}
                    currentDate={currentDate}
                    weekNumber={weekNumber}
                    dateRange={formatDateRange(weekRange.startOfWeek, weekRange.endOfWeek)}
                  />
                </TabsContent>

                <TabsContent value="daily" className="mt-0">
                  <DailyTableSchedule courses={activeCourses} currentDate={currentDate} />
                </TabsContent>

                <TabsContent value="list" className="mt-0">
                  {activeCourses.length > 0 ? (
                    <div className="space-y-4">
                      {activeCourses.map((course) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 border border-indigo-100 dark:border-indigo-800 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
                        >
                          <div className="flex flex-col space-y-2">
                            <div className="flex justify-between items-start">
                              <h3 className="text-base font-semibold text-indigo-700 dark:text-indigo-300">
                                {course.courseName}
                              </h3>
                              <div className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                              </div>
                            </div>

                            <div className="text-xs text-gray-600 dark:text-gray-400">Tutor: {course.tutorName}</div>

                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {new Date(course.startDate).toLocaleDateString()} -{" "}
                              {new Date(course.endDate).toLocaleDateString()}
                            </div>

                            {course.schedule && course.schedule.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <div className="text-xs font-medium mb-1">Schedule:</div>
                                <div className="grid grid-cols-1 gap-1">
                                  {course.schedule.map((schedule, idx) => {
                                    const dayOfWeek = [
                                      "Sunday",
                                      "Monday",
                                      "Tuesday",
                                      "Wednesday",
                                      "Thursday",
                                      "Friday",
                                      "Saturday",
                                    ][schedule.dayOfWeek]
                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-center text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 p-1 rounded"
                                      >
                                        <span className="font-medium mr-2">{dayOfWeek}</span>
                                        <Clock className="h-3 w-3 mr-1 text-indigo-500 dark:text-indigo-400" />
                                        <span className="mr-2">
                                          {formatTime(schedule.startHour)} - {formatTime(schedule.endHour)}
                                        </span>
                                        <span className="capitalize flex items-center">
                                          {MODE_ICONS[schedule.mode]}
                                          <span className="ml-1">{schedule.mode}</span>
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow">
                      <BookOpen className="h-12 w-12 mx-auto text-indigo-300 dark:text-indigo-700 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No courses found</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        You are not enrolled in any courses at the moment.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
    </div>
  )
}

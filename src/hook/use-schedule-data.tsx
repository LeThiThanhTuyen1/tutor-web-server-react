"use client"

import { useState, useEffect, useCallback } from "react"
import { getTutorCourseByUserId, getStudentCourseByUserId } from "@/services/courseService"

export function useScheduleData(userRole: any = "student") {
  const [scheduleData, setScheduleData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchScheduleData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch courses based on user role
      const response =
        userRole === "tutor"
          ? await getTutorCourseByUserId({ pageNumber: 1, pageSize: 100 })
          : await getStudentCourseByUserId({ pageNumber: 1, pageSize: 100 })

      if (!response.succeeded) {
        throw new Error(response.message || "Failed to fetch schedule data")
      }

      // Transform course data into schedule events
      const events: any[] = []

      response.data.forEach((course: any) => {
        // Check if course has schedules
        if (course.schedules && Array.isArray(course.schedules)) {
          course.schedules.forEach((schedule: any) => {
            events.push({
              id: `${course.id}-${schedule.id}`,
              courseId: course.id,
              courseName: course.name,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              location: schedule.location || course.location,
              description: course.description,
              tutorName: course.tutorName,
              studentCount: course.studentCount,
              recurring: !!schedule.recurring,
              status: schedule.status || "scheduled",
            })
          })
        }
      })

      setScheduleData(events)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    } finally {
      setIsLoading(false)
    }
  }, [userRole])

  useEffect(() => {
    fetchScheduleData()
  }, [fetchScheduleData])

  return { scheduleData, isLoading, error, refetch: fetchScheduleData }
}


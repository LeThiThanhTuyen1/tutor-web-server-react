"use client";

import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Globe,
  User,
} from "lucide-react";
import { Button } from "@/ui/button";
import React from "react";
import { cn } from "@/ui/cn";
import { CustomTooltip } from "@/ui/custom-tooltip";
import { STATUS_STYLES } from "@/components/courses/course-card";

// Types
interface Schedule {
  id: number;
  tutorId: number;
  courseId: number;
  dayOfWeek: number;
  startHour: string;
  endHour: string;
  mode: string;
  location: string;
  status: string;
}

interface Course {
  id: number;
  courseName: string;
  tutorId: number;
  tutorName: string;
  description: string;
  startDate: string;
  endDate: string;
  fee: number;
  maxStudents: number;
  status: string;
  createdAt: string;
  schedule: Schedule[];
}

// Day of week mapping
const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Mode icons
const MODE_ICONS: Record<string, JSX.Element> = {
  online: <Globe className="h-4 w-4 mr-2 text-indigo-600" />,
  offline: <MapPin className="h-4 w-4 mr-2 text-indigo-600" />,
};

// Format time (e.g., "14:30:00" to "2:30 PM")
const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// Parse time to get hours and minutes
const parseTime = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return { hours, minutes, seconds: seconds || 0 };
};

// Generate time slots for the calendar
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 23; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return slots;
};

// ScheduleEvent component - memoized
const ScheduleEvent = React.memo(
  ({
    schedule,
    course,
  }: {
    schedule: Schedule & { courseId: number };
    course: Course;
    timeSlotIndex: number;
  }) => {
    // Calculate position and height based on start and end times
    const position = useMemo(() => {
      const start = parseTime(schedule.startHour);
      const end = parseTime(schedule.endHour);

      // Calculate top position relative to the current time slot
      const startHour = start.hours;
      const startMinute = start.minutes;
      const endHour = end.hours;
      const endMinute = end.minutes;

      // Calculate offset from the current time slot (in minutes)
      const startOffset = startMinute / 60;

      // Calculate duration in hours
      const durationHours =
        endHour - startHour + (endMinute - startMinute) / 60;

      return {
        top: `${startOffset * 60}px`,
        height: `${durationHours * 60}px`,
        zIndex: 10,
      };
    }, [schedule.startHour, schedule.endHour]);

    // Tooltip content
    const tooltipContent = (
      <div className="space-y-2">
        <div className="font-semibold text-base text-xs">
          {course.courseName}
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-indigo-600" />
            <span className="text-xs">
              {formatTime(schedule.startHour)} - {formatTime(schedule.endHour)}
            </span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-indigo-600" />
            <span className="text-xs">{course.tutorName}</span>
          </div>
          <div className="flex items-center">
            {/* <Globe className="h-4 w-4 mr-2 text-indigo-600" /> */}
            {MODE_ICONS[schedule.mode] || (
              <Globe className="h-4 w-4 mr-2 text-indigo-600" />
            )}
            <span className="capitalize text-sm"> {schedule.mode}</span>
          </div>
          {schedule.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-indigo-600" />
              <span className="text-xs">{schedule.location}</span>
            </div>
          )}
        </div>
      </div>
    );

    return (
      <CustomTooltip content={tooltipContent} side="right" align="start">
        <motion.div
          className={cn(
            "absolute left-0 right-0 mx-1 p-3 rounded-md border shadow-sm cursor-pointer overflow-hidden",
            STATUS_STYLES[schedule.status] || STATUS_STYLES.scheduled
          )}
          style={position}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-sm font-semibold text-center">
            {course.courseName}
          </div>
          <div className="text-xs flex items-center justify-center mt-2">
            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>
              {formatTime(schedule.startHour)} - {formatTime(schedule.endHour)}
            </span>
          </div>
        </motion.div>
      </CustomTooltip>
    );
  }
);
ScheduleEvent.displayName = "ScheduleEvent";

// Main calendar view component
const CalendarView = ({ courses }: { courses: Course[] }) => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Group schedules by day of week and time slot
  const schedulesByDay = useMemo(() => {
    const days: Record<number, Array<Schedule & { courseId: number }>> = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    };

    const courseMap: Record<number, Course> = {};

    courses.forEach((course) => {
      // Skip canceled courses
      if (course.status === "canceled") return;

      courseMap[course.id] = course;

      course.schedule.forEach((schedule) => {
        // Add courseId to schedule for reference
        const scheduleWithCourseId = {
          ...schedule,
          courseId: course.id,
        };

        if (days[schedule.dayOfWeek] !== undefined) {
          days[schedule.dayOfWeek].push(scheduleWithCourseId);
        }
      });
    });

    // Sort schedules by start time
    Object.keys(days).forEach((day) => {
      days[Number(day)].sort((a, b) => {
        return a.startHour.localeCompare(b.startHour);
      });
    });

    return { days, courseMap };
  }, [courses]);

  // Navigate to previous/next week
  const navigateToPreviousWeek = useCallback(() => {
    setCurrentWeek((prev) => prev - 1);
  }, []);

  const navigateToNextWeek = useCallback(() => {
    setCurrentWeek((prev) => prev + 1);
  }, []);

  // Reset to current week
  const resetToCurrentWeek = useCallback(() => {
    setCurrentWeek(0);
  }, []);

  // Get week label
  const weekLabel = useMemo(() => {
    if (currentWeek === 0) return "Current Week";
    if (currentWeek < 0)
      return `${Math.abs(currentWeek)} ${
        Math.abs(currentWeek) === 1 ? "Week" : "Weeks"
      } Ago`;
    return `${currentWeek} ${currentWeek === 1 ? "Week" : "Weeks"} From Now`;
  }, [currentWeek]);

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
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            {weekLabel}
          </span>
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

      {/* Calendar grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-indigo-100 dark:border-indigo-900 overflow-hidden">
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
                  {schedulesByDay.days[dayIndex]
                    .filter((schedule) => {
                      const { hours: scheduleStartHour } = parseTime(
                        schedule.startHour
                      );
                      const { hours: slotHour } = parseTime(slot);
                      return scheduleStartHour === slotHour;
                    })
                    .map((schedule) => (
                      <ScheduleEvent
                        key={schedule.id}
                        schedule={schedule}
                        course={schedulesByDay.courseMap[schedule.courseId]}
                        timeSlotIndex={slotIndex}
                      />
                    ))}
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No scheduled classes
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You don't have any scheduled classes for this week.
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(CalendarView);

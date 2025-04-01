/* eslint-disable @typescript-eslint/no-unused-vars */
// Replace the entire file with a simplified calendar implementation that doesn't use date-fns

"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/components/layout/cn";
import { Button } from "@/ui/button";

export interface CalendarProps {
  mode?: "single" | "range" | "multiple";
  selected?: Date | Date[] | undefined;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  initialFocus?: boolean;
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  disabled,
  className,
  initialFocus = false,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  // Parse YYYY-MM-DD to Date
  const parseDate = (dateString: string): Date => {
    return new Date(dateString);
  };

  // Get month name
  const getMonthName = (date: Date): string => {
    return date.toLocaleString("default", { month: "long" });
  };

  // Get year
  const getYear = (date: Date): number => {
    return date.getFullYear();
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  // Check if date is selected
  const isSelected = (date: Date): boolean => {
    if (!selected) return false;

    if (Array.isArray(selected)) {
      return selected.some((d) => formatDate(d) === formatDate(date));
    }

    return formatDate(selected) === formatDate(date);
  };

  // Check if date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return formatDate(today) === formatDate(date);
  };

  // Check if date is disabled
  const isDateDisabled = (date: Date): boolean => {
    return disabled ? disabled(date) : false;
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (onSelect) {
      if (mode === "single") {
        onSelect(date);
      }
    }
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = getYear(currentMonth);
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isDisabled = isDateDisabled(date);

      days.push(
        <Button
          key={day}
          type="button"
          variant={
            isSelected(date) ? "default" : isToday(date) ? "outline" : "ghost"
          }
          className={cn(
            "h-9 w-9 p-0 font-normal",
            isSelected(date) &&
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            isToday(date) &&
              !isSelected(date) &&
              "border border-primary text-primary",
            isDisabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={isDisabled}
          onClick={() => handleDateSelect(date)}
        >
          {day}
        </Button>
      );
    }

    return days;
  };

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prevMonth}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium">
          {getMonthName(currentMonth)} {getYear(currentMonth)}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={nextMonth}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-muted-foreground text-xs">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{generateCalendarDays()}</div>
    </div>
  );
}

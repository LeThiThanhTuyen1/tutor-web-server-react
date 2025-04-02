"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
} from "lucide-react";
import {
  createCourse,
  deleteCourses,
  updateCourse,
} from "@/services/courseService";
import { Link } from "react-router-dom";
import { ToastContainer } from "@/ui/toast";
import {
  createSchedule,
  deleteSchedules,
  updateSchedule,
} from "@/services/scheduleService";

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

// Teaching modes
const TEACHING_MODES = ["online", "offline"];

interface CourseSchedule {
  id?: number;
  courseId?: number;
  dayOfWeek: number;
  startHour: string;
  endHour: string;
  mode: string;
  location: string;
  tutorId: number;
  status: string;
}

interface CourseFormProps {
  isEditing?: boolean;
  courseId?: number;
  initialData?: {
    id?: number;
    courseName: string;
    description: string;
    startDate: string;
    endDate: string;
    fee: number;
    maxStudents: number;
    createdAt: Date;
    schedule: CourseSchedule[];
  };
}

export default function CourseForm({
  isEditing = false,
  initialData,
}: CourseFormProps) {
  const navigate = useNavigate();
  const { toast, toasts, dismiss } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Track schedules to be deleted (only used in edit mode)
  const [schedulesToDelete, setSchedulesToDelete] = useState<number[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    startDate: "",
    endDate: "",
    fee: 0,
    maxStudents: 10,
    status: "coming",
    createdAt: new Date().toISOString(),
    schedule: [] as CourseSchedule[],
  });

  // Initialize form with initial data if editing
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        courseName: initialData.courseName || "",
        description: initialData.description || "",
        startDate: initialData.startDate
          ? new Date(initialData.startDate).toISOString().split("T")[0]
          : "",
        endDate: initialData.endDate
          ? new Date(initialData.endDate).toISOString().split("T")[0]
          : "",
        fee: initialData.fee || 0,
        maxStudents: initialData.maxStudents || 10,
        schedule: initialData.schedule || [],
        createdAt: initialData.createdAt
          ? new Date(initialData.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: "coming",
      });
    }
  }, [isEditing, initialData]);

  // Handle input changes - memoized with useCallback
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error for this field
      if (formErrors[name]) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [formErrors]
  );

  // Handle number input changes - memoized with useCallback
  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const numValue = value === "" ? 0 : Number(value);
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));

      // Clear error for this field
      if (formErrors[name]) {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [formErrors]
  );

  // Add a new schedule item - memoized with useCallback
  const addScheduleItem = useCallback(() => {
    const newSchedule: CourseSchedule = {
      dayOfWeek: 1,
      startHour: "09:00",
      endHour: "10:00",
      mode: "online",
      status: "scheduled",
      tutorId: 0,
      courseId: 0,
      location: "",
    };

    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, newSchedule],
    }));
  }, []);

  // Remove a schedule item - memoized with useCallback
  const removeScheduleItem = useCallback(
    (index: number) => {
      setFormData((prev) => {
        const updatedSchedule = [...prev.schedule];

        // If we're in edit mode and the schedule has an ID, add it to the delete list
        const scheduleToRemove = updatedSchedule[index];
        if (isEditing && scheduleToRemove.id) {
          setSchedulesToDelete((prev) => [...prev, scheduleToRemove.id!]);
        }

        // Remove the schedule from the form data
        return {
          ...prev,
          schedule: updatedSchedule.filter((_, i) => i !== index),
        };
      });
    },
    [isEditing]
  );

  // Update a schedule item - memoized with useCallback
  const updateScheduleItem = useCallback(
    (index: number, field: keyof CourseSchedule, value: string | number) => {
      setFormData((prev) => {
        const updatedSchedule = [...prev.schedule];
        updatedSchedule[index] = {
          ...updatedSchedule[index],
          [field]: value,
        };
        return {
          ...prev,
          schedule: updatedSchedule,
        };
      });
    },
    []
  );

  // Validate form - memoized with useCallback
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!formData.courseName.trim()) {
      errors.courseName = "Course name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      errors.endDate = "End date is required";
    } else if (
      formData.startDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      errors.endDate = "End date must be after start date";
    }

    if (formData.fee <= 0) {
      errors.fee = "Fee must be greater than 0";
    }

    if (formData.maxStudents <= 0) {
      errors.maxStudents = "Maximum students must be greater than 0";
    }

    // Validate each schedule item
    formData.schedule.forEach((item, index) => {
      if (!item.startHour) {
        errors[`schedule[${index}].startHour`] = "Start time is required";
      }
      if (!item.endHour) {
        errors[`schedule[${index}].endHour`] = "End time is required";
      } else if (
        item.startHour &&
        item.endHour &&
        item.startHour >= item.endHour
      ) {
        errors[`schedule[${index}].endHour`] =
          "End time must be after start time";
      }
      if (item.mode === "offline" && !item.location.trim()) {
        errors[`schedule[${index}].location`] =
          "Location is required for offline classes";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Handle form submission - memoized with useCallback
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        toast({
          title: "Validation Error",
          description: "Please fix the errors in the form",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);

      try {
        const formattedData = {
          ...formData,
          fee: formData.fee,
          courseName: formData.courseName,
          maxStudents: formData.maxStudents,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
        };

        const { schedule, ...courseData } = formattedData;
        let courseResponse;
        let courseId;
        let tutorId;

        if (isEditing && initialData?.id) {
          courseResponse = await updateCourse(initialData.id, courseData);
          courseId = initialData.id;

          if (courseResponse.succeeded && courseResponse.data) {
            tutorId = courseResponse.data.tutorId;

            if (schedulesToDelete.length > 0) {
              await deleteSchedules(schedulesToDelete);
            }
          } else {
            throw new Error(
              courseResponse.errors?.join("\n") || "Failed to update course."
            );
          }
        } else {
          courseResponse = await createCourse(courseData);

          if (courseResponse.succeeded && courseResponse.data) {
            courseId = courseResponse.data.id;
            tutorId = courseResponse.data.tutorId;
          } else {
            throw new Error(
              courseResponse.errors?.join("\n") || "Failed to create course."
            );
          }
        }

        const schedulePromises = schedule.map((scheduleItem) => {
          const scheduleData = {
            ...scheduleItem,
            courseId,
            tutorId: Number(tutorId),
          };

          return isEditing && scheduleItem.id
            ? updateSchedule(scheduleItem.id, scheduleData)
            : createSchedule(scheduleData);
        });

        const scheduleResponses = await Promise.all(schedulePromises);
        const scheduleFailed = scheduleResponses.some((res) => !res.succeeded);

        if (scheduleFailed) {
          if (!isEditing) await deleteCourses([Number(courseId)]);

          toast({
            title: "Error",
            description: "Failed to save schedule(s).",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: isEditing
              ? "Course updated successfully"
              : "Course created successfully",
            variant: "success",
          });

          setTimeout(() => {
            navigate("/tutor/courses");
          }, 1000);
        }
      } catch (error) {
        console.error("Error saving course:", error);

        // Kiểm tra lỗi với TypeScript
        let errorMessage = "An unexpected error occurred.";

        if (error instanceof Error) {
          // Nếu error là một Error object hợp lệ
          errorMessage = error.message;
        } else if (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as any).response.data === "object"
        ) {
          // Lấy lỗi từ response của Axios
          const responseData = (error as any).response.data;
          if (responseData.errors && Array.isArray(responseData.errors)) {
            errorMessage = responseData.errors.join("\n");
          } else {
            errorMessage = responseData.message || errorMessage;
          }
        }

        // Hiển thị toast với lỗi cụ thể
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      validateForm,
      isEditing,
      initialData,
      schedulesToDelete,
      toast,
      navigate,
    ]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          asChild
          className="mb-6 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
        >
          <Link to="/tutor/courses" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>

        <Card className="border border-indigo-100 dark:border-indigo-900 overflow-hidden bg-white dark:bg-gray-800">
          <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-indigo-950 dark:text-indigo-50">
              {isEditing ? "Edit Course" : "Create New Course"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Name */}
              <div className="space-y-2">
                <Label htmlFor="courseName" className="text-base">
                  Course Name
                </Label>
                <Input
                  id="courseName"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  className={formErrors.courseName ? "border-red-500" : ""}
                  placeholder="Enter course name"
                />
                {formErrors.courseName && (
                  <p className="text-sm text-red-500">
                    {formErrors.courseName}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={formErrors.description ? "border-red-500" : ""}
                  placeholder="Enter course description"
                  rows={4}
                />
                {formErrors.description && (
                  <p className="text-sm text-red-500">
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Dates and Fee */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="startDate"
                    className="text-base flex items-center"
                  >
                    <Calendar className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={formErrors.startDate ? "border-red-500" : ""}
                  />
                  {formErrors.startDate && (
                    <p className="text-sm text-red-500">
                      {formErrors.startDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="endDate"
                    className="text-base flex items-center"
                  >
                    <Calendar className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={formErrors.endDate ? "border-red-500" : ""}
                  />
                  {formErrors.endDate && (
                    <p className="text-sm text-red-500">{formErrors.endDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fee" className="text-base flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                    Fee ($)
                  </Label>
                  <Input
                    id="fee"
                    name="fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.fee}
                    onChange={handleNumberChange}
                    className={formErrors.fee ? "border-red-500" : ""}
                  />
                  {formErrors.fee && (
                    <p className="text-sm text-red-500">{formErrors.fee}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="maxStudents"
                    className="text-base flex items-center"
                  >
                    <Users className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                    Maximum Students
                  </Label>
                  <Input
                    id="maxStudents"
                    name="maxStudents"
                    type="number"
                    min="1"
                    value={formData.maxStudents}
                    onChange={handleNumberChange}
                    className={formErrors.maxStudents ? "border-red-500" : ""}
                  />
                  {formErrors.maxStudents && (
                    <p className="text-sm text-red-500">
                      {formErrors.maxStudents}
                    </p>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                    Schedule
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addScheduleItem}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Schedule
                  </Button>
                </div>

                {formErrors.schedule && (
                  <p className="text-sm text-red-500">{formErrors.schedule}</p>
                )}

                {formData.schedule.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <Clock className="h-12 w-12 mx-auto mb-2 text-indigo-300 dark:text-indigo-700" />
                    <p>
                      No schedule items added yet. Click "Add Schedule" to add
                      class times.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.schedule.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">
                            Schedule #{index + 1}{" "}
                            {item.id ? `(ID: ${item.id})` : "(New)"}
                          </h4>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeScheduleItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`day-${index}`}>Day of Week</Label>
                            <Select
                              value={item.dayOfWeek.toString()}
                              onValueChange={(value) =>
                                updateScheduleItem(
                                  index,
                                  "dayOfWeek",
                                  Number.parseInt(value)
                                )
                              }
                            >
                              <SelectTrigger id={`day-${index}`}>
                                <SelectValue placeholder="Select day" />
                              </SelectTrigger>
                              <SelectContent>
                                {DAYS_OF_WEEK.map((day, i) => (
                                  <SelectItem key={i} value={i.toString()}>
                                    {day}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`mode-${index}`}>
                              Teaching Mode
                            </Label>
                            <Select
                              value={item.mode}
                              onValueChange={(value) =>
                                updateScheduleItem(index, "mode", value)
                              }
                            >
                              <SelectTrigger id={`mode-${index}`}>
                                <SelectValue placeholder="Select mode" />
                              </SelectTrigger>
                              <SelectContent>
                                {TEACHING_MODES.map((mode) => (
                                  <SelectItem key={mode} value={mode}>
                                    {mode.charAt(0).toUpperCase() +
                                      mode.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`start-${index}`}>Start Time</Label>
                            <Input
                              id={`start-${index}`}
                              type="time"
                              value={item.startHour}
                              onChange={(e) =>
                                updateScheduleItem(
                                  index,
                                  "startHour",
                                  e.target.value
                                )
                              }
                              className={
                                formErrors[`schedule[${index}].startHour`]
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {formErrors[`schedule[${index}].startHour`] && (
                              <p className="text-sm text-red-500">
                                {formErrors[`schedule[${index}].startHour`]}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`end-${index}`}>End Time</Label>
                            <Input
                              id={`end-${index}`}
                              type="time"
                              value={item.endHour}
                              onChange={(e) =>
                                updateScheduleItem(
                                  index,
                                  "endHour",
                                  e.target.value
                                )
                              }
                              className={
                                formErrors[`schedule[${index}].endHour`]
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {formErrors[`schedule[${index}].endHour`] && (
                              <p className="text-sm text-red-500">
                                {formErrors[`schedule[${index}].endHour`]}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor={`location-${index}`}>
                              Location {item.mode !== "offline" && "(Optional)"}
                            </Label>
                            <Input
                              id={`location-${index}`}
                              value={item.location}
                              onChange={(e) =>
                                updateScheduleItem(
                                  index,
                                  "location",
                                  e.target.value
                                )
                              }
                              placeholder={
                                item.mode === "online"
                                  ? "e.g., Zoom link (optional)"
                                  : "Enter physical location"
                              }
                              className={
                                formErrors[`schedule[${index}].location`]
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {formErrors[`schedule[${index}].location`] && (
                              <p className="text-sm text-red-500">
                                {formErrors[`schedule[${index}].location`]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? "Update Course" : "Create Course"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
    </div>
  );
}

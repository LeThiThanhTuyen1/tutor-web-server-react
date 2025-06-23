import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hook/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import {
  createCourse,
  deleteCourses,
  updateCourse,
} from "@/services/courseService";
import { ToastContainer } from "@/components/ui/toast";
import {
  createSchedule,
  deleteSchedules,
  updateSchedule,
} from "@/services/scheduleService";

// Day of week mapping
const DAYS_OF_WEEK = [
  "Chủ nhật",
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
];

// Teaching modes
const TEACHING_MODES = ["trực tuyến", "trực tiếp"];

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
    subject: string;
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
    subject: "",
    startDate: "",
    endDate: "",
    fee: 0,
    maxStudents: 10,
    status: "ongoing",
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
        subject: initialData.subject || "",
        endDate: initialData.endDate
          ? new Date(initialData.endDate).toISOString().split("T")[0]
          : "",
        fee: initialData.fee || 0,
        maxStudents: initialData.maxStudents || 10,
        schedule:
          initialData.schedule.map((schedule) => ({
            ...schedule,
            mode: schedule.mode === "online" ? "online" : "offline",
          })) || [],
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
      errors.courseName = "Tên khóa học là bắt buộc";
    }

    if (!formData.subject.trim()) {
      errors.subject = "Môn học là bắt buộc";
    }

    if (!formData.description.trim()) {
      errors.description = "Mô tả là bắt buộc";
    }

    if (!formData.startDate) {
      errors.startDate = "Ngày bắt đầu là bắt buộc";
    } else if (!isEditing && new Date(formData.startDate) < new Date()) {
      errors.startDate = "Ngày bắt đầu phải ở tương lai";
    }

    if (!formData.endDate) {
      errors.endDate = "Ngày kết thúc là bắt buộc";
    } else if (
      formData.startDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      errors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    if (formData.fee <= 0) {
      errors.fee = "Học phí phải lớn hơn 0";
    }

    if (formData.maxStudents <= 0) {
      errors.maxStudents = "Số học viên tối đa phải lớn hơn 0";
    }

    // Validate each schedule item
    formData.schedule.forEach((item, index) => {
      if (!item.startHour) {
        errors[`schedule[${index}].startHour`] = "Giờ bắt đầu là bắt buộc";
      }
      if (!item.endHour) {
        errors[`schedule[${index}].endHour`] = "Giờ kết thúc là bắt buộc";
      } else if (
        item.startHour &&
        item.endHour &&
        item.startHour >= item.endHour
      ) {
        errors[`schedule[${index}].endHour`] =
          "Giờ kết thúc phải sau giờ bắt đầu";
      }
      if (item.mode === "trực tiếp" && !item.location.trim()) {
        errors[`schedule[${index}].location`] =
          "Địa điểm là bắt buộc cho lớp học trực tiếp";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, isEditing]);

  // Trong CourseForm.tsx
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        toast({
          title: "Lỗi xác thực",
          description: "Vui lòng sửa các lỗi trong biểu mẫu",
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
          subject: formData.subject,
          maxStudents: formData.maxStudents,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          schedule: formData.schedule.map((schedule) => ({
            ...schedule,
            mode: schedule.mode === "trực tuyến" ? "online" : "offline",
          })),
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
              courseResponse.errors?.join("\n") ||
                "Không thể cập nhật khóa học."
            );
          }
        } else {
          courseResponse = await createCourse(courseData);

          if (courseResponse.succeeded && courseResponse.data) {
            courseId = courseResponse.data.id;
            tutorId = courseResponse.data.tutorId;
          } else {
            throw new Error(
              courseResponse.errors?.join("\n") || "Không thể tạo khóa học."
            );
          }
        }

        try {
          const schedulePromises = schedule.map(async (scheduleItem) => {
            const scheduleData = {
              ...scheduleItem,
              courseId,
              tutorId: Number(tutorId),
            };

            return isEditing && scheduleItem.id
              ? await updateSchedule(scheduleItem.id, scheduleData)
              : await createSchedule(scheduleData);
          });

          const scheduleResponses = await Promise.all(schedulePromises);
          const scheduleFailed = scheduleResponses.some(
            (res) => !res.succeeded
          );

          if (scheduleFailed) {
            toast({
              title: "Lỗi lịch học",
              description: "Xung đột lịch học",
              variant: "destructive",
            });

            if (!isEditing) {
              await deleteCourses([Number(courseId)]);
            }

            return;
          } else {
            toast({
              title: "Thành công",
              description: isEditing
                ? "Khóa học đã được cập nhật thành công"
                : "Khóa học đã được tạo thành công",
              variant: "success",
            });
            setTimeout(() => {
              navigate("/tutor/courses");
            }, 1500);
          }
        } catch (error) {
          console.error("Lỗi khi lưu lịch học:", error);
          toast({
            title: "Lỗi",
            description: "Đã xảy ra lỗi không mong muốn.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Lỗi khi lưu khóa học:", error);

        let errorMessage = "Đã xảy ra lỗi không mong muốn.";

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as any).response.data === "object"
        ) {
          const responseData = (error as any).response.data;
          if (responseData.errors && Array.isArray(responseData.errors)) {
            errorMessage = responseData.errors.join("\n");
          } else {
            errorMessage = responseData.message || errorMessage;
          }
        }

        toast({
          title: "Lỗi",
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
        {/* <Button
          variant="ghost"
          asChild
          className="mb-6 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
          aria-label="Quay lại các khóa học"
        >
          <Link to="/tutor/courses" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Quay lại các khóa học
          </Link>
        </Button> */}

        <Card className="border border-indigo-100 dark:border-indigo-900 overflow-hidden bg-white dark:bg-gray-800">
          <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-indigo-950 dark:text-indigo-50">
              {isEditing ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Name */}
              <div className="space-y-2">
                <Label htmlFor="courseName" className="text-base">
                  Tên khóa học
                </Label>
                <Input
                  id="courseName"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  className={formErrors.courseName ? "border-red-500" : ""}
                  placeholder="Nhập tên khóa học"
                  aria-label="Tên khóa học"
                />
                {formErrors.courseName && (
                  <p className="text-sm text-red-500">
                    {formErrors.courseName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-base">
                  Môn học
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={formErrors.subject ? "border-red-500" : ""}
                  placeholder="Nhập tên môn học"
                  aria-label="Môn học"
                />
                {formErrors.subject && (
                  <p className="text-sm text-red-500">{formErrors.subject}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={formErrors.description ? "border-red-500" : ""}
                  placeholder="Nhập mô tả khóa học"
                  rows={4}
                  aria-label="Mô tả khóa học"
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
                    <Calendar
                      className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400"
                      aria-hidden="true"
                    />
                    Ngày bắt đầu
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={formErrors.startDate ? "border-red-500" : ""}
                    aria-label="Ngày bắt đầu"
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
                    <Calendar
                      className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400"
                      aria-hidden="true"
                    />
                    Ngày kết thúc
                  </Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={formErrors.endDate ? "border-red-500" : ""}
                    aria-label="Ngày kết thúc"
                  />
                  {formErrors.endDate && (
                    <p className="text-sm text-red-500">{formErrors.endDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fee" className="text-base flex items-center">
                    <DollarSign
                      className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400"
                      aria-hidden="true"
                    />
                    Học phí ($)
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
                    aria-label="Học phí"
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
                    <Users
                      className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400"
                      aria-hidden="true"
                    />
                    Số học viên tối đa
                  </Label>
                  <Input
                    id="maxStudents"
                    name="maxStudents"
                    type="number"
                    min="1"
                    value={formData.maxStudents}
                    onChange={handleNumberChange}
                    className={formErrors.maxStudents ? "border-red-500" : ""}
                    aria-label="Số học viên tối đa"
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
                    <Clock
                      className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400"
                      aria-hidden="true"
                    />
                    Lịch học
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addScheduleItem}
                    className="flex items-center"
                    aria-label="Thêm lịch học"
                  >
                    <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                    Thêm lịch học
                  </Button>
                </div>

                {formErrors.schedule && (
                  <p className="text-sm text-red-500">{formErrors.schedule}</p>
                )}

                {formData.schedule.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <Clock
                      className="h-12 w-12 mx-auto mb-2 text-indigo-300 dark:text-indigo-700"
                      aria-hidden="true"
                    />
                    <p>
                      Chưa có lịch học nào được thêm. Nhấn "Thêm lịch học" để
                      thêm thời gian học.
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
                            Lịch học #{index + 1}{" "}
                            {item.id ? `(ID: ${item.id})` : "(Mới)"}
                          </h4>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeScheduleItem(index)}
                            aria-label="Xóa lịch học"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`day-${index}`}>
                              Ngày trong tuần
                            </Label>
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
                              <SelectTrigger
                                id={`day-${index}`}
                                aria-label="Chọn ngày trong tuần"
                              >
                                {item.dayOfWeek != null &&
                                item.dayOfWeek >= 0 &&
                                item.dayOfWeek <= 6
                                  ? DAYS_OF_WEEK[item.dayOfWeek]
                                  : "Chọn ngày"}
                                <SelectValue placeholder="Chọn ngày" />
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
                              Hình thức giảng dạy
                            </Label>
                            <Select
                              value={item.mode}
                              onValueChange={(value) =>
                                updateScheduleItem(index, "mode", value)
                              }
                            >
                              <SelectTrigger
                                id={`mode-${index}`}
                                aria-label="Chọn hình thức giảng dạy"
                              >
                                <SelectValue placeholder="Chọn hình thức" />
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
                            <Label htmlFor={`start-${index}`}>
                              Giờ bắt đầu
                            </Label>
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
                              aria-label="Giờ bắt đầu"
                            />
                            {formErrors[`schedule[${index}].startHour`] && (
                              <p className="text-sm text-red-500">
                                {formErrors[`schedule[${index}].startHour`]}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`end-${index}`}>Giờ kết thúc</Label>
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
                              aria-label="Giờ kết thúc"
                            />
                            {formErrors[`schedule[${index}].endHour`] && (
                              <p className="text-sm text-red-500">
                                {formErrors[`schedule[${index}].endHour`]}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor={`location-${index}`}>
                              Địa điểm{" "}
                              {item.mode !== "trực tiếp" && "(Tùy chọn)"}
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
                                item.mode === "trực tuyến"
                                  ? "VD: Link Zoom (tùy chọn)"
                                  : "Nhập địa điểm thực tế"
                              }
                              className={
                                formErrors[`schedule[${index}].location`]
                                  ? "border-red-500"
                                  : ""
                              }
                              aria-label="Địa điểm"
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
                  aria-label={isEditing ? "Cập nhật khóa học" : "Tạo khóa học"}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
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
                      {isEditing ? "Đang cập nhật..." : "Đang tạo..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                      {isEditing ? "Cập nhật khóa học" : "Tạo khóa học"}
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

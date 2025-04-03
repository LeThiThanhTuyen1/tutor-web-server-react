"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, DollarSign, User, ExternalLink, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/ui/button";
import { cn } from "../../ui/cn";
import { Badge } from "@/ui/badge.tsx";
import { cancelCourse } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";
import { CancelCourseModal } from "@/ui/modals/cancel-course";
import { ToastContainer } from "@/ui/toast";
import { STATUS_STYLES } from "./course-card";
import { ContractModal } from "@/ui/modals/contract-modal";
import { useAuth } from "@/hooks/use-auth";

interface CourseListItemProps {
  course: any;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  isTutor: boolean;
  onCourseUpdated?: () => void;
  handleEnrollCourse: () => Promise<void>;
  isEnrolling: boolean;
}

function CourseListItemComponent({
  course,
  isSelected,
  isTutor,
  onCourseUpdated,
  handleEnrollCourse,
  isEnrolling,
}: CourseListItemProps) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { toast, toasts, dismiss } = useToast();
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const { user } = useAuth();

  const handleCancelCourse = async () => {
    try {
      setIsCancelling(true);
      const response = await cancelCourse(course.id);
      console.log(response);
      if (response.succeeded) {
        toast({
          title: "Success",
          description: "Course has been cancelled successfully",
          variant: "success",
        });

        // Refresh the course list
        if (onCourseUpdated) {
          onCourseUpdated();
        }
      } else {
        toast({
          title: "Error",
          description: "Course is coming!",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
      setIsCancelDialogOpen(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ x: 5, transition: { duration: 0.2 } }}
        className="rounded-lg border border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-200 hover:shadow-md"
        layout
      >
        <div
          className={cn(
            "h-1 bg-gradient-to-r from-indigo-600 to-purple-600",
            isSelected && "h-2"
          )}
        ></div>

        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left section with course info */}
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-indigo-950 dark:text-indigo-50">
                      {course.courseName}
                    </h3>

                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium",
                        STATUS_STYLES[course.status] ||
                          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      )}
                    >
                      {course.status.charAt(0).toUpperCase() +
                        course.status.slice(1)}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <User className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                      <span>Tutor: {course.tutorName}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                      <span>
                        {new Date(course.startDate).toLocaleDateString()} -{" "}
                        {new Date(course.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                      <span>Fee: ${course.fee}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                      <span>Max Students: {course.maxStudents}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right section with actions */}
            <div className="flex flex-row md:flex-col gap-2 justify-end md:min-w-[140px]">
              <Button
                variant="default"
                size="sm"
                className="flex-1 md:w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
              >
                <Link
                  to={`/courses/${course.id}`}
                  className="flex items-center w-full justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </Button>
              {!isTutor && (
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 md:w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                  onClick={() => setIsContractDialogOpen(true)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Enroll Now
                </Button>
              )}
              {!isTutor && (
                <ContractModal
                  isOpen={isContractDialogOpen}
                  onClose={() => setIsContractDialogOpen(false)}
                  onConfirm={handleEnrollCourse}
                  isProcessing={isEnrolling}
                  courseTitle={course.courseName}
                  tutorName={course.tutorName}
                  studentName={user?.name || "Student"}
                  fee={course.fee}
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cancel Course Confirmation Modal */}
      <CancelCourseModal
        isOpen={isCancelDialogOpen}
        onCancel={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelCourse}
        isCancelling={isCancelling}
      />

      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
    </>
  );
}

// Use memo to prevent unnecessary re-renders
const CourseListItem = memo(CourseListItemComponent);

export default CourseListItem;

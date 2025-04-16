"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, DollarSign, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card.tsx";
import { cn } from "@/ui/cn.ts";
import { Badge } from "@/ui/badge.tsx";
import { useAuth } from "@/hook/use-auth.tsx";
import { useToast } from "@/hook/use-toast.tsx";
import { ToastContainer } from "@/ui/toast.tsx";
import { enrollCourse } from "@/services/enrollmentService.tsx";
import { ContractModal } from "@/ui/modals/contract-modal.tsx";

interface CourseCardProps {
  course: any;
  isTutor: boolean;
  isAdmin: boolean;
}

export const STATUS_STYLES: Record<string, string> = {
  ongoing:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  canceled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  coming:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

function CourseCardComponent({ course, isTutor, isAdmin }: CourseCardProps) {
  const { isAuthenticated, user } = useAuth();
  const { toast, toasts, dismiss } = useToast();
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [hasSignedContract, setHasSignedContract] = useState(false);

  const handleEnrollCourse = async () => {
    if (!course.id) return;

    try {
      setIsEnrolling(true);
      const response = await enrollCourse(Number(course.id));

      if (response.succeeded) {
        toast({
          title: "Enroll course successful.",
          description: "You Enrolled the course successfully",
          variant: "success",
        });
        setHasSignedContract(true);
        setIsContractDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: response.message || "Cannot Enroll",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="h-full"
        layout
      >
        <Card
          className={cn(
            "flex flex-col h-full overflow-hidden transition-all duration-200 hover:shadow-md border-indigo-100 dark:border-indigo-900 min-h-[400px]" // Added min-h
          )}
        >
          <div className="h-1 bg-gradient-to-r from-indigo-600 to-blue-600"></div>

          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-indigo-950 dark:text-indigo-50 line-clamp-1">
                  {course.courseName || "Untitled Course"}
                </CardTitle>
              </div>
            </div>

            <div className="flex items-center mt-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-medium",
                  STATUS_STYLES[course.status?.toLowerCase()] ||
                    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                )}
              >
                {(course.status
                  ? course.status.charAt(0).toUpperCase() +
                    course.status.slice(1)
                  : "Unknown") || "Unknown"}
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                ID: {course.id || "N/A"}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2 flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 min-h-[40px]">
              {course.description || "No description available."}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <User className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                <span>Tutor: {course.tutorName || "N/A"}</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                <span>
                  {course.startDate
                    ? new Date(course.startDate).toLocaleDateString()
                    : "N/A"}{" "}
                  -{" "}
                  {course.endDate
                    ? new Date(course.endDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <DollarSign className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                <span>Fee: ${course.fee ? course.fee.toFixed(2) : "N/A"}</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                <span>
                  Created:{" "}
                  {course.createdAt
                    ? new Date(course.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
            >
              <Link
                to={`/courses/${course.id || ""}`}
                className="flex items-center w-full justify-center"
              >
                View
              </Link>
            </Button>
            {!isTutor &&
              !isAdmin &&
              course.status !== "completed" &&
              course.status !== "canceled" && (
                <Button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast({
                        title: "Error",
                        description: "You must be logged in to enroll.",
                        variant: "destructive",
                      });
                      return;
                    }
                    setIsContractDialogOpen(true);
                  }}
                  disabled={isEnrolling || hasSignedContract}
                >
                  {isEnrolling
                    ? "Enrolling..."
                    : hasSignedContract
                    ? "Enrolled"
                    : "Enroll"}
                </Button>
              )}
          </CardFooter>
        </Card>
      </motion.div>
      {!isTutor && (
        <ContractModal
          isOpen={isContractDialogOpen}
          onClose={() => setIsContractDialogOpen(false)}
          onConfirm={handleEnrollCourse}
          isProcessing={isEnrolling}
          courseTitle={course.courseName || "Untitled Course"}
          tutorName={course.tutorName || "N/A"}
          studentName={user?.name || "Student"}
          fee={course.fee || 0}
        />
      )}
      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
    </>
  );
}

const CourseCard = memo(CourseCardComponent);

export default CourseCard;

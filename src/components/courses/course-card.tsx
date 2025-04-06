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
import { useAuth } from "@/hooks/use-auth.tsx";
import { useToast } from "@/hooks/use-toast.tsx";
import { ToastContainer } from "@/ui/toast.tsx";
import { enrollCourse } from "@/services/enrollmentService.tsx";
import { ContractModal } from "@/ui/modals/contract-modal.tsx";

interface CourseCardProps {
  course: any;
  isTutor: boolean;
}

// Status styles - moved outside component to prevent recreation on each render
export const STATUS_STYLES: Record<string, string> = {
  ongoing:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  canceled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  coming:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};

function CourseCardComponent({ course, isTutor }: CourseCardProps) {
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

        // Refresh the course details
        // getCourseById(Number(id));
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
            "h-full overflow-hidden transition-all duration-200 hover:shadow-md border-indigo-100 dark:border-indigo-900"
          )}
        >
          <div className="h-1 bg-gradient-to-r from-indigo-600 to-blue-600"></div>

          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-indigo-950 dark:text-indigo-50 line-clamp-1">
                  {course.courseName}
                </CardTitle>
              </div>
            </div>

            <div className="flex items-center mt-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-medium",
                  STATUS_STYLES[course.status] ||
                    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                )}
              >
                {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                ID: {course.id}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
              {course.description}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <User className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                <span>Tutor: {course.tutorName}</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                <span>
                  {new Date(course.startDate).toLocaleDateString()} -{" "}
                  {new Date(course.endDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <DollarSign className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                <span>Fee: ${course.fee}</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
                <span>
                  Created: {new Date(course.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
            <>
              <Button
                variant="default"
                size="sm"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
              >
                <Link
                  to={`/courses/${course.id}`}
                  className="flex items-center w-full justify-center"
                >
                  View
                </Link>
              </Button>
              {!isTutor && (
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90 h-12 text-base"
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
            </>
          </CardFooter>
        </Card>
      </motion.div>
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
      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
    </>
  );
}

// Use memo to prevent unnecessary re-renders
const CourseCard = memo(CourseCardComponent);

export default CourseCard;

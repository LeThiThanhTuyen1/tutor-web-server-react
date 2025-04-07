"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Users,
  Clock,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { useToast } from "@/hook/use-toast";
import { useAuth } from "@/hook/use-auth";
import { ContractModal } from "@/ui/modals/contract-modal";
import { useCourse } from "@/hook/use-course";
import { ToastContainer } from "@/ui/toast";
import { enrollCourse } from "@/services/enrollmentService";

export default function EnrollmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast, toasts, dismiss } = useToast();
  const { user } = useAuth();
  const { currentCourse, loading, getCourseById } = useCourse();

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      getCourseById(Number(id));
    }
  }, [id]);

  const handleEnrollClick = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in this course",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsContractModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsContractModalOpen(false);
  };

  const handleConfirmEnrollment = async () => {
    if (!user || !currentCourse) return;

    try {
      setIsProcessing(true);

      const response = await enrollCourse(currentCourse.id);

      if (response.succeeded) {
        setEnrollmentSuccess(true);
        setIsContractModalOpen(false);

        toast({
          title: "Enrollment Successful",
          description: "You have successfully enrolled in this course",
          variant: "success",
        });
      } else {
        toast({
          title: "Enrollment Failed",
          description: response.message || "Failed to enroll in this course",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-8 w-32" />
          </div>
          <Card className="border border-indigo-100 dark:border-indigo-900 mb-6">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 md:p-6">
        <div className="max-w-3xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold text-indigo-950 dark:text-indigo-50 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-no hover:bg-no mb-6 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <Button
          onClick={() => navigate(-1)}
          className="bg-no hover:bg-no mb-6 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-2xl font-bold text-indigo-950 dark:text-indigo-50">
            Enroll in Course
          </h1>

          <Card className="border border-indigo-100 dark:border-indigo-900 overflow-hidden bg-white dark:bg-gray-800">
            <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-indigo-950 dark:text-indigo-50">
                {currentCourse.courseName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {currentCourse.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <User className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Tutor:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {currentCourse.tutorName}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Duration:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(currentCourse.startDate).toLocaleDateString()} -{" "}
                      {new Date(currentCourse.endDate).toLocaleDateString()}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <DollarSign className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Fee:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ${currentCourse.fee}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Users className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Enrollment:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {currentCourse.enrolledStudents || 0}/
                      {currentCourse.maxStudents}
                    </span>
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span>
                    Created:{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(currentCourse.createdAt).toLocaleDateString()}
                    </span>
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Enrollment Summary
                </h3>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>Course Fee</span>
                    <span className="font-medium">${currentCourse.fee}</span>
                  </div>
                  <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-semibold">
                    <span>Total</span>
                    <span>${currentCourse.fee}</span>
                  </div>
                </div>

                <Button
                  onClick={handleEnrollClick}
                  disabled={enrollmentSuccess}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                >
                  {enrollmentSuccess ? "Enrolled" : "Enroll Now"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contract Modal */}
        <ContractModal
          isOpen={isContractModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmEnrollment}
          isProcessing={isProcessing}
          courseTitle={currentCourse.courseName}
          tutorName={currentCourse.tutorName}
          studentName={user?.name || "Student"}
          fee={currentCourse.fee}
        />

        <ToastContainer
          toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
          dismiss={dismiss}
        />
      </div>
    </div>
  );
}

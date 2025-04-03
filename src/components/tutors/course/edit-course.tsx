"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "@/services/courseService";
import { Skeleton } from "@/ui/skeleton";
import CourseForm from "./course-form";
import { useAuth } from "@/hooks/use-auth";

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth()
  const navigate = useNavigate();

  // Check if user is a tutor
  const isTutor = user?.role === "Tutor";

  useEffect(() => {
    async function fetchCourse() {
      if (!id) return;

      try {
        setLoading(true);
        const courseData = await getCourseById(Number(id));
        setCourse(courseData);
        setError(null);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (isTutor) {
      fetchCourse();
    } else {
      setError("Only tutors can edit courses");
      setLoading(false);
    }
  }, [id, user?.id, isTutor, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-40 w-full" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Error Loading Course</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return <CourseForm isEditing courseId={Number(id)} initialData={course} />;
}

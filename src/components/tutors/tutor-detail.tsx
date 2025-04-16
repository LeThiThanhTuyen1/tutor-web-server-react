"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Globe,
  BookOpen,
  Award,
  User,
  Pen,
} from "lucide-react";
import { API_BASE_URL } from "@/config/axiosInstance";
import { Link, useParams } from "react-router-dom";
import { getTutorById } from "@/services/tutorService";
import { getTutorFeedbacks } from "@/services/feedbackService";
import TutorReviews from "./tutor-feedback";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { cn } from "@/ui/cn";
import { STATUS_STYLES } from "../courses/course-card";
import { useRating } from "@/context/rating-context";

export default function TutorProfile() {
  const { id } = useParams();
  const [tutor, setTutor] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("about");
  const tutorId = Number(id);
  const { tutorRatings, tutorFeedbackCounts, refreshRating } = useRating();

  // Optimize the fetchTutorAndFeedback method to prioritize UI rendering
  const fetchTutorAndFeedback = async () => {
    try {
      setLoading(true);

      // First fetch tutor data to show the profile quickly
      const tutorResponse = await getTutorById(tutorId);
      setTutor(tutorResponse.data);
      setCourses(tutorResponse.data.courses || []);

      // Then fetch feedback data
      const feedbackResponse = await getTutorFeedbacks(tutorId);
      setFeedbacks(feedbackResponse.data || []);

      // Update rating in context (can happen after UI is shown)
      refreshRating(tutorId);
    } catch (err) {
      setError(
        "Failed to load tutor profile or feedback. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTutorAndFeedback();
    }
  }, [id]);

  const handleFeedbackChange = async () => {
    // Refresh data when feedback changes
    await fetchTutorAndFeedback();
  };

  // Get rating from context if available, otherwise use local state
  const displayRating =
    tutorRatings[tutorId] !== undefined
      ? tutorRatings[tutorId]
      : tutor?.rating || 0;

  const displayFeedbackCount =
    tutorFeedbackCounts[tutorId] !== undefined
      ? tutorFeedbackCounts[tutorId]
      : feedbacks.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <Link
            to="/tutors"
            className="mt-6 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tutors
          </Link>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tutor Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The tutor you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/tutors"
            className="mt-6 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tutors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/tutors"
        className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tutors
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative"></div>

        <div className="px-6 py-4 sm:px-8 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-20 mb-6">
            <div className="relative">
              <img
                src={
                  tutor?.profileImage
                    ? `${API_BASE_URL}/${
                        tutor.profileImage
                      }?t=${new Date().getTime()}`
                    : "/placeholder.svg?height=120&width=120"
                }
                alt={tutor.tutorName}
                className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-white"
              />
            </div>

            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">{tutor.tutorName}</h1>
                <div className="flex items-center mt-2 sm:mt-0">
                  <div className="flex items-center mr-4">
                    <Star className="h-5 w-5 text-yellow-500 fill-current mr-1" />
                    <span className="font-medium">
                      {displayRating.toFixed(1)}
                    </span>
                    <span className="text-gray-500 ml-1">
                      ({displayFeedbackCount}{" "}
                      {displayFeedbackCount === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    ${tutor.feeRange?.minFee || 0} - $
                    {tutor.feeRange?.maxFee || 0}/hr
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 mt-2">
                {tutor.location && (
                  <div className="flex items-center mr-4 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{tutor.location}</span>
                  </div>
                )}
                <div className="flex items-center mr-4 mb-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{tutor.experience || 0} years experience</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("about")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "about"
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Reviews ({displayFeedbackCount})
              </button>
              <button
                onClick={() => setActiveTab("courses")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "courses"
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Courses
              </button>
            </nav>
          </div>

          {activeTab === "about" && (
            <div>
              {tutor.subjects && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Subjects
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects
                      .split(",")
                      .map((subject: string) => subject.trim())
                      .map((subject: string, index: number) => {
                        const colors = [
                          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
                          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                          "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
                          "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
                        ];
                        const colorClass = colors[index % colors.length];
                        return (
                          <span
                            key={subject}
                            className={`px-3 py-1 rounded-full text-sm ${colorClass}`}
                          >
                            {subject}
                          </span>
                        );
                      })}
                  </div>
                </div>
              )}

              {tutor.teachingModes && tutor.teachingModes.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3 flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Teaching Mode
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {tutor.teachingModes.map((mode: any, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                      >
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  About
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {tutor.introduction || "No introduction provided."}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Education
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium">
                    {tutor.school || "Not specified"}
                  </h3>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setActiveTab("reviews")}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90 transition-colors flex items-center"
                >
                  <Pen className="h-5 w-5 mr-2" />
                  Review Tutor
                </Button>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <TutorReviews onFeedbackChange={handleFeedbackChange} />
            </div>
          )}

          {activeTab === "courses" && (
            <div>
              {courses.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">
                    No courses available at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course: any) => (
                    <div
                      key={course.id}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <h3 className="text-lg font-medium">
                          {course.courseName}
                        </h3>
                        <div className="flex items-center gap-4">
                          <span className="px-2 py-1 text-xs rounded-full text-indigo-800 dark:text-indigo-300">
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
                          </span>
                          {course.startDate && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(course.startDate).toLocaleDateString()}
                            </span>
                          )}
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                            ${course.fee}
                          </span>
                          <Link
                            to={`/courses/${course.id}`}
                            className="inline-flex items-center px-2 pt-1 pl-3 pb-1 pr-3 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

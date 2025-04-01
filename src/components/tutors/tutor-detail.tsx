"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function TutorProfile() {
  const { id } = useParams();
  const [tutor, setTutor] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("about");
  const tutorId = Number(id);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        const response = await getTutorById(tutorId);
        setTutor(response.data);
      } catch (err) {
        setError("Failed to load tutor profile. Please try again later.");
      }
    };

    const fetchFeedback = async () => {
      try {
        const response = await getTutorFeedbacks(tutorId);
        setFeedbacks(response.data || []);
      } catch (err) {
        console.error("Error fetching feedback:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTutor();
      fetchFeedback();
    }
  }, [id]);

  const { totalRatings, averageRating } = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    feedbacks.forEach((feedback) => {
      const rating = Math.round(feedback.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[rating as keyof typeof distribution]++;
      }
    });

    const total = feedbacks.length;
    const average =
      total > 0
        ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / total
        : 0;

    return {
      ratingDistribution: distribution,
      totalRatings: total,
      averageRating: average,
    };
  }, [feedbacks]);

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
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative"></div>

        <div className="px-6 py-4 sm:px-8 sm:py-6">
          {/* Profile Image and Basic Info */}
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
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-gray-500 ml-1">
                      ({totalRatings}{" "}
                      {totalRatings === 1 ? "review" : "reviews"})
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

          {/* Navigation Tabs */}
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
                Reviews ({totalRatings})
              </button>
            </nav>
          </div>

          {activeTab === "about" && (
            <div>
              {/* Subjects */}
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

              {/* Teaching Modes */}
              {tutor.teachingModes && tutor.teachingModes.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3 flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Teaching Mode
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {tutor.teachingModes.map((mode: any, index: number) => {
                      return (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                        >
                          {mode}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* About */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  About
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {tutor.introduction || "No introduction provided."}
                </p>
              </div>

              {/* Education */}
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

              {/* Contact */}
              <div className="flex justify-center mt-8">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90 transition-colors flex items-center">
                  <Pen className="h-5 w-5 mr-2" />
                  <Link to={`/studen`} />
                  Review Tutor
                </button>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <TutorReviews />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
import TutorReviews from "./tutor-feedback";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/cn";
import { STATUS_STYLES } from "../../courses/course-card";
import { useRating } from "@/context/rating-context";
import { getTutorFeedbacks } from "@/services/feedbackService";

const STATUS_TRANSLATIONS: { [key: string]: string } = {
  active: "Đang hoạt động",
  inactive: "Ngừng hoạt động",
  pending: "Đang chờ duyệt",
  completed: "Đã hoàn thành",
  canceled: "Đã hủy",
  coming: "Sắp diễn ra",
};

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

  const fetchTutorAndFeedback = async () => {
    try {
      setLoading(true);

      const tutorResponse = await getTutorById(tutorId);
      setTutor(tutorResponse.data);
      setCourses(tutorResponse.data.courses || []);

      try {
        const feedbackResponse = await getTutorFeedbacks(tutorId);
        setFeedbacks(feedbackResponse.data || []);
      } catch (feedbackErr: any) {
        if (feedbackErr.response?.status === 404) {
          setFeedbacks([]);
        } else {
          throw feedbackErr;
        }
      }

      refreshRating(tutorId);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải thông tin gia sư. Vui lòng thử lại.");
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
    await fetchTutorAndFeedback();
  };

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
          <h2 className="text-2xl font-bold text-red-500 mb-4">Lỗi</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <Link
            to="/tutors"
            className="mt-6 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Trở về
          </Link>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy gia sư</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gia sư bạn tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            to="/tutors"
            className="mt-6 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Trở về
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Nút trở về */}
      <Link
        to="/tutors"
        className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Trở về
      </Link>

      {/* Hồ sơ gia sư */}
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
                      ({displayFeedbackCount} đánh giá)
                    </span>
                  </div>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {tutor.feeRange?.minFee.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }) || 0}{" "}
                    -{" "}
                    {tutor.feeRange?.maxFee.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }) || 0}
                    /giờ
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
                  <span>{tutor.experience || 0} năm kinh nghiệm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thanh điều hướng tab */}
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
                Thông tin gia sư
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Đánh giá ({displayFeedbackCount})
              </button>
              <button
                onClick={() => setActiveTab("courses")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "courses"
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Khóa học
              </button>
            </nav>
          </div>

          {/* Tab Thông tin gia sư */}
          {activeTab === "about" && (
            <div>
              {tutor.subjects && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    Môn học
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
                    Hình thức dạy học
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {tutor.teachingModes.map((mode: string, index: number) => {
                      let label = "";
                      switch (mode.toLowerCase()) {
                        case "online":
                          label = "Trực tuyến";
                          break;
                        case "offline":
                          label = "Trực tiếp";
                          break;
                        default:
                          label = mode; 
                      }

                      return (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Giới thiệu
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {tutor.introduction || "Chưa cung cấp giới thiệu."}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Trình độ học vấn
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium">
                    {tutor.school || "Chưa cung cấp thông tin trường học"}
                  </h3>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setActiveTab("reviews")}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90 transition-colors flex items-center"
                >
                  <Pen className="h-5 w-5 mr-2" />
                  Đánh giá gia sư
                </Button>
              </div>
            </div>
          )}

          {/* Tab Đánh giá */}
          {activeTab === "reviews" && (
            <div>
              <TutorReviews onFeedbackChange={handleFeedbackChange} />
            </div>
          )}

          {/* Tab Khóa học */}
          {activeTab === "courses" && (
            <div>
              {courses.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">
                    Chưa có khóa học nào vào lúc này.
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
                              {STATUS_TRANSLATIONS[course.status] ||
                                course.status}
                            </Badge>
                          </span>
                          {course.startDate && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(course.startDate).toLocaleDateString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          )}
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                            {course.fee.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                          <Link
                            to={`/courses/${course.id}`}
                            className="inline-flex items-center px-2 pt-1 pl-3 pb-1 pr-3 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            Xem
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

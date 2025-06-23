import { Star, MapPin, Globe, Clock } from "lucide-react";
import { API_BASE_URL } from "@/config/axiosInstance";
import { Link } from "react-router-dom";
import type React from "react";

interface TutorCardProps {
  tutor: any;
  tutorRating: number;
  userImage?: string;
}

const TutorCard: React.FC<TutorCardProps> = ({
  tutor,
  tutorRating,
  userImage,
}) => {
  const imageUrl = userImage || tutor.profileImage;
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <img
        src={
          imageUrl
            ? `${API_BASE_URL}/${imageUrl}?t=${new Date().getTime()}`
            : "/placeholder.svg?height=96&width=96"
        }
        alt={tutor.tutorName}
        className="h-24 w-24 rounded-full object-cover self-center md:self-start"
      />

      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
          <h3 className="text-xl font-semibold">{tutor.tutorName}</h3>
          <div className="flex items-center mt-2 md:mt-0">
            <div className="flex items-center mr-4">
              <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
              <span className="font-medium">{tutorRating.toFixed(1)}</span>
            </div>
            <span className="font-bold text-blue-500">
              {tutor.feeRange?.minFee || 0} - {tutor.feeRange?.maxFee || 0} đồng
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 mb-3 gap-y-1">
          {tutor.location && (
            <div className="flex items-center mr-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{tutor.location}</span>
            </div>
          )}
          {tutor.teachingMode && (
            <div className="flex items-center mr-4">
              <Globe className="h-4 w-4 mr-1" />
              <span>{tutor.teachingMode}</span>
            </div>
          )}
          <div className="flex items-center mr-4">
            <Clock className="h-4 w-4 mr-1" />
            <span>{tutor.experience || 0} năm kinh nghiệm</span>
          </div>
        </div>

        {tutor.subjects && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tutor.subjects
              .split(",")
              .map((subject: string) => subject.trim())
              .map((subject: string, index: number) => {
                const colors = [
                  "bg-red-100 text-red-800",
                  "bg-green-100 text-green-800",
                  "bg-blue-100 text-blue-800",
                  "bg-yellow-100 text-yellow-800",
                  "bg-purple-100 text-purple-800",
                  "bg-pink-100 text-pink-800",
                  "bg-orange-100 text-orange-800",
                  "bg-teal-100 text-teal-800",
                ];
                const colorClass = colors[index % colors.length];
                return (
                  <span
                    key={subject}
                    className={`px-2 py-1 text-sm rounded-md ${colorClass}`}
                  >
                    {subject}
                  </span>
                );
              })}
          </div>
        )}

        {tutor.teachingModes && tutor.teachingModes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            Hình thức giảng dạy:{" "}
            {tutor.teachingModes.map((mode: any, index: number) => {
              let displayMode = mode;
              if (mode === "offline") displayMode = "trực tiếp";
              else if (mode === "online") displayMode = "trực tuyến";

              const isLastItem = index === tutor.teachingModes.length - 1;
              return (
                <span key={index} className="text-gray-700 dark:text-gray-300">
                  {displayMode}
                  {!isLastItem && tutor.teachingModes.length > 1 && ", "}
                </span>
              );
            })}
          </div>
        )}

        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
          {tutor.introduction || "Không có giới thiệu."}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-0">
            {tutor.school && (
              <span className="text-sm">
                <span className="font-medium">Trường:</span> {tutor.school}
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <Link
              to={`/tutor/${tutor.id}`}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Xem hồ sơ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;

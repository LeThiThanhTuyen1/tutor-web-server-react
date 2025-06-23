import { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { API_BASE_URL } from "@/config/axiosInstance";
import { useParams } from "react-router-dom";
import {
  addFeedback,
  deleteFeedback,
  getFeedbackByUser,
  getTutorFeedbacks,
  updateFeedback,
} from "@/services/feedbackService";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hook/use-auth";
import { ToastContainer } from "@/components/ui/toast";
import { useToast } from "@/hook/use-toast";
import type React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/ui/modals/delete-confirm";
import { useRating } from "@/context/rating-context";
import { format } from "date-fns";
import { vi } from "date-fns/locale"; // Import Vietnamese locale

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

interface TutorReviewsProps {
  onFeedbackChange: () => void; // Callback to notify parent of feedback changes
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onRatingChange,
  size = "md",
  interactive = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingClick = (value: number) => {
    if (onRatingChange && interactive) onRatingChange(value);
  };

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`${sizeClasses[size]} ${
            (hoverRating || rating) >= value
              ? "text-yellow-500 fill-current"
              : "text-gray-300 dark:text-gray-600"
          } ${
            interactive
              ? "cursor-pointer transition-transform hover:scale-110"
              : ""
          }`}
          onClick={() => handleRatingClick(value)}
          onMouseEnter={() => interactive && setHoverRating(value)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      ))}
    </div>
  );
};

export default function TutorReviews({ onFeedbackChange }: TutorReviewsProps) {
  const { id } = useParams();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [userFeedback, setUserFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const { toast, toasts, dismiss } = useToast();
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);
  const tutorId = Number(id);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { user } = useAuth();
  const isStudent = useMemo(() => user?.role === "Student", [user?.role]);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const { refreshRating } = useRating();

  const fetchData = async () => {
    setLoading(true);
    let userFeedbackData = null;
    let allFeedbacksData: any[] = [];

    try {
      const allResponse = await getTutorFeedbacks(tutorId);
      allFeedbacksData = allResponse.data || [];
    } catch (err) {
      console.error("Lỗi khi lấy đánh giá gia sư:", err);
    }

    if (isStudent && user?.id) {
      try {
        const userResponse = await getFeedbackByUser(tutorId);
        userFeedbackData = userResponse.data;
      } catch (err) {
        console.error("Lỗi khi lấy đánh giá của người dùng:", err);
        setShowFeedbackForm(true); // Hiển thị form nếu chưa có đánh giá
      }
    }

    setUserFeedback(userFeedbackData);
    const otherFeedbacks = userFeedbackData
      ? allFeedbacksData.filter((f: any) => f.id !== userFeedbackData.id)
      : allFeedbacksData;
    setFeedbacks(otherFeedbacks);

    if (isStudent && !userFeedbackData) {
      setShowFeedbackForm(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (id && user) {
      fetchData();
    }
  }, [id, user]);

  const { ratingDistribution, totalRatings, averageRating } = useMemo(() => {
    const allFeedbacks = userFeedback
      ? [userFeedback, ...feedbacks]
      : feedbacks;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    allFeedbacks.forEach((feedback) => {
      const rating = Math.round(feedback.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[rating as keyof typeof distribution]++;
      }
    });

    const total = allFeedbacks.length;
    const average =
      total > 0
        ? allFeedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) /
          total
        : 0;

    return {
      ratingDistribution: distribution,
      totalRatings: total,
      averageRating: average,
    };
  }, [feedbacks, userFeedback]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMMM yyyy", { locale: vi }); // Use Vietnamese locale
    } catch (error) {
      return "Không xác định";
    }
  };

  const handleEditClick = () => {
    if (userFeedback) {
      setEditRating(userFeedback.rating);
      setEditComment(userFeedback.comment || "");
      setIsEditing(true);
      setTimeout(() => commentRef.current?.focus(), 0);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (editRating === 0 || editComment.trim() === "") {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin!",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateFeedback(userFeedback.id, editRating, editComment);
      const updatedFeedback = {
        ...userFeedback,
        rating: editRating,
        comment: editComment,
        updatedAt: new Date().toISOString(),
      };
      setUserFeedback(updatedFeedback);
      setIsEditing(false);

      // Cập nhật dữ liệu đánh giá trong context
      await refreshRating(tutorId);

      // Thông báo cho component cha
      onFeedbackChange();

      toast({
        title: "Thành công",
        description: "Đánh giá của bạn đã được cập nhật.",
        variant: "success",
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật đánh giá:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật đánh giá.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteFeedback(userFeedback.id);
      setUserFeedback(null);
      setShowFeedbackForm(true);

      // Cập nhật dữ liệu đánh giá trong context
      await refreshRating(tutorId);

      // Thông báo cho component cha
      onFeedbackChange();

      toast({
        title: "Thành công",
        description: "Đã xóa đánh giá thành công.",
        variant: "success",
      });
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newRating === 0 || newComment.trim() === "") {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ thông tin!",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await addFeedback(tutorId, newRating, newComment);
      const newFeedback = {
        id: response.id,
        tutorId,
        studentId: user?.id,
        studentName: user?.name,
        studentImg: user?.profileImage,
        rating: newRating,
        comment: newComment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUserFeedback(newFeedback);
      setShowFeedbackForm(false);
      setNewRating(0);
      setNewComment("");

      // Cập nhật dữ liệu đánh giá trong context
      await refreshRating(tutorId);

      // Thông báo cho component cha
      onFeedbackChange();

      toast({
        title: "Thành công",
        description: "Đánh giá của bạn đã được gửi.",
        variant: "success",
      });

      fetchData(); // Làm mới danh sách đánh giá
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const toggleShowAllFeedbacks = () => {
    setShowAllFeedbacks(!showAllFeedbacks);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold">{averageRating.toFixed(1)}</h3>
            <div className="flex items-center mt-1">
              <RatingStars rating={Math.round(averageRating)} />
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {totalRatings} {totalRatings === 1 ? "đánh giá" : "đánh giá"}
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-md">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                ratingDistribution[rating as keyof typeof ratingDistribution];
              const percentage =
                totalRatings > 0 ? (count / totalRatings) * 100 : 0;
              return (
                <div key={rating} className="flex items-center mb-1">
                  <div className="flex items-center w-12">
                    <span className="text-sm font-medium mr-2">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isStudent && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">
            {userFeedback ? "Đánh giá của bạn" : "Viết đánh giá"}
          </h3>

          <AnimatePresence mode="wait">
            {userFeedback && !isEditing ? (
              <motion.div
                key="user-review"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900 rounded-lg p-4"
              >
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Hành động</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleEditClick}>
                        <Edit className="h-4 w-4 mr-2" />
                        Sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleDeleteClick}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3 overflow-hidden">
                    <img
                      className="h-full w-full object-cover"
                      src={
                        userFeedback.studentImg
                          ? `${API_BASE_URL}/${userFeedback.studentImg}`
                          : "/placeholder.svg?height=40&width=40"
                      }
                      alt={userFeedback.studentName}
                    />
                  </div>
                  <div className="flex-1 pr-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="font-medium">
                        {userFeedback.studentName}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(
                          userFeedback.updatedAt || userFeedback.createdAt
                        )}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 mb-2">
                      <RatingStars rating={userFeedback.rating} />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {userFeedback.comment}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : isEditing ? (
              <motion.div
                key="edit-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Chỉnh sửa đánh giá</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancelEdit}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mb-4">
                  <label className="block font-medium mb-1">Điểm đánh giá</label>
                  <div className="flex items-center">
                    <RatingStars
                      rating={editRating}
                      onRatingChange={setEditRating}
                      size="lg"
                      interactive={true}
                    />
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {editRating}/5
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block font-medium mb-1">Bình luận</label>
                  <textarea
                    ref={commentRef}
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-indigo-200 dark:border-indigo-800 rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="border-indigo-200 dark:border-indigo-800"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </motion.div>
            ) : showFeedbackForm ? (
              <motion.div
                key="new-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900 rounded-lg p-4"
              >
                <form onSubmit={handleSubmitFeedback}>
                  <div className="mb-4">
                    <label className="block font-medium mb-1">Điểm đánh giá</label>
                    <div className="flex items-center">
                      <RatingStars
                        rating={newRating}
                        onRatingChange={setNewRating}
                        size="lg"
                        interactive={true}
                      />
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {newRating > 0 ? `${newRating}/5` : "Chọn điểm"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block font-medium mb-1">Bình luận</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={4}
                      placeholder="Chia sẻ trải nghiệm của bạn với gia sư này..."
                      className="w-full p-2 border border-indigo-200 dark:border-indigo-800 rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
                  >
                    Gửi đánh giá
                  </Button>
                </form>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-3">
          {feedbacks.length > 0 ? "Đánh giá của học viên" : "Chưa có đánh giá"}
        </h3>

        {feedbacks.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {feedbacks
                .slice(0, showAllFeedbacks ? undefined : 3)
                .map((feedback, index) => (
                  <motion.div
                    key={feedback.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900 rounded-lg p-4"
                  >
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3 overflow-hidden">
                        <img
                          className="h-full w-full object-cover"
                          src={
                            feedback?.studentImg
                              ? `${API_BASE_URL}/${feedback?.studentImg}`
                              : "/placeholder.svg?height=40&width=40"
                          }
                          alt={feedback.studentName || "Học viên"}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <h4 className="font-medium">
                            {feedback.studentName || "Học viên ẩn danh"}
                          </h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(
                              feedback.updatedAt || feedback.createdAt
                            )}
                          </span>
                        </div>
                        <div className="flex items-center mt-1 mb-2">
                          <RatingStars rating={feedback.rating} />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {feedback.comment || "Không có bình luận."}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>

            {feedbacks.length > 3 && (
              <Button
                variant="outline"
                onClick={toggleShowAllFeedbacks}
                className="w-full mt-4 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
              >
                {showAllFeedbacks ? (
                  <>
                    Thu gọn <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Xem thêm ({feedbacks.length - 3}){" "}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Chưa có đánh giá</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {userFeedback
                ? "Bạn là người đầu tiên đánh giá gia sư này!"
                : "Gia sư này chưa nhận được đánh giá nào."}
            </p>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        count={1}
      />

      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
    </>
  );
}
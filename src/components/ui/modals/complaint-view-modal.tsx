import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modals/modal";
import { FileText, AlertTriangle, Clock, CheckCircle, X } from "lucide-react";
import { Complaint } from "@/services/complaintService";
import { ScrollArea } from "../scroll-area";

interface ComplaintViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
  isProcessing: boolean;
  onProcessComplaint: (action: "approve" | "reject") => void;
}

export function ComplaintViewModal({
  isOpen,
  onClose,
  complaint,
  isProcessing,
  onProcessComplaint,
}: ComplaintViewModalProps) {
  if (!complaint) return null;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-500">Đang xử lý</Badge>
        );
      case "canceled":
        return (
          <Badge className="bg-red-500 hover:bg-red-500">
            Đã hủy/Đã từ chối
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-500">Đã được chấp nhận</Badge>
        );
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-500">Đã bị từ chối</Badge>;
      case "completed":
        return (
          <Badge className="bg-gray-400 hover:bg-gray-500">Đã hoàn thành</Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const footer = (
    <div className="flex justify-between items-center">
      <div>
        {complaint.status === "pending" ? (
          <span className="text-yellow-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Đang xử lý
          </span>
        ) : complaint.status === "approved" ? (
          <span className="text-green-500 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Đã được chấp nhận
          </span>
        ) : complaint.status === "rejected" ? (
          <span className="text-red-500 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Đã bị từ chối
          </span>
        ) : null}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose} disabled={isProcessing}>
          Đóng
        </Button>
        {complaint.status === "pending" && (
          <>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => onProcessComplaint("reject")}
              disabled={isProcessing}
            >
              <X className="h-4 w-4 mr-2" />
              {isProcessing ? "Đang xử lý..." : "Từ chối"}
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onProcessComplaint("approve")}
              disabled={isProcessing}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isProcessing ? "Đang xử lý..." : "Chấp nhận"}
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Chi tiết khiếu nại #${complaint.id}`}
      footer={footer}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        <ScrollArea>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Gửi vào ngày {new Date(complaint.createdAt).toLocaleString()}
              </p>
            </div>
            {getStatusBadge(complaint.status)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Người gửi</h4>
              <p className="font-medium">
                {complaint.user?.name || `Người dùng #${complaint.userId}`}
              </p>
              {complaint.user?.email && (
                <p className="text-sm text-gray-500">{complaint.user.email}</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Hợp đồng liên quan
              </h4>
              <p className="font-medium">
                {complaint.contract?.courseName ||
                  `Hợp đồng #${complaint.contractId}`}
              </p>
              {complaint.contract && (
                <p className="text-sm text-gray-500">
                  {complaint.contract.tutorName} (Gia sư) |{" "}
                  {complaint.contract.studentName} (Học viên)
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Mô tả khiếu nại</h4>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-4 max-h-[200px] overflow-y-auto">
              <p className="whitespace-pre-line">{complaint.description}</p>
            </div>
          </div>

          {complaint.contract && (
            <div>
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                  <h4 className="font-medium">Thông tin hợp đồng liên quan</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 rounded-md p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Khóa học</p>
                    <p>{complaint.contract.courseName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                    {getStatusBadge(complaint.contract.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Học phí</p>
                    <p>{complaint.contract.fee.toLocaleString()} VNĐ</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Thời gian học</p>
                    <p>
                      {new Date(complaint.contract.startDate).toLocaleDateString()} - {new Date(complaint.contract.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Điều khoản và Điều kiện:</h4>
                <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                  <p>1. <span className="font-medium">Đăng ký:</span> Học viên (Bên B) đăng ký tham gia khóa học do Gia sư (Bên A) cung cấp.</p>
                  <p>2. <span className="font-medium">Thanh toán:</span> Học viên đồng ý thanh toán học phí theo thông tin đã nêu. Thanh toán phải thực hiện đúng lịch trình.</p>
                  <p>3. <span className="font-medium">Điểm danh:</span> Học viên phải tham gia đầy đủ các buổi học. Việc vắng mặt không miễn trừ trách nhiệm thanh toán.</p>
                  <p>4. <span className="font-medium">Hủy bỏ:</span> Học viên có thể hủy đăng ký trong vòng 48 giờ sau khi ký hợp đồng để được hoàn tiền toàn bộ. Sau thời gian này, chính sách hoàn tiền sẽ được áp dụng.</p>
                  <p>5. <span className="font-medium">Tài liệu khóa học:</span> Tài liệu chỉ dành cho cá nhân học viên, không được sao chép hay phân phối lại.</p>
                  <p>6. <span className="font-medium">Hành vi:</span> Học viên cần giữ thái độ học tập nghiêm túc. Gia sư có quyền chấm dứt hợp đồng nếu học viên có hành vi gây rối, và không hoàn trả học phí.</p>
                  <p>7. <span className="font-medium">Trách nhiệm pháp lý:</span> Gia sư không chịu trách nhiệm về các sự cố xảy ra trong quá trình học, trừ trường hợp cố ý hoặc do lỗi nghiêm trọng.</p>
                  <p>8. <span className="font-medium">Sửa đổi hợp đồng:</span> Mọi sửa đổi phải được lập thành văn bản và đồng ý bởi cả hai bên.</p>
                  <p>9. <span className="font-medium">Luật áp dụng:</span> Hợp đồng này chịu sự điều chỉnh bởi pháp luật Việt Nam.</p>
                  <p>10. <span className="font-medium">Toàn bộ thỏa thuận:</span> Tài liệu này là toàn bộ thỏa thuận giữa hai bên về khóa học.</p>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </Modal>
  );
}

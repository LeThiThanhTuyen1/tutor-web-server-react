import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Modal } from "@/components/ui/modals/modal";
import { motion } from "framer-motion";

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  courseTitle: string;
  tutorName: string;
  studentName: string;
  fee: number;
}

export function ContractModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  courseTitle,
  tutorName,
  studentName,
  fee,
}: ContractModalProps) {
  const [isAgreed, setIsAgreed] = useState(false);

  const handleAgreementChange = (checked: boolean) => {
    setIsAgreed(checked);
  };

  // Reset state when modal closes
  const handleClose = () => {
    setIsAgreed(false);
    onClose();
  };

  const currentDate = new Date().toLocaleDateString();

  const footer = (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
        Hủy
      </Button>
      <Button
        onClick={onConfirm}
        disabled={!isAgreed || isProcessing}
        className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600/90 dark:hover:bg-indigo-700/90"
      >
        {isProcessing ? (
          <>
            <motion.div className="h-4 w-4 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin mr-2" />
            Đang xử lý...
          </>
        ) : (
          "Xác nhận Đăng Ký"
        )}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Hợp Đồng Đăng Ký Khóa Học"
      footer={footer}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {courseTitle}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ngày Hợp Đồng: {currentDate}
          </p>
        </div>

        <ScrollArea maxHeight="max-h-[400px]" className="pr-2">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Các Bên Liên Quan:</h4>
              <p className="text-sm mb-1">
                <span className="font-semibold">Bên A (Gia Sư):</span>{" "}
                {tutorName}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Bên B (Học Viên):</span>{" "}
                {studentName}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Học Phí:</h4>
              <p className="text-sm">{fee.toFixed(2)} VNĐ</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Điều Khoản và Điều Kiện:</h4>
              <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <p>
                  1. <span className="font-medium">Đăng ký:</span> Bằng cách
                  đồng ý với hợp đồng này, Học viên (Bên B) đăng ký tham gia
                  khóa học do Gia sư (Bên A) cung cấp.
                </p>
                <p>
                  2. <span className="font-medium">Thanh Toán:</span> Học viên
                  đồng ý thanh toán học phí như đã ghi trên hợp đồng. Thanh toán
                  phải thực hiện theo lịch trình thanh toán đã cung cấp.
                </p>
                <p>
                  3. <span className="font-medium">Tham Gia Lớp Học:</span> Học
                  viên cần tham gia đầy đủ các buổi học đã được lên lịch. Sự vắng
                  mặt không làm miễn trừ nghĩa vụ thanh toán của học viên.
                </p>
                <p>
                  4. <span className="font-medium">Hủy Đăng Ký:</span> Học viên
                  có thể hủy đăng ký trong vòng 48 giờ kể từ khi ký hợp đồng để
                  nhận lại 100% học phí. Sau thời gian này, việc hoàn tiền sẽ
                  tuân theo chính sách hủy.
                </p>
                <p>
                  5. <span className="font-medium">Tài Liệu Khóa Học:</span> Tất
                  cả tài liệu khóa học được cung cấp bởi Gia sư chỉ dành cho
                  việc sử dụng cá nhân của Học viên và không được phép sao chép
                  hoặc phân phối.
                </p>
                <p>
                  6. <span className="font-medium">Hành Vi:</span> Học viên đồng
                  ý duy trì hành vi thích hợp trong các buổi học. Gia sư có quyền
                  hủy bỏ đăng ký nếu có hành vi gây mất trật tự mà không hoàn tiền.
                </p>
                <p>
                  7. <span className="font-medium">Trách Nhiệm:</span> Gia sư
                  không chịu trách nhiệm đối với bất kỳ thiệt hại hoặc thương tích
                  nào có thể xảy ra trong quá trình khóa học, ngoại trừ trường
                  hợp sơ suất nghiêm trọng.
                </p>
                <p>
                  8. <span className="font-medium">Sửa Đổi:</span> Mọi sửa đổi
                  đối với hợp đồng này phải được thực hiện bằng văn bản và được
                  cả hai bên đồng ý.
                </p>
                <p>
                  9. <span className="font-medium">Pháp Luật Áp Dụng:</span> Hợp
                  đồng này chịu sự điều chỉnh của pháp luật của quốc gia/khu vực
                  nơi khóa học được tổ chức.
                </p>
                <p>
                  10. <span className="font-medium">Toàn Bộ Hợp Đồng:</span>{" "}
                  Tài liệu này là toàn bộ hợp đồng giữa các bên liên quan đến
                  việc đăng ký khóa học.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="pt-4 flex items-start gap-2">
          <Checkbox
            id="agreement"
            checked={isAgreed}
            onCheckedChange={handleAgreementChange}
            className="border-gray-800 mt-1 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
          />
          <label
            htmlFor="agreement"
            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            Tôi đã đọc và đồng ý với các điều khoản và điều kiện của hợp đồng
            đăng ký này.
          </label>
        </div>
      </div>
    </Modal>
  );
}

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Modal } from "@/components/ui/modals/modal";

interface ContractViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: {
    courseName: string;
    tutorName: string;
    studentName: string;
    fee: number;
    startDate: string;
    endDate: string;
    terms: string;
    status: string;
  } | null;
}

export function ContractViewModal({
  isOpen,
  onClose,
  contract,
}: ContractViewModalProps) {
  if (!contract) return null;

  const footer = (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onClose}>
        Đóng
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết hợp đồng"
      footer={footer}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {contract.courseName}
          </h3>
          {/* <p className="text-sm text-gray-600 dark:text-gray-400">
            Trạng thái: {contract.status}
          </p> */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ngày bắt đầu: {new Date(contract.startDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ngày kết thúc: {new Date(contract.endDate).toLocaleDateString()}
          </p>
        </div>

        <ScrollArea maxHeight="max-h-[400px]" className="pr-2">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Các bên tham gia:</h4>
              <p className="text-sm mb-1">
                <span className="font-semibold">Giảng viên:</span> {contract.tutorName}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Học viên:</span> {contract.studentName}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Học phí:</h4>
              <p className="text-sm">${contract.fee.toFixed(2)}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Điều khoản và điều kiện:</h4>
              <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <div>
                  <h4 className="font-medium mb-2">Điều khoản và điều kiện:</h4>
                  <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                    <p>
                      1. <span className="font-medium">Đăng ký:</span> Bằng cách đồng ý với hợp đồng này, Học viên (Bên B) đăng ký tham gia khóa học do Giảng viên (Bên A) cung cấp.
                    </p>
                    <p>
                      2. <span className="font-medium">Thanh toán:</span> Học viên đồng ý thanh toán học phí như đã chỉ định. Việc thanh toán phải tuân theo lịch trình thanh toán được cung cấp.
                    </p>
                    <p>
                      3. <span className="font-medium">Tham gia học:</span> Học viên phải tham gia tất cả các lớp học theo lịch. Việc vắng mặt không miễn trừ học viên khỏi nghĩa vụ thanh toán.
                    </p>
                    <p>
                      4. <span className="font-medium">Hủy bỏ:</span> Học viên có thể hủy đăng ký trong vòng 48 giờ kể từ khi ký hợp đồng để được hoàn lại tiền đầy đủ. Sau thời gian này, việc hoàn tiền sẽ tuân theo chính sách hủy bỏ.
                    </p>
                    <p>
                      5. <span className="font-medium">Tài liệu khóa học:</span> Tất cả tài liệu khóa học do Giảng viên cung cấp chỉ dành cho Học viên sử dụng cá nhân và không được sao chép hoặc phân phối.
                    </p>
                    <p>
                      6. <span className="font-medium">Hành vi:</span> Học viên đồng ý duy trì hành vi thích hợp trong các lớp học. Giảng viên có quyền chấm dứt đăng ký do hành vi gây rối mà không hoàn lại tiền.
                    </p>
                    <p>
                      7. <span className="font-medium">Trách nhiệm pháp lý:</span> Giảng viên không chịu trách nhiệm đối với bất kỳ thiệt hại hoặc thương tích nào có thể xảy ra trong suốt khóa học, ngoại trừ trong các trường hợp sơ suất nghiêm trọng.
                    </p>
                    <p>
                      8. <span className="font-medium">Sửa đổi:</span> Mọi sửa đổi đối với hợp đồng này phải được thực hiện bằng văn bản và phải được cả hai bên đồng ý.
                    </p>
                    <p>
                      9. <span className="font-medium">Luật áp dụng:</span> Hợp đồng này được điều chỉnh bởi các luật của quốc gia/tỉnh nơi khóa học được cung cấp.
                    </p>
                    <p>
                      10. <span className="font-medium">Toàn bộ hợp đồng:</span> Tài liệu này cấu thành toàn bộ hợp đồng giữa các bên liên quan đến việc đăng ký khóa học.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </Modal>
  );
}

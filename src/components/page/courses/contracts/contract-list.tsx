import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Eye, FileWarning } from "lucide-react";
import { getContractsByUserId } from "@/services/contractService";
import { createComplaint } from "@/services/complaintService";
import { useAuth } from "@/hook/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hook/use-toast";
import { ContractViewModal } from "@/components/ui/modals/contract-view-modal";
import { ComplaintDialog } from "@/components/ui/modals/complaint-dialog";
import { ToastContainer } from "@/components/ui/toast";

interface ContractDTO {
  id: number;
  tutorName: string;
  studentName: string;
  courseName: string;
  terms: string;
  fee: number;
  startDate: string;
  endDate?: string;
  status: string;
}

interface PaginationFilter {
  pageNumber: number;
  pageSize: number;
}

export default function ContractList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast, toasts, dismiss } = useToast();
  const [contracts, setContracts] = useState<ContractDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<ContractDTO | null>(
    null
  );
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationFilter>({
    pageNumber: 1,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await getContractsByUserId(
          Number.parseInt(user.id),
          pagination
        );

        if (response.succeeded && response.data) {
          setContracts(response.data);
          setTotalPages(response.totalPages || 1);
        } else {
          toast({
            title: "Lỗi",
            description: response.message || "Không thể tải hợp đồng",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Đã xảy ra lỗi bất ngờ",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [user, pagination]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
            Đang hoạt động
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700">
            Đang chờ
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
            Đã hoàn thành
          </Badge>
        );
      case "canceled":
        return (
          <Badge className="bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700">
            Đã hủy
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewContract = (contract: ContractDTO) => {
    setSelectedContract(contract);
    setIsContractModalOpen(true);
  };

  const handleOpenComplaintDialog = () => {
    setIsContractModalOpen(false);
    setIsComplaintDialogOpen(true);
  };

  const handleSubmitComplaint = async (description: string) => {
    if (!selectedContract) return;

    try {
      setIsSubmittingComplaint(true);
      const response = await createComplaint({
        contractId: selectedContract.id,
        description,
      });

      if (response.succeeded) {
        toast({
          title: "Thành công",
          description: "Khiếu nại của bạn đã được gửi thành công",
          variant: "success",
        });
        setIsComplaintDialogOpen(false);

        setContracts((prevContracts) => {
          if (!Array.isArray(prevContracts)) {
            console.error("Không phải là mảng.");
            return prevContracts; 
          }
        
          if (!selectedContract || !selectedContract.id) {
            console.error("Không tìm thấy hợp đòng được chọn");
            return prevContracts;
          }
        
          return prevContracts.map((contract) =>
            contract.id === selectedContract.id
              ? { ...contract, status: "pending" } 
              : contract
          );
        });

        if (selectedContract) {
          setSelectedContract({ ...selectedContract, status: "pending" });
        }
      } else {
        toast({
          title: "Lỗi",
          description: response.message || "Không thể gửi khiếu nại",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi bất ngờ",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  const canFileComplaint = (status: string) => {
    return ["active", "completed"].includes(status.toLowerCase());
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return dateString
      ? new Date(dateString).toLocaleDateString("vi-VN", options)
      : "Đang tiếp diễn";
  };

  const handlePageChange = (pageNumber: number) => {
    setPagination((prev) => ({ ...prev, pageNumber }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Hợp đồng của tôi</h1>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="w-full border border-gray-200 dark:border-gray-700"
            >
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const filteredContracts = contracts.filter((contract) =>
    contract.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col mb-6 space-y-4">
        <h1 className="text-2xl font-bold">Hợp đồng của tôi</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khóa học..."
            className="w-full p-2 pl-10 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Tìm kiếm hợp đồng theo tên khóa học"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {filteredContracts.length === 0 ? (
        <Card className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
              <FileText className="h-16 w-16 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
              Không tìm thấy hợp đồng
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
              {searchTerm
                ? "Không có hợp đồng nào khớp với tiêu chí tìm kiếm của bạn."
                : "Bạn chưa có hợp đồng nào. Hợp đồng sẽ xuất hiện tại đây khi bạn đăng ký các khóa học."}
            </p>
            <Button
              onClick={() => navigate("/khoa-hoc")}
              className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
            >
              Duyệt các khóa học
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    aria-label="Tên khóa học"
                  >
                    Tên khóa học
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    aria-label={user?.role === "Student" ? "Gia sư" : "Học viên"}
                  >
                    {user?.role === "Student" ? "Gia sư" : "Học viên"}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    aria-label="Phí"
                  >
                    Phí
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    aria-label="Thời gian"
                  >
                    Thời gian
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    aria-label="Trạng thái"
                  >
                    Trạng thái
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    aria-label="Hành động"
                  >
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {filteredContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {contract.courseName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-400">
                        {user?.role === "Student"
                          ? contract.tutorName
                          : contract.studentName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-400">
                        ₫{contract.fee.toLocaleString("vi-VN")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-400">
                        {formatDate(contract.startDate)} -{" "}
                        {formatDate(contract.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(contract.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                          onClick={() => handleViewContract(contract)}
                          aria-label={`Xem hợp đồng ${contract.courseName}`}
                        >
                          <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
                          Xem
                        </Button>
                        {canFileComplaint(contract.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                            onClick={() => {
                              setSelectedContract(contract);
                              setIsComplaintDialogOpen(true);
                            }}
                            aria-label={`Gửi khiếu nại cho hợp đồng ${contract.courseName}`}
                          >
                            <FileWarning className="h-4 w-4 mr-1" aria-hidden="true" />
                            Khiếu nại
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              disabled={pagination.pageNumber === 1}
              onClick={() => handlePageChange(pagination.pageNumber - 1)}
              variant="outline"
              aria-label="Trang trước"
            >
              Trước
            </Button>
            <span>
              Trang {pagination.pageNumber} / {totalPages}
            </span>
            <Button
              disabled={pagination.pageNumber >= totalPages}
              onClick={() => handlePageChange(pagination.pageNumber + 1)}
              variant="outline"
              aria-label="Trang tiếp theo"
            >
              Tiếp
            </Button>
          </div>
        </>
      )}

      {/* Contract View Modal */}
      <ContractViewModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        onFileComplaint={handleOpenComplaintDialog}
        contract={selectedContract}
        canFileComplaint={
          selectedContract ? canFileComplaint(selectedContract.status) : false
        }
      />

      {/* Complaint Dialog */}
      <ComplaintDialog
        isOpen={isComplaintDialogOpen}
        onClose={() => setIsComplaintDialogOpen(false)}
        onSubmit={handleSubmitComplaint}
        isSubmitting={isSubmittingComplaint}
        contractId={selectedContract?.id}
      />

      <ToastContainer
        toasts={toasts.map((toast) => ({ ...toast, onDismiss: dismiss }))}
        dismiss={dismiss}
      />
    </div>
  );
}
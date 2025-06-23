import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// Component hiển thị bảng lịch sử hóa đơn
interface BillHistoryTableProps {
  billHistory: any[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

export default function BillHistoryTable({
  billHistory,
  loading,
  totalPages,
  currentPage,
  onPageChange,
}: BillHistoryTableProps) {
  // Định dạng ngày
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {loading ? (
        <div className="p-4">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : billHistory.length === 0 ? (
        <div className="text-center py-12">
          <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Không tìm thấy lịch sử thanh toán
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Bạn chưa thực hiện thanh toán nào.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khóa học</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Phương thức thanh toán</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billHistory.map((bill: any) => (
                <TableRow key={bill.paymentId}>
                  <TableCell className="font-medium">
                    <div className="max-w-[200px] truncate">
                      {bill.courseName}
                    </div>
                  </TableCell>
                  <TableCell>
                    {bill.amount.toLocaleString("vi-VN")} VND
                  </TableCell>
                  <TableCell>{bill.paymentMethod || "Stripe"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium",
                        bill.status.trim() === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {bill.status.trim() === "paid"
                        ? "Đã thanh toán"
                        : "Thất bại"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(bill.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-6 p-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(i + 1)}
                  className={currentPage === i + 1 ? "bg-indigo-600" : ""}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

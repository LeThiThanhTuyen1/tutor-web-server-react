// components/BillHistory.tsx
import React, { useEffect, useState } from "react";
import { BillHistoryModel, getBillHistory } from "@/services/enrollmentService";
import { PaginationFilter } from "@/types/paginated-response";

const BillHistory: React.FC = () => {
  const [bills, setBills] = useState<BillHistoryModel[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBillHistory = async () => {
    setLoading(true);
    try {
      const filter: PaginationFilter = { pageNumber: page, pageSize };
      const response = await getBillHistory(filter);
      if (response.succeeded) {
        setBills(response.data || []);
        setTotalPages(response.totalPages);
        setTotalRecords(response.totalRecords);
        setError(null);
      } else {
        setBills([]);
        setTotalPages(0);
        setTotalRecords(0);
        setError(response.message || "Failed to fetch bill history.");
      }
    } catch (err) {
      setBills([]);
      setTotalPages(0);
      setTotalRecords(0);
      setError("An unexpected error occurred while fetching bill history.");
      console.error("Error fetching bill history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillHistory();
  }, [page]);

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Bill History</h2>

      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {!loading && bills.length === 0 && !error && (
        <div className="text-center py-4">
          <p className="text-gray-500">No payment history found.</p>
        </div>
      )}

      {bills.length > 0 && (
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border-collapse bg-white shadow-sm ">
            <thead>
              <tr className="text-gray-700 text-left">
                <th className="border p-3 font-semibold">Course</th>
                <th className="border p-3 font-semibold">Amount</th>
                <th className="border p-3 font-semibold">Method</th>
                <th className="border p-3 font-semibold">Transaction ID</th>
                <th className="border p-3 font-semibold">Status</th>
                <th className="border p-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.paymentId} className="hover:bg-gray-50">
                  <td className="border p-3">{bill.courseName}</td>
                  <td className="border p-3">{bill.amount.toFixed(2)}</td>
                  <td className="border p-3">{bill.paymentMethod}</td>
                  <td className="border p-3">{bill.transactionId}</td>
                  <td className="border p-3 capitalize">{bill.status}</td>
                  <td className="border p-3">
                    {new Date(bill.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {page} of {totalPages} ({totalRecords} records)
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BillHistory;
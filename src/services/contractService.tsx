import api from "@/config/axiosInstance";
import { PaginationFilter } from "@/types/paginated-response";
import { PagedResponse } from "./adminService";

// Define the ContractDTO interface matching your backend ContractDTO
interface ContractDTO {
  id: number;
  tutorName: string;
  studentName: string;
  courseName: string;
  terms: string;
  fee: number;
  startDate: string;
  endDate: string;
  status: string;
}

// Get all contracts (Admin only)
export const getAllContracts = async (filter: PaginationFilter): Promise<PagedResponse<ContractDTO[]>> => {
  try {
      const response = await api.get("/Contracts", {
          params: {
              pageNumber: filter.pageNumber,
              pageSize: filter.pageSize
          }
      });
      return response.data;
  } catch (error) {
      console.error("Error fetching contracts:", error);
      throw error;
  }
};

// Get all contracts by user ID
export const getContractsByUserId = async (
  filter: PaginationFilter
): Promise<PagedResponse<ContractDTO[]>> => {
  try {
    const response = await api.get(`/Contracts/User`, {
      params: {
        pageNumber: filter.pageNumber,
        pageSize: filter.pageSize,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching contracts for user:", error);
    throw error;
  }
};

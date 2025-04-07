import api from "@/config/axiosInstance";

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

// Define Response type matching your backend Response<T>
interface Response<T> {
  succeeded: boolean;
  message: string;
  errors: string[] | null;
  data: T | null;
}

// Get all contracts (Admin only)
export const getAllContracts = async (): Promise<Response<ContractDTO[]>> => {
  try {
    const response = await api.get("/Contracts");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching all contracts:", error);
    return {
      succeeded: false,
      message: error.response?.data?.message || "Failed to fetch contracts",
      errors: error.response?.data?.errors || ["Network Error"],
      data: null,
    };
  }
};

// Get all contracts by user ID
export const getContractsByUserId = async (userId: number): Promise<Response<ContractDTO[]>> => {
  try {
    const response = await api.get(`/Contracts/User/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching contracts for user ID ${userId}:`, error);
    return {
      succeeded: false,
      message: error.response?.data?.message || "Failed to fetch contracts for the user",
      errors: error.response?.data?.errors || ["Network Error"],
      data: null,
    };
  }
};
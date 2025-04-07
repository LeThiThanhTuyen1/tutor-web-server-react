import api from "@/config/axiosInstance";
import { PaginationFilter } from "@/types/paginated-response"; 

export interface Complaint {
  id: number;
  contractId: number;
  userId: number;
  description: string;
  status: string;
  createdAt: string;
  contract?: any; // Adjust based on your Contract model
  user?: any; // Adjust based on your User model
}

export interface ComplaintActionRequest {
  action: "approve" | "reject";
}

// Get all complaints (Admin only)
export const getAllComplaints = async (filter: PaginationFilter) => {
  try {
    const response = await api.get("/Complaints", {
      params: {
        page: filter.pageNumber,
        pageSize: filter.pageSize,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching all complaints:", error);
    return {
      succeeded: false,
      message: error.response?.data?.message || "Failed to fetch complaints",
      errors: error.response?.data?.errors || ["Network Error"],
    };
  }
};

// Create a new complaint
export const createComplaint = async (complaint: {
  contractId: number;
  description: string;
}) => {
  try {
    const response = await api.post("/Complaint", {
      contractId: complaint.contractId,
      description: complaint.description,
      userId: 0, // Will be set by backend based on auth token
      status: "pending", // Default value, can omit if backend sets it
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating complaint:", error);
    return {
      succeeded: false,
      message: error.response?.data?.message || "Failed to create complaint",
      errors: error.response?.data?.errors || ["Network Error"],
    };
  }
};

// Get a complaint by ID
export const getComplaintById = async (id: number) => {
  try {
    const response = await api.get(`/Complaint/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching complaint with ID ${id}:`, error);
    return {
      succeeded: false,
      message: error.response?.data?.message || "Complaint not found",
      errors: error.response?.data?.errors || ["Network Error"],
    };
  }
};

// Process a complaint (Admin only)
export const processComplaint = async (
  complaintId: number,
  action: "approve" | "reject"
) => {
  try {
    const response = await api.post(`/Complaint/${complaintId}/process`, {
      action,
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error processing complaint ${complaintId}:`, error);
    return {
      succeeded: false,
      message:
        error.response?.data?.message || "Failed to process complaint",
      errors: error.response?.data?.errors || ["Network Error"],
    };
  }
};
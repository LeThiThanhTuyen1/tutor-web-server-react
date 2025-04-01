import api from "@/config/axiosInstance";

// **Search Tutors**
export const searchTutors = async (searchCriteria: any, pagination: any) => {
  try {
    const response = await api.get("/Tutors/search", {
      params: { ...searchCriteria, ...pagination },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching tutors:", error);
    throw error;
  }
};

// **Get All Tutors**
export const getAllTutors = async (pagination: any) => {
  try {
    const response = await api.get("/Tutors", {
      params: pagination,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tutors:", error);
    throw error;
  }
};

// **Get Tutor by ID**
export const getTutorById = async (id: number) => {
  try {
    const response = await api.get(`/Tutor/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tutor:", error);
    throw error;
  }
};

// **Delete Multiple Tutors**
export const deleteTutors = async (tutorIds: number[]) => {
  try {
    const response = await api.delete("/Tutors/delete", {
      data: tutorIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting tutors:", error);
    throw error;
  }
};

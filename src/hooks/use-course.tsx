import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchAllCourses,
  fetchCourseById,
  fetchTutorCourses,
  fetchStudentCourses,
  createNewCourse,
  updateExistingCourse,
  cancelExistingCourse,
  deleteSelectedCourses,
  clearCurrentCourse,
  resetCourseError,
  studentsByCourseId,
} from "@/store/courseSlice";
import { PaginationFilter } from "@/types/paginated-response";

export const useCourse = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    courses,
    currentCourse,
    tutorCourses,
    studentCourses,
    loading,
    error,
    totalPages,
    totalItems,
    totalStudents,
    students,
  } = useSelector((state: RootState) => state.courses);

  return {
    // State
    courses,
    currentCourse,
    tutorCourses,
    studentCourses,
    loading,
    error,
    totalPages,
    totalItems,
    totalStudents,
    students,

    // Actions
    getAllCourses: (pagination: PaginationFilter) =>
      dispatch(fetchAllCourses(pagination)),
    getCourseById: (id: number) => dispatch(fetchCourseById(id)),
    getTutorCourses: (pagination: PaginationFilter) =>
      dispatch(fetchTutorCourses(pagination)),
    getStudentCourses: (pagination: PaginationFilter) =>
      dispatch(fetchStudentCourses(pagination)),
    createCourse: (courseData: any) => dispatch(createNewCourse(courseData)),
    updateCourse: (id: number, courseData: any) =>
      dispatch(updateExistingCourse({ id, courseData })),
    cancelCourse: (id: number) => dispatch(cancelExistingCourse(id)),
    deleteCourses: (ids: number[]) => dispatch(deleteSelectedCourses(ids)),
    clearCourse: () => dispatch(clearCurrentCourse()),
    resetError: () => dispatch(resetCourseError()),
    getStudentsByCourseId: (id: number) =>
        dispatch(studentsByCourseId(id)),
  };
};

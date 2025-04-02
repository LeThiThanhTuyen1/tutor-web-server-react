"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState } from "@/store/store";
import TutorCourseList from "../student/course/student-course-list";
import CourseList from "./course-list-grid";
import StudentCourseList from "../student/course/student-course-list";

export default function CourseListContainer() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [viewType, setViewType] = useState<"public" | "tutor" | "student">(
    "public"
  );

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "Tutor") {
        setViewType("tutor");
      } else if (user?.role === "Student") {
        setViewType("student");
      } else {
        setViewType("public");
      }
    } else {
      setViewType("public");
    }
  }, [isAuthenticated, user]);

  return (
    <>
      {viewType === "tutor" && <TutorCourseList />}
      {viewType === "student" && <StudentCourseList />}
      {viewType === "public" && <CourseList />}
    </>
  );
}

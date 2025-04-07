"use client";

import { useEffect, useState } from "react";
import TutorCourseList from "../student/course/student-course-list";
import CourseList from "./course-list-grid";
import StudentCourseList from "../student/course/student-course-list";
import { useAuth } from "@/hook/use-auth";

export default function CourseListContainer() {
  const { user, isAuthenticated } = useAuth();
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

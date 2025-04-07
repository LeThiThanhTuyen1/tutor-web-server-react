"use client";

import type React from "react";
import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";
import { login } from "./store/authSlice";

// Layouts
import PublicLayout from "./components/layout/public-layout";

// Pages
import AuthPage from "./components/auth/auth-page";
import HomePage from "./components/layout/home-page";
import CourseList from "./components/courses/course-list-grid";
import TutorList from "./components/tutors/tutor-list";
import { getProfile } from "./services/authService";
import ProfilePage from "./components/auth/profile-page";
import NotFound from "./components/error/not-found";
import TutorProfile from "./components/tutors/tutor-detail";
import CourseDetail from "./components/courses/course-detail";
import CourseForm from "./components/tutors/course/course-form";
import EditCoursePage from "./components/tutors/course/edit-course";
import Forbidden from "./components/error/forbidden";
import TutorCourseListComponent from "./components/tutors/course/tutor-course-list";
import StudentCourseList from "./components/student/course/student-course-list";
import ScheduleView from "./components/courses/schedule/schedule-view";
import { useAuth } from "./hook/use-auth";
import { useDispatch } from "react-redux";
import EnrollmentPage from "./components/student/course/enrollment-page";
import { AdminDashboard } from "./components/dashboard/admin-dashboard";
import { TutorDashboard } from "./components/dashboard/tutor-dashboard";
import { StudentDashboard } from "./components/dashboard/student-dashboard";
import SettingsPage from "./components/layout/setting-page";
import NotificationsPage from "./components/layout/notifications-page";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === "Admin" ? (
    children
  ) : (
    <Navigate to="/403" replace />
  );
};

const TutorRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();

  return isAuthenticated && user?.role === "Tutor" ? (
    children
  ) : (
    <Navigate to="/403" replace />
  );
};

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const userData = await getProfile();
          dispatch(login(userData));
        } catch (error) {
          console.error("Invalid token. Logging out...");
          localStorage.clear();
          navigate("/auth/login", { replace: true });
        }
      }
    };
    validateToken();
  }, [dispatch, navigate]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={<AuthPage />}>
        <Route path=":formType" element={<AuthPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <PublicLayout>
              <Outlet />
            </PublicLayout>
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="tutors" element={<TutorList />} />
        <Route path="students" element={<div>Students Management</div>} />
      </Route>

      {/* Tutor Routes */}
      <Route
        path="/tutor"
        element={
          <TutorRoute>
            <PublicLayout>
              <Outlet />
            </PublicLayout>
          </TutorRoute>
        }
      >
        <Route path="courses" element={<TutorCourseListComponent />} />
        <Route path="dashboard" element={<TutorDashboard />} />
        <Route path="courses/new" element={<CourseForm />} />
        <Route path="courses/:id/edit" element={<EditCoursePage />} />
        <Route path="students" element={<div>Students Management</div>} />
      </Route>

      {/* User Routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Outlet />
          </PublicLayout>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="enrollment/:id" element={<EnrollmentPage />} />
        <Route path="tutors" element={<TutorList />} />
        <Route path="tutor/:id" element={<TutorProfile />} />
        <Route path="courses/:id" element={<CourseDetail />} />

        {/*  Protected Routes */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="setting"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="schedules"
        element={
          <PublicLayout>
            <ProtectedRoute>
              <ScheduleView />
            </ProtectedRoute>
          </PublicLayout>
        }
      />
      <Route
        path="/student"
        element={
          <PublicLayout>
            <Outlet />
          </PublicLayout>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="courses" element={<StudentCourseList />} />
        <Route path="tutors" element={<TutorList />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="tutor/:id" element={<TutorProfile />} />
        <Route path="courses/:id" element={<CourseDetail />} />

        {/*  Protected Routes */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Redirect unknown routes */}
      <Route path="/404" element={<NotFound />} />
      <Route path="/403" element={<Forbidden />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

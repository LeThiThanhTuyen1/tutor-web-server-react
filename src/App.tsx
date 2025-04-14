"use client";

import type React from "react";
import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";
import { login } from "./store/authSlice";

// Layouts
import PublicLayout from "./components/layout/public-layout";

// Context Providers
import { RatingProvider } from "./context/rating-context";

// Core components that should load immediately
import { getProfile } from "./services/authService";
import { useAuth } from "./hook/use-auth";
import { useDispatch } from "react-redux";
import NotFound from "./components/error/not-found";
import Forbidden from "./components/error/forbidden";
import { AdminDashboard } from "./components/dashboard/admin-dashboard";
import { UserTable } from "./components/admin/user-management";
import { CourseTable } from "./components/admin/course-management";
import { StudentDashboard } from "./components/dashboard/student-dashboard";
import { TutorDashboard } from "./components/dashboard/tutor-dashboard";

// Lazy-loaded components
const AuthPage = lazy(() => import("./components/auth/auth-page"));
const HomePage = lazy(() => import("./components/layout/home-page"));
const CourseList = lazy(() => import("./components/courses/course-list-grid"));
const TutorList = lazy(() => import("./components/tutors/tutor-list"));
const ProfilePage = lazy(() => import("./components/auth/profile-page"));
const TutorProfile = lazy(() => import("./components/tutors/tutor-detail"));
const CourseDetail = lazy(() => import("./components/courses/course-detail"));
const CourseForm = lazy(() => import("./components/tutors/course/course-form"));
const EditCoursePage = lazy(
  () => import("./components/tutors/course/edit-course")
);
const TutorCourseListComponent = lazy(
  () => import("./components/tutors/course/tutor-course-list")
);
const StudentCourseList = lazy(
  () => import("./components/student/course/student-course-list")
);
const ScheduleView = lazy(
  () => import("./components/courses/schedule/schedule-view")
);
const EnrollmentPage = lazy(
  () => import("./components/student/course/enrollment-page")
);
const SettingsPage = lazy(() => import("./components/layout/setting-page"));
const NotificationsPage = lazy(
  () => import("./components/notification/notifications-page")
);
const ContractList = lazy(
  () => import("./components/courses/contracts/contract-list")
);
const ContractManagement = lazy(
  () => import("./components/admin/contract-management")
);
const BillHistory = lazy(
  () => import("./components/student/course/payment-history")
);

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

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
    <RatingProvider>
      <Suspense fallback={<LoadingSpinner />}>
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
            <Route path="contracts/manage" element={<ContractManagement />} />
            <Route path="users" element={<UserTable />} />
            <Route path="courses" element={<CourseTable />} />
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
              path="contracts"
              element={
                <ProtectedRoute>
                  <ContractList />
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
            <Route path="bill-history" element={<BillHistory />} />
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
      </Suspense>
    </RatingProvider>
  );
}

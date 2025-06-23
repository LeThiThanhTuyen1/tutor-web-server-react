import type React from "react";
import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";
import { login } from "./store/authSlice";

// Layouts
import PublicLayout from "./components/page/layout/public-layout";

// Context Providers
import { RatingProvider } from "./context/rating-context";

// Core components that should load immediately
import { getProfile } from "./services/authService";
import { useAuth } from "./hook/use-auth";
import { useDispatch } from "react-redux";
import NotFound from "./components/page/error/not-found";
import Forbidden from "./components/page/error/forbidden";
import { AdminDashboard } from "./components/page/dashboard/admin-dashboard";
import { UserTable } from "./components/page/auth/admin/user-management";
import { CourseTable } from "./components/page/auth/admin/course-management";
import { StudentDashboard } from "./components/page/dashboard/student-dashboard";
import { TutorDashboard } from "./components/page/dashboard/tutor-dashboard";

// Lazy-loaded components
const AuthPage = lazy(() => import("./components/page/auth/auth-page"));
const HomePage = lazy(() => import("./components/page/basket/home-page"));
const CourseList = lazy(
  () => import("./components/page/courses/course-list-grid")
);
const TutorList = lazy(
  () => import("./components/page/auth/tutors/tutor-list")
);
const ProfilePage = lazy(() => import("./components/page/auth/profile-page"));
const AboutPage = lazy(() => import("./components/page/basket/about-page"));
const ContactPage = lazy(() => import("./components/page/basket/contact-us"));
const PrivacyPolicyPage = lazy(
  () => import("./components/page/basket/privacy")
);
const TermsPage = lazy(() => import("./components/page/basket/term-page"));
const FAQPage = lazy(() => import("./components/page/basket/faq-page"));
const TutorProfile = lazy(
  () => import("./components/page/auth/tutors/tutor-detail")
);
const CourseDetail = lazy(
  () => import("./components/page/courses/course-detail")
);
const CourseForm = lazy(() => import("./components/page/courses/course-form"));
const EditCoursePage = lazy(
  () => import("./components/page/courses/edit-course")
);
const TutorCourseListComponent = lazy(
  () => import("./components/page/courses/tutor-course-list")
);
const StudentCourseList = lazy(
  () => import("./components/page/courses/student-course-list")
);
const ScheduleView = lazy(
  () => import("./components/page/courses/schedule/schedule-view")
);
const SettingsPage = lazy(
  () => import("./components/page/basket/setting-page")
);
const NotificationsPage = lazy(
  () => import("./components/page/auth/notification/notifications-page")
);
const ContractList = lazy(
  () => import("./components/page/courses/contracts/contract-list")
);
const ContractManagement = lazy(
  () => import("./components/page/auth/admin/contract-management")
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
            {/* <Route path="courses/:id/edit" element={<EditCoursePage />} /> */}
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
            <Route path="schedules" element={<ScheduleView />} />
            <Route path="notifications" element={<NotificationsPage />} />
            {/* <Route path="courses/:id/edit" element={<EditCoursePage />} /> */}
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
            <Route path="tutor/courses/:id/edit" element={<EditCoursePage />} />
            <Route index element={<HomePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="courses" element={<CourseList />} />
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
          </Route>
          <Route
            path="/student"
            element={
              <PublicLayout>
                <Outlet />
              </PublicLayout>
            }
          >
            <Route path="courses" element={<StudentCourseList />} />
            <Route path="tutors" element={<TutorList />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="schedules" element={<ScheduleView />} />
            <Route path="notifications" element={<NotificationsPage />} />
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

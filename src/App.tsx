import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { UserRole } from "@/types/auth.types";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Lecturer pages
import LecturerDashboardPage from "@/pages/lecturer/DashboardPage";
import LecturerProfilePage from "@/pages/lecturer/ProfilePage";
import LecturerCoursesPage from "@/pages/lecturer/CoursesPage";
import LecturerClassesPage from "@/pages/lecturer/ClassesPage";
import LecturerAvailabilityPage from "@/pages/lecturer/AvailabilityPage";
import LecturerEnrollmentsPage from "@/pages/lecturer/EnrollmentsPage";

// Student pages
import StudentDashboardPage from "@/pages/student/DashboardPage";
import StudentProfilePage from "@/pages/student/ProfilePage";
import StudentCoursesPage from "@/pages/student/CoursesPage";
import StudentEnrollmentsPage from "@/pages/student/EnrollmentsPage";
import StudentClassesPage from "@/pages/student/ClassesPage";
import StudentGroupsPage from "@/pages/student/GroupsPage";

// Admin pages
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import AdminUsersPage from "@/pages/admin/UsersPage";
import AdminCoursesPage from "@/pages/admin/CoursesPage";
import AdminEnrollmentsPage from "@/pages/admin/EnrollmentsPage";

// Other pages
import NotFound from "@/pages/NotFound";
import UnauthorizedPage from "@/pages/UnauthorizedPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Lecturer routes */}
          <Route path="/lecturer/dashboard" element={<ProtectedRoute allowedRoles={[UserRole.LECTURER]}><LecturerDashboardPage /></ProtectedRoute>} />
          <Route path="/lecturer/profile" element={<ProtectedRoute allowedRoles={[UserRole.LECTURER]}><LecturerProfilePage /></ProtectedRoute>} />
          <Route path="/lecturer/courses" element={<ProtectedRoute allowedRoles={[UserRole.LECTURER]}><LecturerCoursesPage /></ProtectedRoute>} />
          <Route path="/lecturer/classes" element={<ProtectedRoute allowedRoles={[UserRole.LECTURER]}><LecturerClassesPage /></ProtectedRoute>} />
          <Route path="/lecturer/availability" element={<ProtectedRoute allowedRoles={[UserRole.LECTURER]}><LecturerAvailabilityPage /></ProtectedRoute>} />
          <Route path="/lecturer/enrollments" element={<ProtectedRoute allowedRoles={[UserRole.LECTURER]}><LecturerEnrollmentsPage /></ProtectedRoute>} />

          {/* Student routes */}
          <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentDashboardPage /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentProfilePage /></ProtectedRoute>} />
          <Route path="/student/courses" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentCoursesPage /></ProtectedRoute>} />
          <Route path="/student/enrollments" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentEnrollmentsPage /></ProtectedRoute>} />
          <Route path="/student/classes" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentClassesPage /></ProtectedRoute>} />
          <Route path="/student/groups" element={<ProtectedRoute allowedRoles={[UserRole.STUDENT]}><StudentGroupsPage /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><AdminCoursesPage /></ProtectedRoute>} />
          <Route path="/admin/enrollments" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><AdminEnrollmentsPage /></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

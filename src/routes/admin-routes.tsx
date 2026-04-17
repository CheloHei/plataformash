import { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminCourses from '@/pages/admin/AdminCourses';
import AdminStudents from '@/pages/admin/AdminStudents';
import AdminExamReview from '@/pages/admin/AdminExamReview';

// ─── Guard ─────────────────────────────────────────────────────────────────────

interface AdminRouteProps {
  children: ReactNode;
}

export function ProtectedAdminRoute({ children }: AdminRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  if (!isHydrated) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Role check — uncomment when backend provides role:
  // const user = useAuthStore((state) => state.user);
  // if (user?.rol !== 'ADMIN') return <Navigate to="/" replace />;

  return <>{children}</>;
}

// ─── Admin routes ──────────────────────────────────────────────────────────────

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/cursos"
        element={
          <ProtectedAdminRoute>
            <AdminCourses />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/alumnos"
        element={
          <ProtectedAdminRoute>
            <AdminStudents />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/examenes"
        element={
          <ProtectedAdminRoute>
            <AdminExamReview />
          </ProtectedAdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

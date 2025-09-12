import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { ROUTES } from "../../constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "ARTIST" | "VENUE" | "ADMIN";
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = ROUTES.LOGIN,
}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const userDashboard =
      user.role === "ARTIST" ? "/artist/dashboard" : "/venue/dashboard";
    return <Navigate to={userDashboard} replace />;
  }

  return <>{children}</>;
};

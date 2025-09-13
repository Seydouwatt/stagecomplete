import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute } from "./components/auth";
import { MainLayout } from "./components/layout";
import { Login, Register } from "./pages/auth";
import { ArtistDashboard, VenueDashboard } from "./pages/dashboard";
import { Profile } from "./pages/profile";
import { ArtistProfileForm } from "./pages/artist/ArtistProfileForm";
import { useAuthStore } from "./stores/authStore";
import { ROUTES } from "./constants";
import ToastContainer from "./components/ui/Toast";
import ErrorHandlingDemo from "./pages/ErrorHandlingDemo";
import { Browse } from "./pages/Browse";

// Page temporaire pour les routes non implémentées
const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">🚧 {title}</h1>
      <p className="text-lg text-base-content/70">
        Cette page arrive bientôt !
      </p>
    </div>
  </div>
);

// Composant pour rediriger vers le bon dashboard selon le rôle
const DashboardRedirect: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user.role === "ARTIST") {
    return <Navigate to="/artist/dashboard" replace />;
  } else if (user.role === "VENUE") {
    return <Navigate to="/venue/dashboard" replace />;
  }

  // Fallback pour ADMIN ou autres rôles
  return <Navigate to="/artist/dashboard" replace />;
};

function App() {
  return (
    <div data-theme="stagecomplete">
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />

          {/* Demo page (temporary) */}
          <Route path="/demo" element={<ErrorHandlingDemo />} />

          {/* Routes protégées avec layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard redirect selon rôle */}
            <Route path={ROUTES.DASHBOARD} element={<DashboardRedirect />} />
            <Route path="/browse" element={<Browse />} />
            {/* Routes Artist */}
            <Route
              path="/artist/dashboard"
              element={
                <ProtectedRoute requiredRole="ARTIST">
                  <ArtistDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/artist/portfolio"
              element={
                <ProtectedRoute requiredRole="ARTIST">
                  <ArtistProfileForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/artist/bookings"
              element={
                <ProtectedRoute requiredRole="ARTIST">
                  <ComingSoon title="Mes Bookings" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/artist/analytics"
              element={
                <ProtectedRoute requiredRole="ARTIST">
                  <ComingSoon title="Statistiques Artiste" />
                </ProtectedRoute>
              }
            />

            {/* Routes Venue */}
            <Route
              path="/venue/dashboard"
              element={
                <ProtectedRoute requiredRole="VENUE">
                  <VenueDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/venue/profile"
              element={
                <ProtectedRoute requiredRole="VENUE">
                  <ComingSoon title="Profil Venue" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/venue/events"
              element={
                <ProtectedRoute requiredRole="VENUE">
                  <ComingSoon title="Mes Événements" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/venue/team"
              element={
                <ProtectedRoute requiredRole="VENUE">
                  <ComingSoon title="Équipe Venue" />
                </ProtectedRoute>
              }
            />

            {/* Routes communes */}
            <Route
              path="/browse/artists"
              element={
                <ProtectedRoute>
                  <ComingSoon title="Parcourir les Artistes" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/browse/venues"
              element={
                <ProtectedRoute>
                  <ComingSoon title="Parcourir les Venues" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <ComingSoon title="Messages" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <ComingSoon title="Calendrier" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <ComingSoon title="Paramètres" />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Redirect par défaut */}
          <Route
            path="/"
            element={<Navigate to={ROUTES.DASHBOARD} replace />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={<Navigate to={ROUTES.DASHBOARD} replace />}
          />
        </Routes>
        <ToastContainer />
      </Router>
    </div>
  );
}

export default App;

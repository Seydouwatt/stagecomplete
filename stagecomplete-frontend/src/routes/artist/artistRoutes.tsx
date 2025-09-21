import { Suspense, lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../components";

// Lazy loading des pages artistes
const ArtistDashboard = lazy(() => import("../../pages/dashboard").then(module => ({ default: module.ArtistDashboard })));
const ArtistProfileForm = lazy(() => import("../../pages/artist/ArtistProfileForm").then(module => ({ default: module.ArtistProfileForm })));

// Composant de loading
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="loading loading-spinner loading-lg text-primary"></div>
  </div>
);
const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <h1 className="text-4xl font-bold mb-4">🚧 {title}</h1>
    <p className="text-lg text-base-content/70">Cette page arrive bientôt !</p>
  </div>
);

export const artistRoutes = [
  <Route
    key="artist-dashboard"
    path="/artist/dashboard"
    element={
      <ProtectedRoute requiredRole="ARTIST">
        <Suspense fallback={<PageLoader />}>
          <ArtistDashboard />
        </Suspense>
      </ProtectedRoute>
    }
  />,
  <Route
    key="artist-portfolio"
    path="/artist/portfolio"
    element={
      <ProtectedRoute requiredRole="ARTIST">
        <Suspense fallback={<PageLoader />}>
          <ArtistProfileForm />
        </Suspense>
      </ProtectedRoute>
    }
  />,
  <Route
    key="artist-bookings"
    path="/artist/bookings"
    element={
      <ProtectedRoute requiredRole="ARTIST">
        <ComingSoon title="Mes Bookings" />
      </ProtectedRoute>
    }
  />,
  <Route
    key="artist-analytics"
    path="/artist/analytics"
    element={
      <ProtectedRoute requiredRole="ARTIST">
        <ComingSoon title="Statistiques Artiste" />
      </ProtectedRoute>
    }
  />,
];

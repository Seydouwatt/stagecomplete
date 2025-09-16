import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../components";
import { ArtistDashboard } from "../../pages/dashboard";
import { ArtistProfileForm } from "../../pages/artist/ArtistProfileForm";
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
        <ArtistDashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="artist-portfolio"
    path="/artist/portfolio"
    element={
      <ProtectedRoute requiredRole="ARTIST">
        <ArtistProfileForm />
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

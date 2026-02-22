import React from "react";
import { Route } from "react-router-dom";
import { VenueDashboard } from "../../pages/dashboard";
import { VenueBookingRequestsPage } from "../../pages/VenueBookingRequestsPage";
import { BookingRequestEditPage } from "../../pages/BookingRequestEditPage";
import { ProtectedRoute } from "../../components";

const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <h1 className="text-4xl font-bold mb-4">🚧 {title}</h1>
    <p className="text-lg text-base-content/70">Cette page arrive bientôt !</p>
  </div>
);

export const venueRoutes = [
  <Route
    key="venue-dashboard"
    path="/venue/dashboard"
    element={
      <ProtectedRoute requiredRole="VENUE">
        <VenueDashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="venue-booking-requests"
    path="/venue/booking-requests"
    element={
      <ProtectedRoute requiredRole="VENUE">
        <VenueBookingRequestsPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="venue-booking-request-edit"
    path="/venue/booking-requests/:id/edit"
    element={
      <ProtectedRoute requiredRole="VENUE">
        <BookingRequestEditPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="venue-profile"
    path="/venue/profile"
    element={
      <ProtectedRoute requiredRole="VENUE">
        <ComingSoon title="Profil Venue" />
      </ProtectedRoute>
    }
  />,
  <Route
    key="venue-events"
    path="/venue/events"
    element={
      <ProtectedRoute requiredRole="VENUE">
        <ComingSoon title="Mes Événements" />
      </ProtectedRoute>
    }
  />,
  <Route
    key="venue-team"
    path="/venue/team"
    element={
      <ProtectedRoute requiredRole="VENUE">
        <ComingSoon title="Équipe Venue" />
      </ProtectedRoute>
    }
  />,
];

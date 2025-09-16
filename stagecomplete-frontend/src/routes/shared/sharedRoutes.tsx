import React from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "../../components";
import { User } from "../../pages/profile";

const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <h1 className="text-4xl font-bold mb-4">🚧 {title}</h1>
    <p className="text-lg text-base-content/70">Cette page arrive bientôt !</p>
  </div>
);

export const sharedRoutes = [
  <Route
    key="browse-artists"
    path="/browse/artists"
    element={
      <ProtectedRoute>
        <ComingSoon title="Parcourir les Artistes" />
      </ProtectedRoute>
    }
  />,
  <Route
    key="browse-venues"
    path="/browse/venues"
    element={
      <ProtectedRoute>
        <ComingSoon title="Parcourir les Venues" />
      </ProtectedRoute>
    }
  />,
  <Route
    key="messages"
    path="/messages"
    element={
      <ProtectedRoute>
        <ComingSoon title="Messages" />
      </ProtectedRoute>
    }
  />,
  <Route
    key="calendar"
    path="/calendar"
    element={
      <ProtectedRoute>
        <ComingSoon title="Calendrier" />
      </ProtectedRoute>
    }
  />,
  <Route
    key="user"
    path="/user"
    element={
      <ProtectedRoute>
        <User />
      </ProtectedRoute>
    }
  />,
  <Route
    key="settings"
    path="/settings"
    element={
      <ProtectedRoute>
        <ComingSoon title="Paramètres" />
      </ProtectedRoute>
    }
  />,
];

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/auth";
import { MainLayout } from "../components/layout";
import { ROUTES } from "../constants";
import { Browse } from "../pages/Browse";
import { publicRoutes } from "./public/publicRoutes";
import { artistRoutes } from "./artist/artistRoutes";
import { venueRoutes } from "./venue/venueRoutes";
import { sharedRoutes } from "./shared/sharedRoutes";
import { useDebugLog } from "../hooks/useDebugLog";

const DashboardRedirect: React.FC = () => {
  // TODO : compléter avec useAuthStore comme avant
  return <Navigate to="/artist/dashboard" replace />;
};

export const AppRoutes = () => {
  useDebugLog('ROUTES', 'AppRoutes component rendering...', { publicRoutesCount: publicRoutes.length })

  try {
    return (
      <Routes>
        {/* Routes publiques */}
        {publicRoutes}

        {/* Routes protégées */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<DashboardRedirect />} />
          <Route path="/browse" element={<Browse />} />

          {artistRoutes}
          {venueRoutes}
          {sharedRoutes}
        </Route>

        {/* Fallbacks */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  } catch (error) {
    console.error('❌ [ROUTES] Error in AppRoutes:', error)
    return <div>Error loading routes</div>
  }
};

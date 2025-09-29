import React from "react";
import { Navigate } from "react-router-dom";
import { usePremiumFeatures } from "../../hooks/usePremiumFeatures";
import UpgradePrompt from "../premium/UpgradePrompt";

interface PremiumRouteProps {
  children: React.ReactNode;
  feature?: string;
  redirectTo?: string;
  showPrompt?: boolean;
}

export const PremiumRoute: React.FC<PremiumRouteProps> = ({
  children,
  // feature,
  redirectTo = "/dashboard",
  showPrompt = true,
}) => {
  const {
    isPremium,
    isArtist,
  } = usePremiumFeatures(); // canAccessRoute, getUpgradeMessage

  // Si c'est une venue, accès total
  if (!isArtist) {
    return <>{children}</>;
  }

  // Si artiste premium, accès autorisé
  if (isPremium) {
    return <>{children}</>;
  }

  // Si artiste gratuit et showPrompt = true, afficher le prompt
  if (showPrompt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <UpgradePrompt
            trigger="feature"
            onClose={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  // Sinon rediriger vers la route spécifiée
  return <Navigate to={redirectTo} replace />;
};

export default PremiumRoute;

import { useAuthStore } from "../stores/authStore";

export const usePremiumFeatures = () => {
  const { user } = useAuthStore();

  const isPremium = user?.plan === "PREMIUM";
  const isFree = !user?.plan || user.plan === "FREE";
  const isArtist = user?.role === "ARTIST";
  const isVenue = user?.role === "VENUE";

  // Fonctions de vérification des permissions
  const canAccess = {
    // Fonctionnalités premium pour artistes
    messages: isPremium || isVenue,
    analytics: isPremium || isVenue,
    browseVenues: isPremium || isVenue,

    // Fonctionnalités gratuites pour artistes (accès de base)
    calendar: true, // Vue calendrier gratuite pour tous
    bookings: true, // Bookings illimités gratuit pour tous
    calendarExport: isPremium, // Export iCal/Google Calendar premium only

    // Portfolio photos (5 gratuit, illimité premium)
    portfolioPhotos: {
      maxCount: isPremium ? Infinity : 5,
      isPremiumFeature: true,
    },

    // Fonctionnalités toujours gratuites pour artistes
    dashboard: true,
    portfolio: true,
    profile: true,
    settings: true,
  };

  // Messages d'upgrade personnalisés
  const getUpgradeMessage = (feature: string) => {
    const messages: Record<string, string> = {
      messages: "Communiquez avec les venues sans limite avec Premium",
      analytics: "Analysez votre performance avec les stats Premium",
      browseVenues: "Trouvez des venues parfaites avec la recherche Premium",
      calendarExport: "Exportez votre calendrier (iCal/Google Calendar) avec Premium",
      portfolioPhotos: "Portfolio photos illimité avec Premium (vs 5 gratuit)",
    };

    return messages[feature] || "Cette fonctionnalité est réservée aux membres Premium";
  };

  // Fonction pour vérifier si une route est accessible
  const canAccessRoute = (route: string): boolean => {
    const routePermissions: Record<string, boolean> = {
      "/dashboard": true,
      "/artist/portfolio": true,
      "/user": true,
      "/settings": true,

      // Routes gratuites pour artistes
      "/artist/bookings": canAccess.bookings, // true (gratuit)
      "/calendar": canAccess.calendar, // true (gratuit)

      // Routes premium
      "/messages": canAccess.messages,
      "/browse/venues": canAccess.browseVenues,
      "/artist/analytics": canAccess.analytics,
    };

    return routePermissions[route] ?? true;
  };

  return {
    isPremium,
    isFree,
    isArtist,
    isVenue,
    canAccess,
    canAccessRoute,
    getUpgradeMessage,
    user,
  };
};

export default usePremiumFeatures;
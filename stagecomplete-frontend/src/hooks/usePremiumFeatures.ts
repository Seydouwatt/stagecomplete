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
    calendar: isPremium || isVenue,
    browseVenues: isPremium || isVenue,
    bookings: isPremium || isVenue,
    analytics: isPremium || isVenue,

    // Portfolio photos (4 gratuit, 10 premium)
    portfolioPhotos: {
      maxCount: isPremium ? 10 : 4,
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
      calendar: "Gérez tous vos événements avec le calendrier Premium",
      browseVenues: "Trouvez des venues parfaites avec la recherche Premium",
      bookings: "Suivez tous vos bookings avec Premium",
      analytics: "Analysez votre performance avec les stats Premium",
      portfolioPhotos: "Ajoutez jusqu'à 10 photos avec Premium (vs 4 gratuit)",
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

      // Routes premium
      "/messages": canAccess.messages,
      "/calendar": canAccess.calendar,
      "/browse/venues": canAccess.browseVenues,
      "/artist/bookings": canAccess.bookings,
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
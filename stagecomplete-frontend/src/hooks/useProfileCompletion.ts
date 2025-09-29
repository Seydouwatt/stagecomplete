import { useMemo } from "react";
import { useAuthStore } from "../stores/authStore";
import type { ArtistProfile, Profile } from "../types";

interface ProfileCompletionItem {
  key: string;
  label: string;
  description: string;
  isCompleted: boolean;
  route?: string;
}

interface ProfileCompletionResult {
  completionPercentage: number;
  isComplete: boolean;
  missingItems: ProfileCompletionItem[];
  completedItems: ProfileCompletionItem[];
  allItems: ProfileCompletionItem[];
  shouldShowAssistantPrompt: boolean;
}

export const useProfileCompletion = (): ProfileCompletionResult => {
  const { user } = useAuthStore();

  const result = useMemo(() => {
    if (!user || user.role !== "ARTIST") {
      return {
        completionPercentage: 100,
        isComplete: true,
        missingItems: [],
        completedItems: [],
        allItems: [],
        shouldShowAssistantPrompt: false,
      };
    }

    const profile = user.profile as Profile;
    const artistProfile = (profile as any)?.artist as ArtistProfile | undefined;

    // Définir les éléments essentiels d'un profil artiste
    const profileItems: ProfileCompletionItem[] = [
      {
        key: "basic_info",
        label: "Informations de base",
        description: "Nom, bio, photo de profil",
        isCompleted: Boolean(
          profile.name &&
          profile.bio &&
          profile.avatar
        ),
        route: "/artist/portfolio",
      },
      {
        key: "genres",
        label: "Genres musicaux",
        description: "Au moins 1 genre musical",
        isCompleted: Boolean(
          artistProfile?.genres && artistProfile.genres.length > 0
        ),
        route: "/artist/portfolio",
      },
      {
        key: "instruments",
        label: "Instruments",
        description: "Au moins 1 instrument",
        isCompleted: Boolean(
          artistProfile?.instruments && artistProfile.instruments.length > 0
        ),
        route: "/artist/portfolio",
      },
      {
        key: "experience",
        label: "Niveau d'expérience",
        description: "Définir votre niveau d'expertise",
        isCompleted: Boolean(artistProfile?.experience),
        route: "/artist/portfolio",
      },
      {
        key: "portfolio_photos",
        label: "Photos de portfolio",
        description: "Au moins 2 photos de performance",
        isCompleted: Boolean(
          artistProfile?.portfolio?.photos &&
          artistProfile.portfolio.photos.length >= 2
        ),
        route: "/artist/portfolio",
      },
      {
        key: "artist_type",
        label: "Type d'artiste",
        description: "Solo, duo, groupe, etc.",
        isCompleted: Boolean(artistProfile?.artistType),
        route: "/artist/portfolio",
      },
      {
        key: "location",
        label: "Localisation",
        description: "Votre ville ou région d'activité",
        isCompleted: Boolean(
          profile.location || artistProfile?.baseLocation
        ),
        route: "/artist/portfolio",
      },
      {
        key: "pricing",
        label: "Tarification",
        description: "Fourchette de prix ou détails tarifaires",
        isCompleted: Boolean(
          artistProfile?.priceRange || artistProfile?.priceDetails
        ),
        route: "/artist/portfolio",
      },
    ];

    const completedItems = profileItems.filter(item => item.isCompleted);
    const missingItems = profileItems.filter(item => !item.isCompleted);
    const completionPercentage = Math.round(
      (completedItems.length / profileItems.length) * 100
    );

    // Un profil est considéré comme complet s'il a au moins 80% des éléments
    const isComplete = completionPercentage >= 80;

    // Afficher le prompt d'assistant si le profil est moins de 60% complet
    const shouldShowAssistantPrompt = completionPercentage < 60;

    return {
      completionPercentage,
      isComplete,
      missingItems,
      completedItems,
      allItems: profileItems,
      shouldShowAssistantPrompt,
    };
  }, [user]);

  return result;
};

export default useProfileCompletion;
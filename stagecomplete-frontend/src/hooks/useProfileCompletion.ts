import { useMemo, useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { artistService } from "../services/artistService";
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
  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données réelles de l'artist profile
  useEffect(() => {
    const loadArtistProfile = async () => {
      if (!user || user.role !== "ARTIST") {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await artistService.getMyArtistProfile();
        setArtistProfile(profile);
      } catch (error) {
        console.error("Error loading artist profile for completion:", error);
        // En cas d'erreur, on continue avec null
        setArtistProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtistProfile();
  }, [user]);

  const result = useMemo(() => {
    // Pendant le chargement, retourner des valeurs par défaut
    if (isLoading) {
      return {
        completionPercentage: 0,
        isComplete: false,
        missingItems: [],
        completedItems: [],
        allItems: [],
        shouldShowAssistantPrompt: false,
      };
    }

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

    // Définir les éléments essentiels d'un profil artiste basés sur Mon Portfolio
    const profileItems: ProfileCompletionItem[] = [
      {
        key: "basic_info",
        label: "Informations de base",
        description: "Nom de l'artiste et description",
        isCompleted: Boolean(profile.name && artistProfile?.artistDescription),
        route: "/artist/portfolio",
      },
      {
        key: "artist_type",
        label: "Type d'artiste",
        description: "Solo, groupe, duo, etc.",
        isCompleted: Boolean(artistProfile?.artistType),
        route: "/artist/portfolio",
      },
      {
        key: "cover_photo",
        label: "Photo principale",
        description: "Première photo du portfolio (photo de profil)",
        isCompleted: Boolean(
          artistProfile?.portfolio?.photos &&
            artistProfile.portfolio.photos.length > 0
        ),
        route: "/artist/portfolio",
      },
      {
        key: "location",
        label: "Localisation",
        description: "Votre ville ou région d'activité",
        isCompleted: Boolean(artistProfile?.baseLocation),
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
        key: "pricing",
        label: "Tarification",
        description: "Fourchette de prix ou détails tarifaires",
        isCompleted: Boolean(artistProfile?.priceRange),
        route: "/artist/portfolio",
      },
    ];

    const completedItems = profileItems.filter((item) => item.isCompleted);
    const missingItems = profileItems.filter((item) => !item.isCompleted);
    const completionPercentage = Math.round(
      (completedItems.length / profileItems.length) * 100
    );

    // Un profil est considéré comme complet s'il a au moins 100% des éléments
    const isComplete = completionPercentage >= 100;

    // Afficher le prompt d'assistant si le profil est moins de 100% complet
    const shouldShowAssistantPrompt = completionPercentage < 100;

    return {
      completionPercentage,
      isComplete,
      missingItems,
      completedItems,
      allItems: profileItems,
      shouldShowAssistantPrompt,
    };
  }, [user, artistProfile, isLoading]);

  return result;
};

export default useProfileCompletion;

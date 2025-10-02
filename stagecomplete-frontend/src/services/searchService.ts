import axios from "axios";
import type {
  AdvancedSearchQuery,
  AdvancedSearchResponse,
  SearchSuggestionsResponse,
  PopularGenre,
  TrendingArtist,
  QuickFilters,
} from "../types";
import { API_URL } from "../constants";
import { toast } from "../stores/useToastStore";

// Configuration axios pour le service de recherche
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token aux requêtes (si nécessaire)
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem("stagecomplete-auth");
  if (authData) {
    try {
      const { state } = JSON.parse(authData);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (error) {
      console.error("Error parsing auth data:", error);
    }
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Une erreur est survenue";

    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

/**
 * Recherche avancée d'artistes avec filtres multiples
 */
export const searchArtists = async (
  query: AdvancedSearchQuery
): Promise<AdvancedSearchResponse> => {
  try {
    // Construire les query params
    const params = new URLSearchParams();

    if (query.q) params.append("q", query.q);
    if (query.sortBy) params.append("sortBy", query.sortBy);
    if (query.limit) params.append("limit", query.limit.toString());
    if (query.offset) params.append("offset", query.offset.toString());
    if (query.location) params.append("location", query.location);
    if (query.experience) params.append("experience", query.experience);
    if (query.priceRange) params.append("priceRange", query.priceRange);
    if (query.minPrice) params.append("minPrice", query.minPrice.toString());
    if (query.maxPrice) params.append("maxPrice", query.maxPrice.toString());
    if (query.availableOnly)
      params.append("availableOnly", query.availableOnly.toString());
    if (query.radius) params.append("radius", query.radius.toString());

    // Ajouter les arrays (genres, instruments)
    if (query.genres && query.genres.length > 0) {
      params.append("genres", query.genres.join(","));
    }
    if (query.instruments && query.instruments.length > 0) {
      params.append("instruments", query.instruments.join(","));
    }

    const response = await api.get<AdvancedSearchResponse>(
      `/search/artists?${params.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Error searching artists:", error);
    throw error;
  }
};

/**
 * Obtenir des suggestions d'auto-complétion
 */
export const getSuggestions = async (
  q: string,
  limit: number = 8
): Promise<SearchSuggestionsResponse> => {
  try {
    const response = await api.get<SearchSuggestionsResponse>(
      `/search/suggestions`,
      {
        params: { q, limit },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error getting suggestions:", error);
    // Ne pas afficher d'erreur pour les suggestions
    return { suggestions: [], query: q, executionTime: 0 };
  }
};

/**
 * Obtenir les genres populaires
 */
export const getPopularGenres = async (
  limit: number = 10
): Promise<PopularGenre[]> => {
  try {
    const response = await api.get<PopularGenre[]>(`/search/popular-genres`, {
      params: { limit },
    });

    return response.data;
  } catch (error) {
    console.error("Error getting popular genres:", error);
    throw error;
  }
};

/**
 * Obtenir les artistes tendance (30 derniers jours)
 */
export const getTrendingArtists = async (
  limit: number = 6
): Promise<TrendingArtist[]> => {
  try {
    const response = await api.get<TrendingArtist[]>(`/search/trending`, {
      params: { limit },
    });

    return response.data;
  } catch (error) {
    console.error("Error getting trending artists:", error);
    throw error;
  }
};

/**
 * Obtenir les filtres rapides disponibles
 */
export const getQuickFilters = async (): Promise<QuickFilters> => {
  try {
    const response = await api.get<QuickFilters>(`/search/quick-filters`);

    return response.data;
  } catch (error) {
    console.error("Error getting quick filters:", error);
    throw error;
  }
};

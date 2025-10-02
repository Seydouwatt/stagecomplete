import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  searchArtists,
  getSuggestions,
  getPopularGenres,
  getTrendingArtists,
  getQuickFilters,
} from "../services/searchService";
import type {
  AdvancedSearchQuery,
  AdvancedSearchResponse,
  SearchSuggestionsResponse,
  PopularGenre,
  TrendingArtist,
  QuickFilters,
} from "../types";

/**
 * Hook pour la recherche avancée d'artistes avec debouncing
 */
export const useAdvancedSearch = (
  initialQuery: AdvancedSearchQuery = {}
) => {
  const [query, setQuery] = useState<AdvancedSearchQuery>(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState<AdvancedSearchQuery>(initialQuery);

  // Debouncing de la recherche textuelle (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Query principale de recherche
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery<AdvancedSearchResponse>({
    queryKey: ["search", "artists", debouncedQuery],
    queryFn: () => searchArtists(debouncedQuery),
    // Garder les anciennes données pendant le rechargement
    placeholderData: (previousData) => previousData,
    // Cache pendant 5 minutes
    staleTime: 5 * 60 * 1000,
  });

  // Helper pour mettre à jour la query
  const updateQuery = useCallback((updates: Partial<AdvancedSearchQuery>) => {
    setQuery((prev) => ({ ...prev, ...updates }));
  }, []);

  // Helper pour réinitialiser la query
  const resetQuery = useCallback(() => {
    setQuery({});
  }, []);

  // Helper pour la pagination
  const nextPage = useCallback(() => {
    if (data?.metadata.hasMore) {
      updateQuery({
        offset: (data.metadata.offset || 0) + (data.metadata.limit || 20),
      });
    }
  }, [data, updateQuery]);

  const previousPage = useCallback(() => {
    if (data && data.metadata.offset > 0) {
      updateQuery({
        offset: Math.max(0, data.metadata.offset - data.metadata.limit),
      });
    }
  }, [data, updateQuery]);

  return {
    // Données
    results: data?.results || [],
    metadata: data?.metadata,

    // États
    isLoading: isLoading || isFetching,
    error,

    // Query actuelle
    query,

    // Actions
    updateQuery,
    resetQuery,
    refetch,
    nextPage,
    previousPage,
  };
};

/**
 * Hook pour les suggestions d'auto-complétion avec debouncing
 */
export const useSearchSuggestions = (searchQuery: string, enabled: boolean = true) => {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debouncing (200ms pour suggestions - plus rapide)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading } = useQuery<SearchSuggestionsResponse>({
    queryKey: ["search", "suggestions", debouncedQuery],
    queryFn: () => getSuggestions(debouncedQuery),
    enabled: enabled && debouncedQuery.length >= 2,
    staleTime: 2 * 60 * 1000, // Cache 2 minutes
  });

  return {
    suggestions: data?.suggestions || [],
    isLoading,
    executionTime: data?.executionTime,
  };
};

/**
 * Hook pour obtenir les genres populaires
 */
export const usePopularGenres = (limit: number = 10) => {
  const { data, isLoading, error } = useQuery<PopularGenre[]>({
    queryKey: ["search", "popular-genres", limit],
    queryFn: () => getPopularGenres(limit),
    staleTime: 30 * 60 * 1000, // Cache 30 minutes
  });

  return {
    genres: data || [],
    isLoading,
    error,
  };
};

/**
 * Hook pour obtenir les artistes tendance
 */
export const useTrendingArtists = (limit: number = 6) => {
  const { data, isLoading, error } = useQuery<TrendingArtist[]>({
    queryKey: ["search", "trending", limit],
    queryFn: () => getTrendingArtists(limit),
    staleTime: 15 * 60 * 1000, // Cache 15 minutes
  });

  return {
    artists: data || [],
    isLoading,
    error,
  };
};

/**
 * Hook pour obtenir les filtres rapides disponibles
 */
export const useQuickFilters = () => {
  const { data, isLoading, error } = useQuery<QuickFilters>({
    queryKey: ["search", "quick-filters"],
    queryFn: () => getQuickFilters(),
    staleTime: 60 * 60 * 1000, // Cache 1 heure (les filtres changent rarement)
  });

  return {
    filters: data,
    isLoading,
    error,
  };
};

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SearchBar,
  type SearchSuggestion,
} from "../components/search/SearchBar";
import { FilterPanel } from "../components/search/FilterPanel";
import type { FilterOptions } from "../components/search/FilterPanel";
import { BrowseGrid } from "../components/browse/BrowseGrid";
import { useAuthStore } from "../stores/authStore";
import { motion } from "framer-motion";
import { useAdvancedSearch, useSearchSuggestions } from "../hooks/useAdvancedSearch";
import type { AdvancedSearchQuery } from "../types";

export const Browse: React.FC = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // État local
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Type de contenu basé sur le rôle utilisateur
  const browseType = user?.role === "ARTIST" ? "venue" : "artist";

  // Filtres
  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    locations: [],
    priceRange: [0, 5000],
    availability: "",
    rating: 0,
    capacity: [0, 1000],
    experience: "",
  });

  // Construire la query pour l'API
  const apiQuery = useMemo<AdvancedSearchQuery>(() => ({
    q: searchQuery || undefined,
    genres: filters.genres.length > 0 ? filters.genres : undefined,
    location: filters.locations.length > 0 ? filters.locations[0] : undefined,
    experience: filters.experience || undefined,
    minPrice: filters.priceRange?.[0] || undefined,
    maxPrice: filters.priceRange?.[1] || undefined,
    sortBy: "relevance",
    limit: 20,
  }), [searchQuery, filters]);

  // Hook de recherche avec l'API réelle
  const {
    results,
    metadata,
    isLoading,
    error,
    updateQuery,
    nextPage,
    previousPage,
  } = useAdvancedSearch(apiQuery);

  // Hook pour les suggestions
  const { suggestions: apiSuggestions, isLoading: suggestionsLoading } =
    useSearchSuggestions(searchQuery, browseType === "artist");

  // Keep local searchQuery in sync with URL param changes (back/forward)
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== searchQuery) setSearchQuery(urlQuery);
  }, [searchParams]);

  // Mapper les suggestions API au format du composant SearchBar
  const searchSuggestions = useMemo(() => {
    return apiSuggestions.map((suggestion) => ({
      id: suggestion.id,
      type: suggestion.type as "artist" | "genre" | "venue",
      title: suggestion.text,
      subtitle: suggestion.subtitle,
      avatar: suggestion.avatar,
    }));
  }, [apiSuggestions]);

  // Mapper les résultats API vers le format attendu par BrowseGrid
  const filteredItems = useMemo(() => {
    if (browseType !== "artist") {
      // TODO: Implémenter la recherche de venues quand l'API sera prête
      return [];
    }

    return results.map((artist) => ({
      id: artist.id,
      name: artist.name,
      bio: artist.artisticBio || "",
      avatar: artist.avatar,
      location: artist.location,
      genres: artist.genres,
      rating: 4.5, // TODO: Ajouter rating dans l'API
      reviewCount: artist.profileViews || 0,
      priceRange: artist.priceRange,
      experience: artist.experience as "BEGINNER" | "INTERMEDIATE" | "PROFESSIONAL",
      availability: true, // TODO: Gérer la disponibilité
      portfolioImages: artist.portfolioPreview || [],
      socialLinks: {}, // TODO: Ajouter socialLinks dans l'API si nécessaire
    }));
  }, [results, browseType]);

  // Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchParams(query ? { q: query } : {});
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleContact = (id: string) => {
    console.log("Contact:", id);
    // Implémenter navigation vers message ou modal contact
  };

  const handleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-base-200" data-cy="browse-page">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-primary to-secondary text-primary-content">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Découvrez{" "}
              {browseType === "artist" ? "des artistes" : "des venues"}
              <br />
              exceptionnels
            </h1>
            <p className="text-xl opacity-90 mb-8">
              {browseType === "artist"
                ? "Trouvez les venues parfaites pour vos performances"
                : "Réservez des artistes talentueux pour vos événements"}
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                placeholder={`Rechercher ${
                  browseType === "artist" ? "des venues" : "des artistes"
                }...`}
                value={searchQuery}
                onSearch={handleSearch}
                onFilterClick={() => setShowFilters(true)}
                suggestions={searchSuggestions}
                isLoading={isLoading || suggestionsLoading}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results section */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <BrowseGrid
            items={filteredItems as any}
            itemType={browseType}
            isLoading={isLoading}
            onItemContact={handleContact}
            onItemFavorite={handleFavorite}
            favoritedItems={favorites}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </motion.div>
      </div>

      {/* Filter panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onFiltersChange={handleFiltersChange}
        userRole={user?.role || "ARTIST"}
      />
    </div>
  );
};

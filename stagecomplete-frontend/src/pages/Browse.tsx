import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "../components/search/SearchBar";
import { FilterPanel } from "../components/search/FilterPanel";
import { BrowseGrid } from "../components/browse/BrowseGrid";
import { useAuthStore } from "../stores/authStore";
import { motion } from "framer-motion";
import {
  useAdvancedSearch,
  useSearchSuggestions,
} from "../hooks/useAdvancedSearch";
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

  // Filtres - initialiser depuis les paramètres URL
  const [filters, setFilters] = useState<AdvancedSearchQuery>(() => {
    const params: AdvancedSearchQuery = {
      sortBy: (searchParams.get('sortBy') as any) || "relevance",
      limit: 20,
    };

    // Lire tous les filtres depuis l'URL
    const location = searchParams.get('location');
    const genres = searchParams.get('genres')?.split(',').filter(Boolean);
    const instruments = searchParams.get('instruments')?.split(',').filter(Boolean);
    const experience = searchParams.get('experience') as any;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const availableOnly = searchParams.get('availableOnly');

    if (location) params.location = location;
    if (genres?.length) params.genres = genres;
    if (instruments?.length) params.instruments = instruments;
    if (experience) params.experience = experience;
    if (minPrice) params.minPrice = parseInt(minPrice);
    if (maxPrice) params.maxPrice = parseInt(maxPrice);
    if (availableOnly === 'true') params.availableOnly = true;

    return params;
  });

  // Construire la query pour l'API
  const apiQuery = useMemo<AdvancedSearchQuery>(
    () => ({
      ...filters,
      q: searchQuery || filters.q,
    }),
    [searchQuery, filters]
  );

  // Hook de recherche avec l'API réelle
  const {
    results,
    isLoading,
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
      experience: artist.experience as
        | "BEGINNER"
        | "INTERMEDIATE"
        | "PROFESSIONAL",
      availability: true, // TODO: Gérer la disponibilité
      portfolioImages: artist.portfolioPreview || [],
      socialLinks: {}, // TODO: Ajouter socialLinks dans l'API si nécessaire
    }));
  }, [results, browseType]);

  // Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Préserver les filtres existants lors d'une nouvelle recherche
    const newSearchParams = new URLSearchParams(searchParams);
    if (query) {
      newSearchParams.set('q', query);
    } else {
      newSearchParams.delete('q');
    }
    setSearchParams(newSearchParams);
  };

  const handleFiltersChange = (newFilters: AdvancedSearchQuery) => {
    setFilters(newFilters);
    
    // Synchroniser avec les paramètres URL pour maintenir l'état de navigation
    const newSearchParams = new URLSearchParams();
    
    // Conserver la recherche actuelle
    if (searchQuery) newSearchParams.set('q', searchQuery);
    
    // Ajouter tous les autres filtres
    if (newFilters.location) newSearchParams.set('location', newFilters.location);
    if (newFilters.genres?.length) newSearchParams.set('genres', newFilters.genres.join(','));
    if (newFilters.instruments?.length) newSearchParams.set('instruments', newFilters.instruments.join(','));
    if (newFilters.experience) newSearchParams.set('experience', newFilters.experience);
    if (newFilters.minPrice) newSearchParams.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) newSearchParams.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.availableOnly) newSearchParams.set('availableOnly', 'true');
    if (newFilters.sortBy && newFilters.sortBy !== 'relevance') newSearchParams.set('sortBy', newFilters.sortBy);
    
    setSearchParams(newSearchParams);
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
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
};

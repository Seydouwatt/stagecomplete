import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "../components/search/SearchBar";
import { FilterPanel } from "../components/search/FilterPanel";
import { BrowseGrid } from "../components/browse/BrowseGrid";
import { BookingRequestModal } from "../components/booking-requests/BookingRequestModal";
import { useAuthStore } from "../stores/authStore";
import { motion } from "framer-motion";
import {
  useInfiniteAdvancedSearch,
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
  const [selectedArtist, setSelectedArtist] = useState<{
    id: string;
    name: string;
    avatar?: string;
  } | null>(null);

  // Type de contenu basé sur le rôle utilisateur
  const browseType = user?.role === "ARTIST" ? "venue" : "artist";
  console.log({ browseType });

  // Filtres - initialiser depuis les paramètres URL
  const [filters, setFilters] = useState<AdvancedSearchQuery>(() => {
    const params: AdvancedSearchQuery = {
      sortBy: (searchParams.get("sortBy") as any) || "relevance",
      limit: 20,
    };

    // Lire tous les filtres depuis l'URL
    const location = searchParams.get("location");
    const genres = searchParams.get("genres")?.split(",").filter(Boolean);
    const instruments = searchParams
      .get("instruments")
      ?.split(",")
      .filter(Boolean);
    const experience = searchParams.get("experience") as any;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const availableOnly = searchParams.get("availableOnly");

    if (location) params.location = location;
    if (genres?.length) params.genres = genres;
    if (instruments?.length) params.instruments = instruments;
    if (experience) params.experience = experience;
    if (minPrice) params.minPrice = parseInt(minPrice);
    if (maxPrice) params.maxPrice = parseInt(maxPrice);
    if (availableOnly === "true") params.availableOnly = true;

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

  // Hook de recherche avec infinite scroll
  const {
    results,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteAdvancedSearch(apiQuery);

  // Ref pour l'intersection observer (infinite scroll)
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Hook pour les suggestions
  const { suggestions: apiSuggestions, isLoading: suggestionsLoading } =
    useSearchSuggestions(searchQuery, browseType === "artist");

  // Sync URL params back to local state (for back/forward navigation)
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    // Only update if URL changed (not from our own update)
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("q")]);

  // Sync local searchQuery to URL (debounced to avoid too many updates during typing)
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";

    // Only update URL if searchQuery is different from URL
    if (searchQuery !== urlQuery) {
      const timer = setTimeout(() => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (searchQuery) {
          newSearchParams.set("q", searchQuery);
        } else {
          newSearchParams.delete("q");
        }
        setSearchParams(newSearchParams, { replace: true });
      }, 1000); // Wait 1s after last keystroke

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Intersection Observer pour infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
      publicSlug: artist.publicSlug,
      socialLinks: {}, // TODO: Ajouter socialLinks dans l'API si nécessaire
    }));
  }, [results, browseType]);

  // Handlers
  const handleSearchChange = (query: string) => {
    // Mise à jour immédiate pour la recherche en direct
    setSearchQuery(query);
  };

  const handleSearch = (query: string) => {
    // Submit explicite: met à jour immédiatement searchQuery et l'URL
    setSearchQuery(query);

    // Préserver les filtres existants lors d'une nouvelle recherche
    const newSearchParams = new URLSearchParams(searchParams);
    if (query) {
      newSearchParams.set("q", query);
    } else {
      newSearchParams.delete("q");
    }
    // Utiliser replace pour ne pas ajouter dans l'historique
    setSearchParams(newSearchParams, { replace: true });
  };

  const handleFiltersChange = (newFilters: AdvancedSearchQuery) => {
    setFilters(newFilters);

    // Synchroniser avec les paramètres URL pour maintenir l'état de navigation
    const newSearchParams = new URLSearchParams();

    // Conserver la recherche actuelle
    if (searchQuery) newSearchParams.set("q", searchQuery);

    // Ajouter tous les autres filtres
    if (newFilters.location)
      newSearchParams.set("location", newFilters.location);
    if (newFilters.genres?.length)
      newSearchParams.set("genres", newFilters.genres.join(","));
    if (newFilters.instruments?.length)
      newSearchParams.set("instruments", newFilters.instruments.join(","));
    if (newFilters.experience)
      newSearchParams.set("experience", newFilters.experience);
    if (newFilters.minPrice)
      newSearchParams.set("minPrice", newFilters.minPrice.toString());
    if (newFilters.maxPrice)
      newSearchParams.set("maxPrice", newFilters.maxPrice.toString());
    if (newFilters.availableOnly) newSearchParams.set("availableOnly", "true");
    if (newFilters.sortBy && newFilters.sortBy !== "relevance")
      newSearchParams.set("sortBy", newFilters.sortBy);

    setSearchParams(newSearchParams);
  };

  const handleContact = (id: string) => {
    // Trouver l'artiste dans les résultats
    const artist = filteredItems.find((item) => item.id === id);
    if (artist) {
      setSelectedArtist({
        id: artist.id,
        name: artist.name,
        avatar: artist.avatar,
      });
    }
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
                ? "Réservez des artistes talentueux pour vos événements"
                : "Trouvez les venues parfaites pour vos performances"}
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                placeholder={`Rechercher ${
                  browseType === "artist" ? "des artistes" : "des venues"
                }...`}
                value={searchQuery}
                onChange={handleSearchChange}
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

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="py-8 flex justify-center">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2">
                <span className="loading loading-spinner loading-md"></span>
                <span className="text-base-content/70">
                  Chargement de plus d'artistes...
                </span>
              </div>
            )}
            {!hasNextPage && results.length > 0 && !isLoading && (
              <p className="text-base-content/50 text-sm">
                Vous avez vu tous les résultats
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Filter panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Booking Request Modal */}
      {selectedArtist && (
        <BookingRequestModal
          isOpen={!!selectedArtist}
          onClose={() => setSelectedArtist(null)}
          artistId={selectedArtist.id}
          artistName={selectedArtist.name}
          artistAvatar={selectedArtist.avatar}
        />
      )}
    </div>
  );
};

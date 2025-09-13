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

// Mock data - remplacer par API calls
const mockArtists = [
  {
    id: "1",
    name: "Luna Jazz Quartet",
    bio: "Quartet de jazz moderne avec influences fusion et électroniques",
    avatar:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300",
    location: "Paris, FR",
    genres: ["Jazz", "Fusion", "Electronic"],
    rating: 4.8,
    reviewCount: 24,
    priceRange: "800-1200€",
    experience: "PROFESSIONAL" as const,
    availability: true,
    portfolioImages: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
    ],
    socialLinks: {
      spotify: "https://spotify.com",
      youtube: "https://youtube.com",
    },
  },
  // Ajoutez plus d'artistes mock...
];

const mockVenues = [
  {
    id: "1",
    name: "Le Blue Moon",
    description:
      "Club de jazz intime avec excellente acoustique et ambiance feutrée",
    images: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
    ],
    location: "Paris 11ème",
    address: "15 rue de la Roquette, 75011 Paris",
    capacity: 150,
    venueType: "Club",
    rating: 4.6,
    reviewCount: 89,
    priceRange: "500-800€/soirée",
    equipment: ["Piano", "Sono", "Éclairage"],
    amenities: ["wifi", "parking", "sound_system"],
    availability: true,
    website: "https://bluemoon.fr",
  },
  // Ajoutez plus de venues mock...
];

export const Browse: React.FC = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // État local
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Type de contenu basé sur le rôle utilisateur
  const browseType = user?.role === "ARTIST" ? "venue" : "artist";
  const artists = mockArtists;
  const venues = mockVenues;

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

  // Keep local searchQuery in sync with URL param changes (back/forward)
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== searchQuery) setSearchQuery(urlQuery);
  }, [searchParams]);

  // Suggestions de recherche
  const searchSuggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];

    const suggestions = [] as SearchSuggestion[];

    // Suggestions d'artistes/venues
    const currentItems = browseType === "artist" ? artists : venues;
    currentItems.forEach((item) => {
      if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.push({
          id: item.id,
          type: browseType,
          title: item.name,
          subtitle:
            browseType === "artist"
              ? (item as any).location
              : (item as any).address,
          avatar:
            browseType === "artist"
              ? (item as any).avatar
              : (item as any).images?.[0],
        });
      }
    });

    // Suggestions de genres
    const allGenres =
      browseType === "artist"
        ? [...new Set(artists.flatMap((item) => item.genres))]
        : [];

    allGenres.forEach((genre) => {
      if (genre.toLowerCase().includes(searchQuery.toLowerCase())) {
        suggestions.push({
          id: genre,
          type: "genre" as const,
          title: genre,
          subtitle: `Genre musical`,
        });
      }
    });

    return suggestions.slice(0, 8);
  }, [searchQuery, artists, venues, browseType]);

  // Filtrage des résultats
  const filteredItems = useMemo(() => {
    let results = browseType === "artist" ? [...artists] : [...venues];

    // Recherche textuelle
    if (searchQuery) {
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (browseType === "artist" &&
            (item as any).genres.some((genre: string) =>
              genre.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );
    }

    // Filtres
    if (filters.genres.length > 0 && browseType === "artist") {
      results = results.filter((item) =>
        filters.genres.some((genre) => (item as any).genres.includes(genre))
      );
    }

    if (filters.locations.length > 0) {
      results = results.filter((item) =>
        filters.locations.some((location) => item.location?.includes(location))
      );
    }

    if (filters.rating > 0) {
      results = results.filter(
        (item) => (item as any).rating >= filters.rating
      );
    }

    // Experience (for artists)
    if (filters.experience && browseType === "artist") {
      results = results.filter(
        (item) => (item as any).experience === filters.experience
      );
    }

    // Capacity upper-bound (for venues)
    if (filters.capacity && browseType === "venue") {
      const maxCap = filters.capacity[1];
      results = results.filter((item) => (item as any).capacity <= maxCap);
    }

    // Price upper-bound (parse from string like "800-1200€" or "500-800€/soirée")
    if (filters.priceRange && filters.priceRange[1] > 0) {
      const maxPrice = filters.priceRange[1];
      const parseMaxFromPrice = (priceStr: string): number => {
        const nums = (priceStr.match(/\d+/g) || []).map((n) => parseInt(n, 10));
        if (nums.length === 0) return 0;
        return Math.max(...nums);
      };
      results = results.filter((item) => {
        const priceStr = (item as any).priceRange as string | undefined;
        if (!priceStr) return true;
        return parseMaxFromPrice(priceStr) <= maxPrice;
      });
    }

    // Availability: if any availability filter selected, require item to be available
    if (filters.availability) {
      results = results.filter((item) => (item as any).availability === true);
    }

    return results;
  }, [artists, venues, searchQuery, filters, browseType]);

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
    <div className="min-h-screen bg-base-200">
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
                isLoading={isLoading}
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
            items={filteredItems}
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

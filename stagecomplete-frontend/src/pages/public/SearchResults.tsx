import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { PublicSearchBar } from "../../components/public/PublicSearchBar";
import { FeaturedArtists } from "../../components/public/FeaturedArtists";
import { useAdvancedSearch } from "../../hooks/useAdvancedSearch";
import type { AdvancedSearchQuery } from "../../types";
import { trackSearchClick } from "../../services/metricsService";
import {
  SEOHead,
  SEO_TEMPLATES,
  generateSearchSchema,
} from "../../components/seo/SEOHead";
import type { PublicArtistProfile } from "../../types";
import { getMainPhoto } from "../../types";

export const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const genres = searchParams.get("genres")?.split(",").filter(Boolean) || [];

  // Construire la query pour l'API de recherche avancée
  const apiQuery = useMemo<AdvancedSearchQuery>(() => ({
    q: query || undefined,
    location: location || undefined,
    genres: genres.length > 0 ? genres : undefined,
    sortBy: "relevance",
    limit: 20,
    offset: 0,
  }), [query, location, genres]);

  // Utiliser le hook de recherche avancée
  const {
    results,
    metadata,
    isLoading,
    error: searchError,
    nextPage,
  } = useAdvancedSearch(apiQuery);

  // Mapper les résultats vers le format PublicArtistProfile
  const artists = useMemo(() => {
    return results.map(artist => ({
      id: artist.id,
      profile: {
        name: artist.name,
        avatar: artist.avatar,
        bio: artist.artisticBio || '',
      },
      artistType: artist.artistType as 'SOLO' | 'GROUP' | undefined,
      baseLocation: artist.location,
      genres: artist.genres,
      instruments: artist.instruments,
      priceRange: artist.priceRange,
      experience: artist.experience,
      publicSlug: artist.publicSlug,
      portfolioPreview: artist.portfolioPreview,
      isPublic: true,
    }));
  }, [results]);

  const handleSearch = (newQuery: string, newLocation?: string) => {
    const newSearchParams = new URLSearchParams();
    if (newQuery) newSearchParams.set("q", newQuery);
    if (newLocation) newSearchParams.set("location", newLocation);
    setSearchParams(newSearchParams);
  };

  // Si pas de query, afficher la page de découverte
  if (!query) {
    return <DiscoveryPage onSearch={handleSearch} />;
  }

  const seoData = SEO_TEMPLATES.search(query, location);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords.filter((k): k is string => Boolean(k))}
        url={`/search?q=${encodeURIComponent(query)}${
          location ? `&location=${encodeURIComponent(location)}` : ""
        }`}
        schemaData={generateSearchSchema(query, metadata?.total || 0)}
      />
      {/* Header avec recherche */}
      <section className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div>
              <Link
                to="/directory"
                className="text-2xl font-bold text-gray-900 gap-2"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex gap-2 p-2 bg-primary/10 rounded-lg"
                >
                  <div className="text-4xl">🎭</div>
                  <span>
                    <span className="text-primary">Stage</span>Complete
                  </span>
                </motion.div>
              </Link>
            </div>

            <div className="flex-1">
              <PublicSearchBar
                placeholder={query}
                onSearch={handleSearch}
                size="md"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-neutral btn-outline gap-2 lg:btn-sm"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              Filtres
              {showFilters && (
                <span className="badge badge-primary badge-sm">ON</span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Filtres (si affichés) */}
      {showFilters && (
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="text-center text-gray-500">
              <p>Filtres avancés - À implémenter</p>
            </div>
          </div>
        </section>
      )}

      {/* Résultats */}
      <section className="container mx-auto px-4 py-8">
        {/* Info résultats */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Résultats pour "{query}"
            {location && (
              <span className="text-gray-600"> près de {location}</span>
            )}
          </h1>
          <p className="text-gray-600">
            {isLoading
              ? "Recherche en cours..."
              : `${metadata?.total || 0} artiste(s) trouvé(s)`}
          </p>
        </div>

        {/* Chargement */}
        {isLoading && artists.length === 0 && (
          <div className="flex justify-center py-12">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        )}

        {/* Erreur */}
        {searchError && (
          <div className="alert alert-error mb-6">
            <span>Erreur lors de la recherche</span>
          </div>
        )}

        {/* Grille d'artistes */}
        {!isLoading && artists.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {artists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ArtistCard artist={artist} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Aucun résultat */}
        {!isLoading && artists.length === 0 && query && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez avec d'autres termes de recherche ou élargissez votre zone
              géographique
            </p>

            <div className="space-y-2 max-w-md mx-auto text-left">
              <p className="text-sm text-gray-600">
                <strong>Suggestions :</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Vérifiez l'orthographe</li>
                <li>
                  • Utilisez des termes plus généraux (ex: "rock" au lieu de
                  "rock progressif")
                </li>
                <li>• Essayez sans spécifier de ville</li>
              </ul>
            </div>
          </div>
        )}

        {/* Bouton "Charger plus" */}
        {!isLoading && metadata?.hasMore && (
          <div className="text-center">
            <button
              onClick={nextPage}
              className="btn btn-outline btn-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Charger plus d'artistes"
              )}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

// Page de découverte quand pas de recherche
const DiscoveryPage: React.FC<{
  onSearch: (query: string, location?: string) => void;
}> = ({ onSearch }) => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title={SEO_TEMPLATES.directory.title}
        description={SEO_TEMPLATES.directory.description}
        keywords={SEO_TEMPLATES.directory.keywords}
        url="/directory"
      />
      {/* Hero de recherche */}
      <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <Link
            to="/"
            className="text-2xl flex items-center gap-2 justify-center"
          >
            <div className="text-2xl">🎭</div>
            <span>
              <span className=" text-secondary">Stage</span>
              Complete
            </span>
            <div className="text-2xl">🎪</div>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Découvrez des artistes
            <span className="block text-purple-300">exceptionnels</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Plus de 150 artistes professionnels vous attendent
          </p>
          <PublicSearchBar
            className="max-w-2xl mx-auto"
            onSearch={onSearch}
            size="lg"
          />
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FeaturedArtists showViewAll={false} limit={12} />
        </div>
      </section>
    </div>
  );
};

// Composant carte artiste pour les résultats
const ArtistCard: React.FC<{ artist: PublicArtistProfile }> = ({ artist }) => {
  const profilePhoto = getMainPhoto(artist);

  const handleClick = () => {
    // Track click from search results
    trackSearchClick(artist.id, window.location.pathname + window.location.search);
  };

  return (
    <Link
      to={`/artist/${artist.publicSlug}`}
      className="group"
      onClick={handleClick}
    >
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
        {/* Photo */}
        <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={artist.profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {artist.profile.name?.[0]?.toUpperCase() || "A"}
              </span>
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
              {artist.artistType === "SOLO" ? "Solo" : "Groupe"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary transition-colors">
            {artist.profile.name}
          </h3>

          {artist.baseLocation && (
            <div className="flex items-center gap-1 text-gray-500 mb-2">
              <MapPinIcon className="w-3 h-3" />
              <span className="text-sm">{artist.baseLocation}</span>
            </div>
          )}

          {/* Genres */}
          <div className="flex flex-wrap gap-1 mb-3">
            {artist.genres?.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
              >
                {genre}
              </span>
            ))}
            {(artist.genres?.length || 0) > 2 && (
              <span className="text-gray-400 text-xs">
                +{(artist.genres?.length || 0) - 2}
              </span>
            )}
          </div>

          {/* Prix */}
          {artist.priceRange && (
            <div className="text-right">
              <span className="text-primary font-semibold text-sm">
                {artist.priceRange}€
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

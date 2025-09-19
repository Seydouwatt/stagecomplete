import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { PublicSearchBar } from '../../components/public/PublicSearchBar';
import { FeaturedArtists } from '../../components/public/FeaturedArtists';
import { artistService } from '../../services/artistService';
import type { PublicArtistProfile, ArtistSearchFilters } from '../../types';

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [artists, setArtists] = useState<PublicArtistProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';
  const genres = searchParams.get('genres')?.split(',') || [];
  const limit = 12;

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, location, currentPage]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: ArtistSearchFilters = {
        limit,
        offset: (currentPage - 1) * limit,
      };

      // Ajouter les filtres basés sur les paramètres URL
      if (query) {
        // Pour l'instant, on utilise les genres comme approximation
        // TODO: Implémenter la recherche full-text côté backend
        const possibleGenres = query.split(' ').filter(term =>
          ['jazz', 'rock', 'pop', 'blues', 'folk', 'classical'].includes(term.toLowerCase())
        );
        if (possibleGenres.length > 0) {
          filters.genres = possibleGenres;
        }
      }

      if (location) {
        filters.location = location;
      }

      if (genres.length > 0) {
        filters.genres = [...(filters.genres || []), ...genres];
      }

      const response = await artistService.searchArtists(filters);

      setArtists(response.artists);
      setTotalResults(response.total);
      setHasMore(response.hasMore);

    } catch (err) {
      console.error('Search error:', err);
      setError('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery: string, newLocation?: string) => {
    const newSearchParams = new URLSearchParams();
    if (newQuery) newSearchParams.set('q', newQuery);
    if (newLocation) newSearchParams.set('location', newLocation);

    window.history.pushState({}, '', `${window.location.pathname}?${newSearchParams.toString()}`);
    setCurrentPage(1);
    performSearch();
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Si pas de query, afficher la page de découverte
  if (!query) {
    return <DiscoveryPage onSearch={handleSearch} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec recherche */}
      <section className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <PublicSearchBar
                placeholder={query}
                onSearch={handleSearch}
                size="md"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline gap-2 lg:btn-sm"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              Filtres
              {showFilters && <span className="badge badge-primary badge-sm">ON</span>}
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
            {loading ? 'Recherche en cours...' : `${totalResults} artiste(s) trouvé(s)`}
          </p>
        </div>

        {/* Chargement */}
        {loading && currentPage === 1 && (
          <div className="flex justify-center py-12">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* Grille d'artistes */}
        {!loading && artists.length > 0 && (
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
        {!loading && artists.length === 0 && query && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez avec d'autres termes de recherche ou élargissez votre zone géographique
            </p>

            <div className="space-y-2 max-w-md mx-auto text-left">
              <p className="text-sm text-gray-600"><strong>Suggestions :</strong></p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Vérifiez l'orthographe</li>
                <li>• Utilisez des termes plus généraux (ex: "rock" au lieu de "rock progressif")</li>
                <li>• Essayez sans spécifier de ville</li>
              </ul>
            </div>
          </div>
        )}

        {/* Bouton "Charger plus" */}
        {!loading && hasMore && (
          <div className="text-center">
            <button
              onClick={loadMore}
              className="btn btn-outline btn-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Charger plus d\'artistes'
              )}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

// Page de découverte quand pas de recherche
const DiscoveryPage: React.FC<{ onSearch: (query: string, location?: string) => void }> = ({ onSearch }) => {
  return (
    <div className="min-h-screen">
      {/* Hero de recherche */}
      <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
        <div className="container mx-auto px-4 text-center">
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
  const profilePhoto = artist.coverPhoto || artist.portfolio?.photos?.[0];

  return (
    <Link to={`/artist/${artist.publicSlug}`} className="group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
        {/* Photo */}
        <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={artist.artistName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {artist.artistName?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
              {artist.artistType === 'SOLO' ? 'Solo' : 'Groupe'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary transition-colors">
            {artist.artistName}
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
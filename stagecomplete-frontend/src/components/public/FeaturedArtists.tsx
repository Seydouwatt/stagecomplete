import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { artistService } from '../../services/artistService';
import type { PublicArtistProfile } from '../../types';

interface FeaturedArtistsProps {
  className?: string;
  limit?: number;
  showViewAll?: boolean;
}

export const FeaturedArtists: React.FC<FeaturedArtistsProps> = ({
  className = "",
  limit = 6,
  showViewAll = true
}) => {
  const [artists, setArtists] = useState<PublicArtistProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedArtists = async () => {
      try {
        setLoading(true);
        setError(null);

        // Pour le moment, on utilise la recherche générale
        // TODO: Implémenter l'endpoint getFeaturedArtists spécifique
        const response = await artistService.searchArtists({
          limit,
          offset: 0
        });

        setArtists(response.artists);
      } catch (err) {
        console.error('Error loading featured artists:', err);
        setError('Impossible de charger les artistes mis en avant');
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedArtists();
  }, [limit]);

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun artiste mis en avant pour le moment</p>
        </div>
      </div>
    );
  }

  return (
    <section className={`${className}`} data-cy="featured-artists">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Artistes mis en avant</h2>
          <p className="text-gray-600 mt-2">Découvrez les talents de votre région</p>
        </div>

        {showViewAll && (
          <Link
            to="/directory"
            className="btn btn-outline gap-2 hover:btn-primary"
          >
            Voir tous les artistes
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist, index) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ArtistCard artist={artist} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

interface ArtistCardProps {
  artist: PublicArtistProfile;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const profilePhoto = artist.coverPhoto || artist.portfolio?.photos?.[0];
  const rating = 4.5; // TODO: Implémenter système de rating

  return (
    <Link to={`/artist/${artist.publicSlug}`} className="group">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
        {/* Photo de profil */}
        <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={artist.artistName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {artist.artistName?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
            </div>
          )}

          {/* Badge type d'artiste */}
          <div className="absolute top-3 left-3">
            <span className="bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              {artist.artistType === 'SOLO' ? 'Solo' : 'Groupe'}
            </span>
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
            <StarSolidIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">{rating}</span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {artist.artistName}
          </h3>

          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPinIcon className="w-4 h-4" />
            <span className="text-sm">{artist.baseLocation}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {artist.artistDescription || 'Artiste passionné de musique...'}
          </p>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {artist.genres?.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs font-medium"
              >
                {genre}
              </span>
            ))}
            {(artist.genres?.length || 0) > 3 && (
              <span className="text-gray-400 text-xs">
                +{(artist.genres?.length || 0) - 3}
              </span>
            )}
          </div>

          {/* Prix indicatif */}
          {artist.priceRange && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">À partir de</span>
              <span className="font-semibold text-primary">{artist.priceRange}€</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
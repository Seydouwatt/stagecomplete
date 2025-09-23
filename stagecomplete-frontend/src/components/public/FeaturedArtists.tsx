import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { artistService } from "../../services/artistService";
import type { PublicArtistProfile } from "../../types";
import ArtistCard from "../artist/ArtistCard";

interface FeaturedArtistsProps {
  className?: string;
  limit?: number;
  showViewAll?: boolean;
}

export const FeaturedArtists: React.FC<FeaturedArtistsProps> = ({
  className = "",
  limit = 6,
  showViewAll = true,
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
          offset: 0,
        });

        setArtists(response.artists);
      } catch (err) {
        console.error("Error loading featured artists:", err);
        setError("Impossible de charger les artistes mis en avant");
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
          <p className="text-gray-500">
            Aucun artiste mis en avant pour le moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className={`${className}`} data-cy="featured-artists">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Artistes mis en avant
          </h2>
          <p className="text-gray-600 mt-2">
            Découvrez les talents de votre région
          </p>
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

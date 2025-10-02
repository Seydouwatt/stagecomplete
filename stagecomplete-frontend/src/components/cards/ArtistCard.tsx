import React, { useState } from "react";
import {
  MapPin,
  Star,
  Heart,
  MessageSquare,
  Calendar,
  Music,
  ExternalLink,
  Play,
} from "lucide-react";
import { motion } from "framer-motion";

interface Artist {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  location: string;
  genres: string[];
  rating: number;
  reviewCount: number;
  priceRange: string;
  experience: "BEGINNER" | "INTERMEDIATE" | "PROFESSIONAL";
  availability: boolean;
  portfolioImages: string[];
  socialLinks?: {
    spotify?: string;
    youtube?: string;
    instagram?: string;
  };
}

interface ArtistCardProps {
  artist: Artist;
  onContact: (artistId: string) => void;
  onFavorite: (artistId: string) => void;
  isFavorited?: boolean;
  showActions?: boolean;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  onContact,
  onFavorite,
  isFavorited = false,
  showActions = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getExperienceColor = (exp: Artist["experience"]) => {
    switch (exp) {
      case "BEGINNER":
        return "badge-info";
      case "INTERMEDIATE":
        return "badge-warning";
      case "PROFESSIONAL":
        return "badge-success";
      default:
        return "badge-neutral";
    }
  };

  const getExperienceLabel = (exp: Artist["experience"]) => {
    switch (exp) {
      case "BEGINNER":
        return "Débutant";
      case "INTERMEDIATE":
        return "Intermédiaire";
      case "PROFESSIONAL":
        return "Professionnel";
      default:
        return exp;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300 overflow-hidden"
      data-cy="artist-card"
      data-experience={artist.experience}
    >
      {/* Image carousel */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={artist.portfolioImages[currentImageIndex] || artist.avatar}
          alt={artist.name}
          className="w-full h-full object-cover"
        />

        {/* Image navigation dots */}
        {artist.portfolioImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {artist.portfolioImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Availability indicator */}
        <div className="absolute top-3 left-3">
          <div
            className={`badge gap-1 ${
              artist.availability ? "badge-success" : "badge-error"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                artist.availability ? "bg-success" : "bg-error"
              }`}
            />
            {artist.availability ? "Disponible" : "Occupé"}
          </div>
        </div>

        {/* Favorite button */}
        {showActions && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1 : 0 }}
            onClick={() => onFavorite(artist.id)}
            className="absolute top-3 right-3 btn btn-circle btn-sm bg-base-100/80 border-none"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorited ? "fill-error text-error" : "text-base-content"
              }`}
            />
          </motion.button>
        )}

        {/* Play button overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center"
        >
          <button className="btn btn-circle btn-lg bg-white/90 border-none text-primary">
            <Play className="w-6 h-6" />
          </button>
        </motion.div>
      </div>

      <div className="card-body p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="card-title text-lg mb-1" data-cy="artist-name">{artist.name}</h3>
            <div className="flex items-center gap-2 text-sm text-base-content/60" data-cy="artist-location">
              <MapPin className="w-4 h-4" />
              {artist.location}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-medium">{artist.rating}</span>
              <span className="text-sm text-base-content/60">
                ({artist.reviewCount})
              </span>
            </div>
            <div
              className={`badge badge-sm ${getExperienceColor(
                artist.experience
              )}`}
            >
              {getExperienceLabel(artist.experience)}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
          {artist.bio}
        </p>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3" data-cy="artist-genres">
          {artist.genres.slice(0, 3).map((genre) => (
            <span key={genre} className="badge badge-primary badge-sm">
              {genre}
            </span>
          ))}
          {artist.genres.length > 3 && (
            <span className="badge badge-ghost badge-sm">
              +{artist.genres.length - 3}
            </span>
          )}
        </div>

        {/* Price & Social */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-primary">
            {artist.priceRange}
          </div>

          <div className="flex items-center gap-2">
            {artist.socialLinks?.spotify && (
              <button className="btn btn-ghost btn-xs">
                <Music className="w-3 h-3" />
              </button>
            )}
            {artist.socialLinks?.youtube && (
              <button className="btn btn-ghost btn-xs">
                <Play className="w-3 h-3" />
              </button>
            )}
            {artist.socialLinks?.instagram && (
              <button className="btn btn-ghost btn-xs">
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="card-actions justify-end gap-2">
            <button className="btn btn-outline btn-sm">
              <Calendar className="w-4 h-4" />
              Voir dispo
            </button>
            <button
              onClick={() => onContact(artist.id)}
              className="btn btn-primary btn-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Contacter
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

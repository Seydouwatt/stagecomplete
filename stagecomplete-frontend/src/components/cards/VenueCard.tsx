import React, { useState } from "react";
import {
  MapPin,
  Star,
  Heart,
  MessageSquare,
  Calendar,
  Users,
  Wifi,
  Car,
  Music2,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

interface Venue {
  id: string;
  name: string;
  description: string;
  images: string[];
  location: string;
  address: string;
  capacity: number;
  venueType: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  equipment: string[];
  amenities: string[];
  availability: boolean;
  website?: string;
}

interface VenueCardProps {
  venue: Venue;
  onContact: (venueId: string) => void;
  onFavorite: (venueId: string) => void;
  isFavorited?: boolean;
  showActions?: boolean;
}

export const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  onContact,
  onFavorite,
  isFavorited = false,
  showActions = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getVenueTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "bar":
        return "🍺";
      case "club":
        return "🎊";
      case "theater":
        return "🎭";
      case "restaurant":
        return "🍽️";
      case "festival":
        return "🎪";
      default:
        return "🎵";
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-3 h-3" />;
      case "parking":
        return <Car className="w-3 h-3" />;
      case "sound_system":
        return <Music2 className="w-3 h-3" />;
      default:
        return null;
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
    >
      {/* Image carousel */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={venue.images[currentImageIndex]}
          alt={venue.name}
          className="w-full h-full object-cover"
        />

        {/* Image navigation */}
        {venue.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {venue.images.map((_, index) => (
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

        {/* Venue type badge */}
        <div className="absolute top-3 left-3">
          <div className="badge badge-secondary gap-1">
            <span className="text-lg">{getVenueTypeIcon(venue.venueType)}</span>
            {venue.venueType}
          </div>
        </div>

        {/* Availability indicator */}
        <div className="absolute top-3 right-12">
          <div
            className={`badge gap-1 ${
              venue.availability ? "badge-success" : "badge-error"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                venue.availability ? "bg-success" : "bg-error"
              }`}
            />
            {venue.availability ? "Libre" : "Complet"}
          </div>
        </div>

        {/* Favorite button */}
        {showActions && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1 : 0 }}
            onClick={() => onFavorite(venue.id)}
            className="absolute top-3 right-3 btn btn-circle btn-sm bg-base-100/80 border-none"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorited ? "fill-error text-error" : "text-base-content"
              }`}
            />
          </motion.button>
        )}
      </div>

      <div className="card-body p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="card-title text-lg mb-1">{venue.name}</h3>
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <MapPin className="w-4 h-4" />
              {venue.location}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-medium">{venue.rating}</span>
              <span className="text-sm text-base-content/60">
                ({venue.reviewCount})
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-base-content/60">
              <Users className="w-4 h-4" />
              {venue.capacity} places
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
          {venue.description}
        </p>

        {/* Equipment */}
        <div className="flex flex-wrap gap-1 mb-2">
          {venue.equipment.slice(0, 3).map((item) => (
            <span key={item} className="badge badge-accent badge-sm">
              {item}
            </span>
          ))}
          {venue.equipment.length > 3 && (
            <span className="badge badge-ghost badge-sm">
              +{venue.equipment.length - 3}
            </span>
          )}
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-2 mb-4">
          {venue.amenities.slice(0, 3).map((amenity) => (
            <div
              key={amenity}
              className="flex items-center gap-1 text-xs text-base-content/60"
            >
              {getAmenityIcon(amenity)}
              <span>{amenity}</span>
            </div>
          ))}
        </div>

        {/* Price & Website */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-secondary">
            {venue.priceRange}
          </div>

          {venue.website && (
            <button className="btn btn-ghost btn-xs">
              <ExternalLink className="w-3 h-3" />
              Site web
            </button>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="card-actions justify-end gap-2">
            <button className="btn btn-outline btn-sm">
              <Calendar className="w-4 h-4" />
              Calendrier
            </button>
            <button
              onClick={() => onContact(venue.id)}
              className="btn btn-secondary btn-sm"
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

import { Link } from "react-router-dom";
import type { ArtistCardSmallProps, PublicArtistProfile } from "../../types";
import { getMainPhoto } from "../../types";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

interface ArtistCardProps {
  artist: PublicArtistProfile | ArtistCardSmallProps;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  // Utiliser la stratégie unifiée: première photo du portfolio = photo principale
  const profilePhoto = getMainPhoto(artist);
  const rating = 4.5; // TODO: Implémenter système de rating

  return (
    <Link to={`/artist/${artist.publicSlug}`} className="group">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
        {/* Photo de profil */}
        <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={artist.profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {artist.profile.name?.[0]?.toUpperCase() || "A"}
                </span>
              </div>
            </div>
          )}

          {/* Badge type d'artiste */}
          <div className="absolute top-3 left-3">
            <span className="bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              {artist.artistType === "SOLO" ? "Solo" : "Groupe"}
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
            {artist.profile.name}
          </h3>

          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPinIcon className="w-4 h-4" />
            <span className="text-sm">{artist.baseLocation}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {artist.artistDescription || "Artiste passionné de musique..."}
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
              <span className="font-semibold text-primary">
                {artist.priceRange}€
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ArtistCard;

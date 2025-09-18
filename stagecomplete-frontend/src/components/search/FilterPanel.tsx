import React, { useState } from "react";
import { X, MapPin, Calendar, DollarSign, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterOptions {
  genres: string[];
  locations: string[];
  priceRange: [number, number];
  availability: string;
  rating: number;
  capacity?: [number, number]; // Pour venues
  experience?: string; // Pour artistes
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: FilterOptions) => void;
  userRole: "ARTIST" | "VENUE" | "ADMIN" | "MEMBER";
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  onFiltersChange,
  userRole,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    locations: [],
    priceRange: [0, 5000],
    availability: "",
    rating: 0,
    capacity: [0, 1000],
    experience: "",
  });

  const genres = [
    "Jazz",
    "Blues",
    "Rock",
    "Pop",
    "Electronic",
    "Classical",
    "Hip Hop",
    "R&B",
    "Country",
    "Folk",
    "Reggae",
    "Punk",
  ];

  const locations = [
    "Paris",
    "Lyon",
    "Marseille",
    "Toulouse",
    "Nice",
    "Nantes",
    "Strasbourg",
    "Montpellier",
    "Bordeaux",
    "Lille",
  ];

  const handleGenreToggle = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre];

    const newFilters = { ...filters, genres: newGenres };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter((l) => l !== location)
      : [...filters.locations, location];

    const newFilters = { ...filters, locations: newLocations };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters: FilterOptions = {
      genres: [],
      locations: [],
      priceRange: [0, 5000],
      availability: "",
      rating: 0,
      capacity: [0, 1000],
      experience: "",
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-base-100 z-50 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-base-300">
              <h2 className="text-xl font-semibold">Filtres</h2>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Genres */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  🎵 Genres musicaux
                </h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`btn btn-sm ${
                        filters.genres.includes(genre)
                          ? "btn-primary"
                          : "btn-outline"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Localisation */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Localisation
                </h3>
                <div className="flex flex-wrap gap-2">
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => handleLocationToggle(location)}
                      className={`btn btn-sm ${
                        filters.locations.includes(location)
                          ? "btn-secondary"
                          : "btn-outline"
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {userRole === "VENUE"
                    ? "Budget par événement"
                    : "Tarif par prestation"}
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => {
                      const newFilters = {
                        ...filters,
                        priceRange: [0, parseInt(e.target.value)] as [
                          number,
                          number
                        ],
                      };
                      setFilters(newFilters);
                      onFiltersChange(newFilters);
                    }}
                    className="range range-primary"
                  />
                  <div className="flex justify-between text-sm text-base-content/60">
                    <span>€0</span>
                    <span>€{filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4" /> Note minimum
                </h3>
                <div className="rating rating-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <input
                      key={star}
                      type="radio"
                      name="rating"
                      className="mask mask-star-2 bg-warning"
                      checked={filters.rating === star}
                      onChange={() => {
                        const newFilters = { ...filters, rating: star };
                        setFilters(newFilters);
                        onFiltersChange(newFilters);
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Venue specific filters */}
              {userRole === "VENUE" && (
                <div>
                  <h3 className="font-medium mb-3">Expérience artiste</h3>
                  <select
                    value={filters.experience}
                    onChange={(e) => {
                      const newFilters = {
                        ...filters,
                        experience: e.target.value,
                      };
                      setFilters(newFilters);
                      onFiltersChange(newFilters);
                    }}
                    className="select select-bordered w-full"
                  >
                    <option value="">Toutes expériences</option>
                    <option value="BEGINNER">Débutant</option>
                    <option value="INTERMEDIATE">Intermédiaire</option>
                    <option value="PROFESSIONAL">Professionnel</option>
                  </select>
                </div>
              )}

              {/* Artist specific filters */}
              {userRole === "ARTIST" && (
                <div>
                  <h3 className="font-medium mb-3">Capacité venue</h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="50"
                      value={filters.capacity?.[1] || 1000}
                      onChange={(e) => {
                        const newFilters = {
                          ...filters,
                          capacity: [0, parseInt(e.target.value)] as [
                            number,
                            number
                          ],
                        };
                        setFilters(newFilters);
                        onFiltersChange(newFilters);
                      }}
                      className="range range-secondary"
                    />
                    <div className="flex justify-between text-sm text-base-content/60">
                      <span>0 places</span>
                      <span>{filters.capacity?.[1]} places</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Disponibilité */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Disponibilité
                </h3>
                <select
                  value={filters.availability}
                  onChange={(e) => {
                    const newFilters = {
                      ...filters,
                      availability: e.target.value,
                    };
                    setFilters(newFilters);
                    onFiltersChange(newFilters);
                  }}
                  className="select select-bordered w-full"
                >
                  <option value="">Toutes dates</option>
                  <option value="this_week">Cette semaine</option>
                  <option value="this_month">Ce mois</option>
                  <option value="next_month">Mois prochain</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetFilters}
                  className="btn btn-outline flex-1"
                >
                  Réinitialiser
                </button>
                <button onClick={onClose} className="btn btn-primary flex-1">
                  Appliquer
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

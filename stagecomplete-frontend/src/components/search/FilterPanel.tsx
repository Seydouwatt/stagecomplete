import React, { useState, useEffect } from "react";
import { X, MapPin, DollarSign, Music, Award, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuickFilters } from "../../hooks/useAdvancedSearch";
import type { AdvancedSearchQuery, Experience } from "../../types";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AdvancedSearchQuery;
  onFiltersChange: (filters: AdvancedSearchQuery) => void;
  resultsCount?: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  resultsCount = 0,
}) => {
  const { filters: quickFilters, isLoading: filtersLoading } = useQuickFilters();
  const [localFilters, setLocalFilters] = useState<AdvancedSearchQuery>(filters);

  // Sync local filters with props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilters = (updates: Partial<AdvancedSearchQuery>) => {
    const newFilters = { ...localFilters, ...updates };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleGenreToggle = (genre: string) => {
    const currentGenres = localFilters.genres || [];
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter((g) => g !== genre)
      : [...currentGenres, genre];

    updateFilters({ genres: newGenres.length > 0 ? newGenres : undefined });
  };

  const handleInstrumentToggle = (instrument: string) => {
    const currentInstruments = localFilters.instruments || [];
    const newInstruments = currentInstruments.includes(instrument)
      ? currentInstruments.filter((i) => i !== instrument)
      : [...currentInstruments, instrument];

    updateFilters({
      instruments: newInstruments.length > 0 ? newInstruments : undefined,
    });
  };

  const resetFilters = () => {
    const resetFilters: AdvancedSearchQuery = {
      q: localFilters.q, // Keep search query
      limit: localFilters.limit,
      offset: 0,
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const hasActiveFilters = () => {
    return !!(
      localFilters.genres?.length ||
      localFilters.instruments?.length ||
      localFilters.location ||
      localFilters.experience ||
      localFilters.minPrice ||
      localFilters.maxPrice ||
      localFilters.availableOnly
    );
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
            data-cy="filter-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-base-300 bg-primary text-primary-content sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-semibold">Filtres</h2>
                <p className="text-sm opacity-90">
                  {resultsCount} résultat{resultsCount !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-sm btn-circle text-primary-content"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Available Now Filter */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={localFilters.availableOnly || false}
                    onChange={(e) =>
                      updateFilters({ availableOnly: e.target.checked || undefined })
                    }
                  />
                  <div>
                    <span className="label-text font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Disponible maintenant
                    </span>
                    <span className="label-text-alt">Profils actifs récemment</span>
                  </div>
                </label>
              </div>

              <div className="divider"></div>

              {/* Genres */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  🎵 Genres musicaux
                  {localFilters.genres && localFilters.genres.length > 0 && (
                    <span className="badge badge-primary badge-sm">
                      {localFilters.genres.length}
                    </span>
                  )}
                </h3>
                {filtersLoading ? (
                  <div className="flex justify-center py-4">
                    <span className="loading loading-spinner loading-sm"></span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {quickFilters?.genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => handleGenreToggle(genre)}
                        className={`btn btn-sm ${
                          localFilters.genres?.includes(genre)
                            ? "btn-primary"
                            : "btn-outline"
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Instruments */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Music className="w-4 h-4" /> Instruments
                  {localFilters.instruments && localFilters.instruments.length > 0 && (
                    <span className="badge badge-secondary badge-sm">
                      {localFilters.instruments.length}
                    </span>
                  )}
                </h3>
                {filtersLoading ? (
                  <div className="flex justify-center py-4">
                    <span className="loading loading-spinner loading-sm"></span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {quickFilters?.instruments.slice(0, 12).map((instrument) => (
                      <button
                        key={instrument}
                        onClick={() => handleInstrumentToggle(instrument)}
                        className={`btn btn-sm ${
                          localFilters.instruments?.includes(instrument)
                            ? "btn-secondary"
                            : "btn-outline"
                        }`}
                      >
                        {instrument}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Localisation */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Localisation
                </h3>
                <div className="form-control">
                  <input
                    type="text"
                    placeholder="Ex: Paris, Lyon..."
                    className="input input-bordered"
                    value={localFilters.location || ""}
                    onChange={(e) =>
                      updateFilters({
                        location: e.target.value || undefined,
                      })
                    }
                    list="locations-list"
                  />
                  <datalist id="locations-list">
                    {quickFilters?.locations.map((loc) => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Prix */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Fourchette de prix
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text-alt">Prix min (€)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        className="input input-bordered input-sm"
                        value={localFilters.minPrice || ""}
                        onChange={(e) =>
                          updateFilters({
                            minPrice: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text-alt">Prix max (€)</span>
                      </label>
                      <input
                        type="number"
                        placeholder="5000"
                        className="input input-bordered input-sm"
                        value={localFilters.maxPrice || ""}
                        onChange={(e) =>
                          updateFilters({
                            maxPrice: e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Quick price ranges */}
                  <div className="flex flex-wrap gap-2">
                    {["0-200", "200-500", "500-1000", "1000-2000", "2000+"].map(
                      (range) => (
                        <button
                          key={range}
                          onClick={() => {
                            const [min, max] = range.split("-");
                            updateFilters({
                              minPrice: parseInt(min),
                              maxPrice: max === "+" ? undefined : parseInt(max),
                            });
                          }}
                          className="btn btn-xs btn-outline"
                        >
                          {range}€
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Expérience */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Niveau d'expérience
                </h3>
                <select
                  value={localFilters.experience || ""}
                  onChange={(e) =>
                    updateFilters({
                      experience: (e.target.value as Experience) || undefined,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Tous niveaux</option>
                  <option value="BEGINNER">Débutant</option>
                  <option value="INTERMEDIATE">Intermédiaire</option>
                  <option value="PROFESSIONAL">Professionnel</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-base-100 pb-4">
                <button
                  onClick={resetFilters}
                  className="btn btn-outline flex-1"
                  disabled={!hasActiveFilters()}
                >
                  Réinitialiser
                </button>
                <button onClick={onClose} className="btn btn-primary flex-1">
                  Appliquer ({resultsCount})
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

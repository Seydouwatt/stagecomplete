import { useRef, useEffect } from "react";
import { Grid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ArtistCard } from "../cards/ArtistCard";
import { VenueCard } from "../cards/VenueCard";

interface BrowseGridProps<T> {
  items: T[];
  itemType: "artist" | "venue";
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onItemContact: (id: string) => void;
  onItemFavorite: (id: string) => void;
  favoritedItems: string[];
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

export function BrowseGrid<T extends { id: string }>({
  items,
  itemType,
  isLoading = false,

  onItemContact,
  onItemFavorite,
  favoritedItems,
  viewMode = "grid",
  onViewModeChange,
}: BrowseGridProps<T>) {
  // Track previous items length to animate only new items
  const prevItemsLengthRef = useRef(0);

  useEffect(() => {
    // Update previous length after animation
    const timer = setTimeout(() => {
      prevItemsLengthRef.current = items.length;
    }, 500);
    return () => clearTimeout(timer);
  }, [items.length]);

  const renderItem = (item: T, index: number) => {
    const baseProps = {
      key: item.id,
      onContact: onItemContact,
      onFavorite: onItemFavorite,
      isFavorited: favoritedItems.includes(item.id),
    };

    // Only animate newly loaded items, not all items
    const isNewItem = index >= prevItemsLengthRef.current;
    const localIndex = isNewItem ? index - prevItemsLengthRef.current : 0;
    const animationDelay = isNewItem ? Math.min(localIndex * 0.05, 0.3) : 0;

    return (
      <motion.div
        initial={isNewItem ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: animationDelay, duration: 0.3 }}
      >
        {itemType === "artist" ? (
          <ArtistCard artist={item as any} {...baseProps} />
        ) : (
          <VenueCard venue={item as any} {...baseProps} />
        )}
      </motion.div>
    );
  };

  const gridClass =
    viewMode === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      : "flex flex-col gap-4";

  return (
    <div>
      {/* View Mode Toggle */}
      {onViewModeChange && (
        <div className="flex justify-end mb-6">
          <div className="join">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`join-item btn btn-sm ${
                viewMode === "grid" ? "btn-active" : ""
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`join-item btn btn-sm ${
                viewMode === "list" ? "btn-active" : ""
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-base-content/60" data-cy="results-count">
          {items.length} {itemType === "artist" ? "artistes" : "venues"} trouvé
          {items.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={gridClass}
          data-cy="browse-grid"
        >
          {items.map((item, index) => renderItem(item, index))}
        </motion.div>
      </AnimatePresence>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-8" data-cy="loading-indicator">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && !isLoading && (
        <div className="text-center py-12" data-cy="no-results">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Aucun résultat</h3>
          <p className="text-base-content/60" data-cy="search-tips">
            Essayez de modifier vos filtres ou votre recherche
          </p>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
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
  hasMore = false,
  onLoadMore,
  onItemContact,
  onItemFavorite,
  favoritedItems,
  viewMode = "grid",
  onViewModeChange,
}: BrowseGridProps<T>) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Pagination locale
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Infinite scroll
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 &&
      hasMore &&
      !isLoading &&
      onLoadMore
    ) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const renderItem = (item: T, index: number) => {
    const baseProps = {
      key: item.id,
      onContact: onItemContact,
      onFavorite: onItemFavorite,
      isFavorited: favoritedItems.includes(item.id),
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
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
        <p className="text-sm text-base-content/60">
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
        >
          {paginatedItems.map((item, index) => renderItem(item, index))}
        </motion.div>
      </AnimatePresence>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !onLoadMore && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="join-item btn btn-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (pageNum) =>
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - page) <= 1
              )
              .map((pageNum, index, array) => (
                <React.Fragment key={pageNum}>
                  {index > 0 && array[index - 1] !== pageNum - 1 && (
                    <span className="join-item btn btn-sm btn-disabled">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => setPage(pageNum)}
                    className={`join-item btn btn-sm ${
                      page === pageNum ? "btn-active" : ""
                    }`}
                  >
                    {pageNum}
                  </button>
                </React.Fragment>
              ))}

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="join-item btn btn-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Load more button */}
      {hasMore && onLoadMore && !isLoading && (
        <div className="flex justify-center mt-8">
          <button onClick={onLoadMore} className="btn btn-outline">
            Charger plus
          </button>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Aucun résultat</h3>
          <p className="text-base-content/60">
            Essayez de modifier vos filtres ou votre recherche
          </p>
        </div>
      )}
    </div>
  );
}

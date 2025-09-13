import React, { useState, useRef, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface SearchSuggestion {
  id: string;
  type: "artist" | "venue" | "genre" | "location";
  title: string;
  subtitle?: string;
  avatar?: string;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFilterClick?: () => void;
  suggestions?: SearchSuggestion[];
  isLoading?: boolean;
  showFilters?: boolean;
  value?: string; // optional controlled value
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Rechercher des artistes, venues, genres...",
  onSearch,
  onFilterClick,
  suggestions = [],
  isLoading = false,
  showFilters = true,
  value,
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length > 0 && suggestions.length > 0 && isFocused) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query, suggestions, isFocused]);

  // Sync controlled value into local state when provided
  useEffect(() => {
    if (typeof value === "string" && value !== query) {
      setQuery(value);
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    onSearch(suggestion.title);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "artist":
        return "🎭";
      case "venue":
        return "🎪";
      case "genre":
        return "🎵";
      case "location":
        return "📍";
      default:
        return "🔍";
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="input input-bordered w-full pl-12 pr-20 py-3 text-lg focus:ring-2 focus:ring-primary"
          />

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {showFilters && (
              <button
                type="button"
                onClick={onFilterClick}
                className="btn btn-ghost btn-sm"
              >
                <Filter className="w-4 h-4" />
                Filtres
              </button>
            )}
          </div>

          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="loading loading-spinner loading-sm"></div>
            </div>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-base-100 rounded-lg shadow-xl border border-base-300 max-h-96 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center gap-3 p-4 hover:bg-base-200 transition-colors duration-200 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-lg">
                  {suggestion.avatar ? (
                    <img
                      src={suggestion.avatar}
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getSuggestionIcon(suggestion.type)
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-base-content">
                    {suggestion.title}
                  </p>
                  {suggestion.subtitle && (
                    <p className="text-sm text-base-content/60">
                      {suggestion.subtitle}
                    </p>
                  )}
                </div>
                <div className="text-xs text-base-content/40 capitalize">
                  {suggestion.type}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

interface SearchSuggestion {
  type: 'genre' | 'artist' | 'location';
  value: string;
  label: string;
}

interface PublicSearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string, location?: string) => void;
  showSuggestions?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const POPULAR_GENRES = [
  'Jazz', 'Rock', 'Pop', 'Blues', 'Folk', 'Classical',
  'Electronic', 'Hip-Hop', 'R&B', 'Country', 'Reggae', 'Punk'
];

const POPULAR_LOCATIONS = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes',
  'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'
];

export const PublicSearchBar: React.FC<PublicSearchBarProps> = ({
  className = "",
  placeholder = "Recherchez des artistes, genres musicaux...",
  onSearch,
  showSuggestions = true,
  size = 'lg'
}) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg'
  };

  // Générer suggestions basées sur la query
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const newSuggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // Suggestions de genres
    POPULAR_GENRES
      .filter(genre => genre.toLowerCase().includes(queryLower))
      .slice(0, 3)
      .forEach(genre => {
        newSuggestions.push({
          type: 'genre',
          value: genre.toLowerCase(),
          label: `Genre: ${genre}`
        });
      });

    // Suggestions de lieux
    POPULAR_LOCATIONS
      .filter(loc => loc.toLowerCase().includes(queryLower))
      .slice(0, 2)
      .forEach(loc => {
        newSuggestions.push({
          type: 'location',
          value: loc,
          label: `Artistes à ${loc}`
        });
      });

    // Suggestion de recherche directe
    if (query.length > 2) {
      newSuggestions.unshift({
        type: 'artist',
        value: query,
        label: `Rechercher "${query}"`
      });
    }

    setSuggestions(newSuggestions.slice(0, 5));
  }, [query]);

  // Fermer suggestions au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestionsList(false);
        setActiveSuggestion(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery?: string, searchLocation?: string) => {
    const finalQuery = searchQuery || query;
    const finalLocation = searchLocation || location;

    if (!finalQuery.trim()) return;

    // Construire URL de recherche
    const params = new URLSearchParams();
    params.set('q', finalQuery);
    if (finalLocation) params.set('location', finalLocation);

    // Callback custom ou navigation
    if (onSearch) {
      onSearch(finalQuery, finalLocation);
    } else {
      navigate(`/search?${params.toString()}`);
    }

    setShowSuggestionsList(false);
    setActiveSuggestion(-1);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'location') {
      handleSearch(query, suggestion.value);
    } else {
      setQuery(suggestion.value);
      handleSearch(suggestion.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestionsList) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestion(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestion >= 0) {
          handleSuggestionClick(suggestions[activeSuggestion]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestionsList(false);
        setActiveSuggestion(-1);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`} data-cy="public-search-bar">
      <div className={`flex bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow ${sizeClasses[size]}`}>
        {/* Champ de recherche principal */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            className="w-full h-full pl-6 pr-4 rounded-l-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => showSuggestions && setShowSuggestionsList(true)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Séparateur */}
        <div className="w-px bg-gray-300 my-2"></div>

        {/* Champ localisation */}
        <div className="flex items-center">
          <MapPinIcon className="w-5 h-5 text-gray-400 ml-4" />
          <input
            type="text"
            className="w-32 h-full px-2 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
            placeholder="Ville"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Bouton recherche */}
        <button
          onClick={() => handleSearch()}
          className="bg-primary hover:bg-primary-focus text-primary-content px-6 rounded-r-full transition-colors flex items-center justify-center min-w-[60px]"
          type="button"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
          <span className="ml-2 hidden sm:inline">Rechercher</span>
        </button>
      </div>

      {/* Liste des suggestions */}
      {showSuggestions && showSuggestionsList && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.value}`}
              className={`w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                index === activeSuggestion ? 'bg-primary/10' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setActiveSuggestion(index)}
            >
              <div className={`w-2 h-2 rounded-full ${
                suggestion.type === 'genre' ? 'bg-blue-400' :
                suggestion.type === 'location' ? 'bg-green-400' : 'bg-purple-400'
              }`} />
              <span className="text-gray-800">{suggestion.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
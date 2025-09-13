import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MultiSelectProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
  allowCustom?: boolean;
  className?: string;
  error?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  maxSelections,
  allowCustom = false,
  className = "",
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customInput, setCustomInput] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
        setCustomInput("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtrer les options selon le terme de recherche
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !value.includes(option)
  );

  // Ajouter une option
  const addOption = (option: string) => {
    if (!value.includes(option) && (!maxSelections || value.length < maxSelections)) {
      onChange([...value, option]);
      setSearchTerm("");
    }
  };

  // Supprimer une option
  const removeOption = (option: string) => {
    onChange(value.filter(item => item !== option));
  };

  // Ajouter une option personnalisée
  const addCustomOption = () => {
    const trimmedInput = customInput.trim();
    if (trimmedInput && !value.includes(trimmedInput) && (!maxSelections || value.length < maxSelections)) {
      onChange([...value, trimmedInput]);
      setCustomInput("");
      setSearchTerm("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && allowCustom && customInput.trim()) {
      e.preventDefault();
      addCustomOption();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`form-control w-full ${className}`} ref={dropdownRef}>
      <label className="label">
        <span className="label-text font-medium">{label}</span>
        {maxSelections && (
          <span className="label-text-alt text-base-content/60">
            {value.length}/{maxSelections}
          </span>
        )}
      </label>

      {/* Sélections actuelles */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((item) => (
            <span
              key={item}
              className="badge badge-primary gap-2 py-3 px-3"
            >
              {item}
              <button
                type="button"
                onClick={() => removeOption(item)}
                className="btn btn-ghost btn-xs w-4 h-4 p-0 hover:bg-primary-focus"
                aria-label={`Supprimer ${item}`}
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <div className="relative">
        <button
          type="button"
          className={`input input-bordered w-full flex items-center justify-between ${
            error ? 'input-error' : ''
          } ${isOpen ? 'input-focus' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          disabled={maxSelections ? value.length >= maxSelections : false}
        >
          <span className={value.length === 0 ? 'text-base-content/50' : ''}>
            {value.length === 0 ? placeholder : `${value.length} sélectionné(s)`}
          </span>
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search input */}
            <div className="p-3 border-b border-base-300">
              <input
                type="text"
                className="input input-bordered input-sm w-full"
                placeholder={allowCustom ? "Rechercher ou ajouter..." : "Rechercher..."}
                value={allowCustom ? customInput : searchTerm}
                onChange={(e) => {
                  if (allowCustom) {
                    setCustomInput(e.target.value);
                  } else {
                    setSearchTerm(e.target.value);
                  }
                }}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              {allowCustom && customInput.trim() && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm w-full mt-2"
                  onClick={addCustomOption}
                  disabled={maxSelections ? value.length >= maxSelections : false}
                >
                  Ajouter "{customInput.trim()}"
                </button>
              )}
            </div>

            {/* Options list */}
            <div className="max-h-40 overflow-y-auto">
              {filteredOptions.length === 0 && !allowCustom ? (
                <div className="p-3 text-center text-base-content/60">
                  Aucune option disponible
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="w-full p-3 text-left hover:bg-base-200 transition-colors"
                    onClick={() => {
                      addOption(option);
                      if (!maxSelections || value.length + 1 >= maxSelections) {
                        setIsOpen(false);
                      }
                    }}
                    disabled={maxSelections ? value.length >= maxSelections : false}
                  >
                    {option}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}

      {/* Help text */}
      {maxSelections && (
        <label className="label">
          <span className="label-text-alt text-base-content/60">
            {maxSelections - value.length > 0 
              ? `Vous pouvez encore sélectionner ${maxSelections - value.length} option(s)`
              : "Limite atteinte"
            }
          </span>
        </label>
      )}
    </div>
  );
};
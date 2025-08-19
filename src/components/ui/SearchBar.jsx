import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Search, X, Clock, TrendingUp, AlertCircle } from "lucide-react";

export const SearchBar = ({
  placeholder = "Buscar...",
  onSearch,
  onChange,
  onClear,
  value = "",
  disabled = false,
  loading = false,
  error = null,
  showSuggestions = true,
  suggestions = [],
  recentSearches = [],
  popularSearches = [],
  debounceMs = 300,
  maxSuggestions = 8,
  clearOnSelect = false,
  autoFocus = false,
  size = "md", // sm, md, lg
  className = "",
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchValue = value !== undefined ? value : internalValue;

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Debounce search
  const debouncedSearch = useCallback(
    (searchTerm) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onSearch?.(searchTerm);
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (e) => {
      const newValue = e.target.value;

      if (value === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
      debouncedSearch(newValue);

      if (newValue.length > 0 && showSuggestions) {
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }

      setHighlightedIndex(-1);
    },
    [value, onChange, debouncedSearch, showSuggestions]
  );

  // Handle clear
  const handleClear = useCallback(() => {
    const newValue = "";

    if (value === undefined) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
    onClear?.();
    setShowDropdown(false);
    setHighlightedIndex(-1);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [value, onChange, onClear]);

  // Handle suggestion select
  const handleSuggestionSelect = useCallback(
    (suggestion) => {
      const newValue = clearOnSelect ? "" : suggestion;

      if (value === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
      onSearch?.(suggestion);
      setShowDropdown(false);
      setHighlightedIndex(-1);

      if (inputRef.current) {
        inputRef.current.blur();
      }
    },
    [value, onChange, onSearch, clearOnSelect]
  );

  // Combine suggestions
  const combinedSuggestions = useMemo(() => {
    const filtered = suggestions.filter(
      (s) =>
        s.toLowerCase().includes(searchValue.toLowerCase()) &&
        s.toLowerCase() !== searchValue.toLowerCase()
    );

    const recent = recentSearches.filter(
      (s) =>
        s.toLowerCase().includes(searchValue.toLowerCase()) &&
        s.toLowerCase() !== searchValue.toLowerCase() &&
        !filtered.includes(s)
    );

    const popular = popularSearches.filter(
      (s) =>
        s.toLowerCase().includes(searchValue.toLowerCase()) &&
        s.toLowerCase() !== searchValue.toLowerCase() &&
        !filtered.includes(s) &&
        !recent.includes(s)
    );

    return [
      ...filtered.slice(0, Math.floor(maxSuggestions * 0.6)),
      ...recent.slice(0, Math.floor(maxSuggestions * 0.2)),
      ...popular.slice(0, Math.floor(maxSuggestions * 0.2)),
    ].slice(0, maxSuggestions);
  }, [
    suggestions,
    recentSearches,
    popularSearches,
    searchValue,
    maxSuggestions,
  ]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showDropdown) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < combinedSuggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleSuggestionSelect(combinedSuggestions[highlightedIndex]);
          } else {
            onSearch?.(searchValue);
            setShowDropdown(false);
            inputRef.current?.blur();
          }
          break;
        case "Escape":
          setShowDropdown(false);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    if (showDropdown) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [
    showDropdown,
    highlightedIndex,
    combinedSuggestions,
    searchValue,
    onSearch,
    handleSuggestionSelect,
  ]);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Size configurations
  const sizeClasses = {
    sm: {
      input: "h-10 px-4 text-sm",
      icon: 16,
      dropdown: "text-sm",
    },
    md: {
      input: "h-12 px-4 text-base",
      icon: 20,
      dropdown: "text-sm",
    },
    lg: {
      input: "h-14 px-6 text-lg",
      icon: 24,
      dropdown: "text-base",
    },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {loading ? (
            <div
              className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"
              style={{ width: currentSize.icon, height: currentSize.icon }}
            />
          ) : (
            <Search size={currentSize.icon} />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            if (searchValue.length > 0 && showSuggestions) {
              setShowDropdown(true);
            }
          }}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            w-full ${
              currentSize.input
            } pl-12 pr-12 rounded-xl border-2 transition-all duration-200
            ${
              disabled
                ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60 text-gray-400"
                : `bg-white ${
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : isFocused || showDropdown
                      ? "border-blue-500 ring-4 ring-blue-100"
                      : "border-gray-200 hover:border-blue-300"
                  } focus:outline-none text-gray-900 placeholder-gray-400`
            }
          `}
        />

        {/* Right side controls */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {searchValue && !disabled && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Limpiar búsqueda"
            >
              <X size={currentSize.icon - 4} />
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showDropdown && showSuggestions && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[9999] animate-in fade-in-0 slide-in-from-top-1 duration-200 max-h-80 overflow-y-auto">
          {combinedSuggestions.length > 0 ? (
            <div className={currentSize.dropdown}>
              {recentSearches.some((s) => combinedSuggestions.includes(s)) && (
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                    <Clock size={12} />
                    Búsquedas recientes
                  </div>
                  {recentSearches
                    .filter((s) => combinedSuggestions.includes(s))
                    .map((suggestion, index) => {
                      const suggestionIndex =
                        combinedSuggestions.indexOf(suggestion);
                      return (
                        <div
                          key={`recent-${index}`}
                          onClick={() => handleSuggestionSelect(suggestion)}
                          onMouseEnter={() =>
                            setHighlightedIndex(suggestionIndex)
                          }
                          className={`
                          px-3 py-2 cursor-pointer transition-colors rounded-lg flex items-center gap-3
                          ${
                            highlightedIndex === suggestionIndex
                              ? "bg-blue-100"
                              : "hover:bg-gray-50"
                          }
                        `}
                        >
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-black">{suggestion}</span>
                        </div>
                      );
                    })}
                </div>
              )}

              {suggestions.filter((s) => combinedSuggestions.includes(s))
                .length > 0 && (
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                    <Search size={12} />
                    Sugerencias
                  </div>
                  {suggestions
                    .filter((s) => combinedSuggestions.includes(s))
                    .map((suggestion, index) => {
                      const suggestionIndex =
                        combinedSuggestions.indexOf(suggestion);
                      return (
                        <div
                          key={`suggestion-${index}`}
                          onClick={() => handleSuggestionSelect(suggestion)}
                          onMouseEnter={() =>
                            setHighlightedIndex(suggestionIndex)
                          }
                          className={`
                          px-3 py-2 cursor-pointer transition-colors rounded-lg flex items-center gap-3
                          ${
                            highlightedIndex === suggestionIndex
                              ? "bg-blue-100"
                              : "hover:bg-gray-50"
                          }
                        `}
                        >
                          <Search size={14} className="text-gray-400" />
                          <span className="text-black">{suggestion}</span>
                        </div>
                      );
                    })}
                </div>
              )}

              {popularSearches.some((s) => combinedSuggestions.includes(s)) && (
                <div className="p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                    <TrendingUp size={12} />
                    Búsquedas populares
                  </div>
                  {popularSearches
                    .filter((s) => combinedSuggestions.includes(s))
                    .map((suggestion, index) => {
                      const suggestionIndex =
                        combinedSuggestions.indexOf(suggestion);
                      return (
                        <div
                          key={`popular-${index}`}
                          onClick={() => handleSuggestionSelect(suggestion)}
                          onMouseEnter={() =>
                            setHighlightedIndex(suggestionIndex)
                          }
                          className={`
                          px-3 py-2 cursor-pointer transition-colors rounded-lg flex items-center gap-3
                          ${
                            highlightedIndex === suggestionIndex
                              ? "bg-blue-100"
                              : "hover:bg-gray-50"
                          }
                        `}
                        >
                          <TrendingUp size={14} className="text-gray-400" />
                          <span className="text-black">{suggestion}</span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          ) : searchValue.length > 0 ? (
            <div className="px-4 py-8 text-center text-gray-400">
              <Search size={24} className="mx-auto mb-2 opacity-50" />
              <p>No se encontraron sugerencias</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

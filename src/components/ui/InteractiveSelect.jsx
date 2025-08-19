import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { ChevronDown, Search, X, Check, AlertCircle } from "lucide-react";

export const InteractiveSelect = ({
  options = [],
  placeholder = "Selecciona una opción",
  onSelect,
  multiple = false,
  disabled = false,
  error = null,
  maxSelections = null,
  searchable = true,
  clearable = true,
  loading = false,
  emptyMessage = "No se encontraron opciones",
  maxDisplayedOptions = 100,
  className = "",
  optionHeight = 48,
  value = null,
  onChange = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const [internalSelected, setInternalSelected] = useState(
    multiple ? value || [] : value || null
  );

  const selectedOptions = value !== null ? value : internalSelected;

  const selectRef = useRef(null);
  const inputRef = useRef(null);
  const optionsRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options.slice(0, maxDisplayedOptions);

    const filtered = options.filter((option) => {
      const searchIn = `${option.label} ${
        option.searchText || ""
      }`.toLowerCase();
      return searchIn.includes(searchTerm.toLowerCase());
    });

    return filtered.slice(0, maxDisplayedOptions);
  }, [searchTerm, options, maxDisplayedOptions]);

  // Resetear índice resaltado cuando cambian las opciones filtradas
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredOptions]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Enfocar input cuando se abre
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen, searchable]);

  const updateSelection = useCallback(
    (newSelection) => {
      if (onChange) {
        onChange(newSelection);
      } else {
        setInternalSelected(newSelection);
      }
      onSelect?.(newSelection);
    },
    [onChange, onSelect]
  );

  const handleSelect = useCallback(
    (option) => {
      if (multiple) {
        const currentSelected = Array.isArray(selectedOptions)
          ? selectedOptions
          : [];
        const isCurrentlySelected = currentSelected.some(
          (item) => item.value === option.value
        );

        let newSelected;
        if (isCurrentlySelected) {
          newSelected = currentSelected.filter(
            (item) => item.value !== option.value
          );
        } else {
          if (maxSelections && currentSelected.length >= maxSelections) {
            return; // No permitir más selecciones
          }
          newSelected = [...currentSelected, option];
        }

        updateSelection(newSelected);
      } else {
        updateSelection(option);
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    },
    [multiple, selectedOptions, maxSelections, updateSelection]
  );

  // Función separada para manejar la selección con Enter
  const handleEnterSelect = useCallback(() => {
    if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
      const selectedOption = filteredOptions[highlightedIndex];

      // Verificar si podemos seleccionar esta opción
      if (multiple && maxSelections) {
        const currentSelected = Array.isArray(selectedOptions)
          ? selectedOptions
          : [];
        const isCurrentlySelected = currentSelected.some(
          (item) => item.value === selectedOption.value
        );

        // Si no está seleccionada y ya llegamos al máximo, no hacer nada
        if (!isCurrentlySelected && currentSelected.length >= maxSelections) {
          return false;
        }
      }

      handleSelect(selectedOption);
      return true;
    }
    return false;
  }, [
    highlightedIndex,
    filteredOptions,
    handleSelect,
    multiple,
    maxSelections,
    selectedOptions,
  ]);

  // Manejar navegación con teclado - MEJORADO
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Solo manejar eventos si el dropdown está abierto
      if (!isOpen) {
        // Si está cerrado y presionan Enter o Space en el botón, abrir
        if (
          (event.key === "Enter" || event.key === " ") &&
          selectRef.current?.contains(document.activeElement)
        ) {
          event.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      // Prevenir comportamiento por defecto para teclas que manejamos
      if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case "Escape":
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          // Devolver foco al botón principal
          selectRef.current?.focus();
          break;

        case "ArrowDown":
          setHighlightedIndex((prev) => {
            const newIndex =
              prev < filteredOptions.length - 1 ? prev + 1 : prev;
            return newIndex;
          });
          break;

        case "ArrowUp":
          setHighlightedIndex((prev) => {
            const newIndex = prev > 0 ? prev - 1 : prev;
            return newIndex;
          });
          break;

        case "Enter":
          { const success = handleEnterSelect();
          // Si es selección única y fue exitosa, cerrar el dropdown
          if (!multiple && success) {
            // Ya se cierra en handleSelect para selección única
          }
          break; }

        case "Tab":
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          break;
      }
    };

    // Agregar event listener solo cuando el dropdown está abierto o el select tiene foco
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, filteredOptions, handleEnterSelect, multiple]);

  // Scroll automático para la opción resaltada
  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current) {
      const optionElement = optionsRef.current.children[highlightedIndex];
      if (optionElement) {
        optionElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  const removeOption = useCallback(
    (optionToRemove, e) => {
      e.stopPropagation();
      if (multiple && Array.isArray(selectedOptions)) {
        const newSelected = selectedOptions.filter(
          (item) => item.value !== optionToRemove.value
        );
        updateSelection(newSelected);
      }
    },
    [multiple, selectedOptions, updateSelection]
  );

  const clearAll = useCallback(
    (e) => {
      e.stopPropagation();
      updateSelection(multiple ? [] : null);
    },
    [multiple, updateSelection]
  );

  const isSelected = useCallback(
    (option) => {
      if (multiple) {
        return (
          Array.isArray(selectedOptions) &&
          selectedOptions.some((item) => item.value === option.value)
        );
      }
      return selectedOptions?.value === option.value;
    },
    [multiple, selectedOptions]
  );

  const canClear =
    clearable &&
    ((multiple &&
      Array.isArray(selectedOptions) &&
      selectedOptions.length > 0) ||
      (!multiple && selectedOptions));

  const displayText = useMemo(() => {
    if (multiple) {
      if (!Array.isArray(selectedOptions) || selectedOptions.length === 0) {
        return placeholder;
      }
      return null; // Se muestran las tags
    } else {
      return selectedOptions ? selectedOptions.label : placeholder;
    }
  }, [multiple, selectedOptions, placeholder]);

  const hasMaxSelections =
    multiple &&
    maxSelections &&
    Array.isArray(selectedOptions) &&
    selectedOptions.length >= maxSelections;

  return (
    <div
      ref={selectRef}
      className={`relative w-full ${className}`}
      style={{ zIndex: isOpen ? 10000 : "auto" }}
    >
      {/* Select Button */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        className={`
          w-full min-h-[48px] px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 
          flex items-center justify-between
          ${
            disabled
              ? "bg-gray-100 border-2 border-gray-200 cursor-not-allowed opacity-60"
              : `bg-white border-2 ${
                  error
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-100"
                } focus:ring-4 focus:outline-none`
          }
        `}
      >
        <div className="flex-1 flex items-center gap-2 flex-wrap min-h-[32px]">
          {multiple && Array.isArray(selectedOptions) ? (
            selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium animate-in fade-in-0 duration-200"
                >
                  {option.label}
                  {!disabled && (
                    <button
                      onClick={(e) => removeOption(option, e)}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      aria-label={`Eliminar ${option.label}`}
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <span className="text-gray-400">{displayText}</span>
            )
          ) : (
            <span
              className={selectedOptions ? "text-gray-900" : "text-gray-400"}
            >
              {displayText}
            </span>
          )}

          {hasMaxSelections && (
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
              Máx: {maxSelections}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          )}
          {canClear && !loading && (
            <button
              onClick={clearAll}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Limpiar selección"
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-[9999] animate-in fade-in-0 slide-in-from-top-1 duration-200"
          style={{ zIndex: 9999 }}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar opciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div
            ref={optionsRef}
            className="max-h-60 overflow-y-auto"
            role="listbox"
          >
            {loading ? (
              <div className="px-4 py-8 text-center text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
                <p>Cargando...</p>
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isOptionSelected = isSelected(option);
                const isHighlighted = highlightedIndex === index;
                const canSelectThisOption =
                  !hasMaxSelections || isOptionSelected;

                return (
                  <div
                    key={option.value}
                    onClick={() => canSelectThisOption && handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    role="option"
                    aria-selected={isOptionSelected}
                    className={`
                      px-4 py-3 cursor-pointer transition-colors flex items-center justify-between
                      ${isHighlighted ? "bg-blue-100" : "hover:bg-gray-50"}
                      ${
                        isOptionSelected
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700"
                      }
                      ${
                        !canSelectThisOption
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    `}
                    style={{ height: optionHeight }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-gray-500">
                          {option.description}
                        </span>
                      )}
                    </div>
                    {isOptionSelected && (
                      <Check
                        size={16}
                        className="text-blue-600 flex-shrink-0"
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-gray-400">
                <Search size={24} className="mx-auto mb-2 opacity-50" />
                <p>{emptyMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

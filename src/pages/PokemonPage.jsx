import { useState, useMemo, useEffect } from "react";
import { mockPokemons } from "@utils/mocks";
import { InteractiveSelect } from "@components/ui/InteractiveSelect";
import { Pagination } from "@components/ui/Pagination";
import { PokemonCard } from "@components/ui/PokemonCard";
import { SearchBar } from "@components/ui/SearchBar";
import { SelectWithSortChoice } from "@components/ui/SelectWithSortChoice";

export default function PokemonPage() {
  const [hoveredId, setHoveredId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, sortBy]);

  // Get unique types for filter dropdown
  const typeOptions = useMemo(() => {
    const types = new Set();
    mockPokemons.forEach((pokemon) => {
      pokemon.types.forEach((type) => types.add(type));
    });
    return Array.from(types)
      .sort()
      .map((type) => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
      }));
  }, []);

  const sortOptions = [
    {
      value: "id",
      label: "Número",
      description: "Ordenar por número de Pokédex",
    },
    { value: "name", label: "Nombre", description: "Ordenar alfabéticamente" },
    { value: "hp", label: "HP", description: "Ordenar por puntos de vida" },
    {
      value: "attack",
      label: "Ataque",
      description: "Ordenar por poder de ataque",
    },
    {
      value: "defense",
      label: "Defensa",
      description: "Ordenar por capacidad defensiva",
    },
    {
      value: "speed",
      label: "Velocidad",
      description: "Ordenar por velocidad",
    },
    {
      value: "total",
      label: "Stats Totales",
      description: "Ordenar por suma total de estadísticas",
    },
  ];

  // Filter and search Pokemon
  const filteredPokemons = useMemo(() => {
    return mockPokemons.filter((pokemon) => {
      // Search filter
      const matchesSearch =
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.id.toString().includes(searchTerm);

      // Type filter
      const matchesType =
        !selectedType || pokemon.types.includes(selectedType.value);

      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  // Sort Pokemon usando el nuevo sistema
  const sortedPokemons = useMemo(() => {
    if (!sortBy) {
      // Sin ordenamiento, usar orden original
      return filteredPokemons;
    }

    return [...filteredPokemons].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy.value) {
        case "name":
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case "hp":
          valueA = a.hp;
          valueB = b.hp;
          break;
        case "attack":
          valueA = a.attack;
          valueB = b.attack;
          break;
        case "defense":
          valueA = a.defense;
          valueB = b.defense;
          break;
        case "speed":
          valueA = a.speed;
          valueB = b.speed;
          break;
        case "total":
          valueA = a.hp + a.attack + a.defense + a.speed;
          valueB = b.hp + b.attack + b.defense + b.speed;
          break;
        default: // id
          valueA = a.id;
          valueB = b.id;
      }

      // Usar sortOrder del objeto seleccionado
      if (sortBy.sortOrder === "asc") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  }, [filteredPokemons, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedPokemons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPokemons = sortedPokemons.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Función de limpieza actualizada
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedType(null);
    setSortBy(null);
    setCurrentPage(1);
  };

  // Suggestions for search
  const searchSuggestions = useMemo(() => {
    return mockPokemons
      .map((p) => p.name)
      .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);
  }, [searchTerm]);

  const recentSearches = ["Pikachu", "Charizard", "Blastoise"];
  const popularSearches = ["Mewtwo", "Mew", "Articuno"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(59,130,246,0.1),_transparent_50%)] pointer-events-none"></div>
      {/* Header - Solo título */}
      <div className="relative bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              Pokédex
            </h1>
            <p className="text-blue-100/80 text-sm">Explora el mundo Pokémon</p>
          </div>
        </div>
      </div>

      {/* Layout principal con sidebar */}
      <div className="relative mx-auto p-3 md:p-6">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Sidebar con filtros */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 md:p-6 lg:sticky lg:top-6 border border-white/20 shadow-xl">
              <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
                Filtros y Búsqueda
              </h2>

              {/* Search Bar */}
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Buscar Pokémon
                </label>
                <SearchBar
                  placeholder="Nombre o número..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  onClear={() => setSearchTerm("")}
                  suggestions={searchSuggestions}
                  recentSearches={recentSearches}
                  popularSearches={popularSearches}
                  size="md"
                  className="text-white"
                />
              </div>

              {/* Filtros en grid para móvil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Filtrar por Tipo
                  </label>
                  <InteractiveSelect
                    options={typeOptions}
                    placeholder="Todos los tipos"
                    value={selectedType}
                    onChange={setSelectedType}
                    clearable={true}
                    searchable={false}
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Ordenar por
                  </label>
                  <SelectWithSortChoice
                    options={sortOptions}
                    placeholder="Sin ordenamiento"
                    value={sortBy}
                    onChange={setSortBy}
                    allowSortChoice={true}
                    defaultSortOrder="asc"
                    clearable={true}
                    searchable={false}
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || selectedType || sortBy) && (
                <div className="mt-4 md:mt-6">
                  <button
                    onClick={handleClearFilters}
                    className="w-full px-4 py-3 rounded-xl bg-red-500/20 border-2 border-red-400/30 text-red-100 hover:bg-red-500/30 transition-all duration-300 font-medium"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}

              {/* Estadísticas */}
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/30">
                <p className="text-sm text-blue-200">
                  Mostrando {paginatedPokemons.length} de{" "}
                  {sortedPokemons.length} Pokémon
                </p>
                <p className="text-xs text-blue-300/80 mt-1">
                  Total en Pokédex: {mockPokemons.length}
                </p>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 lg:min-w-0">
            {sortedPokemons.length === 0 ? (
              <div className="text-center py-12 md:py-20">
                <div className="text-4xl md:text-6xl mb-4">🔍</div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  No se encontraron Pokémon
                </h2>
                <p className="text-blue-100 mb-4">
                  Intenta cambiar los filtros de búsqueda
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                {/* Sección: Información de resultados */}
                <div className="mb-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h2 className="text-lg font-semibold text-white">
                        Resultados de búsqueda
                      </h2>
                      <div className="text-sm text-blue-200">
                        Página {currentPage} de {totalPages} •{" "}
                        {sortedPokemons.length} Pokémon encontrados
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección: Grid de Pokémon */}
                <div className="mb-8">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/10">
                    <div className="max-w-7xl mx-auto">
                      <div className="flex flex-wrap justify-center sm:justify-center gap-6">
                        {paginatedPokemons.map((pokemon, i) => (
                          <div
                            key={`${pokemon.id}-${i}`}
                            className="flex-shrink-0"
                          >
                            <PokemonCard
                              pokemon={pokemon}
                              delay={i * 100}
                              hoveredId={hoveredId}
                              setHoveredId={setHoveredId}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección: Paginación */}
                {totalPages > 1 && (
                  <div className="mb-6">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-2xl border border-white/30">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={sortedPokemons.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        showPageInfo={true}
                        showItemsInfo={true}
                        size="md"
                        className="text-gray-800"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

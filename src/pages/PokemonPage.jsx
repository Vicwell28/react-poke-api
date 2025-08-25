import { useState, useEffect, useCallback } from "react";
import { usePokemonData } from "@hooks/usePokemonData";
import { InteractiveSelect } from "@components/ui/InteractiveSelect";
import { Pagination } from "@components/ui/Pagination";
import { PokemonCard } from "@components/ui/PokemonCard";
import { SearchBar } from "@components/ui/SearchBar";
import { SelectWithSortChoice } from "@components/ui/SelectWithSortChoice";

export default function PokemonPage() {
  const [hoveredId, setHoveredId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Hook personalizado para datos de Pokemon
  const {
    pokemons,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    sortBy,
    setSortBy,
    typeOptions,
    searchSuggestions,
    shufflePokemons,
    clearFilters,
    retry,
    stats,
  } = usePokemonData();

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, sortBy]);

  // Opciones de ordenamiento
  const sortOptions = [
    {
      value: "id",
      label: "Número",
      description: "Ordenar por número de Pokédex",
    },
    {
      value: "name",
      label: "Nombre",
      description: "Ordenar alfabéticamente",
    },
    {
      value: "hp",
      label: "HP",
      description: "Ordenar por puntos de vida",
    },
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

  // Callbacks optimizados
  const handleSearchTermChange = useCallback(
    (value) => {
      setSearchTerm(value);
    },
    [setSearchTerm]
  );

  const handleSearchClear = useCallback(() => {
    setSearchTerm("");
  }, [setSearchTerm]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setCurrentPage(1);
  }, [clearFilters]);

  // Paginación
  const totalPages = Math.ceil(pokemons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPokemons = pokemons.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Búsquedas recientes y populares (simuladas)
  const recentSearches = ["Pikachu", "Charizard", "Blastoise"];
  const popularSearches = ["Mewtwo", "Mew", "Articuno"];

  // Componente de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Cargando Pokédex...</h2>
          <p className="text-blue-200">
            Descargando datos de {stats.total > 0 ? stats.total : "todos los"}{" "}
            Pokémon
          </p>
          {stats.total > 0 && (
            <div className="mt-4 bg-white/10 rounded-lg p-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.total / 1000) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm mt-2">{stats.total} Pokémon cargados...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Componente de error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error al cargar Pokédex</h2>
          <p className="text-blue-200 mb-4">
            {error.message || "No se pudieron cargar los datos de Pokemon"}
          </p>
          {error.details && (
            <p className="text-sm text-red-300 mb-4">
              Detalles: {error.details}
            </p>
          )}
          <button
            onClick={retry}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(59,130,246,0.1),_transparent_50%)] pointer-events-none" />

      {/* Header */}
      <header className="relative bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              Pokédex
            </h1>
            <p className="text-blue-100/80 text-sm">
              Explora el mundo Pokémon - {stats.total} Pokémon disponibles
            </p>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="relative mx-auto p-3 md:p-6">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 md:p-6 lg:sticky lg:top-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-white">
                  Filtros y Búsqueda
                </h2>
                <button
                  onClick={shufflePokemons}
                  className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                  title="Mezclar Pokemon"
                >
                  🔄
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Buscar Pokémon
                </label>
                <SearchBar
                  placeholder="Nombre o número..."
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  onClear={handleSearchClear}
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
                    clearable
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
                    allowSortChoice
                    defaultSortOrder="asc"
                    clearable
                    searchable={false}
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              {stats.hasFilters && (
                <div className="mt-4 md:mt-6">
                  <button
                    onClick={handleClearFilters}
                    className="w-full px-4 py-3 rounded-xl bg-red-500/20 border-2 border-red-400/30 text-red-100 hover:bg-red-500/30 transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-red-400/50"
                    type="button"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}

              {/* Estadísticas */}
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/30">
                <p className="text-sm text-blue-200">
                  Mostrando {paginatedPokemons.length} de {stats.filtered}{" "}
                  Pokémon
                </p>
                <p className="text-xs text-blue-300/80 mt-1">
                  Total en Pokédex: {stats.total}
                </p>
                {loading && (
                  <p className="text-xs text-yellow-300 mt-1 animate-pulse">
                    Cargando más datos...
                  </p>
                )}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 lg:min-w-0">
            {stats.filtered === 0 ? (
              <div className="text-center py-12 md:py-20">
                <div
                  className="text-4xl md:text-6xl mb-4"
                  role="img"
                  aria-label="Search"
                >
                  🔍
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  No se encontraron Pokémon
                </h2>
                <p className="text-blue-100 mb-4">
                  Intenta cambiar los filtros de búsqueda
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  type="button"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                {/* Results information */}
                <section className="mb-6">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h2 className="text-lg font-semibold text-white">
                        Resultados de búsqueda
                      </h2>
                      <div className="text-sm text-blue-200">
                        Página {currentPage} de {totalPages} • {stats.filtered}{" "}
                        Pokémon encontrados
                      </div>
                    </div>
                  </div>
                </section>

                {/* Pokemon grid */}
                <section className="mb-8">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/10">
                    <div className="max-w-7xl mx-auto">
                      <div className="flex flex-wrap justify-center sm:justify-center gap-6">
                        {paginatedPokemons.map((pokemon, index) => (
                          <div
                            key={`${pokemon.id}-${currentPage}-${index}`}
                            className="flex-shrink-0"
                          >
                            <PokemonCard
                              pokemon={pokemon}
                              delay={index * 100}
                              hoveredId={hoveredId}
                              setHoveredId={setHoveredId}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Pagination */}
                {totalPages > 1 && (
                  <section className="mb-6">
                    <div className="bg-white/10 backdrop-blur-md text-white rounded-2xl p-4 md:p-6 shadow-2xl border border-white/20">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={stats.filtered}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        showPageInfo
                        showItemsInfo
                        size="md"
                        className="text-gray-800"
                      />
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

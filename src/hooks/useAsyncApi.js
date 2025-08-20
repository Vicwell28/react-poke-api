import { useState, useCallback } from "react";

/**
 * Hook personalizado para peticiones API bajo demanda
 * Ideal para formularios, botones, o acciones del usuario
 *
 * @param {ApiService} apiService - Instancia del servicio API a usar
 *
 * @returns {Object} Estado y funciones para manejar peticiones
 * @returns {boolean} returns.loading - Estado de carga
 * @returns {Object|null} returns.error - Error si ocurrió alguno
 * @returns {Function} returns.request - Función para hacer peticiones
 * @returns {Function} returns.clearError - Función para limpiar errores
 *
 * @example
 * const { loading, error, request, clearError } = useAsyncApi(pokemonApi);
 *
 * const handleSearch = async (pokemonName) => {
 *   const result = await request(`/pokemon/${pokemonName.toLowerCase()}`);
 *   if (result.success) {
 *     setPokemonData(result.data);
 *   }
 * };
 *
 * return (
 *   <div>
 *     <SearchForm onSearch={handleSearch} loading={loading} />
 *     {error && <ErrorAlert error={error} onDismiss={clearError} />}
 *   </div>
 * );
 */
export const useAsyncApi = (apiService) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (endpoint, config = {}) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiService.get(endpoint, config);

        if (!result.success) {
          setError(result.error);
        }

        return result;
      } catch (err) {
        const errorObj = { type: "unexpected", message: err.message };
        setError(errorObj);
        return { success: false, error: errorObj };
      } finally {
        setLoading(false);
      }
    },
    [apiService]
  );

  return {
    loading,
    error,
    request,
    clearError: () => setError(null),
  };
};

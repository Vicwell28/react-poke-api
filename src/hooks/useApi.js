import { useState, useEffect, useCallback } from "react";

/**
 * Hook personalizado para manejo declarativo de APIs
 * Ideal para componentes que necesitan cargar datos automáticamente
 *
 * @param {ApiService} apiService - Instancia del servicio API a usar
 * @param {string} endpoint - Endpoint a consultar
 * @param {Object} [options={}] - Opciones de configuración
 * @param {boolean} [options.immediate=false] - Si debe ejecutarse al montar el componente
 * @param {Function} [options.onSuccess] - Callback ejecutado en caso de éxito
 * @param {Function} [options.onError] - Callback ejecutado en caso de error
 *
 * @returns {Object} Estado y funciones para manejar la petición
 * @returns {*} returns.data - Datos obtenidos de la API
 * @returns {boolean} returns.loading - Estado de carga
 * @returns {Object|null} returns.error - Error si ocurrió alguno
 * @returns {Function} returns.execute - Función para ejecutar la petición manualmente
 * @returns {Function} returns.refetch - Alias de execute para refrescar datos
 *
 * @example
 * // Carga automática al montar
 * const { data: users, loading, error, refetch } = useApi(
 *   mainApi,
 *   '/users',
 *   {
 *     immediate: true,
 *     onSuccess: (data) => console.log(`Cargados ${data.length} usuarios`),
 *     onError: (error) => toast.error(error.message)
 *   }
 * );
 *
 * // Uso en componente
 * if (loading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 * return <UsersList users={users} onRefresh={refetch} />;
 */
export const useApi = (apiService, endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { immediate = false, onSuccess = null, onError = null } = options;

  const execute = useCallback(
    async (customConfig = {}) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiService.get(endpoint, customConfig);

        if (result.success) {
          setData(result.data);
          if (onSuccess) onSuccess(result.data, result);
        } else {
          setError(result.error);
          if (onError) onError(result.error, result);
        }

        return result;
      } catch (err) {
        const errorObj = { type: "unexpected", message: err.message };
        setError(errorObj);
        if (onError) onError(errorObj);
        return { success: false, error: errorObj };
      } finally {
        setLoading(false);
      }
    },
    [apiService, endpoint, onSuccess, onError]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
};

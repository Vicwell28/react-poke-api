import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { pokemonService } from "@services/api/PokemonService";

/**
 * Hook personalizado para manejar todos los datos, estados y operaciones relacionadas con Pokemon
 * 
 * Características principales:
 * - Carga inicial robusta con protección contra doble inicialización
 * - Compatible con React Strict Mode (evita doble ejecución de efectos)
 * - Manejo avanzado de cancelación silenciosa de peticiones
 * - Sistema completo de filtros y ordenamiento
 * - Gestión de estados de carga, error y datos
 * - Funciones de utilidad para mezclar y refrescar datos
 * - Limpieza automática de recursos al desmontar
 * 
 * @returns {Object} Objeto con todos los datos, estados y funciones del hook
 */
export const usePokemonData = () => {
  // ========================================
  // ESTADOS PRINCIPALES
  // ========================================

  /**
   * Lista principal de Pokemon cargados desde la API
   * @type {Array<Object>} Array de objetos Pokemon con todas sus propiedades
   */
  const [pokemons, setPokemons] = useState([]);

  /**
   * Estado de carga general del hook
   * @type {boolean} true durante la carga inicial, false cuando termina
   */
  const [loading, setLoading] = useState(true);

  /**
   * Estado de error del hook
   * @type {Object|null} Objeto con información del error o null si no hay errores
   */
  const [error, setError] = useState(null);

  /**
   * Indica si el hook ha completado su inicialización exitosamente
   * @type {boolean} true cuando los datos están cargados y listos para usar
   */
  const [isInitialized, setIsInitialized] = useState(false);

  // ========================================
  // ESTADOS PARA FILTROS Y BÚSQUEDA
  // ========================================

  /**
   * Término de búsqueda actual para filtrar Pokemon por nombre o ID
   * @type {string} Cadena de texto para buscar Pokemon
   */
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Tipo de Pokemon seleccionado para filtrar
   * @type {Object|null} Objeto con value y label del tipo seleccionado
   */
  const [selectedType, setSelectedType] = useState(null);

  /**
   * Configuración de ordenamiento actual
   * @type {Object|null} Objeto con criterio de ordenamiento y dirección
   */
  const [sortBy, setSortBy] = useState(null);

  // ========================================
  // REFERENCIAS PARA CONTROL DE FLUJO
  // ========================================

  /**
   * Referencia para controlar la inicialización y evitar carreras de datos
   * Protege contra múltiples inicializaciones simultáneas en Strict Mode
   * 
   * @type {Object} Objeto con:
   *   - hasStarted: boolean - Si ya comenzó la inicialización
   *   - isComplete: boolean - Si ya completó la inicialización
   *   - promise: Promise|null - Promesa de la inicialización actual
   */
  const initializationRef = useRef({
    hasStarted: false,
    isComplete: false,
    promise: null,
  });

  /**
   * Referencia para verificar si el componente sigue montado
   * Evita actualizaciones de estado en componentes desmontados
   * 
   * @type {Object} Ref que contiene boolean indicando si está montado
   */
  const isMountedRef = useRef(true);

  // ========================================
  // FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
  // ========================================

  /**
   * Inicializa la carga de Pokemon con protección avanzada contra problemas comunes:
   * - Doble inicialización (React Strict Mode)
   * - Cancelación silenciosa de peticiones
   * - Actualizaciones de estado en componentes desmontados
   * - Carreras de datos entre múltiples llamadas
   * 
   * Flujo de la función:
   * 1. Verifica si ya está inicializado - si sí, termina
   * 2. Si hay inicialización en curso, espera su resultado
   * 3. Si hay cancelación silenciosa, reintenta automáticamente
   * 4. Ejecuta la carga usando el servicio Pokemon
   * 5. Actualiza estados solo si el componente sigue montado
   * 6. Maneja diferentes tipos de errores (reales vs cancelación)
   * 
   * @async
   * @function
   */
  const initializePokemonData = useCallback(async () => {
    const initRef = initializationRef.current;

    // === VERIFICACIÓN DE ESTADO COMPLETO ===
    if (initRef.isComplete && isInitialized) {
      console.log("Inicialización ya completada, omitiendo...");
      return;
    }

    // === MANEJO DE INICIALIZACIÓN EN CURSO ===
    if (initRef.hasStarted && initRef.promise) {
      console.log("Inicialización en progreso, esperando...");
      try {
        const result = await initRef.promise;
        
        // Verificar si fue cancelación silenciosa (resultado falso sin error)
        if (!result.success && result.error === null) {
          console.log("Inicialización anterior fue cancelada, reintentando...");
          // Resetear estado y continuar con nueva inicialización
          initRef.hasStarted = false;
          initRef.promise = null;
        } else {
          return; // Inicialización exitosa o error real, terminar
        }
      } catch (err) {
        console.warn("Error en inicialización anterior:", err);
        // Resetear y continuar con nueva inicialización
        initRef.hasStarted = false;
        initRef.promise = null;
      }
    }

    // === INICIO DE NUEVA INICIALIZACIÓN ===
    initRef.hasStarted = true;

    // Actualizar estados iniciales solo si el componente está montado
    if (isMountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      console.log("Iniciando carga de Pokemon...");

      // Crear y cachear la promesa para evitar múltiples llamadas
      initRef.promise = pokemonService.loadAllPokemons();
      const result = await initRef.promise;

      console.log("Resultado de carga:", result);

      // === VERIFICACIÓN DE COMPONENTE MONTADO ===
      if (!isMountedRef.current) {
        console.log("Componente desmontado, cancelando actualización de estado");
        return;
      }

      // === PROCESAMIENTO DEL RESULTADO ===
      if (result.success) {
        // Carga exitosa
        setPokemons(result.data);
        setIsInitialized(true);
        initRef.isComplete = true;
        console.log("Inicialización completada exitosamente");
      } else if (result.error === null) {
        // Cancelación silenciosa - preparar para próximo intento
        console.log("Carga cancelada silenciosamente, preparando para próximo intento");
        initRef.hasStarted = false;
        initRef.isComplete = false;
        setLoading(false);
      } else {
        // Error real de la API o servicio
        setError(result.error);
        console.error("Error en inicialización:", result.error);
      }
    } catch (err) {
      // Error inesperado durante la ejecución
      console.error("Error durante inicialización:", err);

      if (isMountedRef.current) {
        setError({
          type: "initialization_error",
          message: "Error al inicializar los datos de Pokemon",
          details: err.message,
        });
      }
    } finally {
      // === LIMPIEZA FINAL ===
      // Solo actualizar loading si el componente sigue montado y no fue cancelación
      if (isMountedRef.current && !pokemonService.getStatus().isLoading) {
        console.log("Finalizando carga, poniendo loading en false");
        setLoading(false);
      }

      // Limpiar referencias de promesas solo si no hay carga en progreso
      const serviceStatus = pokemonService.getStatus();
      if (!serviceStatus.isLoading) {
        initRef.promise = null;
      }
    }
  }, [isInitialized]);

  // ========================================
  // EFECTOS DE CICLO DE VIDA
  // ========================================

  /**
   * Efecto principal para inicializar los datos al montar el componente
   * 
   * - Se ejecuta solo una vez al montar (array de dependencias vacío)
   * - Incluye función de limpieza para cancelar operaciones en curso
   * - Usa variable local 'cancelled' para evitar actualizaciones después del desmontado
   */
  useEffect(() => {
    console.log("Efecto de inicialización ejecutándose...");

    let cancelled = false; // Flag local para controlar cancelación

    const runInitialization = async () => {
      if (!cancelled) {
        await initializePokemonData();
      }
    };

    runInitialization();

    // Función de limpieza del efecto
    return () => {
      console.log("Cleanup de inicialización");
      cancelled = true;
    };
  }, []); // Sin dependencias para evitar re-inicializaciones innecesarias

  /**
   * Efecto para el manejo del ciclo de vida del componente
   * 
   * - Establece isMountedRef en true al montar
   * - Limpia recursos y cancela operaciones al desmontar
   * - Previene memory leaks y actualizaciones de estado en componentes desmontados
   */
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      console.log("Componente desmontándose, limpiando...");
      isMountedRef.current = false;

      // Cancelar cualquier carga en progreso (será cancelación silenciosa)
      pokemonService.cancelLoad();
    };
  }, []);

  // ========================================
  // FUNCIONES DE MANIPULACIÓN DE DATOS
  // ========================================

  /**
   * Mezcla aleatoriamente el orden de los Pokemon cargados
   * 
   * Solo funciona si:
   * - Hay Pokemon cargados (length > 0)
   * - El hook está inicializado
   * - El componente sigue montado
   * 
   * Usa el servicio Pokemon para la lógica de mezcla y actualiza el estado local
   */
  const shufflePokemons = useCallback(() => {
    if (pokemons.length > 0 && isInitialized) {
      console.log("Mezclando Pokemon...");
      pokemonService.reshufflePokemons();
      const { pokemons: shuffledPokemons } = pokemonService.getAllPokemons();

      if (isMountedRef.current) {
        setPokemons([...shuffledPokemons]); // Crear nueva referencia para trigger re-render
      }
    }
  }, [pokemons.length, isInitialized]);

  // ========================================
  // DATOS COMPUTADOS Y FILTROS
  // ========================================

  /**
   * Genera las opciones de tipos disponibles para el filtro
   * 
   * Proceso:
   * 1. Obtiene todos los tipos únicos del servicio Pokemon
   * 2. Los formatea como objetos {value, label} para componentes de selección
   * 3. Capitaliza la primera letra de cada tipo para mejor presentación
   * 
   * @returns {Array<Object>} Array de opciones con formato {value: string, label: string}
   */
  const typeOptions = useMemo(() => {
    if (!isInitialized || pokemons.length === 0) return [];

    const types = pokemonService.getAllTypes();
    return types.map((type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  }, [isInitialized, pokemons.length]);

  /**
   * Aplica filtros de búsqueda y tipo a la lista de Pokemon
   * 
   * Filtros aplicados:
   * 1. Búsqueda por texto: busca en nombre (case-insensitive) y ID exacto
   * 2. Filtro por tipo: incluye solo Pokemon que tengan el tipo seleccionado
   * 
   * @returns {Array<Object>} Lista filtrada de Pokemon
   */
  const filteredPokemons = useMemo(() => {
    if (!isInitialized) return [];

    let filtered = [...pokemons]; // Crear copia para evitar mutaciones

    // === FILTRO POR TÉRMINO DE BÚSQUEDA ===
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(searchLower) ||
          pokemon.id.toString().includes(searchTerm.trim())
      );
    }

    // === FILTRO POR TIPO ===
    if (selectedType) {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.includes(selectedType.value)
      );
    }

    return filtered;
  }, [pokemons, searchTerm, selectedType, isInitialized]);

  /**
   * Ordena los Pokemon filtrados según el criterio seleccionado
   * 
   * Criterios de ordenamiento disponibles:
   * - name: Orden alfabético por nombre
   * - total: Suma de todas las estadísticas (hp + attack + defense + speed)
   * - hp, attack, defense, speed: Por estadística individual
   * - id (default): Por número de Pokemon
   * 
   * Soporta orden ascendente (asc) y descendente (desc)
   * 
   * @returns {Array<Object>} Lista filtrada y ordenada de Pokemon
   */
  const sortedPokemons = useMemo(() => {
    if (!sortBy) return filteredPokemons;

    const { value: sortKey, sortOrder } = sortBy;
    const isAscending = sortOrder === "asc";

    return [...filteredPokemons].sort((a, b) => {
      let valueA, valueB;

      // Determinar valores a comparar según el criterio
      switch (sortKey) {
        case "name":
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case "total":
          valueA = a.hp + a.attack + a.defense + a.speed;
          valueB = b.hp + b.attack + b.defense + b.speed;
          break;
        case "hp":
        case "attack":
        case "defense":
        case "speed":
          valueA = a[sortKey];
          valueB = b[sortKey];
          break;
        default: // id u otro criterio
          valueA = a.id;
          valueB = b.id;
      }

      // Manejo de igualdad
      if (valueA === valueB) return 0;

      // Aplicar orden ascendente o descendente
      const comparison = valueA < valueB ? -1 : 1;
      return isAscending ? comparison : -comparison;
    });
  }, [filteredPokemons, sortBy]);

  /**
   * Genera sugerencias de búsqueda basadas en el término actual
   * 
   * - Filtra Pokemon que contengan el término en su nombre
   * - Limita a las primeras 5 coincidencias para mejor UX
   * - Solo funciona si hay término de búsqueda y el hook está inicializado
   * 
   * @returns {Array<string>} Array de nombres de Pokemon que coinciden
   */
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim() || !isInitialized) return [];

    const searchLower = searchTerm.toLowerCase();
    return pokemons
      .filter((p) => p.name.toLowerCase().includes(searchLower))
      .map((p) => p.name)
      .slice(0, 5); // Limitar a 5 sugerencias
  }, [searchTerm, pokemons, isInitialized]);

  // ========================================
  // FUNCIONES DE UTILIDAD
  // ========================================

  /**
   * Limpia todos los filtros aplicados, regresando a la vista completa
   * 
   * Resetea:
   * - Término de búsqueda
   * - Tipo seleccionado
   * - Criterio de ordenamiento
   */
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedType(null);
    setSortBy(null);
  }, []);

  /**
   * Reintenta la carga completa de datos en caso de error
   * 
   * Proceso completo de reinicio:
   * 1. Resetea todas las referencias de inicialización
   * 2. Resetea el servicio Pokemon a estado inicial
   * 3. Limpia estados locales (datos, errores, inicialización)
   * 4. Re-ejecuta la inicialización completa
   * 
   * Útil cuando hay errores de red o problemas temporales de API
   */
  const retry = useCallback(async () => {
    console.log("Reintentando carga...");

    // === RESETEAR REFERENCIAS DE INICIALIZACIÓN ===
    const initRef = initializationRef.current;
    initRef.hasStarted = false;
    initRef.isComplete = false;
    initRef.promise = null;

    // === RESETEAR SERVICIO Y ESTADO ===
    pokemonService.reset();

    if (isMountedRef.current) {
      setIsInitialized(false);
      setPokemons([]);
      setError(null);

      // Re-inicializar completamente
      await initializePokemonData();
    }
  }, [initializePokemonData]);

  /**
   * Refresca los datos de forma más suave que retry
   * 
   * Diferencia con retry:
   * - Cancela carga actual antes de reiniciar
   * - Incluye pequeña pausa para asegurar cancelación completa
   * - Más adecuado para refreshes manuales del usuario
   * 
   * Flujo:
   * 1. Cancela cualquier operación en curso
   * 2. Espera breve momento para completar cancelación
   * 3. Ejecuta retry para reinicialización completa
   */
  const refreshData = useCallback(async () => {
    console.log("Refrescando datos...");
    
    // Cancelar cualquier carga en progreso
    pokemonService.cancelLoad();
    
    // Esperar un momento para que se complete la cancelación
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Reintentar carga
    await retry();
  }, [retry]);

  // ========================================
  // ESTADÍSTICAS Y MÉTRICAS
  // ========================================

  /**
   * Objeto con estadísticas útiles sobre el estado actual del hook
   * 
   * Métricas incluidas:
   * - total: Cantidad total de Pokemon cargados
   * - filtered: Cantidad después de aplicar filtros
   * - sorted: Cantidad en la lista final (misma que filtered)
   * - isLoaded: true si está completamente inicializado y sin cargar
   * - hasFilters: true si hay algún filtro activo
   * - serviceStatus: Estado interno del servicio Pokemon
   * 
   * Útil para componentes que muestren información de estado,
   * loading indicators, contadores, etc.
   */
  const stats = useMemo(
    () => ({
      total: pokemons.length,
      filtered: filteredPokemons.length,
      sorted: sortedPokemons.length,
      isLoaded: isInitialized && !loading,
      hasFilters: Boolean(searchTerm || selectedType || sortBy),
      serviceStatus: pokemonService.getStatus(),
    }),
    [
      pokemons.length,
      filteredPokemons.length,
      sortedPokemons.length,
      isInitialized,
      loading,
      searchTerm,
      selectedType,
      sortBy,
    ]
  );

  // ========================================
  // VALOR DE RETORNO DEL HOOK
  // ========================================

  return {
    // === DATOS ===
    /** Lista final de Pokemon (filtrada y ordenada) */
    pokemons: sortedPokemons,
    /** Lista completa de Pokemon sin filtros */
    allPokemons: pokemons,

    // === ESTADOS ===
    /** Estado de carga inicial */
    loading,
    /** Información de errores */
    error,
    /** Estado de inicialización completa */
    isInitialized,

    // === FILTROS (estados y setters) ===
    /** Término de búsqueda actual */
    searchTerm,
    /** Función para actualizar término de búsqueda */
    setSearchTerm,
    /** Tipo seleccionado para filtrar */
    selectedType,
    /** Función para actualizar tipo seleccionado */
    setSelectedType,
    /** Configuración de ordenamiento */
    sortBy,
    /** Función para actualizar ordenamiento */
    setSortBy,

    // === OPCIONES PARA UI ===
    /** Opciones de tipos para componentes select */
    typeOptions,
    /** Sugerencias de búsqueda */
    searchSuggestions,

    // === FUNCIONES DE ACCIÓN ===
    /** Mezclar Pokemon aleatoriamente */
    shufflePokemons,
    /** Limpiar todos los filtros */
    clearFilters,
    /** Reintentar carga en caso de error */
    retry,
    /** Refrescar datos suavemente */
    refreshData,

    // === ESTADÍSTICAS ===
    /** Métricas y estado del hook */
    stats,
  };
};
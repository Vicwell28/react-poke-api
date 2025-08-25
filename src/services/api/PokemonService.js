import { pokemonApi } from "@services/api/Api";

/**
 * Servicio especializado para manejar datos de Pokemon con soporte completo
 * para React Strict Mode y cancelación automática de peticiones.
 * 
 * Características principales:
 * - Singleton pattern para mantener estado único
 * - Carga concurrente optimizada (30 peticiones paralelas)
 * - Cancelación automática y silenciosa de peticiones
 * - Compatibilidad total con React Strict Mode
 * - Sistema de caché para evitar cargas duplicadas
 * - Algoritmo Fisher-Yates para mezcla aleatoria
 * - Manejo robusto de errores con recuperación automática
 * 
 * @class PokemonService
 * @author Tu nombre
 * @version 2.0.0
 * @since 1.0.0
 */
class PokemonService {
  /**
   * Inicializa una nueva instancia del servicio Pokemon
   * 
   * @constructor
   * @memberof PokemonService
   */
  constructor() {
    /** @type {Array<Object>} Lista de todos los Pokemon cargados */
    this.pokemons = [];
    
    /** @type {boolean} Indica si los datos ya fueron cargados completamente */
    this.isLoaded = false;
    
    /** @type {boolean} Indica si actualmente se está realizando una carga */
    this.isLoading = false;
    
    /** @type {Object|null} Información del último error ocurrido */
    this.error = null;
    
    /** @type {Promise|null} Promesa en caché para evitar cargas duplicadas */
    this.loadingPromise = null;
    
    /** @type {AbortController|null} Controlador para cancelar peticiones HTTP */
    this.abortController = null;
  }

  /**
   * Carga todos los Pokemon disponibles desde la API de forma optimizada.
   * 
   * Implementa las siguientes optimizaciones:
   * - Evita cargas duplicadas usando promesas en caché
   * - Cancela peticiones anteriores automáticamente
   * - Carga concurrente con límite de 30 peticiones paralelas
   * - Manejo silencioso de cancelaciones
   * - Compatibilidad completa con React Strict Mode
   * 
   * @async
   * @method loadAllPokemons
   * @memberof PokemonService
   * @returns {Promise<Object>} Objeto con el resultado de la operación
   * @returns {boolean} returns.success - Indica si la operación fue exitosa
   * @returns {Array<Object>} returns.data - Array con todos los Pokemon cargados
   * @returns {Object|null} returns.error - Información del error si ocurrió alguno
   * 
   * @example
   * const result = await pokemonService.loadAllPokemons();
   * if (result.success) {
   *   console.log(`Cargados ${result.data.length} Pokemon`);
   * } else {
   *   console.error('Error:', result.error);
   * }
   */
  async loadAllPokemons() {
    // Si ya está cargado, devolver los datos inmediatamente
    if (this.isLoaded) {
      return { success: true, data: this.pokemons, error: null };
    }

    // Si ya está cargando, devolver la misma promesa para evitar cargas duplicadas
    if (this.isLoading && this.loadingPromise) {
      console.log("Carga ya en progreso, esperando...");
      return this.loadingPromise;
    }

    // Cancelar cualquier petición anterior si existe
    if (this.abortController) {
      this.abortController.abort();
    }

    // Crear nuevo controlador de cancelación
    this.abortController = new AbortController();

    this.isLoading = true;
    this.error = null;

    // Crear y cachear la promesa de carga
    this.loadingPromise = this._performLoad();

    return this.loadingPromise;
  }

  /**
   * Método interno que ejecuta el proceso real de carga de datos.
   * 
   * Proceso de carga:
   * 1. Obtiene la lista completa de Pokemon (hasta 2000)
   * 2. Divide las peticiones en grupos de 30 para carga concurrente
   * 3. Procesa cada grupo en paralelo usando Promise.allSettled
   * 4. Ordena los resultados por ID y los mezcla aleatoriamente
   * 5. Actualiza el estado del servicio con los datos cargados
   * 
   * @private
   * @async
   * @method _performLoad
   * @memberof PokemonService
   * @returns {Promise<Object>} Resultado de la operación de carga
   * @throws {Error} Error de red o cancelación de petición
   */
  async _performLoad() {
    try {
      // 1. Obtener la lista completa de Pokemon
      console.log("Iniciando carga de Pokemon...");
      const listResponse = await pokemonApi.get("/pokemon", {
        params: { limit: 2000 },
        signal: this.abortController?.signal,
      });

      // Verificar si fue cancelado - reiniciar silenciosamente
      if (this.abortController?.signal?.aborted) {
        this._silentReset();
        return { success: false, data: [], error: null };
      }

      if (!listResponse.success) {
        throw new Error("Error al obtener la lista de Pokemon");
      }

      const pokemonList = listResponse.data.results;
      console.log(`Cargando ${pokemonList.length} Pokemon...`);

      // 2. Crear grupos de peticiones concurrentes (30 por vez para ser más conservadores)
      const concurrentRequests = 30;
      const totalGroups = Math.ceil(pokemonList.length / concurrentRequests);

      const startTime = Date.now();
      const tempPokemons = [];

      // Procesar cada grupo de Pokemon
      for (let groupIndex = 0; groupIndex < totalGroups; groupIndex++) {
        // Verificar si fue cancelado antes de cada grupo - reiniciar silenciosamente
        if (this.abortController?.signal?.aborted) {
          this._silentReset();
          return { success: false, data: [], error: null };
        }

        const start = groupIndex * concurrentRequests;
        const end = Math.min(start + concurrentRequests, pokemonList.length);
        const group = pokemonList.slice(start, end);

        // Ejecutar este grupo de peticiones en paralelo
        const groupPromises = group.map((pokemon) =>
          this.loadPokemonDetailsOptimized(pokemon.name)
        );

        const groupResults = await Promise.allSettled(groupPromises);

        // Procesar resultados del grupo
        groupResults.forEach((result) => {
          if (result.status === "fulfilled" && result.value) {
            tempPokemons.push(result.value);
          }
        });

        // Mostrar progreso
        const currentCount = Math.min(end, pokemonList.length);
        const percentage = ((currentCount / pokemonList.length) * 100).toFixed(1);
        console.log(`Progreso: ${currentCount}/${pokemonList.length} (${percentage}%)`);
      }

      // Verificar una vez más si fue cancelado - reiniciar silenciosamente
      if (this.abortController?.signal?.aborted) {
        this._silentReset();
        return { success: false, data: [], error: null };
      }

      const endTime = Date.now();
      const totalTime = ((endTime - startTime) / 1000).toFixed(2);

      // 3. Ordenar por ID y luego mezclar usando Fisher-Yates
      tempPokemons.sort((a, b) => a.id - b.id);

      // Aplicar Fisher-Yates shuffle para orden aleatorio
      for (let i = tempPokemons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempPokemons[i], tempPokemons[j]] = [tempPokemons[j], tempPokemons[i]];
      }

      // Asignar los resultados solo si la carga no fue cancelada
      this.pokemons = tempPokemons;
      this.isLoaded = true;

      console.log(`Carga completa: ${this.pokemons.length} Pokemon en ${totalTime}s`);

      return { success: true, data: this.pokemons, error: null };
    } catch (error) {
      // Si es un error de cancelación, reiniciar silenciosamente
      if (error.name === "AbortError" || error.message === "Carga cancelada") {
        console.log("Carga cancelada - reiniciando servicio silenciosamente");
        this._silentReset();
        return { success: false, data: [], error: null };
      }

      // Solo loggear errores reales, no de cancelación
      console.error("Error al cargar Pokemon:", error);

      this.error = {
        type: "load_error",
        message: "Error al cargar los datos de Pokemon",
        details: error.message,
      };

      return { success: false, data: [], error: this.error };
    } finally {
      // Solo limpiar si no fue una cancelación
      if (!this.abortController?.signal?.aborted) {
        this.isLoading = false;
        this.loadingPromise = null;
        this.abortController = null;
      }
    }
  }

  /**
   * Reinicia silenciosamente todos los estados del servicio cuando
   * se cancela una petición, preparándolo para una nueva carga.
   * 
   * @private
   * @method _silentReset
   * @memberof PokemonService
   */
  _silentReset() {
    this.pokemons = [];
    this.isLoaded = false;
    this.isLoading = false;
    this.error = null;
    this.loadingPromise = null;
    this.abortController = null;
  }

  /**
   * Carga los detalles específicos de un Pokemon individual de forma optimizada.
   * 
   * @async
   * @method loadPokemonDetailsOptimized
   * @memberof PokemonService
   * @param {string|number} nameOrId - Nombre o ID del Pokemon a cargar
   * @returns {Promise<Object|null>} Datos del Pokemon mapeados o null si hay error
   * 
   * @example
   * const pikachu = await pokemonService.loadPokemonDetailsOptimized('pikachu');
   * const charizard = await pokemonService.loadPokemonDetailsOptimized(6);
   */
  async loadPokemonDetailsOptimized(nameOrId) {
    try {
      const response = await pokemonApi.get(`/pokemon/${nameOrId}`, {
        signal: this.abortController?.signal,
      });

      if (!response.success) {
        return null;
      }

      return this.mapPokemonData(response.data);
    } catch (error) {
      // Si es un error de cancelación, no hacer nada
      if (error.name === "AbortError") {
        return null;
      }

      // Solo loggear errores reales
      console.warn(`Error cargando ${nameOrId}:`, error.message);
      return null;
    }
  }

  /**
   * Mapea y transforma los datos crudos de la API a un formato optimizado
   * para la aplicación, seleccionando las mejores imágenes disponibles.
   * 
   * Prioridad de imágenes:
   * 1. Sprites animados de Gen V (black-white animated)
   * 2. Sprites de Showdown (también animados)
   * 3. Official artwork (alta calidad, estático)
   * 4. Sprite básico (fallback)
   * 
   * @method mapPokemonData
   * @memberof PokemonService
   * @param {Object} pokemon - Datos crudos del Pokemon desde la API
   * @returns {Object} Objeto Pokemon con datos mapeados y optimizados
   * @returns {number} returns.id - ID único del Pokemon
   * @returns {string} returns.name - Nombre capitalizado del Pokemon
   * @returns {string} returns.image - URL de la mejor imagen disponible
   * @returns {Array<string>} returns.types - Lista de tipos del Pokemon
   * @returns {number} returns.hp - Puntos de vida base
   * @returns {number} returns.attack - Estadística de ataque base
   * @returns {number} returns.defense - Estadística de defensa base
   * @returns {number} returns.speed - Estadística de velocidad base
   * @returns {number} returns.height - Altura del Pokemon
   * @returns {number} returns.weight - Peso del Pokemon
   * @returns {Array<string>} returns.abilities - Lista de habilidades
   * 
   * @example
   * const rawPokemon = { id: 25, name: 'pikachu', ... };
   * const mappedPokemon = pokemonService.mapPokemonData(rawPokemon);
   * // { id: 25, name: 'Pikachu', image: 'https://...', types: ['electric'], ... }
   */
  mapPokemonData(pokemon) {
    /**
     * Función interna optimizada para obtener la mejor imagen animada disponible
     * @returns {string} URL de la imagen más apropiada
     */
    const getAnimatedImage = () => {
      // Sprites animados de Gen V (los mejores)
      const genVAnimated =
        pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_default;
      if (genVAnimated) return genVAnimated;

      // Showdown sprites (también animados)
      const showdownSprite = pokemon.sprites.other?.showdown?.front_default;
      if (showdownSprite) return showdownSprite;

      // Official artwork como fallback
      const officialArt = pokemon.sprites.other?.["official-artwork"]?.front_default;
      if (officialArt) return officialArt;

      // Sprite básico como último recurso
      return pokemon.sprites.front_default;
    };

    // Extraer stats de forma más eficiente usando Map
    const statsMap = {};
    pokemon.stats.forEach((stat) => {
      statsMap[stat.stat.name] = stat.base_stat;
    });

    return {
      id: pokemon.id,
      name: this.capitalizeFirstLetter(pokemon.name),
      image: getAnimatedImage(),
      types: pokemon.types.map((t) => t.type.name),
      hp: statsMap.hp || 0,
      attack: statsMap.attack || 0,
      defense: statsMap.defense || 0,
      speed: statsMap.speed || 0,
      height: pokemon.height,
      weight: pokemon.weight,
      abilities: pokemon.abilities.map((a) => a.ability.name),
    };
  }

  /**
   * Convierte la primera letra de una cadena a mayúscula,
   * manteniendo el resto en minúscula.
   * 
   * @method capitalizeFirstLetter
   * @memberof PokemonService
   * @param {string} string - Cadena a capitalizar
   * @returns {string} Cadena con la primera letra en mayúscula
   * 
   * @example
   * pokemonService.capitalizeFirstLetter('pikachu'); // 'Pikachu'
   * pokemonService.capitalizeFirstLetter('CHARIZARD'); // 'Charizard'
   */
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * Vuelve a mezclar aleatoriamente el orden de los Pokemon cargados
   * usando el algoritmo Fisher-Yates. Útil para botones de "mezclar" o "aleatorizar".
   * 
   * @method reshufflePokemons
   * @memberof PokemonService
   * @returns {boolean} true si se mezclaron exitosamente, false si no hay datos
   * 
   * @example
   * const shuffled = pokemonService.reshufflePokemons();
   * if (shuffled) {
   *   console.log('Pokemon mezclados exitosamente');
   * }
   */
  reshufflePokemons() {
    if (this.isLoaded && this.pokemons.length > 0) {
      // Algoritmo Fisher-Yates shuffle para distribución verdaderamente aleatoria
      for (let i = this.pokemons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.pokemons[i], this.pokemons[j]] = [this.pokemons[j], this.pokemons[i]];
      }
      return true;
    }
    return false;
  }

  /**
   * Obtiene una copia de todos los Pokemon cargados junto con
   * metadatos del estado actual del servicio.
   * 
   * @method getAllPokemons
   * @memberof PokemonService
   * @returns {Object} Objeto con Pokemon y metadatos del servicio
   * @returns {Array<Object>} returns.pokemons - Copia de todos los Pokemon
   * @returns {boolean} returns.isLoaded - Si los datos están cargados
   * @returns {boolean} returns.isLoading - Si se está cargando actualmente
   * @returns {Object|null} returns.error - Información del último error
   * @returns {number} returns.count - Número total de Pokemon cargados
   * 
   * @example
   * const { pokemons, isLoaded, count } = pokemonService.getAllPokemons();
   * console.log(`${count} Pokemon disponibles, cargado: ${isLoaded}`);
   */
  getAllPokemons() {
    return {
      pokemons: [...this.pokemons], // Shallow copy para evitar mutaciones
      isLoaded: this.isLoaded,
      isLoading: this.isLoading,
      error: this.error,
      count: this.pokemons.length,
    };
  }

  /**
   * Busca Pokemon que coincidan con el término de búsqueda,
   * comparando tanto el nombre como el ID.
   * 
   * @method searchPokemons
   * @memberof PokemonService
   * @param {string|number} query - Término de búsqueda (nombre parcial o ID)
   * @returns {Array<Object>} Lista de Pokemon que coinciden con la búsqueda
   * 
   * @example
   * // Buscar por nombre
   * const pikachus = pokemonService.searchPokemons('pika');
   * 
   * // Buscar por ID
   * const pokemon25 = pokemonService.searchPokemons(25);
   * 
   * // Búsqueda parcial
   * const charizards = pokemonService.searchPokemons('char');
   */
  searchPokemons(query) {
    if (!this.isLoaded || !query) return [];

    const searchTerm = query.toString().toLowerCase();
    return this.pokemons.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm) ||
        pokemon.id.toString().includes(searchTerm)
    );
  }

  /**
   * Filtra Pokemon por tipo específico.
   * 
   * @method getPokemonsByType
   * @memberof PokemonService
   * @param {string} type - Tipo de Pokemon a filtrar (ej: 'fire', 'water', 'electric')
   * @returns {Array<Object>} Lista de Pokemon del tipo especificado
   * 
   * @example
   * const firePokemons = pokemonService.getPokemonsByType('fire');
   * const waterPokemons = pokemonService.getPokemonsByType('water');
   */
  getPokemonsByType(type) {
    if (!this.isLoaded || !type) return [];

    return this.pokemons.filter((pokemon) =>
      pokemon.types.includes(type.toLowerCase())
    );
  }

  /**
   * Obtiene todos los tipos únicos de Pokemon disponibles,
   * ordenados alfabéticamente.
   * 
   * @method getAllTypes
   * @memberof PokemonService
   * @returns {Array<string>} Lista ordenada de todos los tipos únicos
   * 
   * @example
   * const types = pokemonService.getAllTypes();
   * // ['bug', 'dark', 'dragon', 'electric', 'fairy', ...]
   */
  getAllTypes() {
    if (!this.isLoaded) return [];

    const types = new Set();
    this.pokemons.forEach((pokemon) => {
      pokemon.types.forEach((type) => types.add(type));
    });

    return Array.from(types).sort();
  }

  /**
   * Cancela inmediatamente la carga actual si está en progreso.
   * Útil para manejar cambios de ruta o desmontaje de componentes.
   * 
   * @method cancelLoad
   * @memberof PokemonService
   * @returns {boolean} true si se canceló una carga, false si no había carga activa
   * 
   * @example
   * // En el desmontaje de un componente React
   * useEffect(() => {
   *   return () => {
   *     pokemonService.cancelLoad();
   *   };
   * }, []);
   */
  cancelLoad() {
    if (this.abortController) {
      console.log("Cancelando carga actual...");
      this.abortController.abort();
      return true;
    }
    return false;
  }

  /**
   * Reinicia completamente el servicio, cancelando cargas activas
   * y limpiando todos los datos. Útil para forzar una recarga completa.
   * 
   * @method reset
   * @memberof PokemonService
   * 
   * @example
   * // Reiniciar el servicio por completo
   * pokemonService.reset();
   * await pokemonService.loadAllPokemons(); // Nueva carga limpia
   */
  reset() {
    this.cancelLoad();
    this._silentReset();
  }

  /**
   * Obtiene información detallada del estado actual del servicio.
   * Útil para debugging y monitoreo del estado.
   * 
   * @method getStatus
   * @memberof PokemonService
   * @returns {Object} Objeto con información completa del estado
   * @returns {boolean} returns.isLoaded - Si los datos están cargados
   * @returns {boolean} returns.isLoading - Si hay una carga en progreso
   * @returns {boolean} returns.hasError - Si hay algún error presente
   * @returns {number} returns.pokemonCount - Número de Pokemon cargados
   * @returns {Object|null} returns.error - Detalles del último error
   * 
   * @example
   * const status = pokemonService.getStatus();
   * console.log(`Estado: ${status.isLoaded ? 'Cargado' : 'No cargado'}`);
   * console.log(`Pokemon: ${status.pokemonCount}`);
   * if (status.hasError) {
   *   console.error('Error:', status.error);
   * }
   */
  getStatus() {
    return {
      isLoaded: this.isLoaded,
      isLoading: this.isLoading,
      hasError: !!this.error,
      pokemonCount: this.pokemons.length,
      error: this.error,
    };
  }
}

/**
 * Instancia única del servicio Pokemon (Singleton Pattern).
 * 
 * Esta instancia mantiene el estado global de todos los Pokemon
 * cargados y debe ser utilizada en toda la aplicación para
 * garantizar consistencia de datos.
 * 
 * @constant {PokemonService}
 * @default
 * 
 * @example
 * import { pokemonService } from './PokemonService';
 * 
 * // Cargar todos los Pokemon
 * const result = await pokemonService.loadAllPokemons();
 * 
 * // Obtener Pokemon cargados
 * const { pokemons } = pokemonService.getAllPokemons();
 * 
 * // Buscar Pokemon específicos
 * const results = pokemonService.searchPokemons('pikachu');
 */
export const pokemonService = new PokemonService();
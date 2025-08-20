import axios from "axios";

/**
 * Servicio API centralizado para el manejo de peticiones HTTP
 * Proporciona una interfaz consistente para comunicarse con APIs REST
 *
 * @example
 * // Crear una instancia de API
 * const api = new ApiService('https://api.ejemplo.com', {
 *   'Authorization': 'Bearer token123'
 * });
 *
 * // Hacer una petición GET
 * const result = await api.get('/users');
 * if (result.success) {
 *   console.log('Datos:', result.data);
 * }
 */
export class ApiService {
  /**
   * Crea una nueva instancia del servicio API
   *
   * @param {string} baseURL - URL base para todas las peticiones
   * @param {Object} [defaultHeaders={}] - Headers por defecto para todas las peticiones
   *
   * @throws {Error} Si baseURL no es una string válida
   *
   * @example
   * const api = new ApiService('https://api.ejemplo.com', {
   *   'Content-Type': 'application/json',
   *   'Authorization': 'Bearer token123'
   * });
   */
  constructor(baseURL, defaultHeaders = {}) {
    // Validación de parámetros
    if (!baseURL || typeof baseURL !== "string") {
      throw new Error("baseURL debe ser una string válida");
    }

    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };

    // Crear instancia de axios con configuración base
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: this.defaultHeaders,
      timeout: 10000, // 10 segundos timeout
      validateStatus: (status) => status >= 200 && status < 300,
      maxRedirects: 5,
    });
  }

  /**
   * Realiza una petición GET al endpoint especificado
   *
   * @param {string} endpoint - El endpoint relativo a consultar (ej: '/users', '/posts/1')
   * @param {Object} [config={}] - Configuración adicional de axios
   * @param {Object} [config.params] - Parámetros de query string
   * @param {Object} [config.headers] - Headers adicionales para esta petición
   * @param {number} [config.timeout] - Timeout específico para esta petición
   *
   * @returns {Promise<ApiResponse>} Promise que resuelve con la respuesta formateada
   *
   * @example
   * // Petición básica
   * const users = await api.get('/users');
   *
   * // Con parámetros de query
   * const filteredUsers = await api.get('/users', {
   *   params: { page: 1, limit: 10 }
   * });
   *
   * // Con headers personalizados
   * const data = await api.get('/protected', {
   *   headers: { 'X-Custom-Header': 'valor' }
   * });
   */
  async get(endpoint, config = {}) {
    try {
      if (!endpoint || typeof endpoint !== "string") {
        throw new Error("Endpoint debe ser una string válida");
      }

      const response = await this.client.get(endpoint, {
        ...config,
        headers: {
          ...this.defaultHeaders,
          ...config.headers,
        },
      });

      return {
        data: response.data,
        status: response.status,
        headers: response.headers,
        success: true,
        timestamp: new Date().toISOString(),
        endpoint: endpoint,
      };
    } catch (error) {
      return this._handleError(error, endpoint);
    }
  }

  /**
   * Maneja errores de forma consistente y proporciona información detallada
   *
   * @private
   * @param {Error} error - Error de axios o JavaScript
   * @param {string} [endpoint] - Endpoint que causó el error
   * @returns {ApiErrorResponse} Objeto con información detallada del error
   */
  _handleError(error, endpoint = "") {
    const baseErrorInfo = {
      success: false,
      timestamp: new Date().toISOString(),
      endpoint: endpoint,
    };

    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      return {
        data: error.response.data || null,
        status: error.response.status,
        headers: error.response.headers,
        ...baseErrorInfo,
        error: {
          type: "response",
          message: this._getErrorMessage(error.response),
          status: error.response.status,
          // Información adicional del error
          statusText: error.response.statusText,
        },
      };
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      return {
        data: null,
        status: null,
        headers: null,
        ...baseErrorInfo,
        error: {
          type: "network",
          message: "Error de conexión. Verifica tu conexión a internet.",
          details: error.message,
          // Más información sobre el error de red
          code: error.code,
        },
      };
    } else {
      // Algo pasó al configurar la petición
      return {
        data: null,
        status: null,
        headers: null,
        ...baseErrorInfo,
        error: {
          type: "config",
          message: "Error al configurar la petición",
          details: error.message,
        },
      };
    }
  }

  /**
   * Extrae un mensaje de error legible de la respuesta del servidor
   *
   * @private
   * @param {Object} response - Respuesta de axios
   * @returns {string} Mensaje de error formateado
   */
  _getErrorMessage(response) {
    // Intentar obtener mensaje del servidor
    if (response.data?.message) return response.data.message;
    if (response.data?.error) return response.data.error;
    if (response.data?.errors?.[0]?.message)
      return response.data.errors[0].message;

    // Mensajes por defecto basados en código de estado
    const statusMessages = {
      400: "Solicitud incorrecta",
      401: "No autorizado",
      403: "Acceso prohibido",
      404: "Recurso no encontrado",
      409: "Conflicto en la solicitud",
      422: "Datos de entrada inválidos",
      429: "Demasiadas solicitudes",
      500: "Error interno del servidor",
      502: "Error de puerta de enlace",
      503: "Servicio no disponible",
      504: "Tiempo de espera agotado",
    };

    return statusMessages[response.status] || `Error ${response.status}`;
  }

  /**
   * Actualiza los headers por defecto para todas las peticiones futuras
   *
   * @param {Object} headers - Nuevos headers a agregar o actualizar
   *
   * @example
   * // Actualizar token de autorización
   * api.setDefaultHeaders({
   *   'Authorization': 'Bearer nuevo-token-123'
   * });
   *
   * // Agregar múltiples headers
   * api.setDefaultHeaders({
   *   'X-Custom-Header': 'valor',
   *   'Accept-Language': 'es-ES'
   * });
   */
  setDefaultHeaders(headers) {
    if (!headers || typeof headers !== "object") {
      console.warn("Headers debe ser un objeto válido");
      return;
    }

    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
    this.client.defaults.headers = {
      ...this.client.defaults.headers,
      ...headers,
    };
  }

  /**
   * Actualiza la URL base para todas las peticiones futuras
   *
   * @param {string} baseURL - Nueva URL base
   *
   * @throws {Error} Si baseURL no es válida
   *
   * @example
   * // Cambiar a entorno de producción
   * api.setBaseURL('https://api.produccion.com');
   */
  setBaseURL(baseURL) {
    if (!baseURL || typeof baseURL !== "string") {
      throw new Error("baseURL debe ser una string válida");
    }

    this.baseURL = baseURL;
    this.client.defaults.baseURL = baseURL;
  }

  /**
   * Método para limpiar headers de autenticación
   * Útil para logout o cambio de usuario
   *
   * @example
   * api.clearAuthHeaders();
   */
  clearAuthHeaders() {
    const authKeys = ["authorization", "Authorization"];
    authKeys.forEach((key) => {
      delete this.defaultHeaders[key];
      delete this.client.defaults.headers[key];
    });
  }

  /**
   * Método para obtener información de configuración actual
   *
   * @returns {Object} Configuración actual de la instancia
   */
  getConfig() {
    return {
      baseURL: this.baseURL,
      headers: { ...this.defaultHeaders },
      timeout: this.client.defaults.timeout,
    };
  }
}

/**
 * @typedef {Object} ApiResponse
 * @property {*} data - Datos de la respuesta
 * @property {number} status - Código de estado HTTP
 * @property {Object} headers - Headers de la respuesta
 * @property {boolean} success - Indica si la petición fue exitosa
 * @property {string} timestamp - Timestamp ISO de la respuesta
 * @property {string} endpoint - Endpoint consultado
 */

/**
 * @typedef {Object} ApiErrorResponse
 * @property {*} data - Datos del error (si los hay)
 * @property {number|null} status - Código de estado HTTP
 * @property {Object|null} headers - Headers de la respuesta de error
 * @property {boolean} success - Siempre false para errores
 * @property {string} timestamp - Timestamp ISO del error
 * @property {string} endpoint - Endpoint que causó el error
 * @property {Object} error - Información detallada del error
 * @property {string} error.type - Tipo de error: 'response', 'network', 'config'
 * @property {string} error.message - Mensaje del error
 * @property {string} [error.details] - Detalles adicionales del error
 * @property {number} [error.status] - Código de estado (para errores de respuesta)
 * @property {string} [error.statusText] - Texto del estado HTTP
 * @property {string} [error.code] - Código de error (para errores de red)
 */

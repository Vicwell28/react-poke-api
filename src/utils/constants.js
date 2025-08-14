/**
 * CONSTANTES DE APLICACIÓN
 * 
 * @description
 * Colección centralizada de todas las constantes utilizadas en la aplicación.
 * Facilita el mantenimiento, evita duplicación y proporciona un punto único de configuración.
 */

// ============================================
// CONFIGURACIÓN GENERAL DE LA APLICACIÓN
// ============================================

/**
 * Configuración básica de la aplicación
 * 
 * @example
 * // En el header de la app
 * <title>{APP_CONFIG.name} - {APP_CONFIG.version}</title>
 * 
 * // En footer o about
 * <span>© 2024 {APP_CONFIG.author}</span>
 * 
 * // En meta tags
 * <meta name="description" content={APP_CONFIG.description} />
 */
export const APP_CONFIG = {
  name: "Mi App React",
  version: "1.0.0",
  description: "Aplicación React con Vite y Tailwind",
  author: "author",
  company: "company",
  contact: {
    email: "email",
    phone: "phone",
    website: "website"
  },
  social: {
    twitter: "twitter",
    facebook: "facebook",
    instagram: "instagram",
    linkedin: "linkedin",
    github: "github"
  }
};

/**
 * Configuración de entorno y builds
 * 
 * @example
 * // Verificar entorno
 * if (ENV_CONFIG.isDevelopment) {
 *   console.log("Modo desarrollo activo");
 * }
 * 
 * // URLs condicionales
 * const apiUrl = ENV_CONFIG.isProduction ? ENV_CONFIG.production.api : ENV_CONFIG.development.api;
 */
export const ENV_CONFIG = {
  environment: import.meta.env.MODE || "development",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  buildDate: new Date().toISOString(),
  development: {
    api: "http://localhost:3000/api",
    debug: true,
    logLevel: "debug"
  },
  production: {
    api: "https://api.miempresa.com",
    debug: false,
    logLevel: "error"
  },
  staging: {
    api: "https://api-staging.miempresa.com",
    debug: true,
    logLevel: "warn"
  }
};

// ============================================
// ENDPOINTS Y URLs DE API
// ============================================

/**
 * Endpoints organizados por módulos
 * Utiliza parámetros dinámicos con :id para flexibilidad
 * 
 * @example
 * // Construcción de URLs dinámicas
 * const userUrl = API_ENDPOINTS.USERS.GET_BY_ID.replace(':id', userId);
 * 
 * // Fetch con endpoints
 * const response = await fetch(API_ENDPOINTS.BASE_URL + API_ENDPOINTS.AUTH.LOGIN);
 * 
 * // Con axios interceptor
 * axios.defaults.baseURL = API_ENDPOINTS.BASE_URL;
 */
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  
  // Autenticación y seguridad
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    CHANGE_PASSWORD: "/auth/change-password"
  },
  
  // Gestión de usuarios
  USERS: {
    GET_ALL: "/users",
    GET_BY_ID: "/users/:id",
    CREATE: "/users",
    UPDATE: "/users/:id",
    DELETE: "/users/:id",
    SEARCH: "/users/search",
    BULK_DELETE: "/users/bulk-delete",
    EXPORT: "/users/export"
  },
  
  // Productos y catálogo
  PRODUCTS: {
    GET_ALL: "/products",
    GET_BY_ID: "/products/:id",
    CREATE: "/products",
    UPDATE: "/products/:id",
    DELETE: "/products/:id",
    SEARCH: "/products/search",
    CATEGORIES: "/products/categories",
    FEATURED: "/products/featured",
    RELATED: "/products/:id/related"
  },
  
  // Nuevos endpoints agregados
  ORDERS: {
    GET_ALL: "/orders",
    GET_BY_ID: "/orders/:id",
    CREATE: "/orders",
    UPDATE: "/orders/:id",
    CANCEL: "/orders/:id/cancel",
    GET_BY_USER: "/users/:userId/orders"
  },
  
  NOTIFICATIONS: {
    GET_ALL: "/notifications",
    MARK_READ: "/notifications/:id/read",
    MARK_ALL_READ: "/notifications/mark-all-read",
    DELETE: "/notifications/:id"
  },
  
  FILES: {
    UPLOAD: "/files/upload",
    DELETE: "/files/:id",
    GET_BY_ID: "/files/:id",
    DOWNLOAD: "/files/:id/download"
  },
  
  ANALYTICS: {
    DASHBOARD: "/analytics/dashboard",
    REPORTS: "/analytics/reports",
    EXPORT: "/analytics/export"
  }
};

// ============================================
// MENSAJES DE LA APLICACIÓN
// ============================================

/**
 * Mensajes centralizados para consistencia en UI
 * Organizados por categorías y contextos
 * 
 * @example
 * // En componentes de notificación
 * showNotification(MESSAGES.SUCCESS.SAVE, NOTIFICATION_TYPES.SUCCESS);
 * 
 * // En validación de formularios
 * const emailError = !email ? MESSAGES.FORM.REQUIRED : 
 *   !isValidEmail(email) ? MESSAGES.FORM.INVALID_EMAIL : '';
 * 
 * // En manejo de errores
 * catch (error) {
 *   const message = error.status === 401 ? 
 *     MESSAGES.ERROR.UNAUTHORIZED : MESSAGES.ERROR.GENERIC;
 *   showError(message);
 * }
 */
export const MESSAGES = {
  SUCCESS: {
    LOGIN: "Inicio de sesión exitoso",
    LOGOUT: "Sesión cerrada correctamente",
    REGISTER: "Cuenta creada exitosamente",
    SAVE: "Datos guardados correctamente",
    DELETE: "Elemento eliminado correctamente",
    UPDATE: "Datos actualizados correctamente",
    UPLOAD: "Archivo subido correctamente",
    SEND: "Mensaje enviado correctamente",
    COPY: "Copiado al portapapeles",
    EXPORT: "Exportación completada"
  },
  
  ERROR: {
    GENERIC: "Ha ocurrido un error inesperado",
    NETWORK: "Error de conexión. Verifica tu internet",
    UNAUTHORIZED: "No tienes permisos para realizar esta acción",
    NOT_FOUND: "El recurso solicitado no existe",
    VALIDATION: "Por favor, verifica los datos ingresados",
    SERVER: "Error del servidor. Intenta más tarde",
    TIMEOUT: "La operación ha excedido el tiempo límite",
    FILE_TOO_LARGE: "El archivo es demasiado grande",
    INVALID_FORMAT: "Formato de archivo no válido",
    DUPLICATE: "Ya existe un elemento con estos datos"
  },
  
  FORM: {
    REQUIRED: "Este campo es obligatorio",
    INVALID_EMAIL: "Ingresa un email válido",
    INVALID_PASSWORD: "La contraseña debe tener al menos 8 caracteres",
    PASSWORD_MISMATCH: "Las contraseñas no coinciden",
    INVALID_PHONE: "Ingresa un teléfono válido",
    MIN_LENGTH: "Debe tener al menos {min} caracteres",
    MAX_LENGTH: "No debe exceder {max} caracteres",
    INVALID_DATE: "Ingresa una fecha válida",
    FUTURE_DATE_REQUIRED: "La fecha debe ser futura",
    PAST_DATE_REQUIRED: "La fecha debe ser pasada"
  },
  
  CONFIRMATION: {
    DELETE: "¿Estás seguro de eliminar este elemento?",
    LOGOUT: "¿Deseas cerrar sesión?",
    CANCEL: "¿Deseas cancelar los cambios?",
    DISCARD: "Los cambios se perderán. ¿Continuar?",
    BULK_DELETE: "¿Eliminar {count} elementos seleccionados?"
  },
  
  INFO: {
    LOADING: "Cargando...",
    NO_DATA: "No hay datos disponibles",
    NO_RESULTS: "No se encontraron resultados",
    EMPTY_STATE: "Aún no hay elementos aquí",
    COMING_SOON: "Próximamente disponible",
    MAINTENANCE: "Sistema en mantenimiento"
  }
};

// ============================================
// ESTADOS Y TIPOS DE LA APLICACIÓN
// ============================================

/**
 * Estados globales de la aplicación
 * Para uso en reducers, estados de componentes y UI
 * 
 * @example
 * const [status, setStatus] = useState(APP_STATES.IDLE);
 * 
 * // En componente de loading
 * if (status === APP_STATES.LOADING) {
 *   return <Spinner />;
 * }
 * 
 * // En manejo de errores
 * if (status === APP_STATES.ERROR) {
 *   return <ErrorMessage />;
 * }
 */
export const APP_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  PENDING: "pending",
  CANCELLED: "cancelled",
  COMPLETED: "completed"
};

/**
 * Roles y permisos de usuario
 * Sistema jerárquico con niveles de acceso
 * 
 * @example
 * // Verificación de permisos
 * if (user.role === USER_ROLES.ADMIN) {
 *   return <AdminPanel />;
 * }
 * 
 * // En rutas protegidas
 * const allowedRoles = [USER_ROLES.ADMIN, USER_ROLES.MODERATOR];
 * if (!allowedRoles.includes(user.role)) {
 *   return <Unauthorized />;
 * }
 */
export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
  GUEST: "guest",
  BANNED: "banned"
};

/**
 * Tipos de notificaciones para UI
 * Consistentes con sistemas de design
 * 
 * @example
 * // En componente de notificación
 * const getNotificationClass = (type) => {
 *   switch (type) {
 *     case NOTIFICATION_TYPES.SUCCESS: return 'bg-green-500';
 *     case NOTIFICATION_TYPES.ERROR: return 'bg-red-500';
 *     case NOTIFICATION_TYPES.WARNING: return 'bg-yellow-500';
 *     default: return 'bg-blue-500';
 *   }
 * };
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info"
};

/**
 * Estados de pedidos/órdenes
 * 
 * @example
 * const getOrderStatusColor = (status) => {
 *   switch (status) {
 *     case ORDER_STATUS.COMPLETED: return 'text-green-600';
 *     case ORDER_STATUS.CANCELLED: return 'text-red-600';
 *     case ORDER_STATUS.PENDING: return 'text-yellow-600';
 *     default: return 'text-gray-600';
 *   }
 * };
 */
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded"
};

// ============================================
// CONFIGURACIONES DE FUNCIONALIDAD
// ============================================

/**
 * Configuración de paginación
 * Estándares para tablas y listados
 * 
 * @example
 * const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
 * 
 * // En select de página
 * {PAGINATION.PAGE_SIZE_OPTIONS.map(size => (
 *   <option key={size} value={size}>{size} por página</option>
 * ))}
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
  MAX_PAGES_SHOWN: 5, // Para paginador
  DEFAULT_PAGE: 1
};

/**
 * Configuración de archivos y uploads
 * Límites y tipos permitidos
 * 
 * @example
 * // Validación de archivo
 * if (file.size > FILE_CONFIG.MAX_SIZE) {
 *   showError(MESSAGES.ERROR.FILE_TOO_LARGE);
 * }
 * 
 * if (!FILE_CONFIG.ALLOWED_TYPES.IMAGES.includes(file.type)) {
 *   showError(MESSAGES.ERROR.INVALID_FORMAT);
 * }
 */
export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_SIZE_AVATAR: 2 * 1024 * 1024, // 2MB para avatares
  MAX_FILES_BULK: 10, // Máximo archivos en upload múltiple
  
  ALLOWED_TYPES: {
    IMAGES: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
    DOCUMENTS: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/rtf"
    ],
    SPREADSHEETS: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv"
    ],
    VIDEOS: ["video/mp4", "video/avi", "video/mov", "video/wmv"],
    AUDIO: ["audio/mp3", "audio/wav", "audio/ogg"]
  },
  
  EXTENSIONS: {
    IMAGES: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    DOCUMENTS: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
    SPREADSHEETS: ['.xls', '.xlsx', '.csv'],
    VIDEOS: ['.mp4', '.avi', '.mov', '.wmv'],
    AUDIO: ['.mp3', '.wav', '.ogg']
  }
};

/**
 * Claves para localStorage
 * Evita duplicados y facilita mantenimiento
 * 
 * @example
 * // Guardar datos
 * localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
 * 
 * // Leer datos
 * const theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
 * 
 * // Limpiar al logout
 * [STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA].forEach(key => {
 *   localStorage.removeItem(key);
 * });
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  THEME: "theme",
  LANGUAGE: "language",
  CART: "shopping_cart",
  PREFERENCES: "user_preferences",
  SEARCH_HISTORY: "search_history",
  FAVORITES: "favorites",
  RECENT_VIEWED: "recent_viewed",
  FORM_DRAFTS: "form_drafts"
};

// ============================================
// RUTAS Y NAVEGACIÓN
// ============================================

/**
 * Rutas de la aplicación organizadas
 * Para React Router y navegación
 * 
 * @example
 * // En React Router
 * <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
 * 
 * // Navegación programática
 * navigate(ROUTES.DASHBOARD);
 * 
 * // Links dinámicos
 * const productUrl = ROUTES.PRODUCT_DETAIL.replace(':id', product.id);
 */
export const ROUTES = {
  // Públicas
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  
  // Protegidas
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  
  // Products
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/:id",
  PRODUCT_CREATE: "/products/create",
  PRODUCT_EDIT: "/products/:id/edit",
  
  // E-commerce
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_SUCCESS: "/order/success",
  ORDER_DETAIL: "/orders/:id",
  
  // Admin
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ANALYTICS: "/admin/analytics",
  
  // Otros
  HELP: "/help",
  CONTACT: "/contact",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  NOT_FOUND: "/404",
  UNAUTHORIZED: "/401"
};

// ============================================
// DISEÑO Y UI
// ============================================

/**
 * Breakpoints responsive consistentes con Tailwind
 * 
 * @example
 * // En CSS-in-JS
 * const styles = {
 *   container: {
 *     [`@media (min-width: ${BREAKPOINTS.MD})`]: {
 *       padding: '2rem'
 *     }
 *   }
 * };
 * 
 * // En hooks personalizados
 * const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.SM})`);
 */
export const BREAKPOINTS = {
  XS: "475px",  // Extra small devices
  SM: "640px",  // Small devices (mobile)
  MD: "768px",  // Medium devices (tablet)
  LG: "1024px", // Large devices (laptop)
  XL: "1280px", // Extra large devices (desktop)
  "2XL": "1536px" // 2X large devices (large desktop)
};

/**
 * Configuración de temas
 * 
 * @example
 * const currentTheme = localStorage.getItem(STORAGE_KEYS.THEME) || THEMES.LIGHT;
 * 
 * const themeColors = THEME_COLORS[currentTheme];
 * document.body.style.backgroundColor = themeColors.background;
 */
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system"
};

export const THEME_COLORS = {
  [THEMES.LIGHT]: {
    primary: "#3b82f6",
    secondary: "#64748b",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#1e293b"
  },
  [THEMES.DARK]: {
    primary: "#60a5fa",
    secondary: "#94a3b8",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f1f5f9"
  }
};

// ============================================
// CONFIGURACIONES ESPECÍFICAS
// ============================================

/**
 * Configuración de fechas y tiempo
 * 
 * @example
 * // Formatear fecha con configuración
 * const formattedDate = new Intl.DateTimeFormat(
 *   DATE_CONFIG.DEFAULT_LOCALE,
 *   DATE_CONFIG.FORMATS.LONG
 * ).format(new Date());
 */
export const DATE_CONFIG = {
  DEFAULT_LOCALE: "es-MX",
  DEFAULT_TIMEZONE: "America/Mexico_City",
  FORMATS: {
    SHORT: { dateStyle: "short" },
    MEDIUM: { dateStyle: "medium" },
    LONG: { dateStyle: "long", timeStyle: "short" },
    TIME_ONLY: { timeStyle: "short" }
  },
  BUSINESS_HOURS: {
    START: "09:00",
    END: "18:00",
    DAYS: ["monday", "tuesday", "wednesday", "thursday", "friday"]
  }
};

/**
 * Configuración de validaciones
 * Criterios globales para formularios
 * 
 * @example
 * // En validación de contraseña
 * if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
 *   return MESSAGES.FORM.INVALID_PASSWORD;
 * }
 */
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true
  },
  EMAIL: {
    MAX_LENGTH: 254,
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PHONE: {
    MEXICO_REGEX: /^(\+52|52)?[\s-]?([1-9]\d{9})$/,
    US_REGEX: /^(\+1|1)?[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{4}$/
  },
  TEXT: {
    MIN_LENGTH: 1,
    MAX_LENGTH_SHORT: 255,
    MAX_LENGTH_MEDIUM: 1000,
    MAX_LENGTH_LONG: 5000
  }
};

/**
 * Límites de rate limiting y timeouts
 * 
 * @example
 * // En interceptor de axios
 * axios.defaults.timeout = API_CONFIG.TIMEOUT;
 * 
 * // Rate limiting manual
 * if (requestCount > API_CONFIG.RATE_LIMITS.REQUESTS_PER_MINUTE) {
 *   throw new Error('Too many requests');
 * }
 */
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
  RATE_LIMITS: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000
  },
  CACHE_DURATION: {
    SHORT: 5 * 60 * 1000,    // 5 minutos
    MEDIUM: 30 * 60 * 1000,  // 30 minutos
    LONG: 24 * 60 * 60 * 1000 // 24 horas
  }
};

//
/**
 * UTILIDADES HELPER
 * 
 * @description
 * Colección completa de funciones utilitarias para desarrollo web.
 * Incluye funciones para manejo de tiempo, DOM, datos, strings, y más.
 */

// ============================================
// UTILIDADES DE TIEMPO Y EJECUCIÓN
// ============================================

/**
 * Crea un delay/sleep asíncrono
 * 
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} Promise que se resuelve después del tiempo especificado
 * 
 * @example
 * // Esperar 2 segundos
 * await delay(2000);
 * console.log("Han pasado 2 segundos");
 * 
 * // Usar en una función async
 * const loadData = async () => {
 *   setLoading(true);
 *   await delay(500); // Simular carga
 *   setData(fetchedData);
 *   setLoading(false);
 * };
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Debounce - Retrasa la ejecución de una función hasta que haya pasado cierto tiempo
 * sin que se vuelva a llamar. Útil para búsquedas en tiempo real.
 * 
 * @param {Function} func - Función a ejecutar con retraso
 * @param {number} wait - Tiempo de espera en milisegundos
 * @returns {Function} Función debounced
 * 
 * @example
 * // Búsqueda con debounce
 * const debouncedSearch = debounce((query) => {
 *   searchAPI(query);
 * }, 300);
 * 
 * // En un input
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 * 
 * // Redimensionado de ventana
 * const debouncedResize = debounce(() => {
 *   handleWindowResize();
 * }, 250);
 * window.addEventListener('resize', debouncedResize);
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle - Limita la frecuencia de ejecución de una función
 * Garantiza que la función no se ejecute más de una vez en el intervalo especificado
 * 
 * @param {Function} func - Función a throttlear
 * @param {number} limit - Intervalo mínimo entre ejecuciones en milisegundos
 * @returns {Function} Función throttled
 * 
 * @example
 * // Scroll con throttle
 * const throttledScroll = throttle(() => {
 *   handleScroll();
 * }, 100);
 * window.addEventListener('scroll', throttledScroll);
 * 
 * // Click de botón
 * const throttledSubmit = throttle(() => {
 *   submitForm();
 * }, 1000);
 */
export const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function (...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

// ============================================
// UTILIDADES DE NAVEGADOR Y DOM
// ============================================

/**
 * Copia texto al portapapeles usando la API moderna
 * 
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} true si se copió exitosamente, false si falló
 * 
 * @example
 * const handleCopy = async () => {
 *   const success = await copyToClipboard("Texto a copiar");
 *   if (success) {
 *     showNotification("¡Copiado!");
 *   } else {
 *     showNotification("Error al copiar");
 *   }
 * };
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Error al copiar:", err);
    return false;
  }
};

/**
 * Genera un ID único basado en timestamp y números aleatorios
 * 
 * @param {string} [prefix=""] - Prefijo opcional para el ID
 * @returns {string} ID único generado
 * 
 * @example
 * generateId() // "1k2j3h4g5f"
 * generateId("user-") // "user-1k2j3h4g5f"
 * generateId("btn-") // "btn-1k2j3h4g5f"
 * 
 * // Uso en componentes React
 * const [inputId] = useState(() => generateId("input-"));
 */
export const generateId = (prefix = "") => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2);
  return `${prefix}${timestamp}${randomStr}`;
};

/**
 * Obtiene parámetros de query de una URL
 * 
 * @param {string} [url=window.location.href] - URL a analizar
 * @returns {Object} Objeto con los parámetros de query
 * 
 * @example
 * // URL: https://ejemplo.com?page=1&filter=active&sort=date
 * getQueryParams() // { page: "1", filter: "active", sort: "date" }
 * 
 * // URL específica
 * getQueryParams("https://ejemplo.com?id=123&tab=profile")
 * // { id: "123", tab: "profile" }
 */
export const getQueryParams = (url = window.location.href) => {
  const params = new URLSearchParams(new URL(url).search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

/**
 * Realiza scroll suave hacia un elemento específico
 * 
 * @param {string} elementId - ID del elemento de destino
 * @param {number} [offset=0] - Offset desde la parte superior en pixels
 * 
 * @example
 * // Scroll a una sección
 * scrollToElement("about-section");
 * 
 * // Scroll con offset para header fijo
 * scrollToElement("contact-section", 80);
 * 
 * // En un botón
 * <button onClick={() => scrollToElement("footer")}>
 *   Ir al footer
 * </button>
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  }
};

/**
 * Verifica si el dispositivo es móvil basado en el ancho de pantalla
 * 
 * @returns {boolean} true si es móvil (≤768px)
 * 
 * @example
 * if (isMobile()) {
 *   // Lógica específica para móvil
 *   showMobileMenu();
 * }
 */
export const isMobile = () => {
  return window.innerWidth <= 768;
};

/**
 * Obtiene información detallada del dispositivo y navegador
 * 
 * @returns {Object} Información completa del dispositivo
 * 
 * @example
 * const deviceInfo = getDeviceInfo();
 * console.log(deviceInfo);
 * // {
 * //   isMobile: false,
 * //   isTablet: false,
 * //   isDesktop: true,
 * //   browser: "Mozilla/5.0...",
 * //   language: "es-MX",
 * //   platform: "MacIntel"
 * // }
 * 
 * // Uso condicional
 * if (deviceInfo.isMobile) {
 *   loadMobileAssets();
 * }
 */
export const getDeviceInfo = () => {
  return {
    isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ),
    isTablet: /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent),
    isDesktop: !/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ),
    browser: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
  };
};

// ============================================
// UTILIDADES DE FORMATO Y CONVERSIÓN
// ============================================

/**
 * Formatea el tamaño de archivo en unidades legibles
 * 
 * @param {number} bytes - Tamaño en bytes
 * @param {number} [decimals=2] - Número de decimales
 * @returns {string} Tamaño formateado
 * 
 * @example
 * formatFileSize(1024) // "1.00 KB"
 * formatFileSize(1048576) // "1.00 MB"
 * formatFileSize(1234567, 1) // "1.2 MB"
 * formatFileSize(0) // "0 Bytes"
 * 
 * // En componente de upload
 * <div>Tamaño: {formatFileSize(file.size)}</div>
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// ============================================
// UTILIDADES DE DATOS Y OBJETOS
// ============================================

/**
 * Verifica si un objeto, array o string está vacío
 * 
 * @param {any} obj - Valor a verificar
 * @returns {boolean} true si está vacío
 * 
 * @example
 * isEmpty({}) // true
 * isEmpty([]) // true
 * isEmpty("") // true
 * isEmpty(null) // true
 * isEmpty({ name: "Juan" }) // false
 * isEmpty([1, 2, 3]) // false
 * 
 * // Uso en validaciones
 * if (isEmpty(formData.errors)) {
 *   submitForm();
 * }
 */
export const isEmpty = (obj) => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === "string") return obj.length === 0;
  if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
  return Object.keys(obj).length === 0;
};

/**
 * Crea una copia profunda de un objeto (deep clone)
 * 
 * @param {any} obj - Objeto a clonar
 * @returns {any} Copia profunda del objeto
 * 
 * @example
 * const original = { user: { name: "Juan", age: 30 } };
 * const copy = deepClone(original);
 * copy.user.name = "Pedro";
 * console.log(original.user.name); // "Juan" (no cambió)
 * 
 * // Clonar arrays anidados
 * const originalArray = [{ id: 1 }, { id: 2 }];
 * const clonedArray = deepClone(originalArray);
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map((item) => deepClone(item));

  const clonedObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
};

/**
 * Agrupa elementos de un array por una propiedad específica
 * 
 * @param {Array} array - Array a agrupar
 * @param {string} key - Propiedad por la cual agrupar
 * @returns {Object} Objeto con los elementos agrupados
 * 
 * @example
 * const users = [
 *   { name: "Juan", department: "IT" },
 *   { name: "Ana", department: "HR" },
 *   { name: "Pedro", department: "IT" }
 * ];
 * 
 * const grouped = groupBy(users, "department");
 * // {
 * //   IT: [{ name: "Juan", department: "IT" }, { name: "Pedro", department: "IT" }],
 * //   HR: [{ name: "Ana", department: "HR" }]
 * // }
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Remueve elementos duplicados de un array
 * 
 * @param {Array} array - Array con posibles duplicados
 * @param {string|null} [key=null] - Propiedad para comparar (para objetos)
 * @returns {Array} Array sin duplicados
 * 
 * @example
 * // Array simple
 * removeDuplicates([1, 2, 2, 3, 1]) // [1, 2, 3]
 * 
 * // Array de objetos
 * const users = [
 *   { id: 1, name: "Juan" },
 *   { id: 2, name: "Ana" },
 *   { id: 1, name: "Juan" }
 * ];
 * removeDuplicates(users, "id") // [{ id: 1, name: "Juan" }, { id: 2, name: "Ana" }]
 */
export const removeDuplicates = (array, key = null) => {
  if (!key) {
    return [...new Set(array)];
  }

  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// ============================================
// UTILIDADES DE STRINGS
// ============================================

/**
 * Capitaliza la primera letra de cada palabra
 * 
 * @param {string} str - String a capitalizar
 * @returns {string} String con cada palabra capitalizada
 * 
 * @example
 * capitalizeWords("juan carlos pérez") // "Juan Carlos Pérez"
 * capitalizeWords("TEXTO EN MAYÚSCULAS") // "TEXTO EN MAYÚSCULAS"
 * 
 * // Uso en nombres de usuario
 * const displayName = capitalizeWords(user.fullName);
 */
export const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Trunca un texto a una longitud específica
 * 
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} [suffix="..."] - Sufijo a agregar
 * @returns {string} Texto truncado
 * 
 * @example
 * truncateText("Este es un texto muy largo", 10) // "Este es..."
 * truncateText("Corto", 10) // "Corto"
 * truncateText("Texto largo", 8, " [más]") // "Texto [más]"
 * 
 * // En componentes
 * <p>{truncateText(article.content, 150)}</p>
 */
export const truncateText = (text, maxLength, suffix = "...") => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// ============================================
// NUEVAS UTILIDADES AGREGADAS
// ============================================

/**
 * Convierte un string a formato slug (URL-friendly)
 * 
 * @param {string} str - String a convertir
 * @returns {string} String en formato slug
 * 
 * @example
 * slugify("Título con Espacios y Acentos!") // "titulo-con-espacios-y-acentos"
 * slugify("Product Name 2023") // "product-name-2023"
 * 
 * // Para URLs de blog
 * const articleUrl = `/blog/${slugify(article.title)}`;
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-'); // Múltiples guiones a uno solo
};

/**
 * Genera un color hexadecimal aleatorio
 * 
 * @returns {string} Color hexadecimal aleatorio
 * 
 * @example
 * getRandomColor() // "#3a7bd4"
 * getRandomColor() // "#f2a84c"
 * 
 * // Para avatars dinámicos
 * const avatarBg = getRandomColor();
 * <div style={{ backgroundColor: avatarBg }}>JC</div>
 */
export const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

/**
 * Formatea números a formato de moneda
 * 
 * @param {number} amount - Cantidad a formatear
 * @param {string} [currency="MXN"] - Código de moneda
 * @param {string} [locale="es-MX"] - Configuración regional
 * @returns {string} Número formateado como moneda
 * 
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(1000, "USD", "en-US") // "$1,000.00"
 * formatCurrency(500.75, "EUR", "es-ES") // "500,75 €"
 */
export const formatCurrency = (amount, currency = "MXN", locale = "es-MX") => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Formatea fecha de manera legible
 * 
 * @param {Date|string} date - Fecha a formatear
 * @param {Object} [options] - Opciones de formato
 * @returns {string} Fecha formateada
 * 
 * @example
 * formatDate(new Date()) // "13 de agosto de 2025"
 * formatDate("2023-12-25", { dateStyle: "short" }) // "25/12/2023"
 * formatDate(new Date(), { timeStyle: "short", dateStyle: "medium" }) // "13 ago 2025, 14:30"
 */
export const formatDate = (date, options = { dateStyle: 'long' }) => {
  return new Intl.DateTimeFormat('es-MX', options).format(new Date(date));
};

/**
 * Calcula el tiempo transcurrido desde una fecha (tiempo relativo)
 * 
 * @param {Date|string} date - Fecha de referencia
 * @returns {string} Tiempo transcurrido en formato legible
 * 
 * @example
 * timeAgo(new Date(Date.now() - 60000)) // "hace 1 minuto"
 * timeAgo(new Date(Date.now() - 3600000)) // "hace 1 hora"
 * timeAgo("2023-01-01") // "hace 1 año"
 */
export const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: 'año', seconds: 31536000 },
    { label: 'mes', seconds: 2592000 },
    { label: 'día', seconds: 86400 },
    { label: 'hora', seconds: 3600 },
    { label: 'minuto', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `hace ${count} ${interval.label}${count > 1 ? 's' : ''}`;
    }
  }

  return 'hace unos segundos';
};

/**
 * Valida y retorna una URL absoluta
 * 
 * @param {string} url - URL a validar
 * @param {string} [baseUrl=window.location.origin] - URL base para URLs relativas
 * @returns {string|null} URL absoluta válida o null si es inválida
 * 
 * @example
 * getAbsoluteUrl("/api/users") // "https://ejemplo.com/api/users"
 * getAbsoluteUrl("https://google.com") // "https://google.com"
 * getAbsoluteUrl("invalid-url") // null
 */
export const getAbsoluteUrl = (url, baseUrl = window.location.origin) => {
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return null;
  }
};

/**
 * Retorna un valor por defecto si el valor es null, undefined o vacío
 * 
 * @param {any} value - Valor a evaluar
 * @param {any} defaultValue - Valor por defecto
 * @returns {any} Valor original o valor por defecto
 * 
 * @example
 * defaultTo(null, "Sin datos") // "Sin datos"
 * defaultTo("", "Vacío") // "Vacío"
 * defaultTo("Hola", "Default") // "Hola"
 * defaultTo(0, 10) // 0 (el 0 es un valor válido)
 * 
 * // Uso en componentes
 * const displayName = defaultTo(user.name, "Usuario anónimo");
 */
export const defaultTo = (value, defaultValue) => {
  return (value == null || value === '') ? defaultValue : value;
};

/**
 * Almacena datos en localStorage de forma segura
 * 
 * @param {string} key - Clave del storage
 * @param {any} value - Valor a almacenar
 * @returns {boolean} true si se guardó exitosamente
 * 
 * @example
 * setStorageItem("user-preferences", { theme: "dark", language: "es" });
 * setStorageItem("token", "abc123");
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Recupera datos de localStorage de forma segura
 * 
 * @param {string} key - Clave del storage
 * @param {any} [defaultValue=null] - Valor por defecto si no existe
 * @returns {any} Valor almacenado o valor por defecto
 * 
 * @example
 * const userPrefs = getStorageItem("user-preferences", { theme: "light" });
 * const token = getStorageItem("token");
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Genera un número aleatorio en un rango específico
 * 
 * @param {number} min - Valor mínimo (inclusivo)
 * @param {number} max - Valor máximo (inclusivo)
 * @returns {number} Número aleatorio en el rango
 * 
 * @example
 * randomInRange(1, 10) // 7
 * randomInRange(0, 100) // 42
 * 
 * // Para simulaciones o demos
 * const randomDelay = randomInRange(100, 500);
 * await delay(randomDelay);
 */
export const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Convierte un objeto en parámetros de query string
 * 
 * @param {Object} params - Objeto con parámetros
 * @returns {string} Query string
 * 
 * @example
 * objectToQueryString({ page: 1, filter: "active", sort: "date" })
 * // "page=1&filter=active&sort=date"
 * 
 * // Para construir URLs
 * const queryString = objectToQueryString(filters);
 * const url = `/api/users?${queryString}`;
 */
export const objectToQueryString = (params) => {
  return new URLSearchParams(params).toString();
};

/**
 * Aplana un array anidado (flatten)
 * 
 * @param {Array} arr - Array a aplanar
 * @param {number} [depth=Infinity] - Profundidad máxima
 * @returns {Array} Array aplanado
 * 
 * @example
 * flattenArray([1, [2, 3], [4, [5, 6]]]) // [1, 2, 3, 4, 5, 6]
 * flattenArray([1, [2, [3, [4]]]], 2) // [1, 2, 3, [4]]
 */
export const flattenArray = (arr, depth = Infinity) => {
  return arr.flat(depth);
};

// ============================================
// EJEMPLO DE USO INTEGRADO
// ============================================

/**
 * EJEMPLO DE USO COMBINADO
 * 
 * // Función utilitaria para manejo de formularios con datos
 * const handleFormSubmit = async (formData) => {
 *   const loadingId = generateId("loading-");
 *   
 *   try {
 *     // Mostrar loading
 *     setLoading(true);
 *     
 *     // Simular delay de red
 *     await delay(randomInRange(500, 1500));
 *     
 *     // Procesar datos
 *     const processedData = {
 *       ...formData,
 *       slug: slugify(formData.title),
 *       createdAt: formatDate(new Date()),
 *       id: generateId("item-")
 *     };
 *     
 *     // Guardar en localStorage
 *     const existingData = getStorageItem("form-data", []);
 *     const updatedData = [...existingData, processedData];
 *     setStorageItem("form-data", updatedData);
 *     
 *     // Copiar ID al portapapeles
 *     await copyToClipboard(processedData.id);
 *     
 *     // Scroll a resultado
 *     scrollToElement("success-message");
 *     
 *     return processedData;
 *   } finally {
 *     setLoading(false);
 *   }
 * };
 */
/**
 * UTILIDADES DE FORMATEO
 * 
 * @description
 * Colección completa de funciones para formatear datos de manera consistente.
 * Incluye formateo de números, fechas, texto, archivos y más.
 */

// ============================================
// FORMATEO DE NÚMEROS Y MONEDA
// ============================================

/**
 * Formatea números como moneda con soporte internacional
 * 
 * @param {number} amount - Cantidad a formatear
 * @param {string} [currency="MXN"] - Código de moneda (USD, MXN, EUR, etc.)
 * @param {string} [locale="es-MX"] - Configuración regional
 * @returns {string} Número formateado como moneda
 * 
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(1000, "USD", "en-US") // "$1,000.00"
 * formatCurrency(500.75, "EUR", "es-ES") // "500,75 €"
 * formatCurrency(2500.99, "JPY", "ja-JP") // "¥2,501"
 * 
 * // En componentes de e-commerce
 * <div className="price">{formatCurrency(product.price)}</div>
 * 
 * // Para múltiples monedas
 * const formatPrice = (amount, userCurrency) => formatCurrency(amount, userCurrency);
 */
export const formatCurrency = (amount, currency = "MXN", locale = "es-MX") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Formatea números grandes con sufijos (1K, 1M, etc.)
 * 
 * @param {number} num - Número a formatear
 * @param {number} [decimals=1] - Número de decimales
 * @returns {string} Número formateado con sufijo
 * 
 * @example
 * formatNumber(1234) // "1.2K"
 * formatNumber(1500000) // "1.5M"
 * formatNumber(2800000000) // "2.8B"
 * formatNumber(999) // "999"
 * formatNumber(1234, 0) // "1K"
 * 
 * // Para redes sociales (seguidores, likes)
 * <span>{formatNumber(user.followers)} seguidores</span>
 * 
 * // Para estadísticas
 * const visits = formatNumber(analytics.pageViews);
 */
export const formatNumber = (num, decimals = 1) => {
  if (num < 1000) return num.toString();

  const units = ["", "K", "M", "B", "T"];
  const unitIndex = Math.floor(Math.log10(Math.abs(num)) / 3);
  const scaledNum = num / Math.pow(1000, unitIndex);

  return `${scaledNum.toFixed(decimals)}${units[unitIndex]}`;
};

/**
 * Formatea números con separadores de miles
 * 
 * @param {number} num - Número a formatear
 * @param {string} [locale="es-MX"] - Configuración regional
 * @returns {string} Número con separadores
 * 
 * @example
 * formatNumberWithCommas(1234567) // "1,234,567"
 * formatNumberWithCommas(1234.56) // "1,234.56"
 * formatNumberWithCommas(1234567, "de-DE") // "1.234.567" (formato alemán)
 */
export const formatNumberWithCommas = (num, locale = "es-MX") => {
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Formatea porcentajes
 * 
 * @param {number} value - Valor decimal (0.25 para 25%)
 * @param {number} [decimals=1] - Número de decimales
 * @param {string} [locale="es-MX"] - Configuración regional
 * @returns {string} Porcentaje formateado
 * 
 * @example
 * formatPercentage(0.1534) // "15.3%"
 * formatPercentage(0.75, 0) // "75%"
 * formatPercentage(1.25) // "125.0%"
 * 
 * // Para barras de progreso
 * const progress = formatPercentage(completed / total);
 */
export const formatPercentage = (value, decimals = 1, locale = "es-MX") => {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

// ============================================
// FORMATEO DE FECHAS Y TIEMPO
// ============================================

/**
 * Formatea fechas con múltiples opciones de formato
 * 
 * @param {Date|string} date - Fecha a formatear
 * @param {string} [format="short"] - Formato deseado
 * @param {string} [locale="es-MX"] - Configuración regional
 * @returns {string} Fecha formateada
 * 
 * @example
 * formatDate(new Date()) // "13/8/2025" (short)
 * formatDate(new Date(), "medium") // "13 ago 2025"
 * formatDate(new Date(), "long") // "13 de agosto de 2025"
 * formatDate(new Date(), "full") // "miércoles, 13 de agosto de 2025"
 * formatDate(new Date(), "datetime") // "13 ago 2025, 14:30"
 * formatDate(new Date(), "time") // "14:30"
 * formatDate(new Date(), "relative") // "hace 2 minutos"
 * 
 * // Formatos personalizados
 * formatDate(date, "custom", "en-US") // En inglés
 */
export const formatDate = (date, format = "short", locale = "es-MX") => {
  const dateObj = new Date(date);

  const formats = {
    short: { dateStyle: "short" },
    medium: { dateStyle: "medium" },
    long: { dateStyle: "long" },
    full: { dateStyle: "full" },
    datetime: { dateStyle: "medium", timeStyle: "short" },
    time: { timeStyle: "short" },
    relative: null, // Para fecha relativa
  };

  if (format === "relative") {
    return formatRelativeTime(dateObj);
  }

  return new Intl.DateTimeFormat(locale, formats[format]).format(dateObj);
};

/**
 * Formatea tiempo relativo usando Intl.RelativeTimeFormat
 * 
 * @param {Date|string} date - Fecha de referencia
 * @param {string} [locale="es"] - Configuración regional
 * @returns {string} Tiempo relativo formateado
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 60000)) // "hace 1 minuto"
 * formatRelativeTime(new Date(Date.now() + 3600000)) // "en 1 hora"
 * formatRelativeTime(new Date(Date.now() - 86400000)) // "ayer"
 * 
 * // Para feeds de noticias
 * <time>{formatRelativeTime(post.createdAt)}</time>
 * 
 * // Para notificaciones
 * const notificationTime = formatRelativeTime(notification.timestamp);
 */
export const formatRelativeTime = (date, locale = "es") => {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const now = new Date();
  const diffInSeconds = (new Date(date) - now) / 1000;

  const units = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  for (const { unit, seconds } of units) {
    const interval = Math.round(diffInSeconds / seconds);
    if (Math.abs(interval) >= 1) {
      return rtf.format(interval, unit);
    }
  }

  return rtf.format(0, "second");
};

/**
 * Formatea duración en formato legible
 * 
 * @param {number} seconds - Segundos de duración
 * @returns {string} Duración formateada
 * 
 * @example
 * formatDuration(65) // "1m 5s"
 * formatDuration(3661) // "1h 1m 1s"
 * formatDuration(30) // "30s"
 * 
 * // Para reproductores de video
 * <span className="duration">{formatDuration(video.length)}</span>
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};

// ============================================
// FORMATEO DE TEXTO Y STRINGS
// ============================================

/**
 * Capitaliza la primera letra de una cadena
 * 
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena con primera letra mayúscula
 * 
 * @example
 * capitalize("hola mundo") // "Hola mundo"
 * capitalize("TEXTO") // "Texto"
 * capitalize("") // ""
 * 
 * // Para nombres de usuario
 * const displayName = capitalize(user.firstName);
 */
export const capitalize = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convierte texto a Title Case (cada palabra capitalizada)
 * 
 * @param {string} str - Cadena a convertir
 * @returns {string} Texto en Title Case
 * 
 * @example
 * toTitleCase("hola mundo desde javascript") // "Hola Mundo Desde Javascript"
 * toTitleCase("API REST con NODE.JS") // "Api Rest Con Node.Js"
 * 
 * // Para títulos de artículos
 * const articleTitle = toTitleCase(rawTitle);
 */
export const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Convierte texto a camelCase
 * 
 * @param {string} str - Cadena a convertir
 * @returns {string} Texto en camelCase
 * 
 * @example
 * toCamelCase("hola mundo") // "holaMundo"
 * toCamelCase("mi-variable-css") // "miVariableCss"
 * toCamelCase("user_first_name") // "userFirstName"
 */
export const toCamelCase = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
};

/**
 * Convierte camelCase a kebab-case
 * 
 * @param {string} str - Cadena en camelCase
 * @returns {string} Texto en kebab-case
 * 
 * @example
 * toKebabCase("holaMundo") // "hola-mundo"
 * toKebabCase("userFirstName") // "user-first-name"
 * toKebabCase("APIResponse") // "api-response"
 */
export const toKebabCase = (str) => {
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    .toLowerCase();
};

/**
 * Convierte texto a snake_case
 * 
 * @param {string} str - Cadena a convertir
 * @returns {string} Texto en snake_case
 * 
 * @example
 * toSnakeCase("holaMundo") // "hola_mundo"
 * toSnakeCase("user-first-name") // "user_first_name"
 * toSnakeCase("User First Name") // "user_first_name"
 */
export const toSnakeCase = (str) => {
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
};

/**
 * Crea un slug amigable para URLs
 * 
 * @param {string} str - Cadena a convertir
 * @returns {string} Slug para URL
 * 
 * @example
 * createSlug("¡Hola Mundo con Acentos!") // "hola-mundo-con-acentos"
 * createSlug("  Título con    espacios  ") // "titulo-con-espacios"
 * createSlug("Product Name 2023") // "product-name-2023"
 * 
 * // Para URLs de blog
 * const postUrl = `/blog/${createSlug(post.title)}`;
 */
export const createSlug = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .trim()
    .replace(/[^\w\s-]/g, "") // Solo letras, números, espacios y guiones
    .replace(/[\s_-]+/g, "-") // Espacios y guiones múltiples a un guión
    .replace(/^-+|-+$/g, ""); // Remover guiones al inicio y final
};

/**
 * Trunca texto y agrega puntos suspensivos
 * 
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} [suffix="..."] - Sufijo a agregar
 * @returns {string} Texto truncado
 * 
 * @example
 * truncateText("Este es un texto muy largo", 15) // "Este es un te..."
 * truncateText("Corto", 10) // "Corto"
 * truncateText("Texto largo", 8, " [más]") // "Texto [más]"
 */
export const truncateText = (text, maxLength, suffix = "...") => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// ============================================
// FORMATEO DE ARCHIVOS Y DATOS
// ============================================

/**
 * Formatea nombres de archivo para visualización
 * 
 * @param {string} fileName - Nombre del archivo
 * @param {number} [maxLength=20] - Longitud máxima del nombre
 * @returns {string} Nombre de archivo formateado
 * 
 * @example
 * formatFileName("documento-muy-largo.pdf") // "documento-muy-lar....pdf"
 * formatFileName("imagen.jpg") // "imagen.jpg"
 * formatFileName("mi-archivo-super-largo-con-nombre-extenso.docx", 15) 
 * // "mi-archivo-sup....docx"
 * 
 * // Para listas de archivos
 * <div className="file-name">{formatFileName(file.name)}</div>
 */
export const formatFileName = (fileName, maxLength = 20) => {
  if (!fileName) return "";
  
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return fileName.length > maxLength 
      ? fileName.substring(0, maxLength) + "..." 
      : fileName;
  }
  
  const name = fileName.substring(0, lastDotIndex);
  const extension = fileName.substring(lastDotIndex);
  
  if (name.length <= maxLength) return fileName;
  
  const truncatedName = name.substring(0, maxLength - 3) + "...";
  return truncatedName + extension;
};

/**
 * Formatea tamaño de archivo en unidades legibles
 * 
 * @param {number} bytes - Tamaño en bytes
 * @param {number} [decimals=1] - Número de decimales
 * @returns {string} Tamaño formateado
 * 
 * @example
 * formatFileSize(1024) // "1.0 KB"
 * formatFileSize(1048576) // "1.0 MB"
 * formatFileSize(1234567, 2) // "1.18 MB"
 * 
 * // Para componentes de upload
 * <span>{formatFileSize(file.size)}</span>
 */
export const formatFileSize = (bytes, decimals = 1) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// ============================================
// NUEVAS UTILIDADES DE FORMATEO AGREGADAS
// ============================================

/**
 * Formatea números de teléfono (formato mexicano)
 * 
 * @param {string} phone - Número telefónico
 * @param {string} [format="(###) ###-####"] - Formato de salida
 * @returns {string} Número formateado
 * 
 * @example
 * formatPhoneNumber("5551234567") // "(555) 123-4567"
 * formatPhoneNumber("525551234567") // "+52 (555) 123-4567"
 * formatPhoneNumber("1234567890", "###-###-####") // "123-456-7890"
 */
export const formatPhoneNumber = (phone, format = "(###) ###-####") => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return format
      .replace(/###/g, match => cleaned.substr(0, 3))
      .replace(/###/g, match => cleaned.substr(3, 3))
      .replace(/####/g, match => cleaned.substr(6, 4));
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('52')) {
    const nationalNumber = cleaned.substr(2);
    return `+52 ${formatPhoneNumber(nationalNumber)}`;
  }
  
  return phone; // Retorna original si no coincide con formato esperado
};

/**
 * Formatea direcciones de email para visualización
 * 
 * @param {string} email - Email a formatear
 * @param {number} [maxLength=30] - Longitud máxima
 * @returns {string} Email formateado
 * 
 * @example
 * formatEmail("usuario@ejemplo.com") // "usuario@ejemplo.com"
 * formatEmail("usuario.muy.largo@dominio-ejemplo.com", 20) // "usuario.mu...@dominio-ejemplo.com"
 */
export const formatEmail = (email, maxLength = 30) => {
  if (!email || email.length <= maxLength) return email;
  
  const [localPart, domain] = email.split('@');
  if (localPart.length > maxLength - domain.length - 4) {
    const truncatedLocal = localPart.substring(0, maxLength - domain.length - 7) + '...';
    return `${truncatedLocal}@${domain}`;
  }
  
  return email;
};

/**
 * Formatea códigos postales
 * 
 * @param {string} postalCode - Código postal
 * @param {string} [country="MX"] - País (MX, US, CA)
 * @returns {string} Código postal formateado
 * 
 * @example
 * formatPostalCode("01000") // "01000" (México)
 * formatPostalCode("12345", "US") // "12345"
 * formatPostalCode("123456789", "US") // "12345-6789"
 */
export const formatPostalCode = (postalCode, country = "MX") => {
  const cleaned = postalCode.replace(/\D/g, '');
  
  switch (country) {
    case "US":
      if (cleaned.length === 9) {
        return `${cleaned.substr(0, 5)}-${cleaned.substr(5, 4)}`;
      }
      return cleaned.substr(0, 5);
    case "CA":
      if (cleaned.length === 6) {
        return `${cleaned.substr(0, 3)} ${cleaned.substr(3, 3)}`.toUpperCase();
      }
      return postalCode.toUpperCase();
    case "MX":
    default:
      return cleaned.substr(0, 5);
  }
};

/**
 * Formatea números de tarjeta de crédito
 * 
 * @param {string} cardNumber - Número de tarjeta
 * @param {boolean} [maskDigits=true] - Ocultar dígitos medios
 * @returns {string} Número de tarjeta formateado
 * 
 * @example
 * formatCardNumber("1234567890123456") // "**** **** **** 3456"
 * formatCardNumber("1234567890123456", false) // "1234 5678 9012 3456"
 */
export const formatCardNumber = (cardNumber, maskDigits = true) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g) || [];
  
  if (maskDigits && groups.length >= 4) {
    const maskedGroups = groups.map((group, index) => {
      if (index === 0 || index === groups.length - 1) {
        return group;
      }
      return '*'.repeat(group.length);
    });
    return maskedGroups.join(' ');
  }
  
  return groups.join(' ');
};

/**
 * Formatea coordenadas GPS
 * 
 * @param {number} latitude - Latitud
 * @param {number} longitude - Longitud
 * @param {number} [precision=4] - Decimales de precisión
 * @returns {string} Coordenadas formateadas
 * 
 * @example
 * formatCoordinates(25.6866, -100.3161) // "25.6866°N, 100.3161°W"
 * formatCoordinates(-34.6037, -58.3816, 2) // "34.60°S, 58.38°W"
 */
export const formatCoordinates = (latitude, longitude, precision = 4) => {
  const lat = Math.abs(latitude).toFixed(precision);
  const lng = Math.abs(longitude).toFixed(precision);
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lngDir = longitude >= 0 ? 'E' : 'W';
  
  return `${lat}°${latDir}, ${lng}°${lngDir}`;
};

/**
 * Formatea tiempo de ejecución o rendimiento
 * 
 * @param {number} milliseconds - Tiempo en milisegundos
 * @returns {string} Tiempo formateado
 * 
 * @example
 * formatExecutionTime(1500) // "1.50s"
 * formatTime(250) // "250ms"
 * formatExecutionTime(65000) // "1m 5s"
 */
export const formatExecutionTime = (milliseconds) => {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }
  
  if (milliseconds < 60000) {
    return `${(milliseconds / 1000).toFixed(2)}s`;
  }
  
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
};

/**
 * Formatea rangos de valores
 * 
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @param {string} [unit=""] - Unidad de medida
 * @returns {string} Rango formateado
 * 
 * @example
 * formatRange(18, 65) // "18 - 65"
 * formatRange(100, 500, "$") // "$100 - $500"
 * formatRange(1.5, 2.8, "kg") // "1.5kg - 2.8kg"
 */
export const formatRange = (min, max, unit = "") => {
  return `${unit}${min} - ${unit}${max}`;
};

// ============================================
// EJEMPLO DE USO INTEGRADO
// ============================================

/**
 * EJEMPLO DE USO EN COMPONENTE REACT
 * 
 * const ProductCard = ({ product }) => {
 *   return (
 *     <div className="product-card">
 *       <h3>{toTitleCase(product.name)}</h3>
 *       <p className="price">{formatCurrency(product.price)}</p>
 *       <p className="views">{formatNumber(product.views)} visualizaciones</p>
 *       <p className="discount">{formatPercentage(product.discount)} de descuento</p>
 *       <time>{formatRelativeTime(product.createdAt)}</time>
 *       <div className="specs">
 *         <span>Peso: {formatRange(product.minWeight, product.maxWeight, "")}</span>
 *         <span>Tamaño: {formatFileSize(product.fileSize)}</span>
 *       </div>
 *     </div>
 *   );
 * };
 * 
 * // Uso en formularios
 * const ContactForm = () => {
 *   const [phone, setPhone] = useState("");
 *   
 *   const handlePhoneChange = (e) => {
 *     const formatted = formatPhoneNumber(e.target.value);
 *     setPhone(formatted);
 *   };
 *   
 *   return (
 *     <input 
 *       value={phone}
 *       onChange={handlePhoneChange}
 *       placeholder="(555) 123-4567"
 *     />
 *   );
 * };
 */
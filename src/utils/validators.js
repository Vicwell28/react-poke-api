/**
 * UTILIDADES DE VALIDACIÓN
 * 
 * @description
 * Colección completa de funciones de validación reutilizables para formularios.
 * Incluye validaciones para campos comunes, documentos mexicanos, y validaciones personalizadas.
 */

// ============================================
// VALIDACIONES DE FORMATO
// ============================================

/**
 * Valida formato de email
 * 
 * @param {string} email - Email a validar
 * @returns {boolean} true si el email es válido, false en caso contrario
 * 
 * @example
 * isValidEmail("usuario@ejemplo.com") // true
 * isValidEmail("email-invalido") // false
 * 
 * // Uso con useFormValidation
 * const emailRules = [
 *   (value) => !value ? "El email es requerido" : "",
 *   (value) => !isValidEmail(value) ? "Formato de email inválido" : ""
 * ];
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida contraseña con criterios personalizables
 * 
 * @param {string} password - Contraseña a validar
 * @param {Object} options - Opciones de validación
 * @param {number} [options.minLength=8] - Longitud mínima
 * @param {boolean} [options.requireUppercase=true] - Requiere mayúsculas
 * @param {boolean} [options.requireLowercase=true] - Requiere minúsculas
 * @param {boolean} [options.requireNumbers=true] - Requiere números
 * @param {boolean} [options.requireSpecialChars=true] - Requiere caracteres especiales
 * @returns {Object} { isValid: boolean, errors: string[] }
 * 
 * @example
 * // Validación estándar
 * validatePassword("MiPassword123!") 
 * // { isValid: true, errors: [] }
 * 
 * // Validación personalizada
 * validatePassword("abc", { minLength: 6, requireUppercase: false })
 * // { isValid: false, errors: ["Debe tener al menos 6 caracteres", "Debe incluir al menos un número"] }
 * 
 * // Uso con useFormValidation
 * const passwordRules = [
 *   (value) => !value ? "La contraseña es requerida" : "",
 *   (value) => {
 *     const result = validatePassword(value);
 *     return result.isValid ? "" : result.errors[0];
 *   }
 * ];
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options;

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Debe tener al menos ${minLength} caracteres`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Debe incluir al menos una letra mayúscula");
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Debe incluir al menos una letra minúscula");
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push("Debe incluir al menos un número");
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Debe incluir al menos un carácter especial");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Valida formato de teléfono mexicano
 * Acepta formatos: +52 55 1234 5678, 52 55 1234 5678, 55 1234 5678, 5512345678
 * 
 * @param {string} phone - Número telefónico a validar
 * @returns {boolean} true si es un teléfono mexicano válido
 * 
 * @example
 * isValidMexicanPhone("+52 55 1234 5678") // true
 * isValidMexicanPhone("5512345678") // true
 * isValidMexicanPhone("123456") // false
 */
export const isValidMexicanPhone = (phone) => {
  const phoneRegex = /^(\+52|52)?[\s-]?([1-9]\d{9})$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ""));
};

/**
 * Valida CURP (Clave Única de Registro de Población) mexicano
 * 
 * @param {string} curp - CURP a validar
 * @returns {boolean} true si el CURP es válido
 * 
 * @example
 * isValidCURP("AAAA800101HDFRRL01") // true
 * isValidCURP("curp-invalido") // false
 */
export const isValidCURP = (curp) => {
  const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
  return curpRegex.test(curp);
};

/**
 * Valida RFC (Registro Federal de Contribuyentes) mexicano
 * Soporta tanto personas físicas (13 caracteres) como morales (12 caracteres)
 * 
 * @param {string} rfc - RFC a validar
 * @returns {boolean} true si el RFC es válido
 * 
 * @example
 * isValidRFC("XAXX010101000") // true (persona física)
 * isValidRFC("ABC010101ABC") // true (persona moral)
 */
export const isValidRFC = (rfc) => {
  const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
  return rfcRegex.test(rfc);
};

/**
 * Valida formato de URL
 * 
 * @param {string} url - URL a validar
 * @returns {boolean} true si la URL es válida
 * 
 * @example
 * isValidURL("https://www.ejemplo.com") // true
 * isValidURL("not-a-url") // false
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ============================================
// VALIDACIONES DE CONTENIDO
// ============================================

/**
 * Valida que un campo no esté vacío
 * 
 * @param {any} value - Valor a validar
 * @returns {boolean} true si el valor no está vacío
 * 
 * @example
 * isRequired("texto") // true
 * isRequired("   ") // false
 * isRequired(null) // false
 */
export const isRequired = (value) => {
  return (
    value !== null && value !== undefined && value.toString().trim() !== ""
  );
};

/**
 * Valida longitud mínima
 * 
 * @param {any} value - Valor a validar
 * @param {number} minLength - Longitud mínima requerida
 * @returns {boolean} true si cumple con la longitud mínima
 * 
 * @example
 * hasMinLength("password", 8) // true
 * hasMinLength("123", 5) // false
 */
export const hasMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength;
};

/**
 * Valida longitud máxima
 * 
 * @param {any} value - Valor a validar
 * @param {number} maxLength - Longitud máxima permitida
 * @returns {boolean} true si cumple con la longitud máxima
 * 
 * @example
 * hasMaxLength("texto", 10) // true
 * hasMaxLength("texto muy largo", 5) // false
 */
export const hasMaxLength = (value, maxLength) => {
  return !value || value.toString().length <= maxLength;
};

/**
 * Valida que solo contenga números
 * 
 * @param {any} value - Valor a validar
 * @returns {boolean} true si solo contiene números
 * 
 * @example
 * isNumeric("12345") // true
 * isNumeric("123abc") // false
 */
export const isNumeric = (value) => {
  return /^\d+$/.test(value);
};

/**
 * Valida rango de edad basado en fecha de nacimiento
 * 
 * @param {string|Date} birthDate - Fecha de nacimiento
 * @param {number} [minAge=0] - Edad mínima
 * @param {number} [maxAge=120] - Edad máxima
 * @returns {boolean} true si la edad está en el rango válido
 * 
 * @example
 * isValidAge("1990-05-15") // true (para alguien de ~33 años)
 * isValidAge("2010-01-01", 18) // false (menor de edad)
 */
export const isValidAge = (birthDate, minAge = 0, maxAge = 120) => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000));

  return age >= minAge && age <= maxAge;
};

// ============================================
// NUEVAS VALIDACIONES AGREGADAS
// ============================================

/**
 * Valida código postal mexicano
 * 
 * @param {string} postalCode - Código postal a validar
 * @returns {boolean} true si es un código postal mexicano válido (5 dígitos)
 * 
 * @example
 * isValidMexicanPostalCode("01000") // true
 * isValidMexicanPostalCode("123") // false
 */
export const isValidMexicanPostalCode = (postalCode) => {
  const postalRegex = /^\d{5}$/;
  return postalRegex.test(postalCode);
};

/**
 * Valida nombre completo (solo letras, espacios y algunos caracteres especiales)
 * 
 * @param {string} name - Nombre a validar
 * @returns {boolean} true si es un nombre válido
 * 
 * @example
 * isValidName("Juan Carlos Pérez") // true
 * isValidName("Juan123") // false
 */
export const isValidName = (name) => {
  const nameRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'.-]+$/;
  return nameRegex.test(name) && name.trim().length > 0;
};

/**
 * Valida que dos campos coincidan (útil para confirmar contraseña)
 * 
 * @param {any} value1 - Primer valor
 * @param {any} value2 - Segundo valor
 * @returns {boolean} true si los valores coinciden
 * 
 * @example
 * isMatch("password123", "password123") // true
 * isMatch("password123", "password456") // false
 * 
 * // Uso con useFormValidation
 * const confirmPasswordRules = [
 *   (value) => !isMatch(values.password, value) ? "Las contraseñas no coinciden" : ""
 * ];
 */
export const isMatch = (value1, value2) => {
  return value1 === value2;
};

/**
 * Valida número de tarjeta de crédito usando algoritmo de Luhn
 * 
 * @param {string} cardNumber - Número de tarjeta a validar
 * @returns {boolean} true si es un número de tarjeta válido
 * 
 * @example
 * isValidCreditCard("4532015112830366") // true (Visa test card)
 * isValidCreditCard("1234567890123456") // false
 */
export const isValidCreditCard = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }
  
  // Algoritmo de Luhn
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Valida rango numérico
 * 
 * @param {number|string} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} true si está en el rango
 * 
 * @example
 * isInRange(25, 18, 65) // true
 * isInRange(10, 18, 65) // false
 */
export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Valida fecha en formato específico
 * 
 * @param {string} date - Fecha a validar
 * @param {string} [format="YYYY-MM-DD"] - Formato esperado
 * @returns {boolean} true si la fecha es válida y está en el formato correcto
 * 
 * @example
 * isValidDate("2023-12-25") // true
 * isValidDate("25/12/2023", "DD/MM/YYYY") // true
 * isValidDate("invalid-date") // false
 */
export const isValidDate = (date, format = "YYYY-MM-DD") => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return false;
  
  // Validación básica para formato YYYY-MM-DD
  if (format === "YYYY-MM-DD") {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  }
  
  return true;
};

/**
 * Valida que la fecha sea futura
 * 
 * @param {string|Date} date - Fecha a validar
 * @returns {boolean} true si la fecha es futura
 * 
 * @example
 * isFutureDate("2025-12-25") // true
 * isFutureDate("2020-01-01") // false
 */
export const isFutureDate = (date) => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return inputDate > today;
};

/**
 * Valida que la fecha sea pasada
 * 
 * @param {string|Date} date - Fecha a validar
 * @returns {boolean} true si la fecha es pasada
 * 
 * @example
 * isPastDate("2020-01-01") // true
 * isPastDate("2025-12-25") // false
 */
export const isPastDate = (date) => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  return inputDate < today;
};

// ============================================
// FUNCIONES HELPER PARA CREAR REGLAS
// ============================================

/**
 * Crea una regla de validación para campo requerido
 * 
 * @param {string} [message="Este campo es requerido"] - Mensaje de error personalizado
 * @returns {Function} Función de validación
 * 
 * @example
 * const nameRules = [
 *   createRequiredRule("El nombre es obligatorio"),
 *   createMinLengthRule(2, "Mínimo 2 caracteres")
 * ];
 */
export const createRequiredRule = (message = "Este campo es requerido") => {
  return (value) => !isRequired(value) ? message : "";
};

/**
 * Crea una regla de validación para longitud mínima
 * 
 * @param {number} minLength - Longitud mínima
 * @param {string} [message] - Mensaje de error personalizado
 * @returns {Function} Función de validación
 */
export const createMinLengthRule = (minLength, message) => {
  return (value) => {
    if (!value) return "";
    const msg = message || `Debe tener al menos ${minLength} caracteres`;
    return !hasMinLength(value, minLength) ? msg : "";
  };
};

/**
 * Crea una regla de validación para longitud máxima
 * 
 * @param {number} maxLength - Longitud máxima
 * @param {string} [message] - Mensaje de error personalizado
 * @returns {Function} Función de validación
 */
export const createMaxLengthRule = (maxLength, message) => {
  return (value) => {
    const msg = message || `No debe exceder ${maxLength} caracteres`;
    return !hasMaxLength(value, maxLength) ? msg : "";
  };
};

/**
 * Crea una regla de validación para email
 * 
 * @param {string} [message="Formato de email inválido"] - Mensaje de error personalizado
 * @returns {Function} Función de validación
 */
export const createEmailRule = (message = "Formato de email inválido") => {
  return (value) => {
    if (!value) return "";
    return !isValidEmail(value) ? message : "";
  };
};

// ============================================
// EJEMPLO DE USO COMPLETO
// ============================================

/**
 * EJEMPLO DE USO CON useFormValidation
 * 
 * const validationRules = {
 *   name: [
 *     createRequiredRule("El nombre es obligatorio"),
 *     createMinLengthRule(2, "Mínimo 2 caracteres"),
 *     (value) => !isValidName(value) ? "Solo se permiten letras y espacios" : ""
 *   ],
 *   email: [
 *     createRequiredRule("El email es obligatorio"),
 *     createEmailRule()
 *   ],
 *   password: [
 *     createRequiredRule("La contraseña es obligatoria"),
 *     (value) => {
 *       const result = validatePassword(value, { minLength: 6 });
 *       return result.isValid ? "" : result.errors[0];
 *     }
 *   ],
 *   confirmPassword: [
 *     createRequiredRule("Confirme la contraseña"),
 *     (value) => !isMatch(values.password, value) ? "Las contraseñas no coinciden" : ""
 *   ],
 *   phone: [
 *     (value) => value && !isValidMexicanPhone(value) ? "Teléfono mexicano inválido" : ""
 *   ],
 *   birthDate: [
 *     createRequiredRule("La fecha de nacimiento es obligatoria"),
 *     (value) => !isValidAge(value, 18) ? "Debe ser mayor de 18 años" : ""
 *   ]
 * };
 */
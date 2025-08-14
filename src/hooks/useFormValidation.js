import { useState, useCallback } from "react";

/**
 * Hook personalizado para manejar validación de formularios en React
 * 
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Object} validationRules - Objeto con las reglas de validación para cada campo
 *                                   Formato: { fieldName: [rule1, rule2, ...] }
 *                                   Cada regla es una función que recibe el valor y retorna un string de error o ""
 * 
 * @returns {Object} Objeto con propiedades y métodos para manejar el formulario
 * 
 * @example
 * const validationRules = {
 *   email: [
 *     (value) => !value ? "Email es requerido" : "",
 *     (value) => !/\S+@\S+\.\S+/.test(value) ? "Email inválido" : ""
 *   ],
 *   password: [
 *     (value) => !value ? "Password es requerido" : "",
 *     (value) => value.length < 6 ? "Mínimo 6 caracteres" : ""
 *   ]
 * };
 * 
 * const initialValues = { email: "", password: "" };
 * 
 * const {
 *   values,
 *   errors,
 *   handleChange,
 *   handleSubmit,
 *   isValid
 * } = useFormValidation(initialValues, validationRules);
 */
export const useFormValidation = (initialValues, validationRules) => {
  // Estados del formulario
  const [values, setValues] = useState(initialValues);           // Valores actuales de los campos
  const [errors, setErrors] = useState({});                      // Errores de validación por campo
  const [touched, setTouched] = useState({});                    // Campos que han sido tocados/interactuados
  const [isSubmitting, setIsSubmitting] = useState(false);       // Estado de envío del formulario
  const [isDirty, setIsDirty] = useState(false);                 // Indica si el formulario ha sido modificado

  /**
   * Valida un campo específico usando sus reglas de validación
   * @param {string} name - Nombre del campo a validar
   * @param {any} value - Valor del campo a validar
   * @returns {string} Mensaje de error o string vacío si es válido
   */
  const validateField = useCallback(
    (name, value) => {
      const rules = validationRules[name];
      if (!rules) return "";

      // Ejecuta cada regla hasta encontrar un error
      for (const rule of rules) {
        const error = rule(value);
        if (error) return error;
      }
      return "";
    },
    [validationRules]
  );

  /**
   * Maneja el cambio de valor en un campo del formulario
   * Soporta eventos de input, checkboxes, files y valores directos
   * @param {string} name - Nombre del campo
   * @returns {Function} Función que maneja el cambio (puede recibir event o valor directo)
   */
  const handleChange = useCallback(
    (name) => (eventOrValue) => {
      let value;

      // Determina si es un evento o un valor directo
      if (
        eventOrValue &&
        typeof eventOrValue === "object" &&
        "target" in eventOrValue
      ) {
        const { target } = eventOrValue;
        // Maneja diferentes tipos de inputs
        value =
          target.type === "checkbox"
            ? target.checked
            : target.type === "file"
            ? target.files
            : target.value;
      } else {
        value = eventOrValue;
      }

      // Actualiza el valor, marca como touched y dirty
      setValues((prev) => ({ ...prev, [name]: value }));
      setTouched((prev) => ({ ...prev, [name]: true }));
      setIsDirty(true);

      // Valida el campo inmediatamente
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  /**
   * Maneja el evento blur (cuando el campo pierde el foco)
   * @param {string} name - Nombre del campo
   * @returns {Function} Función que maneja el evento blur
   */
  const handleBlur = useCallback(
    (name) => () => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField, values]
  );

  /**
   * Obtiene el estado visual de un campo para estilos CSS
   * @param {string} name - Nombre del campo
   * @returns {string} Estado del campo: "", "error", o "success"
   */
  const getFieldState = useCallback(
    (name) => {
      if (!touched[name]) return "";
      return errors[name] ? "error" : values[name] ? "success" : "";
    },
    [touched, errors, values]
  );

  /**
   * Valida todos los campos del formulario
   * @returns {boolean} true si todos los campos son válidos, false en caso contrario
   */
  const validateAll = useCallback(() => {
    const newErrors = {};
    const newTouched = {};

    // Valida cada campo que tiene reglas definidas
    Object.keys(validationRules).forEach((name) => {
      newTouched[name] = true;
      const error = validateField(name, values[name]);
      if (error) newErrors[name] = error;
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validationRules, validateField, values]);

  /**
   * Maneja el envío del formulario con validación
   * @param {Function} onSubmit - Función callback que se ejecuta si el formulario es válido
   * @returns {Function} Función que maneja el evento submit
   */
  const handleSubmit = useCallback(
    (onSubmit) => async (e) => {
      if (e) e.preventDefault();
      setIsSubmitting(true);

      const isFormValid = validateAll();

      if (isFormValid) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error("Error en el envío:", error);
        }
      } else {
        // Scroll al primer campo con error y enfocarlo
        setTimeout(() => {
          const firstErrorField = document.querySelector(".border-red-500");
          if (firstErrorField) {
            firstErrorField.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            firstErrorField.focus();
          }
        }, 100);
      }
      setIsSubmitting(false);
    },
    [validateAll, values]
  );

  /**
   * Resetea el formulario a su estado inicial
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsDirty(false);
  }, [initialValues]);

  /**
   * Establece el valor de un campo específico programáticamente
   * @param {string} name - Nombre del campo
   * @param {any} value - Nuevo valor del campo
   */
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  }, []);

  /**
   * Establece un error para un campo específico programáticamente
   * @param {string} name - Nombre del campo
   * @param {string} error - Mensaje de error
   */
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  // Calcula si el formulario es válido (no tiene errores y al menos un campo ha sido tocado)
  const isValid =
    Object.keys(errors).every((key) => !errors[key]) &&
    Object.keys(touched).length > 0;

  // Retorna todas las propiedades y métodos disponibles
  return {
    // Estados
    values,           // Valores actuales de todos los campos
    errors,           // Errores de validación por campo
    touched,          // Campos que han sido interactuados
    isSubmitting,     // Estado de envío del formulario
    isDirty,          // Indica si el formulario ha sido modificado
    isValid,          // Indica si el formulario es completamente válido

    // Manejadores de eventos
    handleChange,     // Función para manejar cambios en campos
    handleBlur,       // Función para manejar eventos blur
    handleSubmit,     // Función para manejar envío del formulario

    // Utilidades
    getFieldState,    // Obtiene el estado visual de un campo
    reset,            // Resetea el formulario
    setFieldValue,    // Establece valor de campo programáticamente
    setFieldError,    // Establece error de campo programáticamente
    validateField,    // Valida un campo específico
    validateAll,      // Valida todos los campos
  };
};
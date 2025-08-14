import React, { useState, useCallback } from "react";

/**
 * Custom Hook para manejo y validación de formularios
 *
 * @description
 * Hook personalizado que proporciona funcionalidad completa para manejar formularios
 * incluyendo validación en tiempo real, manejo de estado, y control de envío.
 *
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Object} validationRules - Objeto con las reglas de validación para cada campo
 *                                   Formato: { nombreCampo: [función1, función2, ...] }
 *
 * @returns {Object} Objeto con todas las funciones y estados del formulario
 *
 * @example
 * // Definir reglas de validación
 * const validationRules = {
 *   email: [
 *     (value) => !value ? "El email es requerido" : "",
 *     (value) => !/\S+@\S+\.\S+/.test(value) ? "Email inválido" : ""
 *   ],
 *   password: [
 *     (value) => !value ? "La contraseña es requerida" : "",
 *     (value) => value.length < 6 ? "Mínimo 6 caracteres" : ""
 *   ]
 * };
 *
 * // Usar el hook
 * const {
 *   values,
 *   errors,
 *   handleChange,
 *   handleSubmit,
 *   getFieldState
 * } = useFormValidation({ email: "", password: "" }, validationRules);
 *
 * // En el JSX
 * <input
 *   value={values.email}
 *   onChange={handleChange("email")}
 *   className={getFieldState("email") === "error" ? "input-error" : ""}
 * />
 */
export const useFormValidation = (initialValues, validationRules) => {
  // Estados del formulario
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Valida un campo específico usando sus reglas definidas
   *
   * @param {string} name - Nombre del campo a validar
   * @param {any} value - Valor actual del campo
   * @returns {string} Mensaje de error o cadena vacía si es válido
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
   * Maneja los cambios en los campos del formulario
   * Actualiza el valor, marca como tocado y valida inmediatamente
   *
   * @param {string} name - Nombre del campo
   * @returns {Function} Función manejadora del evento onChange
   *
   * @example
   * <input onChange={handleChange("email")} />
   */
  const handleChange = useCallback(
    (name) => (e) => {
      const value = e.target.value;

      // Actualizar valor
      setValues((prev) => ({ ...prev, [name]: value }));

      // Marcar como tocado y validar inmediatamente
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  /**
   * Maneja cuando un campo pierde el foco (blur)
   * Marca el campo como tocado y ejecuta validación
   *
   * @param {string} name - Nombre del campo
   * @returns {Function} Función manejadora del evento onBlur
   *
   * @example
   * <input onBlur={handleBlur("email")} />
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
   * Obtiene el estado visual del campo para aplicar estilos
   *
   * @param {string} name - Nombre del campo
   * @returns {string} "neutral" | "error" | "success"
   *
   * @example
   * const fieldState = getFieldState("email");
   * const inputClass = fieldState === "error" ? "input-error" :
   *                   fieldState === "success" ? "input-success" : "input-neutral";
   */
  const getFieldState = useCallback(
    (name) => {
      if (!touched[name]) return "neutral";
      return errors[name] ? "error" : "success";
    },
    [touched, errors]
  );

  /**
   * Valida todos los campos del formulario
   * Marca todos los campos como tocados y ejecuta todas las validaciones
   *
   * @returns {boolean} true si el formulario es válido, false en caso contrario
   */
  const validateAll = useCallback(() => {
    const newErrors = {};
    const newTouched = {};

    // Validar cada campo definido en las reglas
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
   * Maneja el envío del formulario con validación completa
   *
   * @param {Function} onSubmit - Función callback que se ejecuta si el formulario es válido
   *                              Recibe los valores del formulario como parámetro
   * @returns {Function} Función manejadora del evento onSubmit
   *
   * @example
   * const handleFormSubmit = async (formValues) => {
   *   // Lógica de envío
   *   await api.submitForm(formValues);
   * };
   *
   * <form onSubmit={handleSubmit(handleFormSubmit)}>
   */
  const handleSubmit = useCallback(
    (onSubmit) => async (e) => {
      if (e) {
        e.preventDefault();
      }
      setIsSubmitting(true);

      if (validateAll()) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error("Error en el envío:", error);
        }
      }

      setIsSubmitting(false);
    },
    [validateAll, values]
  );

  /**
   * Resetea el formulario a su estado inicial
   * Limpia valores, errores, estado de tocado y estado de envío
   *
   * @example
   * <button type="button" onClick={reset}>Limpiar formulario</button>
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Retorna todas las funciones y estados necesarios
  return {
    /** @type {Object} Valores actuales del formulario */
    values,

    /** @type {Object} Errores de validación por campo */
    errors,

    /** @type {Object} Campos que han sido interactuados por el usuario */
    touched,

    /** @type {boolean} Indica si el formulario se está enviando */
    isSubmitting,

    /** @type {Function} Manejador de cambios en los campos */
    handleChange,

    /** @type {Function} Manejador de pérdida de foco en los campos */
    handleBlur,

    /** @type {Function} Manejador de envío del formulario */
    handleSubmit,

    /** @type {Function} Obtiene el estado visual del campo */
    getFieldState,

    /** @type {Function} Resetea el formulario */
    reset,
  };
};

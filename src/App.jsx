import React from "react";
import {
  isRequired,
  hasMinLength,
  isValidEmail,
  validatePassword,
  isValidMexicanPhone,
} from "@validators";
import { useFormValidation } from "@hooks/useFormValidation";
import { FormInput } from "@components/ui/FormInput";

const validationRules = {
  name: [
    (value) => (!isRequired(value) ? "El nombre es requerido" : ""),
    (value) =>
      !hasMinLength(value, 2)
        ? "El nombre debe tener al menos 2 caracteres"
        : "",
  ],
  email: [
    (value) => (!isRequired(value) ? "El email es requerido" : ""),
    (value) =>
      value && !isValidEmail(value) ? "Formato de email inválido" : "",
  ],
  password: [
    (value) => (!isRequired(value) ? "La contraseña es requerida" : ""),
    (value) => {
      if (!value) return "";
      const validation = validatePassword(value, {
        minLength: 6,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false,
      });
      return validation.isValid ? "" : validation.errors[0];
    },
  ],
  phone: [
    (value) => (!isRequired(value) ? "El teléfono es requerido" : ""),
    (value) =>
      value && !isValidMexicanPhone(value)
        ? "Formato mexicano inválido (ej: +52 1234567890)"
        : "",
  ],
  age: [
    (value) => (!isRequired(value) ? "La edad es requerida" : ""),
    (value) =>
      value && (value < 16 || value > 100)
        ? "Edad debe estar entre 16 y 100 años"
        : "",
  ],
  country: [(value) => (!isRequired(value) ? "El país es requerido" : "")],
  terms: [
    (value) => (!value ? "Debes aceptar los términos y condiciones" : ""),
  ],
};

export default function App() {
  const form = useFormValidation(
    {
      name: "",
      email: "",
      password: "",
      phone: "",
      age: "",
      country: "",
      bio: "",
      terms: false,
    },
    validationRules
  );

  const handleFormSubmit = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("¡Formulario enviado correctamente!");
    console.log("Valores enviados:", values);
    form.reset();
  };

  const countries = [
    { value: "mx", label: "🇲🇽 México" },
    { value: "us", label: "🇺🇸 Estados Unidos" },
    { value: "ca", label: "🇨🇦 Canadá" },
    { value: "es", label: "🇪🇸 España" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-200 ">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          Sistema de Formularios Completo
        </h1>
        <div className="space-y-6">
          <div className="gap-6">
            {/* Columna 1 */}
            <div>
              <FormInput
                name="name"
                label="Nombre completo"
                placeholder="Tu nombre completo"
                value={form.values.name}
                onChange={form.handleChange("name")}
                onBlur={form.handleBlur("name")}
                error={form.errors.name}
                state={form.getFieldState("name")}
                required
              />

              <FormInput
                name="email"
                label="Email"
                type="email"
                placeholder="tu@email.com"
                value={form.values.email}
                onChange={form.handleChange("email")}
                onBlur={form.handleBlur("email")}
                error={form.errors.email}
                state={form.getFieldState("email")}
                prefix="@"
                required
              />

              <FormInput
                name="password"
                label="Contraseña"
                type="password"
                placeholder="Tu contraseña segura"
                value={form.values.password}
                onChange={form.handleChange("password")}
                onBlur={form.handleBlur("password")}
                error={form.errors.password}
                state={form.getFieldState("password")}
                helperText="Mínimo 6 caracteres, una mayúscula, una minúscula y un número"
                required
              />

              <FormInput
                name="phone"
                label="Teléfono"
                type="tel"
                placeholder="+52 1234567890"
                value={form.values.phone}
                onChange={form.handleChange("phone")}
                onBlur={form.handleBlur("phone")}
                error={form.errors.phone}
                state={form.getFieldState("phone")}
                required
              />
            </div>

            {/* Columna 2 */}
            <div>
              <FormInput
                name="age"
                label="Edad"
                type="number"
                placeholder="25"
                value={form.values.age}
                onChange={form.handleChange("age")}
                onBlur={form.handleBlur("age")}
                error={form.errors.age}
                state={form.getFieldState("age")}
                min={16}
                max={100}
                suffix="años"
                required
              />

              <FormInput
                name="country"
                label="País"
                type="select"
                placeholder="Selecciona tu país"
                value={form.values.country}
                onChange={form.handleChange("country")}
                onBlur={form.handleBlur("country")}
                error={form.errors.country}
                state={form.getFieldState("country")}
                options={countries}
                required
              />

              <FormInput
                name="bio"
                label="Biografía"
                type="textarea"
                placeholder="Cuéntanos sobre ti..."
                value={form.values.bio}
                onChange={form.handleChange("bio")}
                onBlur={form.handleBlur("bio")}
                error={form.errors.bio}
                state={form.getFieldState("bio")}
                rows={4}
                maxLength={200}
                helperText={`${(form.values.bio || "").length}/200 caracteres`}
              />

              <FormInput
                name="terms"
                type="checkbox"
                placeholder="Acepto los términos y condiciones"
                value={form.values.terms}
                onChange={form.handleChange("terms")}
                onBlur={form.handleBlur("terms")}
                error={form.errors.terms}
                state={form.getFieldState("terms")}
                required
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={form.handleSubmit(handleFormSubmit)}
              disabled={form.isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {form.isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {form.isValid ? "Enviar Formulario" : "Validar y Enviar"}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={form.reset}
              disabled={form.isSubmitting}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 disabled:bg-gray-300 transition-colors font-medium"
            >
              Limpiar Todo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

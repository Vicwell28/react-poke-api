import React from 'react'
import { isRequired, hasMinLength, isValidEmail, validatePassword, isValidMexicanPhone } from '@validators'; 
import { useFormValidation } from '@hooks/useFormValidation';
import { FormInput } from '@components/ui/FormInput';

const validationRules = {
  email: [
    (value) => !isRequired(value) ? 'El email es requerido' : '',
    (value) => value && !isValidEmail(value) ? 'Email inválido' : ''
  ],
  password: [
    (value) => !isRequired(value) ? 'La contraseña es requerida' : '',
    (value) => {
      if (!value) return '';
      const validation = validatePassword(value, {
        minLength: 6,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: false // Menos restrictivo para el ejemplo
      });
      return validation.isValid ? '' : validation.errors[0]; // Mostrar solo el primer error
    }
  ],
  name: [
    (value) => !isRequired(value) ? 'El nombre es requerido' : '',
    (value) => !hasMinLength(value, 2) ? 'El nombre debe tener al menos 2 caracteres' : ''
  ],
  phone: [
    (value) => !isRequired(value) ? 'El teléfono es requerido' : '',
    (value) => value && !isValidMexicanPhone(value) ? 'Formato de teléfono mexicano inválido (ej: +52 1234567890)' : ''
  ]
};


const App = () => {
  const form = useFormValidation(
    {
      name: '',
      email: '',
      password: '',
      phone: ''
    },
    validationRules
  );

  const handleFormSubmit = async (values) => {
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Formulario enviado correctamente!');
    console.log('Valores enviados:', values);
    form.reset();
  };

  // Función para manejar el click del botón enviar
  const handleSubmitClick = async (e) => {
    e.preventDefault();
    await form.handleSubmit(handleFormSubmit)(null);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Formulario con Validaciones
      </h2>
      
      <div>
        <FormInput
          name="name"
          label="Nombre"
          placeholder="Tu nombre completo"
          value={form.values.name}
          onChange={form.handleChange('name')}
          onBlur={form.handleBlur('name')}
          error={form.errors.name}
          state={form.getFieldState('name')}
        />

        <FormInput
          name="email"
          label="Email"
          type="email"
          placeholder="tu@email.com"
          value={form.values.email}
          onChange={form.handleChange('email')}
          onBlur={form.handleBlur('email')}
          error={form.errors.email}
          state={form.getFieldState('email')}
        />

        <FormInput
          name="password"
          label="Contraseña"
          type="password"
          placeholder="Tu contraseña"
          value={form.values.password}
          onChange={form.handleChange('password')}
          onBlur={form.handleBlur('password')}
          error={form.errors.password}
          state={form.getFieldState('password')}
        />

        <FormInput
          name="phone"
          label="Teléfono"
          type="tel"
          placeholder="+52 1234567890 o 1234567890"
          value={form.values.phone}
          onChange={form.handleChange('phone')}
          onBlur={form.handleBlur('phone')}
          error={form.errors.phone}
          state={form.getFieldState('phone')}
        />

        <div className="flex gap-3">
          <button
            onClick={handleSubmitClick}
            disabled={form.isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {form.isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
          
          <button
            type="button"
            onClick={form.reset}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Indicador de estados */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-sm text-gray-700 mb-2">Estados de los campos:</h3>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
            <span>Neutral</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span>Error</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span>Válido</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
export const FormInput = ({
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  state,
  required = false,
  disabled = false,
  readOnly = false,
  maxLength,
  minLength,
  min,
  max,
  step,
  accept,
  rows = 4,
  options = [],
  prefix,
  suffix,
  className = "",
  ...props
}) => {
  const getInputClasses = () => {
    const base = `
      w-full px-4 py-2 border rounded-lg 
      focus:outline-none focus:ring-2 transition-all duration-200
      ${disabled ? "cursor-not-allowed opacity-60" : ""}
      ${readOnly ? "bg-gray-50" : ""}
      ${prefix ? "pl-10" : ""}
      ${suffix || state ? "pr-10" : ""}
    `
      .trim()
      .replace(/\s+/g, " ");

    switch (state) {
      case "error":
        return `${base} border-red-500 bg-red-50 focus:ring-red-200 text-red-900`;
      case "success":
        return `${base} border-green-500 focus:ring-green-200`;
      default:
        return `${base} border-gray-300 bg-white focus:ring-blue-200 focus:border-blue-500`;
    }
  };

  const getStateIcon = () => {
    const iconClasses = "w-5 h-5 absolute right-3 top-2.5";

    switch (state) {
      case "error":
        return (
          <svg
            className={`${iconClasses} text-red-500`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "success":
        return (
          <svg
            className={`${iconClasses} text-green-500`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderInput = () => {
    const commonProps = {
      name,
      value: value || "",
      onChange,
      onBlur,
      placeholder,
      required,
      disabled,
      readOnly,
      className: getInputClasses(),
      ...props,
    };

    switch (type) {
      case "textarea":
        return <textarea {...commonProps} rows={rows} maxLength={maxLength} />;

      case "select":
        return (
          <select {...commonProps}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option, index) => (
              <option
                key={option.value || index}
                value={option.value || option}
              >
                {option.label || option}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              {...commonProps}
              type="checkbox"
              checked={value || false}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{placeholder}</span>
          </label>
        );

      default:
        return (
          <input
            {...commonProps}
            type={type}
            min={min}
            max={max}
            step={step}
            maxLength={maxLength}
            minLength={minLength}
            accept={accept}
          />
        );
    }
  };

  const showLabel = label && type !== "checkbox";

  return (
    <div className={`mb-4 ${className}`}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-2.5 text-gray-500 text-sm font-medium z-10">
            {prefix}
          </div>
        )}

        {renderInput()}

        {suffix && !state && (
          <div className="absolute right-3 top-2.5 text-gray-500 text-sm font-medium">
            {suffix}
          </div>
        )}

        {getStateIcon()}
      </div>

      {/* Contenedor fijo para mensajes con altura mínima */}
      <div className="min-h-[24px] mt-1">
        {error && (
          <div className="animate-fade-in-down">
            <p className="text-red-600 text-sm flex items-start space-x-1">
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </p>
          </div>
        )}

        {helperText && !error && (
          <p className="text-gray-500 text-sm mt-1 animate-fade-in">
            {helperText}
          </p>
        )}
      </div>

      {/* Estilos CSS para las animaciones */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fade-in-down {
            0% {
              opacity: 0;
              transform: translateY(-8px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fade-in {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          
          .animate-fade-in-down {
            animation: fade-in-down 0.3s ease-out forwards;
          }
          
          .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
          }
        `,
        }}
      />
    </div>
  );
};

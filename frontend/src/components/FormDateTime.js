import React from 'react';

/**
 * FormDateTime component for date and time inputs
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.label - Input label
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {string} props.type - Input type (date, time, datetime-local)
 * @param {boolean} props.required - Whether the input is required
 * @param {string} props.error - Error message
 * @param {boolean} props.touched - Whether the input has been touched
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.helpText - Help text
 * @param {string} props.min - Minimum date/time
 * @param {string} props.max - Maximum date/time
 * @returns {JSX.Element} FormDateTime component
 */
const FormDateTime = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  type = 'date',
  required = false,
  error,
  touched,
  className = '',
  helpText,
  min,
  max,
  ...rest
}) => {
  const showError = error && touched;
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id || name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        min={min}
        max={max}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0
          ${showError 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
          }
        `}
        aria-invalid={showError ? 'true' : 'false'}
        aria-describedby={showError ? `${name}-error` : helpText ? `${name}-help` : undefined}
        {...rest}
      />
      
      {showError && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helpText && !showError && (
        <p id={`${name}-help`} className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormDateTime; 
import React from 'react';

/**
 * FormSelect component
 * @param {Object} props - Component props
 * @param {string} props.id - Select ID
 * @param {string} props.name - Select name
 * @param {string} props.label - Select label
 * @param {string} props.value - Select value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {Array} props.options - Select options
 * @param {boolean} props.required - Whether the select is required
 * @param {string} props.error - Error message
 * @param {boolean} props.touched - Whether the select has been touched
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.helpText - Help text
 * @returns {JSX.Element} FormSelect component
 */
const FormSelect = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  options = [],
  required = false,
  error,
  touched,
  className = '',
  helpText,
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
      
      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white
          ${showError 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
          }
        `}
        aria-invalid={showError ? 'true' : 'false'}
        aria-describedby={showError ? `${name}-error` : helpText ? `${name}-help` : undefined}
        {...rest}
      >
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
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

export default FormSelect; 
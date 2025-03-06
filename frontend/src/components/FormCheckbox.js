import React from 'react';

/**
 * FormCheckbox component
 * @param {Object} props - Component props
 * @param {string} props.id - Checkbox ID
 * @param {string} props.name - Checkbox name
 * @param {string} props.label - Checkbox label
 * @param {boolean} props.checked - Checkbox checked state
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {boolean} props.required - Whether the checkbox is required
 * @param {string} props.error - Error message
 * @param {boolean} props.touched - Whether the checkbox has been touched
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.helpText - Help text
 * @returns {JSX.Element} FormCheckbox component
 */
const FormCheckbox = ({
  id,
  name,
  label,
  checked,
  onChange,
  onBlur,
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
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id || name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            className={`
              h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500
              ${showError ? 'border-red-500' : ''}
            `}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? `${name}-error` : helpText ? `${name}-help` : undefined}
            {...rest}
          />
        </div>
        <div className="ml-3 text-sm">
          {label && (
            <label 
              htmlFor={id || name} 
              className="font-medium text-gray-700"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          
          {helpText && !showError && (
            <p id={`${name}-help`} className="text-gray-500">
              {helpText}
            </p>
          )}
        </div>
      </div>
      
      {showError && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormCheckbox; 
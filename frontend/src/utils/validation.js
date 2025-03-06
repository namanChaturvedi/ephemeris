/**
 * Validates that a field is not empty
 * @param {string} value - Field value
 * @param {string} message - Error message
 * @returns {string|undefined} Error message or undefined
 */
export const required = (value, message = 'This field is required') => {
  if (!value && value !== 0) return message;
  if (typeof value === 'string' && value.trim() === '') return message;
  return undefined;
};

/**
 * Validates that a field is a valid email
 * @param {string} value - Field value
 * @param {string} message - Error message
 * @returns {string|undefined} Error message or undefined
 */
export const email = (value, message = 'Please enter a valid email address') => {
  if (!value) return undefined;
  
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) return message;
  
  return undefined;
};

/**
 * Validates that a field is a valid date
 * @param {string} value - Field value
 * @param {string} message - Error message
 * @returns {string|undefined} Error message or undefined
 */
export const date = (value, message = 'Please enter a valid date') => {
  if (!value) return undefined;
  
  const dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) return message;
  
  return undefined;
};

/**
 * Validates that a field is a valid time
 * @param {string} value - Field value
 * @param {string} message - Error message
 * @returns {string|undefined} Error message or undefined
 */
export const time = (value, message = 'Please enter a valid time') => {
  if (!value) return undefined;
  
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(value)) return message;
  
  return undefined;
};

/**
 * Validates that a field has a minimum length
 * @param {number} min - Minimum length
 * @param {string} message - Error message
 * @returns {Function} Validation function
 */
export const minLength = (min, message) => (value) => {
  if (!value) return undefined;
  
  if (value.length < min) {
    return message || `Must be at least ${min} characters`;
  }
  
  return undefined;
};

/**
 * Validates that a field has a maximum length
 * @param {number} max - Maximum length
 * @param {string} message - Error message
 * @returns {Function} Validation function
 */
export const maxLength = (max, message) => (value) => {
  if (!value) return undefined;
  
  if (value.length > max) {
    return message || `Must be no more than ${max} characters`;
  }
  
  return undefined;
};

/**
 * Validates that a field is a number
 * @param {string} value - Field value
 * @param {string} message - Error message
 * @returns {string|undefined} Error message or undefined
 */
export const number = (value, message = 'Please enter a valid number') => {
  if (!value) return undefined;
  
  if (isNaN(Number(value))) return message;
  
  return undefined;
};

/**
 * Validates that a field is within a range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} message - Error message
 * @returns {Function} Validation function
 */
export const range = (min, max, message) => (value) => {
  if (!value) return undefined;
  
  const num = Number(value);
  if (isNaN(num)) return 'Please enter a valid number';
  
  if (num < min || num > max) {
    return message || `Must be between ${min} and ${max}`;
  }
  
  return undefined;
};

/**
 * Validates that a field matches a pattern
 * @param {RegExp} pattern - Regular expression pattern
 * @param {string} message - Error message
 * @returns {Function} Validation function
 */
export const pattern = (pattern, message) => (value) => {
  if (!value) return undefined;
  
  if (!pattern.test(value)) {
    return message || 'Invalid format';
  }
  
  return undefined;
};

/**
 * Validates that a field matches another field
 * @param {string} field - Field to match
 * @param {Object} values - Form values
 * @param {string} message - Error message
 * @returns {string|undefined} Error message or undefined
 */
export const matches = (field, values, message) => (value) => {
  if (!value) return undefined;
  
  if (value !== values[field]) {
    return message || `Must match ${field}`;
  }
  
  return undefined;
};

/**
 * Combines multiple validators
 * @param {Array} validators - Array of validator functions
 * @returns {Function} Combined validation function
 */
export const composeValidators = (...validators) => (value, values) => {
  for (const validator of validators) {
    const error = validator(value, values);
    if (error) return error;
  }
  
  return undefined;
}; 
import { useState } from 'react';

/**
 * Custom hook for handling form state and validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validate - Validation function
 * @returns {Object} Form state and handlers
 */
const useForm = (initialValues = {}, validate = () => ({})) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  /**
   * Handle input change
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setValues({
      ...values,
      [name]: inputValue
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  /**
   * Handle input blur
   * @param {Event} e - Input blur event
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched({
      ...touched,
      [name]: true
    });
    
    // Validate field on blur
    const validationErrors = validate(values);
    setErrors({
      ...errors,
      ...validationErrors
    });
  };
  
  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   * @param {Function} onSubmit - Submit callback
   */
  const handleSubmit = (e, onSubmit) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate all fields
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    // If no errors, call onSubmit
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  };
  
  /**
   * Reset form to initial values
   */
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };
  
  /**
   * Set form values programmatically
   * @param {Object} newValues - New form values
   */
  const setFormValues = (newValues) => {
    setValues(newValues);
  };
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues
  };
};

export default useForm; 
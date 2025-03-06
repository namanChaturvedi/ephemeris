import React, { useState, useEffect } from 'react';

/**
 * Alert component for displaying messages
 * @param {Object} props - Component props
 * @param {string} props.type - Alert type (success, error, warning, info)
 * @param {string} props.message - Alert message
 * @param {boolean} props.dismissible - Whether the alert can be dismissed
 * @param {number} props.autoClose - Auto close timeout in milliseconds
 * @param {Function} props.onClose - Close callback
 * @returns {JSX.Element} Alert component
 */
const Alert = ({ 
  type = 'info', 
  message, 
  dismissible = true, 
  autoClose = 0, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Auto close timer
  useEffect(() => {
    if (autoClose > 0 && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, isVisible]);
  
  // Handle close
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  if (!isVisible || !message) return null;
  
  // Alert styles based on type
  const alertStyles = {
    success: {
      bg: 'bg-green-100',
      border: 'border-l-4 border-green-500',
      text: 'text-green-700',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    error: {
      bg: 'bg-red-100',
      border: 'border-l-4 border-red-500',
      text: 'text-red-700',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-yellow-100',
      border: 'border-l-4 border-yellow-500',
      text: 'text-yellow-700',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    },
    info: {
      bg: 'bg-blue-100',
      border: 'border-l-4 border-blue-500',
      text: 'text-blue-700',
      icon: (
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    }
  };
  
  const { bg, border, text, icon } = alertStyles[type] || alertStyles.info;
  
  return (
    <div className={`${bg} ${border} ${text} p-4 mb-4 rounded shadow-md`} role="alert">
      <div className="flex items-center">
        {icon}
        <span className="flex-1">{message}</span>
        {dismissible && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 hover:bg-opacity-25 hover:bg-gray-500"
            onClick={handleClose}
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert; 
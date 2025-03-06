import React from 'react';
import Spinner from './Spinner';

/**
 * Button component
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, outline, text)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @returns {JSX.Element} Button component
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  children,
  ...rest
}) => {
  // Variant classes
  const variantClasses = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    outline: 'bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-50',
    text: 'bg-transparent text-purple-600 hover:text-purple-700 hover:underline'
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg'
  };
  
  const variantClass = variantClasses[variant] || variantClasses.primary;
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  // Base classes
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500';
  
  // Disabled classes
  const disabledClasses = (disabled || isLoading) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      className={`${baseClasses} ${variantClass} ${sizeClass} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...rest}
    >
      <div className="flex items-center justify-center">
        {isLoading && (
          <Spinner 
            size="sm" 
            color={variant === 'primary' || variant === 'secondary' ? 'white' : 'primary'} 
            className="mr-2" 
          />
        )}
        {children}
      </div>
    </button>
  );
};

export default Button; 
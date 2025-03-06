import React from 'react';

/**
 * Spinner component for loading states
 * @param {Object} props - Component props
 * @param {string} props.size - Spinner size (sm, md, lg)
 * @param {string} props.color - Spinner color (primary, secondary, white)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Spinner component
 */
const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };
  
  // Color classes
  const colorClasses = {
    primary: 'border-purple-600',
    secondary: 'border-indigo-600',
    white: 'border-white'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const colorClass = colorClasses[color] || colorClasses.primary;
  
  return (
    <div className={`${className} flex items-center justify-center`}>
      <div
        className={`${sizeClass} ${colorClass} rounded-full border-t-transparent animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner; 
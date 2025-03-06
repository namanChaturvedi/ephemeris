import React from 'react';

/**
 * Card component
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hoverable - Whether the card should have hover effects
 * @returns {JSX.Element} Card component
 */
const Card = ({ 
  title, 
  children, 
  className = '', 
  hoverable = true 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden';
  const hoverClasses = hoverable ? 'transition-transform duration-300 hover:shadow-lg hover:-translate-y-1' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card; 
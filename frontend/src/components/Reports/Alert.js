import React from 'react';

const Alert = ({ children, variant = 'default' }) => {
  const baseClasses = 'px-4 py-3 rounded relative';
  const variantClasses = {
    default: 'bg-blue-100 border border-blue-400 text-blue-700',
    destructive: 'bg-red-100 border border-red-400 text-red-700',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`} role="alert">
      {children}
    </div>
  );
};

export default Alert;
// UIComponents.js

import React from "react";

// Card Components
export const Card = ({
  children,
  className = "",
  isDarkMode = false,
  ...props
}) => (
  <div
    className={`${
      isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
    } rounded-lg shadow-lg ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({
  children,
  className = "",
  isDarkMode = false,
  ...props
}) => (
  <div
    className={`px-6 py-4 border-b ${
      isDarkMode ? "border-gray-700" : "border-gray-200"
    } ${className}`}
    {...props}
  >
    {children}
  </div>
);
export const CardTitle = ({ children, className = "", ...props }) => (
  <h3
    className={`text-xl font-semibold text-gray-800 dark:text-white ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardContent = ({ children, className = "", ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

// Accordion Components
export const Accordion = ({
  children,
  type = "single",
  className = "",
  ...props
}) => (
  <div
    className={`divide-y divide-gray-200 dark:divide-gray-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const AccordionItem = ({ children, className = "", ...props }) => (
  <div className={`py-2 ${className}`} {...props}>
    {children}
  </div>
);

export const AccordionTrigger = ({
  children,
  onClick,
  className = "",
  ...props
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 
                rounded transition-colors duration-200 flex justify-between items-center
                ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const AccordionContent = ({ children, className = "", ...props }) => (
  <div className={`py-2 px-4 ${className}`} {...props}>
    {children}
  </div>
);

// Badge Component
export const Badge = ({
  children,
  variant = "default",
  isDarkMode = false,
  className = "",
  ...props
}) => {
  const variantStyles = {
    default: isDarkMode
      ? "bg-gray-700 text-gray-200"
      : "bg-gray-100 text-gray-800",
    success: isDarkMode
      ? "bg-green-700 text-green-200"
      : "bg-green-100 text-green-800",
    warning: isDarkMode
      ? "bg-yellow-700 text-yellow-200"
      : "bg-yellow-100 text-yellow-800",
    destructive: isDarkMode
      ? "bg-red-700 text-red-200"
      : "bg-red-100 text-red-800",
    outline: isDarkMode
      ? "border-gray-700 text-gray-200"
      : "border-gray-200 text-gray-800",
    secondary: isDarkMode
      ? "bg-gray-600 text-gray-200"
      : "bg-gray-200 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium
                ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Modal Components
export const Modal = ({
  isOpen,
  onClose,
  children,
  className = "",
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 
                    text-left shadow-xl transition-all sm:w-full sm:max-w-lg ${className}`}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

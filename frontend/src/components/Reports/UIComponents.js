import React from 'react';

export const Card = ({ children, className, ...props }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`} {...props}>{children}</div>
);

export const CardHeader = ({ children, className, ...props }) => (
  <div className={`p-4 border-b ${className}`} {...props}>{children}</div>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={`p-4 ${className}`} {...props}>{children}</div>
);

export const Table = ({ children, ...props }) => (
  <table className="min-w-full divide-y divide-gray-200" {...props}>{children}</table>
);

export const TableHeader = ({ children, ...props }) => (
  <thead className="bg-gray-50" {...props}>{children}</thead>
);

export const TableBody = ({ children, ...props }) => (
  <tbody className="bg-white divide-y divide-gray-200" {...props}>{children}</tbody>
);

export const TableRow = ({ children, ...props }) => (
  <tr {...props}>{children}</tr>
);

export const TableHead = ({ children, ...props }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props}>{children}</th>
);

export const TableCell = ({ children, ...props }) => (
  <td className="px-6 py-4 whitespace-nowrap" {...props}>{children}</td>
);

export const Select = ({ children, ...props }) => (
  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" {...props}>{children}</select>
);

export const AlertDescription = ({ children, className = "", ...props }) => (
  <div className={`text-sm text-gray-700 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h3>
);

export const Button = ({ children, className, type = "button", ...props }) => (
  <button
    type={type}
    className={`px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const SelectTrigger = Select;
export const SelectContent = ({ children }) => children;
export const SelectItem = ({ children, ...props }) => (
  <option {...props}>{children}</option>
);
export const SelectValue = ({ children }) => children;


export const Alert = ({ type = 'info', children, className, ...props }) => {
  // Define alert styles based on the type
  const baseStyle = 'p-4 mb-4 rounded';
  let alertStyle = '';

  switch (type) {
    case 'success':
      alertStyle = 'bg-green-100 text-green-700';
      break;
    case 'warning':
      alertStyle = 'bg-yellow-100 text-yellow-700';
      break;
    case 'error':
      alertStyle = 'bg-red-100 text-red-700';
      break;
    default:
      alertStyle = 'bg-blue-100 text-blue-700';
  }

  return (
    <div className={`${baseStyle} ${alertStyle} ${className}`} {...props}>
      {children}
    </div>
  );


};

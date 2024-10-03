// import React from 'react';

// export const Card = ({ children, className, ...props }) => (
//   <div className={`bg-white shadow-md rounded-lg ${className}`} {...props}>{children}</div>
// );

// export const CardHeader = ({ children, className, ...props }) => (
//   <div className={`p-4 border-b ${className}`} {...props}>{children}</div>
// );

// export const CardContent = ({ children, className, ...props }) => (
//   <div className={`p-4 ${className}`} {...props}>{children}</div>
// );

// export const Table = ({ children, ...props }) => (
//   <table className="min-w-full divide-y divide-gray-200" {...props}>{children}</table>
// );

// export const TableHeader = ({ children, ...props }) => (
//   <thead className="bg-gray-50" {...props}>{children}</thead>
// );

// export const TableBody = ({ children, ...props }) => (
//   <tbody className="bg-white divide-y divide-gray-200" {...props}>{children}</tbody>
// );

// export const TableRow = ({ children, ...props }) => (
//   <tr {...props}>{children}</tr>
// );

// export const TableHead = ({ children, ...props }) => (
//   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props}>{children}</th>
// );

// export const TableCell = ({ children, ...props }) => (
//   <td className="px-6 py-4 whitespace-nowrap" {...props}>{children}</td>
// );

// export const Select = ({ children, ...props }) => (
//   <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" {...props}>{children}</select>
// );

// export const SelectTrigger = Select;
// export const SelectContent = ({ children }) => children;
// export const SelectItem = ({ children, ...props }) => (
//   <option {...props}>{children}</option>
// );
// export const SelectValue = ({ children }) => children;
import React from 'react';

// Updated Card Component with Deloitte colors and styles
export const Card = ({ children, className, ...props }) => (
  <div className={`bg-white shadow-sm rounded-lg p-4 border border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

// Updated CardHeader with Deloitte colors
export const CardHeader = ({ children, className, ...props }) => (
  <div className={`p-4 border-b border-gray-300 ${className}`} {...props}>
    {children}
  </div>
);

// Updated CardContent
export const CardContent = ({ children, className, ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

// Table component with Deloitte color scheme
export const Table = ({ children, ...props }) => (
  <table className="min-w-full table-auto divide-y divide-gray-200 bg-white rounded-lg shadow-sm" {...props}>
    {children}
  </table>
);

// Table Header with Deloitte's green and gray
export const TableHeader = ({ children, ...props }) => (
  <thead className="bg-lightGray text-darkGray uppercase text-sm font-semibold tracking-wider" {...props}>
    {children}
  </thead>
);

// Table Body
export const TableBody = ({ children, ...props }) => (
  <tbody className="bg-white divide-y divide-gray-200" {...props}>
    {children}
  </tbody>
);

// TableRow with hover effect using Deloitte's light gray
export const TableRow = ({ children, ...props }) => (
  <tr className="hover:bg-lightGray" {...props}>
    {children}
  </tr>
);

// TableHead with Deloitte colors for text
export const TableHead = ({ children, ...props }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-darkGray tracking-wider" {...props}>
    {children}
  </th>
);

// TableCell with padding and Deloitte's text colors
export const TableCell = ({ children, ...props }) => (
  <td className="px-6 py-4 whitespace-nowrap text-darkGray" {...props}>
    {children}
  </td>
);


// Select component with Deloitte green accents
export const Select = ({ children, ...props }) => (
  <select
    className="block w-full pl-3 pr-10 py-2 bg-white border-gray-300 focus:outline-none focus:ring-darkGreen focus:border-darkGreen sm:text-sm rounded-md"
    {...props}
  >
    {children}
  </select>
);

// Reuse Select component for triggers
export const SelectTrigger = Select;

// Container for Select options
export const SelectContent = ({ children }) => children;

// Option element in select with Deloitte text colors
export const SelectItem = ({ children, ...props }) => (
  <option className="text-darkGray" {...props}>
    {children}
  </option>
);

// Selected value for the select input
export const SelectValue = ({ children }) => children;
export const Button= ({ children }) => children;

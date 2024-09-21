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

export const SelectTrigger = Select;
export const SelectContent = ({ children }) => children;
export const SelectItem = ({ children, ...props }) => (
  <option {...props}>{children}</option>
);
export const SelectValue = ({ children }) => children;
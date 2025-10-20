// src/components/ui/select.js
export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ className = "", children, ...props }) {
  return (
    <select
      className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectValue({ children }) {
  return <>{children}</>;
}

export function SelectContent({ className = "", children }) {
  return (
    <div className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function SelectItem({ className = "", children, ...props }) {
  return (
    <option
      className={`relative cursor-default select-none py-2 px-3 text-sm text-gray-900 hover:bg-gray-100 ${className}`}
      {...props}
    >
      {children}
    </option>
  );
}
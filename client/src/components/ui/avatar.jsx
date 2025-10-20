// src/components/ui/avatar.js
export function Avatar({ className = "", children }) {
  return (
    <div className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}>
      {children}
    </div>
  );
}

export function AvatarFallback({ className = "", children }) {
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-full bg-green-600 text-white font-semibold ${className}`}>
      {children}
    </div>
  );
}
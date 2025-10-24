// src/app/profile/layout.js
import Navbar from '@/components/Navbar';

export default function ProfileLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="flex-1 ml-64 overflow-y-auto h-screen bg-gray-50">
        {children}
      </main>
    </div>
  );
}
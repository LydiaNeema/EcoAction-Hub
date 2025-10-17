import React from 'react';
import { Home, FileText, Users, Bell, Bot, User, MessageSquare, LogOut } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-52 min-h-screen bg-gradient-to-b from-green-50 via-green-50 to-pink-50 p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="text-2xl">🌿</div>
        <h1 className="text-xl font-semibold text-gray-800">EcoAction</h1>
      </div>

      {/* Menu Items */}
      <div className="flex-1 space-y-3">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-white shadow-sm text-left text-gray-700 text-sm">
          <Home size={18} className="text-gray-800" />
          <span className="font-medium">Dashboard</span>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-white shadow-sm text-left text-gray-700 text-sm">
          <FileText size={18} className="text-gray-800" />
          <span className="font-medium">Report Issue</span>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-white shadow-sm text-left text-gray-700 text-sm">
          <Users size={18} className="text-gray-800" />
          <span className="font-medium">Community Actions</span>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-white shadow-sm text-left text-gray-700 text-sm">
          <Bell size={18} className="text-gray-800" />
          <span className="font-medium">Emergency Alerts</span>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-white shadow-sm text-left text-gray-700 text-sm">
          <Bot size={18} className="text-gray-800" />
          <span className="font-medium">AI Assistant</span>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-white shadow-sm text-left text-gray-700 text-sm">
          <User size={18} className="text-gray-800" />
          <span className="font-medium">profile</span>
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-white shadow-sm text-left text-gray-700 text-sm">
          <MessageSquare size={18} className="text-gray-800" />
          <span className="font-medium">Contact</span>
        </button>
      </div>

      {/* User Profile & Logout */}
      <div className="mt-auto pt-8 flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center mb-1">
          <User size={28} className="text-gray-500" />
        </div>
        <span className="text-sm text-gray-600">Lydia Chen</span>
        <button className="mt-2 text-sm text-gray-600 underline">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
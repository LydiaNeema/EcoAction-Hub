import React from 'react';
import { Home, AlertTriangle, Users, Bell, Bot, User, Phone, TreePine } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-64 min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <TreePine className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">EcoAction</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-4">
        <ul className="space-y-3">
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <Home className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Report Issue</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <Users className="w-5 h-5" />
              <span className="font-medium">Community Actions</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <Bell className="w-5 h-5" />
              <span className="font-medium">Emergency Alerts</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <Bot className="w-5 h-5" />
              <span className="font-medium">AI Assistant</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <User className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
              <Phone className="w-5 h-5" />
              <span className="font-medium">Contact</span>
            </a>
          </li>
        </ul>
      </div>

      {/* User Profile & Logout */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">LC</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Lydia Chen</p>
            </div>
          </div>
          <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
"use client";
import React from 'react';
import { Home, AlertTriangle, Users, Bell, Bot, User, Phone, TreePine } from 'lucide-react';
import { clearToken } from '@/utils/auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  // Get user initials from full name
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const userName = user?.full_name || 'Guest User';
  const userInitials = getInitials(user?.full_name);

  const menuItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/reports', icon: AlertTriangle, label: 'Report Issue' },
    { href: '/community', icon: Users, label: 'Community Actions' },
    { href: '/emergency', icon: Bell, label: 'Emergency Alerts' },
    { href: '/ai', icon: Bot, label: 'AI Assistant' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/contact', icon: Phone, label: 'Contact' }
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="w-64 h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col border-r border-gray-200 fixed left-0 top-0 overflow-hidden">
      {/* Logo */}
      <div className="p-4 bg-white flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
          <img 
            src="/EcoActionlogo.png" 
            alt="EcoAction Logo" 
            className="w-7 h-7 object-contain"
          />
          <span className="text-lg font-semibold text-gray-900">EcoAction</span>
        </Link>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${
                    active 
                      ? 'text-white bg-green-600 border border-green-600' 
                      : 'text-gray-700 bg-white border border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="p-3 flex-shrink-0 flex justify-center">
        <button 
          onClick={() => { logout(); clearToken(); router.replace('/'); }} 
          className="w-full max-w-[50%] bg-white text-gray-700 px-3 py-2 rounded-lg shadow-sm border border-gray-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 font-medium text-xs"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
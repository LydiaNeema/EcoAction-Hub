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
    <nav className="w-64 min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 bg-white">
        <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
          <img 
            src="/EcoActionlogo.png" 
            alt="EcoAction Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-semibold text-gray-900">EcoAction</span>
        </Link>
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-4 py-4">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${
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

      {/* User Profile & Logout */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{userInitials}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
            </div>
          </div>
          <button onClick={() => { logout(); clearToken(); router.replace('/'); }} className="w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
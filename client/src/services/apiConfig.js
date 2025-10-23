/**
 * API configuration for EcoAction Hub
 * This centralizes all API base URLs to ensure consistency across the application
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

// API endpoints by domain
export const endpoints = {
  ai: `${API_BASE}/ai`,
  emergency: `${API_BASE}/emergency`,
  community: `${API_BASE}/community`,
  reports: `${API_BASE}/reports`,
  users: `${API_BASE}/users`,
};

export default API_BASE;

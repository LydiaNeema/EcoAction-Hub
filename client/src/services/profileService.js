// src/services/profileService.js
import { getToken } from '@/utils/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export const profileService = {
  async fetchProfile(userId) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}/profile/${userId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch profile');
    const data = await response.json();
    return data.profile || data;
  },

  async updateProfile(userId, updates) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}/profile/${userId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    const data = await response.json();
    return data.profile || data;
  },

  async updateStats(userId, stats) {
    const token = getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}/profile/${userId}/stats`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(stats)
    });
    if (!response.ok) throw new Error('Failed to update stats');
    const data = await response.json();
    return data.profile || data;
  }
};
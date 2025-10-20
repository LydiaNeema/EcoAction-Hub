// src/services/profileService.js
const API_BASE = 'http://localhost:5000/api';

export const profileService = {
  async fetchProfile(userId) {
    const response = await fetch(`${API_BASE}/profile/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async updateProfile(userId, updates) {
    const response = await fetch(`${API_BASE}/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  async updateStats(userId, stats) {
    const response = await fetch(`${API_BASE}/profile/${userId}/stats`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats)
    });
    if (!response.ok) throw new Error('Failed to update stats');
    return response.json();
  }
};
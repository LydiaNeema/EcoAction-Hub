const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export const authService = {
  async register({ full_name, email, password }) {
    try {
      console.log('=== REGISTER DEBUG ===');
      console.log('API_BASE:', API_BASE);
      console.log('Full URL:', `${API_BASE}/auth/register`);
      console.log('Request data:', { full_name, email, password: '***' });
      
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, password })
      });
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      console.log('Response headers:', [...res.headers.entries()]);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log('Error response body:', errorText);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Response data:', data);
      
      if (data.success === false) {
        throw new Error(data.error || 'Registration failed');
      }
      return data;
    } catch (error) {
      console.error('Registration error details:', error);
      console.error('Error type:', typeof error);
      console.error('Error stack:', error.stack);
      throw new Error(error.message || 'Network error during registration');
    }
  },

  async login({ email, password }) {
    try {
      console.log('=== LOGIN DEBUG ===');
      console.log('API_BASE:', API_BASE);
      console.log('Full URL:', `${API_BASE}/auth/login`);
      console.log('Request data:', { email, password: '***' });
      
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      console.log('Response headers:', [...res.headers.entries()]);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log('Error response body:', errorText);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Response data:', data);
      
      if (data.success === false) {
        throw new Error(data.error || 'Login failed');
      }
      return data;
    } catch (error) {
      console.error('Login error details:', error);
      console.error('Error type:', typeof error);
      console.error('Error stack:', error.stack);
      throw new Error(error.message || 'Network error during login');
    }
  },

  async me(token) {
    try {
      console.log('Making me request to:', `${API_BASE}/auth/me`);
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      if (data.success === false) {
        throw new Error(data.error || 'Failed to fetch user');
      }
      return data;
    } catch (error) {
      console.error('Me request error:', error);
      throw new Error(error.message || 'Network error fetching user data');
    }
  }
};

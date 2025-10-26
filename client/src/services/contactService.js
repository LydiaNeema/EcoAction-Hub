import { endpoints } from './apiConfig';

/**
 * Contact Service
 * Handles all API calls related to contact messages
 */

const contactService = {
  /**
   * Submit a contact message
   */
  async submitMessage(messageData) {
    const response = await fetch(`${endpoints.contact}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Get all contact messages (admin only)
   */
  async getMessages(filters = {}) {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const params = new URLSearchParams();
    
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.category) {
      params.append('category', filters.category);
    }

    const url = `${endpoints.contact}/messages${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Get a specific message by ID (admin only)
   */
  async getMessage(messageId) {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${endpoints.contact}/messages/${messageId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch message');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Update message status (admin only)
   */
  async updateMessageStatus(messageId, status) {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${endpoints.contact}/messages/${messageId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update status');
    }

    const data = await response.json();
    return data;
  }
};

export default contactService;

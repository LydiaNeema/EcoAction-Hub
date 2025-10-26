import { endpoints } from './apiConfig';
import { getToken } from '@/utils/auth';

/**
 * Community Service
 * Handles all API calls related to community actions
 */

const communityService = {
  /**
   * Get all community actions with optional filters
   */
  async getActions(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.category && filters.category !== 'All categories') {
      params.append('category', filters.category);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }

    const url = `${endpoints.community}/actions${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch community actions');
    }
    
    const data = await response.json();
    return data;
  },

  /**
   * Get a specific action by ID
   */
  async getAction(actionId) {
    const response = await fetch(`${endpoints.community}/actions/${actionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch action details');
    }
    
    const data = await response.json();
    return data;
  },

  /**
   * Create a new community action
   */
  async createAction(actionData) {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required. Please login to create actions.');
    }

    const response = await fetch(`${endpoints.community}/actions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(actionData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create action');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Update an existing action
   */
  async updateAction(actionId, actionData) {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${endpoints.community}/actions/${actionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(actionData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update action');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Delete an action
   */
  async deleteAction(actionId) {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${endpoints.community}/actions/${actionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete action');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Join a community action
   */
  async joinAction(actionId) {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required. Please login to join actions.');
    }

    const response = await fetch(`${endpoints.community}/actions/${actionId}/join`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to join action');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Leave a community action
   */
  async leaveAction(actionId) {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${endpoints.community}/actions/${actionId}/leave`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to leave action');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Get actions the current user has joined
   */
  async getMyActions() {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${endpoints.community}/my-actions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch your actions');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Get community statistics
   */
  async getStats() {
    const response = await fetch(`${endpoints.community}/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    
    const data = await response.json();
    return data;
  }
};

export default communityService;

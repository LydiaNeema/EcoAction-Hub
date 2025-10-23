import { endpoints } from './apiConfig';

export const aiService = {
  async chat(message) {
    try {
      console.log('Making AI chat request to:', `${endpoints.ai}/chat`);
      const res = await fetch(`${endpoints.ai}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      if (data.success === false) {
        throw new Error(data.error || 'AI request failed');
      }
      
      // Log the response source
      console.log('Response source:', data.source || 'Unknown');
      return data;
    } catch (error) {
      console.error('AI chat error:', error);
      throw new Error(error.message || 'Network error during AI chat');
    }
  }
};

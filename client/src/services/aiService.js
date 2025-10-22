const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export const aiService = {
  async chat(message) {
    try {
      console.log('Making AI chat request to:', `${API_BASE}/ai/chat`);
      const res = await fetch(`${API_BASE}/ai/chat`, {
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
      return data;
    } catch (error) {
      console.error('AI chat error:', error);
      throw new Error(error.message || 'Network error during AI chat');
    }
  }
};

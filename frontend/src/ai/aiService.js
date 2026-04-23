import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://expressgo-backend-1.onrender.com/api';

const aiService = {
  getRecommendations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai/recommendations/`);
      return response.data;
    } catch (error) {
      console.error('AI Recommendations Fetch Error:', error);
      throw error;
    }
  },

  chat: async (message) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/chat/`, { message });
      return response.data;
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw error;
    }
  }
};

export default aiService;

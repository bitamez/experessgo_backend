import { useState, useEffect, useCallback } from 'react';
import aiService from './aiService';

export const useAI = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiService.getRecommendations();
      setRecommendations(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch AI suggestions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { recommendations, loading, error, refresh: fetchRecommendations };
};

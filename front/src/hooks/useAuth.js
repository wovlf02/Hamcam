import { useState, useEffect } from 'react';
import api from '../api/api'; // Assuming api.js is correctly configured for backend calls

const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await api.get('/users/me', { withCredentials: true });
        if (response.data && response.data.data && response.data.data.user_id) {
          setUserId(response.data.data.user_id);
        } else {
          setError('User ID not found in response.');
          // Optionally redirect to login if user data is not available
          // window.location.href = '/login';
        }
      } catch (err) {
        console.error('Failed to fetch user ID:', err);
        setError('Failed to fetch user ID.');
        // Optionally redirect to login on error
        // window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  return { userId, loading, error };
};

export default useAuth;

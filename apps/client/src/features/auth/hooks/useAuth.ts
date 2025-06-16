import { useState } from 'react';
import api from '../../../utils/api.member.interceptor';

type LoginData = {
  email: string;
  password: string;
};

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (url: string, data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(url, data);
      localStorage.setItem('token', response.data.data.token);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return { login, logout, error, loading };
};

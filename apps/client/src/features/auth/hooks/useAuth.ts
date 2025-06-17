import { useState } from 'react';
import memberApi from '../../../utils/api.member.interceptor';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  SignupFormData,
  LoginFormData as LoginData,
} from '@leet-code-clone/types';

export const useAuth = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (url: string, data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await memberApi.post(url, data);
      localStorage.setItem('token', response.data.data.token);
      navigate(response.data.data.redirectUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (url: string, data: SignupFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await memberApi.post(url, data);
      toast.success(response.data.message);
      navigate(response.data.data.redirect);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return { login, registerUser, logout, error, loading };
};

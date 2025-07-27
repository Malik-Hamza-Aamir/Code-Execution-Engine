import { useState } from 'react';
import memberApi from '../../../interceptors/api.member.interceptor';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { OtpDtoType, LoginFormData } from '@leet-code-clone/types';

export const usePassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const forgetPassword = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
        const response = await memberApi.post(url);
        return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Forget Password Request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (url: string, data: OtpDtoType) => {
    setLoading(true);
    setError(null);
    try {
        const response = await memberApi.post(url, data);
        return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verify Otp Request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (url: string, data: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
        const response = await memberApi.post(url, data);
        return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset Password Request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { forgetPassword, verifyOtp, resetPassword, error, loading };
};

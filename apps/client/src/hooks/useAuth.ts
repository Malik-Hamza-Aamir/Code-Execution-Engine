import { useState } from 'react';
import { toast } from 'react-toastify';
import { getRightError } from '../utils/helper';
import memberApi from '../interceptors/api.member.interceptor';
import { useNavigate } from 'react-router-dom';
import { NewUserRegistration, LoginFormData } from '../types/user.type';
import { OtpDtoType } from '@leet-code-clone/types';

const toastPropertiesFailure = {
  className: 'custom-toast-error',
  hideProgressBar: true,
  autoClose: 1500,
};

export function useAuth() {
  const navigate = useNavigate();

  const [registerNewUserState, setRegisterNewUserState] = useState({
    data: null as any,
    loading: false,
  });

  const [loginUserState, setLoginUserState] = useState({
    data: null as any,
    loading: false,
  });

  const [forgetPasswordState, setForgetPasswordState] = useState({
    data: null as any,
    loading: false,
  });

  const [verifyOtpState, setVerifyOtpState] = useState({
    data: null as any,
    loading: false,
  });

  const [resetPasswordState, setResetPasswordState] = useState({
    data: null as any,
    loading: false,
  });

  const registerNewUser = async (url: string, body: NewUserRegistration) => {
    setRegisterNewUserState({ data: null, loading: true });
    try {
      const response = await memberApi.post(url, body);
      navigate(response.data.data.redirect);
      setRegisterNewUserState({ data: response.data.data, loading: false });
    } catch (err: any) {
      const error = getRightError(err);
      console.log('[Register New User ERR]', err);
      setRegisterNewUserState({ data: null, loading: false });
      toast(error, toastPropertiesFailure);
    }
  };

  const login = async (url: string, data: LoginFormData) => {
    setLoginUserState({ data: null, loading: true });
    try {
      const response = await memberApi.post(url, data);
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data.data.user));
      setLoginUserState({ data: response.data.data, loading: false });
      navigate(response.data.data.redirectUrl);
    } catch (err: any) {
      const error = getRightError(err);
      console.log('[Login User ERR]', err);
      setLoginUserState({ data: null, loading: false });
      toast(error, toastPropertiesFailure);
    }
  };

  const forgetPassword = async (url: string) => {
    setForgetPasswordState({ data: null, loading: true });
    try {
      const response = await memberApi.post(url);
      setForgetPasswordState({ data: response.data, loading: false });
      return response.data;
    } catch (err: any) {
      const error = getRightError(err);
      console.log('[Forget Password ERR]', err);
      setForgetPasswordState({ data: null, loading: false });
      toast(error, toastPropertiesFailure);
    }
  };

  const verifyOtp = async (url: string, data: OtpDtoType) => {
    setVerifyOtpState({ data: null, loading: true });
    try {
      const response = await memberApi.post(url, data);
      setVerifyOtpState({ data: response.data, loading: false });
      return response.data;
    } catch (err: any) {
      const error = getRightError(err);
      console.log('[Verify OTP ERR]', err);
      setVerifyOtpState({ data: null, loading: false });
      toast(error, toastPropertiesFailure);
    }
  };

  const resetPassword = async (url: string, data: OtpDtoType) => {
    setResetPasswordState({ data: null, loading: true });
    try {
      const response = await memberApi.post(url, data);
      setResetPasswordState({ data: response.data, loading: false });
      return response.data;
    } catch (err: any) {
      const error = getRightError(err);
      console.log('[Reset Password ERR]', err);
      setResetPasswordState({ data: null, loading: false });
      toast(error, toastPropertiesFailure);
    }
  };

  return {
    registerNewUser,
    login,
    forgetPassword,
    verifyOtp,
    resetPassword,
    resetPasswordState,
    verifyOtpState,
    registerNewUserState,
    loginUserState,
    forgetPasswordState,
  };
}

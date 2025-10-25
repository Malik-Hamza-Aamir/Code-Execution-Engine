import { useState } from 'react';
import { toast } from 'react-toastify';
import { getRightError } from '../utils/helper';
import memberApi from '../interceptors/api.member.interceptor';
import { useNavigate } from 'react-router-dom';
import { NewUserRegistration } from '../types/user.type';

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

  const registerNewUser = async (url: string, body: NewUserRegistration) => {
    setRegisterNewUserState({ data: null, loading: true });
    try {
      const response = await memberApi.post(url, body);
      navigate(response.data.data.redirect);
    } catch (err: any) {
      const error = getRightError(err);
      console.log('[Register New User ERR]', err);
      setRegisterNewUserState({ data: null, loading: false });
      toast(error, toastPropertiesFailure);
    }
  };

  return { registerNewUser, registerNewUserState };
}

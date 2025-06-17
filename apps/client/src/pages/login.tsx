import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useState } from 'react';
import { loginSchema, LoginFormData } from '@leet-code-clone/types';

export function Login() {
  const { login, error: authError, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const [isSocialLoading, setIsSocialLoading] = useState({
    google: false,
    github: false,
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login('/auth/login', data);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    setIsSocialLoading((prev) => ({ ...prev, [provider]: true }));
    window.location.href = `${process.env.VITE_API_URL}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Or{' '}
          <Link
            to="/signup"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {(authError || errors.root) && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md text-sm">
              {authError || errors.root?.message}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-600'
                    }`}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white sm:text-sm ${errors.password ? 'border-red-500' : 'border-gray-600'
                    }`}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={isSocialLoading.google}
                className={`w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSocialLoading.google ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                <FcGoogle className="h-5 w-5" />
                <span className="ml-2">
                  {isSocialLoading.google ? 'Processing...' : 'Google'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                disabled={isSocialLoading.github}
                className={`w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSocialLoading.github ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                <FaGithub className="h-5 w-5" />
                <span className="ml-2">
                  {isSocialLoading.github ? 'Processing...' : 'GitHub'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
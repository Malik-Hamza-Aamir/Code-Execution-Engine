import axios from 'axios';

console.log("[api key member]", import.meta.env.VITE_MEMBER_API_URL);

const memberApi = axios.create({
  baseURL: import.meta.env.VITE_MEMBER_API_URL,
});

memberApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

memberApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default memberApi;

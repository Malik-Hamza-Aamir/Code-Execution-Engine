import axios from 'axios';

const memberApi = axios.create({
  baseURL: import.meta.env.VITE_MEMBER_API_URL,
  withCredentials: true,
});

memberApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers: any[] = [];

const onRefreshed = (newToken: any) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: any) => {
  refreshSubscribers.push(callback);
};

memberApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const token = localStorage.getItem('token');
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && token) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(memberApi(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_MEMBER_API_URL}/auth/refresh-token`,
          { withCredentials: true }
        );

        console.log('[res]', res);

        const newAccessToken = res.data.data.token;
        localStorage.setItem('token', newAccessToken);
        memberApi.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        onRefreshed(newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        window.location.href = '/login';
        return memberApi(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default memberApi;

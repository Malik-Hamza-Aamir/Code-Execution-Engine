// let isRefreshing = false;
// let refreshSubscribers: any[] = [];

// const onRefreshed = (newToken: any) => {
//   refreshSubscribers.forEach((callback) => callback(newToken));
//   refreshSubscribers = [];
// };

// const addRefreshSubscriber = (callback: any) => {
//   refreshSubscribers.push(callback);
// };

// export const refreshTokenRetry = (originalRequest: any, error: any) => {
//   if (error.response?.status === 401 && !originalRequest._retry) {
//     if (isRefreshing) {
//       return new Promise((resolve) => {
//         addRefreshSubscriber((newToken: string) => {
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;
//           resolve(memberApi(originalRequest));
//         });
//       });
//     }

//     originalRequest._retry = true;
//     isRefreshing = true;

//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_MEMBER_API_URL}/auth/refresh-token`,
//         {},
//         { withCredentials: true }
//       );

//       const newAccessToken = res.data.accessToken;
//       localStorage.setItem('token', newAccessToken);
//       memberApi.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

//       onRefreshed(newAccessToken);
//       isRefreshing = false;

//       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//       return memberApi(originalRequest); // retry original request
//     } catch (refreshError) {
//       isRefreshing = false;
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//       return Promise.reject(refreshError);
//     }
//   }

//   return Promise.reject(error);
// };

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ginozzi-backecnd-production.up.railway.app';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ginozzi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const refreshToken = localStorage.getItem('ginozzi_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          localStorage.setItem('ginozzi_token', res.data.accessToken);
          localStorage.setItem('ginozzi_refresh_token', res.data.refreshToken);
          error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return apiClient(error.config);
        } catch (e) {
          localStorage.removeItem('ginozzi_token');
          localStorage.removeItem('ginozzi_refresh_token');
          localStorage.removeItem('ginozzi_user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

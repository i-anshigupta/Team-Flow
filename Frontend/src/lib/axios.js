import axios from 'axios';
import { useAuth } from '../store/useAuth';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.startsWith('http')) return envUrl;
  
  // If we're in the browser and no absolute URL is provided, use current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  return 'http://localhost:5000';
};

const BASE_URL = getBaseUrl();
const API_URL = `${BASE_URL}/api/v1`;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuth.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        
        const { accessToken } = data.data;
        
        useAuth.getState().setAuth(useAuth.getState().user, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (e) {
        useAuth.getState().logout();
        localStorage.removeItem('refreshToken');
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

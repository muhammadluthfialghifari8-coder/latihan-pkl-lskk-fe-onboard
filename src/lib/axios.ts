import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid, paksa logout
      useAuthStore.getState().logout();
      window.location.href = '/#/login'; // Redirect paksa ke hash login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
// 1. Import DEFAULT axios (ini yang bikin error 'Cannot find name axios' hilang)
import axios from 'axios';
// 2. Import TIPE-nya pakai keyword 'type'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface MockConfig extends InternalAxiosRequestConfig {
  mockResponse?: Record<string, unknown>;
}

// --- MOCK DATA ---
const mockItems = Array.from({ length: 50 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `Produk Latihan ${i + 1}`,
  description: `Deskripsi produk ${i + 1}`,
  price: Math.floor(Math.random() * 100000) + 10000,
  createdAt: new Date().toISOString(),
}));

// --- INTERCEPTOR REQUEST ---
axiosInstance.interceptors.request.use(async (config: MockConfig) => {
  // Simulasi delay network
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Logic Mock Data
  if (config.url?.includes('/items')) {
    const page = Number(config.params?.page) || 1;
    const limit = Number(config.params?.limit) || 10;
    const start = (page - 1) * limit;
    
    config.mockResponse = {
      code: 200,
      status: true,
      message: 'Success',
      data: mockItems.slice(start, start + limit),
      meta: {
        totalPages: Math.ceil(mockItems.length / limit),
        totalData: mockItems.length,
        page,
        limit,
      },
    };
  }

  // Inject Token Auth
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// --- INTERCEPTOR RESPONSE ---
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as MockConfig;
    if (config.mockResponse) {
      return { ...response, data: config.mockResponse };
    }
    return response;
  },
  // 3. Berikan tipe eksplisit 'AxiosError' pada parameter error
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
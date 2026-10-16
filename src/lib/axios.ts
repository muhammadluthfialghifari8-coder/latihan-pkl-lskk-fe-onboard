import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'; 
import { useAuthStore } from '../stores/authStore';
import type { IResponseEntity } from '../types/api';
import type { Item } from '../types/item';

// 1. Buat Axios Instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

//Interceptor Request (Token) 
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Interceptor Response (401 Logout) 
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);

// SETUP MOCK ADAPTER 
// Aktifkan mock jika environment bukan production
const mock = new MockAdapter(axiosInstance, { delayResponse: 600 }); // Delay 600ms biar kerasa seperti network asli

// Simulasi Database di Memori
let mockDatabase: Item[] = Array.from({ length: 50 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `Produk Latihan ${i + 1}`,
  description: `Deskripsi produk ${i + 1}`,
  price: Math.floor(Math.random() * 100000) + 10000,
  createdAt: new Date().toISOString(),
}));

// Mock GET /items (dengan pagination)
mock.onGet('/items').reply((config) => {
  const page = Number(config.params?.page) || 1;
  const limit = Number(config.params?.limit) || 10;
  const start = (page - 1) * limit;
  const data = mockDatabase.slice(start, start + limit);

  return [
    200,
    {
      code: 200,
      status: true,
      message: 'Success',
      data,
      meta: {
        totalPages: Math.ceil(mockDatabase.length / limit),
        totalData: mockDatabase.length,
        totalDataPerPage: data.length,
        page,
        limit,
      },
    } as IResponseEntity<Item[]>,
  ];
});
//mock login
mock.onPost('/auth/login').reply((config) => {
  const { email } = JSON.parse(config.data); // Ambil email dari body request
  
  return [
    200,
    {
      code: 200,
      status: true,
      message: 'Login berhasil',
      data: {
        token: 'dummy-jwt-token-12345', // Token palsu
        user: {
          id: '1',
          name: 'Peserta PKL LSKK',
          email: email, // Pakai email yang diinput user
        },
      },
    },
  ];
});

// Mock POST /items (Create)
mock.onPost('/items').reply((config) => {
  const payload = JSON.parse(config.data);
  const newItem: Item = {
    id: `item-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...payload,
  };
  mockDatabase = [newItem, ...mockDatabase]; // Tambah ke awal
  return [201, { code: 201, status: true, message: 'Created', data: newItem } as IResponseEntity<Item>];
});

// Mock PUT /items/:id (Update)
mock.onPut(/\/items\/.+/).reply((config) => {
  const id = config.url?.split('/').pop();
  const payload = JSON.parse(config.data);
  const index = mockDatabase.findIndex((item) => item.id === id);
  
  if (index !== -1) {
    mockDatabase[index] = { ...mockDatabase[index], ...payload };
    return [200, { code: 200, status: true, message: 'Updated', data: mockDatabase[index] } as IResponseEntity<Item>];
  }
  return [404, { code: 404, status: false, message: 'Not found' }];
});

// Mock DELETE /items/:id (Delete)
mock.onDelete(/\/items\/.+/).reply((config) => {
  const id = config.url?.split('/').pop();
  const initialLength = mockDatabase.length;
  mockDatabase = mockDatabase.filter((item) => item.id !== id);
  
  if (mockDatabase.length < initialLength) {
    return [200, { code: 200, status: true, message: 'Deleted' } as IResponseEntity<null>];
  }
  return [404, { code: 404, status: false, message: 'Not found' }];
});

export default axiosInstance;
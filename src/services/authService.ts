import type { IResponseEntity } from '../types/api';
import axiosInstance from '../lib/axios';
interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponseData {
  token: string;
  user: { id: string; name: string; email: string };
}

export const authService = {
  login: async (payload: LoginPayload): Promise<IResponseEntity<LoginResponseData>> => {
    // Simulasi delay network
    // Menggunakan axiosInstance
    const response = await axiosInstance.post<IResponseEntity<LoginResponseData>>('/auth/login', payload);
    return response.data;
  },
};

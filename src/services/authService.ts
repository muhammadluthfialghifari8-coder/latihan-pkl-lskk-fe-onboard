import type { IResponseEntity } from '../types/api';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponseData {
  token: string;
  user: { id: string; name: string; email: string };
}

export const authService = {
  login: async (_payload: LoginPayload): Promise<IResponseEntity<LoginResponseData>> => {
    // Simulasi delay network
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Return dummy data sesuai standar IResponseEntity
    return {
      code: 200,
      status: true,
      message: 'Login berhasil',
      data: {
        token: 'dummy-jwt-token-12345',
        user: {
          id: '1',
          name: 'Peserta PKL LSKK',
          email: _payload.email,
        },
      },
    };
  },
};
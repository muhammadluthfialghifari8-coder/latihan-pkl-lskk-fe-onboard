import axiosInstance from '../lib/axios'; 
import type { IResponseEntity } from '../types/api';
import type { Item } from '../types/item';

export const itemService = {
  getItems: async (page: number, limit: number): Promise<IResponseEntity<Item[]>> => {
    const response = await axiosInstance.get<IResponseEntity<Item[]>>('/items', {
      params: { page, limit },
    });
    return response.data;
  },

  createItem: async (payload: Omit<Item, 'id' | 'createdAt'>): Promise<IResponseEntity<Item>> => {
    const response = await axiosInstance.post<IResponseEntity<Item>>('/items', payload);
    return response.data;
  },

  updateItem: async (id: string, payload: Partial<Item>): Promise<IResponseEntity<Item>> => {
    const response = await axiosInstance.put<IResponseEntity<Item>>(`/items/${id}`, payload);
    return response.data;
  },

  deleteItem: async (id: string): Promise<IResponseEntity<null>> => {
    const response = await axiosInstance.delete<IResponseEntity<null>>(`/items/${id}`);
    return response.data;
  },
};
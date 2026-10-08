import type { IResponseEntity } from '../types/api';
import type { Item } from '../types/item';

// Simulasi database di memori
let mockDatabase: Item[] = Array.from({ length: 50 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `Produk Latihan ${i + 1}`,
  description: `Deskripsi produk ${i + 1}`,
  price: Math.floor(Math.random() * 100000) + 10000,
  createdAt: new Date().toISOString(),
}));

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const itemService = {
  getItems: async (page: number, limit: number): Promise<IResponseEntity<Item[]>> => {
    await delay(800);
    const start = (page - 1) * limit;
    const data = mockDatabase.slice(start, start + limit);
    
    return {
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
    };
  },

  createItem: async (payload: Omit<Item, 'id' | 'createdAt'>): Promise<IResponseEntity<Item>> => {
    await delay(600);
    const newItem: Item = {
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    mockDatabase = [newItem, ...mockDatabase]; // Tambah ke awal array

    return {
      code: 201,
      status: true,
      message: 'Item berhasil ditambahkan',
      data: newItem,
    };
  },

  updateItem: async (id: string, payload: Partial<Item>): Promise<IResponseEntity<Item>> => {
    await delay(600);
    const index = mockDatabase.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Item tidak ditemukan');
    
    mockDatabase[index] = { ...mockDatabase[index], ...payload };
    
    return {
      code: 200,
      status: true,
      message: 'Item berhasil diperbarui',
      data: mockDatabase[index],
    };
  },

  deleteItem: async (id: string): Promise<IResponseEntity<null>> => {
    await delay(600);
    const index = mockDatabase.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Item tidak ditemukan');
    
    mockDatabase = mockDatabase.filter((item) => item.id !== id);
    
    return {
      code: 200,
      status: true,
      message: 'Item berhasil dihapus',
    };
  },
};
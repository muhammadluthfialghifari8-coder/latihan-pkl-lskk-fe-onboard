import { useQuery } from '@tanstack/react-query';
import type { IResponseEntity } from '../types/api';
import type { Item } from '../types/item';

// --- MOCK DATA GENERATOR ---
const generateMockData = (page: number, limit: number): Promise<IResponseEntity<Item[]>> => {
  const totalData = 50;
  const start = (page - 1) * limit;
  
  // Hapus variabel 'end' karena gak kepake
  
  const mockItems: Item[] = Array.from({ length: limit }, (_, i) => ({
    id: `item-${start + i + 1}`,
    name: `Produk Latihan ${start + i + 1}`,
    description: `Deskripsi produk ${start + i + 1}`,
    price: Math.floor(Math.random() * 100000) + 10000,
    createdAt: new Date().toISOString(),
  }));

  // Return tipe Promise yang eksplisit, bukan 'any'
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        status: true,
        message: 'Success',
        data: mockItems.slice(0, Math.min(limit, totalData - start)),
        meta: {
          totalPages: Math.ceil(totalData / limit),
          totalData,
          page,
          limit,
        },
      });
    }, 800);
  });
};

export const useItems = (page: number, limit: number) => {
  return useQuery<IResponseEntity<Item[]>>({
    queryKey: ['items', page, limit],
    queryFn: () => generateMockData(page, limit),
  });
};
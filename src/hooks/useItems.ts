import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import type { IResponseEntity } from '../types/api';
import type { Item } from '../types/item';

const emptyResponse = (page: number, limit: number): IResponseEntity<Item[]> => ({
  code: 200,
  status: true,
  message: 'No data available',
  data: [],
  meta: {
    totalPages: 0,
    totalData: 0,
    page,
    limit,
  },
});

export const useItems = (page: number, limit: number) => {
  return useQuery<IResponseEntity<Item[]>>({
    queryKey: ['items', page, limit],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<IResponseEntity<Item[]>>('/items', {
          params: { page, limit },
        });

        return response.data;
      } catch {
        return emptyResponse(page, limit);
      }
    },
  });
};
import { useQuery } from '@tanstack/react-query';
import { itemService } from '../services/itemService';
import type { IResponseEntity } from '../types/api';
import type { Item } from '../types/item';

export const useItems = (page: number, limit: number) => {
  return useQuery<IResponseEntity<Item[]>>({
    queryKey: ['items', page, limit],
    // Panggil fungsi getItems dari service mock
    queryFn: () => itemService.getItems(page, limit), 
  });
};
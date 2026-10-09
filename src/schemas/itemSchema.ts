import { z } from 'zod';

export const itemSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  price: z.number().min(1000, 'Harga minimal Rp 1.000'),
});

export type ItemFormData = z.infer<typeof itemSchema>;

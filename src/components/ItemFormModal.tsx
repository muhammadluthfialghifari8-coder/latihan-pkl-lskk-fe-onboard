import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Form, Input, InputNumber, Button } from 'antd';
import type { Item } from '../types/item';

// Schema Validasi untuk Tambah/Edit
const itemSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  price: z.number().min(1000, 'Harga minimal Rp 1.000'),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: Item | null; // Kalau ada datanya = Edit, kalau null = Tambah
  onSubmit: (data: ItemFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const ItemFormModal = ({ open, onClose, initialData, onSubmit }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: initialData || { name: '', description: '', price: 0 },
  });

  // Reset form setiap kali modal dibuka/ditutup atau data berubah
  useEffect(() => {
    if (open) {
      reset(initialData || { name: '', description: '', price: 0 });
    }
  }, [open, initialData, reset]);

  const handleFinish = async (data: ItemFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      title={initialData ? 'Edit Produk' : 'Tambah Produk'}
      open={open}
      onCancel={onClose}
      footer={null} // Kita pakai tombol submit di dalam form
      destroyOnHidden
    >
      <Form layout="vertical" onFinish={handleSubmit(handleFinish)} className="mt-4">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Form.Item
              label="Nama Produk"
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
            >
              <Input {...field} placeholder="Masukkan nama produk" />
            </Form.Item>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Form.Item
              label="Deskripsi"
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
            >
              <Input.TextArea {...field} rows={3} placeholder="Masukkan deskripsi produk" />
            </Form.Item>
          )}
        />

        <Controller
          name="price"
          control={control}
          render={({ field, fieldState }) => (
            <Form.Item
              label="Harga (Rp)"
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
            >
              <InputNumber
                {...field}
                style={{ width: '100%' }}
                min={0}
                formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => Number(value?.replace(/Rp\s?|,/g, '') ?? 0)}
              />
            </Form.Item>
          )}
        />

        <Form.Item className="flex justify-end gap-2">
          <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-1 rounded border">
            Batal
          </button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            block
          >
            {isSubmitting ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Produk'}
          </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ItemFormModal;

import { useState, useMemo, useCallback } from 'react';
import { Table, Card, Button, Popconfirm, message, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useItems } from '../hooks/useItems';
import { 
  useCreateItem, 
  useUpdateItem, 
  useDeleteItem 
} from '../hooks/useItemMutations';
import type { Item } from '../types/item';
import ItemFormModal from '../components/ItemFormModal';
import type { ItemFormData } from '../schemas/itemSchema';



const DashboardPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  
  // State UI ONLY - HAPUS localItems sepenuhnya
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Ambil data dari server & mutation hooks
  const { data, isLoading } = useItems(page, limit);
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();
  const deleteMutation = useDeleteItem();

  const handleLogout = () => {
    logout();
    message.info('Anda telah berhasil keluar');
    navigate('/login', { replace: true });
  };

  // handle submit : mutation
  const handleFormSubmit = async (formData: ItemFormData) => {
    try {
      if (editingItem) {
          await updateMutation.mutateAsync({ 
          id: editingItem.id, 
          payload: formData 
        });
        message.success('Data berhasil diperbarui!');
      } else {
        await createMutation.mutateAsync(formData);
        message.success('Data berhasil ditambahkan!');
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal menyimpan data';
      message.error(errorMessage);
    }
  };

  // HANDLE DELETE: mutation
  const handleDelete = useCallback(async (id: string) => {
  try {
    await deleteMutation.mutateAsync(id);
    message.success('Data berhasil dihapus!');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Gagal menghapus data';
    message.error(errorMessage);
  }
}, [deleteMutation]);

   const columns = useMemo<ColumnsType<Item>>(() => [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 120 },
    { title: 'Nama Produk', dataIndex: 'name', key: 'name' },
    { 
      title: 'Harga', 
      dataIndex: 'price', 
      key: 'price',
      render: (price: number) => `Rp ${price.toLocaleString('id-ID')}` 
    },
    { 
      title: 'Aksi', 
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button 
            size="small" 
            type="primary"
            loading={updateMutation.isPending} // Loading state saat edit
            onClick={() => { 
              setEditingItem(record); 
              setIsModalOpen(true); 
            }}
          >
            Edit
          </Button>
          
          <Popconfirm
            title="Hapus produk ini?"
            description="Data yang dihapus tidak bisa dikembalikan."
            onConfirm={() => handleDelete(record.id)}
            okText="Ya, Hapus"
            cancelText="Batal"
          >
            <Button 
              size="small" 
              danger 
              loading={deleteMutation.isPending} // Loading state saat hapus
            >
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      )
    },
  ], [updateMutation.isPending, deleteMutation.isPending, handleDelete]);

  return (
    <div className="p-4 md:p-8"> 
      <Card 
        title="Daftar Produk (Client-Side CRUD)" 
        variant="borderless"
        extra={
          <Space size="small">
            <Popconfirm
              title="Yakin ingin keluar?"
              description="Anda harus login kembali untuk mengakses dashboard."
              onConfirm={handleLogout}
              okText="Ya, Keluar"
              cancelText="Batal"
            >
              <Button danger>Logout</Button>
            </Popconfirm>
            <Button 
              type="primary" 
              onClick={() => { 
                setEditingItem(null); 
                setIsModalOpen(true); 
              }}
            >
              + Tambahkan Produk
            </Button>
          </Space>
        }
      >
        <Table
          scroll={{ x: 600 }}
          columns={columns}
          // HAPUS displayData/localItems
          dataSource={data?.data || []} 
          rowKey="id"
          // Loading state disederhanakan
          loading={isLoading} 
          pagination={{
            current: page,
            pageSize: limit,
            // pakai meta.totalData dari server
            total: data?.meta?.totalData || 0, 
            onChange: (newPage) => setPage(newPage),
          }}
          locale={{
            emptyText: 'Belum ada data produk.',
          }}
        />
      </Card>

      <ItemFormModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingItem}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default DashboardPage;
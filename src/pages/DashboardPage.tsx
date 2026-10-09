import { useState, useMemo, useCallback } from 'react';
import { Card, Button, Popconfirm, message, Space } from 'antd';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid'; 
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

interface ItemFormData {
  name: string;
  description: string;
  price: number;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // State untuk MUI Pagination (0-indexed)
  const [paginationModel, setPaginationModel] = useState({
    page: 0, 
    pageSize: 10,
  });

  const { data, isLoading } = useItems(page, limit);
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();
  const deleteMutation = useDeleteItem();

  const handleLogout = () => {
    logout();
    message.info('Anda telah berhasil keluar');
    navigate('/login', { replace: true });
  };

  const handleFormSubmit = async (formData: ItemFormData) => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, payload: formData });
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

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Data berhasil dihapus!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal menghapus data';
      message.error(errorMessage);
    }
  }, [deleteMutation]);

  const handleEdit = (record: Item) => {
    setEditingItem(record);
    setIsModalOpen(true);
  };

  // KOLOM MUI DATA GRID
  const columns = useMemo<GridColDef<Item>[]>(() => [
    { field: 'id', headerName: 'ID', width: 120 },
    { field: 'name', headerName: 'Nama Produk', flex: 1 },
    { 
      field: 'price', 
      headerName: 'Harga', 
      width: 150,
      // valueFormatter untuk text biasa
      valueFormatter: (value) => `Rp ${Number(value).toLocaleString('id-ID')}` 
    },
    { 
      field: 'action',
      headerName: 'Aksi',
      width: 180,
      sortable: false,
      // renderCell untuk komponen React (tombol)
      renderCell: (params) => (
        <Space size="small">
          <Button 
            size="small" 
            type="primary"
            loading={updateMutation.isPending}
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          
          <Popconfirm
            title="Hapus produk ini?"
            description="Data yang dihapus tidak bisa dikembalikan."
            onConfirm={() => handleDelete(params.row.id)}
            okText="Ya, Hapus"
            cancelText="Batal"
          >
            <Button 
              size="small" 
              danger 
              loading={deleteMutation.isPending}
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
        title="Daftar Produk (MUI Data Grid)" 
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
              loading={createMutation.isPending}
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
        {/* MUI DATA GRID */}
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={data?.data || []}
            columns={columns}
            loading={isLoading}
            rowCount={data?.meta?.totalData || 0}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={(newModel) => {
              setPaginationModel(newModel);
              // Konversi 0-indexed MUI ke 1-indexed API
              setPage(newModel.page + 1); 
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            sx={{ border: 'none' }} // Hilangkan border default MUI biar nyatu sama Card AntD
          />
        </div>
      </Card>

      <ItemFormModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingItem}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default DashboardPage;
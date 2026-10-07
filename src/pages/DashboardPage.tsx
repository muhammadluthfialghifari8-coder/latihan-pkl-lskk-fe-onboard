import { useState } from 'react';
import { Table, Card, Button } from 'antd'; // Hapus Tag & Space
import type { ColumnsType } from 'antd/es/table';
import { useItems } from '../hooks/useItems';
import type { Item } from '../types/item';
import ItemFormModal from '../components/ItemFormModal';

// Definisikan tipe form secara eksplisit (pengganti 'any')
interface ItemFormData {
  name: string;
  description: string;
  price: number;
}

const DashboardPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const { data, isLoading, isError } = useItems(page, limit);

  // Ganti parameter 'any' jadi 'ItemFormData'
  const handleFormSubmit = async (formData: ItemFormData) => {
    console.log('Form Submitted:', formData, editingItem ? '(Edit)' : '(Add)');
    // Simulasi delay submit
    await new Promise((r) => setTimeout(r, 500)); 
  };

  const columns: ColumnsType<Item> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
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
      render: (_, record) => (
        <Button 
          size="small" 
          onClick={() => { 
            setEditingItem(record); 
            setIsModalOpen(true); 
          }}
        >
          Edit
        </Button>
      )
    },
  ];

  if (isError) return <div className="p-8 text-red-500">Gagal memuat data!</div>;

  return (
    <div className="p-8">
      <Card 
        title="Daftar Produk" 
        variant="borderless"
        extra={
          <Button 
            type="primary" 
            onClick={() => { 
              setEditingItem(null); 
              setIsModalOpen(true); 
            }}
          >
            + Tambah Produk
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.meta?.totalData || 0,
            onChange: (newPage) => setPage(newPage),
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
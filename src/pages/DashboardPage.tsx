import { useState, useMemo, useCallback } from 'react';
import { Table, Card, Button, Popconfirm, message, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useItems } from '../hooks/useItems';
import type { Item } from '../types/item';
import ItemFormModal from '../components/ItemFormModal';

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
  
  // STATE LOKAL: Awalnya kosong, tapi akan jadi "database" utama
  const [localItems, setLocalItems] = useState<Item[]>([]); 

  const { data, isLoading, isError } = useItems(page, limit);

  // LOGIKA DISPLAY DATA YANG DIPERBAIKI
  const displayData = useMemo(() => {
    // Jika localItems sudah ada isinya (user udah CRUD), pakai itu sebagai prioritas
    if (localItems.length > 0) return localItems;
    
    // Jika belum ada interaksi user, pakai data mock dari API
    return data?.data || [];
  }, [data, localItems]);

  // HANDLE SUBMIT FORM (CREATE & UPDATE)
  const handleFormSubmit = async (formData: ItemFormData) => {
    await new Promise((r) => setTimeout(r, 500)); 
    
    if (editingItem) {
      // UPDATE: Map array, cari ID yang cocok, timpa datanya
      setLocalItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData } 
          : item
      ));
      message.success('Data berhasil diperbarui!');
    } else {
      // CREATE: Buat item baru, masukkan ke AWAL array biar kelihatan
      const newItem: Item = {
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...formData
      };
      setLocalItems(prev => [newItem, ...prev]); 
      message.success('Data berhasil ditambahkan!');
    }
    
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // HANDLE DELETE
  const handleDelete = useCallback((id: string) => {
    setLocalItems(prev => prev.filter(item => item.id !== id));
    message.success('Data berhasil dihapus!');
  }, []);

  const columns: ColumnsType<Item> = [
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
            <Button size="small" danger>Hapus</Button>
          </Popconfirm>
        </Space>
      )
    },
  ];

  if (isError) return <div className="p-8 text-red-500">Gagal memuat data!</div>;

  return (
    <div className="p-8">
      <Card 
        title="Daftar Produk (Client-Side CRUD)" 
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
          dataSource={displayData}
          rowKey="id"
          loading={isLoading && localItems.length === 0}
          pagination={{
            current: page,
            pageSize: limit,
            total: displayData.length,
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
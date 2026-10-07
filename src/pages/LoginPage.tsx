import { useForm, Controller } from 'react-hook-form'; // Tambah import Controller
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Form, Input, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

// 1. Schema Validasi
const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    control, // Ganti register jadi control untuk Controller
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Login Data:', data);
    
    // Simulasi Login Dummy
    login('dummy-token-123', { 
      id: '1', 
      name: 'Peserta PKL', 
      email: data.email 
    });

    message.success('Login berhasil!');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card title="Login LSKK" className="w-full max-w-md shadow-lg">
        {/* Hapus layout="vertical" dari Form, kita atur manual di Controller */}
        <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
          
          {/* Email Field dengan Controller */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Form.Item 
                label="Email" 
                validateStatus={errors.email ? 'error' : ''}
                help={errors.email?.message}
              >
                <Input 
                  placeholder="Masukkan email" 
                  {...field} // Binding yang benar untuk AntD
                  size="large"
                />
              </Form.Item>
            )}
          />

          {/* Password Field dengan Controller */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Form.Item 
                label="Password" 
                validateStatus={errors.password ? 'error' : ''}
                help={errors.password?.message}
              >
                <Input.Password 
                  placeholder="Masukkan password" 
                  {...field} // Binding yang benar untuk AntD
                  size="large"
                />
              </Form.Item>
            )}
          />

          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            size="large" 
            loading={isSubmitting}
          >
            Masuk
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
import { useForm, Controller } from 'react-hook-form'; // Tambah import Controller
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Form, Input, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

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
    control, 
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    
    try {
    // Panggil service
    const response = await authService.login(data); 
    
    if (response.data) {
      login(response.data.token, response.data.user);
      message.success('Login berhasil!');
      navigate('/', { replace: true });
    }
  } catch  {
    message.error('Login gagal, coba lagi.');
  }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card title="Login LSKK" className="w-full max-w-md shadow-lg">
        <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
          
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
                  {...field} 
                  size="large"
                />
              </Form.Item>
            )}
          />

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
                  {...field} 
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
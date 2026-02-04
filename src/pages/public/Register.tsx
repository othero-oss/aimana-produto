import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  companyName: z.string().min(2, 'Nome da empresa deve ter no mínimo 2 caracteres'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve ter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve ter pelo menos um número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const passwordRequirements = [
    { label: '8 caracteres', met: password.length >= 8 },
    { label: 'Uma maiúscula', met: /[A-Z]/.test(password) },
    { label: 'Um número', met: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate registration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock user data
      const mockUser = {
        id: '1',
        companyId: '1',
        name: data.name,
        email: data.email,
        role: 'admin' as const,
        department: null,
        position: null,
        avatarUrl: null,
        aiLevel: 0,
        onboardingCompleted: false,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockCompany = {
        id: '1',
        name: data.companyName,
        cnpj: null,
        sector: null,
        size: null,
        logoUrl: null,
        plan: 'starter' as const,
        aiUsageStatus: 'unknown' as const,
        settings: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      login(mockUser, mockCompany);
      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Logo size="lg" />
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Criar sua conta</CardTitle>
            <CardDescription>
              Comece sua jornada para se tornar uma empresa AI First
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-status-error bg-status-error/10 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Seu nome</Label>
                <Input
                  id="name"
                  placeholder="João Silva"
                  {...register('name')}
                  className={errors.name ? 'border-status-error' : ''}
                />
                {errors.name && (
                  <p className="text-xs text-status-error">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email corporativo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@empresa.com"
                  {...register('email')}
                  className={errors.email ? 'border-status-error' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-status-error">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da empresa</Label>
                <Input
                  id="companyName"
                  placeholder="Sua Empresa Ltda"
                  {...register('companyName')}
                  className={errors.companyName ? 'border-status-error' : ''}
                />
                {errors.companyName && (
                  <p className="text-xs text-status-error">{errors.companyName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className={errors.password ? 'border-status-error pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password requirements */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {passwordRequirements.map((req) => (
                    <span
                      key={req.label}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        req.met
                          ? 'bg-status-success/10 text-status-success'
                          : 'bg-surface-light text-text-muted'
                      }`}
                    >
                      {req.met && <Check className="h-3 w-3" />}
                      {req.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={errors.confirmPassword ? 'border-status-error' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-status-error">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta grátis'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-text-secondary">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-brand-coral hover:underline font-medium">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-xs text-text-muted">
          Ao criar conta, você concorda com nossos{' '}
          <a href="#" className="hover:underline">
            Termos de Uso
          </a>{' '}
          e{' '}
          <a href="#" className="hover:underline">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
}

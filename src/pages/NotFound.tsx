import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-light p-4">
      <Logo size="lg" className="mb-8" />

      <div className="text-center">
        <h1 className="text-9xl font-bold text-brand-coral mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text mb-2">
          Página não encontrada
        </h2>
        <p className="text-text-secondary mb-8 max-w-md">
          Ops! A página que você está procurando não existe ou foi movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Ir para o Dashboard
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}

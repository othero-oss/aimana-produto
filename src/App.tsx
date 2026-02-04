import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import { PublicLayout } from '@/components/layout/PublicLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

// Public pages
import { Landing } from '@/pages/public/Landing';
import { Login } from '@/pages/public/Login';
import { Register } from '@/pages/public/Register';

// Dashboard pages
import { Home } from '@/pages/dashboard/Home';
import { Academy } from '@/pages/dashboard/Academy';
import { CourseDetail } from '@/pages/dashboard/CourseDetail';

// Error pages
import { NotFound } from '@/pages/NotFound';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Create router
const router = createBrowserRouter([
  // Public routes with PublicLayout
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Landing /> },
    ],
  },

  // Auth routes (no layout)
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  // Protected dashboard routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'academy', element: <Academy /> },
      { path: 'academy/:courseId', element: <CourseDetail /> },
      // Placeholder pages - will be implemented in next phases
      { path: 'lifow', element: <PlaceholderPage title="LIFOW" /> },
      { path: 'community', element: <PlaceholderPage title="Comunidade" /> },
      { path: 'diagnostics', element: <PlaceholderPage title="Diagnósticos" /> },
      { path: 'integrations', element: <PlaceholderPage title="Integrações" /> },
      { path: 'policies', element: <PlaceholderPage title="Políticas" /> },
      { path: 'control', element: <PlaceholderPage title="Control" /> },
      { path: 'settings', element: <PlaceholderPage title="Configurações" /> },
    ],
  },

  // 404
  { path: '*', element: <NotFound /> },
]);

// Placeholder component for pages not yet implemented
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="w-16 h-16 rounded-full bg-surface-light flex items-center justify-center mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h1 className="text-2xl font-bold text-text mb-2">{title}</h1>
      <p className="text-text-secondary">
        Esta página será implementada na próxima fase.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

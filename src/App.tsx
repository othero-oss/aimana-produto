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
import { LIFOW } from '@/pages/dashboard/LIFOW';
import { Community } from '@/pages/dashboard/Community';
import { Diagnostics } from '@/pages/dashboard/Diagnostics';
import { Integrations } from '@/pages/dashboard/Integrations';
import { Policies } from '@/pages/dashboard/Policies';
import { Control } from '@/pages/dashboard/Control';
import { Settings } from '@/pages/dashboard/Settings';

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
      { path: 'lifow', element: <LIFOW /> },
      { path: 'community', element: <Community /> },
      { path: 'diagnostics', element: <Diagnostics /> },
      { path: 'integrations', element: <Integrations /> },
      { path: 'policies', element: <Policies /> },
      { path: 'control', element: <Control /> },
      { path: 'settings', element: <Settings /> },
    ],
  },

  // 404
  { path: '*', element: <NotFound /> },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

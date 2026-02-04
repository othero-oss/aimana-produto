import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { auth } from '@/lib/supabase';

export function useAuth() {
  const navigate = useNavigate();
  const { user, company, isLoading, isAuthenticated, login, logout, setLoading } =
    useAuthStore();

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await auth.signIn(email, password);
      if (error) throw error;

      // For now, we'll handle this in the Login page with mock data
      // Session will be handled by onAuthStateChange in production
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    _name: string,
    _companyName: string
  ) => {
    setLoading(true);
    try {
      const { error } = await auth.signUp(email, password, { name: _name });
      if (error) throw error;

      // Company and user profile will be created via database triggers
      // For now, this is handled with mock data in the Register page
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await auth.resetPassword(email);
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    company,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    resetPassword,
    login,
    logout,
    setLoading,
  };
}

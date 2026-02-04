export type UserRole = 'admin' | 'manager' | 'champion' | 'user';

export interface User {
  id: string;
  companyId: string | null;
  name: string;
  email: string;
  role: UserRole;
  department: string | null;
  position: string | null;
  avatarUrl: string | null;
  aiLevel: number;
  onboardingCompleted: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string | null;
  sector: string | null;
  size: string | null;
  logoUrl: string | null;
  plan: 'starter' | 'professional' | 'enterprise';
  aiUsageStatus: 'structured' | 'shadow_ai' | 'none' | 'unknown';
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  company: Company | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  companyName: string;
  companySize?: string;
  sector?: string;
}

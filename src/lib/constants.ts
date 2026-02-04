// Application constants

export const APP_NAME = 'AIMANA';
export const APP_DESCRIPTION = 'Sua empresa AI First em semanas, não anos.';
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173';

// API URLs
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Phase definitions
export const PHASES = {
  PLAN: {
    id: 'plan' as const,
    name: 'PLANEJAR',
    description: 'Diagnostique e crie sua estratégia de IA',
    color: '#4573D2',
  },
  EXECUTE: {
    id: 'execute' as const,
    name: 'EXECUTAR',
    description: 'Capacite sua equipe com IA',
    color: '#F8A325',
  },
  MANAGE: {
    id: 'manage' as const,
    name: 'GERIR',
    description: 'Meça resultados e escale',
    color: '#9B5DE5',
  },
} as const;

// Course levels
export const COURSE_LEVELS = {
  1: {
    name: 'Nível 1',
    label: 'No-Code',
    description: 'Para quem está começando com IA',
    color: '#5DA283',
  },
  2: {
    name: 'Nível 2',
    label: 'Low-Code',
    description: 'Automatize processos com ferramentas visuais',
    color: '#F8A325',
  },
  3: {
    name: 'Nível 3',
    label: 'Code',
    description: 'Desenvolva soluções personalizadas',
    color: '#9B5DE5',
  },
} as const;

// Course categories
export const COURSE_CATEGORIES = {
  foundation: 'Fundamentos',
  champion: 'Champions',
  area: 'Por Área',
  coder: 'Coders',
} as const;

// Areas/departments
export const AREAS = {
  geral: 'Geral',
  rh: 'RH',
  vendas: 'Vendas',
  marketing: 'Marketing',
  ti: 'TI',
  financeiro: 'Financeiro',
  juridico: 'Jurídico',
  operacoes: 'Operações',
} as const;

// User roles
export const USER_ROLES = {
  admin: {
    label: 'Administrador',
    description: 'Acesso total à plataforma',
  },
  manager: {
    label: 'Gestor',
    description: 'Gerencia equipes e métricas',
  },
  champion: {
    label: 'Champion',
    description: 'Líder de adoção de IA',
  },
  user: {
    label: 'Usuário',
    description: 'Acesso padrão',
  },
} as const;

// Company sizes
export const COMPANY_SIZES = {
  '1-50': '1-50 funcionários',
  '51-200': '51-200 funcionários',
  '201-1000': '201-1000 funcionários',
  '1000+': 'Mais de 1000 funcionários',
} as const;

// Plans
export const PLANS = {
  starter: {
    name: 'Starter',
    price: 5000,
    features: [
      'Até 50 usuários',
      'Diagnóstico de maturidade',
      'Academy completo',
      'LIFOW (1 canal)',
      'Suporte por email',
    ],
  },
  professional: {
    name: 'Professional',
    price: 15000,
    features: [
      'Até 200 usuários',
      'Tudo do Starter',
      'Scanner Shadow AI',
      'LIFOW (3 canais)',
      'Integrações MCP',
      'Painel de métricas',
      'Suporte prioritário',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 35000,
    features: [
      'Usuários ilimitados',
      'Tudo do Professional',
      'Trust Agent',
      'AIMANA API',
      'Conectores personalizados',
      'Customer Success dedicado',
      'SLA garantido',
    ],
  },
} as const;

// Maturity dimensions
export const MATURITY_DIMENSIONS = {
  estrategia: 'Estratégia',
  pessoas: 'Pessoas',
  dados: 'Dados',
  tecnologia: 'Tecnologia',
  processos: 'Processos',
  governanca: 'Governança',
} as const;

// Skills for radar chart
export const SKILLS = {
  prompts: 'Prompts',
  ferramentas: 'Ferramentas',
  automacao: 'Automação',
  agentes: 'Agentes',
  governanca: 'Governança',
} as const;

// Integration providers
export const INTEGRATION_PROVIDERS = {
  slack: {
    name: 'Slack',
    icon: 'slack',
    category: 'communication',
  },
  teams: {
    name: 'Microsoft Teams',
    icon: 'teams',
    category: 'communication',
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: 'whatsapp',
    category: 'communication',
  },
  google_calendar: {
    name: 'Google Calendar',
    icon: 'calendar',
    category: 'productivity',
  },
  salesforce: {
    name: 'Salesforce',
    icon: 'salesforce',
    category: 'crm',
  },
  hubspot: {
    name: 'HubSpot',
    icon: 'hubspot',
    category: 'crm',
  },
} as const;

// Navigation items
export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Home', icon: 'Home' },
  { path: '/dashboard/diagnostics', label: 'Diagnósticos', icon: 'Search' },
  { path: '/dashboard/academy', label: 'Academy', icon: 'BookOpen' },
  { path: '/dashboard/lifow', label: 'LIFOW', icon: 'Bot' },
  { path: '/dashboard/community', label: 'Comunidade', icon: 'Users' },
  { path: '/dashboard/policies', label: 'Políticas', icon: 'FileText' },
  { path: '/dashboard/integrations', label: 'Integrações', icon: 'Plug' },
  { path: '/dashboard/control', label: 'Control', icon: 'BarChart3' },
] as const;

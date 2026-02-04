export type AssessmentType = 'maturity' | 'opportunities';
export type AssessmentStatus = 'draft' | 'in_progress' | 'completed';
export type PolicyType = 'uso_ia' | 'dados' | 'seguranca' | 'etica' | 'privacidade';
export type PolicyStatus = 'draft' | 'review' | 'approved' | 'published';

export type MaturityDimension =
  | 'estrategia'
  | 'pessoas'
  | 'dados'
  | 'tecnologia'
  | 'processos'
  | 'governanca';

export interface Assessment {
  id: string;
  companyId: string;
  type: AssessmentType;
  status: AssessmentStatus;
  title: string | null;
  createdBy: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  userId: string | null;
  dimension: MaturityDimension;
  questionId: string;
  answer: Record<string, unknown>;
  score: number | null;
  createdAt: string;
}

export interface DimensionResult {
  score: number;
  insights: string[];
  recommendations: string[];
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  overallScore: number | null;
  dimensions: Record<MaturityDimension, DimensionResult>;
  summary: string | null;
  aiRecommendations: string | null;
  reportUrl: string | null;
  createdAt: string;
}

export interface Policy {
  id: string;
  companyId: string;
  type: PolicyType;
  title: string;
  content: string | null;
  version: number;
  status: PolicyStatus;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MaturityScore {
  dimension: MaturityDimension;
  score: number;
  maxScore: number;
  label: string;
}

export interface AssessmentQuestion {
  id: string;
  dimension: MaturityDimension;
  question: string;
  options: AssessmentOption[];
  weight: number;
}

export interface AssessmentOption {
  value: number;
  label: string;
  description?: string;
}

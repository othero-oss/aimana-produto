export interface CompanyMetrics {
  id: string;
  companyId: string;
  date: string;
  maturityScore: number | null;
  activeUsersCount: number | null;
  trainedUsersCount: number | null;
  coursesCompleted: number | null;
  totalStudyHours: number | null;
  agentsActiveCount: number | null;
  totalInvestmentBrl: number | null;
  totalSavingsBrl: number | null;
  roiMultiplier: number | null;
  adoptionRate: number | null;
  npsScore: number | null;
  csatScore: number | null;
  lifowQuestions: number | null;
  lifowSatisfaction: number | null;
  createdAt: string;
}

export interface FormationROI {
  id: string;
  companyId: string;
  periodStart: string;
  periodEnd: string;
  totalInvestmentBrl: number | null;
  hoursSavedEstimate: number | null;
  valueSavedEstimate: number | null;
  npsScore: number | null;
  csatScore: number | null;
  peopleTrained: number | null;
  coursesCompleted: number | null;
  certificatesIssued: number | null;
  createdAt: string;
}

export interface DashboardStats {
  maturityScore: number;
  maturityChange: number;
  trainedUsers: number;
  totalUsers: number;
  trainedChange: number;
  toolsDetected: number;
  toolsChange: number;
  estimatedROI: number;
  roiChange: number;
}

export interface JourneyPhase {
  id: 'plan' | 'execute' | 'manage';
  name: string;
  status: 'completed' | 'in_progress' | 'locked';
  progress: number;
  color: string;
  nextStep?: string;
}

export interface ActivityItem {
  id: string;
  type: 'course_completed' | 'certificate_earned' | 'assessment_done' | 'user_joined' | 'event_attended';
  title: string;
  description: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface SkillData {
  skill: string;
  value: number;
  fullMark: number;
}

export interface TeamMemberProgress {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  department: string | null;
  level: number;
  coursesCompleted: number;
  coursesInProgress: number;
  totalProgress: number;
  lastAccess: string | null;
}

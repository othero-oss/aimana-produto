export type CourseLevel = 1 | 2 | 3;
export type CourseCategory = 'foundation' | 'champion' | 'area' | 'coder';
export type AreaType = 'geral' | 'rh' | 'vendas' | 'marketing' | 'ti' | 'financeiro' | 'juridico' | 'operacoes';
export type ContentType = 'video' | 'text' | 'quiz' | 'exercise' | 'ai_exercise';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: CourseLevel;
  category: CourseCategory | null;
  area: AreaType;
  thumbnailUrl: string | null;
  durationMinutes: number;
  modulesCount: number;
  studentsCount: number;
  aiTutorEnabled: boolean;
  aiTutorContext: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  slug: string;
  title: string;
  description: string | null;
  contentType: ContentType;
  contentUrl: string | null;
  videoTranscript: string | null;
  aiSummary: string | null;
  exercisePrompt: string | null;
  durationMinutes: number;
  sortOrder: number;
  createdAt: string;
}

export interface UserCourseProgress {
  id: string;
  userId: string;
  courseId: string;
  currentModuleId: string | null;
  progressPercent: number;
  startedAt: string;
  completedAt: string | null;
}

export interface UserModuleProgress {
  id: string;
  userId: string;
  moduleId: string;
  status: ProgressStatus;
  score: number | null;
  timeSpentMinutes: number;
  completedAt: string | null;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  certificateNumber: string;
  issuedAt: string;
  pdfUrl: string | null;
  course?: {
    title: string;
    slug: string;
    level: number;
    category: string;
  };
}

export interface AITutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface AITutorInteraction {
  id: string;
  userId: string;
  courseId: string;
  moduleId: string | null;
  question: string;
  answer: string;
  modelUsed: string;
  tokensUsed: number;
  rating: number | null;
  createdAt: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillName: string;
  proficiencyLevel: number;
  assessedAt: string;
  source: 'course' | 'quiz' | 'self_assessment' | 'manager';
}

export interface UserPDI {
  id: string;
  userId: string;
  currentLevel: number;
  targetLevel: number;
  targetDate: string | null;
  progressPercent: number;
  recommendedCourses: string[];
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseWithProgress extends Course {
  progress?: UserCourseProgress;
  modules?: CourseModule[];
}

export interface ModuleWithProgress extends CourseModule {
  progress?: UserModuleProgress;
}

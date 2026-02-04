import { useState } from 'react';
import { Award, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { StatsCard } from '@/components/shared/StatsCard';
import { CourseGrid } from '@/components/academy/CourseGrid';
import { LevelTrack } from '@/components/academy/LevelTrack';
import type { Course, UserCourseProgress } from '@/types/academy';

// Mock data - will come from API
const mockCourses: Course[] = [
  {
    id: '1',
    slug: 'fundamentos-ia',
    title: 'Fundamentos de IA para Negócios',
    description: 'Entenda os conceitos básicos de Inteligência Artificial e como aplicá-los no seu dia a dia profissional.',
    level: 1,
    category: 'foundation',
    area: 'geral',
    thumbnailUrl: null,
    durationMinutes: 120,
    modulesCount: 6,
    studentsCount: 1247,
    aiTutorEnabled: true,
    aiTutorContext: null,
    isActive: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'prompts-avancados',
    title: 'Prompts Avançados com ChatGPT',
    description: 'Domine técnicas avançadas de engenharia de prompts para extrair o máximo das IAs generativas.',
    level: 1,
    category: 'foundation',
    area: 'geral',
    thumbnailUrl: null,
    durationMinutes: 90,
    modulesCount: 5,
    studentsCount: 892,
    aiTutorEnabled: true,
    aiTutorContext: null,
    isActive: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    slug: 'ia-para-vendas',
    title: 'IA para Times de Vendas',
    description: 'Aprenda a usar IA para prospecção, qualificação de leads e fechamento de negócios.',
    level: 1,
    category: 'area',
    area: 'vendas',
    thumbnailUrl: null,
    durationMinutes: 150,
    modulesCount: 8,
    studentsCount: 654,
    aiTutorEnabled: true,
    aiTutorContext: null,
    isActive: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    slug: 'ia-para-marketing',
    title: 'IA para Marketing Digital',
    description: 'Crie conteúdo, analise dados e otimize campanhas usando ferramentas de IA.',
    level: 1,
    category: 'area',
    area: 'marketing',
    thumbnailUrl: null,
    durationMinutes: 180,
    modulesCount: 10,
    studentsCount: 723,
    aiTutorEnabled: true,
    aiTutorContext: null,
    isActive: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    slug: 'ia-para-rh',
    title: 'IA para Recursos Humanos',
    description: 'Transforme processos de RH com IA: recrutamento, onboarding, e desenvolvimento.',
    level: 1,
    category: 'area',
    area: 'rh',
    thumbnailUrl: null,
    durationMinutes: 120,
    modulesCount: 6,
    studentsCount: 412,
    aiTutorEnabled: true,
    aiTutorContext: null,
    isActive: true,
    sortOrder: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    slug: 'automacao-zapier',
    title: 'Automação com Zapier e Make',
    description: 'Conecte aplicativos e automatize fluxos de trabalho sem programar.',
    level: 2,
    category: 'champion',
    area: 'geral',
    thumbnailUrl: null,
    durationMinutes: 180,
    modulesCount: 8,
    studentsCount: 345,
    aiTutorEnabled: true,
    aiTutorContext: null,
    isActive: true,
    sortOrder: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    slug: 'agentes-ia',
    title: 'Construindo Agentes de IA',
    description: 'Aprenda a criar agentes autônomos que executam tarefas complexas.',
    level: 3,
    category: 'coder',
    area: 'ti',
    thumbnailUrl: null,
    durationMinutes: 240,
    modulesCount: 12,
    studentsCount: 189,
    aiTutorEnabled: true,
    aiTutorContext: null,
    isActive: true,
    sortOrder: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    slug: 'governanca-ia',
    title: 'Governança e Ética em IA',
    description: 'Implemente políticas de uso responsável de IA na sua organização.',
    level: 1,
    category: 'champion',
    area: 'geral',
    thumbnailUrl: null,
    durationMinutes: 90,
    modulesCount: 5,
    studentsCount: 567,
    aiTutorEnabled: true,
    aiTutorContext: null,
    isActive: true,
    sortOrder: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockProgress: Record<string, UserCourseProgress> = {
  '1': {
    id: 'p1',
    userId: 'u1',
    courseId: '1',
    currentModuleId: 'm4',
    progressPercent: 65,
    startedAt: new Date().toISOString(),
    completedAt: null,
  },
  '2': {
    id: 'p2',
    userId: 'u1',
    courseId: '2',
    currentModuleId: null,
    progressPercent: 100,
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
};

const mockLevels = [
  {
    level: 1,
    name: 'Nível 1 - No-Code',
    description: 'Domine as ferramentas de IA sem precisar programar',
    coursesTotal: 6,
    coursesCompleted: 2,
    skills: ['Prompts', 'ChatGPT', 'Ferramentas IA'],
    isUnlocked: true,
    isCurrent: true,
  },
  {
    level: 2,
    name: 'Nível 2 - Low-Code',
    description: 'Automatize processos com plataformas visuais',
    coursesTotal: 4,
    coursesCompleted: 0,
    skills: ['Automação', 'APIs', 'Integrações'],
    isUnlocked: false,
    isCurrent: false,
  },
  {
    level: 3,
    name: 'Nível 3 - Code',
    description: 'Desenvolva soluções personalizadas com código',
    coursesTotal: 3,
    coursesCompleted: 0,
    skills: ['Python', 'Agentes', 'RAG'],
    isUnlocked: false,
    isCurrent: false,
  },
];

const mockStats = {
  coursesCompleted: 2,
  coursesInProgress: 1,
  hoursLearned: 12,
  certificates: 1,
};

export function Academy() {
  const [activeTab, setActiveTab] = useState('trilhas');

  // Filter courses by progress status
  const inProgressCourses = mockCourses.filter(
    (c) => mockProgress[c.id] && !mockProgress[c.id].completedAt
  );
  const completedCourses = mockCourses.filter(
    (c) => mockProgress[c.id]?.completedAt
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Cursos concluídos"
          value={mockStats.coursesCompleted}
          icon={<Award className="h-5 w-5 text-status-success" />}
        />
        <StatsCard
          title="Em andamento"
          value={mockStats.coursesInProgress}
          icon={<BookOpen className="h-5 w-5 text-phase-execute" />}
        />
        <StatsCard
          title="Horas de estudo"
          value={`${mockStats.hoursLearned}h`}
          icon={<Clock className="h-5 w-5 text-phase-plan" />}
        />
        <StatsCard
          title="Certificados"
          value={mockStats.certificates}
          icon={<TrendingUp className="h-5 w-5 text-brand-coral" />}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="trilhas">Trilhas</TabsTrigger>
          <TabsTrigger value="cursos">Todos os Cursos</TabsTrigger>
          <TabsTrigger value="meus">Meus Cursos</TabsTrigger>
          <TabsTrigger value="certificados">Certificados</TabsTrigger>
        </TabsList>

        {/* Trilhas Tab */}
        <TabsContent value="trilhas" className="space-y-8">
          {/* Level tracks */}
          <div>
            <h2 className="text-lg font-semibold text-text mb-4">
              Sua jornada de aprendizado
            </h2>
            <LevelTrack levels={mockLevels} />
          </div>

          {/* Recommended courses */}
          <div>
            <h2 className="text-lg font-semibold text-text mb-4">
              Recomendados para você
            </h2>
            <CourseGrid
              courses={mockCourses.filter((c) => c.level === 1).slice(0, 4)}
              progressMap={mockProgress}
            />
          </div>
        </TabsContent>

        {/* All Courses Tab */}
        <TabsContent value="cursos">
          <CourseGrid courses={mockCourses} progressMap={mockProgress} />
        </TabsContent>

        {/* My Courses Tab */}
        <TabsContent value="meus" className="space-y-8">
          {/* In Progress */}
          {inProgressCourses.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-text mb-4">
                Em andamento
              </h2>
              <CourseGrid courses={inProgressCourses} progressMap={mockProgress} />
            </div>
          )}

          {/* Completed */}
          {completedCourses.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-text mb-4">
                Concluídos
              </h2>
              <CourseGrid courses={completedCourses} progressMap={mockProgress} />
            </div>
          )}

          {/* Empty state */}
          {inProgressCourses.length === 0 && completedCourses.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2">
                  Nenhum curso iniciado
                </h3>
                <p className="text-text-secondary">
                  Explore nossa biblioteca e comece sua jornada de aprendizado!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificados">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.length > 0 ? (
              completedCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="h-32 bg-gradient-celebration flex items-center justify-center">
                    <Award className="h-16 w-16 text-white" />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-text mb-1">{course.title}</h3>
                    <p className="text-sm text-text-secondary mb-3">
                      Concluído em {new Date().toLocaleDateString('pt-BR')}
                    </p>
                    <button className="text-sm font-medium text-brand-coral hover:underline">
                      Baixar certificado
                    </button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="md:col-span-2 lg:col-span-3">
                <CardContent className="py-12 text-center">
                  <Award className="h-12 w-12 text-text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text mb-2">
                    Nenhum certificado ainda
                  </h3>
                  <p className="text-text-secondary">
                    Complete cursos para ganhar certificados!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

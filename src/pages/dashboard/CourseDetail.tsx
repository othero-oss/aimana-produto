import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Users,
  Play,
  Bot,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ModuleList } from '@/components/academy/ModuleList';
import { AITutor } from '@/components/academy/AITutor';
import type { Course, CourseModule, UserModuleProgress } from '@/types/academy';

// Mock data
const mockCourse: Course = {
  id: '1',
  slug: 'fundamentos-ia',
  title: 'Fundamentos de IA para Negócios',
  description:
    'Entenda os conceitos básicos de Inteligência Artificial e como aplicá-los no seu dia a dia profissional. Este curso vai te dar a base necessária para entender como a IA funciona e como você pode usá-la para aumentar sua produtividade.',
  level: 1,
  category: 'foundation',
  area: 'geral',
  thumbnailUrl: null,
  durationMinutes: 120,
  modulesCount: 6,
  studentsCount: 1247,
  aiTutorEnabled: true,
  aiTutorContext:
    'Este curso aborda os fundamentos de IA para profissionais de negócios.',
  isActive: true,
  sortOrder: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockModules: CourseModule[] = [
  {
    id: 'm1',
    courseId: '1',
    slug: 'intro-ia',
    title: 'O que é Inteligência Artificial?',
    description: 'Entenda os conceitos fundamentais e a história da IA.',
    contentType: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoTranscript: null,
    aiSummary:
      'Neste módulo, você aprenderá o que é Inteligência Artificial, sua história desde os anos 1950, e como ela evoluiu até os dias de hoje. Vamos abordar os diferentes tipos de IA e suas aplicações no mundo real.',
    exercisePrompt: null,
    durationMinutes: 15,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm2',
    courseId: '1',
    slug: 'tipos-ia',
    title: 'Tipos de IA: Narrow, General e Super',
    description: 'Conheça as diferentes categorias de inteligência artificial.',
    contentType: 'video',
    contentUrl: null,
    videoTranscript: null,
    aiSummary: null,
    exercisePrompt: null,
    durationMinutes: 20,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm3',
    courseId: '1',
    slug: 'ia-generativa',
    title: 'IA Generativa e LLMs',
    description: 'Como funcionam os modelos de linguagem como GPT e Claude.',
    contentType: 'video',
    contentUrl: null,
    videoTranscript: null,
    aiSummary: null,
    exercisePrompt: null,
    durationMinutes: 25,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm4',
    courseId: '1',
    slug: 'casos-uso',
    title: 'Casos de Uso em Empresas',
    description: 'Exemplos práticos de aplicação de IA em diferentes setores.',
    contentType: 'video',
    contentUrl: null,
    videoTranscript: null,
    aiSummary: null,
    exercisePrompt: null,
    durationMinutes: 20,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm5',
    courseId: '1',
    slug: 'quiz-fundamentos',
    title: 'Quiz: Teste seus Conhecimentos',
    description: 'Avalie o que você aprendeu sobre fundamentos de IA.',
    contentType: 'quiz',
    contentUrl: null,
    videoTranscript: null,
    aiSummary: null,
    exercisePrompt: null,
    durationMinutes: 15,
    sortOrder: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm6',
    courseId: '1',
    slug: 'exercicio-pratico',
    title: 'Exercício: Seu Primeiro Prompt',
    description: 'Pratique criando prompts efetivos com ajuda do Tutor IA.',
    contentType: 'ai_exercise',
    contentUrl: null,
    videoTranscript: null,
    aiSummary: null,
    exercisePrompt:
      'Crie um prompt para resumir um artigo de blog sobre tendências de marketing.',
    durationMinutes: 25,
    sortOrder: 6,
    createdAt: new Date().toISOString(),
  },
];

const mockProgress: Record<string, UserModuleProgress> = {
  m1: {
    id: 'p1',
    userId: 'u1',
    moduleId: 'm1',
    status: 'completed',
    score: null,
    timeSpentMinutes: 18,
    completedAt: new Date().toISOString(),
  },
  m2: {
    id: 'p2',
    userId: 'u1',
    moduleId: 'm2',
    status: 'completed',
    score: null,
    timeSpentMinutes: 22,
    completedAt: new Date().toISOString(),
  },
  m3: {
    id: 'p3',
    userId: 'u1',
    moduleId: 'm3',
    status: 'in_progress',
    score: null,
    timeSpentMinutes: 10,
    completedAt: null,
  },
};

export function CourseDetail() {
  const { courseId } = useParams();
  const [selectedModule, setSelectedModule] = useState<CourseModule>(mockModules[2]);
  const [showAITutor, setShowAITutor] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Calculate progress
  const completedModules = Object.values(mockProgress).filter(
    (p) => p.status === 'completed'
  ).length;
  const progressPercent = Math.round((completedModules / mockModules.length) * 100);

  const course = mockCourse;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/dashboard/academy"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Academy
      </Link>

      {/* Course header */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content area */}
        <div className="flex-1 space-y-6">
          {/* Video/Content player */}
          <Card className="overflow-hidden">
            <div className="aspect-video bg-brand-navy flex items-center justify-center relative">
              {selectedModule.contentUrl ? (
                <div className="w-full h-full">
                  {/* Video player would go here */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-brand-coral"
                    >
                      <Play className="h-8 w-8 ml-1" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-white/60">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Conteúdo em breve</p>
                </div>
              )}
            </div>

            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge
                    variant={
                      selectedModule.contentType === 'video'
                        ? 'secondary'
                        : selectedModule.contentType === 'quiz'
                        ? 'warning'
                        : 'success'
                    }
                    className="mb-2"
                  >
                    {selectedModule.contentType === 'video'
                      ? 'Vídeo'
                      : selectedModule.contentType === 'quiz'
                      ? 'Quiz'
                      : selectedModule.contentType === 'ai_exercise'
                      ? 'Exercício com IA'
                      : 'Texto'}
                  </Badge>
                  <h1 className="text-xl font-bold text-text mb-2">
                    {selectedModule.title}
                  </h1>
                  <p className="text-text-secondary">{selectedModule.description}</p>
                </div>

                {/* AI Tutor button */}
                {course.aiTutorEnabled && (
                  <Button
                    onClick={() => setShowAITutor(true)}
                    className="flex-shrink-0"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Tutor IA
                  </Button>
                )}
              </div>

              {/* AI Summary */}
              {selectedModule.aiSummary && (
                <div className="mt-6 pt-6 border-t border-surface-border">
                  <button
                    onClick={() => setShowSummary(!showSummary)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="font-medium text-text flex items-center gap-2">
                      <Bot className="h-4 w-4 text-brand-coral" />
                      Resumo gerado por IA
                    </span>
                    {showSummary ? (
                      <ChevronUp className="h-4 w-4 text-text-muted" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-text-muted" />
                    )}
                  </button>
                  {showSummary && (
                    <p className="mt-3 text-sm text-text-secondary bg-surface-light p-4 rounded-lg">
                      {selectedModule.aiSummary}
                    </p>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="mt-6 pt-6 border-t border-surface-border flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={selectedModule.sortOrder === 1}
                  onClick={() => {
                    const prevModule = mockModules[selectedModule.sortOrder - 2];
                    if (prevModule) setSelectedModule(prevModule);
                  }}
                >
                  ← Anterior
                </Button>
                <Button
                  disabled={selectedModule.sortOrder === mockModules.length}
                  onClick={() => {
                    const nextModule = mockModules[selectedModule.sortOrder];
                    if (nextModule) setSelectedModule(nextModule);
                  }}
                >
                  Próximo →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[340px] space-y-4">
          {/* Course info card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-text-secondary">Seu progresso</span>
                  <span className="font-medium">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} variant="gradient" className="h-2" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-surface-light rounded-lg">
                  <Clock className="h-4 w-4 text-text-muted mx-auto mb-1" />
                  <p className="text-xs text-text-muted">
                    {course.durationMinutes} min
                  </p>
                </div>
                <div className="p-2 bg-surface-light rounded-lg">
                  <BookOpen className="h-4 w-4 text-text-muted mx-auto mb-1" />
                  <p className="text-xs text-text-muted">
                    {course.modulesCount} módulos
                  </p>
                </div>
                <div className="p-2 bg-surface-light rounded-lg">
                  <Users className="h-4 w-4 text-text-muted mx-auto mb-1" />
                  <p className="text-xs text-text-muted">{course.studentsCount}</p>
                </div>
              </div>

              {/* Certificate CTA */}
              {progressPercent === 100 && (
                <Button className="w-full" variant="success">
                  <Award className="h-4 w-4 mr-2" />
                  Obter certificado
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Module list */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Módulos do curso</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ModuleList
                modules={mockModules}
                progressMap={mockProgress}
                currentModuleId={selectedModule.id}
                onModuleSelect={setSelectedModule}
                className="px-2 pb-2"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Tutor sidebar */}
      <AITutor
        courseId={course.id}
        courseName={course.title}
        moduleId={selectedModule.id}
        moduleName={selectedModule.title}
        isOpen={showAITutor}
        onClose={() => setShowAITutor(false)}
      />
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Clock, Users, BookOpen, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Course, UserCourseProgress } from '@/types/academy';

interface CourseCardProps {
  course: Course;
  progress?: UserCourseProgress;
  className?: string;
}

const levelConfig = {
  1: { label: 'Nível 1', badge: 'No-Code', color: 'bg-status-success' },
  2: { label: 'Nível 2', badge: 'Low-Code', color: 'bg-phase-execute' },
  3: { label: 'Nível 3', badge: 'Code', color: 'bg-phase-manage' },
};

const areaLabels: Record<string, string> = {
  geral: 'Geral',
  vendas: 'Vendas',
  marketing: 'Marketing',
  rh: 'RH',
  ti: 'TI',
  financeiro: 'Financeiro',
};

export function CourseCard({ course, progress, className }: CourseCardProps) {
  const level = levelConfig[course.level as keyof typeof levelConfig] || levelConfig[1];
  const hasProgress = progress && progress.progressPercent > 0;
  const isCompleted = progress?.completedAt !== null;

  return (
    <Link to={`/dashboard/academy/${course.id}`}>
      <Card
        interactive
        className={cn(
          'overflow-hidden group h-full',
          className
        )}
      >
        {/* Thumbnail */}
        <div className="relative h-40 bg-gradient-to-br from-brand-coral/20 to-phase-execute/20 overflow-hidden">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-brand-coral/40" />
            </div>
          )}

          {/* Play overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-6 w-6 text-brand-coral ml-1" />
            </div>
          </div>

          {/* Level badge */}
          <div className="absolute top-3 left-3">
            <Badge className={cn('text-white border-0', level.color)}>
              {level.badge}
            </Badge>
          </div>

          {/* Area badge */}
          {course.area !== 'geral' && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90">
                {areaLabels[course.area] || course.area}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-text line-clamp-2 mb-2 group-hover:text-brand-coral transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-text-secondary line-clamp-2 mb-4">
            {course.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{course.durationMinutes} min</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{course.modulesCount} módulos</span>
            </div>
            {course.studentsCount > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>{course.studentsCount}</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {hasProgress && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">
                  {isCompleted ? 'Concluído!' : 'Em progresso'}
                </span>
                <span className="font-medium text-text">
                  {progress.progressPercent}%
                </span>
              </div>
              <Progress
                value={progress.progressPercent}
                variant={isCompleted ? 'default' : 'gradient'}
                className="h-1.5"
              />
            </div>
          )}

          {/* CTA for new courses */}
          {!hasProgress && (
            <span className="text-sm font-medium text-brand-coral group-hover:underline">
              Começar curso →
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

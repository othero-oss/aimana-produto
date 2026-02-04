import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CourseCard } from './CourseCard';
import { EmptyState } from '@/components/shared/EmptyState';
import type { Course, UserCourseProgress } from '@/types/academy';

interface CourseGridProps {
  courses: Course[];
  progressMap?: Record<string, UserCourseProgress>;
  className?: string;
}

type FilterLevel = 0 | 1 | 2 | 3;
type FilterArea = 'all' | 'geral' | 'vendas' | 'marketing' | 'rh' | 'ti';

const levelFilters = [
  { value: 0 as FilterLevel, label: 'Todos os níveis' },
  { value: 1 as FilterLevel, label: 'Nível 1 - No-Code' },
  { value: 2 as FilterLevel, label: 'Nível 2 - Low-Code' },
  { value: 3 as FilterLevel, label: 'Nível 3 - Code' },
];

const areaFilters = [
  { value: 'all' as FilterArea, label: 'Todas as áreas' },
  { value: 'geral' as FilterArea, label: 'Geral' },
  { value: 'vendas' as FilterArea, label: 'Vendas' },
  { value: 'marketing' as FilterArea, label: 'Marketing' },
  { value: 'rh' as FilterArea, label: 'RH' },
  { value: 'ti' as FilterArea, label: 'TI' },
];

export function CourseGrid({ courses, progressMap = {}, className }: CourseGridProps) {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<FilterLevel>(0);
  const [areaFilter, setAreaFilter] = useState<FilterArea>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          course.title.toLowerCase().includes(searchLower) ||
          course.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Level filter
      if (levelFilter !== 0 && course.level !== levelFilter) {
        return false;
      }

      // Area filter
      if (areaFilter !== 'all' && course.area !== areaFilter) {
        return false;
      }

      return true;
    });
  }, [courses, search, levelFilter, areaFilter]);

  const hasActiveFilters = levelFilter !== 0 || areaFilter !== 'all' || search !== '';

  const clearFilters = () => {
    setSearch('');
    setLevelFilter(0);
    setAreaFilter('all');
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            type="search"
            placeholder="Buscar cursos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter toggle (mobile) */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <Badge className="ml-2 h-5 w-5 p-0 justify-center">
              {(levelFilter !== 0 ? 1 : 0) + (areaFilter !== 'all' ? 1 : 0)}
            </Badge>
          )}
        </Button>

        {/* Filters (desktop) */}
        <div className="hidden sm:flex gap-2">
          {/* Level filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(Number(e.target.value) as FilterLevel)}
            className="h-10 px-3 rounded-lg border border-surface-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-coral/20"
          >
            {levelFilters.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Area filter */}
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value as FilterArea)}
            className="h-10 px-3 rounded-lg border border-surface-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-coral/20"
          >
            {areaFilters.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Mobile filters */}
      {showFilters && (
        <div className="sm:hidden flex flex-col gap-3 p-4 bg-surface-light rounded-lg">
          <div>
            <label className="text-sm font-medium text-text mb-1 block">Nível</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(Number(e.target.value) as FilterLevel)}
              className="w-full h-10 px-3 rounded-lg border border-surface-border bg-white text-sm"
            >
              {levelFilters.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-text mb-1 block">Área</label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value as FilterArea)}
              className="w-full h-10 px-3 rounded-lg border border-surface-border bg-white text-sm"
            >
              {areaFilters.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              Limpar filtros
            </Button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
        </p>
      </div>

      {/* Course grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              progress={progressMap[course.id]}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          type="search"
          title="Nenhum curso encontrado"
          description="Tente ajustar os filtros ou buscar por outros termos."
          action={
            hasActiveFilters
              ? { label: 'Limpar filtros', onClick: clearFilters }
              : undefined
          }
        />
      )}
    </div>
  );
}

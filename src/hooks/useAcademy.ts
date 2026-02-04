// Academy Hooks - React Query hooks for courses and progress

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as academyService from '@/services/academy'
import type { Course, CourseModule, UserCourseProgress, Certificate } from '@/types/academy'

// ============================================
// QUERY KEYS
// ============================================

export const academyKeys = {
  all: ['academy'] as const,
  courses: () => [...academyKeys.all, 'courses'] as const,
  coursesList: (filters?: Record<string, unknown>) => [...academyKeys.courses(), 'list', filters] as const,
  courseBySlug: (slug: string) => [...academyKeys.courses(), 'slug', slug] as const,
  courseById: (id: string) => [...academyKeys.courses(), 'id', id] as const,
  modules: () => [...academyKeys.all, 'modules'] as const,
  modulesByCourse: (courseId: string) => [...academyKeys.modules(), 'course', courseId] as const,
  moduleById: (id: string) => [...academyKeys.modules(), 'id', id] as const,
  progress: () => [...academyKeys.all, 'progress'] as const,
  progressByCourse: (courseId: string) => [...academyKeys.progress(), 'course', courseId] as const,
  progressAll: () => [...academyKeys.progress(), 'all'] as const,
  certificates: () => [...academyKeys.all, 'certificates'] as const,
}

// ============================================
// COURSES HOOKS
// ============================================

interface UseCoursesOptions {
  level?: number
  category?: string
  area?: string
  search?: string
  enabled?: boolean
}

export function useCourses(options: UseCoursesOptions = {}) {
  const { enabled = true, ...filters } = options

  return useQuery({
    queryKey: academyKeys.coursesList(filters),
    queryFn: () => academyService.getCourses(filters),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCourseBySlug(slug: string) {
  return useQuery({
    queryKey: academyKeys.courseBySlug(slug),
    queryFn: () => academyService.getCourseBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCourseById(id: string) {
  return useQuery({
    queryKey: academyKeys.courseById(id),
    queryFn: () => academyService.getCourseById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// ============================================
// MODULES HOOKS
// ============================================

export function useCourseModules(courseId: string) {
  return useQuery({
    queryKey: academyKeys.modulesByCourse(courseId),
    queryFn: () => academyService.getCourseModules(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useModuleById(moduleId: string) {
  return useQuery({
    queryKey: academyKeys.moduleById(moduleId),
    queryFn: () => academyService.getModuleById(moduleId),
    enabled: !!moduleId,
    staleTime: 5 * 60 * 1000,
  })
}

// ============================================
// PROGRESS HOOKS
// ============================================

export function useCourseProgress(courseId: string) {
  return useQuery({
    queryKey: academyKeys.progressByCourse(courseId),
    queryFn: () => academyService.getUserCourseProgress(courseId),
    enabled: !!courseId,
  })
}

export function useAllCoursesProgress() {
  return useQuery({
    queryKey: academyKeys.progressAll(),
    queryFn: () => academyService.getUserAllCoursesProgress(),
  })
}

export function useStartCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: string) => academyService.startCourse(courseId),
    onSuccess: (data, courseId) => {
      // Invalidate progress queries
      queryClient.invalidateQueries({ queryKey: academyKeys.progressByCourse(courseId) })
      queryClient.invalidateQueries({ queryKey: academyKeys.progressAll() })
      // Invalidate course to update students count
      queryClient.invalidateQueries({ queryKey: academyKeys.courseById(courseId) })
    },
  })
}

export function useUpdateModuleProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      moduleId,
      status,
      score,
    }: {
      moduleId: string
      status: 'in_progress' | 'completed'
      score?: number
    }) => academyService.updateModuleProgress(moduleId, status, score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academyKeys.progress() })
    },
  })
}

export function useUpdateCourseProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      courseId,
      progressPercent,
      currentModuleId,
    }: {
      courseId: string
      progressPercent: number
      currentModuleId?: string
    }) => academyService.updateCourseProgress(courseId, progressPercent, currentModuleId),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: academyKeys.progressByCourse(courseId) })
      queryClient.invalidateQueries({ queryKey: academyKeys.progressAll() })
    },
  })
}

// ============================================
// CERTIFICATES HOOKS
// ============================================

export function useCertificates() {
  return useQuery({
    queryKey: academyKeys.certificates(),
    queryFn: () => academyService.getUserCertificates(),
  })
}

// ============================================
// AI TUTOR HOOKS
// ============================================

interface TutorMessageParams {
  question: string
  courseId: string
  courseName: string
  moduleId?: string
  moduleName?: string
  previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>
}

export function useTutorChat() {
  return useMutation({
    mutationFn: (params: TutorMessageParams) =>
      academyService.sendTutorMessage(
        params.question,
        params.courseId,
        params.courseName,
        params.moduleId,
        params.moduleName,
        params.previousMessages
      ),
  })
}

export function useRateTutorInteraction() {
  return useMutation({
    mutationFn: ({
      interactionId,
      rating,
    }: {
      interactionId: string
      rating: number
    }) => academyService.rateTutorInteraction(interactionId, rating),
  })
}

// ============================================
// COMBINED HOOKS
// ============================================

export function useCourseWithProgress(courseId: string) {
  const courseQuery = useCourseById(courseId)
  const progressQuery = useCourseProgress(courseId)
  const modulesQuery = useCourseModules(courseId)

  return {
    course: courseQuery.data,
    progress: progressQuery.data,
    modules: modulesQuery.data,
    isLoading: courseQuery.isLoading || progressQuery.isLoading || modulesQuery.isLoading,
    isError: courseQuery.isError || progressQuery.isError || modulesQuery.isError,
    error: courseQuery.error || progressQuery.error || modulesQuery.error,
  }
}

export function useCoursesWithProgress(filters?: UseCoursesOptions) {
  const coursesQuery = useCourses(filters)
  const progressQuery = useAllCoursesProgress()

  // Merge progress into courses
  const coursesWithProgress = coursesQuery.data?.map((course) => {
    const progress = progressQuery.data?.find((p) => p.courseId === course.id)
    return {
      ...course,
      userProgress: progress,
    }
  })

  return {
    courses: coursesWithProgress,
    isLoading: coursesQuery.isLoading || progressQuery.isLoading,
    isError: coursesQuery.isError || progressQuery.isError,
    error: coursesQuery.error || progressQuery.error,
  }
}

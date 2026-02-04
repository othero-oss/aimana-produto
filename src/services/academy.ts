// Academy Service - API calls for courses, modules, and progress

import { supabase } from '@/lib/supabase'
import type { Course, CourseModule, UserCourseProgress, Certificate } from '@/types/academy'

// ============================================
// COURSES
// ============================================

export async function getCourses(filters?: {
  level?: number
  category?: string
  area?: string
  search?: string
}): Promise<Course[]> {
  let query = supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (filters?.level) {
    query = query.eq('level', filters.level)
  }

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.area) {
    query = query.eq('area', filters.area)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching courses:', error)
    throw error
  }

  return (data || []).map(mapCourse)
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching course:', error)
    throw error
  }

  return data ? mapCourse(data) : null
}

export async function getCourseById(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching course:', error)
    throw error
  }

  return data ? mapCourse(data) : null
}

// ============================================
// MODULES
// ============================================

export async function getCourseModules(courseId: string): Promise<CourseModule[]> {
  const { data, error } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching modules:', error)
    throw error
  }

  return (data || []).map(mapModule)
}

export async function getModuleById(moduleId: string): Promise<CourseModule | null> {
  const { data, error } = await supabase
    .from('course_modules')
    .select('*')
    .eq('id', moduleId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching module:', error)
    throw error
  }

  return data ? mapModule(data) : null
}

// ============================================
// PROGRESS
// ============================================

export async function getUserCourseProgress(courseId: string): Promise<UserCourseProgress | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_course_progress')
    .select('*')
    .eq('course_id', courseId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching progress:', error)
    throw error
  }

  return data ? mapCourseProgress(data) : null
}

export async function getUserAllCoursesProgress(): Promise<UserCourseProgress[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('user_course_progress')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching all progress:', error)
    throw error
  }

  return (data || []).map(mapCourseProgress)
}

export async function startCourse(courseId: string): Promise<UserCourseProgress> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Get first module
  const { data: modules } = await supabase
    .from('course_modules')
    .select('id')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true })
    .limit(1)

  const firstModuleId = modules?.[0]?.id || null

  const { data, error } = await supabase
    .from('user_course_progress')
    .upsert({
      user_id: user.id,
      course_id: courseId,
      current_module_id: firstModuleId,
      progress_percent: 0,
      started_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,course_id'
    })
    .select()
    .single()

  if (error) {
    console.error('Error starting course:', error)
    throw error
  }

  // Increment students count
  await supabase.rpc('increment_course_students', { course_id: courseId })

  return mapCourseProgress(data)
}

export async function updateModuleProgress(
  moduleId: string,
  status: 'in_progress' | 'completed',
  score?: number
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const updateData: Record<string, unknown> = {
    user_id: user.id,
    module_id: moduleId,
    status
  }

  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString()
    if (score !== undefined) {
      updateData.score = score
    }
  }

  const { error } = await supabase
    .from('user_module_progress')
    .upsert(updateData, {
      onConflict: 'user_id,module_id'
    })

  if (error) {
    console.error('Error updating module progress:', error)
    throw error
  }
}

export async function updateCourseProgress(
  courseId: string,
  progressPercent: number,
  currentModuleId?: string
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const updateData: Record<string, unknown> = {
    progress_percent: progressPercent
  }

  if (currentModuleId) {
    updateData.current_module_id = currentModuleId
  }

  if (progressPercent === 100) {
    updateData.completed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('user_course_progress')
    .update(updateData)
    .eq('user_id', user.id)
    .eq('course_id', courseId)

  if (error) {
    console.error('Error updating course progress:', error)
    throw error
  }
}

// ============================================
// CERTIFICATES
// ============================================

export async function getUserCertificates(): Promise<Certificate[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('certificates')
    .select(`
      *,
      course:courses(title, slug, level, category)
    `)
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false })

  if (error) {
    console.error('Error fetching certificates:', error)
    throw error
  }

  return (data || []).map(mapCertificate)
}

// ============================================
// AI TUTOR
// ============================================

interface AITutorResponse {
  answer: string
  tokensUsed: number
  model: string
}

export async function sendTutorMessage(
  question: string,
  courseId: string,
  courseName: string,
  moduleId?: string,
  moduleName?: string,
  previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<AITutorResponse> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('User not authenticated')

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question,
        courseId,
        courseName,
        moduleId,
        moduleName,
        previousMessages
      })
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to get tutor response')
  }

  return response.json()
}

export async function rateTutorInteraction(
  interactionId: string,
  rating: number
): Promise<void> {
  const { error } = await supabase
    .from('ai_tutor_interactions')
    .update({ rating })
    .eq('id', interactionId)

  if (error) {
    console.error('Error rating interaction:', error)
    throw error
  }
}

// ============================================
// MAPPERS
// ============================================

function mapCourse(data: Record<string, unknown>): Course {
  return {
    id: data.id as string,
    slug: data.slug as string,
    title: data.title as string,
    description: data.description as string | undefined,
    level: data.level as number,
    category: data.category as string,
    area: data.area as string,
    thumbnailUrl: data.thumbnail_url as string | undefined,
    durationMinutes: data.duration_minutes as number,
    modulesCount: data.modules_count as number,
    studentsCount: data.students_count as number,
    aiTutorEnabled: data.ai_tutor_enabled as boolean,
    isActive: data.is_active as boolean,
    sortOrder: data.sort_order as number,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string
  }
}

function mapModule(data: Record<string, unknown>): CourseModule {
  return {
    id: data.id as string,
    courseId: data.course_id as string,
    slug: data.slug as string,
    title: data.title as string,
    description: data.description as string | undefined,
    contentType: data.content_type as 'video' | 'text' | 'quiz' | 'exercise' | 'ai_exercise',
    contentUrl: data.content_url as string | undefined,
    durationMinutes: data.duration_minutes as number,
    sortOrder: data.sort_order as number,
    createdAt: data.created_at as string
  }
}

function mapCourseProgress(data: Record<string, unknown>): UserCourseProgress {
  return {
    id: data.id as string,
    userId: data.user_id as string,
    courseId: data.course_id as string,
    currentModuleId: data.current_module_id as string | undefined,
    progressPercent: data.progress_percent as number,
    startedAt: data.started_at as string,
    completedAt: data.completed_at as string | undefined
  }
}

function mapCertificate(data: Record<string, unknown>): Certificate {
  const course = data.course as Record<string, unknown> | undefined
  return {
    id: data.id as string,
    userId: data.user_id as string,
    courseId: data.course_id as string,
    certificateNumber: data.certificate_number as string,
    issuedAt: data.issued_at as string,
    pdfUrl: data.pdf_url as string | undefined,
    course: course ? {
      title: course.title as string,
      slug: course.slug as string,
      level: course.level as number,
      category: course.category as string
    } : undefined
  }
}

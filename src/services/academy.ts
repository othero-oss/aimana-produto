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

  const firstModuleId = (modules as Array<{ id: string }> | null)?.[0]?.id || null

  const progressData = {
    user_id: user.id,
    course_id: courseId,
    current_module_id: firstModuleId,
    progress_percent: 0,
    started_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('user_course_progress')
    .upsert(progressData as never, {
      onConflict: 'user_id,course_id'
    })
    .select()
    .single()

  if (error) {
    console.error('Error starting course:', error)
    throw error
  }

  // Increment students count (ignore if RPC doesn't exist)
  try {
    await supabase.rpc('increment_course_students', { p_course_id: courseId } as never)
  } catch {
    // RPC might not exist yet
  }

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
    .upsert(updateData as never, {
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
    .update(updateData as never)
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
    .update({ rating } as never)
    .eq('id', interactionId)

  if (error) {
    console.error('Error rating interaction:', error)
    throw error
  }
}

// ============================================
// MAPPERS
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCourse(data: any): Course {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description ?? null,
    level: data.level,
    category: data.category ?? null,
    area: data.area,
    thumbnailUrl: data.thumbnail_url ?? null,
    durationMinutes: data.duration_minutes,
    modulesCount: data.modules_count,
    studentsCount: data.students_count,
    aiTutorEnabled: data.ai_tutor_enabled,
    aiTutorContext: data.ai_tutor_context ?? null,
    isActive: data.is_active,
    sortOrder: data.sort_order,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapModule(data: any): CourseModule {
  return {
    id: data.id,
    courseId: data.course_id,
    slug: data.slug,
    title: data.title,
    description: data.description ?? null,
    contentType: data.content_type,
    contentUrl: data.content_url ?? null,
    videoTranscript: data.video_transcript ?? null,
    aiSummary: data.ai_summary ?? null,
    exercisePrompt: data.exercise_prompt ?? null,
    durationMinutes: data.duration_minutes,
    sortOrder: data.sort_order,
    createdAt: data.created_at
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCourseProgress(data: any): UserCourseProgress {
  return {
    id: data.id,
    userId: data.user_id,
    courseId: data.course_id,
    currentModuleId: data.current_module_id ?? null,
    progressPercent: data.progress_percent,
    startedAt: data.started_at,
    completedAt: data.completed_at ?? null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCertificate(data: any): Certificate {
  const course = data.course
  return {
    id: data.id,
    userId: data.user_id,
    courseId: data.course_id,
    certificateNumber: data.certificate_number,
    issuedAt: data.issued_at,
    pdfUrl: data.pdf_url ?? null,
    course: course ? {
      title: course.title,
      slug: course.slug,
      level: course.level,
      category: course.category
    } : undefined
  }
}

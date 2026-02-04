// AIMANA AI Tutor Edge Function
// Uses Claude API for intelligent tutoring

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.24.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TutorRequest {
  question: string
  courseId: string
  courseName: string
  moduleId?: string
  moduleName?: string
  previousMessages?: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')

    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const body: TutorRequest = await req.json()
    const { question, courseId, courseName, moduleId, moduleName, previousMessages = [] } = body

    if (!question || !courseId) {
      throw new Error('Missing required fields: question, courseId')
    }

    // Get course context from database
    const { data: course } = await supabase
      .from('courses')
      .select('ai_tutor_context, title, description')
      .eq('id', courseId)
      .single()

    // Get module context if available
    let moduleContext = ''
    if (moduleId) {
      const { data: module } = await supabase
        .from('course_modules')
        .select('title, description, video_transcript, ai_summary')
        .eq('id', moduleId)
        .single()

      if (module) {
        moduleContext = `
Módulo atual: ${module.title}
Descrição do módulo: ${module.description || 'N/A'}
${module.ai_summary ? `Resumo do conteúdo: ${module.ai_summary}` : ''}
${module.video_transcript ? `Transcrição (resumo): ${module.video_transcript.substring(0, 2000)}...` : ''}
`
      }
    }

    // Build system prompt
    const systemPrompt = `Você é o Tutor IA da AIMANA, um assistente educacional especializado em ajudar profissionais a aprender sobre Inteligência Artificial aplicada aos negócios.

CONTEXTO DO CURSO:
Curso: ${courseName}
${course?.description ? `Descrição: ${course.description}` : ''}
${course?.ai_tutor_context ? `Contexto específico: ${course.ai_tutor_context}` : ''}
${moduleContext}

DIRETRIZES:
1. Seja didático e acessível - evite jargões técnicos desnecessários
2. Use exemplos práticos e relevantes para o contexto empresarial brasileiro
3. Incentive a reflexão e aplicação prática
4. Mantenha respostas concisas mas completas (máximo 3 parágrafos)
5. Se o aluno parecer confuso, ofereça explicar de uma forma diferente
6. Sugira exercícios práticos quando apropriado
7. Sempre relacione os conceitos com o conteúdo do curso atual
8. Seja encorajador e positivo, mas honesto sobre limitações

FORMATO DE RESPOSTA:
- Use markdown para formatação (negrito, listas, etc)
- Separe conceitos complexos em tópicos
- Termine com uma pergunta ou sugestão de próximo passo quando relevante`

    // Build messages array
    const messages = [
      ...previousMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: question }
    ]

    // Call Claude API
    const anthropic = new Anthropic({ apiKey: anthropicApiKey })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages
    })

    const answer = response.content[0].type === 'text'
      ? response.content[0].text
      : ''

    const tokensUsed = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)

    // Save interaction to database
    const { error: insertError } = await supabase
      .from('ai_tutor_interactions')
      .insert({
        user_id: user.id,
        course_id: courseId,
        module_id: moduleId || null,
        question: question,
        answer: answer,
        model_used: 'claude-sonnet-4-5-20250929',
        tokens_used: tokensUsed
      })

    if (insertError) {
      console.error('Error saving interaction:', insertError)
    }

    return new Response(
      JSON.stringify({
        answer,
        tokensUsed,
        model: 'claude-sonnet-4-5-20250929'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('AI Tutor error:', error)

    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred',
        answer: 'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente em alguns instantes.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 500
      }
    )
  }
})

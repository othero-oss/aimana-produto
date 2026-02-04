-- ============================================
-- AIMANA Platform - Academy Schema Migration
-- ============================================

-- ============================================
-- COURSES
-- ============================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level INTEGER DEFAULT 1,               -- 1=No-Code, 2=Low-Code, 3=Code
  category VARCHAR(50),                  -- 'foundation', 'champion', 'area', 'coder'
  area VARCHAR(50) DEFAULT 'geral',      -- 'geral', 'rh', 'vendas', 'marketing', 'ti', etc.
  thumbnail_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  modules_count INTEGER DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  ai_tutor_enabled BOOLEAN DEFAULT TRUE,
  ai_tutor_context TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COURSE MODULES
-- ============================================
CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  slug VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) DEFAULT 'video', -- 'video', 'text', 'quiz', 'exercise', 'ai_exercise'
  content_url TEXT,
  video_transcript TEXT,
  ai_summary TEXT,
  exercise_prompt TEXT,
  duration_minutes INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROGRESS TRACKING
-- ============================================
CREATE TABLE user_course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  current_module_id UUID REFERENCES course_modules(id),
  progress_percent INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

CREATE TABLE user_module_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  score INTEGER,
  time_spent_minutes INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, module_id)
);

-- ============================================
-- CERTIFICATES
-- ============================================
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number VARCHAR(50) UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  pdf_url TEXT,
  UNIQUE(user_id, course_id)
);

-- ============================================
-- AI TUTOR INTERACTIONS
-- ============================================
CREATE TABLE ai_tutor_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  model_used VARCHAR(50) DEFAULT 'claude-sonnet-4-5-20250929',
  tokens_used INTEGER,
  rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER SKILLS
-- ============================================
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_level INTEGER DEFAULT 0,
  assessed_at TIMESTAMPTZ DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'course',
  UNIQUE(user_id, skill_name)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_area ON courses(area);
CREATE INDEX idx_modules_course ON course_modules(course_id);
CREATE INDEX idx_progress_user ON user_course_progress(user_id);
CREATE INDEX idx_progress_course ON user_course_progress(course_id);
CREATE INDEX idx_module_progress_user ON user_module_progress(user_id);
CREATE INDEX idx_tutor_user ON ai_tutor_interactions(user_id);
CREATE INDEX idx_tutor_course ON ai_tutor_interactions(course_id);
CREATE INDEX idx_skills_user ON user_skills(user_id);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tutor_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

-- Courses: all authenticated users can read
CREATE POLICY "courses_select" ON courses
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "modules_select" ON course_modules
  FOR SELECT USING (auth.role() = 'authenticated');

-- Progress: users can only see/manage their own
CREATE POLICY "course_progress_all" ON user_course_progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "module_progress_all" ON user_module_progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "certificates_select" ON certificates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "tutor_interactions_all" ON ai_tutor_interactions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "skills_all" ON user_skills
  FOR ALL USING (user_id = auth.uid());

-- ============================================
-- SEED DATA - Sample Courses
-- ============================================
INSERT INTO courses (slug, title, description, level, category, area, duration_minutes, modules_count, ai_tutor_context) VALUES
('fundamentos-ia', 'Fundamentos de IA para Negócios', 'Entenda os conceitos básicos de Inteligência Artificial e como aplicá-los no seu dia a dia profissional.', 1, 'foundation', 'geral', 120, 6, 'Este curso aborda os fundamentos de IA para profissionais de negócios. Foque em explicações práticas e exemplos do mundo corporativo.'),
('prompts-avancados', 'Prompts Avançados com ChatGPT', 'Domine técnicas avançadas de engenharia de prompts para extrair o máximo das IAs generativas.', 1, 'foundation', 'geral', 90, 5, 'Curso focado em técnicas de prompt engineering. Ajude com exemplos práticos de prompts e melhores práticas.'),
('ia-para-vendas', 'IA para Times de Vendas', 'Aprenda a usar IA para prospecção, qualificação de leads e fechamento de negócios.', 1, 'area', 'vendas', 150, 8, 'Curso específico para vendas. Foque em casos de uso como prospecção, CRM, e automação de follow-ups.'),
('ia-para-marketing', 'IA para Marketing Digital', 'Crie conteúdo, analise dados e otimize campanhas usando ferramentas de IA.', 1, 'area', 'marketing', 180, 10, 'Curso de IA para marketing. Aborde criação de conteúdo, análise de métricas, e automação de campanhas.'),
('ia-para-rh', 'IA para Recursos Humanos', 'Transforme processos de RH com IA: recrutamento, onboarding, e desenvolvimento.', 1, 'area', 'rh', 120, 6, 'Curso de IA para RH. Foque em recrutamento, análise de candidatos, e desenvolvimento de pessoas.'),
('automacao-zapier', 'Automação com Zapier e Make', 'Conecte aplicativos e automatize fluxos de trabalho sem programar.', 2, 'champion', 'geral', 180, 8, 'Curso de automação low-code. Ajude com integrações entre ferramentas e criação de workflows.'),
('agentes-ia', 'Construindo Agentes de IA', 'Aprenda a criar agentes autônomos que executam tarefas complexas.', 3, 'coder', 'ti', 240, 12, 'Curso avançado de agentes de IA. Foque em arquitetura de agentes, ferramentas, e casos de uso empresariais.'),
('governanca-ia', 'Governança e Ética em IA', 'Implemente políticas de uso responsável de IA na sua organização.', 1, 'champion', 'geral', 90, 5, 'Curso sobre governança de IA. Aborde políticas, riscos, compliance e melhores práticas.');

-- Insert modules for first course
INSERT INTO course_modules (course_id, slug, title, description, content_type, duration_minutes, sort_order)
SELECT
  c.id,
  m.slug,
  m.title,
  m.description,
  m.content_type,
  m.duration_minutes,
  m.sort_order
FROM courses c
CROSS JOIN (
  VALUES
    ('intro-ia', 'O que é Inteligência Artificial?', 'Entenda os conceitos fundamentais e a história da IA.', 'video', 15, 1),
    ('tipos-ia', 'Tipos de IA: Narrow, General e Super', 'Conheça as diferentes categorias de inteligência artificial.', 'video', 20, 2),
    ('ia-generativa', 'IA Generativa e LLMs', 'Como funcionam os modelos de linguagem como GPT e Claude.', 'video', 25, 3),
    ('casos-uso', 'Casos de Uso em Empresas', 'Exemplos práticos de aplicação de IA em diferentes setores.', 'video', 20, 4),
    ('quiz-fundamentos', 'Quiz: Teste seus Conhecimentos', 'Avalie o que você aprendeu sobre fundamentos de IA.', 'quiz', 15, 5),
    ('exercicio-pratico', 'Exercício: Seu Primeiro Prompt', 'Pratique criando prompts efetivos com ajuda do Tutor IA.', 'ai_exercise', 25, 6)
) AS m(slug, title, description, content_type, duration_minutes, sort_order)
WHERE c.slug = 'fundamentos-ia';

-- Insert modules for prompts course
INSERT INTO course_modules (course_id, slug, title, description, content_type, duration_minutes, sort_order)
SELECT
  c.id,
  m.slug,
  m.title,
  m.description,
  m.content_type,
  m.duration_minutes,
  m.sort_order
FROM courses c
CROSS JOIN (
  VALUES
    ('anatomia-prompt', 'Anatomia de um Bom Prompt', 'Os elementos essenciais para criar prompts efetivos.', 'video', 15, 1),
    ('tecnicas-basicas', 'Técnicas Básicas de Prompting', 'Zero-shot, few-shot e chain-of-thought explicados.', 'video', 20, 2),
    ('prompts-contexto', 'Usando Contexto e Personas', 'Como definir contexto e criar personas para melhores resultados.', 'video', 20, 3),
    ('exercicio-prompts', 'Exercício: Criando Prompts Avançados', 'Pratique as técnicas aprendidas com feedback do Tutor IA.', 'ai_exercise', 20, 4),
    ('quiz-prompts', 'Quiz Final', 'Teste seus conhecimentos em engenharia de prompts.', 'quiz', 15, 5)
) AS m(slug, title, description, content_type, duration_minutes, sort_order)
WHERE c.slug = 'prompts-avancados';

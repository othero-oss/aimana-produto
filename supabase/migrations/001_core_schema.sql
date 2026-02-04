-- ============================================
-- AIMANA Platform - Core Schema Migration
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- COMPANIES
-- ============================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18),
  sector VARCHAR(100),
  size VARCHAR(50),          -- '1-50', '51-200', '201-1000', '1000+'
  logo_url TEXT,
  plan VARCHAR(50) DEFAULT 'starter', -- 'starter', 'professional', 'enterprise'
  ai_usage_status VARCHAR(50) DEFAULT 'unknown', -- 'structured', 'shadow_ai', 'none', 'unknown'
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',     -- 'admin', 'manager', 'champion', 'user'
  department VARCHAR(100),
  position VARCHAR(100),
  avatar_url TEXT,
  ai_level INTEGER DEFAULT 0,          -- 0=none, 1=no-code, 2=low-code, 3=coder
  onboarding_completed BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- HELPER FUNCTION FOR RLS
-- ============================================
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Companies: users can only see their own company
CREATE POLICY "company_select" ON companies
  FOR SELECT USING (id = get_user_company_id());

CREATE POLICY "company_update" ON companies
  FOR UPDATE USING (id = get_user_company_id());

-- Users: can see users from their company
CREATE POLICY "users_select" ON users
  FOR SELECT USING (company_id = get_user_company_id() OR id = auth.uid());

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "users_insert" ON users
  FOR INSERT WITH CHECK (id = auth.uid());

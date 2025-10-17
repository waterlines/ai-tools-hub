-- Users table (managed by NextAuth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMP WITH TIME ZONE,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table (for OAuth providers)
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification tokens
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Tools Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Tools table
CREATE TABLE IF NOT EXISTS ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  website_url TEXT,
  logo_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  pricing_type TEXT DEFAULT 'free', -- free, freemium, paid
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES ai_tools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- AI Model Requests (for Replicate usage tracking)
CREATE TABLE IF NOT EXISTS ai_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  model_name TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_tools_category_id ON ai_tools(category_id);
CREATE INDEX IF NOT EXISTS idx_ai_tools_slug ON ai_tools(slug);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_tool_id ON favorites(tool_id);
CREATE INDEX IF NOT EXISTS idx_ai_requests_user_id ON ai_requests(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own data
CREATE POLICY users_select_own ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_update_own ON users FOR UPDATE USING (auth.uid() = id);

-- Accounts policies
CREATE POLICY accounts_select_own ON accounts FOR SELECT USING (auth.uid() = user_id);

-- Sessions policies
CREATE POLICY sessions_select_own ON sessions FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY subscriptions_select_own ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY favorites_select_own ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY favorites_insert_own ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY favorites_delete_own ON favorites FOR DELETE USING (auth.uid() = user_id);

-- AI Requests policies
CREATE POLICY ai_requests_select_own ON ai_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY ai_requests_insert_own ON ai_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for categories and ai_tools
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY categories_select_all ON categories FOR SELECT USING (true);
CREATE POLICY ai_tools_select_all ON ai_tools FOR SELECT USING (true);

-- Insert sample data
INSERT INTO categories (name, slug, description, icon) VALUES
  ('图像生成', 'image-generation', 'AI 图像生成和编辑工具', '🎨'),
  ('文本生成', 'text-generation', 'AI 文本和内容创作工具', '✍️'),
  ('视频处理', 'video-processing', 'AI 视频生成和编辑工具', '🎬'),
  ('音频处理', 'audio-processing', 'AI 音频和语音处理工具', '🎵'),
  ('代码助手', 'code-assistant', 'AI 编程和代码辅助工具', '💻'),
  ('数据分析', 'data-analysis', 'AI 数据分析和可视化工具', '📊')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample AI tools
INSERT INTO ai_tools (name, slug, description, long_description, website_url, logo_url, category_id, pricing_type, is_featured, tags) 
SELECT 
  'Midjourney',
  'midjourney',
  '强大的 AI 图像生成工具',
  'Midjourney 是一款领先的 AI 图像生成工具，能够根据文本描述创建高质量的艺术作品和图像。',
  'https://www.midjourney.com',
  'https://placehold.co/100x100/6366f1/white?text=MJ',
  (SELECT id FROM categories WHERE slug = 'image-generation'),
  'paid',
  true,
  ARRAY['图像生成', 'AI艺术', '创意设计']
ON CONFLICT (slug) DO NOTHING;

INSERT INTO ai_tools (name, slug, description, long_description, website_url, logo_url, category_id, pricing_type, is_featured, tags)
SELECT
  'ChatGPT',
  'chatgpt',
  '强大的对话式 AI 助手',
  'ChatGPT 是 OpenAI 开发的大型语言模型，能够进行自然对话、回答问题、编写代码等多种任务。',
  'https://chat.openai.com',
  'https://placehold.co/100x100/10a37f/white?text=GPT',
  (SELECT id FROM categories WHERE slug = 'text-generation'),
  'freemium',
  true,
  ARRAY['对话AI', '文本生成', '代码助手']
ON CONFLICT (slug) DO NOTHING;

INSERT INTO ai_tools (name, slug, description, long_description, website_url, logo_url, category_id, pricing_type, is_featured, tags)
SELECT
  'GitHub Copilot',
  'github-copilot',
  'AI 编程助手',
  'GitHub Copilot 是一款 AI 驱动的代码补全工具，能够帮助开发者更快地编写代码。',
  'https://github.com/features/copilot',
  'https://placehold.co/100x100/24292e/white?text=GH',
  (SELECT id FROM categories WHERE slug = 'code-assistant'),
  'paid',
  true,
  ARRAY['代码补全', '编程助手', '开发工具']
ON CONFLICT (slug) DO NOTHING;

INSERT INTO ai_tools (name, slug, description, long_description, website_url, logo_url, category_id, pricing_type, tags)
SELECT
  'Runway',
  'runway',
  'AI 视频生成和编辑平台',
  'Runway 提供强大的 AI 视频生成、编辑和特效工具，让视频创作变得更加简单。',
  'https://runwayml.com',
  'https://placehold.co/100x100/8b5cf6/white?text=RW',
  (SELECT id FROM categories WHERE slug = 'video-processing'),
  'freemium',
  ARRAY['视频生成', '视频编辑', 'AI特效']
ON CONFLICT (slug) DO NOTHING;

INSERT INTO ai_tools (name, slug, description, long_description, website_url, logo_url, category_id, pricing_type, tags)
SELECT
  'ElevenLabs',
  'elevenlabs',
  'AI 语音合成工具',
  'ElevenLabs 提供高质量的 AI 语音合成服务，支持多种语言和声音风格。',
  'https://elevenlabs.io',
  'https://placehold.co/100x100/ec4899/white?text=11',
  (SELECT id FROM categories WHERE slug = 'audio-processing'),
  'freemium',
  ARRAY['语音合成', 'TTS', '音频生成']
ON CONFLICT (slug) DO NOTHING;

INSERT INTO ai_tools (name, slug, description, long_description, website_url, logo_url, category_id, pricing_type, tags)
SELECT
  'Tableau AI',
  'tableau-ai',
  'AI 驱动的数据分析平台',
  'Tableau AI 结合了强大的数据可视化和 AI 分析能力，帮助用户快速洞察数据。',
  'https://www.tableau.com',
  'https://placehold.co/100x100/0ea5e9/white?text=TB',
  (SELECT id FROM categories WHERE slug = 'data-analysis'),
  'paid',
  ARRAY['数据可视化', '商业智能', 'AI分析']
ON CONFLICT (slug) DO NOTHING;


-- Virality Analyzer Initial Schema Migration
-- This migration sets up the complete database structure for the application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  credits_remaining INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analyses table
CREATE TABLE public.analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'video', 'mixed')),
  content_data JSONB NOT NULL,
  platforms TEXT[] NOT NULL,
  overall_virality_score INTEGER CHECK (overall_virality_score >= 0 AND overall_virality_score <= 100),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create platform insights table
CREATE TABLE public.platform_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'instagram', 'tiktok', 'youtube', 'linkedin')),
  virality_score INTEGER CHECK (virality_score >= 0 AND virality_score <= 100),
  engagement_prediction JSONB,
  optimal_posting_time TIMESTAMP WITH TIME ZONE,
  recommended_hashtags TEXT[],
  content_suggestions TEXT[],
  trend_alignment_score INTEGER CHECK (trend_alignment_score >= 0 AND trend_alignment_score <= 100),
  audience_match_score INTEGER CHECK (audience_match_score >= 0 AND audience_match_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trending topics table (public read)
CREATE TABLE public.trending_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'instagram', 'tiktok', 'youtube', 'linkedin')),
  topic TEXT NOT NULL,
  hashtags TEXT[],
  engagement_volume INTEGER,
  trend_score INTEGER CHECK (trend_score >= 0 AND trend_score <= 100),
  category TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  preferred_platforms TEXT[] DEFAULT '{}',
  default_audience_demographics JSONB,
  notification_settings JSONB DEFAULT '{"email": true, "push": false}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage analytics table
CREATE TABLE public.usage_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX idx_analyses_status ON public.analyses(status);
CREATE INDEX idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX idx_platform_insights_analysis_id ON public.platform_insights(analysis_id);
CREATE INDEX idx_platform_insights_platform ON public.platform_insights(platform);
CREATE INDEX idx_trending_topics_platform ON public.trending_topics(platform);
CREATE INDEX idx_trending_topics_expires_at ON public.trending_topics(expires_at);
CREATE INDEX idx_usage_analytics_user_id ON public.usage_analytics(user_id);
CREATE INDEX idx_usage_analytics_action ON public.usage_analytics(action);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for analyses
CREATE POLICY "Users can view own analyses" ON public.analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analyses" ON public.analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses" ON public.analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses" ON public.analyses
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for platform insights
CREATE POLICY "Users can view insights for own analyses" ON public.platform_insights
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.analyses 
      WHERE analyses.id = platform_insights.analysis_id 
      AND analyses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert insights for own analyses" ON public.platform_insights
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.analyses 
      WHERE analyses.id = platform_insights.analysis_id 
      AND analyses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update insights for own analyses" ON public.platform_insights
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.analyses 
      WHERE analyses.id = platform_insights.analysis_id 
      AND analyses.user_id = auth.uid()
    )
  );

-- RLS Policies for trending topics (public read)
CREATE POLICY "Anyone can view trending topics" ON public.trending_topics
  FOR SELECT USING (true);

-- RLS Policies for user preferences
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for usage analytics
CREATE POLICY "Users can create own analytics" ON public.usage_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own analytics" ON public.usage_analytics
  FOR SELECT USING (auth.uid() = user_id);

-- Functions

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create default user preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update profile updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement user credits
CREATE OR REPLACE FUNCTION public.decrement_user_credits(user_uuid UUID, credit_cost INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT credits_remaining INTO current_credits
  FROM public.profiles
  WHERE id = user_uuid;
  
  IF current_credits >= credit_cost THEN
    UPDATE public.profiles
    SET credits_remaining = credits_remaining - credit_cost
    WHERE id = user_uuid;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user analytics summary
CREATE OR REPLACE FUNCTION public.get_user_analytics_summary(user_uuid UUID)
RETURNS TABLE (
  total_analyses BIGINT,
  completed_analyses BIGINT,
  average_virality_score NUMERIC,
  most_used_platform TEXT,
  credits_remaining INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(a.id) as total_analyses,
    COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_analyses,
    COALESCE(AVG(a.overall_virality_score), 0) as average_virality_score,
    (
      SELECT platform 
      FROM public.platform_insights pi 
      JOIN public.analyses a2 ON pi.analysis_id = a2.id 
      WHERE a2.user_id = user_uuid 
      GROUP BY platform 
      ORDER BY COUNT(*) DESC 
      LIMIT 1
    ) as most_used_platform,
    p.credits_remaining
  FROM public.analyses a
  RIGHT JOIN public.profiles p ON p.id = user_uuid
  WHERE a.user_id = user_uuid OR a.user_id IS NULL
  GROUP BY p.credits_remaining;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert some sample trending topics for demonstration
INSERT INTO public.trending_topics (platform, topic, hashtags, engagement_volume, trend_score, category, expires_at)
VALUES 
  ('twitter', 'AI Revolution', ARRAY['#AI', '#ArtificialIntelligence', '#Tech'], 15000, 85, 'Technology', NOW() + INTERVAL '7 days'),
  ('instagram', 'Sustainable Living', ARRAY['#SustainableLiving', '#EcoFriendly', '#GreenLife'], 8500, 78, 'Lifestyle', NOW() + INTERVAL '5 days'),
  ('tiktok', 'Creative Cooking', ARRAY['#CookingHacks', '#FoodPrep', '#Recipe'], 25000, 92, 'Food', NOW() + INTERVAL '3 days'),
  ('youtube', 'Productivity Tips', ARRAY['#Productivity', '#TimeManagement', '#Efficiency'], 12000, 74, 'Education', NOW() + INTERVAL '10 days'),
  ('linkedin', 'Remote Work Best Practices', ARRAY['#RemoteWork', '#WorkFromHome', '#Productivity'], 9500, 81, 'Professional', NOW() + INTERVAL '14 days');

-- Comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.analyses IS 'Content analyses created by users';
COMMENT ON TABLE public.platform_insights IS 'Platform-specific insights for each analysis';
COMMENT ON TABLE public.trending_topics IS 'Current trending topics across platforms';
COMMENT ON TABLE public.user_preferences IS 'User preferences and settings';
COMMENT ON TABLE public.usage_analytics IS 'User activity tracking for analytics';

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates profile and preferences when user signs up';
COMMENT ON FUNCTION public.decrement_user_credits(UUID, INTEGER) IS 'Safely decrements user credits with validation';
COMMENT ON FUNCTION public.get_user_analytics_summary(UUID) IS 'Returns comprehensive analytics summary for a user';

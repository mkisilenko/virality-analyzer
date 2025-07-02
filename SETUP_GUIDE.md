# 🚀 Quick Setup Guide

Follow these steps to get your Virality Analyzer running:

## Step 1: Create Environment File
Create a file called `.env.local` in your project root (same level as package.json) with this content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI Configuration  
OPENAI_API_KEY=your-openai-api-key-here

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Virality Analyzer"
```

## Step 2: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → API 
4. Copy your:
   - **Project URL** (replace `https://your-project-id.supabase.co`)
   - **Anon key** (replace `your-anon-key-here`)

## Step 3: Get OpenAI API Key (Optional for now)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account and get an API key
3. Replace `your-openai-api-key-here` in your `.env.local`

## Step 4: Set up Database

In your Supabase project:
1. Go to SQL Editor
2. Run this SQL code:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  credits_remaining INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 5: Enable Google OAuth

1. In Supabase → Authentication → Settings
2. Enable Google provider
3. Add your site URL: `http://localhost:3000`

## Step 6: Start the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

**Need help?** Check the full README.md for detailed instructions! 
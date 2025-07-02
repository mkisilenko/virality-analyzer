-- Seed data for Virality Analyzer
-- This file contains sample data for testing and development

-- Insert additional trending topics
INSERT INTO public.trending_topics (platform, topic, hashtags, engagement_volume, trend_score, category, expires_at) VALUES
-- Twitter trends
('twitter', 'Blockchain Revolution', ARRAY['#Blockchain', '#Crypto', '#Web3'], 22000, 89, 'Technology', NOW() + INTERVAL '6 days'),
('twitter', 'Climate Action', ARRAY['#ClimateChange', '#Sustainability', '#GreenEnergy'], 18500, 82, 'Environment', NOW() + INTERVAL '8 days'),
('twitter', 'Mental Health Awareness', ARRAY['#MentalHealth', '#SelfCare', '#Mindfulness'], 16000, 76, 'Health', NOW() + INTERVAL '12 days'),

-- Instagram trends  
('instagram', 'Minimalist Lifestyle', ARRAY['#Minimalism', '#SimpleLife', '#LessIsMore'], 13500, 84, 'Lifestyle', NOW() + INTERVAL '9 days'),
('instagram', 'Workout Motivation', ARRAY['#FitnessMotivation', '#WorkoutRoutine', '#HealthyLife'], 19000, 88, 'Fitness', NOW() + INTERVAL '4 days'),
('instagram', 'Travel Photography', ARRAY['#TravelPhotography', '#Wanderlust', '#ExploreMore'], 24000, 91, 'Travel', NOW() + INTERVAL '11 days'),

-- TikTok trends
('tiktok', 'Dance Challenge', ARRAY['#DanceChallenge', '#TikTokDance', '#Viral'], 45000, 95, 'Entertainment', NOW() + INTERVAL '2 days'),
('tiktok', 'Life Hacks', ARRAY['#LifeHacks', '#Tips', '#Productivity'], 32000, 87, 'Education', NOW() + INTERVAL '7 days'),
('tiktok', 'Pet Videos', ARRAY['#PetsOfTikTok', '#DogsOfTikTok', '#CatsOfTikTok'], 38000, 93, 'Pets', NOW() + INTERVAL '15 days'),

-- YouTube trends
('youtube', 'Tech Reviews', ARRAY['#TechReview', '#Gadgets', '#Technology'], 14000, 79, 'Technology', NOW() + INTERVAL '13 days'),
('youtube', 'Cooking Tutorials', ARRAY['#Cooking', '#Recipe', '#Food'], 17500, 83, 'Food', NOW() + INTERVAL '6 days'),
('youtube', 'Educational Content', ARRAY['#Education', '#Learning', '#Tutorial'], 11000, 75, 'Education', NOW() + INTERVAL '20 days'),

-- LinkedIn trends
('linkedin', 'AI in Business', ARRAY['#ArtificialIntelligence', '#Business', '#Innovation'], 8500, 86, 'Professional', NOW() + INTERVAL '16 days'),
('linkedin', 'Leadership Skills', ARRAY['#Leadership', '#Management', '#CareerGrowth'], 7200, 78, 'Professional', NOW() + INTERVAL '18 days'),
('linkedin', 'Digital Transformation', ARRAY['#DigitalTransformation', '#Technology', '#Business'], 9800, 84, 'Technology', NOW() + INTERVAL '14 days');

-- Note: User profiles and analyses will be created automatically when users sign up and use the app
-- The triggers and functions in the migration will handle user data creation 
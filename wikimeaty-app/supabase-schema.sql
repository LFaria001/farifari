-- Wiki Meaty Database Schema
-- Run this in your Supabase SQL Editor

-- Meat cuts table
CREATE TABLE meat_cuts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  animal TEXT NOT NULL CHECK (animal IN ('beef', 'pork', 'lamb', 'chicken', 'game', 'other')),
  description TEXT NOT NULL,
  cooking_methods TEXT[] DEFAULT '{}',
  tips TEXT[] DEFAULT '{}',
  similar_cuts TEXT[] DEFAULT '{}',
  image_url TEXT,
  contributed_by UUID REFERENCES auth.users(id),
  contributor_name TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contributions (pending submissions)
CREATE TABLE contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  cut_name TEXT NOT NULL,
  animal TEXT NOT NULL,
  description TEXT NOT NULL,
  cooking_methods TEXT,
  tips TEXT,
  contributor_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE meat_cuts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Everyone can read approved cuts
CREATE POLICY "Anyone can view approved cuts"
  ON meat_cuts FOR SELECT
  USING (approved = true);

-- Authenticated users can view their own pending cuts
CREATE POLICY "Users can view their contributions"
  ON meat_cuts FOR SELECT
  USING (auth.uid() = contributed_by);

-- Authenticated users can insert contributions
CREATE POLICY "Authenticated users can submit contributions"
  ON contributions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own contributions
CREATE POLICY "Users can view their own contributions"
  ON contributions FOR SELECT
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_meat_cuts_animal ON meat_cuts(animal);
CREATE INDEX idx_meat_cuts_approved ON meat_cuts(approved);
CREATE INDEX idx_contributions_status ON contributions(status);
CREATE INDEX idx_contributions_user ON contributions(user_id);

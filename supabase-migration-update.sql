-- =====================================================
-- AI EMPIRE BUILDER – DATABASE MIGRATION UPDATE
-- =====================================================
-- Run this in your Supabase SQL Editor if you already ran the original migration
-- This updates the plan_tier column to allow NULL values (no access until payment)

-- Allow NULL values for plan_tier (users must pay to get access)
ALTER TABLE users ALTER COLUMN plan_tier DROP NOT NULL;
ALTER TABLE users ALTER COLUMN plan_tier DROP DEFAULT;

-- Update any existing users with 'starter' plan to NULL if they haven't paid
-- (This is optional - only run if you want to revoke access from users who haven't paid)
-- UPDATE users SET plan_tier = NULL WHERE plan_tier = 'starter' AND ... (add your payment verification logic here)


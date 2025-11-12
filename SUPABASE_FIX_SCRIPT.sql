-- ============================================================================
-- SUPABASE DATABASE FIX SCRIPT
-- Fix for 409 Conflict Error: Foreign Key Constraint Violation
-- ============================================================================
--
-- PROBLEM: Users table missing INSERT policy blocks profile creation
-- RESULT: Vehicles cannot be added because user_id foreign key fails
--
-- INSTRUCTIONS:
-- 1. Open your Supabase project dashboard
-- 2. Go to SQL Editor
-- 3. Create a new query
-- 4. Copy and paste this entire script
-- 5. Run the script
--
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 1: Add INSERT Policy to Users Table
-- ----------------------------------------------------------------------------
-- This allows authenticated users to create their own profile during signup

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- STEP 2: Create Missing User Profiles
-- ----------------------------------------------------------------------------
-- This fixes existing users who were created before the INSERT policy existed
-- It creates a profile in public.users for any auth.users that don't have one

INSERT INTO public.users (id, email, is_premium, created_at, updated_at)
SELECT
  au.id,
  au.email,
  false AS is_premium,
  au.created_at,
  NOW() AS updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- This should output: "INSERT 0 X" where X is the number of missing profiles created

-- ----------------------------------------------------------------------------
-- STEP 3 (OPTIONAL): Add Automatic Profile Creation Trigger
-- ----------------------------------------------------------------------------
-- This automatically creates a user profile whenever a new auth user is created
-- This is a failsafe to prevent the issue from happening again

-- Create the function that will be triggered
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, is_premium, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    false,
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, ignore
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't block auth user creation
    RAISE WARNING 'Failed to create user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- VERIFICATION QUERIES
-- ----------------------------------------------------------------------------
-- Run these queries after the script to verify everything worked:

-- 1. Check that the INSERT policy was created:
-- SELECT * FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can insert own profile';

-- 2. Check that all auth users now have profiles:
-- SELECT COUNT(*) FROM auth.users au LEFT JOIN public.users pu ON au.id = pu.id WHERE pu.id IS NULL;
-- (Should return 0)

-- 3. Check that the trigger was created:
-- SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- ============================================================================
-- AFTER RUNNING THIS SCRIPT:
-- ============================================================================
-- 1. Verify the queries above show expected results
-- 2. Return to the app and try adding a vehicle
-- 3. If issues persist, check the browser console for new errors
-- 4. The app code has been updated with additional safeguards
-- ============================================================================

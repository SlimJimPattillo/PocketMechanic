# Deployment Instructions - Fix 409 Conflict Error

## Overview
This document provides step-by-step instructions to deploy the fix for the 409 Conflict error that prevented vehicle creation due to missing user profiles.

---

## What Was Fixed

### Root Cause
The `users` table had Row Level Security (RLS) enabled but was **missing an INSERT policy**. This prevented user profiles from being created during signup, causing:
1. Users created in `auth.users` ✅
2. Profile creation in `public.users` blocked by RLS ❌
3. Foreign key constraint violation when adding vehicles ❌

### Solution Implemented
1. **Database Fix**: Added INSERT policy to allow users to create their own profiles
2. **Data Transformation**: Added conversion between database snake_case and TypeScript camelCase
3. **Profile Recovery**: Added automatic profile creation if missing when adding vehicles
4. **Error Handling**: Improved error messages and fallback mechanisms

---

## Deployment Steps

### STEP 1: Run SQL Script in Supabase (REQUIRED)

**IMPORTANT**: This must be done BEFORE testing the app!

1. Open your Supabase project dashboard: https://app.supabase.com
2. Navigate to **SQL Editor** (left sidebar)
3. Click **+ New Query**
4. Open the file `SUPABASE_FIX_SCRIPT.sql` in this directory
5. Copy the entire contents
6. Paste into the Supabase SQL Editor
7. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

**Expected Output:**
```
CREATE POLICY (1 row affected)
INSERT 0 X (where X = number of users fixed)
CREATE FUNCTION (1 row affected)
CREATE TRIGGER (1 row affected)
```

**If you see errors:**
- "policy already exists" → Safe to ignore, policy is already there
- "trigger already exists" → Safe to ignore, trigger is already there
- Any other error → Copy the error and check with developer

### STEP 2: Verify Database Changes

Run these verification queries in the SQL Editor:

```sql
-- Check INSERT policy exists
SELECT * FROM pg_policies
WHERE tablename = 'users'
AND policyname = 'Users can insert own profile';
-- Expected: 1 row returned

-- Check all auth users have profiles
SELECT COUNT(*)
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;
-- Expected: 0 (zero missing profiles)

-- Check trigger exists
SELECT * FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
-- Expected: 1 row returned
```

### STEP 3: Deploy Code Changes

The code changes have already been made to:
- `src/contexts/AuthContext.tsx` - Data transformation
- `src/screens/vehicle/VehicleSetupScreen.tsx` - Profile recovery
- Multiple documentation files

**If running locally:**
```bash
# Install any new dependencies (if needed)
npm install

# Restart the development server
# Press Ctrl+C to stop current server, then:
npm run web
# OR
npm start
```

**If deploying to production:**
```bash
# Build for production
npm run build:web

# Deploy to Vercel (or your hosting platform)
vercel deploy --prod
```

### STEP 4: Test the Fix

#### Test 1: New User Signup
1. Sign up with a new email address
2. After signup, check Supabase dashboard → **Table Editor** → `users` table
3. Verify new user profile was created automatically
4. Expected: User row exists with `is_premium = false`

#### Test 2: Add Vehicle (New User)
1. Sign in as the new user
2. Navigate to Dashboard or Vehicles tab
3. Click "Add Vehicle"
4. Fill in all required fields:
   - Make: "Toyota"
   - Model: "Camry"
   - Year: "2020"
   - Mileage: "50000"
   - Nickname: "Test Car" (optional)
5. Click "Add Vehicle"
6. **Expected**: Success modal appears with vehicle details
7. Click "View Dashboard"
8. **Expected**: Dashboard shows the vehicle

#### Test 3: Add Vehicle (Existing User Without Profile)
This tests the profile recovery logic.

1. If you have an existing user from before the fix, sign in as that user
2. Try to add a vehicle
3. **Expected**:
   - Console log: "User profile not found, attempting to create..."
   - Console log: "User profile created successfully"
   - Success modal appears
   - Vehicle is added successfully

#### Test 4: Verify Data in Database
1. Open Supabase dashboard → **Table Editor**
2. Check `vehicles` table:
   - Vehicle exists
   - `user_id` matches authenticated user
   - All fields populated correctly
3. Check `maintenance_tasks` table:
   - Multiple tasks created
   - All have `vehicle_id` matching the new vehicle

---

## What Changed in the Code

### AuthContext.tsx
**Added:**
- `DatabaseUser` interface for database row structure
- `transformDatabaseUser()` - Converts snake_case to camelCase
- `transformToDatabase()` - Converts camelCase to snake_case
- All database queries now transform data correctly

**Example:**
```typescript
// Database returns: { is_premium: false, created_at: "2025-01-01" }
// Transformed to: { isPremium: false, createdAt: "2025-01-01" }
```

### VehicleSetupScreen.tsx
**Added:**
- User profile verification before vehicle insert
- Automatic profile creation if missing
- Better error messages
- Console logging for debugging

**Flow:**
```
1. User fills form
2. Validation passes
3. Check if user profile exists in database
4. If missing → Create profile automatically
5. Insert vehicle
6. Show success modal
```

---

## Rollback Plan (If Needed)

If something goes wrong and you need to rollback:

### Rollback Code Changes
```bash
git log --oneline  # Find the commit before these changes
git revert <commit-hash>  # Revert to previous version
```

### Rollback Database Changes
**DO NOT** delete the INSERT policy or trigger unless absolutely necessary.
They are harmless and provide important safeguards.

If you must rollback database changes:
```sql
-- Remove trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Remove INSERT policy (NOT RECOMMENDED)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
```

---

## Troubleshooting

### Problem: Still getting 409 error
**Check:**
1. Did you run the SQL script in Supabase?
2. Did you verify the INSERT policy exists?
3. Did you restart the development server?
4. Check browser console for new error messages

**Solution:**
- Verify STEP 1 was completed
- Check STEP 2 verification queries
- Clear browser cache and try again

### Problem: "Profile Error" alert appears
**Meaning:** The app tried to create a user profile but failed

**Check:**
1. Supabase SQL Editor → Run verification queries
2. Browser console for detailed error
3. Supabase dashboard → **Logs** for database errors

**Common causes:**
- INSERT policy still missing
- RLS blocking the insert
- Network connectivity issue

### Problem: Success modal doesn't appear
**Check:**
1. Browser console for JavaScript errors
2. Check if vehicle was actually created in database
3. Verify `VehicleSuccessModal.tsx` was not modified

**Solution:**
- Check `showSuccessModal` state in VehicleSetupScreen
- Verify `addedVehicle` is being set correctly

### Problem: Data shows up wrong in app
**Example:** `isPremium` is undefined

**Cause:** Data transformation not working

**Check:**
1. Verify `transformDatabaseUser()` function exists in AuthContext
2. Check if `setUser(transformDatabaseUser(...))` is being called
3. Browser console → Check user object structure

---

## Additional Notes

### About the Trigger
The database trigger (`handle_new_user`) is a **failsafe** that automatically creates user profiles when auth users are created. This ensures the issue never happens again, even if there are bugs in the application code.

### About Data Transformation
PostgreSQL uses `snake_case` by convention. JavaScript/TypeScript uses `camelCase`. The transformation functions bridge this gap automatically, so you never have to worry about field names again.

### Testing Checklist
For comprehensive testing, use:
- `TESTING_CHECKLIST.md` - Manual end-to-end testing
- `CODE_VERIFICATION.md` - Technical code review

---

## Support

If you encounter issues not covered here:

1. **Check browser console** for detailed error messages
2. **Check Supabase logs** (Dashboard → Logs)
3. **Review verification queries** to ensure database is configured correctly
4. **Check git history** to see what changed

---

## Summary

**What you need to do:**
1. ✅ Run `SUPABASE_FIX_SCRIPT.sql` in Supabase SQL Editor
2. ✅ Verify with the SQL queries
3. ✅ Restart your development server
4. ✅ Test adding a vehicle

**Expected result:**
- New users get profiles automatically
- Existing users without profiles get them when adding vehicles
- Vehicle creation works without 409 errors
- Success modal appears after adding vehicle

---

**Last Updated:** November 12, 2025
**Status:** Ready for deployment
**Build Status:** ✅ No compilation errors

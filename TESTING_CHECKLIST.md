# Add Vehicle System - End-to-End Testing Checklist

## Prerequisites
- [ ] App is running (web: `npm run web` or `npm start`)
- [ ] Supabase project is configured and running
- [ ] Test user account available

---

## 1. User Authentication & Profile Creation

### Sign Up New User
- [ ] Navigate to sign up screen
- [ ] Create new account with email/password
- [ ] Verify no errors during signup
- [ ] Check Supabase `users` table:
  - [ ] User record exists with correct ID
  - [ ] `is_premium` is set to `false`
  - [ ] Email matches
  - [ ] Timestamps are set

**Expected Result:** User profile created successfully in database with snake_case fields

---

## 2. Manual Vehicle Entry - Happy Path

### Navigate to Add Vehicle
- [ ] From Dashboard: Click "Add Vehicle" button in empty state hero card
- [ ] OR From Dashboard: Click "➕" icon in top right
- [ ] OR From Vehicles tab: Click "Add Vehicle" button at bottom
- [ ] Verify VehicleSetup screen loads

### Fill Form Manually
- [ ] Toggle to manual entry (if needed)
- [ ] Enter Make: "Toyota"
- [ ] Enter Model: "Camry"
- [ ] Enter Year: "2020"
- [ ] Enter Mileage: "50000"
- [ ] Enter Nickname: "Daily Driver" (optional)
- [ ] Click "Add Vehicle" button

### Verify Success Modal
- [ ] Purple gradient modal appears with fade-in animation
- [ ] 🎉 celebration icon displayed
- [ ] Title: "Vehicle Added Successfully!"
- [ ] Vehicle details shown correctly:
  - [ ] Nickname: "Daily Driver"
  - [ ] Vehicle info: "2020 Toyota Camry"
  - [ ] Mileage: "50,000 miles"
- [ ] Two buttons visible:
  - [ ] "View Dashboard" (white button)
  - [ ] "Add Another Vehicle" (outlined button)
- [ ] Close button (X) visible in corner

### Test Modal Actions
**Test 1: View Dashboard**
- [ ] Click "View Dashboard"
- [ ] Modal closes
- [ ] Dashboard loads
- [ ] Vehicle appears in dashboard (if no longer empty state)

**Test 2: Add Another Vehicle**
- [ ] Add a vehicle successfully
- [ ] In success modal, click "Add Another Vehicle"
- [ ] Modal closes
- [ ] Form resets to empty fields
- [ ] Can immediately add another vehicle

**Test 3: Close Button**
- [ ] Add a vehicle successfully
- [ ] Click X button in corner
- [ ] Modal closes
- [ ] Navigates back to previous screen

### Verify Database
Check Supabase `vehicles` table:
- [ ] New vehicle record exists
- [ ] `user_id` matches authenticated user's ID
- [ ] All fields populated correctly (make, model, year, mileage, nickname)
- [ ] `created_at` and `updated_at` timestamps set

Check Supabase `maintenance_tasks` table:
- [ ] Multiple maintenance tasks created (oil change, tire rotation, etc.)
- [ ] All tasks have `vehicle_id` matching the new vehicle
- [ ] `next_due_mileage` calculated correctly (current + interval)
- [ ] `next_due_date` calculated correctly

---

## 3. VIN Lookup - Happy Path

### Use VIN Lookup
- [ ] Navigate to Add Vehicle screen
- [ ] Ensure "VIN Lookup" is selected
- [ ] Enter valid VIN: "1HGBH41JXMN109186" (example)
- [ ] Click "Lookup VIN"
- [ ] Verify auto-population:
  - [ ] Make field populated
  - [ ] Model field populated
  - [ ] Year field populated
- [ ] Enter Mileage: "75000"
- [ ] Enter Nickname: "Work Car" (optional)
- [ ] Click "Add Vehicle"
- [ ] Verify success modal appears with correct details

---

## 4. Validation Testing

### Missing Required Fields
- [ ] Try submitting with empty Make
  - **Expected:** Alert: "Missing Information"
- [ ] Try submitting with empty Model
  - **Expected:** Alert: "Missing Information"
- [ ] Try submitting with empty Year
  - **Expected:** Alert: "Missing Information"
- [ ] Try submitting with empty Mileage
  - **Expected:** Alert: "Missing Information"

### Invalid Year
- [ ] Enter year: "1800" (too old)
  - **Expected:** Alert: "Invalid Year"
- [ ] Enter year: "2030" (too far in future)
  - **Expected:** Alert: "Invalid Year"
- [ ] Enter year: "abcd" (non-numeric)
  - **Expected:** Alert: "Invalid Year"

### Invalid Mileage
- [ ] Enter mileage: "-100" (negative)
  - **Expected:** Alert: "Invalid Mileage"
- [ ] Enter mileage: "xyz" (non-numeric)
  - **Expected:** Alert: "Invalid Mileage"

### Invalid VIN
- [ ] Enter VIN with less than 17 characters
  - **Expected:** Alert: "Invalid VIN"
- [ ] Enter VIN with more than 17 characters
  - **Expected:** Alert: "Invalid VIN"

---

## 5. User Authentication Edge Cases

### No User Profile
- [ ] (Requires manual DB manipulation) Delete user from `users` table
- [ ] Try to add vehicle
- [ ] **Expected:** Alert: "Authentication Error - User not found. Please log out and log back in"

### Test with Different Users
- [ ] Sign in as User A
- [ ] Add vehicle for User A
- [ ] Sign out
- [ ] Sign in as User B
- [ ] Verify User B cannot see User A's vehicles
- [ ] Add vehicle for User B
- [ ] Verify both users only see their own vehicles

---

## 6. Navigation Flow Testing

### Entry Points
- [ ] **From Dashboard (empty state):**
  - Click hero card "Add Vehicle" button → VehicleSetup
- [ ] **From Dashboard (empty state):**
  - Click "➕" icon → VehicleSetup
- [ ] **From Dashboard (populated):**
  - Click "➕" icon (if still showing "📅") → VehicleSetup
- [ ] **From Vehicles Tab:**
  - Click "Add Vehicle" button → VehicleSetup

### Exit Points
- [ ] Success modal → "View Dashboard" → Dashboard tab
- [ ] Success modal → Close (X) → Previous screen
- [ ] Success modal → "Add Another Vehicle" → Same screen, form reset
- [ ] Back button/gesture → Previous screen (before submitting)

---

## 7. UI/UX Verification

### Empty States
- [ ] Dashboard shows centered purple-bordered card when no vehicles
- [ ] Vehicles tab shows icon with feature list when no vehicles
- [ ] Both empty states have "Add Vehicle" buttons

### Success Modal Appearance
- [ ] Modal has vibrant purple gradient
- [ ] Text is white and readable
- [ ] Buttons are well-styled with proper contrast
- [ ] Modal is centered on screen
- [ ] Backdrop is semi-transparent dark overlay
- [ ] Modal animates in smoothly

### Form UX
- [ ] All input fields have labels
- [ ] Placeholder text is helpful
- [ ] Required fields marked with *
- [ ] Loading state shows on "Add Vehicle" button
- [ ] Keyboard avoidance works (on mobile)
- [ ] Can scroll through long form

---

## 8. Error Handling

### Network Errors
- [ ] Disable internet connection
- [ ] Try to add vehicle
- [ ] **Expected:** Error alert with meaningful message

### Database Errors
- [ ] (Requires DB manipulation) Revoke INSERT permission on vehicles table
- [ ] Try to add vehicle
- [ ] **Expected:** Error alert showing actual error message

### RLS Policy Errors
- [ ] (Already tested if user validation works)
- [ ] Verify error messages are helpful

---

## 9. Data Integrity

### Vehicle Data
- [ ] Check that all entered data is saved correctly
- [ ] Verify nickname is optional and can be null
- [ ] Verify VIN is optional and can be null
- [ ] Check that mileage is stored as integer
- [ ] Check that year is stored as integer

### Maintenance Tasks
- [ ] Verify default maintenance schedule is applied
- [ ] Check that intervals are calculated correctly
- [ ] Verify priorities are set appropriately
- [ ] Confirm all tasks are linked to correct vehicle_id

---

## 10. Performance & Polish

### Loading States
- [ ] Button shows loading spinner during submission
- [ ] Form is disabled during loading
- [ ] No double-submission possible

### Animations
- [ ] Modal fade-in is smooth
- [ ] No visual glitches or layout shifts
- [ ] Transitions feel polished

### Accessibility
- [ ] Tab order makes sense
- [ ] Error messages are clear
- [ ] Buttons have adequate touch targets

---

## Success Criteria

✅ **All critical tests pass:**
- User can sign up and profile is created correctly
- Vehicle can be added manually with all validations working
- VIN lookup works (if API is available)
- Success modal displays correctly with all information
- All navigation flows work as expected
- Data is saved correctly in database
- Only authenticated user can see their vehicles
- Error messages are helpful and informative

---

## Known Issues / Notes

- Document any issues found during testing
- Note any unexpected behavior
- List any improvements needed

---

**Tested By:** _________________
**Date:** _________________
**App Version:** _________________
**Environment:** Web / iOS / Android (circle one)

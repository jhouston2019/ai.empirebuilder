# Comprehensive Fix Plan - Fix Everything

## Issues to Fix:

1. ✅ **Admin login not working** - Files in wrong location
2. ✅ **Static HTML files in root** - Need to be in public/
3. ✅ **Root index redirect** - Should use Next.js rewrites
4. ✅ **Admin.html module links** - Should use API routes
5. ⚠️ **Admin security** - Credentials in JS (lower priority, can fix later)

---

## Fix Strategy:

### Step 1: Move All Static HTML Files to Public/
Move these files from root to `public/`:
- `admin-login.html` → `public/admin-login.html`
- `admin.html` → `public/admin.html`
- `pricing.html` → `public/pricing.html`
- `signup.html` → `public/signup.html`
- `thankyou.html` → `public/thankyou.html`
- `success.html` → `public/success.html`
- `starter.html` → `public/starter.html`
- `course-overview.html` → `public/course-overview.html`
- `student-login.html` → `public/student-login.html` (if not already there)

### Step 2: Fix Root Index Redirect
Update `next.config.js` to use rewrites instead of client-side redirect:
- Add rewrite rule to serve `public/index.html` at `/`
- Remove redirect from `pages/index.tsx`

### Step 3: Update Admin.html Module Links
Update `admin.html` to use API routes:
- Change `/modules/Module X.html` → `/api/modules/<slug>`
- Change workbook links to use `/api/modules?file=...`

### Step 4: Verify All Asset Paths
Ensure all HTML files reference `/assets/` correctly (should work since assets are in `public/assets/`)

---

## Expected Outcome:

✅ Admin login will work
✅ All static HTML pages accessible
✅ No redirect flash on homepage
✅ Admin panel links work correctly
✅ All assets load properly

---

## Implementation Order:

1. Move files to public/ (fixes admin login immediately)
2. Fix root redirect (improves UX)
3. Update admin.html links (fixes admin panel)
4. Test everything


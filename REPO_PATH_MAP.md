# AI Empire Builder - Complete Repository Path Map

**Generated:** December 2024  
**Purpose:** Complete file structure and path reference for all fixes

---

## 📁 Module Files Inventory

### Source Files (`/modules/`)
**HTML Files (12 total):**
- ✅ `modules/Module 1 - Foundation.html`
- ✅ `modules/Module 1 - Workbook - Foundation.html`
- ✅ `modules/Module 2 - Planning Your Empire.html`
- ✅ `modules/Module 2 - Workbook - Planning Your Empire.html`
- ✅ `modules/Module 3 - Building Your SaaS Tool.html`
- ✅ `modules/Module 3 - Workbook - Building Your SaaS Tool.html`
- ✅ `modules/Module 4 - Monetization Mastery.html`
- ✅ `modules/Module 4 - Workbook - Monetization Mastery.html`
- ✅ `modules/Module 5 - Traffic & Growth.html`
- ✅ `modules/Module 5 - Workbook - Traffic & Growth.html`
- ✅ `modules/Module 6 - Scaling to Six Figures.html`
- ✅ `modules/Module 6 - Workbook - Scaling to Six Figures.html`

**PDF Files:**
- `modules/pdfs/` - Contains 12 PDFs (6 modules + 6 workbooks) + Binder2.pdf
- `modules/modules - pdfs/` - Duplicate PDF folder (13 PDFs)
- ⚠️ **Note:** Duplicate PDF folders exist - needs cleanup

### Public Files (`/public/modules/`)
**All 12 HTML files + 13 PDFs present:**
- ✅ All module HTML files
- ✅ All workbook HTML files  
- ✅ All PDF files
- ✅ Binder2.pdf

**Status:** Complete - all files exist in both locations

---

## 🗺️ Module Path Mapping

### Current Module Route Structure

| Next.js Route | File Path | Module Slug | Full Filename |
|--------------|-----------|-------------|---------------|
| `/modules/foundation` | `pages/modules/foundation.tsx` | `foundation` | `Module 1 - Foundation.html` |
| `/modules/planning` | `pages/modules/planning.tsx` | `planning` | `Module 2 - Planning Your Empire.html` |
| `/modules/saas-tool` | `pages/modules/saas-tool.tsx` | `building` | `Module 3 - Building Your SaaS Tool.html` |
| `/modules/monetization` | `pages/modules/monetization.tsx` | `monetization` | `Module 4 - Monetization Mastery.html` |
| `/modules/traffic` | `pages/modules/traffic.tsx` | `traffic` | `Module 5 - Traffic & Growth.html` |
| `/modules/scaling` | `pages/modules/scaling.tsx` | `scaling` | `Module 6 - Scaling to Six Figures.html` |

### Module Slug → Filename Map (Target)
```
foundation → "Module 1 - Foundation.html"
planning → "Module 2 - Planning Your Empire.html"
building → "Module 3 - Building Your SaaS Tool.html"
monetization → "Module 4 - Monetization Mastery.html"
traffic → "Module 5 - Traffic & Growth.html"
scaling → "Module 6 - Scaling to Six Figures.html"
```

---

## 🔗 Module Path References

### Current Usage Patterns

#### 1. Module Viewer Pages (`pages/modules/*.tsx`)
**Current Pattern:** Direct file paths
- `foundation.tsx`: Uses `/modules/Module 1 - Foundation.html`
- `planning.tsx`: Uses `/modules/Module 2 - Planning Your Empire.html`
- `saas-tool.tsx`: Uses `/modules/Module 3 - Building Your SaaS Tool.html`
- `monetization.tsx`: Uses `/modules/Module 4 - Monetization Mastery.html`
- `traffic.tsx`: Uses `/modules/Module 5 - Traffic & Growth.html`
- `scaling.tsx`: Uses `/modules/Module 6 - Scaling to Six Figures.html`

**Issue:** All use direct `/modules/` paths instead of `/api/modules/` API routes

#### 2. Resource Center (`pages/resource-center/index.tsx`)
**Current Pattern:** API routes ✅
- Uses `/api/modules/Module X - Title.html` format
- Uses `/api/modules/Module X - Title.pdf` for PDFs
- Uses `/api/modules/Module X - Workbook - Title.html` for workbooks

**Status:** Correct - already using API routes

#### 3. ModuleViewer Component (`components/ModuleViewer.tsx`)
**Current Pattern:** Direct iframe src
- Receives `modulePath` prop (e.g., `/modules/Module 1 - Foundation.html`)
- Loads directly via iframe
- **Issue:** Should use `/api/modules/<slug>` instead

#### 4. API Module Route (`pages/api/modules/[filename].ts`)
**Current Pattern:** Filename-based
- Route: `/api/modules/[filename]`
- Reads from: `public/modules/` (line 81)
- **Issue:** Should read from `modules/` (source) not `public/modules/`
- **Issue:** Uses full filename instead of slug-based routing

---

## 💳 Checkout System Paths

### Next.js Checkout API
**File:** `pages/api/checkout/[plan].ts`
- **Route:** `/api/checkout/[plan]`
- **Supported Plans:** `starter`, `builder`, `pro`, `elite`
- **Env Vars Used:**
  - `STRIPE_PRICE_STARTER`
  - `STRIPE_PRICE_PRO` (used for both `builder` and `pro`)
  - `STRIPE_PRICE_ELITE`
- **Method:** GET (redirects to Stripe)
- **Status:** ✅ Working

### Netlify Checkout Function
**File:** `netlify/functions/create-checkout-session.js`
- **Route:** `/.netlify/functions/create-checkout-session`
- **Supported Plans:** `starter`, `builder` only
- **Env Vars Used:**
  - `STRIPE_PRICE_RESPONSE_STARTER` ⚠️ Different name!
  - `STRIPE_PRICE_RESPONSE_BUILDER` ⚠️ Different name!
- **Method:** POST (returns JSON with session URL)
- **Used By:** `pricing.html` (line 356)
- **Status:** ⚠️ Needs to be removed/replaced

### Pricing Page References
**File:** `pricing.html`
- **Line 89:** `onclick="checkout('starter')"`
- **Line 96:** `onclick="checkout('builder')"`
- **Line 356:** `fetch("/.netlify/functions/create-checkout-session")`
- **Issue:** Uses Netlify function instead of Next.js API

---

## 🔐 Authentication & Login Paths

### Next.js Login
**File:** `pages/login.tsx`
- **Route:** `/login`
- **Status:** ✅ Primary login system
- **Uses:** Supabase auth (server-side, secure)

### HTML Login (Legacy)
**Files:**
- `student-login.html` (root)
- `public/student-login.html` (duplicate)

**Issues:**
- ⚠️ **Hardcoded Supabase credentials** (lines 175-176):
  ```javascript
  const SUPABASE_URL = 'https://abyyziqmghhiznpcinvu.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
  ```
- **Security Risk:** Credentials exposed in client-side code
- **Fix Required:** Remove credentials, redirect to `/login`

### References to student-login.html
**Found in:**
- `index.html` (line 62): `<a href="/student-login.html">`
- `AUDIT_SUMMARY.md`: Mentions security issue
- `SITE_AUDIT_REPORT.md`: Multiple references

---

## 📄 Component Files

### ModuleCard Component
**File:** `components/ModuleCard.tsx`
- **Line 12:** Plan check logic
- **Current Logic:**
  ```typescript
  const allowed = plan === 'pro' || plan === 'elite' || isFoundation || isPlanning
  ```
- **Issue:** Missing `builder` plan check
- **Fix Required:** Add `plan === 'builder'` to allowed check

### ModuleViewer Component
**File:** `components/ModuleViewer.tsx`
- **Line 54:** Uses `modulePath` prop directly in iframe src
- **Current Pattern:** Direct file path (e.g., `/modules/Module 1 - Foundation.html`)
- **Fix Required:** Change to use `/api/modules/<slug>` format

### ResourceCard Component
**File:** `components/ResourceCard.tsx`
- **Status:** ✅ Already uses API routes via `href` prop
- **No changes needed**

---

## 📊 Dashboard & Resource Center

### Dashboard
**File:** `pages/dashboard.tsx`
- **Module Links:** Uses Next.js routes (e.g., `/modules/foundation`)
- **Status:** ✅ Correct routing
- **ModuleCard Usage:** Passes plan to ModuleCard component
- **Issue:** ModuleCard missing builder plan support

### Resource Center
**File:** `pages/resource-center/index.tsx`
- **Module Links:** Uses `/api/modules/Module X - Title.html` format
- **Status:** ✅ Already using API routes
- **Fix Required:** Change to use slug-based routes (`/api/modules/<slug>`)

---

## 🗑️ Files to Remove

### Test Files
- ✅ `test-image.html` (root) - **DELETE**

### Duplicate PDF Folders
- ⚠️ `modules/modules - pdfs/` - Consider removing (duplicate of `modules/pdfs/`)
- ⚠️ `modules/pdfs~a9388b099cf044c8a21230be74c3630c007352d4` - Git artifact, can remove

---

## 🔍 Google Analytics References

### Placeholder GA Code
**File:** `index.html`
- **Lines 40-48:** Google Analytics placeholder
- **ID:** `G-XXXXXXXXXX` (placeholder)
- **Fix Required:** Remove entire GA script block if no real ID available

### Other GA References
- Found in module content files (Module 2, Module 5 workbooks)
- **Status:** ✅ These are content references, not code - leave as-is

---

## 📋 Summary of Path Issues

### Critical Issues
1. **Module paths inconsistent:**
   - Module pages use: `/modules/Module X.html` (direct)
   - Resource Center uses: `/api/modules/Module X.html` (API)
   - **Fix:** Standardize all to `/api/modules/<slug>`

2. **API route reads wrong location:**
   - Current: `public/modules/` (line 81 in `[filename].ts`)
   - Should be: `modules/` (source directory)
   - **Fix:** Change file path in API route

3. **API route uses filename instead of slug:**
   - Current: `/api/modules/[filename]` with full filename
   - Should be: `/api/modules/[slug]` with slug mapping
   - **Fix:** Refactor to slug-based routing

### Security Issues
4. **Hardcoded credentials in student-login.html**
   - **Fix:** Remove credentials, redirect to `/login`

5. **Test file in production**
   - **Fix:** Delete `test-image.html`

### Logic Issues
6. **ModuleCard missing builder plan**
   - **Fix:** Add `plan === 'builder'` check

7. **Checkout system duplication**
   - **Fix:** Remove Netlify function, use only Next.js API

### Cleanup Issues
8. **Duplicate PDF folders**
   - **Fix:** Remove `modules/modules - pdfs/` if redundant

9. **Google Analytics placeholder**
   - **Fix:** Remove if no real ID available

---

## 🎯 Target State After Fixes

### Module Access Pattern (Target)
```
User clicks module → /modules/<slug> → ModuleViewer → /api/modules/<slug> → API route → modules/<filename>.html
```

### Checkout Pattern (Target)
```
User clicks checkout → /api/checkout/<plan> → Stripe session → Webhook → Plan update
```

### Login Pattern (Target)
```
User clicks login → /login (Next.js) → Supabase auth → Dashboard/Resource Center
```

---

**Next Steps:** Proceed with MASTER PROMPT 1 - Critical Fixes


# Button Troubleshooting Guide

## Issue: "Nothing happens when buttons are clicked"

### What I Fixed:

1. ✅ **Added missing anchor ID** - The "Get Instant Access" button links to `#pricing` but the section didn't have that ID
2. ✅ **Created test page** - Added `test-checkout.html` to diagnose checkout issues
3. ✅ **Verified netlify.toml** - Ensured correct publish directory

### How to Test:

#### Test 1: Check if the anchor link works
1. Go to: `https://aibusinessbuilderpro.net/pricing.html`
2. Click "Get Instant Access" at the top
3. It should scroll down to the pricing section with the two buttons

#### Test 2: Check if API routes are working
1. Go to: `https://aibusinessbuilderpro.net/test-checkout.html`
2. Click either "Test Starter" or "Test Builder" button
3. Check the console output on the page
4. **Expected result**: Should redirect to Stripe checkout
5. **If it fails**: The console will show what went wrong

### Common Issues & Solutions:

#### Issue 1: "Get Instant Access" doesn't scroll
**Cause**: Missing `id="pricing"` on the pricing section
**Status**: ✅ FIXED - Added `id="pricing"` to the section

#### Issue 2: Checkout buttons do nothing
**Possible causes**:
1. **Next.js API routes not deployed** 
   - The site might be deployed as static HTML only
   - Solution: Ensure Netlify is building with `npm run build` and using `@netlify/plugin-nextjs`

2. **Missing environment variables**
   - Check Netlify dashboard → Site settings → Environment variables
   - Required: `STRIPE_PRICE_RESPONSE_STARTER` and `STRIPE_PRICE_RESPONSE_BUILDER`

3. **JavaScript errors**
   - Open browser console (F12)
   - Look for red error messages
   - Common errors:
     - "checkout is not defined" - Script didn't load
     - "Failed to fetch" - API route doesn't exist
     - "404 Not Found" - API endpoint not deployed

#### Issue 3: Buttons show "Processing..." but nothing happens
**Cause**: The API route exists but is failing
**Solution**: Check the API response:
1. Open browser console (F12)
2. Go to Network tab
3. Click the button
4. Look for the `/api/checkout/starter` or `/api/checkout/builder` request
5. Check the response - it should redirect to Stripe

### Debugging Steps:

1. **Test the checkout page**:
   ```
   Visit: https://aibusinessbuilderpro.net/test-checkout.html
   ```
   This will show you exactly what's happening when you click the buttons.

2. **Check browser console**:
   - Press F12
   - Go to Console tab
   - Click a button
   - Look for errors (red text)

3. **Check Network tab**:
   - Press F12
   - Go to Network tab
   - Click a button
   - Look for `/api/checkout/` requests
   - Check the status code and response

4. **Verify environment variables in Netlify**:
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Confirm these exist:
     - `STRIPE_SECRET_KEY`
     - `STRIPE_PRICE_RESPONSE_STARTER`
     - `STRIPE_PRICE_RESPONSE_BUILDER`
     - `NEXT_PUBLIC_SITE_URL`

5. **Check Netlify build logs**:
   - Go to Netlify dashboard
   - Deploys → Latest deploy → Deploy log
   - Look for errors during build
   - Confirm "Next.js plugin" is running
   - Confirm "API routes" are being created

### Expected Behavior:

When working correctly:
1. User clicks "Enroll in Starter – $97" or "Enroll in Builder – $297"
2. Button text changes to "Processing..."
3. Page redirects to `/api/checkout/starter` or `/api/checkout/builder`
4. API creates a Stripe checkout session
5. User is redirected to Stripe's checkout page
6. After payment, user is redirected to `/success?plan=starter` or `/success?plan=builder`

### Quick Fix Checklist:

- [x] Added `id="pricing"` to pricing section
- [x] Created test page at `/test-checkout.html`
- [x] Verified `netlify.toml` has correct publish directory
- [ ] Verify environment variables are set in Netlify
- [ ] Test the checkout flow using test-checkout.html
- [ ] Check Netlify build logs for errors
- [ ] Verify API routes are being deployed

### If Still Not Working:

1. **Redeploy the site**:
   - Go to Netlify dashboard
   - Deploys → Trigger deploy → Clear cache and deploy site

2. **Check if Next.js is actually running**:
   - Try visiting: `https://aibusinessbuilderpro.net/api/checkout/builder`
   - If you get a proper error message (not 404), the API is working
   - If you get 404, the API routes aren't deployed

3. **Contact me with**:
   - URL of your test-checkout.html page results
   - Screenshot of browser console errors
   - Screenshot of Netlify build log
   - Screenshot of environment variables (hide the actual values!)

### Files Modified:

1. `public/pricing.html` - Added `id="pricing"` to section
2. `public/test-checkout.html` - New diagnostic page
3. `netlify.toml` - Verified configuration

### Next Steps:

1. Wait for Netlify to deploy (usually 2-3 minutes)
2. Visit `https://aibusinessbuilderpro.net/test-checkout.html`
3. Click the test buttons and see what happens
4. Report back with the console output


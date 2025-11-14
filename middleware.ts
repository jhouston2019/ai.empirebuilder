import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // CRITICAL: Allow /login and static files FIRST - before any other checks
  if (path === '/login') {
    return NextResponse.next()
  }

  // Skip static files - they should be served directly from public folder
  if (path.includes('.') && path.split('.').pop()?.match(/^(html|css|js|png|jpg|jpeg|gif|svg|ico|pdf)$/i)) {
    return NextResponse.next()
  }

  // Allow public routes
  const publicRoutes = ['/api/checkout', '/api/stripe/webhook', '/success', '/cancel', '/']
  if (publicRoutes.some(route => path === route || path.startsWith(route))) {
    return NextResponse.next()
  }

  // Protect module API routes - require authentication
  if (path.startsWith('/api/modules/')) {
    const accessToken = req.cookies.get('sb-access-token')?.value
    
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Verify user and check plan
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    )

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
      
      if (authError || !user || !user.email) {
        const response = NextResponse.redirect(new URL('/login', req.url))
        response.cookies.delete('sb-access-token')
        return response
      }

      // Get user plan from database
      const { data: userData } = await supabase
        .from('users')
        .select('plan_tier')
        .eq('email', user.email)
        .single()

      const plan = userData?.plan_tier || null

      // CRITICAL: Only allow access if user has a paid plan (not null/undefined)
      // Users without a plan_tier should not have access
      if (!plan || plan === 'none' || plan === '') {
        return NextResponse.redirect(new URL('/upgrade', req.url))
      }

      // Allow access - the API route will do further plan-based filtering
      return NextResponse.next()
    } catch (error) {
      console.error('Middleware error:', error)
      const response = NextResponse.redirect(new URL('/login', req.url))
      response.cookies.delete('sb-access-token')
      return response
    }
  }


  // Check if this is a protected route
  const isProtectedRoute = 
    (path.startsWith('/modules') && !path.includes('.')) || // Only Next.js routes, not static files
    path.startsWith('/resource-center') || 
    path.startsWith('/dashboard') ||
    path.startsWith('/upgrade')

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Get access token from cookies
  const accessToken = req.cookies.get('sb-access-token')?.value

  // If no token and trying to access protected route, redirect to login
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Verify user and check plan
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  )

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)
    
    if (authError || !user || !user.email) {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/login', req.url))
      response.cookies.delete('sb-access-token')
      return response
    }

    // Get user plan from database
    const { data: userData } = await supabase
      .from('users')
      .select('plan_tier')
      .eq('email', user.email)
      .single()

    const plan = userData?.plan_tier || null

    // CRITICAL: No access without a paid plan - redirect to pricing section on landing page
    if (!plan || plan === '' || plan === 'none') {
      // Allow access to upgrade page and public routes, but block protected content
      if (path.startsWith('/upgrade') || path.startsWith('/login') || path === '/') {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL('/?redirect=pricing', req.url))
    }

    // Check if starter user is trying to access restricted route
    if (plan === 'starter') {
      const isRestrictedRoute = 
        (path.startsWith('/modules') && !path.startsWith('/modules/foundation') && !path.startsWith('/modules/planning')) ||
        path.startsWith('/resource-center')

      if (isRestrictedRoute) {
        return NextResponse.redirect(new URL('/?redirect=pricing', req.url))
      }
    }

    // Allow access to all routes for builder/pro/elite plans, or allowed starter routes
    // Builder package has full access to all modules and resource center
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    const response = NextResponse.redirect(new URL('/login', req.url))
    response.cookies.delete('sb-access-token')
    return response
  }
}

export const config = {
  matcher: [
    // Only match protected routes that need authentication
    // /login and static files are handled at the top of middleware and bypass this
    '/modules/foundation',
    '/modules/planning',
    '/modules/saas-tool',
    '/modules/monetization',
    '/modules/traffic',
    '/modules/scaling',
    '/resource-center',
    '/resource-center/:path*',
    '/dashboard',
    '/dashboard/:path*',
    '/upgrade',
    '/upgrade/:path*',
    '/api/modules/:path*',
  ],
}


import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Allow public routes
  const publicRoutes = ['/login', '/api/checkout', '/api/stripe/webhook', '/success', '/cancel', '/']
  if (publicRoutes.some(route => path === route || path.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow static HTML files to be served directly (they're in public folder)
  if (path.startsWith('/modules/') && path.endsWith('.html')) {
    return NextResponse.next()
  }

  // Check if this is a protected route
  const isProtectedRoute = 
    path.startsWith('/modules') || 
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

    const plan = userData?.plan_tier || 'starter'

    // Check if starter user is trying to access restricted route
    if (plan === 'starter') {
      const isRestrictedRoute = 
        (path.startsWith('/modules') && !path.startsWith('/modules/foundation') && !path.startsWith('/modules/planning')) ||
        path.startsWith('/resource-center')

      if (isRestrictedRoute) {
        return NextResponse.redirect(new URL('/upgrade', req.url))
      }
    }

    // Allow access to all routes for pro and elite plans, or allowed starter routes
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
    // Exclude static files (HTML, images, etc.) - they're handled by the early return in middleware
    '/modules/:path*',
    '/resource-center/:path*',
    '/dashboard/:path*',
    '/upgrade/:path*',
  ],
}


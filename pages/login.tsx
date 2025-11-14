import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (data.user && data.session) {
        // Store token in cookie for middleware (30 days expiry)
        const expiryDate = new Date()
        expiryDate.setTime(expiryDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        const isSecure = window.location.protocol === 'https:'
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax${isSecure ? '; Secure' : ''}`
        
        // Set the session on the supabase client for authenticated requests
        await supabase.auth.setSession(data.session)
        
        // Check if user exists in users table, if not create them
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single()

        if (dbError && dbError.code === 'PGRST116') {
          // User doesn't exist, create them WITHOUT a plan
          // They must pay to get access - plan_tier will be set by webhook after payment
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              email,
              plan_tier: null, // No access until payment
            })

          if (insertError) {
            console.error('Error creating user:', insertError)
          }
        }

        // Get user plan to determine redirect destination
        const { data: userPlanData, error: planError } = await supabase
          .from('users')
          .select('plan_tier')
          .eq('email', email)
          .single()

        if (planError) {
          console.error('Error fetching user plan:', planError)
        }

        const plan = userPlanData?.plan_tier || null

        // Redirect based on plan:
        // - Builder package → Resource Center (full access to all modules)
        // - Starter package → Dashboard (limited access to Foundation + Planning only)
        // - No plan → Pricing section
        if (plan === 'builder' || plan === 'pro' || plan === 'elite') {
          // Builder/Pro/Elite users get full access - redirect to resource center
          router.push('/resource-center')
        } else if (plan === 'starter') {
          // Starter users get limited access - redirect to dashboard
          router.push('/dashboard')
        } else {
          // No plan or null - redirect to pricing to purchase
          router.push('/?redirect=pricing')
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Student Login</h1>
        <p className="text-center text-neutral-400 mb-4">Enter your email and password to access your course resources</p>
        <p className="text-center text-xs text-neutral-500 mb-8">For administrators, please use <a href="/admin-login.html" className="text-yellow-400 underline">Admin Login</a></p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-700 rounded-md text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 px-6 py-3 rounded-md text-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-purple-400 underline hover:text-purple-300 transition">
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  )
}


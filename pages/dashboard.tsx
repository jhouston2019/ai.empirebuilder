import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ModuleCard from '@/components/ModuleCard'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [plan, setPlan] = useState<string>('starter')
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          router.push('/login')
          return
        }

        setEmail(user.email || '')

        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('plan_tier')
          .eq('email', user.email)
          .single()

        if (dbError && dbError.code !== 'PGRST116') {
          console.error('Database error:', dbError)
        }

        // CRITICAL: Users without a plan have no access
        const userPlan = userData?.plan_tier || null
        setPlan(userPlan || 'none')
      } catch (error) {
        console.error('Error fetching user plan:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserPlan()
  }, [router])

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </main>
    )
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // Clear access token cookie
    document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl text-yellow-400 font-bold">AI Empire Builder Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md text-sm transition"
          >
            Logout
          </button>
        </div>
        <div className="mb-8 p-4 bg-neutral-900 rounded-lg border border-neutral-700">
          <p className="mb-2">
            <span className="text-neutral-400">Current Plan:</span>{' '}
            <strong className="text-yellow-400">{plan.toUpperCase()}</strong>
          </p>
          {email && (
            <p className="text-sm text-neutral-400">
              <span className="text-neutral-400">Email:</span> {email}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleCard
            title="Module 1: Foundation"
            path="/modules/foundation"
            plan={plan}
          />
          <ModuleCard
            title="Module 2: Planning"
            path="/modules/planning"
            plan={plan}
          />
          <ModuleCard
            title="Module 3: Building Your SaaS Tool"
            path="/modules/building"
            plan={plan}
          />
          <ModuleCard
            title="Module 4: Monetization Mastery"
            path="/modules/monetization"
            plan={plan}
          />
          <ModuleCard
            title="Module 5: Traffic & Growth"
            path="/modules/traffic"
            plan={plan}
          />
          <ModuleCard
            title="Module 6: Scaling to 6 Figures"
            path="/modules/scaling"
            plan={plan}
          />
          <ModuleCard
            title="Resource Center"
            path="/resource-center"
            plan={plan}
          />
        </div>

        {plan === 'starter' && (
          <div className="mt-8 p-6 bg-purple-900/20 border border-purple-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-purple-400">Upgrade Your Access</h2>
            <p className="mb-4 text-neutral-300">
              You currently have access to Foundation and Planning modules. Upgrade to unlock all modules and the Resource Center.
            </p>
            <Link
              href="/upgrade"
              className="inline-block bg-purple-600 px-6 py-3 rounded-md text-lg hover:bg-purple-700 transition"
            >
              View Upgrade Options →
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}


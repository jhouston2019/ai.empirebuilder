import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function ScalingModule() {
  const router = useRouter()
  const [plan, setPlan] = useState<string>('')

  useEffect(() => {
    const fetchUserPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('plan_tier')
        .eq('email', user.email)
        .single()

      setPlan(userData?.plan_tier || 'starter')
    }

    fetchUserPlan()
  }, [router])

  if (plan === 'starter') {
    router.push('/upgrade')
    return null
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-purple-400 underline hover:text-purple-300 mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold mb-6 text-yellow-400">Module 5: Scaling to 6 Figures</h1>
        <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700">
          <p className="text-neutral-300 mb-4">
            This is the Scaling to 6 Figures module. Content will be displayed here.
          </p>
          <p className="text-sm text-neutral-400">
            Current Plan: <strong className="text-yellow-400">{plan.toUpperCase()}</strong>
          </p>
        </div>
      </div>
    </main>
  )
}


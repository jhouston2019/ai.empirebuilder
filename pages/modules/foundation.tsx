import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ModuleViewer from '@/components/ModuleViewer'
import { supabase } from '@/lib/supabaseClient'

export default function FoundationModule() {
  const router = useRouter()
  const [plan, setPlan] = useState<string>('')
  const [loading, setLoading] = useState(true)

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
      setLoading(false)
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-neutral-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-purple-400 underline hover:text-purple-300">
              ← Dashboard
            </Link>
            <span className="text-neutral-400">|</span>
            <h1 className="text-xl font-bold text-yellow-400">Module 1: Foundation</h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/modules/Module 1 Workbook - Foundation.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 px-4 py-2 rounded-md text-sm hover:bg-purple-700 transition"
            >
              Open Workbook
            </a>
            <span className="text-sm text-neutral-400">Plan: {plan.toUpperCase()}</span>
          </div>
        </div>
      </div>
      <ModuleViewer modulePath="/modules/Module 1 - Foundation.html" title="Module 1: Foundation" />
    </div>
  )
}

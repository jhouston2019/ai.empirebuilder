import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ResourceCard from '@/components/ResourceCard'
import { supabase } from '@/lib/supabaseClient'

export default function ResourceCenter() {
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

      const userPlan = userData?.plan_tier || 'starter'
      setPlan(userPlan)

      if (userPlan === 'starter') {
        router.push('/upgrade')
        return
      }

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

  if (plan === 'starter') {
    return null
  }

  const modules = [
    {
      number: 1,
      title: 'Foundation',
      moduleHref: '/modules/foundation',
      workbookHref: '/modules/Module 1 Workbook - Foundation.html',
      description: 'The Micro-SaaS Revolution. Master the opportunity, market landscape, and the PROFIT framework.'
    },
    {
      number: 2,
      title: 'Planning Your Empire',
      moduleHref: '/modules/planning',
      workbookHref: '/modules/Module 2 Workbook - Planning Your Empire.html',
      description: 'Strategic tool selection and validation. Market research, competition analysis, and 48-hour validation sprints.'
    },
    {
      number: 3,
      title: 'Building Your SaaS Tool',
      moduleHref: '/modules/saas-tool',
      workbookHref: '/modules/Module 3 Workbook - Building Your SaaS Tool.html',
      description: 'From idea to working product in 7 days. Technical foundation, MVP development, testing, and launch.'
    },
    {
      number: 4,
      title: 'Monetization Mastery',
      moduleHref: '/modules/monetization',
      workbookHref: '/modules/Module 4 Workbook - Monetization Mastery.html',
      description: 'Turn your tools into revenue machines. Seven revenue models, pricing psychology, and optimization strategies.'
    },
    {
      number: 5,
      title: 'Traffic & Growth',
      moduleHref: '/modules/traffic',
      workbookHref: '/modules/Module 5 Workbook - Traffic & Growth.html',
      description: 'Drive 10,000+ targeted visitors per month. SEO mastery, social media growth, and paid traffic strategies.'
    },
    {
      number: 6,
      title: 'Scaling to Six Figures',
      moduleHref: '/modules/scaling',
      workbookHref: '/modules/Module 6 Workbook - Scaling to Six Figures.html',
      description: 'Scale your business to 6 figures and beyond. Advanced strategies, automation, and growth systems.'
    }
  ]

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard" className="text-purple-400 underline hover:text-purple-300 mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-yellow-400">Resource Center</h1>
          <p className="text-neutral-400">
            Access all course modules and workbooks. Current Plan: <strong className="text-yellow-400">{plan.toUpperCase()}</strong>
          </p>
        </div>

        <div className="space-y-8">
          {modules.map((module) => (
            <div key={module.number} className="bg-neutral-900 rounded-xl border border-neutral-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">🎯</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">Module {module.number}: {module.title}</h2>
                  <p className="text-neutral-400 text-sm mt-1">{module.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResourceCard
                  title={`${module.title} - Module`}
                  type="module"
                  moduleNumber={module.number}
                  href={module.moduleHref}
                />
                <ResourceCard
                  title={`${module.title} - Workbook`}
                  type="workbook"
                  moduleNumber={module.number}
                  href={module.workbookHref}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

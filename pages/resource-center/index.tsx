import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ResourceCard from '@/components/ResourceCard'
import { supabase } from '@/lib/supabaseClient'

// Ensure Node.js runtime (not Edge) for Supabase compatibility
export const runtime = 'nodejs'

type FilterType = 'all' | 'modules' | 'workbooks' | 'pdfs' | 'bonus'

interface ResourceItem {
  id: string
  type: 'module' | 'workbook' | 'pdf' | 'bonus'
  title: string
  description: string
  href: string
  pdfHref?: string
  moduleNumber?: number
}

export default function ResourceCenter() {
  const router = useRouter()
  const [plan, setPlan] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

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

      const userPlan = userData?.plan_tier || null
      
      // CRITICAL: No access without a paid plan - redirect to pricing section on landing page
      if (!userPlan || userPlan === '' || userPlan === 'none') {
        router.push('/?redirect=pricing')
        return
      }
      
      setPlan(userPlan)
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


  const modules = [
    {
      number: 1,
      title: 'Foundation',
      slug: 'foundation',
      moduleHref: '/modules/foundation',
      modulePdfHref: '/api/modules/Module 1 - Foundation.pdf',
      workbookHref: `/api/modules?file=${encodeURIComponent('Module 1 - Workbook - Foundation.html')}`,
      workbookPdfHref: '/api/modules/Module 1 - Workbook - Foundation.pdf',
      description: 'The Micro-SaaS Revolution. Master the opportunity, market landscape, and the PROFIT framework.'
    },
    {
      number: 2,
      title: 'Planning Your Empire',
      slug: 'planning',
      moduleHref: '/modules/planning',
      modulePdfHref: '/api/modules/Module 2 - Planning Your Empire.pdf',
      workbookHref: `/api/modules?file=${encodeURIComponent('Module 2 - Workbook - Planning Your Empire.html')}`,
      workbookPdfHref: '/api/modules/Module 2 - Workbook - Planning Your Empire.pdf',
      description: 'Strategic tool selection and validation. Market research, competition analysis, and 48-hour validation sprints.'
    },
    {
      number: 3,
      title: 'Building Your SaaS Tool',
      slug: 'building',
      moduleHref: '/modules/building',
      modulePdfHref: '/api/modules/Module 3 - Building Your SaaS Tool.pdf',
      workbookHref: `/api/modules?file=${encodeURIComponent('Module 3 - Workbook - Building Your SaaS Tool.html')}`,
      workbookPdfHref: '/api/modules/Module 3 - Workbook - Building Your SaaS Tool.pdf',
      description: 'From idea to working product in 7 days. Technical foundation, MVP development, testing, and launch.'
    },
    {
      number: 4,
      title: 'Monetization Mastery',
      slug: 'monetization',
      moduleHref: '/modules/monetization',
      modulePdfHref: '/api/modules/Module 4 - Monetization Mastery.pdf',
      workbookHref: `/api/modules?file=${encodeURIComponent('Module 4 - Workbook - Monetization Mastery.html')}`,
      workbookPdfHref: '/api/modules/Module 4 - Workbook - Monetization Mastery.pdf',
      description: 'Turn your tools into revenue machines. Seven revenue models, pricing psychology, and optimization strategies.'
    },
    {
      number: 5,
      title: 'Traffic & Growth',
      slug: 'traffic',
      moduleHref: '/modules/traffic',
      modulePdfHref: '/api/modules/Module 5 - Traffic & Growth.pdf',
      workbookHref: `/api/modules?file=${encodeURIComponent('Module 5 - Workbook - Traffic & Growth.html')}`,
      workbookPdfHref: '/api/modules/Module 5 - Workbook - Traffic & Growth.pdf',
      description: 'Drive 10,000+ targeted visitors per month. SEO mastery, social media growth, and paid traffic strategies.'
    },
    {
      number: 6,
      title: 'Scaling to Six Figures',
      slug: 'scaling',
      moduleHref: '/modules/scaling',
      modulePdfHref: '/api/modules/Module 6 - Scaling to Six Figures.pdf',
      workbookHref: `/api/modules?file=${encodeURIComponent('Module 6 - Workbook - Scaling to Six Figures.html')}`,
      workbookPdfHref: '/api/modules/Module 6 - Workbook - Scaling to Six Figures.pdf',
      description: 'Scale your business to 6 figures and beyond. Advanced strategies, automation, and growth systems.'
    }
  ]

  // Build resource items array for filtering
  const allResources: ResourceItem[] = []
  
  modules.forEach((module) => {
    // Module
    allResources.push({
      id: `module-${module.number}`,
      type: 'module',
      title: `${module.title} - Module`,
      description: module.description,
      href: module.moduleHref,
      pdfHref: module.modulePdfHref,
      moduleNumber: module.number
    })
    
    // Workbook
    allResources.push({
      id: `workbook-${module.number}`,
      type: 'workbook',
      title: `${module.title} - Workbook`,
      description: module.description,
      href: module.workbookHref,
      pdfHref: module.workbookPdfHref,
      moduleNumber: module.number
    })
  })

  // Bonus resources (placeholder for future)
  const bonusResources: ResourceItem[] = [
    {
      id: 'bonus-1',
      type: 'bonus',
      title: 'Tool Ideas Database',
      description: '100+ validated tool concepts with market research and implementation guides.',
      href: '#'
    },
    {
      id: 'bonus-2',
      type: 'bonus',
      title: 'Launch Swipe File',
      description: 'Proven marketing copy templates that convert. Landing pages, emails, and social media content.',
      href: '#'
    },
    {
      id: 'bonus-3',
      type: 'bonus',
      title: 'Revenue Calculator',
      description: 'Interactive tool to project your earnings and optimize your pricing strategy.',
      href: '#'
    },
    {
      id: 'bonus-4',
      type: 'bonus',
      title: 'Automation Templates',
      description: 'Ready-to-use automation blueprints to streamline your operations.',
      href: '#'
    }
  ]

  allResources.push(...bonusResources)

  // Filter resources based on active filter
  const filteredResources = allResources.filter((resource) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'modules') return resource.type === 'module'
    if (activeFilter === 'workbooks') return resource.type === 'workbook'
    if (activeFilter === 'pdfs') return resource.pdfHref !== undefined
    if (activeFilter === 'bonus') return resource.type === 'bonus'
    return true
  })

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'modules', label: 'Modules' },
    { id: 'workbooks', label: 'Workbooks' },
    { id: 'pdfs', label: 'PDF Downloads' },
    { id: 'bonus', label: 'Bonus Resources' }
  ]

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard" className="text-purple-400 underline hover:text-purple-300 mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-yellow-400">Resource Center</h1>
          <p className="text-neutral-400 text-sm sm:text-base">
            Access all course modules and workbooks. Current Plan: <strong className="text-yellow-400">{plan.toUpperCase()}</strong>
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-neutral-700 pb-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeFilter === filter.id
                  ? 'bg-yellow-500 text-black'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredResources.map((resource) => {
            if (resource.type === 'bonus') {
              return (
                <div
                  key={resource.id}
                  className="p-6 bg-neutral-900 rounded-xl border border-neutral-700 hover:border-yellow-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-3xl">⭐</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-yellow-600 px-2 py-1 rounded text-xs font-semibold">
                          Bonus
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg text-white mb-2">{resource.title}</h3>
                      <p className="text-neutral-400 text-sm">{resource.description}</p>
                    </div>
                  </div>
                  <a
                    href={resource.href}
                    className="inline-block bg-yellow-600 px-4 py-2 rounded-md text-sm hover:bg-yellow-700 transition text-center w-full cursor-pointer"
                  >
                    Coming Soon
                  </a>
                </div>
              )
            }

            return (
              <ResourceCard
                key={resource.id}
                title={resource.title}
                type={resource.type === 'module' ? 'module' : 'workbook'}
                moduleNumber={resource.moduleNumber || 0}
                href={resource.href}
                pdfHref={resource.pdfHref}
                description={resource.description}
              />
            )
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-400">No resources found for this filter.</p>
          </div>
        )}
      </div>
    </main>
  )
}

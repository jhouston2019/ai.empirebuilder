import Link from 'next/link'

interface ModuleCardProps {
  title: string
  path: string
  plan: string
}

export default function ModuleCard({ title, path, plan }: ModuleCardProps) {
  const isFoundation = path.includes('foundation')
  const isPlanning = path.includes('planning')
  const allowed = plan === 'pro' || plan === 'elite' || isFoundation || isPlanning

  return (
    <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-700 text-white">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {allowed ? (
        <Link href={path} className="text-yellow-400 underline hover:text-yellow-300 transition">
          Open Module →
        </Link>
      ) : (
        <div className="opacity-60">
          <span className="block mb-2">🔒 Locked</span>
          <Link href="/upgrade" className="block text-purple-400 underline hover:text-purple-300 transition mt-1">
            Upgrade to Unlock
          </Link>
        </div>
      )}
    </div>
  )
}


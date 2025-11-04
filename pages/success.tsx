import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Success() {
  const router = useRouter()
  const [plan, setPlan] = useState<string>('')

  useEffect(() => {
    if (router.isReady) {
      setPlan((router.query.plan as string) || '')
    }
  }, [router.isReady, router.query])

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-4">Payment Successful!</h1>
          {plan && (
            <p className="text-lg mb-2">
              You've upgraded to the <strong className="text-purple-400">{plan.toUpperCase()}</strong> plan!
            </p>
          )}
        </div>
        <p className="mb-8 text-neutral-300">
          Your plan has been activated. You now have access to all your modules.
        </p>
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-block bg-purple-600 px-8 py-3 rounded-md text-lg hover:bg-purple-700 transition"
          >
            Go to Dashboard
          </Link>
          <div>
            <Link
              href="/upgrade"
              className="text-purple-400 underline hover:text-purple-300 transition text-sm"
            >
              View All Plans
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}


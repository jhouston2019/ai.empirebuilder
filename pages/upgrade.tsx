import Link from 'next/link'

export default function Upgrade() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-yellow-400">Upgrade Your Access</h1>
        <p className="mb-8 text-center max-w-md mx-auto text-neutral-300">
          You currently have access to the <strong className="text-yellow-400">Starter Plan</strong> (Foundation + Planning Modules).
          Upgrade to unlock the full Resource Center, advanced modules, and scaling systems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-neutral-900 border border-neutral-700 rounded-xl">
            <h2 className="text-2xl font-semibold mb-2 text-purple-400">Builder Plan</h2>
            <p className="text-3xl font-bold mb-4 text-white">$297</p>
            <ul className="text-left mb-6 space-y-2 text-neutral-300">
              <li>✅ All Starter features</li>
              <li>✅ All modules unlocked</li>
              <li>✅ Resource Center access</li>
              <li>✅ Advanced strategies</li>
            </ul>
            <a
              href="/api/checkout/builder"
              className="block w-full bg-purple-600 px-6 py-3 rounded-md text-lg hover:bg-purple-700 transition text-center"
            >
              Upgrade to Builder
            </a>
          </div>

          <div className="p-6 bg-neutral-900 border border-yellow-600 rounded-xl">
            <h2 className="text-2xl font-semibold mb-2 text-yellow-400">Elite Plan</h2>
            <p className="text-3xl font-bold mb-4 text-white">$997</p>
            <ul className="text-left mb-6 space-y-2 text-neutral-300">
              <li>✅ All Builder features</li>
              <li>✅ Priority support</li>
              <li>✅ Exclusive resources</li>
              <li>✅ Advanced scaling systems</li>
            </ul>
            <a
              href="/api/checkout/elite"
              className="block w-full bg-yellow-500 px-6 py-3 rounded-md text-lg hover:bg-yellow-600 transition text-center text-black font-semibold"
            >
              Upgrade to Elite
            </a>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="text-purple-400 underline hover:text-purple-300 transition"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  )
}


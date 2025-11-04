import Link from 'next/link'

export default function Cancel() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-red-400 mb-4">Payment Cancelled</h1>
        </div>
        <p className="mb-8 text-neutral-300">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-block bg-neutral-700 px-8 py-3 rounded-md text-lg hover:bg-neutral-600 transition"
          >
            Back to Dashboard
          </Link>
          <div>
            <Link
              href="/upgrade"
              className="text-purple-400 underline hover:text-purple-300 transition"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}


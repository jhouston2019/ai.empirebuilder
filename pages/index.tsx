import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold mb-6 text-yellow-400">AI Empire Builder</h1>
        <p className="text-xl mb-8 text-neutral-300">
          Build your AI-powered business empire with our comprehensive course modules
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-purple-600 px-8 py-3 rounded-md text-lg hover:bg-purple-700 transition"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="bg-neutral-700 px-8 py-3 rounded-md text-lg hover:bg-neutral-600 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}


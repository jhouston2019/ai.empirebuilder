import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to static HTML landing page
    // Using replace to avoid adding to history
    if (typeof window !== 'undefined') {
      window.location.replace('/index.html')
    }
  }, [router])

  return null
}


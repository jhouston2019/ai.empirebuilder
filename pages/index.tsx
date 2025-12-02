import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the HTML landing page
    router.replace('/index.html')
  }, [router])

  return null
}


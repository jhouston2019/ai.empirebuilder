import { useEffect, useState } from 'react'

interface ModuleViewerProps {
  modulePath: string
  title: string
}

export default function ModuleViewer({ modulePath, title }: ModuleViewerProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <div className="w-full h-full">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <p className="text-neutral-400">Loading module...</p>
        </div>
      ) : (
        <iframe
          src={modulePath}
          className="w-full h-screen border-0"
          title={title}
          style={{ minHeight: '800px' }}
        />
      )}
    </div>
  )
}


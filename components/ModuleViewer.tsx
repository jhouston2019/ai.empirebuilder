import { useEffect, useState } from 'react'

interface ModuleViewerProps {
  modulePath: string
  title: string
}

export default function ModuleViewer({ modulePath, title }: ModuleViewerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // URL encode the path to handle spaces and special characters
  const encodedPath = encodeURI(modulePath)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleIframeLoad = () => {
    setLoading(false)
    setError(null)
  }

  const handleIframeError = () => {
    setLoading(false)
    setError('Failed to load module. Please try refreshing the page.')
  }

  return (
    <div className="w-full h-full">
      {loading && (
        <div className="flex items-center justify-center h-96 bg-black">
          <p className="text-neutral-400">Loading module...</p>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center h-96 bg-black p-8">
          <p className="text-red-400 mb-4">{error}</p>
          <a
            href={encodedPath}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Open in New Tab
          </a>
        </div>
      )}
      <iframe
        src={encodedPath}
        className="w-full h-screen border-0"
        title={title}
        style={{ minHeight: '800px', display: error ? 'none' : 'block' }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
    </div>
  )
}


import Link from 'next/link'

interface ResourceCardProps {
  title: string
  type: 'module' | 'workbook'
  moduleNumber: number
  href: string
  pdfHref?: string
  description?: string
}

export default function ResourceCard({ title, type, moduleNumber, href, pdfHref, description }: ResourceCardProps) {
  const icon = type === 'module' ? '📘' : '📒'
  const badgeColor = type === 'module' ? 'bg-purple-600' : 'bg-yellow-600'
  
  // URL encode the href for proper handling of spaces
  const encodedHref = encodeURI(href)
  // Ensure PDF href is properly encoded and ends with .pdf
  const encodedPdfHref = pdfHref && pdfHref.endsWith('.pdf') ? encodeURI(pdfHref) : null
  const pdfFileName = pdfHref ? pdfHref.split('/').pop() : null
  
  return (
    <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-700 hover:border-purple-500 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`${badgeColor} px-2 py-1 rounded text-xs font-semibold`}>
                {type === 'module' ? 'Module' : 'Workbook'}
              </span>
              <span className="text-neutral-400 text-sm">#{moduleNumber}</span>
            </div>
            <h3 className="font-semibold text-lg text-white">{title}</h3>
          </div>
        </div>
      </div>
      
      {description && (
        <p className="text-neutral-400 text-sm mb-4">{description}</p>
      )}
      
      <div className="space-y-2">
        {href.endsWith('.html') ? (
          <a
            href={encodedHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 px-4 py-2 rounded-md text-sm hover:bg-purple-700 transition text-center w-full cursor-pointer"
          >
            Open {type === 'module' ? 'Module' : 'Workbook'} →
          </a>
        ) : (
          <Link
            href={href}
            className="inline-block bg-purple-600 px-4 py-2 rounded-md text-sm hover:bg-purple-700 transition text-center w-full cursor-pointer"
          >
            Open {type === 'module' ? 'Module' : 'Workbook'} →
          </Link>
        )}
        
        {encodedPdfHref && pdfFileName && (
          <a
            href={encodedPdfHref}
            download={pdfFileName}
            type="application/pdf"
            className="inline-block bg-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-700 transition text-center w-full cursor-pointer flex items-center justify-center gap-2"
          >
            <span>📄</span>
            Download PDF
          </a>
        )}
      </div>
    </div>
  )
}


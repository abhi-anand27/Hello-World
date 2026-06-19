import React, { useState, useEffect } from 'react'
import { X, ExternalLink, BookOpen, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'

const LOCAL_PDF = '/ficci-ey-2026.pdf'
const CDN_PDF   = 'https://assets.ey.com/content/dam/ey-sites/ey-com/en_in/topics/media-entertainment/2026/ey-ficci-media-entertainment-report-2026.pdf'

export default function FICCIPDFModal({ page, onClose }) {
  const [localOk, setLocalOk] = useState(null) // null = checking, true/false
  const [currentPage, setCurrentPage] = useState(page)

  // verify the local PDF is reachable (fails in standalone HTML mode)
  useEffect(() => {
    setCurrentPage(page)
  }, [page])

  useEffect(() => {
    if (localOk !== null) return
    fetch(LOCAL_PDF, { method: 'HEAD' })
      .then(r => setLocalOk(r.ok))
      .catch(() => setLocalOk(false))
  }, [localOk])

  const pdfSrc = localOk
    ? `${LOCAL_PDF}#page=${currentPage}`
    : null

  const openExternal = () =>
    window.open(`${CDN_PDF}#page=${currentPage}`, '_blank', 'noopener')

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.82)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="flex flex-col bg-ndtv-card border border-ndtv-border rounded-xl shadow-2xl"
        style={{ width: '92vw', maxWidth: 1100, height: '92vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ndtv-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <BookOpen size={16} className="text-ndtv-red" />
            <div>
              <span className="font-semibold text-sm text-white">FICCI-EY 2026 Report</span>
              <span className="text-gray-400 text-xs ml-2">— p.{currentPage}</span>
            </div>
            <span className="text-xs text-gray-500 hidden sm:block">"Stories, scale and impact: Unlocking India's media and entertainment economy"</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Page nav */}
            <div className="flex items-center gap-1 bg-ndtv-dark border border-ndtv-border rounded-lg px-2 py-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="text-gray-400 hover:text-white transition-colors p-0.5">
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs text-gray-300 w-12 text-center">p.{currentPage} / 323</span>
              <button onClick={() => setCurrentPage(p => Math.min(323, p + 1))}
                className="text-gray-400 hover:text-white transition-colors p-0.5">
                <ChevronRight size={14} />
              </button>
            </div>
            <button onClick={openExternal} title="Open in new tab"
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 border border-ndtv-border rounded-lg px-2 py-1 transition-colors">
              <ExternalLink size={12} /> Open tab
            </button>
            <button onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-ndtv-border/50">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden rounded-b-xl">
          {localOk === null && (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400 text-sm">Checking PDF availability…</div>
            </div>
          )}

          {localOk === true && (
            <iframe
              key={currentPage}
              src={pdfSrc}
              className="w-full h-full border-0"
              title={`FICCI-EY 2026 p.${currentPage}`}
            />
          )}

          {localOk === false && (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
              <AlertCircle size={40} className="text-amber-400" />
              <div>
                <p className="text-white font-medium mb-1">PDF not available in standalone mode</p>
                <p className="text-gray-400 text-sm max-w-md">
                  The embedded viewer requires the local dev server. You can open the report
                  directly in a new browser tab — it will jump to page {currentPage}.
                </p>
              </div>
              <button onClick={openExternal}
                className="flex items-center gap-2 bg-ndtv-red hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
                <ExternalLink size={14} />
                Open FICCI-EY 2026 Report — p.{currentPage}
              </button>
              <p className="text-xs text-gray-600">
                Source: EY India — assets.ey.com
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

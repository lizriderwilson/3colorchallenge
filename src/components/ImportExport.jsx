import { useRef, useState } from 'react'
import { exportToJSON, importFromJSON } from '../utils/exportImport'

export function ImportExport({ supplies, onMerge }) {
  const fileInputRef = useRef(null)
  const [error, setError] = useState('')

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''
    try {
      const parsed = await importFromJSON(file)
      onMerge(parsed)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex gap-2 flex-wrap items-center">
      <button
        className="inline-flex items-center gap-1.5 bg-white text-ink border-[1.5px] border-border-dark rounded-lg px-3.5 py-2 text-[13px] font-medium min-h-[40px] hover:border-ink hover:bg-paper disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        onClick={() => exportToJSON(supplies)}
        disabled={supplies.length === 0}
      >
        <DownloadIcon /> Export JSON
      </button>
      <button
        className="inline-flex items-center gap-1.5 bg-white text-ink border-[1.5px] border-border-dark rounded-lg px-3.5 py-2 text-[13px] font-medium min-h-[40px] hover:border-ink hover:bg-paper transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadIcon /> Import JSON
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p className="text-[13px] text-red-600 flex items-center gap-1.5 w-full">
          {error}
          <button
            className="bg-transparent border-0 cursor-pointer opacity-60 hover:opacity-100 text-base leading-none"
            onClick={() => setError('')}
          >
            ×
          </button>
        </p>
      )}
    </div>
  )
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  )
}

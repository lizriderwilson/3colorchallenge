import { useState } from 'react'
import { parseInput } from '../utils/parseInput'

function SwatchesIllustration() {
  return (
    <svg width="148" height="108" viewBox="0 0 148 108" fill="none" aria-hidden="true">
      {/* Gold swatch — left, fanned CCW */}
      <rect x="16" y="16" width="38" height="62" rx="9" fill="#D4A843" transform="rotate(-18 35 78)"/>
      <rect x="16" y="16" width="38" height="18" rx="9" fill="#B8902E" transform="rotate(-18 35 78)"/>
      {/* Teal swatch — center, upright */}
      <rect x="55" y="8" width="38" height="70" rx="9" fill="#2C6E8A"/>
      <rect x="55" y="8" width="38" height="18" rx="9" fill="#235A72"/>
      {/* Terra swatch — right, fanned CW */}
      <rect x="94" y="16" width="38" height="62" rx="9" fill="#C1440E" transform="rotate(18 113 78)"/>
      <rect x="94" y="16" width="38" height="18" rx="9" fill="#A03A0C" transform="rotate(18 113 78)"/>
      {/* Three pick dots at base */}
      <circle cx="57" cy="100" r="4.5" fill="#D4A843" opacity="0.7"/>
      <circle cx="74" cy="103" r="4.5" fill="#2C6E8A" opacity="0.7"/>
      <circle cx="91" cy="100" r="4.5" fill="#C1440E" opacity="0.7"/>
    </svg>
  )
}

export function SupplyInput({ supplies, onAdd }) {
  const [text, setText] = useState('')
  const [duplicateWarning, setDuplicateWarning] = useState([])

  const isOnboarding = supplies.length === 0

  function handleSubmit(e) {
    e.preventDefault()
    const names = parseInput(text)
    if (names.length === 0) return

    const existingLower = new Set(supplies.map(s => s.name.toLowerCase()))
    const dupes = names.filter(n => existingLower.has(n.toLowerCase()))
    const fresh = names.filter(n => !existingLower.has(n.toLowerCase()))

    if (fresh.length > 0) onAdd(fresh)
    if (dupes.length > 0) setDuplicateWarning(dupes)
    else setDuplicateWarning([])
    if (fresh.length > 0) setText('')
  }

  return (
    <div className="flex flex-col gap-3">
      {isOnboarding ? (
        <div className="flex flex-col items-center gap-4 pt-4">
          <SwatchesIllustration />
          <div className="text-center">
            <h2 className="font-display text-xl font-semibold text-ink">Your Art Supplies</h2>
            <p className="text-sm text-ink-muted mt-1">
              Paste your supplies below — one per line or comma-separated.
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-ink-muted">
          Add More Supplies
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <textarea
          className="w-full border-[1.5px] border-border-dark rounded-xl px-3.5 py-3 text-sm text-ink bg-white resize-y outline-none focus:border-terra transition-colors leading-relaxed placeholder:text-ink-faint"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={isOnboarding
            ? 'e.g. Cadmium Red, Prussian Blue\nBurnt Sienna\nTitanium White'
            : 'Add more supplies…'}
          rows={isOnboarding ? 6 : 3}
        />
        <button
          type="submit"
          className="bg-terra text-white rounded-lg px-5 py-2.5 text-sm font-medium min-h-[44px] hover:bg-terra-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          disabled={!text.trim()}
        >
          {isOnboarding ? 'Add Supplies' : 'Add'}
        </button>
      </form>

      {duplicateWarning.length > 0 && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-amber-800">
          <span className="flex-1">
            Already in your list (skipped):{' '}
            <strong>{duplicateWarning.join(', ')}</strong>
          </span>
          <button
            className="bg-transparent border-0 cursor-pointer text-base leading-none opacity-60 hover:opacity-100 px-0.5 flex-shrink-0"
            onClick={() => setDuplicateWarning([])}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

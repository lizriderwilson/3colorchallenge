import { useState, useEffect } from 'react'
import { pickRandom, pickByCategory, emptyCategoryBuckets } from '../utils/randomPicker'

const COUNT_KEY = 'art-supplies-count'
const CAT_MODE_KEY = 'art-supplies-cat-mode'

const CATEGORY_STYLES = {
  highlight: 'bg-amber-100 text-amber-700 border-amber-300',
  midtone:   'bg-sky-100 text-sky-700 border-sky-300',
  shadow:    'bg-slate-600 text-slate-100 border-slate-500',
}

function loadCount() {
  const n = parseInt(localStorage.getItem(COUNT_KEY), 10)
  return n >= 1 && n <= 16 ? n : 3
}

function loadCatMode() {
  return localStorage.getItem(CAT_MODE_KEY) === 'true'
}

export function PalettePicker({ supplies, onSaveFavorite }) {
  const [count, setCount] = useState(loadCount)
  const [useCats, setUseCats] = useState(loadCatMode)
  const [picks, setPicks] = useState([])
  const [saving, setSaving] = useState(false)
  const [favName, setFavName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => { localStorage.setItem(COUNT_KEY, count) }, [count])
  useEffect(() => { localStorage.setItem(CAT_MODE_KEY, useCats) }, [useCats])

  const canPick = supplies.length >= count
  const emptyBuckets = useCats ? emptyCategoryBuckets(supplies) : []
  const catCounts = {
    highlight: supplies.filter(s => s.category === 'highlight').length,
    midtone:   supplies.filter(s => s.category === 'midtone').length,
    shadow:    supplies.filter(s => s.category === 'shadow').length,
  }

  function handlePick() {
    const result = useCats
      ? pickByCategory(supplies, count)
      : pickRandom(supplies, count)
    setPicks(result)
    setSaving(false)
    setFavName('')
    setSaved(false)
  }

  function handleSave(e) {
    e.preventDefault()
    const name = favName.trim()
    if (!name) return
    onSaveFavorite(name, picks)
    setSaved(true)
    setSaving(false)
    setFavName('')
  }

  const gridCols = picks.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'

  return (
    <div className="bg-white border-[1.5px] border-border rounded-xl p-6 flex flex-col gap-4">

      {/* Count slider */}
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">Pick Random Colors</h2>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-medium uppercase tracking-[0.08em] text-ink-muted">
              How many?
            </label>
            <span className="text-sm font-semibold text-ink tabular-nums">{count}</span>
          </div>
          <input
            type="range" min={1} max={16} value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full accent-terra cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-ink-faint">
            <span>1</span><span>16</span>
          </div>
        </div>
      </div>

      {/* Category mode toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          className="w-4 h-4 accent-terra cursor-pointer"
          checked={useCats}
          onChange={e => setUseCats(e.target.checked)}
        />
        <span className="text-sm text-ink-muted">Use highlight / midtone / shadow categories</span>
      </label>

      {/* Category mode detail */}
      {useCats && (
        <div className="flex flex-col gap-2 animate-fade-slide-in">
          {/* Bucket counts */}
          <div className="flex gap-2 flex-wrap">
            {(['highlight', 'midtone', 'shadow']).map(cat => (
              <span
                key={cat}
                className={`text-[11px] font-semibold rounded-full px-2.5 py-0.5 border ${CATEGORY_STYLES[cat]}`}
              >
                {catCounts[cat]} {cat}
              </span>
            ))}
          </div>

          {/* Warnings for empty buckets */}
          {emptyBuckets.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {emptyBuckets.map(cat => (
                <p key={cat} className="text-[13px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  No <strong>{cat}s</strong> assigned — use the{' '}
                  <span className={`text-[10px] font-semibold rounded px-1 py-0.5 border inline-block align-middle ${CATEGORY_STYLES[cat]}`}>
                    {cat === 'highlight' ? 'H' : cat === 'midtone' ? 'M' : 'S'}
                  </span>
                  {' '}badge on supplies in your list to assign some.
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Not enough supplies warning */}
      {!canPick && (
        <p className="text-sm text-teal bg-teal-light border border-teal-border rounded-lg px-3.5 py-2.5">
          You need {count - supplies.length} more {count - supplies.length === 1 ? 'supply' : 'supplies'} — add more to your list or lower the slider.
        </p>
      )}

      <button
        className="flex items-center justify-center gap-2 bg-terra text-white rounded-[10px] px-6 py-3.5 text-[15px] font-medium min-h-[48px] hover:bg-terra-dark active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer w-full"
        onClick={handlePick}
        disabled={!canPick}
      >
        <DiceIcon />
        Pick {count} Random {count === 1 ? 'Color' : 'Colors'}
      </button>

      {/* Results */}
      {picks.length > 0 && (
        <div className="flex flex-col gap-3 animate-fade-slide-in">
          <div className={`grid ${gridCols} gap-2.5`}>
            {picks.map(supply => (
              <div
                key={supply.id}
                className="flex flex-col items-center gap-2 p-3 bg-paper border-[1.5px] border-border rounded-[10px]"
              >
                <div
                  className="w-12 h-12 rounded-full border-2 border-black/[0.06] flex-shrink-0"
                  style={{ background: supply.colorHex || '#C8C4BC' }}
                />
                <span className="text-[12px] text-ink font-medium text-center leading-tight">
                  {supply.name}
                </span>
                {supply.category && (
                  <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 border ${CATEGORY_STYLES[supply.category]}`}>
                    {supply.category}
                  </span>
                )}
              </div>
            ))}
          </div>

          {saved ? (
            <p className="text-sm text-teal font-medium">Saved to favorites ✓</p>
          ) : saving ? (
            <form className="flex gap-2 items-center flex-wrap" onSubmit={handleSave}>
              <input
                className="flex-1 min-w-0 border-[1.5px] border-border-dark rounded-lg px-3 py-2 text-sm text-ink bg-white min-h-[40px] outline-none focus:border-terra transition-colors"
                value={favName}
                onChange={e => setFavName(e.target.value)}
                placeholder="Name this palette…"
                autoFocus
              />
              <button
                type="submit"
                className="bg-terra text-white rounded-lg px-4 py-2 text-sm font-medium min-h-[40px] hover:bg-terra-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                disabled={!favName.trim()}
              >Save</button>
              <button
                type="button"
                className="text-ink-muted text-sm px-3 py-2 min-h-[40px] rounded-lg hover:text-ink hover:bg-paper transition-colors cursor-pointer bg-transparent border-0"
                onClick={() => setSaving(false)}
              >Cancel</button>
            </form>
          ) : (
            <button
              className="inline-flex items-center gap-1.5 bg-white text-ink border-[1.5px] border-border-dark rounded-lg px-3.5 py-2 text-[13px] font-medium min-h-[40px] hover:border-ink hover:bg-paper transition-colors cursor-pointer self-start"
              onClick={() => setSaving(true)}
            >
              <StarIcon /> Save as Favorite
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function DiceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="3"/>
      <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

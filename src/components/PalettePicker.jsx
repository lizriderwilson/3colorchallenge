import { useState, useEffect } from 'react'
import { pickRandom, pickByCategory, smartDistribute, evenDistribute } from '../utils/randomPicker'
import { encodeShareLink } from '../utils/shareLink'

const COUNT_KEY      = 'art-supplies-count'
const CAT_MODE_KEY   = 'art-supplies-cat-mode'
const CAT_COUNTS_KEY = 'art-supplies-cat-counts'

const CATEGORY_STYLES = {
  highlight: 'bg-amber-100 text-amber-700 border-amber-200',
  midtone:   'bg-rose-100 text-rose-700 border-amber-200',
  shadow:    'bg-cyan-100 text-cyan-700 border-cyan-200',
}
const BADGE_LABELS = { highlight: 'H', midtone: 'M', shadow: 'S' }

function loadCount() {
  const n = parseInt(localStorage.getItem(COUNT_KEY), 10)
  return n >= 1 && n <= 16 ? n : 3
}
function loadCatMode() {
  return localStorage.getItem(CAT_MODE_KEY) === 'true'
}
function loadCatCounts() {
  try {
    const raw = localStorage.getItem(CAT_COUNTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return evenDistribute(3)
}

export function PalettePicker({ supplies, onSaveFavorite }) {
  const [count, setCount]         = useState(loadCount)
  const [useCats, setUseCats]     = useState(loadCatMode)
  const [catCounts, setCatCounts] = useState(loadCatCounts)
  const [picks, setPicks]         = useState([])
  const [saving, setSaving]       = useState(false)
  const [favName, setFavName]     = useState('')
  const [saved, setSaved]         = useState(false)
  const [copied, setCopied]       = useState(false)

  useEffect(() => { localStorage.setItem(COUNT_KEY, count) }, [count])
  useEffect(() => { localStorage.setItem(CAT_MODE_KEY, useCats) }, [useCats])
  useEffect(() => { localStorage.setItem(CAT_COUNTS_KEY, JSON.stringify(catCounts)) }, [catCounts])

  // Per-category availability
  const available = {
    highlight: supplies.filter(s => s.category === 'highlight').length,
    midtone:   supplies.filter(s => s.category === 'midtone').length,
    shadow:    supplies.filter(s => s.category === 'shadow').length,
  }
  const categorizedCount = available.highlight + available.midtone + available.shadow

  // Clamp counts when supplies are removed
  useEffect(() => {
    if (!useCats) {
      setCount(c => Math.min(c, Math.max(1, supplies.length)))
    } else {
      setCatCounts(prev => ({
        highlight: Math.min(prev.highlight, available.highlight),
        midtone:   Math.min(prev.midtone,   available.midtone),
        shadow:    Math.min(prev.shadow,     available.shadow),
      }))
    }
  }, [supplies.length, available.highlight, available.midtone, available.shadow, useCats])

  const totalCatCount = catCounts.highlight + catCounts.midtone + catCounts.shadow
  const sliderMax     = Math.min(16, useCats ? categorizedCount : supplies.length)
  const sliderValue   = useCats ? totalCatCount : count
  const totalCount    = sliderValue

  // "Even" in category mode means smart-distributed given current availability
  const smartEven = smartDistribute(totalCatCount, available)
  const isEven = catCounts.highlight === smartEven.highlight
    && catCounts.midtone === smartEven.midtone
    && catCounts.shadow  === smartEven.shadow

  const canPick = useCats ? totalCatCount > 0 : count >= 1

  function handleToggleCats(enabled) {
    if (enabled) {
      setCatCounts(smartDistribute(count, available))
    } else {
      setCount(Math.max(1, Math.min(16, totalCatCount)))
    }
    setUseCats(enabled)
    setPicks([])
  }

  function handleSlider(newVal) {
    if (useCats) {
      if (newVal !== totalCatCount) setCatCounts(smartDistribute(newVal, available))
    } else {
      setCount(newVal)
    }
  }

  function handleCatCount(cat, newVal) {
    setCatCounts(prev => ({ ...prev, [cat]: Math.max(0, newVal) }))
  }

  function handlePick() {
    const result = useCats
      ? pickByCategory(supplies, catCounts)
      : pickRandom(supplies, count)
    setPicks(result)
    setSaving(false)
    setFavName('')
    setSaved(false)
    setCopied(false)
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(encodeShareLink(picks)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.code !== 'Space' || e.repeat) return
      const tag = document.activeElement?.tagName.toLowerCase()
      if (['input', 'textarea', 'select', 'button'].includes(tag)) return
      if (document.activeElement?.isContentEditable) return
      e.preventDefault()
      if (canPick) handlePick()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [canPick, useCats, count, catCounts, supplies])

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
    <div className="bg-white border-[1.5px] border-slate-200 rounded-xl p-6 flex flex-col gap-4">

      {/* Title + slider */}
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-slate-900">Pick Random Colors ✨</h2>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
              How many?
            </label>
            <span className="text-sm font-semibold text-slate-900 tabular-nums">{sliderValue}</span>
          </div>
          <input
            type="range" min={1} max={Math.max(1, sliderMax)} value={Math.min(sliderValue, sliderMax)}
            onChange={e => handleSlider(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>1</span><span>{Math.max(1, sliderMax)}</span>
          </div>
        </div>
      </div>

      {/* Category mode toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          className="w-4 h-4 accent-cyan-500 cursor-pointer"
          checked={useCats}
          onChange={e => handleToggleCats(e.target.checked)}
        />
        <span className="text-sm text-slate-500">Use highlight / midtone / shadow categories</span>
      </label>

      {/* Per-category steppers */}
      {useCats && (
        <div className="flex flex-col gap-3 animate-fade-slide-in">
          {categorizedCount === 0 ? (
            <p className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5">
              No supplies have categories assigned yet. Use the H / M / S badges in your supply list to assign some.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                {['highlight', 'midtone', 'shadow'].map(cat => {
                  const avail = available[cat]
                  const val   = catCounts[cat]

                  return (
                    <div key={cat} className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold rounded px-1.5 py-0.5 border flex-shrink-0 ${CATEGORY_STYLES[cat]}`}>
                        {BADGE_LABELS[cat]}
                      </span>
                      <span className="text-sm text-slate-900 capitalize flex-1">{cat}</span>
                      <span className="text-xs text-slate-400">{avail} available</span>

                      <div className="flex items-center border-[1.5px] border-slate-300 rounded-lg overflow-hidden flex-shrink-0">
                        <button
                          className="px-2.5 py-1.5 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0 cursor-pointer"
                          onClick={() => handleCatCount(cat, val - 1)}
                          disabled={val <= 0}
                        >−</button>
                        <span className="px-2.5 text-sm font-semibold text-slate-900 min-w-[2rem] text-center tabular-nums select-none">
                          {val}
                        </span>
                        <button
                          className="px-2.5 py-1.5 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0 cursor-pointer"
                          onClick={() => handleCatCount(cat, val + 1)}
                          disabled={val >= avail || totalCatCount >= sliderMax}
                        >+</button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {!isEven && (
                <button
                  className="text-xs text-slate-500 hover:text-slate-900 underline bg-transparent border-0 cursor-pointer self-start"
                  onClick={() => setCatCounts(smartDistribute(totalCatCount, available))}
                >
                  Reset to even distribution
                </button>
              )}
            </>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <button
          className="flex items-center justify-center gap-2 bg-cyan-500 text-white rounded-[10px] px-6 py-3.5 text-[15px] font-medium min-h-[48px] hover:bg-cyan-600 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer w-full"
          onClick={handlePick}
          disabled={!canPick}
        >
          <DiceIcon />
          Pick {totalCount} Random {totalCount === 1 ? 'Color' : 'Colors'}
        </button>
        {canPick && (
          <p className="text-center text-[11px] text-slate-400 hidden sm:block select-none">
            or press <kbd className="font-mono text-[10px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5">Space</kbd>
          </p>
        )}
      </div>

      {/* Results */}
      {picks.length > 0 && (
        <div className="flex flex-col gap-3 animate-fade-slide-in">
          <div className={`grid ${gridCols} gap-2.5`}>
            {picks.map(supply => (
              <div
                key={supply.id}
                className="flex flex-col items-center gap-2 p-3 bg-slate-50 border-[1.5px] border-slate-200 rounded-[10px]"
              >
                <div
                  className="w-12 h-12 rounded-full border-2 border-black/[0.06] flex-shrink-0"
                  style={{ background: supply.colorHex || '#C8C4BC' }}
                />
                <span className="text-[12px] text-slate-900 font-medium text-center leading-tight">
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
            <p className="text-sm text-cyan-600 font-medium">🎉 Saved to favorites!</p>
          ) : saving ? (
            <form className="flex gap-2 items-center flex-wrap" onSubmit={handleSave}>
              <input
                className="flex-1 min-w-0 border-[1.5px] border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white min-h-[40px] outline-none focus:border-cyan-500 transition-colors"
                value={favName}
                onChange={e => setFavName(e.target.value)}
                placeholder="Name this palette…"
                autoFocus
              />
              <button
                type="submit"
                className="bg-cyan-500 text-white rounded-lg px-4 py-2 text-sm font-medium min-h-[40px] hover:bg-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                disabled={!favName.trim()}
              >Save</button>
              <button
                type="button"
                className="text-slate-500 text-sm px-3 py-2 min-h-[40px] rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer bg-transparent border-0"
                onClick={() => setSaving(false)}
              >Cancel</button>
            </form>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <button
                className="inline-flex items-center gap-1.5 bg-white text-slate-900 border-[1.5px] border-slate-300 rounded-lg px-3.5 py-2 text-[13px] font-medium min-h-[40px] hover:border-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setSaving(true)}
              >
                <StarIcon /> Save as Favorite
              </button>
              <button
                className="inline-flex items-center gap-1.5 bg-white text-slate-900 border-[1.5px] border-slate-300 rounded-lg px-3.5 py-2 text-[13px] font-medium min-h-[40px] hover:border-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={handleCopyLink}
              >
                <LinkIcon /> {copied ? 'Copied!' : 'Copy Share Link'}
              </button>
            </div>
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

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
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

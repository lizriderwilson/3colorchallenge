import { useState } from 'react'

export function FavoritesList({ favorites, onRemove }) {
  const [open, setOpen] = useState(false)

  if (favorites.length === 0) return null

  return (
    <div className="flex flex-col">
      <button
        className="flex items-center gap-2 bg-transparent border-[1.5px] border-border rounded-[10px] px-4 py-3 text-sm font-medium text-ink cursor-pointer w-full text-left hover:border-border-dark hover:bg-white transition-colors min-h-[44px]"
        onClick={() => setOpen(o => !o)}
      >
        <StarIcon />
        <span className="flex-1">Saved Palettes ({favorites.length})</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="flex flex-col gap-2 mt-2 animate-fade-slide-in">
          {favorites.map(fav => (
            <div
              key={fav.id}
              className="bg-white border-[1.5px] border-border rounded-[10px] px-4 py-3.5 flex flex-col gap-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="flex-1 text-sm font-medium text-ink">{fav.name}</span>
                <span className="text-xs text-ink-faint">
                  {new Date(fav.createdAt).toLocaleDateString()}
                </span>
                <button
                  className="flex items-center justify-center bg-transparent border-0 cursor-pointer text-ink-muted w-10 h-10 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors flex-shrink-0"
                  onClick={() => onRemove(fav.id)}
                  title="Delete favorite"
                >
                  <TrashIcon />
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                {fav.picks.map(p => (
                  <div key={p.id} className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0 block"
                      style={{ background: p.colorHex || '#C8C4BC' }}
                    />
                    <span className="text-[13px] text-ink-muted">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}

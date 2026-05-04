import { useState, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const CATEGORY_CYCLE = [null, 'highlight', 'midtone', 'shadow']

const BADGE_STYLES = {
  highlight: 'bg-amber-100 text-amber-700 border-amber-300',
  midtone:   'bg-sky-100 text-sky-700 border-sky-300',
  shadow:    'bg-slate-600 text-slate-100 border-slate-500',
}

const BADGE_LABELS = { highlight: 'H', midtone: 'M', shadow: 'S' }

function CategoryBadge({ category, onCycle }) {
  const next = CATEGORY_CYCLE[(CATEGORY_CYCLE.indexOf(category) + 1) % CATEGORY_CYCLE.length]
  const title = category
    ? `${category} — click to change to ${next ?? 'none'}`
    : 'Assign category'

  if (!category) {
    return (
      <button
        className="text-[10px] font-medium rounded px-1.5 py-0.5 border border-dashed border-ink-faint text-ink-faint hover:border-ink-muted hover:text-ink-muted transition-colors cursor-pointer bg-transparent whitespace-nowrap"
        onClick={onCycle}
        title={title}
      >
        + cat
      </button>
    )
  }

  return (
    <button
      className={`text-[10px] font-semibold rounded px-1.5 py-0.5 border cursor-pointer hover:opacity-70 transition-opacity ${BADGE_STYLES[category]}`}
      onClick={onCycle}
      title={title}
    >
      {BADGE_LABELS[category]}
    </button>
  )
}

export function SupplyCard({ supply, onRemove, onRename, onSetColor, onSetCategory }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(supply.name)
  const colorInputRef = useRef(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: supply.id })

  function handleSave() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== supply.name) onRename(supply.id, trimmed)
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') { setDraft(supply.name); setEditing(false) }
  }

  function cycleCategory() {
    const next = CATEGORY_CYCLE[(CATEGORY_CYCLE.indexOf(supply.category) + 1) % CATEGORY_CYCLE.length]
    onSetCategory(supply.id, next)
  }

  const hasColor = Boolean(supply.colorHex)

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-lg min-h-[44px] hover:bg-paper transition-colors ${isDragging ? 'opacity-50 bg-paper z-10 shadow-md' : ''}`}
    >

      {/* Drag handle */}
      <button
        className="flex-shrink-0 text-ink-faint hover:text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none bg-transparent border-0 p-0.5 -ml-0.5"
        {...attributes}
        {...listeners}
        tabIndex={-1}
        aria-label="Drag to reorder"
      >
        <GripIcon />
      </button>

      {/* Swatch — click to open color picker */}
      <button
        className="relative flex-shrink-0 w-[18px] h-[18px] rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-terra"
        style={{ background: hasColor ? supply.colorHex : 'transparent' }}
        onClick={() => colorInputRef.current?.click()}
        title={hasColor ? 'Change color' : 'Set color'}
        aria-label={hasColor ? `Change color` : 'Set color'}
      >
        <span
          className={`absolute inset-0 rounded-full ${
            hasColor ? 'border border-black/10' : 'border-2 border-dashed border-border-dark'
          }`}
        />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <PaintIcon />
        </span>
      </button>

      <input
        ref={colorInputRef}
        type="color"
        className="sr-only"
        value={supply.colorHex || '#808080'}
        onChange={e => onSetColor(supply.id, e.target.value)}
      />

      {/* Name / rename input */}
      {editing ? (
        <input
          className="flex-1 border-[1.5px] border-terra rounded-md px-2 py-1 text-sm text-ink bg-white outline-none min-w-0"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <span className="flex-1 text-sm text-ink min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
          {supply.name}
        </span>
      )}

      {/* "Set color" prompt — only when no color */}
      {!hasColor && !editing && (
        <button
          className="text-[11px] text-terra font-medium whitespace-nowrap hover:underline bg-transparent border-0 cursor-pointer px-0 shrink-0"
          onClick={() => colorInputRef.current?.click()}
        >
          Set color
        </button>
      )}

      {/* Category badge — always visible when assigned, hover-only when not */}
      {supply.category ? (
        <CategoryBadge category={supply.category} onCycle={cycleCategory} />
      ) : (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <CategoryBadge category={null} onCycle={cycleCategory} />
        </div>
      )}

      {/* Edit / delete actions — hover only */}
      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex-shrink-0">
        {editing ? (
          <>
            <button
              className="flex items-center justify-center bg-transparent border-0 cursor-pointer text-ink-muted w-[30px] h-[30px] rounded-md hover:bg-paper hover:text-ink transition-colors text-sm"
              onClick={handleSave} title="Save"
            >✓</button>
            <button
              className="flex items-center justify-center bg-transparent border-0 cursor-pointer text-ink-muted w-[30px] h-[30px] rounded-md hover:bg-paper hover:text-ink transition-colors text-sm"
              onClick={() => { setDraft(supply.name); setEditing(false) }} title="Cancel"
            >✕</button>
          </>
        ) : (
          <>
            <button
              className="flex items-center justify-center bg-transparent border-0 cursor-pointer text-ink-muted w-[30px] h-[30px] rounded-md hover:bg-paper hover:text-ink transition-colors"
              onClick={() => { setDraft(supply.name); setEditing(true) }} title="Rename"
            ><PencilIcon /></button>
            <button
              className="flex items-center justify-center bg-transparent border-0 cursor-pointer text-ink-muted w-[30px] h-[30px] rounded-md hover:bg-red-50 hover:text-red-700 transition-colors"
              onClick={() => onRemove(supply.id)} title="Remove"
            ><TrashIcon /></button>
          </>
        )}
      </div>
    </div>
  )
}

function GripIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
      <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
      <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
    </svg>
  )
}

function PaintIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20M7 16l5-12 5 12M9.5 10h5"/>
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
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

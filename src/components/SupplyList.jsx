import { SupplyCard } from './SupplyCard'

export function SupplyList({ supplies, onRemove, onRename, onSetColor, onSetCategory }) {
  if (supplies.length === 0) return null

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between mb-2.5">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-ink-muted">
          Your Supplies
        </p>
        <span className="text-xs text-ink-faint font-medium">
          {supplies.length} {supplies.length === 1 ? 'supply' : 'supplies'}
        </span>
      </div>
      <div className="flex flex-col gap-1 max-h-[360px] overflow-y-auto border-[1.5px] border-border rounded-xl p-1.5 bg-white styled-scroll">
        {supplies.map(s => (
          <SupplyCard
            key={s.id}
            supply={s}
            onRemove={onRemove}
            onRename={onRename}
            onSetColor={onSetColor}
            onSetCategory={onSetCategory}
          />
        ))}
      </div>
    </div>
  )
}

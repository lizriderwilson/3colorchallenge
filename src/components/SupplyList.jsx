import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { SupplyCard } from './SupplyCard'

export function SupplyList({ supplies, onRemove, onRename, onSetColor, onSetCategory, onReorder }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  if (supplies.length === 0) return null

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = supplies.findIndex(s => s.id === active.id)
    const newIndex = supplies.findIndex(s => s.id === over.id)
    onReorder(arrayMove(supplies, oldIndex, newIndex))
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between mb-2.5">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
          Your Supplies
        </p>
        <span className="text-xs text-slate-400 font-medium">
          {supplies.length} {supplies.length === 1 ? 'supply' : 'supplies'}
        </span>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={supplies.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1 max-h-[360px] overflow-y-auto border-[1.5px] border-slate-200 rounded-xl p-1.5 bg-white styled-scroll">
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
        </SortableContext>
      </DndContext>
    </div>
  )
}

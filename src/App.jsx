import { useSupplies } from './hooks/useSupplies'
import { useFavorites } from './hooks/useFavorites'
import { SupplyInput } from './components/SupplyInput'
import { SupplyList } from './components/SupplyList'
import { PalettePicker } from './components/PalettePicker'
import { ImportExport } from './components/ImportExport'
import { FavoritesList } from './components/FavoritesList'

export default function App() {
  const { supplies, addSupplies, removeSupply, renameSupply, patchSupply, replaceAll } = useSupplies()
  const { favorites, addFavorite, removeFavorite } = useFavorites()

  function handleMerge(incoming) {
    const existingNames = new Set(supplies.map(s => s.name.toLowerCase()))
    const fresh = incoming.filter(s => s.name && !existingNames.has(s.name.toLowerCase()))
    addSupplies(fresh.map(s => s.name))
  }

  return (
    <div className="max-w-[640px] mx-auto px-4 pb-20 min-h-screen">
      <header className="flex items-center justify-between gap-3 py-6 border-b-[1.5px] border-border mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex gap-[3px] items-end" aria-hidden="true">
            <span className="block w-2.5 rounded-t-sm" style={{ height: 22, background: '#C1440E' }} />
            <span className="block w-2.5 rounded-t-sm" style={{ height: 16, background: '#2C6E8A' }} />
            <span className="block w-2.5 rounded-t-sm" style={{ height: 28, background: '#D4A843' }} />
          </div>
          <h1 className="font-display text-[22px] font-bold text-ink tracking-[-0.3px]">
            3 Color Challenge
          </h1>
        </div>
        {supplies.length > 0 && (
          <ImportExport supplies={supplies} onMerge={handleMerge} />
        )}
      </header>

      <main className="flex flex-col gap-8">
        {supplies.length >= 1 && (
          <PalettePicker supplies={supplies} onSaveFavorite={addFavorite} />
        )}

        <SupplyInput supplies={supplies} onAdd={addSupplies} />

        <SupplyList
          supplies={supplies}
          onRemove={removeSupply}
          onRename={renameSupply}
          onSetColor={(id, hex) => patchSupply(id, { colorHex: hex, source: 'manual' })}
          onSetCategory={(id, category) => patchSupply(id, { category, categorySource: 'manual' })}
        />

        {supplies.length === 0 && (
          <ImportExport supplies={supplies} onMerge={handleMerge} />
        )}

        <FavoritesList favorites={favorites} onRemove={removeFavorite} />
      </main>
    </div>
  )
}

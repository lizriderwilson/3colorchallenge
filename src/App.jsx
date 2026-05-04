import { useState, useEffect } from 'react'
import { useSupplies } from './hooks/useSupplies'
import { useFavorites } from './hooks/useFavorites'
import { SupplyInput } from './components/SupplyInput'
import { SupplyList } from './components/SupplyList'
import { PalettePicker } from './components/PalettePicker'
import { ImportExport } from './components/ImportExport'
import { FavoritesList } from './components/FavoritesList'
import { decodeShareLink } from './utils/shareLink'

const CATEGORY_STYLES = {
  highlight: 'bg-amber-100 text-amber-700 border-amber-300',
  midtone:   'bg-sky-100 text-sky-700 border-sky-300',
  shadow:    'bg-slate-600 text-slate-100 border-slate-500',
}

export default function App() {
  const { supplies, addSupplies, removeSupply, renameSupply, patchSupply, replaceAll, reorderSupplies } = useSupplies()
  const { favorites, addFavorite, removeFavorite } = useFavorites()
  const [sharedPalette, setSharedPalette] = useState(() => decodeShareLink())

  useEffect(() => {
    if (sharedPalette) window.history.replaceState(null, '', window.location.pathname)
  }, [])

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
        {sharedPalette && (
          <div className="bg-white border-[1.5px] border-border rounded-xl p-6 flex flex-col gap-4 animate-fade-slide-in">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-ink">Shared Palette</h2>
              <button
                className="text-xs text-ink-muted hover:text-ink transition-colors bg-transparent border-0 cursor-pointer"
                onClick={() => setSharedPalette(null)}
              >
                Dismiss
              </button>
            </div>
            <div className={`grid ${sharedPalette.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'} gap-2.5`}>
              {sharedPalette.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 p-3 bg-paper border-[1.5px] border-border rounded-[10px]"
                >
                  <div
                    className="w-12 h-12 rounded-full border-2 border-black/[0.06] flex-shrink-0"
                    style={{ background: item.h || '#C8C4BC' }}
                  />
                  <span className="text-[12px] text-ink font-medium text-center leading-tight">
                    {item.n}
                  </span>
                  {item.c && (
                    <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 border ${CATEGORY_STYLES[item.c]}`}>
                      {item.c}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
          onReorder={reorderSupplies}
        />

        {supplies.length === 0 && (
          <ImportExport supplies={supplies} onMerge={handleMerge} />
        )}

        <FavoritesList favorites={favorites} onRemove={removeFavorite} />
      </main>
    </div>
  )
}

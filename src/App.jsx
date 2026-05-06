import { useState, useEffect } from 'react'
import { useSupplies } from './hooks/useSupplies'
import { useFavorites } from './hooks/useFavorites'
import { SupplyInput } from './components/SupplyInput'
import { SupplyList } from './components/SupplyList'
import { PalettePicker } from './components/PalettePicker'
import { ImportExport } from './components/ImportExport'
import { FavoritesList } from './components/FavoritesList'
import { HowToUseModal } from './components/HowToUseModal'
import { decodeShareLink } from './utils/shareLink'

const CATEGORY_STYLES = {
  highlight: 'bg-amber-100 text-amber-700 border-amber-200',
  midtone:   'bg-rose-100 text-rose-700 border-amber-200',
  shadow:    'bg-cyan-100 text-cyan-700 border-cyan-200',
}

export default function App() {
  const { supplies, addSupplies, removeSupply, renameSupply, patchSupply, replaceAll, reorderSupplies } = useSupplies()
  const { favorites, addFavorite, removeFavorite } = useFavorites()
  const [sharedPalette, setSharedPalette] = useState(() => decodeShareLink())
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    if (sharedPalette) window.history.replaceState(null, '', window.location.pathname)
  }, [])

  function handleMerge(incoming) {
    const existingNames = new Set(supplies.map(s => s.name.toLowerCase()))
    const fresh = incoming.filter(s => s.name && !existingNames.has(s.name.toLowerCase()))
    addSupplies(fresh.map(s => s.name))
  }

  return (
    <div id="app" className="max-w-[1100px] mx-auto px-4 pb-20 min-h-screen">
      <header id="app-header" className="flex items-center justify-between gap-3 py-6 border-b-[1.5px] border-slate-200 mb-8 flex-wrap">
        <div id="app-logo" className="flex items-center gap-3">
          <div id="app-logo-bars" className="flex gap-[3px] items-end" aria-hidden="true">
            <span className="block w-2.5 rounded-t-sm" style={{ height: 22, background: '#06b6d4' }} />
            <span className="block w-2.5 rounded-t-sm" style={{ height: 16, background: '#fb7185' }} />
            <span className="block w-2.5 rounded-t-sm" style={{ height: 28, background: '#fbbf24' }} />
          </div>
          <h1 id="app-title" className="font-display text-[22px] font-bold text-slate-900 tracking-[-0.3px]">
            3 Color Challenge 🎨
          </h1>
        </div>
        <button
          id="how-to-use-btn"
          className="font-display text-sm font-semibold text-cyan-500 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-100 transition-colors border-0 cursor-pointer rounded-lg px-3 py-1.5"
          onClick={() => setShowHelp(true)}
        >
          How to Use 💡
        </button>
      </header>

      {showHelp && <HowToUseModal onClose={() => setShowHelp(false)} />}

      <main id="app-main" className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 items-start">
        <div id="supplies-column" className="flex flex-col gap-6">
          <SupplyInput supplies={supplies} onAdd={addSupplies} />

          <SupplyList
            supplies={supplies}
            onRemove={removeSupply}
            onRename={renameSupply}
            onSetColor={(id, hex) => patchSupply(id, { colorHex: hex, source: 'manual' })}
            onSetCategory={(id, category) => patchSupply(id, { category, categorySource: 'manual' })}
            onReorder={reorderSupplies}
          />

          <ImportExport supplies={supplies} onMerge={handleMerge} />
        </div>

        <div id="palette-column" className="flex flex-col gap-6">
          <div id="palette-generator" className="flex flex-col gap-3">
            <p id="palette-column-label" className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
              Generate a Palette
            </p>

            {sharedPalette && (
              <div id="shared-palette" className="bg-white border-[1.5px] border-slate-200 rounded-xl p-6 flex flex-col gap-4 animate-fade-slide-in">
                <div id="shared-palette-header" className="flex items-baseline justify-between gap-3">
                  <h2 id="shared-palette-title" className="font-display text-xl font-semibold text-slate-900">✨ Shared Palette</h2>
                  <button
                    id="shared-palette-dismiss"
                    className="text-xs text-slate-500 hover:text-slate-900 transition-colors bg-transparent border-0 cursor-pointer"
                    onClick={() => setSharedPalette(null)}
                  >
                    Dismiss
                  </button>
                </div>
                <div id="shared-palette-swatches" className={`grid ${sharedPalette.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'} gap-2.5`}>
                  {sharedPalette.map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 p-3 bg-slate-50 border-[1.5px] border-slate-200 rounded-[10px]"
                    >
                      <div
                        className="w-12 h-12 rounded-full border-2 border-black/[0.06] flex-shrink-0"
                        style={{ background: item.h || '#C8C4BC' }}
                      />
                      <span className="text-[12px] text-slate-900 font-medium text-center leading-tight">
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

            {supplies.length === 0 && !sharedPalette && (
              <div id="palette-empty-state" className="flex flex-col items-center gap-3 py-16 px-6 text-center border-[1.5px] border-dashed border-slate-200 rounded-xl">
                <div className="flex gap-[3px] items-end opacity-30" aria-hidden="true">
                  <span className="block w-3 rounded-t-sm" style={{ height: 26, background: '#06b6d4' }} />
                  <span className="block w-3 rounded-t-sm" style={{ height: 20, background: '#fb7185' }} />
                  <span className="block w-3 rounded-t-sm" style={{ height: 34, background: '#fbbf24' }} />
                </div>
                <p id="palette-empty-state-text" className="font-display font-semibold text-slate-400 text-sm">
                  Add art supplies on the left to start generating palettes
                </p>
              </div>
            )}

            {supplies.length >= 1 && (
              <PalettePicker supplies={supplies} onSaveFavorite={addFavorite} />
            )}
          </div>

          <FavoritesList favorites={favorites} onRemove={removeFavorite} />
        </div>
      </main>
    </div>
  )
}

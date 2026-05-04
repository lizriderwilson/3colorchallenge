import { useReducer, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { detectColor, detectCategory } from '../utils/colorDetection'

const STORAGE_KEY = 'art-supplies'

function makeSupply(name) {
  const { hex, label } = detectColor(name)
  const category = detectCategory(hex)
  return {
    id: nanoid(),
    name,
    colorHex: hex,
    colorLabel: label,
    category,
    categorySource: category ? 'auto' : null,
    source: hex ? 'auto' : null,
    addedAt: new Date().toISOString(),
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_SUPPLIES':
      return [...state, ...action.names.map(makeSupply)]

    case 'REMOVE_SUPPLY':
      return state.filter(s => s.id !== action.id)

    case 'RENAME_SUPPLY':
      return state.map(s => s.id === action.id ? { ...s, name: action.name } : s)

    case 'PATCH_SUPPLY':
      return state.map(s => {
        if (s.id !== action.id) return s
        const updated = { ...s, ...action.updates }
        // Re-auto-assign category when color changes (unless category was manually set)
        if ('colorHex' in action.updates && s.categorySource !== 'manual') {
          updated.category = detectCategory(updated.colorHex)
          updated.categorySource = updated.category ? 'auto' : null
        }
        return updated
      })

    case 'REORDER_SUPPLIES':
      return action.supplies

    case 'REPLACE_ALL':
      return action.supplies.map(s => {
        const base = makeSupply(s.name)
        return {
          ...base,
          id: s.id ?? base.id,
          addedAt: s.addedAt ?? base.addedAt,
          // Preserve manually-set color
          colorHex: s.source === 'manual' ? s.colorHex : (s.colorHex ?? base.colorHex),
          colorLabel: s.colorLabel ?? base.colorLabel,
          source: s.source ?? base.source,
          // Preserve manually-set category
          category: s.categorySource === 'manual' ? s.category : (s.category ?? base.category),
          categorySource: s.categorySource ?? base.categorySource,
        }
      })

    default:
      return state
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useSupplies() {
  const [supplies, dispatch] = useReducer(reducer, null, load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(supplies))
  }, [supplies])

  return {
    supplies,
    addSupplies: names => dispatch({ type: 'ADD_SUPPLIES', names }),
    removeSupply: id => dispatch({ type: 'REMOVE_SUPPLY', id }),
    renameSupply: (id, name) => dispatch({ type: 'RENAME_SUPPLY', id, name }),
    patchSupply: (id, updates) => dispatch({ type: 'PATCH_SUPPLY', id, updates }),
    replaceAll: supplies => dispatch({ type: 'REPLACE_ALL', supplies }),
    reorderSupplies: supplies => dispatch({ type: 'REORDER_SUPPLIES', supplies }),
  }
}

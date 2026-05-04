import { useReducer, useEffect } from 'react'
import { nanoid } from 'nanoid'

const STORAGE_KEY = 'art-supply-favorites'

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_FAVORITE':
      return [{ id: nanoid(), name: action.name, createdAt: new Date().toISOString(), picks: action.picks }, ...state]
    case 'REMOVE_FAVORITE':
      return state.filter(f => f.id !== action.id)
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

export function useFavorites() {
  const [favorites, dispatch] = useReducer(reducer, null, load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  return {
    favorites,
    addFavorite: (name, picks) => dispatch({ type: 'ADD_FAVORITE', name, picks }),
    removeFavorite: id => dispatch({ type: 'REMOVE_FAVORITE', id }),
  }
}

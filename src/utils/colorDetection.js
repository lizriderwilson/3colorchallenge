import { COMPOUND_COLORS, SIMPLE_COLORS } from '../data/colorKeywords'
import { matchProduct } from './productMatcher'

const COMPOUND_ENTRIES = Object.entries(COMPOUND_COLORS).sort((a, b) => b[0].length - a[0].length)

export function detectColor(name) {
  // Product files take priority over generic keyword detection
  const product = matchProduct(name)
  if (product) return { hex: product.hex, label: product.label }

  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  for (const [key, hex] of COMPOUND_ENTRIES) {
    if (normalized.includes(key)) {
      return { hex, label: key }
    }
  }

  for (const word of normalized.split(' ')) {
    if (SIMPLE_COLORS[word]) {
      return { hex: SIMPLE_COLORS[word], label: word }
    }
  }

  return { hex: null, label: null }
}

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
    case g: h = ((b - r) / d + 2) / 6; break
    default: h = ((r - g) / d + 4) / 6
  }
  return [h * 360, s * 100, l * 100]
}

// L >= 60 → highlight, L < 30 → shadow, otherwise → midtone
export function detectCategory(hex) {
  if (!hex) return null
  const [, , l] = hexToHsl(hex)
  if (l >= 60) return 'highlight'
  if (l < 30) return 'shadow'
  return 'midtone'
}

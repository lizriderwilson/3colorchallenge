const productFiles = import.meta.glob('../data/products/*.json', { eager: true })

const allProducts = Object.values(productFiles).flatMap(m => {
  const data = m.default
  return Array.isArray(data) ? data : []
})

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

function tokenize(str) {
  return normalize(str).split(' ').filter(t => t.length > 0)
}

export function matchProduct(input) {
  if (!input || allProducts.length === 0) return null

  const normalInput = normalize(input)
  const inputTokens = tokenize(input)

  let bestMatch = null
  let bestScore = 0

  for (const product of allProducts) {
    const code = normalize(product.code || '')
    const name = normalize(product.name || '')
    const nameTokens = tokenize(product.name || '')
    let score = 0

    // Code match — most specific, wins immediately
    if (code && inputTokens.includes(code)) {
      score += 100
    } else if (code && normalInput.includes(code)) {
      score += 60
    }

    // Name match
    if (name === normalInput) {
      score += 80
    } else if (name.includes(normalInput) || normalInput.includes(name)) {
      const shorter = Math.min(normalInput.length, name.length)
      const longer = Math.max(normalInput.length, name.length)
      score += (shorter / longer) * 50
    } else {
      // Token overlap — only count tokens longer than 2 chars to avoid noise
      const matched = inputTokens.filter(t => t.length > 2 && nameTokens.includes(t))
      if (matched.length > 0) {
        score += (matched.length / inputTokens.length) * 30
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = product
    }
  }

  if (bestScore < 30 || !bestMatch) return null

  return {
    hex: bestMatch.hex,
    label: bestMatch.name,
    productType: bestMatch.type ?? null,
  }
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pickRandom(supplies, count) {
  return shuffle(supplies).slice(0, count)
}

// Distribute `total` across three categories in round-robin order,
// skipping any category that is already at capacity.
export function smartDistribute(total, available) {
  const cats = ['highlight', 'midtone', 'shadow']
  const counts = { highlight: 0, midtone: 0, shadow: 0 }
  for (let i = 0; i < total; i++) {
    let placed = false
    for (let offset = 0; offset < 3; offset++) {
      const cat = cats[(i + offset) % 3]
      if (counts[cat] < (available[cat] ?? 0)) {
        counts[cat]++
        placed = true
        break
      }
    }
    if (!placed) break // all categories are at capacity
  }
  return counts
}

// Plain even distribution with no capacity constraints (used for initialization)
export function evenDistribute(total) {
  const base = Math.floor(total / 3)
  const r = total % 3
  return { highlight: base + (r > 0 ? 1 : 0), midtone: base + (r > 1 ? 1 : 0), shadow: base }
}

// catCounts: { highlight: number, midtone: number, shadow: number }
// Always returns exactly sum(catCounts) picks; fills any per-category shortfall
// from the remaining categorized supplies.
export function pickByCategory(supplies, catCounts) {
  const total = Object.values(catCounts).reduce((s, n) => s + n, 0)
  const picks = []
  const pickedIds = new Set()

  for (const cat of ['highlight', 'midtone', 'shadow']) {
    const n = catCounts[cat] ?? 0
    if (n === 0) continue
    const taken = shuffle(supplies.filter(s => s.category === cat)).slice(0, n)
    taken.forEach(s => pickedIds.add(s.id))
    picks.push(...taken)
  }

  // Fill any shortfall from remaining categorized supplies
  if (picks.length < total) {
    const rest = shuffle(supplies.filter(s => s.category !== null && !pickedIds.has(s.id)))
    picks.push(...rest.slice(0, total - picks.length))
  }

  return shuffle(picks)
}

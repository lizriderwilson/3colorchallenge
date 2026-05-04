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

export function pickByCategory(supplies, count) {
  const buckets = {
    highlight: shuffle(supplies.filter(s => s.category === 'highlight')),
    midtone:   shuffle(supplies.filter(s => s.category === 'midtone')),
    shadow:    shuffle(supplies.filter(s => s.category === 'shadow')),
  }

  const picks = []
  const pickedIds = new Set()

  // One from each non-empty bucket first
  for (const bucket of Object.values(buckets)) {
    if (picks.length < count && bucket.length > 0) {
      picks.push(bucket[0])
      pickedIds.add(bucket[0].id)
    }
  }

  // Fill remainder randomly from all unpicked supplies
  const rest = shuffle(supplies.filter(s => !pickedIds.has(s.id)))
  for (const s of rest) {
    if (picks.length >= count) break
    picks.push(s)
  }

  return picks
}

// Returns which of the three category buckets are empty
export function emptyCategoryBuckets(supplies) {
  const cats = new Set(supplies.map(s => s.category))
  return ['highlight', 'midtone', 'shadow'].filter(c => !cats.has(c))
}

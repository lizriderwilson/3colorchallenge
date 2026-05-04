export function encodeShareLink(picks) {
  const data = picks.map(s => ({
    n: s.name,
    h: s.colorHex,
    c: s.category,
  }))
  const encoded = btoa(encodeURIComponent(JSON.stringify(data)))
  return `${window.location.origin}${window.location.pathname}#palette=${encoded}`
}

export function decodeShareLink() {
  try {
    const match = window.location.hash.match(/[#&]palette=([^&]*)/)
    if (!match) return null
    return JSON.parse(decodeURIComponent(atob(match[1])))
  } catch {
    return null
  }
}

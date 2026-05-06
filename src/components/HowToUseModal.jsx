import { useEffect } from 'react'

export function HowToUseModal({ onClose }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl border-[1.5px] border-slate-200 shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col animate-fade-slide-in">
        <div className="flex items-center justify-between px-6 py-4 border-b-[1.5px] border-slate-200 flex-shrink-0">
          <h2 className="font-display text-xl font-semibold text-slate-900">How to Use 🎨</h2>
          <button
            className="text-slate-400 hover:text-slate-900 transition-colors bg-transparent border-0 cursor-pointer text-xl leading-none"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6 styled-scroll">
          <Section title="1. Add your art supplies 🖌️">
            <p>Type or paste your supply names into the text box on the left — one per line or comma-separated. Hit <strong>Add Supplies</strong> to save them to your list.</p>
          </Section>

          <Section title="2. Set colors 🎨">
            <p>Click the small circle swatch next to any supply to open a color picker and assign it a hex color. Colors appear as swatches in generated palettes so you can see what a combination will actually look like.</p>
          </Section>

          <Section title="3. Assign categories H / M / S">
            <p>Each supply can be tagged as a <Badge label="H" style="bg-amber-100 text-amber-700 border-amber-200" /> <strong>highlight</strong>, <Badge label="M" style="bg-rose-100 text-rose-700 border-amber-200" /> <strong>midtone</strong>, or <Badge label="S" style="bg-cyan-100 text-cyan-700 border-cyan-200" /> <strong>shadow</strong>. Click the badge button on a supply to cycle through the options. Categories let you generate palettes that are guaranteed to have tonal balance.</p>
          </Section>

          <Section title="4. Generate a palette ✨">
            <p>Use the slider on the right to choose how many supplies to pick, then click <strong>Pick Random Colors</strong> — or just press <kbd className="font-mono text-[10px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5">Space</kbd> anywhere on the page.</p>
            <p className="mt-2">Enable <strong>Use highlight / midtone / shadow categories</strong> to pick a set number from each tonal role instead of picking at random.</p>
          </Section>

          <Section title="5. Save & share palettes ⭐">
            <p>After generating a palette, click <strong>Save as Favorite</strong> to give it a name and store it for later. Your saved palettes appear below the generator.</p>
            <p className="mt-2">Click <strong>Copy Share Link</strong> to copy a URL that encodes the current palette — anyone you send it to will see it loaded when they open the link.</p>
          </Section>

          <Section title="6. Import & export your supplies 💾">
            <p>Use the <strong>Export JSON</strong> button to download your supply list as a file you can back up or share. Use <strong>Import JSON</strong> to load a previously exported file and merge it with your current list.</p>
          </Section>

          <Section title="7. Reorder supplies">
            <p>Drag any supply by the grip handle on its left edge to reorder your list.</p>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="font-display font-semibold text-slate-900 text-[15px]">{title}</h3>
      <div className="text-sm text-slate-600 leading-relaxed">{children}</div>
    </div>
  )
}

function Badge({ label, style }) {
  return (
    <span className={`inline-block text-[10px] font-semibold rounded px-1.5 py-0.5 border ${style}`}>
      {label}
    </span>
  )
}

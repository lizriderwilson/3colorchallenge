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
            <p>Enter supply names and/or codes into the text box on the left, either one per line or separated by commas. Click <strong>Add Supplies</strong> to save them to your list. You can also import a previously generated JSON file (see step 7).</p>
            <p>Our database is already configured to recognize several popular art supply brands, so if you enter the brand and color name/code it will auto-detect the color if we have it in our database!</p>
          </Section>

          <Section title="2. Set colors 🎨">
            <p>The app does its best to auto-detect colors based on the name entered, but it doesn't always get it right. To set or edit a color, click the small circle swatch next to the supply to open a color picker and assign it a hex code.</p>
            <p>Colors appear as swatches in generated palettes so you can preview what the combination will look like.</p>
          </Section>
                    
          <Section title="3. Reorder supplies">
            <p>Drag any supply by the grip handle on its left edge to reorder your list.</p>
          </Section>

          <Section title="4. Assign categories H / M / S (Optional)">
            <p>Each supply can be tagged as a <Badge label="H" style="bg-amber-100 text-amber-700 border-amber-200" /> <strong>highlight</strong>, <Badge label="M" style="bg-rose-100 text-rose-700 border-amber-200" /> <strong>midtone</strong>, or <Badge label="S" style="bg-cyan-100 text-cyan-700 border-cyan-200" /> <strong>shadow</strong>. A category will be automatically detected from the color's hex code, but if you want to fine-tune anything, click the category badge on a supply to cycle through the options.</p>
          </Section>

          <Section title="5. Generate a palette ✨">
            <p>Use the slider on the right to choose how many supplies to pick (3 is traditional, per the title of this site, but you can choose up to 16 as long as you have enough supplies), then click <strong>Pick Random Colors</strong> — or just press <kbd className="font-mono text-[10px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5">Space</kbd> anywhere on the page.</p>
            <p className="mt-2">Enable <strong>Use highlight / midtone / shadow categories</strong> if you want a more balanced palette. You are free to leave it unchecked if you want to be completely random (as is tradition), but if you'd like to ensure you have at least one of each category for better values in your piece, click this.</p>
          </Section>

          <Section title="6. Save & share palettes ⭐">
            <p>After generating a palette, you can click <strong>Save as Favorite</strong> and give it a name if you want to store it for later. Your saved palettes appear below the generator.</p>
            <p className="mt-2">Click <strong>Copy Share Link</strong> to copy a URL that encodes the current palette — anyone you send it to will see it loaded when they open the link.</p>
          </Section>

          <Section title="7. Import & export your supplies 💾">
            <p>The app uses your browser's LocalStorage to persist your info between visits to the site, but if your cache gets cleared, you want to use this on a different computer, or you want to share it with someone, you can use the <strong>Export JSON</strong> button to download your supply list as a JSON file. Use <strong>Import JSON</strong> to load a previously exported file and merge it with your current list.</p>
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

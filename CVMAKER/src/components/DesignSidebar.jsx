const densityOptions = [
  { id: 'compact', label: 'Compact' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'spacious', label: 'Spacious' },
]

const layoutOptions = [
  { id: 'sidebar', label: 'Modern Sidebar Layout' },
  { id: 'classic', label: 'Classic Single Column' },
]

function DesignSidebar({ design, setDesign, fontPairs }) {
  return (
    <aside className="rounded-2xl border border-slate-800/70 bg-slate-900/80 p-5 shadow-soft backdrop-blur">
      <div className="sticky top-0">
        <h2 className="text-lg font-semibold text-white">Resume Design Studio</h2>
        <p className="mt-1 text-xs text-slate-400">
          Refine colors, typography, and layout in real time.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-200">Color System</h3>
          <div className="grid gap-3">
            <label className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/70 px-4 py-3 text-xs text-slate-300">
              Primary
              <input
                type="color"
                value={design.primary}
                onChange={(event) =>
                  setDesign((prev) => ({ ...prev, primary: event.target.value }))
                }
                className="h-8 w-12 cursor-pointer rounded-lg border border-slate-700 bg-transparent"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/70 px-4 py-3 text-xs text-slate-300">
              Secondary
              <input
                type="color"
                value={design.secondary}
                onChange={(event) =>
                  setDesign((prev) => ({ ...prev, secondary: event.target.value }))
                }
                className="h-8 w-12 cursor-pointer rounded-lg border border-slate-700 bg-transparent"
              />
            </label>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-200">Typography System</h3>
          <select
            value={design.fontPair}
            onChange={(event) =>
              setDesign((prev) => ({ ...prev, fontPair: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-3 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none"
          >
            {fontPairs.map((pair) => (
              <option key={pair.id} value={pair.id}>
                {pair.label}
              </option>
            ))}
          </select>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-200">Layout Selector</h3>
          <div className="space-y-2">
            {layoutOptions.map((option) => (
              <button
                key={option.id}
                className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                  design.layout === option.id
                    ? 'border-indigo-400 bg-indigo-500/20 text-white'
                    : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-600'
                }`}
                onClick={() => setDesign((prev) => ({ ...prev, layout: option.id }))}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-200">Spacing Density</h3>
          <div className="grid gap-2">
            {densityOptions.map((option) => (
              <button
                key={option.id}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  design.density === option.id
                    ? 'border-emerald-400 bg-emerald-500/20 text-white'
                    : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-600'
                }`}
                onClick={() => setDesign((prev) => ({ ...prev, density: option.id }))}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </aside>
  )
}

export default DesignSidebar

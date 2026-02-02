function ExperienceItem({
  item,
  onChange,
  onRemove,
  onBulletChange,
  onBulletAdd,
  onBulletRemove,
  formatMonthYear,
  highlight,
}) {
  return (
    <div
      className={`rounded-2xl border bg-slate-900/60 p-4 transition ${
        highlight ? 'border-amber-400/70' : 'border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          Role Details
        </p>
        <button
          className="text-[10px] uppercase tracking-wide text-rose-300 transition hover:text-rose-200"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input
          value={item.role}
          onChange={(event) => onChange({ role: event.target.value })}
          placeholder="Role"
          aria-label="Role"
          className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none"
        />
        <input
          value={item.company}
          onChange={(event) => onChange({ company: event.target.value })}
          placeholder="Company"
          aria-label="Company"
          className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none"
        />
        <input
          value={item.location}
          onChange={(event) => onChange({ location: event.target.value })}
          placeholder="Location"
          aria-label="Location"
          className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            value={item.startDate}
            onChange={(event) =>
              onChange({ startDate: formatMonthYear(event.target.value) })
            }
            placeholder="Start (MM/YYYY)"
            aria-label="Start date"
            className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none"
          />
          <input
            value={item.endDate}
            onChange={(event) =>
              onChange({ endDate: formatMonthYear(event.target.value) })
            }
            placeholder="End (MM/YYYY)"
            aria-label="End date"
            className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {item.bullets.map((bullet, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-slate-400">•</span>
            <input
              value={bullet}
              onChange={(event) => onBulletChange(index, event.target.value)}
              placeholder="Achievement or responsibility"
              aria-label={`Bullet ${index + 1}`}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none"
            />
            <button
              className="text-[10px] uppercase tracking-wide text-rose-300"
              onClick={() => onBulletRemove(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        className="mt-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-300"
        onClick={onBulletAdd}
      >
        + Add Bullet
      </button>
    </div>
  )
}

export default ExperienceItem

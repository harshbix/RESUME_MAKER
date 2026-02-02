function EducationItem({ item, onChange, onRemove, formatMonthYear, highlight }) {
  return (
    <div
      className={`rounded-2xl border bg-slate-900/60 p-4 transition ${
        highlight ? 'border-amber-400/70' : 'border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          Education Details
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
          value={item.degree}
          onChange={(event) => onChange({ degree: event.target.value })}
          placeholder="Degree"
          aria-label="Degree"
          className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none"
        />
        <input
          value={item.school}
          onChange={(event) => onChange({ school: event.target.value })}
          placeholder="School"
          aria-label="School"
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
      <textarea
        value={item.details}
        onChange={(event) => onChange({ details: event.target.value })}
        placeholder="Honors, coursework, or additional details"
        aria-label="Education details"
        rows={3}
        className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none"
      />
    </div>
  )
}

export default EducationItem

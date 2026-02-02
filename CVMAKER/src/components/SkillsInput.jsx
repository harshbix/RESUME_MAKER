import { useState } from 'react'

function SkillsInput({ skills, onChange }) {
  const [draft, setDraft] = useState('')

  const addSkill = (value) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (skills.includes(trimmed)) return
    onChange([...skills, trimmed])
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addSkill(draft)
      setDraft('')
    }
  }

  const removeSkill = (skill) => {
    onChange(skills.filter((item) => item !== skill))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-100"
          >
            {skill}
            <button
              className="text-[10px] text-emerald-200"
              aria-label={`Remove ${skill}`}
              onClick={() => removeSkill(skill)}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a skill and press Enter"
        aria-label="Add a skill"
        className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none"
      />
      <p className="mt-2 text-[10px] text-slate-400">
        Use comma or Enter to add tags.
      </p>
    </div>
  )
}

export default SkillsInput

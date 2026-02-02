import { useMemo, useState } from 'react'
import UploadResume from './UploadResume.jsx'
import ExperienceItem from './ExperienceItem.jsx'
import EducationItem from './EducationItem.jsx'
import SkillsInput from './SkillsInput.jsx'

const emptyExperience = () => ({
  id: crypto.randomUUID(),
  role: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  bullets: [''],
})

const emptyEducation = () => ({
  id: crypto.randomUUID(),
  degree: '',
  school: '',
  location: '',
  startDate: '',
  endDate: '',
  details: '',
})

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 15)
  if (digits.length < 4) return digits
  if (digits.length < 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  if (digits.length < 11)
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

const formatMonthYear = (value) => {
  if (/[a-zA-Z]/.test(value)) return value
  const digits = value.replace(/\D/g, '').slice(0, 6)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxSize = 400
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.onerror = () => reject(new Error('Unable to load image.'))
      img.src = reader.result
    }
    reader.onerror = () => reject(new Error('Unable to read image.'))
    reader.readAsDataURL(file)
  })

function SectionCard({ title, completed, collapsed, onToggle, children }) {
  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 shadow-soft">
      <button
        className="sticky top-0 flex w-full items-center justify-between rounded-2xl border-b border-slate-800/70 bg-slate-900/90 px-5 py-4 text-left backdrop-blur"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white">{title}</span>
          {completed && (
            <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-200">
              Completed
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">
          {collapsed ? 'Expand' : 'Collapse'}
        </span>
      </button>
      {!collapsed && <div className="p-5">{children}</div>}
    </div>
  )
}

function FloatingInput({ label, value, onChange, type = 'text', error }) {
  return (
    <label className="relative block">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={`peer w-full rounded-xl border bg-slate-900/60 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 ${
          error ? 'border-amber-400/80' : 'border-slate-800'
        }`}
      />
      <span className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-wide text-slate-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:bg-slate-900/80 peer-focus:px-1 peer-focus:text-[10px] peer-focus:text-indigo-300">
        {label}
      </span>
    </label>
  )
}

function FloatingTextarea({ label, value, onChange, rows = 4, error }) {
  return (
    <label className="relative block">
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder=" "
        className={`peer w-full rounded-xl border bg-slate-900/60 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 ${
          error ? 'border-amber-400/80' : 'border-slate-800'
        }`}
      />
      <span className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-wide text-slate-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:-top-2 peer-focus:bg-slate-900/80 peer-focus:px-1 peer-focus:text-[10px] peer-focus:text-indigo-300">
        {label}
      </span>
    </label>
  )
}

function ResumeForm({ data, setData, uncertainFields, onParsed, onToast, uploadInputRef }) {
  const [collapsed, setCollapsed] = useState({
    personal: false,
    summary: false,
    experience: false,
    education: false,
    skills: false,
  })
  const [errorMessage, setErrorMessage] = useState('')

  const sectionCompletion = useMemo(
    () => ({
      personal: Boolean(data.personal.fullName && data.personal.email),
      summary: data.summary.trim().length > 20,
      experience: data.experience.some((item) => item.role || item.company),
      education: data.education.some((item) => item.degree || item.school),
      skills: data.skills.length > 0,
    }),
    [data]
  )

  const toggleSection = (key) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))

  const updatePersonal = (field, value) =>
    setData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }))

  const updateSummary = (value) => setData((prev) => ({ ...prev, summary: value }))

  const updateExperience = (index, changes) =>
    setData((prev) => {
      const next = [...prev.experience]
      next[index] = { ...next[index], ...changes }
      return { ...prev, experience: next }
    })

  const updateExperienceBullet = (index, bulletIndex, value) =>
    setData((prev) => {
      const next = [...prev.experience]
      const bullets = [...next[index].bullets]
      bullets[bulletIndex] = value
      next[index] = { ...next[index], bullets }
      return { ...prev, experience: next }
    })

  const addExperience = () =>
    setData((prev) => ({
      ...prev,
      experience: [...prev.experience, emptyExperience()],
    }))

  const removeExperience = (index) =>
    setData((prev) => {
      const next = prev.experience.filter((_, i) => i !== index)
      return { ...prev, experience: next.length ? next : [emptyExperience()] }
    })

  const addExperienceBullet = (index) =>
    setData((prev) => {
      const next = [...prev.experience]
      next[index] = { ...next[index], bullets: [...next[index].bullets, ''] }
      return { ...prev, experience: next }
    })

  const removeExperienceBullet = (index, bulletIndex) =>
    setData((prev) => {
      const next = [...prev.experience]
      next[index] = {
        ...next[index],
        bullets: next[index].bullets.filter((_, i) => i !== bulletIndex),
      }
      return { ...prev, experience: next }
    })

  const updateEducation = (index, changes) =>
    setData((prev) => {
      const next = [...prev.education]
      next[index] = { ...next[index], ...changes }
      return { ...prev, education: next }
    })

  const addEducation = () =>
    setData((prev) => ({
      ...prev,
      education: [...prev.education, emptyEducation()],
    }))

  const removeEducation = (index) =>
    setData((prev) => {
      const next = prev.education.filter((_, i) => i !== index)
      return { ...prev, education: next.length ? next : [emptyEducation()] }
    })

  const updateSkills = (skills) => setData((prev) => ({ ...prev, skills }))

  const handlePhotoUpload = async (file) => {
    try {
      const optimized = await compressImage(file)
      updatePersonal('photo', optimized)
      onToast('Profile photo updated.')
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleParsed = (parsed) => {
    setErrorMessage('')
    onParsed(parsed)
  }

  const handleParseError = (message) => {
    setErrorMessage(message)
    onToast('Parsing failed. Please review the fields.')
  }

  return (
    <div className="space-y-5">
      <UploadResume
        inputRef={uploadInputRef}
        onParsed={handleParsed}
        onError={handleParseError}
      />

      <p className="text-xs text-slate-400">
        Tip: Imports work best when headings are labeled (Summary, Experience, Education, Skills).
      </p>

      {errorMessage && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
          {errorMessage}
        </div>
      )}

      <SectionCard
        title="Personal Information"
        completed={sectionCompletion.personal}
        collapsed={collapsed.personal}
        onToggle={() => toggleSection('personal')}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FloatingInput
            label="Full Name"
            value={data.personal.fullName}
            onChange={(event) => updatePersonal('fullName', event.target.value)}
            error={uncertainFields.includes('personal.fullName')}
          />
          <FloatingInput
            label="Professional Title"
            value={data.personal.title}
            onChange={(event) => updatePersonal('title', event.target.value)}
            error={uncertainFields.includes('personal.title')}
          />
          <FloatingInput
            label="Email"
            type="email"
            value={data.personal.email}
            onChange={(event) => updatePersonal('email', event.target.value)}
            error={uncertainFields.includes('personal.email')}
          />
          <FloatingInput
            label="Phone"
            value={data.personal.phone}
            onChange={(event) =>
              updatePersonal('phone', formatPhone(event.target.value))
            }
            error={uncertainFields.includes('personal.phone')}
          />
          <FloatingInput
            label="Location"
            value={data.personal.location}
            onChange={(event) => updatePersonal('location', event.target.value)}
            error={uncertainFields.includes('personal.location')}
          />
          <FloatingInput
            label="Website"
            value={data.personal.website}
            onChange={(event) => updatePersonal('website', event.target.value)}
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
              {data.personal.photo ? (
                <img
                  src={data.personal.photo}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                  Photo
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-slate-300">Profile photo</p>
              <p className="text-[10px] text-slate-500">
                Optimized, circular crop.
              </p>
            </div>
          </div>
          <label className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                event.target.files?.[0] && handlePhotoUpload(event.target.files[0])
              }
            />
          </label>
        </div>
      </SectionCard>

      <SectionCard
        title="Professional Summary"
        completed={sectionCompletion.summary}
        collapsed={collapsed.summary}
        onToggle={() => toggleSection('summary')}
      >
        <FloatingTextarea
          label="Summary"
          rows={5}
          value={data.summary}
          onChange={(event) => updateSummary(event.target.value)}
          error={uncertainFields.includes('summary')}
        />
      </SectionCard>

      <SectionCard
        title="Work Experience"
        completed={sectionCompletion.experience}
        collapsed={collapsed.experience}
        onToggle={() => toggleSection('experience')}
      >
        <p className="mb-3 text-[11px] text-slate-400">
          Add role highlights with measurable impact.
        </p>
        <div className="space-y-4">
          {data.experience.map((item, index) => (
            <ExperienceItem
              key={item.id}
              item={item}
              onChange={(changes) => updateExperience(index, changes)}
              onRemove={() => removeExperience(index)}
              onBulletChange={(bulletIndex, value) =>
                updateExperienceBullet(index, bulletIndex, value)
              }
              onBulletAdd={() => addExperienceBullet(index)}
              onBulletRemove={(bulletIndex) =>
                removeExperienceBullet(index, bulletIndex)
              }
              formatMonthYear={formatMonthYear}
              highlight={uncertainFields.includes(`experience.${index}`)}
            />
          ))}
        </div>
        <button
          className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500"
          onClick={addExperience}
        >
          + Add Experience
        </button>
      </SectionCard>

      <SectionCard
        title="Education"
        completed={sectionCompletion.education}
        collapsed={collapsed.education}
        onToggle={() => toggleSection('education')}
      >
        <p className="mb-3 text-[11px] text-slate-400">
          Include relevant coursework or honors when available.
        </p>
        <div className="space-y-4">
          {data.education.map((item, index) => (
            <EducationItem
              key={item.id}
              item={item}
              onChange={(changes) => updateEducation(index, changes)}
              onRemove={() => removeEducation(index)}
              formatMonthYear={formatMonthYear}
              highlight={uncertainFields.includes(`education.${index}`)}
            />
          ))}
        </div>
        <button
          className="mt-4 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500"
          onClick={addEducation}
        >
          + Add Education
        </button>
      </SectionCard>

      <SectionCard
        title="Skills"
        completed={sectionCompletion.skills}
        collapsed={collapsed.skills}
        onToggle={() => toggleSection('skills')}
      >
        <SkillsInput skills={data.skills} onChange={updateSkills} />
      </SectionCard>
    </div>
  )
}

export default ResumeForm

import { useEffect, useMemo, useRef, useState } from 'react'

const densityMap = {
  compact: 'space-y-4',
  balanced: 'space-y-6',
  spacious: 'space-y-8',
}

const useDebouncedValue = (value, delay = 250) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

const pageHeight = 1123
const pageWidth = 794

function ResumeContent({ data, spacingClass, showSidebar, headerStyle }) {
  return (
    <div className={`flex min-h-full flex-col ${spacingClass}`}>
      <header className={showSidebar ? 'flex gap-8' : 'space-y-3'}>
        {data.personal.photo && (
          <div className="h-20 w-20 overflow-hidden rounded-full border border-slate-200">
            <img src={data.personal.photo} alt="Profile" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-semibold" style={headerStyle}>
            {data.personal.fullName || 'Your Name'}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {data.personal.title || 'Professional Title'}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
            {data.personal.email && <span>{data.personal.email}</span>}
            {data.personal.phone && <span>{data.personal.phone}</span>}
            {data.personal.location && <span>{data.personal.location}</span>}
            {data.personal.website && <span>{data.personal.website}</span>}
          </div>
        </div>
      </header>

      <div className={showSidebar ? 'grid grid-cols-[200px_1fr] gap-8' : ''}>
        {showSidebar && (
          <aside className="space-y-6">
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Skills
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.skills.length ? (
                  data.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase"
                      style={{
                        backgroundColor: 'var(--secondary)',
                        color: '#ffffff',
                      }}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Add skills to display.</span>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Contact
              </h2>
              <div className="mt-3 space-y-2 text-xs text-slate-600">
                {data.personal.email && <p>{data.personal.email}</p>}
                {data.personal.phone && <p>{data.personal.phone}</p>}
                {data.personal.location && <p>{data.personal.location}</p>}
              </div>
            </section>
          </aside>
        )}

        <main className={`space-y-6 ${showSidebar ? '' : spacingClass}`}>
          <section className="space-y-2">
            <h2
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={headerStyle}
            >
              Professional Summary
            </h2>
            <div className="h-[2px] w-10" style={{ backgroundColor: 'var(--primary)' }} />
            <p className="text-sm text-slate-700">
              {data.summary || 'Write a compelling summary that captures your impact.'}
            </p>
          </section>

          <section className="space-y-3">
            <h2
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={headerStyle}
            >
              Work Experience
            </h2>
            <div className="h-[2px] w-10" style={{ backgroundColor: 'var(--primary)' }} />
            <div className="space-y-4">
              {data.experience.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-slate-800">{item.role || 'Role Title'}</p>
                      <p className="text-xs text-slate-500">{item.company || 'Company'}</p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {item.startDate || 'MM/YYYY'} - {item.endDate || 'MM/YYYY'}
                    </span>
                  </div>
                  <ul className="list-disc space-y-1 pl-4 text-xs text-slate-600">
                    {(item.bullets.length ? item.bullets : ['']).map((bullet, index) => (
                      <li key={index}>{bullet || 'Achievement detail.'}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={headerStyle}
            >
              Education
            </h2>
            <div className="h-[2px] w-10" style={{ backgroundColor: 'var(--primary)' }} />
            <div className="space-y-3">
              {data.education.map((item) => (
                <div key={item.id} className="space-y-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {item.degree || 'Degree'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.school || 'School'} · {item.location || 'Location'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.startDate || 'MM/YYYY'} - {item.endDate || 'MM/YYYY'}
                  </p>
                  {item.details && <p className="text-xs text-slate-600">{item.details}</p>}
                </div>
              ))}
            </div>
          </section>

          {!showSidebar && (
            <section className="space-y-2">
              <h2
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={headerStyle}
              >
                Skills
              </h2>
              <div className="h-[2px] w-10" style={{ backgroundColor: 'var(--primary)' }} />
              <div className="flex flex-wrap gap-2">
                {data.skills.length ? (
                  data.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase"
                      style={{ backgroundColor: 'var(--secondary)', color: '#ffffff' }}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Add skills to display.</span>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      <footer className="mt-auto flex justify-center text-[10px] text-slate-400">
        Made by JuniorJeconia
      </footer>
    </div>
  )
}

function ResumePreview({ data, design }) {
  const contentRef = useRef(null)
  const [highlight, setHighlight] = useState(false)
  const [pageCount, setPageCount] = useState(1)
  const debouncedData = useDebouncedValue(data, 200)
  const debouncedDesign = useDebouncedValue(design, 200)

  useEffect(() => {
    setHighlight(true)
    const timeout = setTimeout(() => setHighlight(false), 500)
    return () => clearTimeout(timeout)
  }, [debouncedData, debouncedDesign])

  useEffect(() => {
    const checkOverflow = () => {
      if (!contentRef.current) return
      const contentHeight = contentRef.current.scrollHeight
      const count = Math.max(1, Math.ceil(contentHeight / pageHeight))
      setPageCount(count)
    }
    const id = requestAnimationFrame(checkOverflow)
    window.addEventListener('resize', checkOverflow)
    return () => {
      window.removeEventListener('resize', checkOverflow)
      cancelAnimationFrame(id)
    }
  }, [debouncedData, debouncedDesign])

  const spacingClass = densityMap[debouncedDesign.density] || densityMap.balanced

  const headerStyle = useMemo(
    () => ({
      fontFamily: 'var(--font-heading, Inter)',
      color: 'var(--primary)',
    }),
    []
  )

  const bodyStyle = useMemo(
    () => ({
      fontFamily: 'var(--font-body, Inter)',
      color: '#0f172a',
    }),
    []
  )

  const showSidebar = debouncedDesign.layout === 'sidebar'

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          Live A4 Preview
        </p>
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
          A4
        </span>
      </div>

      <div className="relative overflow-auto space-y-6">
        {Array.from({ length: pageCount }).map((_, index) => (
          <div
            key={`page-${index}`}
            className={`relative mx-auto h-[1123px] w-[794px] origin-top bg-paper-texture p-12 shadow-xl transition ${
              highlight ? 'ring-2 ring-indigo-400/70' : 'ring-1 ring-slate-200/50'
            }`}
            style={bodyStyle}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute left-0 top-0 w-full"
                style={{ transform: `translateY(-${index * pageHeight}px)` }}
              >
                <ResumeContent
                  data={debouncedData}
                  spacingClass={spacingClass}
                  showSidebar={showSidebar}
                  headerStyle={headerStyle}
                />
              </div>
            </div>
          </div>
        ))}

        {pageCount > 1 && (
          <div className="flex justify-center text-[10px] uppercase tracking-[0.3em] text-rose-300">
            {pageCount} pages
          </div>
        )}
      </div>

      <div
        className="pointer-events-none"
        style={{ position: 'fixed', left: '-10000px', top: 0 }}
        aria-hidden="true"
      >
        <div
          id="resume-preview"
          ref={contentRef}
          className="w-[794px] bg-white p-12"
          style={bodyStyle}
        >
          <ResumeContent
            data={debouncedData}
            spacingClass={spacingClass}
            showSidebar={showSidebar}
            headerStyle={headerStyle}
          />
        </div>
      </div>
    </div>
  )
}

export default ResumePreview

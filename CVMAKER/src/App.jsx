import { useEffect, useMemo, useRef, useState } from 'react'
import DesignSidebar from './components/DesignSidebar.jsx'
import ResumeForm from './components/ResumeForm.jsx'
import ResumePreview from './components/ResumePreview.jsx'
import PDFDownloadButton from './components/PDFDownloadButton.jsx'

const fontPairs = [
  {
    id: 'playfair-inter',
    label: 'Playfair Display + Inter',
    heading: 'Playfair Display',
    body: 'Inter',
    google:
      'family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700',
  },
  {
    id: 'lora-opensans',
    label: 'Lora + Open Sans',
    heading: 'Lora',
    body: 'Open Sans',
    google: 'family=Lora:wght@400;600;700&family=Open+Sans:wght@300;400;600;700',
  },
  {
    id: 'merriweather-sourcesans',
    label: 'Merriweather + Source Sans Pro',
    heading: 'Merriweather',
    body: 'Source Sans Pro',
    google:
      'family=Merriweather:wght@400;700&family=Source+Sans+3:wght@300;400;600;700',
  },
  {
    id: 'poppins-roboto',
    label: 'Poppins + Roboto',
    heading: 'Poppins',
    body: 'Roboto',
    google: 'family=Poppins:wght@400;600;700&family=Roboto:wght@300;400;500;700',
  },
  {
    id: 'cormorant-lato',
    label: 'Cormorant Garamond + Lato',
    heading: 'Cormorant Garamond',
    body: 'Lato',
    google:
      'family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@300;400;700',
  },
]

const defaultResume = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    photo: '',
  },
  summary: '',
  experience: [
    {
      id: crypto.randomUUID(),
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      bullets: [''],
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      degree: '',
      school: '',
      location: '',
      startDate: '',
      endDate: '',
      details: '',
    },
  ],
  skills: [],
}

const defaultDesign = {
  primary: '#4f46e5',
  secondary: '#22c55e',
  fontPair: fontPairs[0].id,
  layout: 'sidebar',
  density: 'balanced',
}

function App() {
  const [resumeData, setResumeData] = useState(defaultResume)
  const [design, setDesign] = useState(defaultDesign)
  const [activeTab, setActiveTab] = useState('content')
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [toast, setToast] = useState('')
  const [uncertainFields, setUncertainFields] = useState([])
  const uploadInputRef = useRef(null)

  const activeFont = useMemo(
    () => fontPairs.find((pair) => pair.id === design.fontPair) || fontPairs[0],
    [design.fontPair]
  )

  useEffect(() => {
    const existing = document.getElementById('google-fonts')
    const href = `https://fonts.googleapis.com/css2?${activeFont.google}&display=swap`
    if (existing) {
      existing.setAttribute('href', href)
    } else {
      const link = document.createElement('link')
      link.id = 'google-fonts'
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
    }
    document.documentElement.style.setProperty('--font-heading', activeFont.heading)
    document.documentElement.style.setProperty('--font-body', activeFont.body)
  }, [activeFont])

  const handleParsedResume = (parsed) => {
    if (!parsed) return
    setShowOnboarding(false)
    setUncertainFields(parsed.uncertainFields || [])
    setResumeData((prev) => ({
      ...prev,
      ...parsed.data,
      personal: {
        ...prev.personal,
        ...parsed.data.personal,
      },
      experience: parsed.data.experience?.length
        ? parsed.data.experience
        : prev.experience,
      education: parsed.data.education?.length ? parsed.data.education : prev.education,
      skills: parsed.data.skills?.length ? parsed.data.skills : prev.skills,
    }))
  }

  const handleToast = (message) => {
    setToast(message)
    if (!message) return
    setTimeout(() => setToast(''), 3200)
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100"
      style={{
        '--primary': design.primary,
        '--secondary': design.secondary,
      }}
    >
      <PDFDownloadButton
        fileName={resumeData.personal.fullName || 'Resume'}
        onDone={(message) =>
          handleToast(message || 'Your professional resume is ready.')
        }
      />

      {showOnboarding && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800/70 bg-slate-900/80 p-8 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Welcome</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Build a premium resume in minutes.
            </h1>
            <p className="mt-3 text-sm text-slate-300">
              Start from scratch or import your existing resume to auto-fill everything.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                className="rounded-xl border border-slate-700/70 bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:border-slate-500"
                onClick={() => setShowOnboarding(false)}
              >
                Start From Scratch
              </button>
              <button
                className="rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-indigo-400"
                onClick={() => {
                  setActiveTab('content')
                  uploadInputRef.current?.click()
                }}
              >
                Import Existing Resume
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 pb-16 pt-6 sm:px-6 lg:px-10">
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <div className="inline-flex rounded-full border border-slate-800 bg-slate-900 p-1">
            {['content', 'design', 'preview'].map((tab) => (
              <button
                key={tab}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  activeTab === tab
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr_440px]">
          <div
            className={`lg:sticky lg:top-6 lg:self-start ${
              activeTab === 'design' ? 'block' : 'hidden'
            } lg:block`}
          >
            <DesignSidebar
              design={design}
              setDesign={setDesign}
              fontPairs={fontPairs}
            />
          </div>

          <div
            className={`space-y-6 ${
              activeTab === 'content' ? 'block' : 'hidden'
            } lg:block`}
          >
            <ResumeForm
              data={resumeData}
              setData={setResumeData}
              uncertainFields={uncertainFields}
              onParsed={handleParsedResume}
              onToast={handleToast}
              uploadInputRef={uploadInputRef}
            />
          </div>

          <div
            className={`lg:sticky lg:top-6 lg:self-start ${
              activeTab === 'preview' ? 'block' : 'hidden'
            } lg:block`}
          >
            <ResumePreview data={resumeData} design={design} />
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-full bg-slate-900/90 px-5 py-3 text-sm text-white shadow-soft">
          {toast}
        </div>
      )}
    </div>
  )
}

export default App

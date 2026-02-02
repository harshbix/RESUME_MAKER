import { useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import mammoth from 'mammoth'
import parseResume from '../utils/parseResume.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.js`

async function extractPdfText(arrayBuffer) {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) })
  const pdf = await loadingTask.promise
  const pages = []
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item) => item.str).join(' ')
    pages.push(pageText)
  }
  return pages.join('\n')
}

async function extractDocxText(arrayBuffer) {
  const { value } = await mammoth.extractRawText({ arrayBuffer })
  return value
}

function UploadResume({ onParsed, onError, inputRef }) {
  const [status, setStatus] = useState('idle')
  const localInputRef = useRef(null)
  const fileInputRef = inputRef || localInputRef
  const isLoading = status === 'loading'

  const handleFile = async (file) => {
    if (!file) return
    setStatus('loading')
    try {
      const arrayBuffer = await file.arrayBuffer()
      const ext = file.name.toLowerCase()
      let rawText = ''
      if (ext.endsWith('.pdf')) {
        rawText = await extractPdfText(arrayBuffer)
      } else if (ext.endsWith('.docx')) {
        rawText = await extractDocxText(arrayBuffer)
      } else {
        throw new Error('Unsupported file type')
      }
      const parsed = parseResume(rawText)
      if (!parsed?.data) {
        throw new Error('Unable to parse resume content.')
      }
      onParsed(parsed)
      setStatus('done')
    } catch (error) {
      setStatus('error')
      onError(error.message || 'Something went wrong while parsing the resume.')
    } finally {
      setTimeout(() => setStatus('idle'), 2200)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-soft backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">
            Import Existing Resume (PDF or DOCX)
          </p>
          <p className="text-xs text-slate-400">Smart parsing enabled.</p>
        </div>
        <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-400">
          Smart
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        <button
          className="rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-glow transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          Upload Resume
        </button>
        {status === 'loading' && (
          <span className="text-xs text-amber-300">Analyzing resume…</span>
        )}
        {status === 'done' && (
          <span className="text-xs text-emerald-300">Auto-fill complete.</span>
        )}
        {status === 'error' && (
          <span className="text-xs text-rose-300">Parsing failed.</span>
        )}
      </div>
    </div>
  )
}

export default UploadResume

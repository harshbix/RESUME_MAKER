import { useState } from 'react'
import { exportResumeToPdf } from '../utils/pdfExport.js'

function PDFDownloadButton({ fileName, onDone }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (isExporting) return
    setIsExporting(true)
    try {
      const element = document.getElementById('resume-preview')
      await exportResumeToPdf({ element, fileName })
      onDone?.()
    } catch (error) {
      onDone?.('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      className="fixed right-6 top-6 z-30 rounded-full bg-indigo-500 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow-glow transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? 'Exporting…' : 'Download Professional PDF'}
    </button>
  )
}

export default PDFDownloadButton

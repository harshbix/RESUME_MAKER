import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const buildFileName = (baseName) => {
  const safe = baseName
    ? baseName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
    : 'Resume'
  return `${safe || 'Resume'}_Resume.pdf`
}

export async function exportResumeToPdf({ element, fileName }) {
  if (!element) throw new Error('Resume preview not found.')

  if (document.fonts?.ready) {
    await document.fonts.ready
  }

  const canvas = await html2canvas(element, {
    scale: 2.6,
    useCORS: true,
    allowTaint: true,
    logging: false,
    removeContainer: true,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' })
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pdfWidth
  const imgHeight = (canvas.height * pdfWidth) / canvas.width
  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pdfHeight

  while (heightLeft > 0) {
    position -= pdfHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight
  }

  pdf.save(buildFileName(fileName))
}

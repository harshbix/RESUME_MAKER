const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const phoneRegex = /(\+?\d[\d\s().-]{7,}\d)/g
const urlRegex = /(https?:\/\/\S+|www\.\S+)/gi
const dateRangeRegex = /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)?\.?\s?\d{4})\s*(?:-|–|—|to)\s*(Present|Current|Now|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)?\.?\s?\d{4})/i
const yearRangeRegex = /(\b\d{4})\s*(?:-|–|—|to)\s*(Present|Current|Now|\b\d{4})/i

const sectionKeywords = {
  summary: ['summary', 'profile', 'about', 'professional summary'],
  experience: ['experience', 'work history', 'employment', 'professional experience'],
  education: ['education', 'academics'],
  skills: ['skills', 'technical skills', 'core competencies', 'expertise'],
}

const normalize = (value) => value.toLowerCase().replace(/[:\-]/g, '').trim()

const detectSection = (line) => {
  const normalized = normalize(line)
  for (const [section, keywords] of Object.entries(sectionKeywords)) {
    if (keywords.some((keyword) => normalized === keyword || normalized.includes(keyword))) {
      return section
    }
  }
  return null
}

const splitIntoBlocks = (lines) => {
  const blocks = []
  let current = []
  lines.forEach((line) => {
    if ((dateRangeRegex.test(line) || yearRangeRegex.test(line)) && current.length) {
      blocks.push(current)
      current = [line]
      return
    }
    if (current.length && /^[A-Z][^:]{3,40}$/.test(line) && !line.startsWith('-')) {
      blocks.push(current)
      current = [line]
      return
    }
    current.push(line)
  })
  if (current.length) blocks.push(current)
  return blocks
}

const parseExperienceBlock = (block) => {
  const headerLine = block.find((line) => !line.startsWith('-') && !line.startsWith('•'))
  const dateLine = block.find((line) => dateRangeRegex.test(line) || yearRangeRegex.test(line))
  const dateMatch = dateLine
    ? dateLine.match(dateRangeRegex) || dateLine.match(yearRangeRegex)
    : null
  let role = ''
  let company = ''
  if (headerLine) {
    const parts = headerLine.split(/\s[-|•] /)
    role = parts[0]?.trim() || ''
    company = parts[1]?.trim() || ''
  }
  if (!company && dateLine && block.length > 1) {
    const candidate = block[1]
    if (candidate && !dateRangeRegex.test(candidate)) {
      company = candidate
    }
  }
  const bullets = block
    .filter((line) => line.startsWith('-') || line.startsWith('•') || line.startsWith('*'))
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)
  const supplemental = block
    .filter(
      (line) =>
        line !== headerLine &&
        line !== dateLine &&
        !line.startsWith('-') &&
        !line.startsWith('•')
    )
    .map((line) => line.trim())
    .filter(Boolean)

  return {
    id: crypto.randomUUID(),
    role,
    company,
    location: '',
    startDate: dateMatch?.[1] || '',
    endDate: dateMatch?.[2] || '',
    bullets: bullets.length ? bullets : supplemental.length ? supplemental : [''],
  }
}

const parseEducationBlock = (block) => {
  const degree = block[0] || ''
  const school = block[1] || ''
  const dateLine = block.find((line) => dateRangeRegex.test(line) || yearRangeRegex.test(line))
  const dateMatch = dateLine
    ? dateLine.match(dateRangeRegex) || dateLine.match(yearRangeRegex)
    : null
  return {
    id: crypto.randomUUID(),
    degree,
    school,
    location: '',
    startDate: dateMatch?.[1] || '',
    endDate: dateMatch?.[2] || '',
    details: !dateMatch && dateLine ? dateLine : '',
  }
}

const pickFirstLine = (lines) => lines.find((line) => line.length > 2) || ''

const detectHeaderLines = (lines) => {
  const firstSectionIndex = lines.findIndex((line) => detectSection(line))
  return firstSectionIndex === -1 ? lines.slice(0, 6) : lines.slice(0, firstSectionIndex)
}

const findLocation = (lines) => {
  const cityState = lines.find((line) => /[A-Za-z]+,\s?[A-Za-z]{2}/.test(line))
  if (cityState) return cityState
  const labelled = lines.find((line) => line.toLowerCase().includes('location'))
  if (labelled) return labelled.split(/:/)[1]?.trim() || ''
  return ''
}

const testOnce = (line, matcher) =>
  new RegExp(matcher.source, matcher.flags.replace('g', '')).test(line)

const findContactLine = (lines, matcher) =>
  lines.find((line) => testOnce(line, matcher))

const findSkillLine = (lines) =>
  lines.find((line) => line.split(/,|\|/).length >= 4) || ''

export default function parseResume(rawText) {
  const cleanText = rawText.replace(/\r/g, '\n')
  const lines = cleanText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const emails = cleanText.match(emailRegex) || []
  const phones = cleanText.match(phoneRegex) || []
  const urls = cleanText.match(urlRegex) || []

  const headerLines = detectHeaderLines(lines)
  const fullName = pickFirstLine(headerLines)
  const titleCandidate = headerLines.find(
    (line) =>
      line !== fullName &&
      !testOnce(line, emailRegex) &&
      !testOnce(line, phoneRegex) &&
      !testOnce(line, urlRegex)
  )
  const emailLine = findContactLine(headerLines, emailRegex)
  const phoneLine = findContactLine(headerLines, phoneRegex)
  const urlLine = findContactLine(headerLines, urlRegex)

  const data = {
    personal: {
      fullName,
      title: titleCandidate,
      email: emailLine ? emailLine.match(emailRegex)?.[0] || '' : emails[0] || '',
      phone: phoneLine ? phoneLine.match(phoneRegex)?.[0] || '' : phones[0] || '',
      location: '',
      website: urlLine ? urlLine.match(urlRegex)?.[0] || '' : urls[0] || '',
      photo: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
  }

  const uncertainFields = []

  if (!data.personal.fullName) uncertainFields.push('personal.fullName')
  if (!data.personal.title) uncertainFields.push('personal.title')
  if (!data.personal.email) uncertainFields.push('personal.email')
  if (!data.personal.phone) uncertainFields.push('personal.phone')

  let currentSection = null
  const buckets = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
  }

  lines.forEach((line) => {
    const section = detectSection(line)
    if (section) {
      currentSection = section
      return
    }
    if (currentSection) {
      buckets[currentSection].push(line)
    }
  })

  if (buckets.summary.length) {
    data.summary = buckets.summary.join(' ')
  } else {
    const summaryFallbackIndex = lines.findIndex((line) => line.length > 80)
    if (summaryFallbackIndex >= 0) {
      data.summary = lines[summaryFallbackIndex]
    }
  }

  if (!data.summary) uncertainFields.push('summary')

  if (buckets.experience.length) {
    const blocks = splitIntoBlocks(buckets.experience)
    data.experience = blocks.map(parseExperienceBlock)
  }

  if (!data.experience.length) uncertainFields.push('experience.0')

  if (buckets.education.length) {
    const blocks = splitIntoBlocks(buckets.education)
    data.education = blocks.map(parseEducationBlock)
  }

  if (!data.education.length) uncertainFields.push('education.0')

  const skillsText = buckets.skills.join(' ')
  if (skillsText) {
    data.skills = skillsText
      .split(/,|\||•|·/)
      .map((skill) => skill.trim())
      .filter(Boolean)
  }

  if (!data.skills.length) {
    const skillLine = findSkillLine(lines)
    if (skillLine) {
      data.skills = skillLine
        .split(/,|\||•|·/)
        .map((skill) => skill.trim())
        .filter(Boolean)
    }
  }

  if (!data.skills.length) uncertainFields.push('skills')

  data.personal.location = findLocation(lines) || ''

  return {
    data,
    uncertainFields,
  }
}

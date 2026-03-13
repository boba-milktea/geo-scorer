import type { DimensionKey, DimensionScore, Issue, ScoringResult } from './types'

// ── helpers ──────────────────────────────────────────────────────────────────

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, '')
  const m = word.match(/[aeiouy]{1,2}/g)
  return m ? m.length : 1
}

function sentences(text: string): string[] {
  return text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5)
}

function words(text: string): string[] {
  return text.split(/\s+/).filter(Boolean)
}

function clamp(v: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, v))
}

// ── dimension scorers ─────────────────────────────────────────────────────────

function scoreClarity(text: string): { score: number; issues: Issue[] } {
  const ws = words(text)
  const ss = sentences(text)
  if (ws.length === 0) return { score: 0, issues: [] }

  const avgLen = ws.length / Math.max(ss.length, 1)
  const syllables = ws.reduce((a, w) => a + countSyllables(w), 0)
  const flesch = clamp(206.835 - 1.015 * avgLen - 84.6 * (syllables / ws.length))

  const passive = (text.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) || []).length
  const passiveRatio = passive / Math.max(ss.length, 1)

  const firstSentence = ss[0] || ''
  const opensWithAnswer =
    /^(the |this |these |here |yes|no|in |to )/i.test(firstSentence) ||
    firstSentence.length < 120

  // Score components
  let score = 50
  score += clamp((flesch - 30) / 70 * 30, 0, 30)   // up to +30 for readability
  score -= clamp(passiveRatio * 20, 0, 20)            // up to -20 for passive voice
  score += opensWithAnswer ? 10 : 0                   // +10 for direct opening
  score -= clamp((avgLen - 20) * 2, 0, 20)            // penalty for long sentences

  const issues: Issue[] = []

  if (flesch < 50) issues.push({
    dimension: 'clarity',
    impact: 'high',
    title: 'Low readability score',
    description: `Flesch score is ${flesch.toFixed(0)} — content is complex. AI engines favor scores above 60. Shorten sentences and use simpler vocabulary.`,
  })

  if (passiveRatio > 0.3) issues.push({
    dimension: 'clarity',
    impact: 'medium',
    title: 'High passive voice usage',
    description: `About ${Math.round(passiveRatio * 100)}% of sentences use passive voice. Rewrite in active voice to sound more authoritative and direct.`,
  })

  if (avgLen > 25) issues.push({
    dimension: 'clarity',
    impact: 'medium',
    title: 'Long average sentence length',
    description: `Average sentence is ${avgLen.toFixed(0)} words. Target under 20 words per sentence for better AI parsing.`,
  })

  if (!opensWithAnswer) issues.push({
    dimension: 'clarity',
    impact: 'low',
    title: 'Indirect opening',
    description: 'Content does not open with a direct answer or statement. AI engines prefer content that leads with the key point.',
  })

  return { score: clamp(Math.round(score)), issues }
}

function scoreFactualDensity(text: string): { score: number; issues: Issue[] } {
  const ws = words(text)
  if (ws.length === 0) return { score: 0, issues: [] }

  const per100 = 100 / ws.length

  const stats = (text.match(/\d+(\.\d+)?%|\$[\d,]+|\d[\d,]{2,}/g) || []).length
  const dates = (text.match(/\b(19|20)\d{2}\b/g) || []).length
  const namedEntities = (text.match(/\b[A-Z][a-z]+ (?:[A-Z][a-z]+ )?(?:Inc|Corp|LLC|University|Institute|Foundation|Group|according|study|research|report)\b/g) || []).length
  const citations = (text.match(/according to|cited by|research shows|study found|published in|source:/gi) || []).length
  const hedging = (text.match(/\b(might|could|perhaps|possibly|probably|seems|appears|may)\b/gi) || []).length

  const factDensity = (stats + dates + namedEntities + citations) * per100
  const hedgeRatio = hedging / Math.max(ws.length / 100, 1)

  let score = 30
  score += clamp(factDensity * 8, 0, 40)
  score += clamp(citations * 5, 0, 20)
  score -= clamp(hedgeRatio * 3, 0, 20)

  const issues: Issue[] = []

  if (stats + dates < 2) issues.push({
    dimension: 'factualDensity',
    impact: 'high',
    title: 'Few specific facts or figures',
    description: 'Content has very few statistics, dates, or measurable claims. AI engines strongly prefer content grounded in specific, verifiable data.',
  })

  if (citations === 0) issues.push({
    dimension: 'factualDensity',
    impact: 'high',
    title: 'No source attribution',
    description: 'No phrases like "according to" or "research shows" detected. Citing sources signals authority to AI engines.',
  })

  if (hedgeRatio > 2) issues.push({
    dimension: 'factualDensity',
    impact: 'medium',
    title: 'Excessive hedging language',
    description: `Words like "might", "could", "possibly" appear frequently. Replace hedged claims with confident, verifiable statements.`,
  })

  return { score: clamp(Math.round(score)), issues }
}

function scoreStructure(text: string): { score: number; issues: Issue[] } {
  const ws = words(text)
  if (ws.length === 0) return { score: 0, issues: [] }

  const hasH2 = /^#{2}\s/m.test(text) || /<h2/i.test(text)
  const hasH3 = /^#{3}\s/m.test(text) || /<h3/i.test(text)
  const hasList = /^\s*[-*•]\s/m.test(text) || /^\s*\d+\.\s/m.test(text) || /<[uo]l/i.test(text)
  const hasTable = /\|.*\|.*\|/.test(text) || /<table/i.test(text)
  const hasFaq =
    /faq|frequently asked/i.test(text) ||
    (text.match(/\?/g) || []).length >= 3
  const hasSummary = /summary|tl;dr|in conclusion|key takeaway|in short/i.test(text)
  const hasQuestionHeadings = /^#{1,3}.*(what|how|why|when|which|who|where|is |are |does |can )/im.test(text)

  let score = 20
  if (hasH2) score += 15
  if (hasH3) score += 10
  if (hasList) score += 15
  if (hasTable) score += 10
  if (hasFaq) score += 15
  if (hasSummary) score += 10
  if (hasQuestionHeadings) score += 5

  const issues: Issue[] = []

  if (!hasH2 && !hasH3) issues.push({
    dimension: 'structure',
    impact: 'high',
    title: 'No headings detected',
    description: 'Content has no H2 or H3 headings. AI engines use headings to understand content hierarchy and extract answers.',
  })

  if (!hasList && !hasTable) issues.push({
    dimension: 'structure',
    impact: 'medium',
    title: 'No lists or tables',
    description: 'Bullet lists and tables make structured data far easier for AI to extract and cite accurately.',
  })

  if (!hasFaq) issues.push({
    dimension: 'structure',
    impact: 'medium',
    title: 'No FAQ section',
    description: 'FAQ sections are one of the strongest GEO signals — each question-answer pair is a direct citation opportunity.',
  })

  if (!hasSummary) issues.push({
    dimension: 'structure',
    impact: 'low',
    title: 'No summary block',
    description: 'A TL;DR or summary at the top gives AI engines an immediate answer without parsing the full article.',
  })

  return { score: clamp(Math.round(score)), issues }
}

function scoreAuthority(text: string): { score: number; issues: Issue[] } {
  const ws = words(text)
  if (ws.length === 0) return { score: 0, issues: [] }

  const hasAuthor = /by [A-Z][a-z]+|author:|written by/i.test(text)
  const hasDate = /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}|\b20\d{2}\b/i.test(text)
  const hasExpertTerms = (text.match(/\b(research|study|analysis|data|evidence|expert|professional|certified|licensed)\b/gi) || []).length
  const uniqueWords = new Set(ws.map(w => w.toLowerCase())).size
  const vocabularyRichness = uniqueWords / ws.length
  const depth = clamp(ws.length / 15, 0, 30) // up to +30 for content depth

  let score = 20
  if (hasAuthor) score += 20
  if (hasDate) score += 10
  score += clamp(hasExpertTerms * 3, 0, 20)
  score += clamp(vocabularyRichness * 30, 0, 20)
  score += depth

  const issues: Issue[] = []

  if (!hasAuthor) issues.push({
    dimension: 'authority',
    impact: 'high',
    title: 'No author attribution',
    description: 'No author name detected. Named authorship is a strong E-E-A-T signal that influences AI source selection.',
  })

  if (!hasDate) issues.push({
    dimension: 'authority',
    impact: 'medium',
    title: 'No publish date',
    description: 'AI engines prefer fresh, dated content. Adding an explicit publish or update date boosts trustworthiness.',
  })

  if (ws.length < 300) issues.push({
    dimension: 'authority',
    impact: 'high',
    title: 'Content too short',
    description: `Only ${ws.length} words. Content under 300 words rarely gets cited — aim for 600+ for topical depth.`,
  })

  if (hasExpertTerms < 2) issues.push({
    dimension: 'authority',
    impact: 'low',
    title: 'Low expert vocabulary',
    description: 'Few domain-specific terms detected. Using precise professional language signals topical expertise.',
  })

  return { score: clamp(Math.round(score)), issues }
}

// ── prompt builder ────────────────────────────────────────────────────────────

export function buildPrompt(text: string, result: ScoringResult): string {
  const topIssues = result.issues
    .filter(i => i.impact === 'high')
    .slice(0, 3)
    .map(i => `- ${i.title}: ${i.description}`)
    .join('\n')

  const dimSummary = result.dimensions
    .map(d => `${d.label}: ${d.score}/100`)
    .join(' | ')

  const excerpt = text.slice(0, 1200).trim()

  return `You are a GEO (Generative Engine Optimization) expert. I've run a heuristic analysis on the following content and found specific issues. Please provide:

1. A brief overall assessment (2–3 sentences)
2. Three concrete rewrite suggestions — each with a "Before" and "After" example taken from the actual text
3. The single most impactful structural change to improve AI citability

## Heuristic scores
${dimSummary}
Overall GEO Score: ${result.overallScore}/100

## High-impact issues found
${topIssues || 'No critical issues detected — focus on refinement.'}

## Content excerpt (first 1200 chars)
---
${excerpt}
---

Be specific and reference the actual content. Keep suggestions actionable and focused on what AI engines like Claude, ChatGPT, and Perplexity prioritize when selecting sources to cite.`
}

// ── main scorer ───────────────────────────────────────────────────────────────

const DIMENSION_META: Record<DimensionKey, { label: string; icon: string; color: string }> = {
  clarity:       { label: 'Clarity & Directness',         icon: '◎', color: '#0ea5e9' },
  factualDensity:{ label: 'Factual Density & Citations',  icon: '◈', color: '#8b5cf6' },
  structure:     { label: 'Structure & Scannability',     icon: '▦', color: '#06b6d4' },
  authority:     { label: 'Topical Authority',            icon: '◉', color: '#10b981' },
}

export function analyzeContent(text: string): ScoringResult {
  const ws = words(text)
  const wordCount = ws.length
  const readingTime = Math.max(1, Math.round(wordCount / 200))

  const clarity       = scoreClarity(text)
  const factualDensity = scoreFactualDensity(text)
  const structure     = scoreStructure(text)
  const authority     = scoreAuthority(text)

  // Weighted overall
  const overallScore = Math.round(
    clarity.score       * 0.30 +
    factualDensity.score * 0.30 +
    structure.score     * 0.25 +
    authority.score     * 0.15
  )

  const dimensions: DimensionScore[] = (
    ['clarity', 'factualDensity', 'structure', 'authority'] as DimensionKey[]
  ).map(key => ({
    key,
    ...DIMENSION_META[key],
    score: { clarity, factualDensity, structure, authority }[key].score,
  }))

  const issues: Issue[] = [
    ...clarity.issues,
    ...factualDensity.issues,
    ...structure.issues,
    ...authority.issues,
  ].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.impact] - order[b.impact]
  })

  return { overallScore, dimensions, issues, wordCount, readingTime }
}

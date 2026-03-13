export type DimensionKey = 'clarity' | 'factualDensity' | 'structure' | 'authority'

export interface DimensionScore {
  key: DimensionKey
  label: string
  score: number
  icon: string
  color: string
}

export interface Issue {
  dimension: DimensionKey
  impact: 'high' | 'medium' | 'low'
  title: string
  description: string
}

export interface ScoringResult {
  overallScore: number
  dimensions: DimensionScore[]
  issues: Issue[]
  wordCount: number
  readingTime: number
}

export type AppState = 'idle' | 'done'

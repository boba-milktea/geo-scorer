import { useState } from 'react'
import type { ScoringResult } from '../lib/types'
import { buildPrompt } from '../lib/heuristics'
import ScoreGauge from './ScoreGauge'
import DimensionBar from './DimensionBar'
import IssueCard from './IssueCard'
import StatBadge from './StatBadge'
import PromptModal from './PromptModal'

interface Props {
  result: ScoringResult
  originalText: string
  onReset: () => void
}

const card: React.CSSProperties = {
  background: 'white',
  border: '1px solid #e2e8f0',
  borderRadius: 20,
  padding: 24,
  boxShadow: '0 4px 24px rgba(14,165,233,0.06)',
}

export default function ResultsPanel({ result, originalText, onReset }: Props) {
  const [showPrompt, setShowPrompt] = useState(false)
  const prompt = buildPrompt(originalText, result)

  const stats = [
    { label: 'Word count',     value: result.wordCount.toString() },
    { label: 'Reading time',   value: `${result.readingTime} min` },
    { label: 'Issues found',   value: result.issues.length.toString() },
    { label: 'High priority',  value: result.issues.filter(i => i.impact === 'high').length.toString() },
  ]

  return (
    <>
      {showPrompt && (
        <PromptModal prompt={prompt} onClose={() => setShowPrompt(false)} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Score hero */}
        <div className="fade-up" style={{
          ...card,
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 28,
          alignItems: 'center',
        }}>
          <ScoreGauge score={result.overallScore} />
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap',
            }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: '#0ea5e9',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                GEO Score
              </span>
              <span style={{ fontSize: 11, color: '#cbd5e1' }}>·</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                {result.wordCount} words · {result.readingTime} min read
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 18 }}>
              {result.overallScore >= 70
                ? 'Strong GEO foundation. A few refinements could push you into excellent territory.'
                : result.overallScore >= 45
                ? 'Moderate AI visibility. Key structural and authority issues are limiting citability.'
                : 'Content needs significant GEO work before AI engines will reliably cite it.'}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowPrompt(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 18px', borderRadius: 10, border: 'none',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
                  color: 'white',
                  boxShadow: '0 4px 14px rgba(14,165,233,0.35)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(14,165,233,0.45)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(14,165,233,0.35)'
                }}
              >
                ✦ Get AI suggestions
              </button>
              <button
                onClick={onReset}
                style={{
                  fontSize: 13, color: '#64748b',
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                  borderRadius: 10, padding: '9px 16px',
                  cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
              >
                ← New analysis
              </button>
            </div>
          </div>
        </div>

        {/* Two-col: dimensions + stats */}
        <div className="fade-up fade-up-1" style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 16,
          alignItems: 'start',
        }}>
          {/* Dimensions */}
          <div style={card}>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: 18,
              color: '#0f172a', marginBottom: 18,
            }}>
              Score breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {result.dimensions.map((d, i) => (
                <DimensionBar
                  key={d.key}
                  dimKey={d.key}
                  label={d.label}
                  score={d.score}
                  delay={i * 80}
                />
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ ...card, minWidth: 160 }}>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: 18,
              color: '#0f172a', marginBottom: 16,
            }}>
              At a glance
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.map(s => <StatBadge key={s.label} label={s.label} value={s.value} />)}
            </div>
          </div>
        </div>

        {/* Issues */}
        <div className="fade-up fade-up-2" style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#0f172a', marginBottom: 3 }}>
                Issues found
              </h3>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Sorted by impact on AI citability</p>
            </div>
            <button
              onClick={() => setShowPrompt(true)}
              style={{
                fontSize: 12, fontWeight: 600, color: '#0ea5e9',
                background: '#f0f9ff', border: '1px solid #bae6fd',
                borderRadius: 8, padding: '6px 12px',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e0f2fe'}
              onMouseLeave={e => e.currentTarget.style.background = '#f0f9ff'}
            >
              ✦ Fix these with AI →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {result.issues.length === 0 ? (
              <div style={{
                padding: '20px', textAlign: 'center',
                background: '#f0fdf4', borderRadius: 10,
                fontSize: 13, color: '#16a34a',
              }}>
                🎉 No major issues found! Use AI suggestions for fine-tuning.
              </div>
            ) : result.issues.map((issue, i) => (
              <IssueCard key={i} issue={issue} />
            ))}
          </div>
        </div>

        {/* CTA banner */}
        <div className="fade-up fade-up-3" style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
          borderRadius: 20,
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
          boxShadow: '0 8px 24px rgba(14,165,233,0.3)',
        }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20, color: 'white', marginBottom: 4,
            }}>
              Ready to improve your score?
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
              We've built a tailored prompt with your scores and issues — paste it into any AI for specific rewrite suggestions.
            </p>
          </div>
          <button
            onClick={() => setShowPrompt(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 22px', borderRadius: 11,
              border: '1.5px solid rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.15)',
              color: 'white', fontSize: 14, fontWeight: 600,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer', flexShrink: 0,
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            ✦ Get AI suggestions
          </button>
        </div>

      </div>
    </>
  )
}

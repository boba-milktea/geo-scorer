import { useState } from 'react'
import type { ScoringResult, AppState } from './lib/types'
import { analyzeContent } from './lib/heuristics'
import InputPanel from './components/InputPanel'
import ResultsPanel from './components/ResultsPanel'

export default function App() {
  const [state, setState] = useState<AppState>('idle')
  const [result, setResult] = useState<ScoringResult | null>(null)
  const [originalText, setOriginalText] = useState('')

  function handleAnalyze(text: string) {
    setOriginalText(text)
    const r = analyzeContent(text)
    setResult(r)
    setState('done')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleReset() {
    setState('idle')
    setResult(null)
    setOriginalText('')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--sky-50)' }}>

      {/* Nav */}
      <header style={{
        borderBottom: '1px solid #e0f2fe',
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 860, margin: '0 auto', padding: '0 24px',
          height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onClick={handleReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #38bdf8, #0369a1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, color: 'white', fontWeight: 700,
              boxShadow: '0 2px 8px rgba(14,165,233,0.35)',
            }}>
              G
            </div>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 18,
              color: '#0f172a', letterSpacing: '-0.02em',
            }}>
              GEO Scorer
            </span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {state === 'done' && (
              <button
                onClick={handleReset}
                style={{
                  fontSize: 13, color: '#0ea5e9',
                  background: '#f0f9ff', border: '1px solid #bae6fd',
                  borderRadius: 8, padding: '6px 14px',
                  cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500,
                }}
              >
                ← New analysis
              </button>
            )}
            <span style={{
              fontSize: 11,
              background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
              color: '#0369a1', padding: '4px 10px',
              borderRadius: 99, fontWeight: 700, letterSpacing: '0.06em',
            }}>
              BETA
            </span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Hero — idle only */}
        {state === 'idle' && (
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              border: '1px solid #bae6fd', borderRadius: 99,
              padding: '5px 16px', marginBottom: 20,
            }}>
              <span style={{
                fontSize: 11, color: '#0284c7', fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Generative Engine Optimization
              </span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 52px)',
              color: '#0f172a', lineHeight: 1.15,
              marginBottom: 14, letterSpacing: '-0.02em',
            }}>
              Is your content ready<br />
              <em style={{ color: '#0ea5e9' }}>for AI search?</em>
            </h1>
            <p style={{
              fontSize: 16, color: '#64748b',
              maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7,
            }}>
              Paste any article or page copy to get an instant GEO score — then get a tailored prompt to fix issues with AI.
            </p>
          </div>
        )}

        {/* Input */}
        {state === 'idle' && (
          <>
            <div className="fade-up fade-up-1">
              <InputPanel onAnalyze={handleAnalyze} />
            </div>

            {/* Feature pills */}
            <div className="fade-up fade-up-2" style={{
              display: 'flex', flexWrap: 'wrap',
              justifyContent: 'center', gap: 10, marginTop: 28,
            }}>
              {[
                { icon: '◎', text: 'Clarity & Readability' },
                { icon: '◈', text: 'Factual Density' },
                { icon: '▦', text: 'Structure & Scannability' },
                { icon: '◉', text: 'Authority Signals' },
                { icon: '✦', text: 'AI-ready prompt export' },
              ].map(f => (
                <div key={f.text} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'white', border: '1px solid #e2e8f0',
                  borderRadius: 99, padding: '7px 14px',
                  fontSize: 13, color: '#475569',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  <span style={{ color: '#0ea5e9', fontSize: 12 }}>{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="fade-up fade-up-3" style={{
              marginTop: 52, display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
            }}>
              {[
                { num: '01', title: 'Paste your content', desc: 'Drop in any article, landing page, or blog post — minimum 50 words.' },
                { num: '02', title: 'Get your GEO score', desc: 'Instant analysis across 4 dimensions with specific issues ranked by impact.' },
                { num: '03', title: 'Fix it with AI', desc: 'Copy your tailored prompt and open Claude or ChatGPT for precise rewrite suggestions.' },
              ].map(step => (
                <div key={step.num} style={{
                  background: 'white', border: '1px solid #e2e8f0',
                  borderRadius: 16, padding: '20px 22px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 28,
                    color: '#e0f2fe', marginBottom: 10, lineHeight: 1,
                  }}>
                    {step.num}
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Results */}
        {state === 'done' && result && (
          <ResultsPanel result={result} originalText={originalText} onReset={handleReset} />
        )}

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #e0f2fe',
        padding: '20px 24px', textAlign: 'center',
      }}>
        <p style={{ fontSize: 12, color: '#94a3b8' }}>
          GEO Scorer · 100% client-side · No data stored · Built by{' '}
          <a
            href="https://catherine-lin.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#0ea5e9',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0284c7')}
            onMouseLeave={e => (e.currentTarget.style.color = '#0ea5e9')}
          >
            Catherine Lin
          </a>
        </p>
      </footer>
    </div>
  )
}

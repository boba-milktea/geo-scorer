import { useState, useRef } from 'react'

interface Props {
  onAnalyze: (text: string) => void
}

export default function InputPanel({ onAnalyze }: Props) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const ready = wordCount >= 50

  function handleSubmit() {
    if (!ready) return
    onAnalyze(text.trim())
  }

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: 20,
      padding: 28,
      boxShadow: '0 4px 24px rgba(14,165,233,0.07), 0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <label style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 600,
        color: '#475569',
        marginBottom: 10,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        Paste your content
      </label>

      <div style={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste your article, blog post, landing page copy, or any web content here…"
          rows={10}
          style={{
            width: '100%',
            resize: 'vertical',
            border: '1.5px solid #e2e8f0',
            borderRadius: 12,
            padding: '14px 16px',
            paddingBottom: 36,
            fontSize: 14,
            lineHeight: 1.7,
            color: '#334155',
            fontFamily: 'var(--font-body)',
            outline: 'none',
            background: '#f8fafc',
            transition: 'border-color 0.15s, background 0.15s',
          }}
          onFocus={e => {
            e.target.style.borderColor = '#7dd3fc'
            e.target.style.background = 'white'
          }}
          onBlur={e => {
            e.target.style.borderColor = '#e2e8f0'
            e.target.style.background = '#f8fafc'
          }}
          onKeyDown={e => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSubmit()
          }}
        />
        {/* Word count badge */}
        <div style={{
          position: 'absolute',
          bottom: 10,
          left: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <div style={{
            height: 4,
            width: 80,
            background: '#e2e8f0',
            borderRadius: 99,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, (wordCount / 50) * 100)}%`,
              background: ready ? '#22c55e' : '#38bdf8',
              borderRadius: 99,
              transition: 'width 0.3s ease, background 0.3s',
            }} />
          </div>
          <span style={{
            fontSize: 11,
            color: ready ? '#16a34a' : '#94a3b8',
            fontWeight: 500,
            transition: 'color 0.3s',
          }}>
            {wordCount} / 50 words min
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 14,
        gap: 12,
        flexWrap: 'wrap',
      }}>
        <p style={{ fontSize: 12, color: '#94a3b8' }}>
          Tip: <kbd style={{
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: 4,
            padding: '1px 5px',
            fontSize: 11,
            color: '#64748b',
          }}>⌘ Enter</kbd> to analyze
        </p>

        <button
          onClick={handleSubmit}
          disabled={!ready}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 26px',
            borderRadius: 10,
            border: 'none',
            cursor: ready ? 'pointer' : 'not-allowed',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            background: ready
              ? 'linear-gradient(135deg, #38bdf8, #0284c7)'
              : '#e2e8f0',
            color: ready ? 'white' : '#94a3b8',
            boxShadow: ready ? '0 4px 14px rgba(14,165,233,0.35)' : 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            if (ready) {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(14,165,233,0.45)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = ready ? '0 4px 14px rgba(14,165,233,0.35)' : 'none'
          }}
        >
          Score my content →
        </button>
      </div>
    </div>
  )
}

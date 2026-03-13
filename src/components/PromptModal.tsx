import { useState, useEffect } from 'react'

interface Props {
  prompt: string
  onClose: () => void
}

export default function PromptModal({ prompt, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function handleOpenClaude() {
    handleCopy()
    window.open('https://claude.ai', '_blank', 'noopener')
  }

  function handleOpenChatGPT() {
    handleCopy()
    window.open('https://chat.openai.com', '_blank', 'noopener')
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div style={{
        background: 'white',
        borderRadius: 20,
        width: '100%',
        maxWidth: 620,
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
        animation: 'fadeUp 0.2s ease',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>
            ✦
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20, color: '#0f172a', marginBottom: 3,
            }}>
              Your AI analysis prompt
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              Copy this prompt, then paste it into Claude or ChatGPT for deep rewrite suggestions.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 8,
              border: '1px solid #e2e8f0', background: 'white',
              cursor: 'pointer', fontSize: 16, color: '#94a3b8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Prompt text */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '16px 24px',
        }}>
          <pre style={{
            margin: 0,
            fontFamily: 'var(--font-body)',
            fontSize: 12.5,
            lineHeight: 1.75,
            color: '#334155',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: '14px 16px',
          }}>
            {prompt}
          </pre>
        </div>

        {/* Actions */}
        <div style={{
          padding: '16px 24px 20px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
        }}>
          <button
            onClick={handleCopy}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 10,
              border: '1.5px solid ' + (copied ? '#86efac' : '#e2e8f0'),
              background: copied ? '#f0fdf4' : 'white',
              color: copied ? '#16a34a' : '#475569',
              fontSize: 13, fontWeight: 600,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {copied ? '✓ Copied!' : '⎘ Copy prompt'}
          </button>

          <button
            onClick={handleOpenClaude}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #d97706, #b45309)',
              color: 'white',
              fontSize: 13, fontWeight: 600,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(180,83,9,0.3)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          >
            Open Claude ↗
          </button>

          <button
            onClick={handleOpenChatGPT}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              color: 'white',
              fontSize: 13, fontWeight: 600,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(21,128,61,0.3)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          >
            Open ChatGPT ↗
          </button>
        </div>
      </div>
    </div>
  )
}

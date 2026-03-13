import { useEffect, useState } from 'react'

interface Props { score: number }

export default function ScoreGauge({ score }: Props) {
  const [animated, setAnimated] = useState(false)
  const radius = 80
  const circ = 2 * Math.PI * radius
  const half = circ / 2
  const offset = half - (score / 100) * half

  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#0ea5e9' : score >= 30 ? '#f59e0b' : '#ef4444'
  const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : score >= 30 ? 'Fair' : 'Needs work'

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: 200, height: 110 }}>
        <svg width="200" height="110" viewBox="0 0 200 110" style={{ overflow: 'visible' }}>
          {/* Track */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="var(--slate-200)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Score arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${half} ${half}`}
            strokeDashoffset={animated ? offset : half}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1), stroke 0.4s' }}
          />
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((v) => {
            const angle = -180 + (v / 100) * 180
            const rad = (angle * Math.PI) / 180
            const cx = 100 + 90 * Math.cos(rad)
            const cy = 100 + 90 * Math.sin(rad)
            return (
              <circle key={v} cx={cx} cy={cy} r="3" fill="white" stroke={color} strokeWidth="1.5" opacity="0.6" />
            )
          })}
        </svg>
        {/* Center text */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 48,
            lineHeight: 1,
            color: color,
            transition: 'color 0.4s'
          }}>
            {score}
          </span>
          <span style={{ fontSize: 12, color: 'var(--slate-400)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            / 100
          </span>
        </div>
      </div>
      <span style={{
        fontSize: 13,
        fontWeight: 600,
        color: color,
        background: color + '18',
        padding: '3px 12px',
        borderRadius: 99,
        letterSpacing: '0.05em'
      }}>
        {label}
      </span>
    </div>
  )
}

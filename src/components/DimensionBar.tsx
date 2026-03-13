import { useEffect, useState } from 'react'
import type { DimensionKey } from '../lib/types'

const icons: Record<DimensionKey, string> = {
  clarity: '◎',
  factualDensity: '◈',
  structure: '▦',
  authority: '◉',
}

const colors: Record<DimensionKey, string> = {
  clarity: '#0ea5e9',
  factualDensity: '#8b5cf6',
  structure: '#06b6d4',
  authority: '#10b981',
}

interface Props {
  dimKey: DimensionKey
  label: string
  score: number
  delay?: number
}

export default function DimensionBar({ dimKey, label, score, delay = 0 }: Props) {
  const [animated, setAnimated] = useState(false)
  const color = colors[dimKey]

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay + 100)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14, color, lineHeight: 1 }}>{icons[dimKey]}</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--slate-700)' }}>{label}</span>
        </div>
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: score >= 70 ? '#16a34a' : score >= 45 ? 'var(--slate-600)' : '#dc2626',
          minWidth: 28,
          textAlign: 'right'
        }}>
          {score}
        </span>
      </div>
      <div style={{
        height: 6,
        background: 'var(--slate-200)',
        borderRadius: 99,
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: animated ? `${score}%` : '0%',
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          borderRadius: 99,
          transition: `width 0.9s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`
        }} />
      </div>
    </div>
  )
}

import type { Issue } from '../lib/types'

const impactColors = {
  high:   { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444', label: 'High' },
  medium: { bg: '#fffbeb', color: '#b45309', dot: '#f59e0b', label: 'Medium' },
  low:    { bg: '#f0fdf4', color: '#15803d', dot: '#22c55e', label: 'Low' },
}

const dimLabel: Record<string, string> = {
  clarity: 'Clarity',
  factualDensity: 'Factual Density',
  structure: 'Structure',
  authority: 'Authority',
}

export default function IssueCard({ issue }: { issue: Issue }) {
  const s = impactColors[issue.impact]
  return (
    <div style={{
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: 10,
      padding: '14px 16px',
      display: 'flex',
      gap: 12,
    }}>
      <div style={{ paddingTop: 5, flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{issue.title}</span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 99,
            background: s.bg, color: s.color, letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            {s.label}
          </span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{dimLabel[issue.dimension]}</span>
        </div>
        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{issue.description}</p>
      </div>
    </div>
  )
}

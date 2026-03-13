interface Props {
  label: string
  value: string
}

export default function StatBadge({ label, value }: Props) {
  const isPositive = value === 'Yes'
  const isNegative = value === 'No'

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: 10,
      padding: '10px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}>
      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{
        fontSize: 15,
        fontWeight: 600,
        color: isPositive ? '#16a34a' : isNegative ? '#dc2626' : '#1e293b',
      }}>
        {value}
      </span>
    </div>
  )
}

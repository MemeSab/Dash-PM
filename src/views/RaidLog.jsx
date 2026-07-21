import { useState } from 'react'

const raidItems = [
  { id: 1, type: 'Risk', title: 'API rate limit issues', description: 'Third-party API may hit rate limits during peak usage', impact: 'Medium', likelihood: 'High', score: 6, owner: 'Jon', status: 'Mitigating', date: '2026-07-15' },
  { id: 2, type: 'Risk', title: 'Design handoff delays', description: 'Designer availability may impact development timeline', impact: 'High', likelihood: 'Medium', score: 6, owner: 'Jon', status: 'Monitoring', date: '2026-07-10' },
  { id: 3, type: 'Risk', title: 'Scope creep on Renais', description: 'Client may request additional features post-launch', impact: 'Medium', likelihood: 'High', score: 6, owner: 'Jon', status: 'Active', date: '2026-07-01' },
  { id: 4, type: 'Issue', title: 'Team capacity constraints', description: 'Two team members on leave next week', impact: 'Medium', likelihood: 'Certain', score: 5, owner: 'Jon', status: 'Active', date: '2026-07-18' },
  { id: 5, type: 'Issue', title: 'Third-party integration bug', description: 'Payment gateway showing intermittent errors', impact: 'High', likelihood: 'Certain', score: 8, owner: 'Dev Team', status: 'Resolved', date: '2026-07-12' },
  { id: 6, type: 'Action', title: 'Complete SOUL CAP UAT', description: 'User acceptance testing with client stakeholders', impact: 'High', likelihood: 'Certain', score: 8, owner: 'Jon', status: 'Due Today', date: '2026-07-21' },
  { id: 7, type: 'Action', title: 'Finalize Planet X requirements', description: 'Sign off on final feature list with product owner', impact: 'Medium', likelihood: 'Certain', score: 5, owner: 'Jon', status: 'Due This Week', date: '2026-07-25' },
  { id: 8, type: 'Dependency', title: 'Client brand assets for Arighi Bianchi', description: 'Awaiting high-res logos and brand guidelines', impact: 'Medium', likelihood: 'Certain', score: 4, owner: 'Client', status: 'Pending', date: '2026-07-16' },
  { id: 9, type: 'Dependency', title: 'Hosting environment for Mayekoo', description: 'Server provisioning and DNS configuration needed', impact: 'Low', likelihood: 'Certain', score: 2, owner: 'DevOps', status: 'In Progress', date: '2026-07-14' }
]

function getTypeColor(type) {
  if (type === 'Risk') return '#f59e0b'
  if (type === 'Issue') return '#ef4444'
  if (type === 'Action') return '#00b9fb'
  return '#10b981'
}

function getStatusColor(status) {
  if (status === 'Active' || status === 'Mitigating' || status === 'Monitoring') return '#f59e0b'
  if (status === 'Resolved' || status === 'Closed') return '#10b981'
  if (status.includes('Due')) return '#ef4444'
  return '#64748b'
}

function RaidLog() {
  const [filter, setFilter] = useState('All')

  const filteredItems = filter === 'All' 
    ? raidItems 
    : raidItems.filter(item => item.type === filter)

  const getScoreColor = (score) => {
    if (score >= 7) return '#ef4444'
    if (score >= 5) return '#f59e0b'
    return '#10b981'
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>RAID Log</h2>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'Risk', 'Issue', 'Action', 'Dependency'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: filter === f ? '#00b9fb' : '#1e2a3d',
              color: filter === f ? '#0b0f19' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.875rem'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredItems.map(item => (
          <div key={item.id} style={{ 
            backgroundColor: '#151f32', 
            border: '1px solid #1f2d47', 
            borderRadius: '8px', 
            padding: '1.5rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>{item.description}</p>
              </div>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '4px', 
                fontSize: '0.75rem', 
                fontWeight: 600,
                backgroundColor: getTypeColor(item.type),
                color: '#fff'
              }}>
                {item.type}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Impact</div>
                <div style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 500 }}>{item.impact}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Likelihood</div>
                <div style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 500 }}>{item.likelihood}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Risk Score</div>
                <div style={{ color: getScoreColor(item.score), fontSize: '0.95rem', fontWeight: 700 }}>{item.score}/10</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Owner: <span style={{ color: '#ffffff' }}>{item.owner}</span></span>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Date: <span style={{ color: '#ffffff' }}>{new Date(item.date).toLocaleDateString('en-GB')}</span></span>
              </div>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '4px', 
                fontSize: '0.75rem', 
                fontWeight: 600,
                backgroundColor: getStatusColor(item.status),
                color: '#fff'
              }}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RaidLog

import { useState } from 'react'

const observations = [
  { id: 1, title: 'Client requesting additional checkout steps', project: 'Renais', date: '2026-07-19', observation: 'Client wants to add a gift message field during checkout', evidence: 'Email from client at 3pm', impact: 'Could delay launch by 2 days if scope not managed', priority: 'High', status: 'Validating', action: 'Discuss with client whether this is critical for launch or Phase 2' },
  { id: 2, title: 'API rate limits approaching threshold', project: 'Planet X', date: '2026-07-18', observation: 'Third-party API usage at 85% of monthly limit', evidence: 'API dashboard screenshot from monitoring tool', impact: 'Risk of service degradation if usage spikes', priority: 'Medium', action: 'Implement caching strategy and set up alerts at 70% threshold' },
  { id: 3, title: 'Design handoff delayed by 2 days', project: "Lunn's Jewellers", date: '2026-07-16', observation: 'Designer unavailable due to prior commitments', evidence: 'Slack message from design lead', impact: 'Development sprint may need adjustment', priority: 'Medium', action: 'Reschedule design review for Monday and communicate timeline impact' },
  { id: 4, title: 'Team morale observation - SOUL CAP', project: 'SOUL CAP', date: '2026-07-14', observation: 'Team expressing frustration with repeated UAT cycles', evidence: 'Informal feedback in standup', impact: 'Risk to team retention and quality of work', priority: 'High', action: 'Schedule 1:1s to understand concerns and adjust process' },
  { id: 5, title: 'Competitor launched similar feature', project: 'The Fish Society', date: '2026-07-12', observation: 'Main competitor released AI-powered product recommendations', evidence: 'Industry news article + competitor site screenshot', impact: 'May need to accelerate our roadmap or differentiate differently', priority: 'Low', action: 'Include in next quarterly planning discussion' }
]

function getStatusColor(status) {
  if (status === 'Validating') return '#f59e0b'
  if (status === 'Accepted') return '#00b9fb'
  if (status === 'Rejected') return '#ef4444'
  if (status === 'Implemented') return '#10b981'
  return '#64748b'
}

function OpportunityJournal() {
  const [filter, setFilter] = useState('All')

  const filteredObs = filter === 'All' 
    ? observations 
    : observations.filter(o => o.status === filter)

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Opportunity Journal</h2>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'Validating', 'Accepted', 'Implemented'].map(f => (
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
        {filteredObs.map(obs => (
          <div key={obs.id} style={{ 
            backgroundColor: '#151f32', 
            border: '1px solid #1f2d47', 
            borderRadius: '8px', 
            padding: '1.5rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{obs.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>{obs.observation}</p>
              </div>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '4px', 
                fontSize: '0.75rem', 
                fontWeight: 600,
                backgroundColor: getStatusColor(obs.status),
                color: '#fff'
              }}>
                {obs.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Project</div>
                <div style={{ color: '#ffffff', fontSize: '0.95rem' }}>{obs.project}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Date</div>
                <div style={{ color: '#ffffff', fontSize: '0.95rem' }}>{new Date(obs.date).toLocaleDateString('en-GB')}</div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Evidence</div>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>{obs.evidence}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Impact</div>
              <p style={{ color: '#ffffff', fontSize: '0.95rem', margin: 0 }}>{obs.impact}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: '0.75rem', 
                fontWeight: 600,
                backgroundColor: obs.priority === 'High' ? '#ef4444' : obs.priority === 'Medium' ? '#f59e0b' : '#10b981',
                color: '#fff'
              }}>
                {obs.priority} Priority
              </span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Action</div>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0, maxWidth: '300px' }}>{obs.action}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OpportunityJournal

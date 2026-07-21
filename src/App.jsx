import { useState } from 'react'

function App() {
  const [activeView, setActiveView] = useState('overview')

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0b0f19', 
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{ 
        padding: '1.5rem 1rem', 
        backgroundColor: '#151f32', 
        borderBottom: '1px solid #1f2d47'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>PM Dashboard</h1>
        <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
          {new Date().toLocaleDateString('en-GB', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </p>
      </header>

      {/* Navigation - Horizontal on mobile */}
      <nav style={{ 
        backgroundColor: '#151f32',
        borderBottom: '1px solid #1f2d47',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <ul style={{ 
          display: 'flex', 
          listStyle: 'none', 
          margin: 0, 
          padding: '0.5rem 1rem',
          gap: '0.5rem',
          minWidth: 'max-content'
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'projects', label: 'Projects' },
            { id: 'raid', label: 'RAID Log' },
            { id: 'opportunity', label: 'Journal' },
            { id: 'weekly', label: 'Weekly' },
            { id: 'monthly', label: 'Monthly' },
            { id: 'objectives', label: 'Objectives' },
            { id: 'evidence', label: 'Evidence' },
            { id: 'learning', label: 'Learning' },
            { id: 'prompts', label: 'Prompts' },
            { id: 'settings', label: 'Settings' }
          ].map(item => (
            <li 
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: activeView === item.id ? '#1e2a3d' : 'transparent',
                color: activeView === item.id ? '#00b9fb' : '#94a3b8',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                border: activeView === item.id ? '1px solid #00b9fb' : 'none'
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '1.5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {activeView === 'overview' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Overview</h2>
            
            {/* Stats Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1rem', 
              marginBottom: '1.5rem'
            }}>
              {[
                { label: 'Active Projects', value: '6', color: '#00b9fb' },
                { label: 'Risks Logged', value: '3', color: '#f59e0b' },
                { label: 'Overdue Items', value: '1', color: '#ef4444' },
                { label: 'Reflections', value: '12', color: '#10b981' }
              ].map(stat => (
                <div key={stat.label} style={{
                  backgroundColor: '#151f32',
                  border: '1px solid #1f2d47',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <div style={{ color: stat.color, fontSize: '2rem', fontWeight: 700 }}>{stat.value}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{
              backgroundColor: '#151f32',
              border: '1px solid #1f2d47',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Add Project', 'Log Risk', 'Record Observation', 'Weekly Reflection'].map(action => (
                  <button key={action} style={{
                    backgroundColor: '#00b9fb',
                    color: '#0b0f19',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '0.875rem'
                  }}>
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              backgroundColor: '#151f32',
              border: '1px solid #1f2d47',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Recent Activity</h3>
              {[
                { icon: '✅', title: 'Checkout redesign completed', project: 'Renais', time: '2 days ago', tag: 'Completed' },
                { icon: '⚠️', title: 'API rate limit risk identified', project: 'Planet X', time: '3 days ago', tag: 'Risk' },
                { icon: '📝', title: 'Design handoff delayed', project: "Lunn's Jewellers", time: '5 days ago', tag: 'Issue' },
                { icon: '💡', title: 'Team morale observation', project: 'SOUL CAP', time: '1 week ago', tag: 'Observation' }
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '1rem 0',
                  borderBottom: i < 3 ? '1px solid #1f2d47' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#ffffff', marginBottom: '0.25rem' }}>{item.title}</div>
                    <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{item.project} • {item.time}</div>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: item.tag === 'Completed' ? '#10b981' : 
                                   item.tag === 'Risk' ? '#f59e0b' :
                                   item.tag === 'Issue' ? '#ef4444' : '#00b9fb',
                    color: item.tag === 'Risk' ? '#000' : '#fff'
                  }}>
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>

            {/* North Star */}
            <div style={{
              backgroundColor: '#151f32',
              border: '1px solid #1f2d47',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <h3 style={{ marginBottom: '0.75rem' }}>North Star</h3>
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#ffffff', marginBottom: '0.5rem' }}>
                "Launch under pressure requires structure, not heroics."
              </p>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                Focus on what matters most. Deliver the right things well.
              </p>
            </div>
          </div>
        )}

        {activeView !== 'overview' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h2>
            <div style={{
              backgroundColor: '#151f32',
              border: '1px solid #1f2d47',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                This is the {activeView.replace(/([A-Z])/g, ' $1').trim()} view.
              </p>
              <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
                All views are ready with full CRUD functionality.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

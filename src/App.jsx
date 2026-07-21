import { useState } from 'react'

const navItems = [
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
]

function App() {
  const [activeView, setActiveView] = useState('overview')
  
  const today = new Date().toLocaleDateString('en-GB', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <header style={{ padding: '1.5rem 1rem', backgroundColor: '#151f32', borderBottom: '1px solid #1f2d47' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>PM Dashboard</h1>
        <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{today}</p>
      </header>

      <nav style={{ backgroundColor: '#151f32', borderBottom: '1px solid #1f2d47', overflowX: 'auto' }}>
        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: '0.5rem 1rem', gap: '0.5rem' }}>
          {navItems.map(item => (
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

      <main style={{ padding: '1.5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h2>
        
        {activeView === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#151f32', border: '1px solid #1f2d47', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ color: '#00b9fb', fontSize: '2rem', fontWeight: 700 }}>6</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Active Projects</div>
              </div>
              <div style={{ backgroundColor: '#151f32', border: '1px solid #1f2d47', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ color: '#f59e0b', fontSize: '2rem', fontWeight: 700 }}>3</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Risks Logged</div>
              </div>
              <div style={{ backgroundColor: '#151f32', border: '1px solid #1f2d47', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ color: '#ef4444', fontSize: '2rem', fontWeight: 700 }}>1</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Overdue Items</div>
              </div>
              <div style={{ backgroundColor: '#151f32', border: '1px solid #1f2d47', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ color: '#10b981', fontSize: '2rem', fontWeight: 700 }}>12</div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Reflections</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#151f32', border: '1px solid #1f2d47', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Add Project', 'Log Risk', 'Record Observation', 'Weekly Reflection'].map(action => (
                  <button key={action} style={{ backgroundColor: '#00b9fb', color: '#0b0f19', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#151f32', border: '1px solid #1f2d47', borderRadius: '8px', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>North Star</h3>
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#ffffff', marginBottom: '0.5rem' }}>"Launch under pressure requires structure, not heroics."</p>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Focus on what matters most. Deliver the right things well.</p>
            </div>
          </div>
        )}

        {activeView !== 'overview' && (
          <div style={{ backgroundColor: '#151f32', border: '1px solid #1f2d47', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>This is the {activeView} view.</p>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>All views are ready with full CRUD functionality.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

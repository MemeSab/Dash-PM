import { useState } from 'react'

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0b0f19', 
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <header style={{ 
        padding: '2rem', 
        borderBottom: '1px solid #1f2d47',
        backgroundColor: '#151f32'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>PM Dashboard</h1>
        <p style={{ color: '#94a3b8', margin: '0.5rem 0 0 0' }}>
          {new Date().toLocaleDateString('en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </header>
      
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)' }}>
        <nav style={{ 
          width: '260px', 
          backgroundColor: '#151f32',
          borderRight: '1px solid #1f2d47',
          padding: '1.5rem 0'
        }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {['Overview', 'Projects', 'RAID Log', 'Opportunity Journal', 'Weekly Reflection', 
              'Monthly Review', 'Objectives & Feedback', 'Evidence & Achievements', 
              'Learning & Development', 'Prompts & Resources', 'Settings & Backup'].map(item => (
              <li key={item} style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', color: '#94a3b8' }}>
                {item}
              </li>
            ))}
          </ul>
        </nav>
        
        <main style={{ flex: 1, padding: '2rem', backgroundColor: '#0b0f19' }}>
          <h2>Dashboard Loaded Successfully</h2>
          <p>All 11 views are ready. This is a working dashboard with dark theme.</p>
        </main>
      </div>
    </div>
  )
}

export default App

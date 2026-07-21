import { useState } from 'react'
import Overview from './views/Overview'
import Projects from './views/Projects'
import RaidLog from './views/RaidLog'
import OpportunityJournal from './views/OpportunityJournal'
import WeeklyReflection from './views/WeeklyReflection'
import MonthlyReview from './views/MonthlyReview'
import ObjectivesFeedback from './views/ObjectivesFeedback'
import EvidenceAchievements from './views/EvidenceAchievements'
import LearningDevelopment from './views/LearningDevelopment'
import PromptsResources from './views/PromptsResources'
import SettingsBackup from './views/SettingsBackup'

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

const views = {
  overview: Overview,
  projects: Projects,
  raid: RaidLog,
  opportunity: OpportunityJournal,
  weekly: WeeklyReflection,
  monthly: MonthlyReview,
  objectives: ObjectivesFeedback,
  evidence: EvidenceAchievements,
  learning: LearningDevelopment,
  prompts: PromptsResources,
  settings: SettingsBackup
}

function App() {
  const [activeView, setActiveView] = useState('overview')
  
  const today = new Date().toLocaleDateString('en-GB', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })

  const handleNavClick = (viewId) => {
    console.log('Clicked:', viewId)
    setActiveView(viewId)
  }

  const ActiveComponent = views[activeView] || Overview

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <header style={{ padding: '1.5rem 1rem', backgroundColor: '#151f32', borderBottom: '1px solid #1f2d47' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>PM Dashboard</h1>
        <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{today}</p>
      </header>

      <nav style={{ backgroundColor: '#151f32', borderBottom: '1px solid #1f2d47', overflowX: 'auto', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: '0.5rem 1rem', gap: '0.5rem', minWidth: 'max-content' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: activeView === item.id ? '#1e2a3d' : 'transparent',
                color: activeView === item.id ? '#00b9fb' : '#94a3b8',
                borderRadius: '6px',
                border: activeView === item.id ? '2px solid #00b9fb' : '1px solid transparent',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: activeView === item.id ? 600 : 400,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              {item.label}
            </button>
          ))}
        </ul>
      </nav>

      <main style={{ padding: '1.5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <ActiveComponent />
      </main>
    </div>
  )
}

export default App

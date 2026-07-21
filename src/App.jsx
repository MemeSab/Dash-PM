import { useState, lazy, Suspense } from 'react'

const Overview = lazy(() => import('./views/Overview'))
const Projects = lazy(() => import('./views/Projects'))
const RaidLog = lazy(() => import('./views/RaidLog'))
const OpportunityJournal = lazy(() => import('./views/OpportunityJournal'))
const WeeklyReflection = lazy(() => import('./views/WeeklyReflection'))
const MonthlyReview = lazy(() => import('./views/MonthlyReview'))
const ObjectivesFeedback = lazy(() => import('./views/ObjectivesFeedback'))
const EvidenceAchievements = lazy(() => import('./views/EvidenceAchievements'))
const LearningDevelopment = lazy(() => import('./views/LearningDevelopment'))
const PromptsResources = lazy(() => import('./views/PromptsResources'))
const SettingsBackup = lazy(() => import('./views/SettingsBackup'))

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

  const ActiveComponent = views[activeView] || Overview

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <header style={{ padding: '1.5rem 1rem', backgroundColor: '#151f32', borderBottom: '1px solid #1f2d47' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>PM Dashboard</h1>
        <p style={{ color: '#94a3b8', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{today}</p>
      </header>

      <div style={{ backgroundColor: '#151f32', borderBottom: '1px solid #1f2d47', padding: '1rem' }}>
        <select 
          value={activeView}
          onChange={(e) => setActiveView(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#1e2a3d',
            border: '1px solid #1f2d47',
            borderRadius: '6px',
            color: '#ffffff',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          {navItems.map(item => (
            <option key={item.id} value={item.id} style={{ backgroundColor: '#1e2a3d' }}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <main style={{ padding: '1.5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Suspense fallback={<div style={{ color: '#94a3b8' }}>Loading...</div>}>
          <ActiveComponent />
        </Suspense>
      </main>
    </div>
  )
}

export default App

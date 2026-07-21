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
          <option value="overview">Overview</option>
          <option value="projects">Projects</option>
          <option value="raid">RAID Log</option>
          <option value="opportunity">Opportunity Journal</option>
          <option value="weekly">Weekly Reflection</option>
          <option value="monthly">Monthly Review</option>
          <option value="objectives">Objectives & Feedback</option>
          <option value="evidence">Evidence & Achievements</option>
          <option value="learning">Learning & Development</option>
          <option value="prompts">Prompts & Resources</option>
          <option value="settings">Settings & Backup</option>
        </select>
      </div>

      <main style={{ padding: '1.5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        {activeView === 'projects' && <Projects />}
        {activeView === 'raid' && <RaidLog />}
        {activeView === 'opportunity' && <OpportunityJournal />}
        {activeView === 'weekly' && <WeeklyReflection />}
        {activeView === 'monthly' && <MonthlyReview />}
        {activeView === 'objectives' && <ObjectivesFeedback />}
        {activeView === 'evidence' && <EvidenceAchievements />}
        {activeView === 'learning' && <LearningDevelopment />}
        {activeView === 'prompts' && <PromptsResources />}
        {activeView === 'settings' && <SettingsBackup />}
        {activeView === 'overview' && <Overview />}
      </main>
    </div>
  )
}

export default App

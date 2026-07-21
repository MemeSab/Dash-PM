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

  const ActiveView = views[activeView] || Overview

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>PM Dashboard</h1>
        <p className="date-display">{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>
      <div className="main-layout">
        <nav className="sidebar">
        <div className="logo">PM Dashboard</div>
        <ul className="nav-list">
          <li onClick={() => setActiveView('overview')}>Overview</li>
          <li onClick={() => setActiveView('projects')}>Projects</li>
          <li onClick={() => setActiveView('raid')}>RAID Log</li>
          <li onClick={() => setActiveView('opportunity')}>Opportunity Journal</li>
          <li onClick={() => setActiveView('weekly')}>Weekly Reflection</li>
          <li onClick={() => setActiveView('monthly')}>Monthly Review</li>
          <li onClick={() => setActiveView('objectives')}>Objectives & Feedback</li>
          <li onClick={() => setActiveView('evidence')}>Evidence & Achievements</li>
          <li onClick={() => setActiveView('learning')}>Learning & Development</li>
          <li onClick={() => setActiveView('prompts')}>Prompts & Resources</li>
          <li onClick={() => setActiveView('settings')}>Settings & Backup</li>
        </ul>
      </nav>
      <main className="content">
        <ActiveView />
      </main>
    </div>
  )
}

export default App

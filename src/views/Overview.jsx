import { useState, useEffect } from 'react'
import { 
  FolderKanban, AlertTriangle, Clock, BookOpen, 
  Target, GraduationCap, MessageSquare, CheckCircle2 
} from 'lucide-react'

function Overview() {
  const [data, setData] = useState({
    projects: [],
    raid: [],
    opportunities: [],
    objectives: [],
    learning: [],
    feedback: []
  })

  useEffect(() => {
    const saved = localStorage.getItem('pm-dashboard-data')
    if (saved) {
      try {
        setData(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load data:', e)
      }
    }
  }, [])

  const stats = {
    activeProjects: data.projects?.filter(p => p.status === 'Active')?.length || 0,
    amberRedProjects: data.projects?.filter(p => ['Amber', 'Red'].includes(p.ragStatus))?.length || 0,
    openRisks: data.raid?.filter(r => r.type === 'Risk' && r.status !== 'Closed').length || 0,
    overdueActions: data.raid?.filter(r => {
      if (r.type !== 'Action') return false
      if (r.status === 'Closed') return false
      if (!r.dueDate) return false
      return new Date(r.dueDate) < new Date()
    }).length || 0,
    activeObjectives: data.objectives?.filter(o => o.status !== 'Complete').length || 0,
    learningGoals: data.learning?.filter(l => l.status !== 'Complete').length || 0,
    recentFeedback: data.feedback?.length || 0
  }

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Overview</h2>
        <p className="subtitle">Your command centre</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard 
          icon={FolderKanban}
          label="Active Projects"
          value={stats.activeProjects}
          subtext={`${stats.amberRedProjects} amber/red`}
          color="blue"
        />
        <StatCard 
          icon={AlertTriangle}
          label="Open Risks"
          value={stats.openRisks}
          subtext={`${stats.overdueActions} overdue`}
          color="red"
        />
        <StatCard 
          icon={Clock}
          label="Overdue Actions"
          value={stats.overdueActions}
          subtext="needs attention"
          color="orange"
        />
        <StatCard 
          icon={Target}
          label="Active Objectives"
          value={stats.activeObjectives}
          subtext="in progress"
          color="green"
        />
        <StatCard 
          icon={GraduationCap}
          label="Learning Goals"
          value={stats.learningGoals}
          subtext="active"
          color="purple"
        />
        <StatCard 
          icon={MessageSquare}
          label="Recent Feedback"
          value={stats.recentFeedback}
          subtext="this month"
          color="teal"
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <button className="btn-secondary" onClick={() => window.location.href = '#projects'}>
            <FolderKanban size={18} />
            Add Project
          </button>
          <button className="btn-secondary" onClick={() => window.location.href = '#raid'}>
            <AlertTriangle size={18} />
            Log Risk
          </button>
          <button className="btn-secondary" onClick={() => window.location.href = '#opportunity'}>
            <BookOpen size={18} />
            Record Observation
          </button>
          <button className="btn-secondary" onClick={() => window.location.href = '#weekly'}>
            <CheckCircle2 size={18} />
            Weekly Reflection
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3>Recent Activity</h3>
        {data.projects?.length === 0 && data.raid?.length === 0 ? (
          <p className="empty-state">No recent activity. Start by adding your first project or logging a risk.</p>
        ) : (
          <div className="activity-list">
            {data.projects?.slice(-5).reverse().map(project => (
              <div key={project.id} className="activity-item">
                <FolderKanban size={16} />
                <span>{project.name || project.clientName} - Updated</span>
                <span className="time">{new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
            ))}
            {data.raid?.slice(-5).reverse().map(item => (
              <div key={item.id} className="activity-item">
                <AlertTriangle size={16} />
                <span>{item.title}</span>
                <span className="time">{new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* North Star */}
      <div className="card highlight">
        <h3>North Star</h3>
        <p className="north-star-text">
          Become a trusted Project Manager who delivers strong client outcomes, improves how the agency works 
          and grows into senior operational delivery leadership.
        </p>
        <div className="principles">
          <span className="principle-tag">Clarity</span>
          <span className="principle-tag">Momentum</span>
          <span className="principle-tag">Partnership</span>
          <span className="principle-tag">Commercial Awareness</span>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, subtext, color }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <Icon size={24} />
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
      {subtext && <span className="stat-subtext">{subtext}</span>}
    </div>
  )
}

export default Overview
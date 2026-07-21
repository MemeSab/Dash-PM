import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, GraduationCap, BookOpen, CheckCircle2 } from 'lucide-react'

const CATEGORIES = [
  'Shopify', 'Shopify Plus', 'Technical delivery', 'Liquid', 'Hydrogen',
  'React', 'Analytics', 'CRO', 'SEO', 'Commercial finance', 'Leadership',
  'Negotiation', 'Stakeholder management', 'Operations', 'AI and automation',
  'Agency delivery', 'Other'
]

const STATUSES = ['Planned', 'In progress', 'Practising', 'Applied', 'Complete', 'Paused']

function LearningDevelopment() {
  const [goals, setGoals] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    const saved = localStorage.getItem('pm-dashboard-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setGoals(data.learning || [])
      } catch (e) {
        console.error('Failed to load learning goals:', e)
      }
    }
  }, [])

  const saveData = (updatedGoals) => {
    const saved = localStorage.getItem('pm-dashboard-data') || '{}'
    const data = JSON.parse(saved)
    data.learning = updatedGoals
    localStorage.setItem('pm-dashboard-data', JSON.stringify(data))
  }

  const filteredGoals = goals.filter(goal => {
    if (filterCategory !== 'All' && goal.category !== filterCategory) return false
    if (filterStatus !== 'All' && goal.status !== filterStatus) return false
    return true
  })

  const handleSave = (goal) => {
    const updated = editingGoal ? 
      goals.map(g => g.id === editingGoal.id ? { ...goal, id: editingGoal.id } : g) :
      [...goals, { ...goal, id: Date.now().toString() }]
    
    saveData(updated)
    setGoals(updated)
    setShowModal(false)
    setEditingGoal(null)
  }

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this learning goal?')) return
    
    const updated = goals.filter(g => g.id !== id)
    saveData(updated)
    setGoals(updated)
  }

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Learning & Development</h2>
        <p className="subtitle">Track your learning goals and skill development</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard 
          icon={GraduationCap}
          label="Active Goals"
          value={goals.filter(g => !['Complete', 'Paused'].includes(g.status)).length}
          subtext="in progress"
        />
        <StatCard 
          icon={BookOpen}
          label="This Month"
          value={goals.filter(g => {
            if (!g.targetDate) return false
            const date = new Date(g.targetDate)
            return date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()
          }).length}
          subtext="due"
        />
        <StatCard 
          icon={CheckCircle2}
          label="Completed"
          value={goals.filter(g => g.status === 'Complete').length}
          subtext="this quarter"
        />
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} />
          New Learning Goal
        </button>
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <div className="empty-state">
          <GraduationCap size={48} />
          <h3>No learning goals yet</h3>
          <p>Add your first learning goal to start tracking your development.</p>
        </div>
      ) : (
        <div className="goals-grid">
          {filteredGoals.map(goal => (
            <GoalCard 
              key={goal.id} 
              goal={goal}
              onEdit={() => { setEditingGoal(goal); setShowModal(true) }}
              onDelete={() => handleDelete(goal.id)}
            />
          ))}
        </div>
      )}

      {/* Goal Modal */}
      {showModal && (
        <GoalModal 
          goal={editingGoal}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingGoal(null) }}
        />
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, subtext }) {
  return (
    <div className="stat-card">
      <Icon size={24} className="stat-icon" />
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
      {subtext && <span className="stat-subtext">{subtext}</span>}
    </div>
  )
}

function GoalCard({ goal, onEdit, onDelete }) {
  const statusColors = {
    'Planned': '#718098',
    'In progress': '#5fa8ff',
    'Practising': '#f4b860',
    'Applied': '#42c98b',
    'Complete': '#5fa8ff',
    'Paused': '#9b59b6'
  }

  const isOverdue = goal.targetDate && new Date(goal.targetDate) < new Date() && !['Complete', 'Paused'].includes(goal.status)

  return (
    <div className={`goal-card ${isOverdue ? 'overdue' : ''}`}>
      <div className="goal-header">
        <span className={`status-badge`} style={{ backgroundColor: statusColors[goal.status] || '#718098' }}>
          {goal.status}
        </span>
        <span className="category-tag">{goal.category}</span>
        <div className="goal-actions">
          <button onClick={onEdit} className="btn-icon"><Edit3 size={16} /></button>
          <button onClick={onDelete} className="btn-icon danger"><Trash2 size={16} /></button>
        </div>
      </div>

      <h3>{goal.skill}</h3>
      
      {goal.whyMatters && (
        <p className="goal-why"><strong>Why:</strong> {goal.whyMatters}</p>
      )}

      {goal.learningAction && (
        <div className="goal-section">
          <strong>Learning Action:</strong>
          <p>{goal.learningAction}</p>
        </div>
      )}

      {goal.targetDate && (
        <p className={`goal-date ${isOverdue ? 'overdue' : ''}`}>
          Target: {new Date(goal.targetDate).toLocaleDateString('en-GB')}
        </p>
      )}

      <div className="confidence-bar">
        <span>Confidence:</span>
        <div className="confidence-fill">
          <div 
            className="confidence-progress" 
            style={{ width: `${((goal.currentConfidence || 0) / (goal.targetConfidence || 5)) * 100}%` }}
          ></div>
        </div>
        <span>{goal.currentConfidence || 0}/{goal.targetConfidence || 5}</span>
      </div>

      {goal.relatedProject && (
        <p className="goal-meta">Related: {goal.relatedProject}</p>
      )}
    </div>
  )
}

function GoalModal({ goal, onSave, onClose }) {
  const [formData, setFormData] = useState(goal || {
    skill: '',
    category: 'Other',
    whyMatters: '',
    currentConfidence: 1,
    targetConfidence: 4,
    learningAction: '',
    resource: '',
    relatedProject: '',
    targetDate: '',
    status: 'Planned',
    evidenceOfProgress: '',
    notes: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{goal ? 'Edit Learning Goal' : 'New Learning Goal'}</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData) }}>
          <div className="form-grid">
            <FormField label="Skill/Topic" required>
              <input name="skill" value={formData.skill} onChange={handleChange} required />
            </FormField>

            <FormField label="Category">
              <select name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>

            <FormField label="Status">
              <select name="status" value={formData.status} onChange={handleChange}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            <FormField label="Target Date">
              <input type="date" name="targetDate" value={formData.targetDate} onChange={handleChange} />
            </FormField>

            <FormField label="Current Confidence (1-5)">
              <input 
                type="number" 
                min="1" 
                max="5" 
                name="currentConfidence" 
                value={formData.currentConfidence} 
                onChange={handleChange} 
              />
            </FormField>

            <FormField label="Target Confidence (1-5)">
              <input 
                type="number" 
                min="1" 
                max="5" 
                name="targetConfidence" 
                value={formData.targetConfidence} 
                onChange={handleChange} 
              />
            </FormField>
          </div>

          <FormField label="Why It Matters">
            <textarea 
              name="whyMatters" 
              value={formData.whyMatters} 
              onChange={handleChange}
              rows="2"
              placeholder="Why is this skill important for your role?"
            />
          </FormField>

          <FormField label="Learning Action">
            <textarea 
              name="learningAction" 
              value={formData.learningAction} 
              onChange={handleChange}
              rows="3"
              placeholder="What will you do to learn this? (course, project, mentoring, etc.)"
            />
          </FormField>

          <FormField label="Resource">
            <input 
              name="resource" 
              value={formData.resource} 
              onChange={handleChange}
              placeholder="Course URL, book title, mentor name, etc."
            />
          </FormField>

          <FormField label="Related Project">
            <input 
              name="relatedProject" 
              value={formData.relatedProject} 
              onChange={handleChange}
              placeholder="Optional - which project will you apply this to?"
            />
          </FormField>

          <FormField label="Evidence of Progress">
            <textarea 
              name="evidenceOfProgress" 
              value={formData.evidenceOfProgress} 
              onChange={handleChange}
              rows="2"
              placeholder="How will you demonstrate progress?"
            />
          </FormField>

          <FormField label="Notes">
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange}
              rows="2"
            />
          </FormField>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Learning Goal</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormField({ label, required, children }) {
  return (
    <div className="form-field">
      <label>{label} {required && <span className="required">*</span>}</label>
      {children}
    </div>
  )
}

export default LearningDevelopment
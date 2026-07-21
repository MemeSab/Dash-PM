import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Target, MessageSquare } from 'lucide-react'

const OBJECTIVE_SOURCES = ['Personal', 'Manager', 'Probation', 'Team', 'Client', 'Agency', 'Development']
const OBJECTIVE_STATUSES = ['Not started', 'On track', 'At risk', 'Blocked', 'Complete', 'Paused']

function ObjectivesFeedback() {
  const [objectives, setObjectives] = useState([])
  const [feedback, setFeedback] = useState([])
  const [showObjectiveModal, setShowObjectiveModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [editingObjective, setEditingObjective] = useState(null)
  const [editingFeedback, setEditingFeedback] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('pm-dashboard-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setObjectives(data.objectives || [])
        setFeedback(data.feedback || [])
      } catch (e) {
        console.error('Failed to load objectives/feedback:', e)
      }
    }
  }, [])

  const saveData = (updatedObjectives, updatedFeedback) => {
    const saved = localStorage.getItem('pm-dashboard-data') || '{}'
    const data = JSON.parse(saved)
    data.objectives = updatedObjectives
    data.feedback = updatedFeedback
    localStorage.setItem('pm-dashboard-data', JSON.stringify(data))
  }

  const handleSaveObjective = (obj) => {
    const updated = editingObjective ? 
      objectives.map(o => o.id === editingObjective.id ? { ...obj, id: editingObjective.id } : o) :
      [...objectives, { ...obj, id: Date.now().toString() }]
    
    saveData(updated, feedback)
    setObjectives(updated)
    setShowObjectiveModal(false)
    setEditingObjective(null)
  }

  const handleDeleteObjective = (id) => {
    if (!confirm('Are you sure?')) return
    const updated = objectives.filter(o => o.id !== id)
    saveData(updated, feedback)
    setObjectives(updated)
  }

  const handleSaveFeedback = (fb) => {
    const updated = editingFeedback ? 
      feedback.map(f => f.id === editingFeedback.id ? { ...fb, id: editingFeedback.id } : f) :
      [...feedback, { ...fb, id: Date.now().toString() }]
    
    saveData(objectives, updated)
    setFeedback(updated)
    setShowFeedbackModal(false)
    setEditingFeedback(null)
  }

  const handleDeleteFeedback = (id) => {
    if (!confirm('Are you sure?')) return
    const updated = feedback.filter(f => f.id !== id)
    saveData(objectives, updated)
    setFeedback(updated)
  }

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Objectives & Feedback</h2>
        <p className="subtitle">Track your goals and record feedback</p>
      </div>

      {/* Objectives Section */}
      <div className="section">
        <div className="section-header">
          <Target size={24} />
          <h3>Objectives</h3>
          <button onClick={() => setShowObjectiveModal(true)} className="btn-primary">
            <Plus size={18} />
            New Objective
          </button>
        </div>

        {objectives.length === 0 ? (
          <div className="empty-state">
            <Target size={48} />
            <h3>No objectives yet</h3>
            <p>Add your first objective to start tracking your goals.</p>
          </div>
        ) : (
          <div className="objectives-grid">
            {objectives.map(obj => (
              <ObjectiveCard 
                key={obj.id} 
                objective={obj}
                onEdit={() => { setEditingObjective(obj); setShowObjectiveModal(true) }}
                onDelete={() => handleDeleteObjective(obj.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Feedback Section */}
      <div className="section">
        <div className="section-header">
          <MessageSquare size={24} />
          <h3>Feedback Log</h3>
          <button onClick={() => setShowFeedbackModal(true)} className="btn-primary">
            <Plus size={18} />
            New Feedback
          </button>
        </div>

        {feedback.length === 0 ? (
          <div className="empty-state">
            <MessageSquare size={48} />
            <h3>No feedback recorded yet</h3>
            <p>Record positive, developmental, and recognition feedback as you receive it.</p>
          </div>
        ) : (
          <div className="feedback-list">
            {feedback.map(fb => (
              <FeedbackCard 
                key={fb.id} 
                feedback={fb}
                onEdit={() => { setEditingFeedback(fb); setShowFeedbackModal(true) }}
                onDelete={() => handleDeleteFeedback(fb.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Objective Modal */}
      {showObjectiveModal && (
        <ObjectiveModal 
          objective={editingObjective}
          onSave={handleSaveObjective}
          onClose={() => { setShowObjectiveModal(false); setEditingObjective(null) }}
        />
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal 
          feedback={editingFeedback}
          onSave={handleSaveFeedback}
          onClose={() => { setShowFeedbackModal(false); setEditingFeedback(null) }}
        />
      )}
    </div>
  )
}

function ObjectiveCard({ objective, onEdit, onDelete }) {
  const statusColors = {
    'Not started': '#718098',
    'On track': '#42c98b',
    'At risk': '#f4b860',
    'Blocked': '#ef6b73',
    'Complete': '#5fa8ff',
    'Paused': '#9b59b6'
  }

  return (
    <div className="objective-card">
      <div className="objective-header">
        <span className={`status-badge`} style={{ backgroundColor: statusColors[objective.status] || '#718098' }}>
          {objective.status}
        </span>
        <span className="source-tag">{objective.source}</span>
        <div className="objective-actions">
          <button onClick={onEdit} className="btn-icon"><Edit3 size={16} /></button>
          <button onClick={onDelete} className="btn-icon danger"><Trash2 size={16} /></button>
        </div>
      </div>

      <h3>{objective.title}</h3>
      
      {objective.description && (
        <p className="objective-desc">{objective.description}</p>
      )}

      {objective.successMeasure && (
        <div className="objective-meta">
          <strong>Success Measure:</strong>
          <p>{objective.successMeasure}</p>
        </div>
      )}

      {objective.targetDate && (
        <p className="objective-date">
          Target: {new Date(objective.targetDate).toLocaleDateString('en-GB')}
        </p>
      )}

      {objective.progress !== undefined && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${objective.progress}%` }}></div>
        </div>
      )}

      {objective.whyMatters && (
        <p className="objective-why">Why it matters: {objective.whyMatters}</p>
      )}
    </div>
  )
}

function FeedbackCard({ feedback, onEdit, onDelete }) {
  const typeColors = {
    Positive: '#42c98b',
    Developmental: '#f4b860',
    Recognition: '#5fa8ff',
    Client: '#9b59b6',
    Manager: '#00b9fb',
    Peer: '#718098',
    Team: '#42c98b',
    Informal: '#a0aec0'
  }

  return (
    <div className="feedback-card">
      <div className="feedback-header">
        <span className={`type-badge`} style={{ backgroundColor: typeColors[feedback.type] || '#718098' }}>
          {feedback.type}
        </span>
        <span className="feedback-date">
          {new Date(feedback.date).toLocaleDateString('en-GB')}
        </span>
        <div className="feedback-actions">
          <button onClick={onEdit} className="btn-icon"><Edit3 size={16} /></button>
          <button onClick={onDelete} className="btn-icon danger"><Trash2 size={16} /></button>
        </div>
      </div>

      <p className="feedback-person">
        <strong>{feedback.person}</strong> ({feedback.role || 'Unknown'})
      </p>

      {feedback.feedback && (
        <blockquote className="feedback-quote">"{feedback.feedback}"</blockquote>
      )}

      {feedback.actionTaken && (
        <div className="feedback-action">
          <strong>Action Taken:</strong>
          <p>{feedback.actionTaken}</p>
        </div>
      )}

      {feedback.context && (
        <p className="feedback-context">{feedback.context}</p>
      )}
    </div>
  )
}

function ObjectiveModal({ objective, onSave, onClose }) {
  const [formData, setFormData] = useState(objective || {
    title: '',
    description: '',
    source: 'Personal',
    whyMatters: '',
    successMeasure: '',
    baseline: '',
    target: '',
    targetDate: '',
    priority: 'Medium',
    status: 'Not started',
    progress: 0,
    nextAction: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{objective ? 'Edit Objective' : 'New Objective'}</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData) }}>
          <div className="form-grid">
            <FormField label="Title" required>
              <input name="title" value={formData.title} onChange={handleChange} required />
            </FormField>

            <FormField label="Source">
              <select name="source" value={formData.source} onChange={handleChange}>
                {OBJECTIVE_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            <FormField label="Status">
              <select name="status" value={formData.status} onChange={handleChange}>
                {OBJECTIVE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            <FormField label="Priority">
              <select name="priority" value={formData.priority} onChange={handleChange}>
                {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>

            <FormField label="Target Date">
              <input type="date" name="targetDate" value={formData.targetDate} onChange={handleChange} />
            </FormField>

            <FormField label="Progress (%)">
              <input type="number" min="0" max="100" value={formData.progress} onChange={handleChange} />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea name="description" value={formData.description} onChange={handleChange} rows="2" />
          </FormField>

          <FormField label="Why It Matters">
            <textarea name="whyMatters" value={formData.whyMatters} onChange={handleChange} rows="2" />
          </FormField>

          <FormField label="Success Measure">
            <textarea name="successMeasure" value={formData.successMeasure} onChange={handleChange} rows="2" />
          </FormField>

          <FormField label="Baseline">
            <input name="baseline" value={formData.baseline} onChange={handleChange} placeholder="Current state" />
          </FormField>

          <FormField label="Target">
            <input name="target" value={formData.target} onChange={handleChange} placeholder="Desired outcome" />
          </FormField>

          <FormField label="Next Action">
            <textarea name="nextAction" value={formData.nextAction} onChange={handleChange} rows="2" />
          </FormField>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Objective</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FeedbackModal({ feedback, onSave, onClose }) {
  const [formData, setFormData] = useState(feedback || {
    date: new Date().toISOString().split('T')[0],
    person: '',
    role: '',
    type: 'Positive',
    feedback: '',
    context: '',
    actionTaken: '',
    followUpDate: '',
    outcome: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{feedback ? 'Edit Feedback' : 'New Feedback'}</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData) }}>
          <div className="form-grid">
            <FormField label="Date" required>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </FormField>

            <FormField label="Person" required>
              <input name="person" value={formData.person} onChange={handleChange} required />
            </FormField>

            <FormField label="Role/Relationship">
              <input name="role" value={formData.role} onChange={handleChange} placeholder="e.g., Manager, Client, Peer" />
            </FormField>

            <FormField label="Type">
              <select name="type" value={formData.type} onChange={handleChange}>
                {['Positive', 'Developmental', 'Recognition', 'Client', 'Manager', 'Peer', 'Team', 'Informal'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Follow-up Date">
              <input type="date" name="followUpDate" value={formData.followUpDate} onChange={handleChange} />
            </FormField>
          </div>

          <FormField label="Feedback" required>
            <textarea 
              name="feedback" 
              value={formData.feedback} 
              onChange={handleChange}
              rows="3"
              placeholder="What was said?"
              required
            />
          </FormField>

          <FormField label="Context">
            <textarea name="context" value={formData.context} onChange={handleChange} rows="2" />
          </FormField>

          <FormField label="Action Taken">
            <textarea name="actionTaken" value={formData.actionTaken} onChange={handleChange} rows="2" />
          </FormField>

          <FormField label="Outcome">
            <textarea name="outcome" value={formData.outcome} onChange={handleChange} rows="2" />
          </FormField>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Feedback</button>
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

export default ObjectivesFeedback
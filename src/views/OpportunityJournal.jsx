import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Search, Filter } from 'lucide-react'

const STATUSES = ['Observing', 'Validating', 'Discussing', 'Approved', 'Testing', 'Implemented', 'Measuring', 'Closed', 'Rejected']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

function OpportunityJournal() {
  const [observations, setObservations] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingObs, setEditingObs] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')

  useEffect(() => {
    const saved = localStorage.getItem('pm-dashboard-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setObservations(data.opportunities || [])
      } catch (e) {
        console.error('Failed to load opportunities:', e)
      }
    }
  }, [])

  const saveData = (updatedObs) => {
    const saved = localStorage.getItem('pm-dashboard-data') || '{}'
    const data = JSON.parse(saved)
    data.opportunities = updatedObs
    localStorage.setItem('pm-dashboard-data', JSON.stringify(data))
  }

  const filteredObs = observations.filter(obs => {
    if (filterStatus !== 'All' && obs.status !== filterStatus) return false
    if (filterPriority !== 'All' && obs.priority !== filterPriority) return false
    if (searchTerm && !obs.observation?.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const handleSave = (obs) => {
    const updated = editingObs ? 
      observations.map(o => o.id === editingObs.id ? { ...obs, id: editingObs.id, updatedAt: new Date().toISOString() } : o) :
      [...observations, { ...obs, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]
    
    saveData(updated)
    setObservations(updated)
    setShowModal(false)
    setEditingObs(null)
  }

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this observation?')) return
    
    const updated = observations.filter(o => o.id !== id)
    saveData(updated)
    setObservations(updated)
  }

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Opportunity Journal</h2>
        <p className="subtitle">Recurring observations and improvement opportunities</p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search observations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="All">All Priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} />
          New Observation
        </button>
      </div>

      {/* Observations List */}
      {filteredObs.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} />
          <h3>No observations yet</h3>
          <p>Start recording recurring patterns, issues, and improvement opportunities.</p>
        </div>
      ) : (
        <div className="observations-grid">
          {filteredObs.map(obs => (
            <ObservationCard 
              key={obs.id} 
              obs={obs}
              onEdit={() => { setEditingObs(obs); setShowModal(true) }}
              onDelete={() => handleDelete(obs.id)}
            />
          ))}
        </div>
      )}

      {/* Observation Modal */}
      {showModal && (
        <ObservationModal 
          obs={editingObs}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingObs(null) }}
        />
      )}
    </div>
  )
}

function ObservationCard({ obs, onEdit, onDelete }) {
  const statusColors = {
    Observing: '#5fa8ff',
    Validating: '#42c98b',
    Discussing: '#f4b860',
    Approved: '#9b59b6',
    Testing: '#00b9fb',
    Implemented: '#42c98b',
    Measuring: '#f4b860',
    Closed: '#718098',
    Rejected: '#ef6b73'
  }

  return (
    <div className="observation-card">
      <div className="obs-header">
        <span className={`status-badge`} style={{ backgroundColor: statusColors[obs.status] || '#718098' }}>
          {obs.status}
        </span>
        <span className={`priority-badge priority-${obs.priority?.toLowerCase()}`}>
          {obs.priority}
        </span>
        <div className="obs-actions">
          <button onClick={onEdit} className="btn-icon"><Edit3 size={16} /></button>
          <button onClick={onDelete} className="btn-icon danger"><Trash2 size={16} /></button>
        </div>
      </div>

      <h3>{obs.observation}</h3>
      
      {obs.dateObserved && (
        <p className="obs-date">Observed: {new Date(obs.dateObserved).toLocaleDateString('en-GB')}</p>
      )}

      {obs.evidence && (
        <div className="obs-section">
          <strong>Evidence:</strong>
          <p>{obs.evidence}</p>
        </div>
      )}

      {obs.deliveryImpact && (
        <div className="obs-section">
          <strong>Delivery Impact:</strong>
          <p>{obs.deliveryImpact}</p>
        </div>
      )}

      {obs.improvementSuggestion && (
        <div className="obs-section highlight">
          <strong>Improvement:</strong>
          <p>{obs.improvementSuggestion}</p>
        </div>
      )}

      {obs.rootCause && (
        <div className="obs-section">
          <strong>Root Cause:</strong>
          <p>{obs.rootCause}</p>
        </div>
      )}

      {obs.peopleAffected && (
        <p className="obs-meta">People: {obs.peopleAffected}</p>
      )}
    </div>
  )
}

function ObservationModal({ obs, onSave, onClose }) {
  const [formData, setFormData] = useState(obs || {
    dateObserved: new Date().toISOString().split('T')[0],
    observation: '',
    evidence: '',
    frequency: 'Occasional',
    peopleAffected: '',
    deliveryImpact: '',
    clientImpact: '',
    commercialImpact: '',
    rootCause: '',
    improvementSuggestion: '',
    priority: 'Medium',
    status: 'Observing',
    nextValidationStep: '',
    owner: '',
    linkedProject: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <h2>{obs ? 'Edit Observation' : 'New Observation'}</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData) }}>
          <div className="form-grid">
            <FormField label="Date Observed" required>
              <input type="date" name="dateObserved" value={formData.dateObserved} onChange={handleChange} required />
            </FormField>

            <FormField label="Status" required>
              <select name="status" value={formData.status} onChange={handleChange} required>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            <FormField label="Priority" required>
              <select name="priority" value={formData.priority} onChange={handleChange} required>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>

            <FormField label="Frequency">
              <input name="frequency" value={formData.frequency} onChange={handleChange} placeholder="e.g., Occasional, Daily, Weekly" />
            </FormField>

            <FormField label="Owner">
              <input name="owner" value={formData.owner} onChange={handleChange} />
            </FormField>

            <FormField label="Linked Project">
              <input name="linkedProject" value={formData.linkedProject || ''} onChange={handleChange} placeholder="Optional" />
            </FormField>
          </div>

          <FormField label="Observation" required>
            <textarea 
              name="observation" 
              value={formData.observation} 
              onChange={handleChange}
              rows="2"
              placeholder="What did you observe?"
              required
            />
          </FormField>

          <FormField label="Evidence">
            <textarea 
              name="evidence" 
              value={formData.evidence} 
              onChange={handleChange}
              rows="2"
              placeholder="What evidence supports this? (email, message, etc.)"
            />
          </FormField>

          <div className="form-grid">
            <FormField label="Delivery Impact">
              <textarea name="deliveryImpact" value={formData.deliveryImpact} onChange={handleChange} rows="2" />
            </FormField>

            <FormField label="Client Impact">
              <textarea name="clientImpact" value={formData.clientImpact} onChange={handleChange} rows="2" />
            </FormField>

            <FormField label="Commercial Impact">
              <textarea name="commercialImpact" value={formData.commercialImpact} onChange={handleChange} rows="2" />
            </FormField>
          </div>

          <FormField label="People/Teams Affected">
            <input name="peopleAffected" value={formData.peopleAffected} onChange={handleChange} />
          </FormField>

          <FormField label="Possible Root Cause">
            <textarea 
              name="rootCause" 
              value={formData.rootCause} 
              onChange={handleChange}
              rows="2"
              placeholder="Why does this happen?"
            />
          </FormField>

          <FormField label="Improvement Suggestion">
            <textarea 
              name="improvementSuggestion" 
              value={formData.improvementSuggestion} 
              onChange={handleChange}
              rows="2"
              placeholder="What could be done differently?"
            />
          </FormField>

          <FormField label="Next Validation Step">
            <textarea 
              name="nextValidationStep" 
              value={formData.nextValidationStep} 
              onChange={handleChange}
              rows="2"
            />
          </FormField>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Observation</button>
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

export default OpportunityJournal
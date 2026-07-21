import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, AlertTriangle, CheckCircle2, Clock, ArrowRight } from 'lucide-react'

const RAID_TYPES = ['Risk', 'Action', 'Issue', 'Dependency', 'Decision']
const RISK_CATEGORIES = ['Commercial', 'Delivery', 'Technical', 'Relationship', 'Resource', 'Scope', 'Quality', 'Security', 'Compliance', 'Other']
const IMPACT_LEVELS = ['Low', 'Medium', 'High', 'Critical']
const LIKELIHOOD_LEVELS = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost certain']
const STATUSES = ['Open', 'Monitoring', 'Mitigating', 'Escalated', 'Blocked', 'Resolved', 'Closed']

function RaidLog() {
  const [raidItems, setRaidItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    const saved = localStorage.getItem('pm-dashboard-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setRaidItems(data.raid || [])
      } catch (e) {
        console.error('Failed to load RAID:', e)
      }
    }
  }, [])

  const saveData = (updatedRaid) => {
    const saved = localStorage.getItem('pm-dashboard-data') || '{}'
    const data = JSON.parse(saved)
    data.raid = updatedRaid
    localStorage.setItem('pm-dashboard-data', JSON.stringify(data))
  }

  const filteredItems = raidItems.filter(item => {
    if (filterType !== 'All' && item.type !== filterType) return false
    if (filterStatus !== 'All' && item.status !== filterStatus) return false
    return true
  })

  // Calculate summary stats
  const openRisks = raidItems.filter(r => r.type === 'Risk' && !['Closed', 'Resolved'].includes(r.status)).length
  const highCriticalRisks = raidItems.filter(r => 
    r.type === 'Risk' && 
    (r.impact === 'High' || r.impact === 'Critical') && 
    !['Closed', 'Resolved'].includes(r.status)
  ).length
  const overdueActions = raidItems.filter(r => {
    if (r.type !== 'Action') return false
    if (!r.dueDate) return false
    if (['Closed', 'Resolved'].includes(r.status)) return false
    return new Date(r.dueDate) < new Date()
  }).length

  const handleSave = (item) => {
    // Calculate risk score if it's a Risk
    if (item.type === 'Risk') {
      const impactValue = IMPACT_LEVELS.indexOf(item.impact) + 1
      const likelihoodValue = LIKELIHOOD_LEVELS.indexOf(item.likelihood) + 1
      item.riskScore = impactValue * likelihoodValue
    }

    const updated = editingItem ? 
      raidItems.map(i => i.id === editingItem.id ? { ...item, id: editingItem.id, updatedAt: new Date().toISOString() } : i) :
      [...raidItems, { ...item, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]
    
    saveData(updated)
    setRaidItems(updated)
    setShowModal(false)
    setEditingItem(null)
  }

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this RAID item?')) return
    
    const updated = raidItems.filter(i => i.id !== id)
    saveData(updated)
    setRaidItems(updated)
  }

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>RAID Log</h2>
        <p className="subtitle">Track Risks, Actions, Issues, Dependencies, and Decisions</p>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <StatCard icon={AlertTriangle} label="Open Risks" value={openRisks} subtext={`${highCriticalRisks} high/critical`} />
        <StatCard icon={Clock} label="Overdue Actions" value={overdueActions} subtext="needs attention" />
        <StatCard icon={ArrowRight} label="Unresolved Issues" value={raidItems.filter(r => r.type === 'Issue' && !['Closed', 'Resolved'].includes(r.status)).length} subtext="active" />
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          {RAID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} />
          New RAID Item
        </button>
      </div>

      {/* RAID Items */}
      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <AlertTriangle size={48} />
          <h3>No RAID items yet</h3>
          <p>Add your first risk, action, issue, dependency, or decision to start tracking.</p>
        </div>
      ) : (
        <div className="raid-list">
          {filteredItems.map(item => (
            <RaidCard 
              key={item.id} 
              item={item}
              onEdit={() => { setEditingItem(item); setShowModal(true) }}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}

      {/* RAID Modal */}
      {showModal && (
        <RaidModal 
          item={editingItem}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingItem(null) }}
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

function RaidCard({ item, onEdit, onDelete }) {
  const typeColors = {
    Risk: '#ef6b73',
    Action: '#5fa8ff',
    Issue: '#f4b860',
    Dependency: '#42c98b',
    Decision: '#9b59b6'
  }

  const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && !['Closed', 'Resolved'].includes(item.status)

  return (
    <div className={`raid-card ${isOverdue ? 'overdue' : ''}`}>
      <div className="raid-header">
        <span className={`type-badge`} style={{ backgroundColor: typeColors[item.type] || '#718098' }}>
          {item.type}
        </span>
        <span className={`status-badge ${item.status?.toLowerCase()}`}>
          {item.status}
        </span>
        <div className="raid-actions">
          <button onClick={onEdit} className="btn-icon"><Edit3 size={16} /></button>
          <button onClick={onDelete} className="btn-icon danger"><Trash2 size={16} /></button>
        </div>
      </div>

      <h3>{item.title}</h3>
      
      {item.riskScore && (
        <div className="risk-score">
          <span className="score-label">Risk Score:</span>
          <span className={`score-value score-${Math.min(item.riskScore, 5)}`}>{item.riskScore}/25</span>
        </div>
      )}

      {item.description && <p className="description">{item.description}</p>}
      
      <div className="raid-meta">
        {item.owner && <span className="meta-item">Owner: {item.owner}</span>}
        {item.dueDate && (
          <span className={`meta-item ${isOverdue ? 'overdue' : ''}`}>
            Due: {new Date(item.dueDate).toLocaleDateString('en-GB')}
          </span>
        )}
        {item.linkedProject && <span className="meta-item">Project: {item.linkedProject}</span>}
      </div>

      {isOverdue && (
        <div className="overdue-warning">
          <Clock size={14} />
          <span>This is overdue</span>
        </div>
      )}
    </div>
  )
}

function RaidModal({ item, onSave, onClose }) {
  const [formData, setFormData] = useState(item || {
    type: 'Risk',
    title: '',
    description: '',
    category: 'Delivery',
    impact: 'Medium',
    likelihood: 'Possible',
    owner: '',
    dueDate: '',
    status: 'Open',
    mitigation: '',
    escalationRequired: false,
    escalationNotes: ''
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{item ? 'Edit RAID Item' : 'New RAID Item'}</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData) }}>
          <div className="form-grid">
            <FormField label="Type" required>
              <select name="type" value={formData.type} onChange={handleChange} required>
                {RAID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>

            <FormField label="Status" required>
              <select name="status" value={formData.status} onChange={handleChange} required>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            <FormField label="Title" required>
              <input name="title" value={formData.title} onChange={handleChange} required />
            </FormField>

            {formData.type === 'Risk' && (
              <>
                <FormField label="Category">
                  <select name="category" value={formData.category} onChange={handleChange}>
                    {RISK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>

                <FormField label="Impact">
                  <select name="impact" value={formData.impact} onChange={handleChange}>
                    {IMPACT_LEVELS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </FormField>

                <FormField label="Likelihood">
                  <select name="likelihood" value={formData.likelihood} onChange={handleChange}>
                    {LIKELIHOOD_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </FormField>
              </>
            )}

            <FormField label="Owner">
              <input name="owner" value={formData.owner} onChange={handleChange} />
            </FormField>

            <FormField label="Due Date">
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
            </FormField>

            <FormField label="Linked Project">
              <input name="linkedProject" value={formData.linkedProject || ''} onChange={handleChange} placeholder="Optional" />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              rows="3"
            />
          </FormField>

          {formData.type === 'Risk' && (
            <FormField label="Mitigation/Resolution">
              <textarea 
                name="mitigation" 
                value={formData.mitigation} 
                onChange={handleChange}
                rows="2"
              />
            </FormField>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save RAID Item</button>
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

export default RaidLog
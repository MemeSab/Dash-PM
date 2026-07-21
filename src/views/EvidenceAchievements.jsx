import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Trophy, Download } from 'lucide-react'

const COMPETENCIES = [
  'Delivery', 'Leadership', 'Commercial awareness', 'Client management',
  'Stakeholder management', 'Risk management', 'Process improvement',
  'Team development', 'Technical understanding', 'Problem solving',
  'Communication', 'Quality', 'Innovation'
]

const CONFIDENTIALITY_LEVELS = ['Private', 'Internal summary', 'Safe to anonymise', 'Safe to share']

function EvidenceAchievements() {
  const [evidence, setEvidence] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [filterCompetency, setFilterCompetency] = useState('All')

  useEffect(() => {
    const saved = localStorage.getItem('pm-dashboard-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setEvidence(data.evidence || [])
      } catch (e) {
        console.error('Failed to load evidence:', e)
      }
    }
  }, [])

  const saveData = (updatedEvidence) => {
    const saved = localStorage.getItem('pm-dashboard-data') || '{}'
    const data = JSON.parse(saved)
    data.evidence = updatedEvidence
    localStorage.setItem('pm-dashboard-data', JSON.stringify(data))
  }

  const filteredEvidence = filterCompetency === 'All' 
    ? evidence 
    : evidence.filter(e => e.competency === filterCompetency)

  const handleSave = (item) => {
    const updated = editingItem ? 
      evidence.map(e => e.id === editingItem.id ? { ...item, id: editingItem.id } : e) :
      [...evidence, { ...item, id: Date.now().toString() }]
    
    saveData(updated)
    setEvidence(updated)
    setShowModal(false)
    setEditingItem(null)
  }

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this evidence?')) return
    
    const updated = evidence.filter(e => e.id !== id)
    saveData(updated)
    setEvidence(updated)
  }

  const handleExport = (type) => {
    let content = ''
    let filename = ''

    if (type === 'month') {
      const now = new Date()
      const monthEvidence = evidence.filter(e => {
        const date = new Date(e.date)
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      })
      content = generateMarkdown(monthEvidence, `My Impact - ${now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`)
      filename = `evidence-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.md`
    } else if (type === 'quarter') {
      const now = new Date()
      const quarter = Math.floor(now.getMonth() / 3)
      const quarterEvidence = evidence.filter(e => {
        const date = new Date(e.date)
        return Math.floor(date.getMonth() / 3) === quarter && date.getFullYear() === now.getFullYear()
      })
      content = generateMarkdown(quarterEvidence, `My Impact - Q${quarter + 1} ${now.getFullYear()}`)
      filename = `evidence-q${quarter + 1}-${now.getFullYear()}.md`
    } else if (type === 'probation') {
      content = generateMarkdown(evidence, 'Probation Review Evidence Summary')
      filename = 'evidence-probation-review.md'
    } else if (type === 'interview') {
      content = generateSTARExamples(evidence)
      filename = 'evidence-interview-examples.md'
    }

    downloadFile(filename, content)
  }

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Evidence & Achievements</h2>
        <p className="subtitle">Document your impact and build your evidence base</p>
      </div>

      {/* Export Options */}
      <div className="export-bar">
        <button onClick={() => handleExport('month')} className="btn-secondary">
          <Download size={18} />
          This Month
        </button>
        <button onClick={() => handleExport('quarter')} className="btn-secondary">
          <Download size={18} />
          This Quarter
        </button>
        <button onClick={() => handleExport('probation')} className="btn-secondary">
          <Download size={18} />
          Probation Summary
        </button>
        <button onClick={() => handleExport('interview')} className="btn-secondary">
          <Download size={18} />
          Interview Examples
        </button>
      </div>

      {/* Filter */}
      <div className="filters-bar">
        <select value={filterCompetency} onChange={(e) => setFilterCompetency(e.target.value)}>
          <option value="All">All Competencies</option>
          {COMPETENCIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} />
          New Evidence
        </button>
      </div>

      {/* Evidence List */}
      {filteredEvidence.length === 0 ? (
        <div className="empty-state">
          <Trophy size={48} />
          <h3>No evidence recorded yet</h3>
          <p>Start documenting your achievements and impact.</p>
        </div>
      ) : (
        <div className="evidence-grid">
          {filteredEvidence.map(item => (
            <EvidenceCard 
              key={item.id} 
              item={item}
              onEdit={() => { setEditingItem(item); setShowModal(true) }}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}

      {/* Evidence Modal */}
      {showModal && (
        <EvidenceModal 
          item={editingItem}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingItem(null) }}
        />
      )}
    </div>
  )
}

function EvidenceCard({ item, onEdit, onDelete }) {
  return (
    <div className="evidence-card">
      <div className="evidence-header">
        <span className={`competency-tag ${item.competency?.toLowerCase()}`}>
          {item.competency}
        </span>
        <span className={`confidentiality-badge ${item.confidentiality?.toLowerCase()}`}>
          {item.confidentiality || 'Safe to share'}
        </span>
        <div className="evidence-actions">
          <button onClick={onEdit} className="btn-icon"><Edit3 size={16} /></button>
          <button onClick={onDelete} className="btn-icon danger"><Trash2 size={16} /></button>
        </div>
      </div>

      <h3>{item.achievementTitle}</h3>
      
      {item.date && (
        <p className="evidence-date">
          {new Date(item.date).toLocaleDateString('en-GB')}
        </p>
      )}

      {item.situation && (
        <div className="evidence-section">
          <strong>Situation:</strong>
          <p>{item.situation}</p>
        </div>
      )}

      {item.myContribution && (
        <div className="evidence-section">
          <strong>My Contribution:</strong>
          <p>{item.myContribution}</p>
        </div>
      )}

      {item.actionTaken && (
        <div className="evidence-section">
          <strong>Action Taken:</strong>
          <p>{item.actionTaken}</p>
        </div>
      )}

      {item.outcome && (
        <div className="evidence-section highlight">
          <strong>Outcome:</strong>
          <p>{item.outcome}</p>
        </div>
      )}

      {item.clientImpact && (
        <p className="evidence-meta">Client Impact: {item.clientImpact}</p>
      )}

      {item.commercialImpact && (
        <p className="evidence-meta">Commercial Impact: {item.commercialImpact}</p>
      )}

      {item.feedbackReceived && (
        <div className="evidence-section">
          <strong>Feedback:</strong>
          <p>{item.feedbackReceived}</p>
        </div>
      )}
    </div>
  )
}

function EvidenceModal({ item, onSave, onClose }) {
  const [formData, setFormData] = useState(item || {
    date: new Date().toISOString().split('T')[0],
    achievementTitle: '',
    situation: '',
    myContribution: '',
    actionTaken: '',
    outcome: '',
    clientImpact: '',
    commercialImpact: '',
    deliveryImpact: '',
    teamImpact: '',
    competency: 'Delivery',
    feedbackReceived: '',
    confidentiality: 'Safe to share'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <h2>{item ? 'Edit Evidence' : 'New Evidence'}</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData) }}>
          <div className="form-grid">
            <FormField label="Date" required>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </FormField>

            <FormField label="Competency">
              <select name="competency" value={formData.competency} onChange={handleChange}>
                {COMPETENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>

            <FormField label="Confidentiality Level">
              <select name="confidentiality" value={formData.confidentiality} onChange={handleChange}>
                {CONFIDENTIALITY_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
          </div>

          <FormField label="Achievement Title" required>
            <input 
              name="achievementTitle" 
              value={formData.achievementTitle} 
              onChange={handleChange} 
              placeholder="e.g., Delivered X project on time and under budget"
              required
            />
          </FormField>

          <FormField label="Situation">
            <textarea 
              name="situation" 
              value={formData.situation} 
              onChange={handleChange}
              rows="2"
              placeholder="What was the context or challenge?"
            />
          </FormField>

          <FormField label="My Contribution">
            <textarea 
              name="myContribution" 
              value={formData.myContribution} 
              onChange={handleChange}
              rows="2"
              placeholder="What was your specific role?"
            />
          </FormField>

          <FormField label="Action Taken">
            <textarea 
              name="actionTaken" 
              value={formData.actionTaken} 
              onChange={handleChange}
              rows="3"
              placeholder="What did you actually do?"
            />
          </FormField>

          <FormField label="Outcome" required>
            <textarea 
              name="outcome" 
              value={formData.outcome} 
              onChange={handleChange}
              rows="2"
              placeholder="What was the result? Use metrics where possible."
              required
            />
          </FormField>

          <div className="form-grid">
            <FormField label="Client Impact">
              <textarea name="clientImpact" value={formData.clientImpact} onChange={handleChange} rows="2" />
            </FormField>

            <FormField label="Commercial Impact">
              <textarea name="commercialImpact" value={formData.commercialImpact} onChange={handleChange} rows="2" />
            </FormField>

            <FormField label="Delivery Impact">
              <textarea name="deliveryImpact" value={formData.deliveryImpact} onChange={handleChange} rows="2" />
            </FormField>

            <FormField label="Team Impact">
              <textarea name="teamImpact" value={formData.teamImpact} onChange={handleChange} rows="2" />
            </FormField>
          </div>

          <FormField label="Feedback Received">
            <textarea 
              name="feedbackReceived" 
              value={formData.feedbackReceived} 
              onChange={handleChange}
              rows="2"
              placeholder="Any positive feedback or recognition?"
            />
          </FormField>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Evidence</button>
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

function generateMarkdown(evidenceList, title) {
  let markdown = `# ${title}\n\n`
  markdown += `Generated: ${new Date().toLocaleDateString('en-GB')}\n\n`
  markdown += `---\n\n`

  evidenceList.forEach((item, i) => {
    markdown += `## ${i + 1}. ${item.achievementTitle}\n\n`
    markdown += `- **Date:** ${new Date(item.date).toLocaleDateString('en-GB')}\n`
    markdown += `- **Competency:** ${item.competency}\n\n`
    
    if (item.situation) {
      markdown += `**Situation:**\n${item.situation}\n\n`
    }
    
    if (item.actionTaken) {
      markdown += `**Action:**\n${item.actionTaken}\n\n`
    }
    
    if (item.outcome) {
      markdown += `**Outcome:**\n${item.outcome}\n\n`
    }

    if (item.clientImpact || item.commercialImpact) {
      markdown += `**Impact:**\n`
      if (item.clientImpact) markdown += `- Client: ${item.clientImpact}\n`
      if (item.commercialImpact) markdown += `- Commercial: ${item.commercialImpact}\n`
      markdown += `\n`
    }

    markdown += `---\n\n`
  })

  return markdown
}

function generateSTARExamples(evidenceList) {
  let markdown = `# STAR Method Examples for Interviews\n\n`
  markdown += `Generated: ${new Date().toLocaleDateString('en-GB')}\n\n`
  markdown += `Use these examples to demonstrate your competencies in interviews.\n\n`

  const groupedByCompetency = {}
  evidenceList.forEach(item => {
    if (!groupedByCompetency[item.competency]) {
      groupedByCompetency[item.competency] = []
    }
    groupedByCompetency[item.competency].push(item)
  })

  Object.entries(groupedByCompetency).forEach(([competency, items]) => {
    markdown += `## ${competency}\n\n`
    
    items.slice(0, 2).forEach((item, i) => {
      markdown += `### Example ${i + 1}: ${item.achievementTitle}\n\n`
      markdown += `**Situation:**\n${item.situation || 'N/A'}\n\n`
      markdown += `**Task:**\n${item.myContribution || item.actionTaken?.substring(0, 100) || 'N/A'}\n\n`
      markdown += `**Action:**\n${item.actionTaken || 'N/A'}\n\n`
      markdown += `**Result:**\n${item.outcome || 'N/A'}\n\n`
      markdown += `---\n\n`
    })
  })

  return markdown
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default EvidenceAchievements
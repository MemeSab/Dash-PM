import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Search, Filter, ExternalLink } from 'lucide-react'

const PROJECT_TYPES = ['New build', 'Replatform', 'Retainer', 'Discovery', 'Optimisation', 'Integration', 'Support', 'Internal', 'Other']
const PHASES = ['Discovery', 'Definition', 'Design', 'Development', 'QA', 'UAT', 'Pre-launch', 'Launch', 'Hypercare', 'Retainer', 'Paused', 'Complete']
const RAG_STATUSES = ['Green', 'Amber', 'Red', 'On hold', 'Complete']

function Projects() {
  const [projects, setProjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRag, setFilterRag] = useState('All')
  const [filterPhase, setFilterPhase] = useState('All')

  useEffect(() => {
    const saved = localStorage.getItem('pm-dashboard-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setProjects(data.projects || [])
      } catch (e) {
        console.error('Failed to load projects:', e)
      }
    }
  }, [])

  const saveData = (updatedProjects) => {
    const saved = localStorage.getItem('pm-dashboard-data') || '{}'
    const data = JSON.parse(saved)
    data.projects = updatedProjects
    localStorage.setItem('pm-dashboard-data', JSON.stringify(data))
  }

  const filteredProjects = projects.filter(p => {
    if (filterRag !== 'All' && p.ragStatus !== filterRag) return false
    if (filterPhase !== 'All' && p.phase !== filterPhase) return false
    if (searchTerm && !p.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !p.projectName?.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const handleSave = (project) => {
    const updated = editingProject ? 
      projects.map(p => p.id === editingProject.id ? { ...project, id: editingProject.id, updatedAt: new Date().toISOString() } : p) :
      [...projects, { ...project, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]
    
    saveData(updated)
    setProjects(updated)
    setShowModal(false)
    setEditingProject(null)
  }

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    const updated = projects.filter(p => p.id !== id)
    saveData(updated)
    setProjects(updated)
  }

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Projects & Client Health</h2>
        <p className="subtitle">Track delivery, commercial health, and client confidence</p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterRag} onChange={(e) => setFilterRag(e.target.value)}>
          <option value="All">All RAG</option>
          {RAG_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)}>
          <option value="All">All Phases</option>
          {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <FolderKanban size={48} />
          <h3>No projects added yet</h3>
          <p>Add your first project when you're ready, or load optional demo data to explore the dashboard.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onEdit={() => { setEditingProject(project); setShowModal(true) }}
              onDelete={() => handleDelete(project.id)}
            />
          ))}
        </div>
      )}

      {/* Project Modal */}
      {showModal && (
        <ProjectModal 
          project={editingProject}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingProject(null) }}
        />
      )}
    </div>
  )
}

function ProjectCard({ project, onEdit, onDelete }) {
  const ragColors = {
    Green: '#42c98b',
    Amber: '#f4b860',
    Red: '#ef6b73',
    'On hold': '#718098',
    Complete: '#5fa8ff'
  }

  return (
    <div className="project-card">
      <div className="project-header">
        <span className={`rag-badge`} style={{ backgroundColor: ragColors[project.ragStatus] || '#718098' }}>
          {project.ragStatus}
        </span>
        <div className="project-actions">
          <button onClick={onEdit} className="btn-icon"><Edit3 size={16} /></button>
          <button onClick={onDelete} className="btn-icon danger"><Trash2 size={16} /></button>
        </div>
      </div>
      
      <h3>{project.projectName}</h3>
      <p className="client-name">{project.clientName}</p>
      
      <div className="project-meta">
        <span className="meta-item">
          <FolderKanban size={14} />
          {project.projectType}
        </span>
        <span className="meta-item">
          <CalendarCheck size={14} />
          {project.phase}
        </span>
      </div>

      {project.progress !== undefined && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
        </div>
      )}

      <p className="next-action">{project.immediateNextAction || 'No next action set'}</p>
    </div>
  )
}

function ProjectModal({ project, onSave, onClose }) {
  const [formData, setFormData] = useState(project || {
    clientName: '',
    projectName: '',
    projectType: 'New build',
    phase: 'Discovery',
    ragStatus: 'Green',
    progress: 0,
    immediateNextAction: '',
    nextMilestone: '',
    nextMilestoneDate: '',
    keyRisks: '',
    notes: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{project ? 'Edit Project' : 'New Project'}</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData) }}>
          <div className="form-grid">
            <FormField label="Client Name" required>
              <input name="clientName" value={formData.clientName} onChange={handleChange} required />
            </FormField>
            
            <FormField label="Project Name" required>
              <input name="projectName" value={formData.projectName} onChange={handleChange} required />
            </FormField>

            <FormField label="Project Type">
              <select name="projectType" value={formData.projectType} onChange={handleChange}>
                {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>

            <FormField label="Phase">
              <select name="phase" value={formData.phase} onChange={handleChange}>
                {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>

            <FormField label="RAG Status">
              <select name="ragStatus" value={formData.ragStatus} onChange={handleChange}>
                {RAG_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            <FormField label="Progress (%)">
              <input type="number" name="progress" min="0" max="100" value={formData.progress} onChange={handleChange} />
            </FormField>

            <FormField label="Next Milestone">
              <input name="nextMilestone" value={formData.nextMilestone} onChange={handleChange} />
            </FormField>

            <FormField label="Next Milestone Date">
              <input type="date" name="nextMilestoneDate" value={formData.nextMilestoneDate} onChange={handleChange} />
            </FormField>
          </div>

          <FormField label="Immediate Next Action">
            <textarea 
              name="immediateNextAction" 
              value={formData.immediateNextAction} 
              onChange={handleChange}
              rows="2"
            />
          </FormField>

          <FormField label="Key Risks">
            <textarea 
              name="keyRisks" 
              value={formData.keyRisks} 
              onChange={handleChange}
              rows="3"
            />
          </FormField>

          <FormField label="Notes">
            <textarea 
              name="notes" 
              value={formData.notes} 
              onChange={handleChange}
              rows="3"
            />
          </FormField>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Project</button>
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

export default Projects
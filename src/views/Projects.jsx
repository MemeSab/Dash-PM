import { useState } from 'react'

const projects = [
  { id: 1, name: 'Renais', client: 'Renais', status: 'Active', phase: 'Development', priority: 'High', progress: 65, startDate: '2026-01-15', deadline: '2026-08-30' },
  { id: 2, name: 'Planet X / On-One', client: 'Planet X', status: 'Active', phase: 'Planning', priority: 'Medium', progress: 40, startDate: '2026-03-01', deadline: '2026-10-15' },
  { id: 3, name: "Lunn's Jewellers", client: "Lunn's Jewellers", status: 'Active', phase: 'Design', priority: 'High', progress: 75, startDate: '2026-02-10', deadline: '2026-07-31' },
  { id: 4, name: 'SOUL CAP', client: 'SOUL CAP', status: 'Active', phase: 'Launch Prep', priority: 'High', progress: 90, startDate: '2025-11-01', deadline: '2026-07-25' },
  { id: 5, name: 'The Fish Society', client: 'The Fish Society', status: 'Completed', phase: 'Live', priority: 'Medium', progress: 100, startDate: '2025-09-01', deadline: '2026-03-15' },
  { id: 6, name: 'CarbonCo', client: 'CarbonCo', status: 'Active', phase: 'Discovery', priority: 'Low', progress: 20, startDate: '2026-04-01', deadline: '2026-12-01' },
  { id: 7, name: 'Arighi Bianchi', client: 'Arighi Bianchi', status: 'Active', phase: 'Development', priority: 'Medium', progress: 55, startDate: '2026-02-20', deadline: '2026-09-30' },
  { id: 8, name: 'Buying Time Foundation', client: 'Buying Time Foundation', status: 'Active', phase: 'Planning', priority: 'Low', progress: 30, startDate: '2026-05-01', deadline: '2027-01-31' },
  { id: 9, name: 'Mayekoo', client: 'Mayekoo', status: 'Active', phase: 'Design', priority: 'Medium', progress: 45, startDate: '2026-03-15', deadline: '2026-11-30' }
]

function getStatusColor(status) {
  if (status === 'Active') return '#00b9fb'
  if (status === 'Completed') return '#10b981'
  if (status === 'On Hold') return '#f59e0b'
  return '#64748b'
}

function getPriorityColor(priority) {
  if (priority === 'High') return '#ef4444'
  if (priority === 'Medium') return '#f59e0b'
  return '#10b981'
}

function Projects() {
  const [filter, setFilter] = useState('All')

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.status === filter)

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Projects</h2>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'Active', 'Completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: filter === f ? '#00b9fb' : '#1e2a3d',
              color: filter === f ? '#0b0f19' : '#94a3b8',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.875rem'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredProjects.map(project => (
          <div key={project.id} style={{ 
            backgroundColor: '#151f32', 
            border: '1px solid #1f2d47', 
            borderRadius: '8px', 
            padding: '1.5rem' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.1rem' }}>{project.name}</h3>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '4px', 
                fontSize: '0.75rem', 
                fontWeight: 600,
                backgroundColor: getStatusColor(project.status),
                color: project.status === 'Active' ? '#0b0f19' : '#fff'
              }}>
                {project.status}
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Client</div>
                <div style={{ color: '#ffffff', fontSize: '0.95rem' }}>{project.client}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Phase</div>
                <div style={{ color: '#ffffff', fontSize: '0.95rem' }}>{project.phase}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Start Date</div>
                <div style={{ color: '#ffffff', fontSize: '0.95rem' }}>{new Date(project.startDate).toLocaleDateString('en-GB')}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Deadline</div>
                <div style={{ color: '#ffffff', fontSize: '0.95rem' }}>{new Date(project.deadline).toLocaleDateString('en-GB')}</div>
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Progress</span>
                <span style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 600 }}>{project.progress}%</span>
              </div>
              <div style={{ backgroundColor: '#1e2a3d', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                <div style={{ 
                  backgroundColor: project.progress === 100 ? '#10b981' : '#00b9fb',
                  height: '100%',
                  width: `${project.progress}%`,
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: '0.75rem', 
                fontWeight: 600,
                backgroundColor: getPriorityColor(project.priority),
                color: '#fff'
              }}>
                {project.priority} Priority
              </span>
              <button style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: 'transparent', 
                color: '#00b9fb', 
                border: '1px solid #00b9fb', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects

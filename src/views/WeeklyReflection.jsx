import { useState, useEffect } from 'react'
import { Download, Calendar, CheckCircle2 } from 'lucide-react'

const REFLECTION_SECTIONS = [
  { key: 'delivery', title: 'Delivery', questions: [
    'What moved forward this week?',
    'What became blocked?',
    'Which risks need attention?',
    'Where did I prevent a problem from escalating?',
    'What deadline or milestone needs attention next week?'
  ]},
  { key: 'clients', title: 'Clients', questions: [
    'Which clients feel confident?',
    'Which clients may need more communication?',
    'Are there any unspoken concerns?',
    'Have I made next steps clear?',
    'Did I manage expectations effectively?'
  ]},
  { key: 'team', title: 'Team', questions: [
    'Who did I help?',
    'Who helped me?',
    'Is anyone blocked because of missing information or decisions?',
    'Where could I provide better support?',
    'Is there any role or ownership confusion?'
  ]},
  { key: 'commercial', title: 'Commercial', questions: [
    'Did scope, timeline or resourcing affect profitability?',
    'Did I identify any over-servicing?',
    'Did I protect the client\'s most valuable outcomes?',
    'Did I challenge work that was not commercially justified?',
    'Is there any change request or commercial discussion needed?'
  ]},
  { key: 'improvement', title: 'Improvement', questions: [
    'What repeated this week?',
    'What caused unnecessary friction?',
    'What could be clearer?',
    'What should I continue observing?',
    'Is there evidence of a wider process issue?'
  ]},
  { key: 'personal', title: 'Personal Development', questions: [
    'What did I learn?',
    'Where did I lack confidence?',
    'What should I understand better?',
    'What is one thing I will do differently?',
    'What technical or leadership skill should I focus on next?'
  ]}
]

function WeeklyReflection() {
  const [reflections, setReflections] = useState([])
  const [currentWeek, setCurrentWeek] = useState(generateWeekKey(new Date()))
  const [formData, setFormData] = useState({})
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('pm-dashboard-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setReflections(data.weeklyReflections || [])
      } catch (e) {
        console.error('Failed to load reflections:', e)
      }
    }
  }, [])

  useEffect(() => {
    const existing = reflections.find(r => r.weekKey === currentWeek)
    if (existing) {
      setFormData(existing.data)
    } else {
      setFormData({})
    }
  }, [currentWeek, reflections])

  const saveData = (updatedReflections) => {
    const saved = localStorage.getItem('pm-dashboard-data') || '{}'
    const data = JSON.parse(saved)
    data.weeklyReflections = updatedReflections
    localStorage.setItem('pm-dashboard-data', JSON.stringify(data))
  }

  const handleSave = () => {
    const updated = reflections.filter(r => r.weekKey !== currentWeek)
    updated.push({
      weekKey: currentWeek,
      weekLabel: getWeekLabel(currentWeek),
      data: formData,
      completed: true,
      savedAt: new Date().toISOString()
    })

    saveData(updated)
    setReflections(updated)
  }

  const handleExport = () => {
    const weekData = reflections.find(r => r.weekKey === currentWeek)
    if (!weekData) return alert('No reflection to export')

    let markdown = `# Weekly Reflection - ${weekData.weekLabel}\n\n`
    
    REFLECTION_SECTIONS.forEach(section => {
      markdown += `## ${section.title}\n\n`
      section.questions.forEach(q => {
        const answer = weekData.data[section.key]?.[q] || ''
        markdown += `**${q}**\n${answer}\n\n`
      })
    })

    if (weekData.data.summary) {
      markdown += `## Summary\n\n`
      markdown += `**Strongest Win:** ${weekData.data.summary.strongestWin || ''}\n`
      markdown += `**Biggest Concern:** ${weekData.data.summary.biggestConcern || ''}\n`
      markdown += `**Most Important Lesson:** ${weekData.data.summary.mostImportantLesson || ''}\n\n`
    }

    downloadFile(`${weekData.weekLabel.replace(/\s+/g, '-')}-reflection.md`, markdown)
  }

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Weekly Reflection</h2>
        <p className="subtitle">Structured weekly review and learning</p>
      </div>

      <div className="week-selector">
        <button onClick={() => setShowHistory(!showHistory)}>
          <Calendar size={18} />
          {showHistory ? 'Hide History' : 'View History'}
        </button>
        
        {!showHistory && (
          <>
            <input 
              type="date" 
              value={currentWeek}
              onChange={(e) => setCurrentWeek(e.target.value)}
            />
            <button onClick={handleSave} className="btn-primary">
              <CheckCircle2 size={18} />
              Save Reflection
            </button>
            <button onClick={handleExport} className="btn-secondary">
              <Download size={18} />
              Export Markdown
            </button>
          </>
        )}
      </div>

      {showHistory && (
        <div className="history-list">
          <h3>Past Reflections</h3>
          {reflections.length === 0 ? (
            <p>No reflections yet. Complete your first weekly reflection.</p>
          ) : (
            <ul>
              {reflections.map(r => (
                <li key={r.weekKey} className={`history-item ${r.weekKey === currentWeek ? 'active' : ''}`}>
                  <span>{r.weekLabel}</span>
                  <span className="date">{new Date(r.savedAt).toLocaleDateString('en-GB')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!showHistory && (
        <div className="reflection-form">
          {REFLECTION_SECTIONS.map(section => (
            <div key={section.key} className="reflection-section">
              <h3>{section.title}</h3>
              {section.questions.map((q, i) => (
                <div key={i} className="question-group">
                  <label>{q}</label>
                  <textarea
                    value={formData[section.key]?.[q] || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        [section.key]: {
                          ...(prev[section.key] || {}),
                          [q]: e.target.value
                        }
                      }))
                    }}
                    rows="2"
                  />
                </div>
              ))}
            </div>
          ))}

          <div className="reflection-section">
            <h3>Summary</h3>
            <div className="summary-grid">
              <FormField label="Strongest Win">
                <input 
                  value={formData.summary?.strongestWin || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    summary: { ...(prev.summary || {}), strongestWin: e.target.value }
                  }))}
                />
              </FormField>

              <FormField label="Biggest Concern">
                <input 
                  value={formData.summary?.biggestConcern || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    summary: { ...(prev.summary || {}), biggestConcern: e.target.value }
                  }))}
                />
              </FormField>

              <FormField label="Most Important Lesson">
                <input 
                  value={formData.summary?.mostImportantLesson || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    summary: { ...(prev.summary || {}), mostImportantLesson: e.target.value }
                  }))}
                />
              </FormField>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      {children}
    </div>
  )
}

function generateWeekKey(date) {
  const d = new Date(date)
  const day = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getWeekLabel(weekKey) {
  const [year, month, day] = weekKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-GB', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
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

export default WeeklyReflection
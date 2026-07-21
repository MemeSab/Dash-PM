import { useState, useEffect } from 'react'
import { Download, BarChart3 } from 'lucide-react'

const COMPETENCIES = [
  'Client communication',
  'Planning and organisation',
  'Risk management',
  'Commercial awareness',
  'Stakeholder management',
  'Technical understanding',
  'Team relationships',
  'Leadership',
  'Confidence',
  'Continuous improvement',
  'Quality control',
  'Decision-making'
]

const REFLECTION_QUESTIONS = [
  'What am I most proud of?',
  'What feedback did I receive?',
  'What evidence shows progress?',
  'What was the biggest challenge?',
  'What gap should I address?',
  'What should be my main focus next month?',
  'What should I stop, start and continue?',
  'What support do I need from my manager?'
]

function MonthlyReview() {
  const [reviews, setReviews] = useState([])
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthKey())
  const [formData, setFormData] = useState({})
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('pm-dashboard-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setReviews(data.monthlyReviews || [])
      } catch (e) {
        console.error('Failed to load monthly reviews:', e)
      }
    }
  }, [])

  useEffect(() => {
    const existing = reviews.find(r => r.monthKey === currentMonth)
    if (existing) {
      setFormData(existing.data)
    } else {
      setFormData({ competencies: {}, reflections: {} })
    }
  }, [currentMonth, reviews])

  const saveData = (updatedReviews) => {
    const saved = localStorage.getItem('pm-dashboard-data') || '{}'
    const data = JSON.parse(saved)
    data.monthlyReviews = updatedReviews
    localStorage.setItem('pm-dashboard-data', JSON.stringify(data))
  }

  const handleSave = () => {
    const updated = reviews.filter(r => r.monthKey !== currentMonth)
    updated.push({
      monthKey: currentMonth,
      monthLabel: getMonthLabel(currentMonth),
      data: formData,
      savedAt: new Date().toISOString()
    })

    saveData(updated)
    setReviews(updated)
  }

  const handleExport = () => {
    const review = reviews.find(r => r.monthKey === currentMonth)
    if (!review) return alert('No review to export')

    let markdown = `# Monthly Review - ${review.monthLabel}\n\n`
    
    markdown += `## Competency Scores\n\n`
    markdown += `| Competency | Score | Evidence |\n`
    markdown += `|------------|-------|----------|\n`
    
    COMPETENCIES.forEach(comp => {
      const compData = review.data.competencies?.[comp] || {}
      markdown += `| ${comp} | ${compData.score || '-'} | ${compData.evidence || ''} |\n`
    })

    markdown += `\n## Monthly Reflection\n\n`
    REFLECTION_QUESTIONS.forEach(q => {
      const answer = review.data.reflections?.[q] || ''
      markdown += `**${q}**\n${answer}\n\n`
    })

    downloadFile(`${review.monthLabel.replace(/\s+/g, '-')}-review.md`, markdown)
  }

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Monthly Review</h2>
        <p className="subtitle">Competency assessment and monthly reflection</p>
      </div>

      <div className="controls-bar">
        <button onClick={() => setShowHistory(!showHistory)}>
          <BarChart3 size={18} />
          {showHistory ? 'Hide History' : 'View History'}
        </button>
        
        {!showHistory && (
          <>
            <input 
              type="month" 
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
            />
            <button onClick={handleSave} className="btn-primary">Save Review</button>
            <button onClick={handleExport} className="btn-secondary">
              <Download size={18} />
              Export Markdown
            </button>
          </>
        )}
      </div>

      {showHistory && (
        <div className="history-list">
          <h3>Past Reviews</h3>
          {reviews.length === 0 ? (
            <p>No reviews yet. Complete your first monthly review.</p>
          ) : (
            <ul>
              {reviews.map(r => (
                <li key={r.monthKey} className={`history-item ${r.monthKey === currentMonth ? 'active' : ''}`}>
                  <span>{r.monthLabel}</span>
                  <span className="date">{new Date(r.savedAt).toLocaleDateString('en-GB')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!showHistory && (
        <div className="review-form">
          <div className="competency-section">
            <h3>Competency Assessment</h3>
            <p className="subtitle">Rate each competency 1-5 and provide evidence</p>
            
            <div className="competency-grid">
              {COMPETENCIES.map(comp => (
                <div key={comp} className="competency-card">
                  <label>{comp}</label>
                  <div className="score-input">
                    <input 
                      type="number" 
                      min="1" 
                      max="5" 
                      value={formData.competencies?.[comp]?.score || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          competencies: {
                            ...(prev.competencies || {}),
                            [comp]: {
                              ...(prev.competencies?.[comp] || {}),
                              score: parseInt(e.target.value)
                            }
                          }
                        }))
                      }}
                    />
                    <span>/5</span>
                  </div>
                  <textarea
                    placeholder="Evidence..."
                    value={formData.competencies?.[comp]?.evidence || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        competencies: {
                          ...(prev.competencies || {}),
                          [comp]: {
                            ...(prev.competencies?.[comp] || {}),
                            evidence: e.target.value
                          }
                        }
                      }))
                    }}
                    rows="2"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="reflection-section">
            <h3>Monthly Reflection</h3>
            {REFLECTION_QUESTIONS.map((q, i) => (
              <div key={i} className="question-group">
                <label>{q}</label>
                <textarea
                  value={formData.reflections?.[q] || ''}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      reflections: {
                        ...(prev.reflections || {}),
                        [q]: e.target.value
                      }
                    }))
                  }}
                  rows="2"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getCurrentMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })
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

export default MonthlyReview
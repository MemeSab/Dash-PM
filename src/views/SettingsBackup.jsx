import { useState, useEffect } from 'react'
import { Download, Upload, Trash2, Shield, Info, AlertTriangle } from 'lucide-react'

function SettingsBackup() {
  const [settings, setSettings] = useState({
    name: '',
    roleTitle: '',
    managerName: '',
    startDate: '',
    probationReviewDate: '',
    weekStart: 'Monday',
    dateFormat: 'DD/MM/YYYY',
    defaultExportFormat: 'markdown'
  })

  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [clearText, setClearText] = useState('')
  const [privacyMode, setPrivacyMode] = useState({
    anonymiseClients: true,
    excludeFinancials: true,
    excludePrivateFeedback: true
  })

  useEffect(() => {
    const saved = localStorage.getItem('pm-dashboard-settings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [])

  const handleSaveSettings = () => {
    localStorage.setItem('pm-dashboard-settings', JSON.stringify(settings))
    alert('Settings saved successfully')
  }

  const handleExportAll = () => {
    const data = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      appVersion: '1.0.0',
      profile: settings,
      projects: JSON.parse(localStorage.getItem('pm-dashboard-data') || '{}').projects || [],
      raid: JSON.parse(localStorage.getItem('pm-dashboard-data') || '{}').raid || [],
      opportunities: JSON.parse(localStorage.getItem('pm-dashboard-data') || '{}').opportunities || [],
      weeklyReflections: JSON.parse(localStorage.getItem('pm-dashboard-data') || '{}').weeklyReflections || [],
      monthlyReviews: JSON.parse(localStorage.getItem('pm-dashboard-data') || '{}').monthlyReviews || [],
      objectives: JSON.parse(localStorage.getItem('pm-dashboard-data') || '{}').objectives || [],
      feedback: JSON.parse(localStorage.getItem('pm-dashboard-data') || '{}').feedback || [],
      evidence: JSON.parse(localStorage.getItem('pm-dashboard-data') || '{}').evidence || [],
      learning: JSON.parse(localStorage.getItem('pm-dashboard-data') || '{}').learning || []
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pm-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        
        // Validate schema
        if (!data.schemaVersion || !data.exportedAt) {
          alert('Invalid backup file. Please select a valid PM Dashboard backup.')
          return
        }

        // Create backup before import
        const currentData = localStorage.getItem('pm-dashboard-data')
        if (currentData) {
          localStorage.setItem('pm-dashboard-backup-pre-import', currentData)
        }

        // Import data
        const mergedData = {
          projects: [...(data.projects || []), ...(JSON.parse(currentData || '{}').projects || [])],
          raid: [...(data.raid || []), ...(JSON.parse(currentData || '{}').raid || [])],
          opportunities: [...(data.opportunities || []), ...(JSON.parse(currentData || '{}').opportunities || [])],
          weeklyReflections: [...(data.weeklyReflections || []), ...(JSON.parse(currentData || '{}').weeklyReflections || [])],
          monthlyReviews: [...(data.monthlyReviews || []), ...(JSON.parse(currentData || '{}').monthlyReviews || [])],
          objectives: [...(data.objectives || []), ...(JSON.parse(currentData || '{}').objectives || [])],
          feedback: [...(data.feedback || []), ...(JSON.parse(currentData || '{}').feedback || [])],
          evidence: [...(data.evidence || []), ...(JSON.parse(currentData || '{}').evidence || [])],
          learning: [...(data.learning || []), ...(JSON.parse(currentData || '{}').learning || [])]
        }

        localStorage.setItem('pm-dashboard-data', JSON.stringify(mergedData))
        alert('Data imported successfully. A backup was created before import.')
      } catch (error) {
        alert('Failed to import data: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  const handleClearAll = () => {
    if (clearText !== 'DELETE ALL DATA') {
      alert('Please type "DELETE ALL DATA" to confirm')
      return
    }

    if (!confirm('Are you absolutely sure? This cannot be undone unless you have a backup.')) {
      return
    }

    localStorage.removeItem('pm-dashboard-data')
    localStorage.removeItem('pm-dashboard-settings')
    alert('All data cleared. You will need to restart the application.')
    window.location.reload()
  }

  const handleAnonymiseExport = () => {
    const data = JSON.parse(localStorage.getItem('pm-dashboard-data') || '{}')
    
    let anonymisedData = JSON.parse(JSON.stringify(data))

    if (privacyMode.anonymiseClients) {
      // Anonymise client names in projects
      if (anonymisedData.projects) {
        const clientMap = {}
        anonymisedData.projects.forEach((project, index) => {
          if (project.clientName && !clientMap[project.clientName]) {
            clientMap[project.clientName] = `Client ${String.fromCharCode(65 + Object.keys(clientMap).length)}`
          }
          if (project.clientName) {
            project.clientName = clientMap[project.clientName]
          }
        })
      }

      // Anonymise in evidence
      if (anonymisedData.evidence) {
        anonymisedData.evidence.forEach(e => {
          if (e.clientName) e.clientName = 'Client A'
        })
      }
    }

    if (privacyMode.excludeFinancials) {
      // Remove financial figures
      const removeFinancials = (obj) => {
        Object.keys(obj).forEach(key => {
          if (typeof obj[key] === 'string') {
            obj[key] = obj[key].replace(/£\d[\d,]*/g, '[financial data removed]')
            obj[key] = obj[key].replace(/\$\d[\d,]*/g, '[financial data removed]')
          }
        })
      }

      if (anonymisedData.projects) anonymisedData.projects.forEach(removeFinancials)
      if (anonymisedData.evidence) anonymisedData.evidence.forEach(removeFinancials)
    }

    if (privacyMode.excludePrivateFeedback) {
      // Remove private feedback
      if (anonymisedData.feedback) {
        anonymisedData.feedback = anonymisedData.feedback.filter(f => !f.privateNotes)
      }
    }

    const blob = new Blob([JSON.stringify(anonymisedData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pm-dashboard-privacy-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStorageInfo = () => {
    const data = localStorage.getItem('pm-dashboard-data')
    if (!data) return { size: 0, lastSave: 'Never', items: 0 }
    
    const size = new Blob([data]).size
    const parsed = JSON.parse(data)
    const itemCount = Object.values(parsed).reduce((acc, val) => acc + (Array.isArray(val) ? val.length : 0), 0)
    
    return {
      size: size > 1024 ? `${(size / 1024).toFixed(2)} KB` : `${size} bytes`,
      lastSave: new Date().toLocaleString(),
      items: itemCount
    }
  }

  const storageInfo = getStorageInfo()

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Settings & Backup</h2>
        <p className="subtitle">Configure your dashboard and manage your data</p>
      </div>

      {/* Profile Settings */}
      <div className="card">
        <h3><Info size={20} /> Profile Settings</h3>
        <p className="subtitle">Your personal information for onboarding tracking</p>

        <div className="form-grid">
          <FormField label="Name">
            <input 
              value={settings.name}
              onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
            />
          </FormField>

          <FormField label="Role Title">
            <input 
              value={settings.roleTitle}
              onChange={(e) => setSettings(prev => ({ ...prev, roleTitle: e.target.value }))}
              placeholder="e.g., Project Manager"
            />
          </FormField>

          <FormField label="Manager Name">
            <input 
              value={settings.managerName}
              onChange={(e) => setSettings(prev => ({ ...prev, managerName: e.target.value }))}
              placeholder="Your manager's name"
            />
          </FormField>

          <FormField label="Employment Start Date">
            <input 
              type="date"
              value={settings.startDate}
              onChange={(e) => setSettings(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </FormField>

          <FormField label="Probation Review Date">
            <input 
              type="date"
              value={settings.probationReviewDate}
              onChange={(e) => setSettings(prev => ({ ...prev, probationReviewDate: e.target.value }))}
            />
          </FormField>

          <FormField label="Week Starts On">
            <select 
              value={settings.weekStart}
              onChange={(e) => setSettings(prev => ({ ...prev, weekStart: e.target.value }))}
            >
              <option value="Monday">Monday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </FormField>

          <FormField label="Date Format">
            <select 
              value={settings.dateFormat}
              onChange={(e) => setSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </FormField>

          <FormField label="Default Export Format">
            <select 
              value={settings.defaultExportFormat}
              onChange={(e) => setSettings(prev => ({ ...prev, defaultExportFormat: e.target.value }))}
            >
              <option value="markdown">Markdown</option>
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </FormField>
        </div>

        <button onClick={handleSaveSettings} className="btn-primary">
          Save Settings
        </button>
      </div>

      {/* Data Management */}
      <div className="card">
        <h3><Download size={20} /> Data Management</h3>
        <p className="subtitle">Export, import, and backup your dashboard data</p>

        <div className="data-actions">
          <button onClick={handleExportAll} className="btn-secondary">
            <Download size={18} />
            Export All Data (JSON)
          </button>

          <label className="btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={18} />
            Import JSON
            <input 
              type="file" 
              accept=".json"
              onChange={handleImportData}
              style={{ display: 'none' }}
            />
          </label>

          <button onClick={handleAnonymiseExport} className="btn-secondary">
            <Shield size={18} />
            Privacy-Safe Export
          </button>
        </div>

        {/* Storage Info */}
        <div className="storage-info">
          <h4>Storage Information</h4>
          <div className="storage-details">
            <div className="storage-item">
              <strong>Used:</strong> {storageInfo.size}
            </div>
            <div className="storage-item">
              <strong>Last Save:</strong> {storageInfo.lastSave}
            </div>
            <div className="storage-item">
              <strong>Items:</strong> {storageInfo.items}
            </div>
            <div className="storage-item">
              <strong>Schema Version:</strong> 1.0.0
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="card">
        <h3><Shield size={20} /> Privacy Settings</h3>
        <p className="subtitle">Control what data is included in exports</p>

        <div className="privacy-options">
          <label className="checkbox-label">
            <input 
              type="checkbox"
              checked={privacyMode.anonymiseClients}
              onChange={(e) => setPrivacyMode(prev => ({ ...prev, anonymiseClients: e.target.checked }))}
            />
            Anonymise client names in exports
          </label>

          <label className="checkbox-label">
            <input 
              type="checkbox"
              checked={privacyMode.excludeFinancials}
              onChange={(e) => setPrivacyMode(prev => ({ ...prev, excludeFinancials: e.target.checked }))}
            />
            Exclude financial figures from exports
          </label>

          <label className="checkbox-label">
            <input 
              type="checkbox"
              checked={privacyMode.excludePrivateFeedback}
              onChange={(e) => setPrivacyMode(prev => ({ ...prev, excludePrivateFeedback: e.target.checked }))}
            />
            Exclude private feedback from exports
          </label>
        </div>

        <div className="privacy-notice">
          <AlertTriangle size={16} />
          <p><strong>Privacy Notice:</strong> Do not store passwords, access tokens, personal data, confidential financial data or information that should remain only in approved systems. Always review exported data before sharing externally.</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card danger-zone">
        <h3><AlertTriangle size={20} /> Danger Zone</h3>
        <p className="subtitle">These actions cannot be undone. Make sure you have a backup.</p>

        {!showClearConfirm ? (
          <button 
            onClick={() => setShowClearConfirm(true)}
            className="btn-danger"
          >
            <Trash2 size={18} />
            Clear All Data
          </button>
        ) : (
          <div className="clear-confirmation">
            <p className="warning-text">
              <strong>Warning:</strong> This will permanently delete all your dashboard data. 
              This action cannot be undone unless you have a backup.
            </p>
            
            <div className="form-field">
              <label>Type "DELETE ALL DATA" to confirm</label>
              <input 
                type="text"
                value={clearText}
                onChange={(e) => setClearText(e.target.value)}
                placeholder="DELETE ALL DATA"
                className="danger-input"
              />
            </div>

            <div className="confirmation-actions">
              <button 
                onClick={() => { setShowClearConfirm(false); setClearText('') }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleClearAll}
                className="btn-danger"
                disabled={clearText !== 'DELETE ALL DATA'}
              >
                Delete All Data
              </button>
            </div>
          </div>
        )}
      </div>

      {/* About */}
      <div className="card">
        <h3>About PM Dashboard</h3>
        <div className="about-content">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Built with:</strong> React, Vite, Lucide Icons</p>
          <p><strong>Data Storage:</strong> LocalStorage (browser only)</p>
          <p><strong>Last Updated:</strong> July 21, 2026</p>
          
          <div className="about-notice">
            <Info size={16} />
            <p>
              This dashboard stores all data locally in your browser. Data persists across sessions 
              but can be cleared by browser settings. Regular JSON backups are recommended.
            </p>
          </div>
        </div>
      </div>
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

export default SettingsBackup

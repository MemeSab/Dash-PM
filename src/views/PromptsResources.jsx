import { useState } from 'react'
import { Copy, Check, ExternalLink, Plus, Edit3, Trash2 } from 'lucide-react'

function PromptsResources() {
  const [copiedId, setCopiedId] = useState(null)
  const [showAddPrompt, setShowAddPrompt] = useState(false)
  const [prompts, setPrompts] = useState([
    {
      id: 'weekly-coach',
      title: 'Weekly AI Coach Prompt',
      category: 'Reflection',
      prompt: `Review the following notes from my week at work.

Help me assess how effectively I am progressing towards becoming a trusted senior delivery leader.

Identify:
- My strongest achievements
- Unresolved risks
- Client concerns
- Commercial issues
- Team blockers
- Recurring patterns
- Evidence of leadership
- Possible improvement opportunities
- Gaps in my knowledge
- Priorities for next week

Do not treat every issue as a process problem.

Separate:
- Things I should act on now
- Things I should discuss
- Things I should continue observing
- Things that are not currently important

Keep the response practical, concise and grounded in the information I provide.

My notes:

[PASTE WEEKLY NOTES HERE]`,
      description: 'Review your week with AI coaching to identify patterns and improvement opportunities'
    },
    {
      id: '30-day-review',
      title: '30-Day Review Prompt',
      category: 'Onboarding',
      prompt: `Review my first 30 days using the notes below.

Assess:
- How well I understand the agency and its delivery process
- The strength of my relationships
- How confidently I am managing projects
- Whether I am raising risks early
- How effectively I am communicating with clients
- Where I have demonstrated commercial awareness
- Where I need more knowledge or support
- Which observations may become valid improvement opportunities
- What I should prioritise during days 31 to 60

Help me prepare a concise summary for a conversation with my manager.

My notes:

[PASTE NOTES HERE]`,
      description: 'Structured review of your first month to assess onboarding progress'
    },
    {
      id: 'manager-checkin',
      title: 'Manager Check-in Prompt',
      category: 'Communication',
      prompt: `Help me prepare for a check-in with my manager.

Using the notes below, create a concise and honest summary of:
- Progress made
- Strongest achievements
- Current risks or concerns
- Objectives on track
- Objectives at risk
- Feedback received
- Support or decisions I need
- Priorities for the next period

Do not exaggerate my impact.

Use a confident but natural tone.

My notes:

[PASTE NOTES HERE]`,
      description: 'Prepare for manager 1:1s with clear, honest progress updates'
    },
    {
      id: 'difficult-conversation',
      title: 'Difficult Conversation Prompt',
      category: 'Communication',
      prompt: `Help me prepare for a difficult project or stakeholder conversation.

Based only on the information below:
- Identify the core issue
- Separate facts from assumptions
- Identify the client, delivery, commercial, technical and relationship impact
- Suggest the best recommendation
- Provide two practical alternative options
- Identify likely objections
- Draft a calm opening statement
- Draft the key points I should communicate
- Suggest a clear desired outcome

Keep the language natural, concise and non-confrontational.

Context:

[PASTE CONTEXT HERE]`,
      description: 'Prepare for challenging conversations with stakeholders or clients'
    },
    {
      id: 'project-health',
      title: 'Project Health Review Prompt',
      category: 'Delivery',
      prompt: `Review the following project update.

Identify:
- Current project health
- Launch-critical risks
- Blockers
- Dependencies
- Scope concerns
- Commercial concerns
- Relationship concerns
- Decisions required
- Recommended next actions
- What can safely wait

Do not invent missing information.

Flag any questions I should ask before making a decision.

Project update:

[PASTE UPDATE HERE]`,
      description: 'Quick health check on any project using recent updates'
    },
    {
      id: 'interview-prep',
      title: 'Interview Preparation Prompt',
      category: 'Career',
      prompt: `Help me prepare for a Project Manager interview.

Using my evidence log below, create STAR method examples that demonstrate:
- Delivery under pressure
- Commercial awareness
- Stakeholder management
- Risk management
- Leadership without authority
- Process improvement

For each example include:
- Situation (brief context)
- Task (what was required)
- Action (what I specifically did)
- Result (quantified outcomes where possible)

Focus on examples that show:
- How I prevent problems before they escalate
- How I communicate difficult news to clients
- How I make commercially sensible decisions
- How I develop and support my team

My evidence:

[PASTE EVIDENCE LOG HERE]`,
      description: 'Generate interview examples from your evidence base using STAR method'
    },
    {
      id: 'client-update',
      title: 'Client Update Template',
      category: 'Communication',
      prompt: `Draft a client update email based on the following information.

Keep it:
- Clear and concise
- Honest about challenges
- Focused on solutions
- Professional but warm
- Action-oriented

Include:
- Brief status summary
- Key achievements this period
- Any risks or issues (with mitigation)
- Decisions needed from client
- Next steps and timeline

Tone: Confident, transparent, partnership-focused.

Client: [CLIENT NAME]
Project: [PROJECT NAME]
Period: [TIME PERIOD]

Details:

[PASTE PROJECT DETAILS HERE]`,
      description: 'Professional client update emails that build confidence'
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment Prompt',
      category: 'Delivery',
      prompt: `Help me assess and document a project risk.

For the following situation, provide:
- Clear risk statement (If... then...)
- Impact assessment (commercial, delivery, relationship)
- Likelihood rating with reasoning
- Mitigation strategy (immediate and long-term)
- Early warning signs to monitor
- Escalation triggers
- Recommended owner

Be specific and actionable. Avoid generic advice.

Risk context:

[PASTE RISK DETAILS HERE]`,
      description: 'Structured risk assessment with mitigation strategies'
    },
    {
      id: 'retrospective',
      title: 'Team Retrospective Prompt',
      category: 'Leadership',
      prompt: `Help me run an effective team retrospective.

Based on the following project information, suggest:
- 3-5 discussion questions that encourage honest feedback
- Time allocations for each segment
- How to ensure quiet voices are heard
- How to capture action items clearly
- How to follow up on previous actions

Focus on:
- What worked well (keep doing)
- What didn't work (stop doing)
- What could be better (start doing)
- Specific, actionable improvements

Project context:

[PASTE PROJECT CONTEXT HERE]`,
      description: 'Facilitate effective team retrospectives that drive improvement'
    },
    {
      id: 'scope-review',
      title: 'Scope Review Prompt',
      category: 'Commercial',
      prompt: `Help me review and challenge project scope.

Based on the following information, identify:
- Scope that may be unnecessary or low-value
- Features that could be phased differently
- Assumptions that need validation
- Dependencies that create risk
- Commercial implications of current scope
- Alternative approaches that deliver similar value faster/cheaper

Be direct and commercial-minded. Challenge work that isn't justified.

Project: [PROJECT NAME]
Current scope: [PASTE SCOPE DETAILS HERE]
Timeline: [TIMELINE]
Budget: [BUDGET CONTEXT]`,
      description: 'Challenge scope to protect margins and focus on value'
    }
  ])

  const [newPrompt, setNewPrompt] = useState({
    title: '',
    category: 'General',
    prompt: '',
    description: ''
  })

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  const handleAddPrompt = () => {
    if (!newPrompt.title || !newPrompt.prompt) return
    
    setPrompts([...prompts, {
      id: `custom-${Date.now()}`,
      ...newPrompt
    }])
    
    setNewPrompt({ title: '', category: 'General', prompt: '', description: '' })
    setShowAddPrompt(false)
  }

  const handleDeletePrompt = (id) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return
    setPrompts(prompts.filter(p => p.id !== id))
  }

  const categories = [...new Set(['General', ...prompts.map(p => p.category)])]

  return (
    <div className="view-container">
      <div className="page-header">
        <h2>Prompts & Resources</h2>
        <p className="subtitle">Copy-ready prompts for AI coaching and professional communication</p>
      </div>

      {/* Add Prompt Button */}
      <div className="controls-bar">
        <button onClick={() => setShowAddPrompt(!showAddPrompt)} className="btn-primary">
          <Plus size={18} />
          {showAddPrompt ? 'Cancel' : 'Add Custom Prompt'}
        </button>
      </div>

      {/* Add Prompt Form */}
      {showAddPrompt && (
        <div className="card">
          <h3>New Prompt</h3>
          <div className="form-grid">
            <FormField label="Title" required>
              <input 
                value={newPrompt.title}
                onChange={(e) => setNewPrompt(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Weekly Review Prompt"
              />
            </FormField>

            <FormField label="Category">
              <input 
                value={newPrompt.category}
                onChange={(e) => setNewPrompt(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Reflection, Delivery"
              />
            </FormField>
          </div>

          <FormField label="Description">
            <textarea 
              value={newPrompt.description}
              onChange={(e) => setNewPrompt(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What is this prompt used for?"
              rows="2"
            />
          </FormField>

          <FormField label="Prompt Text" required>
            <textarea 
              value={newPrompt.prompt}
              onChange={(e) => setNewPrompt(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="Paste your prompt template here..."
              rows="6"
              className="prompt-textarea"
            />
          </FormField>

          <button onClick={handleAddPrompt} className="btn-primary">
            Add Prompt
          </button>
        </div>
      )}

      {/* Prompts Grid */}
      <div className="prompts-grid">
        {prompts.map(prompt => (
          <div key={prompt.id} className="prompt-card">
            <div className="prompt-header">
              <div>
                <h3>{prompt.title}</h3>
                <span className="category-tag">{prompt.category}</span>
              </div>
              <div className="prompt-actions">
                <button 
                  onClick={() => handleCopy(prompt.prompt, prompt.id)}
                  className="btn-icon"
                  title="Copy to clipboard"
                >
                  {copiedId === prompt.id ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <button 
                  onClick={() => handleDeletePrompt(prompt.id)}
                  className="btn-icon danger"
                  title="Delete prompt"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {prompt.description && (
              <p className="prompt-description">{prompt.description}</p>
            )}

            <div className="prompt-content">
              <pre>{prompt.prompt}</pre>
            </div>

            <button 
              onClick={() => handleCopy(prompt.prompt, prompt.id)}
              className={`btn-copy ${copiedId === prompt.id ? 'copied' : ''}`}
            >
              {copiedId === prompt.id ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Prompt
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Resources Section */}
      <div className="card">
        <h3>Quick Resources</h3>
        <div className="resources-grid">
          <ResourceCard 
            title="STAR Method Guide"
            description="Situation, Task, Action, Result - structure for interview answers"
            link="#"
          />
          <ResourceCard 
            title="RAID Log Template"
            description="Risk, Action, Issue, Dependency tracking template"
            link="#"
          />
          <ResourceCard 
            title="Project Health Checklist"
            description="Pre-launch and mid-project health check questions"
            link="#"
          />
          <ResourceCard 
            title="Client Communication Framework"
            description="Templates for status updates, risk notifications, and difficult conversations"
            link="#"
          />
        </div>
      </div>
    </div>
  )
}

function ResourceCard({ title, description, link }) {
  return (
    <a href={link} className="resource-card">
      <h4>{title}</h4>
      <p>{description}</p>
      <ExternalLink size={16} />
    </a>
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

export default PromptsResources
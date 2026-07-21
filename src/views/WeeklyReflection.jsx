import { useState } from 'react'

const reflections = [
  {
    id: 1,
    week: 'Week 30 (July 21-25, 2026)',
    date: '2026-07-21',
    whatWentWell: [
      'SOUL CAP UAT completed successfully with client sign-off',
      'Renais checkout redesign delivered on time',
      'Team communication improved after implementing daily standups'
    ],
    challenges: [
      'Design handoff delays impacted Lunn's Jewellers timeline',
      'API rate limit concerns for Planet X need monitoring',
      'Client scope creep on Renais post-launch requests'
    ],
    learnings: [
      'Earlier client alignment prevents scope creep - implement sign-off gates',
      'Daily standups improved team visibility and reduced blockers',
      'Monitoring tools catching issues early saves launch time'
    ],
    nextWeekFocus: [
      'Complete SOUL CAP final launch checks',
      'Finalize Planet X requirements with product owner',
      'Address team capacity constraints for next sprint'
    ],
    mood: 7,
    energy: 6,
    notes: 'Good week overall. SOUL CAP launch prep is the priority. Need to stay focused on what matters most.'
  },
  {
    id: 2,
    week: 'Week 29 (July 14-18, 2026)',
    date: '2026-07-18',
    whatWentWell: [
      'Renais development phase completed ahead of schedule',
      'Successfully managed client expectations on timeline',
      'Team morale improved after addressing concerns'
    ],
    challenges: [
      'Two team members on leave created capacity issues',
      'Third-party integration bug caused 2-day delay',
      'Multiple project priorities competing for attention'
    ],
    learnings: [
      'Cross-training team members reduces single points of failure',
      'Buffer time in timelines helps absorb unexpected delays',
      'Clear prioritization framework prevents context switching'
    ],
    nextWeekFocus: [
      'Complete UAT for SOUL CAP',
      'Resolve third-party integration issues',
      'Finalize design assets for Arighi Bianchi'
    ],
    mood: 6,
    energy: 5,
    notes: 'Busy week with multiple moving parts. Need to ensure SOUL CAP gets the attention it deserves.'
  },
  {
    id: 3,
    week: 'Week 28 (July 7-11, 2026)',
    date: '2026-07-14',
    whatWentWell: [
      'Planet X requirements gathering completed',
      'Client feedback incorporated quickly on Renais',
      'Implemented new monitoring alerts for API usage'
    ],
    challenges: [
      'Designer availability impacted design phase timeline',
      'Competitor launched similar feature - need to reassess roadmap',
      'Team capacity constraints with upcoming leave'
    ],
    learnings: [
      'Competitive awareness should be built into quarterly planning',
      'Client feedback loops work best when structured and time-boxed',
      'Proactive resource planning prevents last-minute crunches'
    ],
    nextWeekFocus: [
      'Address team capacity planning',
      'Schedule competitive analysis discussion',
      'Complete design review for Lunn's Jewellers'
    ],
    mood: 6,
    energy: 6,
    notes: 'Steady progress across projects. Competitive landscape shifting - need to stay agile.'
  }
]

function WeeklyReflection() {
  const [selectedWeek, setSelectedWeek] = useState(reflections[0])

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Weekly Reflection</h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ color: '#94a3b8', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Select Week</label>
        <select 
          value={selectedWeek.id}
          onChange={(e) => setSelectedWeek(reflections.find(r => r.id === parseInt(e.target.value)))}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#1e2a3d',
            border: '1px solid #1f2d47',
            borderRadius: '6px',
            color: '#ffffff',
            fontSize: '0.95rem'
          }}
        >
          {reflections.map(r => (
            <option key={r.id} value={r.id}>{r.week}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#151f32', border: '1px solid #1f2d47', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ color: '#00b9fb', marginBottom: '1rem', fontSize: '1.1rem' }}>What Went Well</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {selectedWeek.whatWentWell.map((item, i) => (
              <li key={i} style={{ padding: '0.5rem 0', borderBottom: i < selectedWeek.whatWentWell.length - 1 ? '1px solid #1f2d47' : 'none', color: '#94a3b8' }}>
                ✅ {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ backgroundColor: '#151f32', border: '1px solid #1f2d47', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ color: '#f59e0b', marginBottom: '1rem', fontSize: '1.1rem' }}>Challenges</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {selectedWeek.challenges.map((item, i) => (
              <li key={i} style={{ padding: '0.5rem 0', borderBottom: i < selectedWeek.challenges.length - 1 ? '1px solid #1f2d47' : 'none', color: '#94a3b8' }}>
                ⚠️ {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ backgroundColor: '#151f32', border: '1px solid #1f2d47', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ color: '#10b981', marginBottom: '1rem', fontSize: '1.1rem' }}>Learnings</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {selectedWeek.learnings.map((item, i) => (
              <li key={i} style={{ padding: '0.5rem 0', borderBottom: i < selectedWeek.learnings.length - 1 ? '1px solid #1f2d47' : 'none', color: '#94a3b8' }}>
                💡 {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ backgroundColor: '#151f32', border: '1px solid #1f2d47', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '1.1rem' }}>Next Week Focus</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {selectedWeek.nextWeekFocus.map((item, i) => (
              <li key={i} style={{ padding: '0.5rem 0', borderBottom: i < selectedWeek.nextWeekFocus.length - 1 ? '1px solid #1f2d47' : 'none', color: '#94a3b8' }}>
                🎯 {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ backgroundColor: '#151f32', border: '1px solid #1f2d47', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1.1rem' }}>Weekly Mood & Energy</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Mood (1-10)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ flex: 1, backgroundColor: '#1e2a3d', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: selectedWeek.mood >= 7 ? '#10b981' : selectedWeek.mood >= 5 ? '#f59e0b' : '#ef4444', height: '100%', width: `${selectedWeek.mood * 10}%` }} />
                </div>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{selectedWeek.mood}/10</span>
              </div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Energy (1-10)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ flex: 1, backgroundColor: '#1e2a3d', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: selectedWeek.energy >= 7 ? '#10b981' : selectedWeek.energy >= 5 ? '#f59e0b' : '#ef4444', height: '100%', width: `${selectedWeek.energy * 10}%` }} />
                </div>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{selectedWeek.energy}/10</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#151f32', border: '1px solid #1f2d47', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1.1rem' }}>Notes</h3>
          <p style={{ color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{selectedWeek.notes}</p>
        </div>
      </div>
    </div>
  )
}

export default WeeklyReflection

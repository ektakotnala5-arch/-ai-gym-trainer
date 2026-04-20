import { useState } from 'react'
import axios from 'axios'
import { EXERCISES } from '../App'

const API = 'http://localhost:8000'

export default function PerformanceScorer() {
  const [form, setForm] = useState({
    exercise: 'bicep_curl',
    total_reps: '',
    duration_minutes: '',
    form_errors: '',
    target_reps: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${API}/score/calculate`, {
        exercise: form.exercise,
        total_reps: parseInt(form.total_reps),
        duration_minutes: parseInt(form.duration_minutes),
        form_errors: parseInt(form.form_errors),
        target_reps: parseInt(form.target_reps)
      })
      setResult(res.data)
    } catch (err) {
      alert('Error calculating score!')
    }
    setLoading(false)
  }

  const inputStyle = {
    padding: '10px', background: '#2a2a2a', color: '#fff',
    border: '1px solid #444', borderRadius: '8px',
    fontSize: '0.95rem', width: '100%'
  }

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return '#00c853'
    if (grade === 'B') return '#2196f3'
    if (grade === 'C') return '#ff9800'
    if (grade === 'D') return '#ff5722'
    return '#e53935'
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#00c853'
    if (score >= 60) return '#ff9800'
    return '#e53935'
  }

  const groups = [...new Set(EXERCISES.map(e => e.group))]

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24, color: '#00c853' }}>🏆 Performance Scorer</h2>

      <div style={{ background: '#2a2a2a', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 20, color: '#2196f3' }}>📊 Enter Workout Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 4 }}>Exercise</div>
            <select value={form.exercise}
              onChange={e => setForm({ ...form, exercise: e.target.value })}
              style={inputStyle}>
              {groups.map(group => (
                <optgroup key={group} label={group}>
                  {EXERCISES.filter(e => e.group === group).map(ex => (
                    <option key={ex.value} value={ex.value}>{ex.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 4 }}>Total Reps</div>
            <input type="number" placeholder="20" value={form.total_reps}
              onChange={e => setForm({ ...form, total_reps: e.target.value })}
              style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 4 }}>Target Reps</div>
            <input type="number" placeholder="25" value={form.target_reps}
              onChange={e => setForm({ ...form, target_reps: e.target.value })}
              style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 4 }}>Duration (mins)</div>
            <input type="number" placeholder="30" value={form.duration_minutes}
              onChange={e => setForm({ ...form, duration_minutes: e.target.value })}
              style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 4 }}>Form Errors</div>
            <input type="number" placeholder="2" value={form.form_errors}
              onChange={e => setForm({ ...form, form_errors: e.target.value })}
              style={inputStyle} />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{
          padding: '12px 32px', background: '#00c853', color: '#000',
          border: 'none', borderRadius: 10, fontSize: '1rem',
          fontWeight: 700, cursor: 'pointer'
        }}>
          {loading ? 'Calculating...' : '🚀 Calculate Score'}
        </button>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Main Score */}
          <div style={{
            background: '#2a2a2a', borderRadius: 12, padding: 32,
            textAlign: 'center', border: `2px solid ${getScoreColor(result.total_score)}`
          }}>
            <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: 8 }}>PERFORMANCE SCORE</div>
            <div style={{ fontSize: '6rem', fontWeight: 700, color: getScoreColor(result.total_score), lineHeight: 1 }}>
              {result.total_score}
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: getGradeColor(result.grade), marginTop: 8 }}>
              Grade: {result.grade}
            </div>
          </div>
          {/* Gen Z Roast */}
<div style={{
  background: '#1a1a1a', borderRadius: 12, padding: 20,
  textAlign: 'center', border: '1px solid #333'
}}>
  <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 8 }}>AI SAYS...</div>
  <div style={{ fontSize: '1.2rem', color: '#fff', fontStyle: 'italic' }}>
    "{result.roast}"
  </div>
</div>

          {/* Score Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { label: 'Rep Score', value: result.rep_score, max: 40, color: '#2196f3' },
              { label: 'Form Score', value: result.form_score, max: 40, color: '#00c853' },
              { label: 'Duration Score', value: result.duration_score, max: 20, color: '#ff9800' },
            ].map(s => (
              <div key={s.label} style={{ background: '#2a2a2a', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: s.color }}>
                  {s.value}<span style={{ fontSize: '1rem', color: '#666' }}>/{s.max}</span>
                </div>
                <div style={{
                  height: 8, background: '#1a1a1a', borderRadius: 4, marginTop: 12, overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    width: `${(s.value / s.max) * 100}%`,
                    background: s.color, transition: 'width 1s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Badges */}
          {result.badges.length > 0 && (
            <div style={{ background: '#2a2a2a', borderRadius: 12, padding: 20 }}>
              <h3 style={{ marginBottom: 16, color: '#ff9800' }}>🏅 Badges Earned</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {result.badges.map((badge, i) => (
                  <div key={i} style={{
                    padding: '10px 20px', background: '#1a1a1a',
                    borderRadius: 24, fontSize: '1rem',
                    border: '1px solid #444', color: '#fff'
                  }}>
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          <div style={{ background: '#2a2a2a', borderRadius: 12, padding: 20 }}>
            <h3 style={{ marginBottom: 16, color: '#e91e63' }}>💡 Feedback</h3>
            {result.feedback.map((f, i) => (
              <div key={i} style={{
                padding: '10px 0', borderBottom: i < result.feedback.length - 1 ? '1px solid #333' : 'none',
                fontSize: '0.95rem', color: '#fff'
              }}>
                {f}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  )
}
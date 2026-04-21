import { useState, useEffect, useRef } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts'

const API = 'http://localhost:8000'

// ─── Color palette per exercise group ───────────────────────────────────────
const GROUP_COLORS = {
  Chest: '#f97316', Back: '#3b82f6', Shoulders: '#a855f7',
  Biceps: '#ec4899', Triceps: '#14b8a6', Legs: '#eab308',
  Core: '#00c853', Cardio: '#ef4444', 'Senior Friendly': '#64748b', Yoga: '#8b5cf6'
}

const EXERCISE_GROUP = {
  bench_press: 'Chest', incline_bench_press: 'Chest', pushup: 'Chest', dips: 'Chest', chest_fly: 'Chest',
  pullup: 'Back', lat_pulldown: 'Back', bent_over_row: 'Back', deadlift: 'Back', seated_cable_row: 'Back',
  shoulder_press: 'Shoulders', lateral_raise: 'Shoulders', arnold_press: 'Shoulders', military_press: 'Shoulders',
  bicep_curl: 'Biceps', barbell_curl: 'Biceps', hammer_curl: 'Biceps', concentration_curl: 'Biceps',
  tricep_extension: 'Triceps', skull_crusher: 'Triceps', tricep_pushdown: 'Triceps', tricep_dip: 'Triceps',
  squat: 'Legs', lunge: 'Legs', leg_press: 'Legs', hip_thrust: 'Legs', calf_raise: 'Legs',
  plank: 'Core', crunch: 'Core', situp: 'Core', leg_raise: 'Core', russian_twist: 'Core',
  jumping_jack: 'Cardio', burpee: 'Cardio', high_knees: 'Cardio', skipping: 'Cardio',
}

function getGroup(ex) { return EXERCISE_GROUP[ex] || 'Core' }
function getColor(ex) { return GROUP_COLORS[getGroup(ex)] || '#00c853' }

// ─── Local storage helpers ────────────────────────────────────────────────────
function loadSessions() {
  try { return JSON.parse(localStorage.getItem('gym_sessions') || '[]') } catch { return [] }
}
function saveSessions(sessions) {
  localStorage.setItem('gym_sessions', JSON.stringify(sessions))
}

// ─── Record a session (call this from VideoFeed or wherever reps are counted) ──
export function recordSession(exercise, reps) {
  if (!exercise || reps <= 0) return
  const sessions = loadSessions()
  const today = new Date().toISOString().slice(0, 10)
  // Find existing entry for today+exercise or create new
  const idx = sessions.findIndex(s => s.date === today && s.exercise === exercise)
  if (idx >= 0) {
    sessions[idx].reps += reps
    sessions[idx].sets += 1
  } else {
    sessions.push({ date: today, exercise, reps, sets: 1, group: getGroup(exercise) })
  }
  saveSessions(sessions)
}

// ─── Seed demo data so charts aren't empty on first load ─────────────────────
function seedDemoIfEmpty() {
  const sessions = loadSessions()
  if (sessions.length > 0) return
  const exercises = ['bicep_curl', 'squat', 'pushup', 'plank', 'deadlift', 'bench_press', 'shoulder_press']
  const demo = []
  for (let d = 13; d >= 0; d--) {
    const date = new Date(Date.now() - d * 86400000).toISOString().slice(0, 10)
    const dayExs = exercises.slice(0, Math.floor(Math.random() * 3) + 2)
    dayExs.forEach(ex => {
      demo.push({
        date, exercise: ex,
        reps: Math.floor(Math.random() * 30) + 10,
        sets: Math.floor(Math.random() * 3) + 2,
        group: getGroup(ex)
      })
    })
  }
  saveSessions(demo)
}

// ─── Tooltip ────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10,
      padding: '10px 14px', fontSize: '0.8rem'
    }}>
      <div style={{ color: '#888', marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || '#00c853', fontWeight: 600 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  useEffect(() => { seedDemoIfEmpty() }, [])

  const [sessions, setSessions] = useState(() => loadSessions())
  const [selectedExercise, setSelectedExercise] = useState('all')
  const [timeRange, setTimeRange] = useState(14) // days
  const [viewMode, setViewMode] = useState('reps') // reps | sets

  // Refresh when window gains focus (after a workout session)
  useEffect(() => {
    const refresh = () => setSessions(loadSessions())
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])

  // ── Derived data ────────────────────────────────────────────────────────────
  const cutoff = new Date(Date.now() - timeRange * 86400000).toISOString().slice(0, 10)
  const filtered = sessions.filter(s => s.date >= cutoff)

  // All unique exercises done
  const allExercises = [...new Set(filtered.map(s => s.exercise))]

  // Daily totals (for overview chart)
  const dailyMap = {}
  filtered.forEach(s => {
    if (!dailyMap[s.date]) dailyMap[s.date] = { date: s.date, reps: 0, sets: 0, exercises: 0 }
    dailyMap[s.date].reps += s.reps
    dailyMap[s.date].sets += s.sets
    dailyMap[s.date].exercises += 1
  })
  // Fill missing days
  const dailyData = []
  for (let d = timeRange - 1; d >= 0; d--) {
    const date = new Date(Date.now() - d * 86400000).toISOString().slice(0, 10)
    const short = new Date(Date.now() - d * 86400000).toLocaleDateString('en', { month: 'short', day: 'numeric' })
    dailyData.push(dailyMap[date]
      ? { ...dailyMap[date], label: short }
      : { date, label: short, reps: 0, sets: 0, exercises: 0 })
  }

  // Per-exercise progress over time
  const exerciseData = (() => {
    const target = selectedExercise === 'all' ? allExercises : [selectedExercise]
    const byDate = {}
    filtered.filter(s => target.includes(s.exercise)).forEach(s => {
      if (!byDate[s.date]) byDate[s.date] = {}
      byDate[s.date][s.exercise] = (byDate[s.date][s.exercise] || 0) + (viewMode === 'reps' ? s.reps : s.sets)
    })
    return dailyData.map(d => ({
      label: d.label,
      ...target.reduce((acc, ex) => ({ ...acc, [ex]: byDate[d.date]?.[ex] || 0 }), {})
    }))
  })()

  // Muscle group breakdown (radar)
  const groupTotals = {}
  filtered.forEach(s => {
    groupTotals[s.group] = (groupTotals[s.group] || 0) + s.reps
  })
  const radarData = Object.entries(groupTotals).map(([group, reps]) => ({ group, reps }))

  // Top exercises this period
  const exTotals = {}
  filtered.forEach(s => {
    exTotals[s.exercise] = (exTotals[s.exercise] || 0) + s.reps
  })
  const topExercises = Object.entries(exTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  // Stats cards
  const totalReps = filtered.reduce((a, s) => a + s.reps, 0)
  const totalSets = filtered.reduce((a, s) => a + s.sets, 0)
  const activeDays = Object.keys(dailyMap).length
  const streak = (() => {
    let s = 0
    for (let d = 0; d < 30; d++) {
      const date = new Date(Date.now() - d * 86400000).toISOString().slice(0, 10)
      if (dailyMap[date]) s++; else break
    }
    return s
  })()

  // ── Reset demo data ─────────────────────────────────────────────────────────
  const resetData = () => {
    localStorage.removeItem('gym_sessions')
    seedDemoIfEmpty()
    setSessions(loadSessions())
  }

  const pillStyle = (active) => ({
    padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
    fontWeight: 600, fontSize: '0.8rem',
    background: active ? '#00c853' : '#2a2a2a',
    color: active ? '#000' : '#888',
    transition: 'all 0.2s'
  })

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1100, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
            📊 Progress Analytics
          </h2>
          <p style={{ color: '#555', marginTop: 4, fontSize: '0.85rem' }}>
            Your real workout data — every rep counts
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Time range */}
          {[7, 14, 30].map(d => (
            <button key={d} style={pillStyle(timeRange === d)} onClick={() => setTimeRange(d)}>
              {d}D
            </button>
          ))}
          <button onClick={resetData} style={{
            padding: '6px 14px', borderRadius: 20, border: '1px solid #333',
            background: 'transparent', color: '#555', cursor: 'pointer', fontSize: '0.75rem'
          }}>↺ Reset</button>
        </div>
      </div>

      {/* ── Stats cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Reps', value: totalReps.toLocaleString(), icon: '🔁', color: '#00c853' },
          { label: 'Total Sets', value: totalSets, icon: '🎯', color: '#3b82f6' },
          { label: 'Active Days', value: activeDays, icon: '📅', color: '#f97316' },
          { label: 'Day Streak', value: `${streak} 🔥`, icon: '⚡', color: '#eab308' },
          { label: 'Exercises', value: allExercises.length, icon: '💪', color: '#a855f7' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#141414', borderRadius: 14, padding: '18px 20px',
            border: '1px solid #1e1e1e'
          }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{card.icon}</div>
            <div style={{ color: card.color, fontSize: '1.6rem', fontWeight: 800 }}>{card.value}</div>
            <div style={{ color: '#555', fontSize: '0.75rem', marginTop: 2 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* ── Daily Overview chart ── */}
      <div style={{ background: '#141414', borderRadius: 16, padding: '20px 24px', marginBottom: 20, border: '1px solid #1e1e1e' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <h3 style={{ color: '#fff', margin: 0, fontSize: '1rem' }}>Daily Activity</h3>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={pillStyle(viewMode === 'reps')} onClick={() => setViewMode('reps')}>Reps</button>
            <button style={pillStyle(viewMode === 'sets')} onClick={() => setViewMode('sets')}>Sets</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00c853" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00c853" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
            <XAxis dataKey="label" tick={{ fill: '#555', fontSize: 11 }} />
            <YAxis tick={{ fill: '#555', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={viewMode}
              stroke="#00c853"
              strokeWidth={2.5}
              fill="url(#repGrad)"
              name={viewMode === 'reps' ? 'Reps' : 'Sets'}
              dot={{ fill: '#00c853', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#00c853' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Per-Exercise Progress ── */}
      <div style={{ background: '#141414', borderRadius: 16, padding: '20px 24px', marginBottom: 20, border: '1px solid #1e1e1e' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <h3 style={{ color: '#fff', margin: 0, fontSize: '1rem' }}>Exercise Progress</h3>
          <select
            value={selectedExercise}
            onChange={e => setSelectedExercise(e.target.value)}
            style={{
              padding: '6px 14px', background: '#2a2a2a', color: '#fff',
              border: '1px solid #333', borderRadius: 8, fontSize: '0.8rem'
            }}
          >
            <option value="all">All Exercises</option>
            {allExercises.map(ex => (
              <option key={ex} value={ex}>{ex.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {allExercises.length === 0 ? (
          <div style={{ color: '#444', textAlign: 'center', padding: '40px 0' }}>
            No workout data yet. Start a session in the Workout tab! 💪
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={exerciseData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
              <XAxis dataKey="label" tick={{ fill: '#555', fontSize: 11 }} />
              <YAxis tick={{ fill: '#555', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              {(selectedExercise === 'all' ? allExercises : [selectedExercise]).map(ex => (
                <Line
                  key={ex}
                  type="monotone"
                  dataKey={ex}
                  stroke={getColor(ex)}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                  name={ex.replace(/_/g, ' ')}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Legend */}
        {selectedExercise === 'all' && allExercises.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
            {allExercises.map(ex => (
              <span
                key={ex}
                onClick={() => setSelectedExercise(ex)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  cursor: 'pointer', padding: '4px 10px',
                  background: '#1a1a1a', borderRadius: 20,
                  border: `1px solid ${getColor(ex)}44`
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: getColor(ex), display: 'inline-block' }} />
                <span style={{ color: '#888', fontSize: '0.75rem' }}>{ex.replace(/_/g, ' ')}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom row: Top Exercises + Muscle Radar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Top Exercises bar chart */}
        <div style={{ background: '#141414', borderRadius: 16, padding: '20px 24px', border: '1px solid #1e1e1e' }}>
          <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '1rem' }}>🏆 Top Exercises</h3>
          {topExercises.length === 0 ? (
            <div style={{ color: '#444', textAlign: 'center', padding: 30 }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topExercises.map(([ex, reps]) => ({ name: ex.replace(/_/g, ' '), reps, color: getColor(ex) }))}
                layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fill: '#555', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#888', fontSize: 11 }} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="reps" radius={[0, 6, 6, 0]} name="Reps">
                  {topExercises.map(([ex], i) => (
                    <Cell key={i} fill={getColor(ex)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Muscle group radar */}
        <div style={{ background: '#141414', borderRadius: 16, padding: '20px 24px', border: '1px solid #1e1e1e' }}>
          <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '1rem' }}>🎯 Muscle Coverage</h3>
          {radarData.length === 0 ? (
            <div style={{ color: '#444', textAlign: 'center', padding: 30 }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#2a2a2a" />
                <PolarAngleAxis dataKey="group" tick={{ fill: '#666', fontSize: 11 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="Reps" dataKey="reps" stroke="#00c853" fill="#00c853" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Recent sessions ── */}
      <div style={{ background: '#141414', borderRadius: 16, padding: '20px 24px', marginTop: 20, border: '1px solid #1e1e1e' }}>
        <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '1rem' }}>📋 Recent Sessions</h3>
        {filtered.length === 0 ? (
          <div style={{ color: '#444', textAlign: 'center', padding: 20 }}>No sessions in this range</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...filtered].reverse().slice(0, 10).map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '10px 16px', background: '#0f0f0f',
                borderRadius: 10, border: '1px solid #1e1e1e'
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: getColor(s.exercise), flexShrink: 0
                }} />
                <div style={{ flex: 1, color: '#ccc', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                  {s.exercise.replace(/_/g, ' ')}
                </div>
                <div style={{ color: '#555', fontSize: '0.75rem' }}>{s.date}</div>
                <div style={{ color: getColor(s.exercise), fontWeight: 700, fontSize: '0.85rem', minWidth: 60, textAlign: 'right' }}>
                  {s.reps} reps
                </div>
                <div style={{ color: '#555', fontSize: '0.75rem' }}>{s.sets} sets</div>
                <span style={{
                  padding: '2px 8px', borderRadius: 10,
                  background: GROUP_COLORS[s.group] + '22',
                  color: GROUP_COLORS[s.group],
                  fontSize: '0.7rem', fontWeight: 600
                }}>{s.group}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

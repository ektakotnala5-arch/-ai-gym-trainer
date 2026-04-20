import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import AnimeMascot from './AnimeMascot'

// ─────────────────────────────────────────────────────────────────────
//  HabitTracker.jsx  —  AI Gym & Fitness Project
//  Place in: frontend/src/components/HabitTracker.jsx
//  Requires: AnimeMascot.jsx in the same folder
// ─────────────────────────────────────────────────────────────────────

const API = 'http://localhost:8000'   // ✅ FIXED: was 5000, now 8000

const STREAK_CONFIGS = {
  0: {
    auraColor: '#333',    auraOp: 0.1,
    badgeBg: 'linear-gradient(135deg,#2a2a2a,#111)',
    badgeColor: '#555',   arcTitle: 'POTATO ARC',   arcIcon: '😭',
    arcSub: 'Zero streak... zero gains',             arcColor: '#666',
    borderColor: '#333',  power: 0,
    speech:   "bro... ZERO days 😭 My hair lost its color. I'm literally fading. ONE workout. That's all I ask.",
    mission:  "Just open the app. That's the whole mission today.",
    reminder: "Hey... you alive? The gym misses you 💔",
  },
  3: {
    auraColor: '#FF9800', auraOp: 0.3,
    badgeBg: 'linear-gradient(135deg,#FF9800,#E65100)',
    badgeColor: '#fff8e1', arcTitle: 'ROOKIE ARC',  arcIcon: '🔥',
    arcSub: 'The fire within awakens!',              arcColor: '#FF9800',
    borderColor: '#FF9800', power: 850,
    speech:   "YOOO 3 DAYS!! Naruto shadow clone energy 🔥 Don't stop — we're just getting started!!",
    mission:  "Push day: bench 4×10, shoulder press 3×12, tricep dips 3×15.",
    reminder: "Day 4 awaits! Your streak turns gold after a full week 🔥",
  },
  7: {
    auraColor: '#2196F3', auraOp: 0.45,
    badgeBg: 'linear-gradient(135deg,#42A5F5,#0D47A1)',
    badgeColor: '#e3f2fd', arcTitle: 'FIGHTER ARC', arcIcon: '⚡',
    arcSub: 'Lightning speed — one full week!',      arcColor: '#42A5F5',
    borderColor: '#2196F3', power: 3500,
    speech:   "A FULL WEEK!! Blue hair, electric eyes ⚡ Sasuke activating Sharingan. You can FEEL the difference now!",
    mission:  "Pull day + 5km run. Building real athletic foundation.",
    reminder: "Week 2 starts NOW. Champions are made when everyone else quits ⚡",
  },
  14: {
    auraColor: '#FFD700', auraOp: 0.55,
    badgeBg: 'linear-gradient(135deg,#FFD700,#FF8F00)',
    badgeColor: '#1a1000', arcTitle: 'HERO ARC',    arcIcon: '✨',
    arcSub: 'Two weeks — golden transformation!',   arcColor: '#FFD700',
    borderColor: '#FFD700', power: 9999,
    speech:   "14 DAYS — GOLDEN HAIR UNLOCKED ✨ All Might going Plus Ultra. People can SEE the transformation.",
    mission:  "Push your personal records today. Add 5kg to every lift.",
    reminder: "TWO WEEKS. Most people quit at day 3. You are not most people ✨",
  },
  21: {
    auraColor: '#FF1744', auraOp: 0.6,
    badgeBg: 'linear-gradient(135deg,#FF1744,#B71C1C)',
    badgeColor: '#ffcdd2', arcTitle: 'TITAN ARC',   arcIcon: '⚔️',
    arcSub: '21 days — ruthless dedication!',       arcColor: '#FF1744',
    borderColor: '#B71C1C', power: 47000,
    speech:   "21 DAYS. Blood red hair, battle scar, burning eyes like Eren transforming ⚔️ THREE WEEKS of NO EXCUSES.",
    mission:  "TITAN workout: deadlift 5×5, farmer walks, 10 min battle ropes.",
    reminder: "Day 22 is just another titan to slay ⚔️",
  },
  30: {
    auraColor: '#B04AFF', auraOp: 0.75,
    badgeBg: 'linear-gradient(135deg,#B04AFF,#4a0080)',
    badgeColor: '#f3e5f5', arcTitle: 'DEMON KING ARC', arcIcon: '👹',
    arcSub: '30 days — you ARE the final boss',    arcColor: '#B04AFF',
    borderColor: '#7B00FF', power: 999999,
    speech:   "30 DAYS. Purple hair, demon marks, my aura is cracking reality 👹 ONE FULL MONTH. You are LEGENDARY.",
    mission:  "Full body destruction + 10km run. Legends don't stop.",
    reminder: "ONE MONTH. New muscle. New brain. You rewired yourself 👹",
  },
}

function getKey(streak) {
  if (streak >= 30) return 30
  if (streak >= 21) return 21
  if (streak >= 14) return 14
  if (streak >= 7)  return 7
  if (streak >= 3)  return 3
  return 0
}

// ════════════════════════════════════════════════════════════════════
//  StreakTimeline — week dots + 30-day grid + year heatmap
// ════════════════════════════════════════════════════════════════════
function StreakTimeline({ history }) {
  const today = new Date()

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return {
      label:   ['S','M','T','W','T','F','S'][d.getDay()],
      done:    history.includes(d.toISOString().split('T')[0]),
      isToday: i === 6,
    }
  })

  const monthCells = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (29 - i))
    return history.includes(d.toISOString().split('T')[0])
  })

  const yearCells = Array.from({ length: 364 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (363 - i))
    return history.includes(d.toISOString().split('T')[0])
  })
  const yearWeeks = Array.from({ length: 52 }, (_, w) =>
    yearCells.slice(w * 7, w * 7 + 7)
  )

  const label = {
    fontSize: '0.72rem', color: '#666', marginBottom: 8,
    textTransform: 'uppercase', letterSpacing: 1,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* WEEK */}
      <div>
        <div style={label}>This week</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {weekDays.map((day, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{ fontSize: '0.7rem', color: day.isToday ? '#00c853' : '#555' }}>
                {day.label}
              </div>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: day.done ? '#00c853' : '#1e1e1e',
                border: day.isToday ? '2px solid #00c853' : '2px solid #333',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', color: '#fff',
                boxShadow: day.done ? '0 0 10px #00c85366' : 'none',
              }}>
                {day.done ? '✓' : ''}
              </div>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#888' }}>
            {weekDays.filter(d => d.done).length}/7
          </div>
        </div>
      </div>

      {/* 30-DAY GRID */}
      <div>
        <div style={label}>Last 30 days</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 5 }}>
          {monthCells.map((done, i) => (
            <div key={i} style={{
              width: '100%', aspectRatio: '1', borderRadius: 5,
              background: done ? '#00c853' : '#1e1e1e',
              border: `1px solid ${done ? '#00c85355' : '#2a2a2a'}`,
            }} />
          ))}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#555', marginTop: 6 }}>
          {monthCells.filter(Boolean).length} / 30 days completed
        </div>
      </div>

      {/* YEAR HEATMAP */}
      <div>
        <div style={label}>This year (52 weeks)</div>
        <div style={{ display: 'flex', gap: 3, overflowX: 'auto', paddingBottom: 4 }}>
          {yearWeeks.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {week.map((done, di) => (
                <div key={di} style={{
                  width: 11, height: 11, borderRadius: 2,
                  background: done ? '#00c853' : '#1a1a1a',
                  border: `1px solid ${done ? '#00c85540' : '#252525'}`,
                }} />
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <span style={{ fontSize: '0.7rem', color: '#555' }}>Less</span>
          {['#1a1a1a','#005c28','#007a35','#009e45','#00c853'].map((c, i) => (
            <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: c }} />
          ))}
          <span style={{ fontSize: '0.7rem', color: '#555' }}>More</span>
        </div>
      </div>

    </div>
  )
}

// ════════════════════════════════════════════════════════════════════
//  Main HabitTracker Component
// ════════════════════════════════════════════════════════════════════
export default function HabitTracker() {
  const [streak, setStreak]             = useState(0)
  const [history, setHistory]           = useState([])
  const [habits, setHabits]             = useState([])
  const [checkedToday, setCheckedToday] = useState({})
  const [speechMsg, setSpeechMsg]       = useState('')
  const [showReminder, setShowReminder] = useState(false)
  const [newHabit, setNewHabit]         = useState('')
  const [newIcon, setNewIcon]           = useState('⭐')
  const [loading, setLoading]           = useState(true)
  const [celebrating, setCelebrating]   = useState(false)
  const reminderRef = useRef(null)

  const today = new Date().toISOString().split('T')[0]
  const k     = getKey(streak)
  const cfg   = STREAK_CONFIGS[k]

  useEffect(() => {
    loadData()
    reminderRef.current = setTimeout(() => setShowReminder(true), 30000)
    return () => clearTimeout(reminderRef.current)
  }, [])

  const loadData = async () => {
    try {
      const [hRes, sRes] = await Promise.all([
        axios.get(`${API}/habits`),
        axios.get(`${API}/habits/streak`),
      ])
      setHabits(hRes.data || [])
      setStreak(sRes.data.streak || 0)
      setHistory(sRes.data.history || [])
      setCheckedToday(sRes.data.checked_today || {})
    } catch {
      setHabits([
        { id: 1, name: 'Morning Workout', icon: '💪', time: '07:00 AM' },
        { id: 2, name: 'Drink 3L Water',  icon: '💧', time: 'All Day'  },
        { id: 3, name: 'Protein Meal',    icon: '🥩', time: '01:00 PM' },
        { id: 4, name: 'Stretching',      icon: '🧘', time: '06:00 PM' },
        { id: 5, name: 'Sleep by 11 PM',  icon: '😴', time: '11:00 PM' },
      ])
    }
    setLoading(false)
  }

  const toggleHabit = async (id) => {
    const updated = { ...checkedToday, [id]: !checkedToday[id] }
    setCheckedToday(updated)

    const allDone = habits.length > 0 && habits.every(h => updated[h.id])
    if (allDone && !history.includes(today)) {
      const newHistory = [...history, today]
      setHistory(newHistory)
      setStreak(prev => prev + 1)
      setSpeechMsg('🎉 ALL habits done! Streak +1! ' + cfg.speech)
      setCelebrating(true)
      setTimeout(() => setCelebrating(false), 2000)
    }

    try {
      await axios.post(`${API}/habits/check`, {
        habit_id: id,
        date:     today,
        done:     !checkedToday[id],
      })
    } catch { /* offline mode */ }
  }

  const addHabit = async () => {
    if (!newHabit.trim()) return
    const h = {
      id:   Date.now(),
      name: newHabit.trim(),
      icon: newIcon || '⭐',
      time: 'Any Time',
    }
    setHabits(prev => [...prev, h])
    setNewHabit('')
    setNewIcon('⭐')
    try { await axios.post(`${API}/habits`, h) } catch { /* offline */ }
  }

  const deleteHabit = async (id) => {
    setHabits(prev => prev.filter(h => h.id !== id))
    try { await axios.delete(`${API}/habits/${id}`) } catch { /* offline */ }
  }

  const doneCount   = habits.filter(h => checkedToday[h.id]).length
  const totalCount  = habits.length
  const progressPct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: 300, color: '#888', fontSize: '1rem',
    }}>
      Loading habits...
    </div>
  )

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: '0 auto' }}>

      <style>{`
        @keyframes slideIn      { from{transform:translateX(120%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes popIn        { from{transform:scale(0.7);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes streakFlame  { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.3) skewX(-5deg)} }
        @keyframes badgePulse   { 0%,100%{box-shadow:0 0 0 0 ${cfg.auraColor}44} 50%{box-shadow:0 0 28px 10px ${cfg.auraColor}33} }
        @keyframes celebPop     { 0%{transform:scale(1) rotate(0deg)} 30%{transform:scale(1.15) rotate(-4deg)} 60%{transform:scale(1.12) rotate(4deg)} 100%{transform:scale(1) rotate(0deg)} }
        .habit-row:hover        { background:#252525 !important; }
        .habit-check            { transition:all 0.25s; cursor:pointer; user-select:none; }
        .habit-check:hover      { transform:scale(1.18); }
        .del-btn                { transition:color 0.2s; cursor:pointer; }
        .del-btn:hover          { color:#ff4444 !important; }
        .add-btn                { transition:all 0.2s; }
        .add-btn:hover          { background:#00a844 !important; transform:scale(1.04); }
        .milestone-card         { transition:all 0.3s; }
        .milestone-card:hover   { transform:translateY(-3px); }
        input:focus             { border-color:#00c85366 !important; }
      `}</style>

      {/* ── Reminder Toast ── */}
      {showReminder && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: '#1a1a1a', border: `1px solid ${cfg.borderColor}`,
          borderRadius: 14, padding: '14px 18px', maxWidth: 300,
          animation: 'slideIn 0.4s ease',
          boxShadow: `0 4px 28px ${cfg.auraColor}55`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 700, color: cfg.arcColor, fontSize: '0.9rem' }}>
              {cfg.arcIcon} Daily Reminder
            </span>
            <span onClick={() => setShowReminder(false)}
              style={{ cursor: 'pointer', color: '#555', fontSize: '1.1rem', lineHeight: 1 }}>✕</span>
          </div>
          <div style={{ fontSize: '0.83rem', color: '#aaa', lineHeight: 1.55 }}>{cfg.reminder}</div>
        </div>
      )}

      {/* ── Celebration Overlay ── */}
      {celebrating && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none', zIndex: 9998,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: '6rem', animation: 'celebPop 0.7s ease' }}>🎉</div>
        </div>
      )}

      {/* ══ SECTION 1 — MASCOT + INFO CARD ══ */}
      <div style={{
        display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap',
        background: '#1a1a1a', borderRadius: 18,
        border: `2px solid ${cfg.borderColor}`,
        padding: 24, marginBottom: 20,
        animation: 'badgePulse 2.5s ease-in-out infinite',
      }}>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <AnimeMascot streak={streak} />

          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 210 }}>
            {[0, 3, 7, 14, 21, 30].map(s => (
              <button key={s} onClick={() => { setStreak(s); setSpeechMsg('') }} style={{
                padding: '3px 10px', fontSize: '0.65rem', borderRadius: 7,
                background: streak === s ? cfg.arcColor : '#222',
                color:      streak === s ? '#000' : '#777',
                border:    `1px solid ${streak === s ? cfg.arcColor : '#333'}`,
                cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s',
              }}>{s}d</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: cfg.badgeBg, borderRadius: 22,
            padding: '6px 18px', width: 'fit-content',
            animation: 'popIn 0.5s ease',
            boxShadow: `0 2px 14px ${cfg.auraColor}44`,
          }}>
            <span style={{ fontSize: '1.1rem' }}>{cfg.arcIcon}</span>
            <span style={{ fontWeight: 800, color: cfg.badgeColor, fontSize: '0.95rem', letterSpacing: 1 }}>
              {cfg.arcTitle}
            </span>
          </div>

          <div style={{ color: cfg.arcColor, fontSize: '0.85rem', fontStyle: 'italic' }}>
            {cfg.arcSub}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ background: '#111', borderRadius: 12, padding: '10px 20px', textAlign: 'center', minWidth: 85 }}>
              <div style={{ fontSize: '0.65rem', color: '#555', marginBottom: 2, letterSpacing: 1 }}>STREAK</div>
              <div style={{
                fontSize: '2.4rem', fontWeight: 900, color: cfg.arcColor, lineHeight: 1,
                animation: streak > 0 ? 'streakFlame 1.2s ease-in-out infinite' : 'none',
              }}>{streak}</div>
              <div style={{ fontSize: '0.62rem', color: '#444', marginTop: 2 }}>days</div>
            </div>

            <div style={{ background: '#111', borderRadius: 12, padding: '10px 18px', textAlign: 'center', minWidth: 100 }}>
              <div style={{ fontSize: '0.65rem', color: '#555', marginBottom: 2, letterSpacing: 1 }}>POWER LEVEL</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ff9800', lineHeight: 1 }}>
                {cfg.power.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.62rem', color: '#444', marginTop: 2 }}>pts</div>
            </div>

            <div style={{ background: '#111', borderRadius: 12, padding: '10px 18px', textAlign: 'center', minWidth: 85 }}>
              <div style={{ fontSize: '0.65rem', color: '#555', marginBottom: 2, letterSpacing: 1 }}>TODAY</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00c853', lineHeight: 1 }}>
                {doneCount}/{totalCount}
              </div>
              <div style={{ fontSize: '0.62rem', color: '#444', marginTop: 2 }}>habits</div>
            </div>
          </div>

          <div style={{
            background: '#111', border: `1px solid ${cfg.borderColor}44`,
            borderRadius: 12, padding: '12px 16px',
            fontSize: '0.85rem', color: '#ccc', lineHeight: 1.6, fontStyle: 'italic',
          }}>
            "{speechMsg || cfg.speech}"
          </div>

          <div style={{ background: '#081408', borderRadius: 12, padding: '10px 14px', border: '1px solid #00c85333' }}>
            <span style={{ fontSize: '0.7rem', color: '#00c853', fontWeight: 800, letterSpacing: 0.5 }}>
              TODAY'S MISSION ›{' '}
            </span>
            <span style={{ fontSize: '0.83rem', color: '#aaa' }}>{cfg.mission}</span>
          </div>
        </div>
      </div>

      {/* ══ SECTION 2 — STREAK TIMELINE ══ */}
      <div style={{ background: '#1a1a1a', borderRadius: 14, padding: 22, marginBottom: 20, border: '1px solid #252525' }}>
        <h3 style={{ color: '#00c853', margin: '0 0 18px 0', fontSize: '0.95rem', letterSpacing: 0.5 }}>
          📈 Streak Timeline
        </h3>
        <StreakTimeline history={history} />
      </div>

      {/* ══ SECTION 3 — HABITS LIST ══ */}
      <div style={{ background: '#1a1a1a', borderRadius: 14, padding: 22, marginBottom: 20, border: '1px solid #252525' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ color: '#2196f3', margin: 0, fontSize: '0.95rem' }}>✅ Today's Habits</h3>
          <span style={{ fontSize: '0.82rem', color: '#555' }}>{doneCount}/{totalCount} done</span>
        </div>

        <div style={{ height: 7, background: '#252525', borderRadius: 4, marginBottom: 18, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            background: `linear-gradient(90deg, ${cfg.arcColor}, ${cfg.auraColor})`,
            width: `${progressPct}%`,
            transition: 'width 0.6s ease',
            boxShadow: progressPct > 0 ? `0 0 10px ${cfg.auraColor}88` : 'none',
          }} />
        </div>

        {habits.length === 0 && (
          <div style={{
            color: '#444', fontSize: '0.9rem', textAlign: 'center',
            padding: '28px 0', border: '1px dashed #2a2a2a', borderRadius: 10,
          }}>
            No habits yet — add your first one below 👇
          </div>
        )}

        {habits.map((habit, i) => {
          const done = !!checkedToday[habit.id]
          return (
            <div key={habit.id} className="habit-row" style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '13px 10px', borderRadius: 10,
              borderBottom: i < habits.length - 1 ? '1px solid #1e1e1e' : 'none',
              background: done ? '#081408' : 'transparent',
              transition: 'all 0.3s',
            }}>
              <div style={{ fontSize: '1.4rem', minWidth: 32, textAlign: 'center', userSelect: 'none' }}>
                {habit.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.92rem',
                  color: done ? '#00c853' : '#ddd',
                  textDecoration: done ? 'line-through' : 'none',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {habit.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#444', marginTop: 2 }}>
                  {habit.time || 'Any Time'}
                </div>
              </div>
              <div className="habit-check" onClick={() => toggleHabit(habit.id)} style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#00c853' : '#1e1e1e',
                border: `2px solid ${done ? '#00c853' : '#383838'}`,
                fontSize: '1rem', fontWeight: 800, color: '#fff',
                boxShadow: done ? '0 0 10px #00c85355' : 'none',
              }}>
                {done ? '✓' : ''}
              </div>
              <div className="del-btn" onClick={() => deleteHabit(habit.id)}
                style={{ color: '#383838', fontSize: '1rem', padding: '4px 8px', flexShrink: 0 }}>
                ✕
              </div>
            </div>
          )
        })}

        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <input value={newIcon} onChange={e => setNewIcon(e.target.value)}
            placeholder="🏋️" maxLength={2}
            style={{
              width: 52, padding: '11px 6px', background: '#111',
              border: '1px solid #2e2e2e', borderRadius: 10,
              color: '#fff', fontSize: '1.2rem', outline: 'none', textAlign: 'center',
              transition: 'border-color 0.2s', flexShrink: 0,
            }} />
          <input value={newHabit} onChange={e => setNewHabit(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addHabit()}
            placeholder="Add a new habit..."
            style={{
              flex: 1, minWidth: 140, padding: '11px 14px', background: '#111',
              border: '1px solid #2e2e2e', borderRadius: 10,
              color: '#fff', fontSize: '0.9rem', outline: 'none',
              transition: 'border-color 0.2s',
            }} />
          <button className="add-btn" onClick={addHabit} style={{
            padding: '11px 24px', background: '#00c853', color: '#000',
            border: 'none', borderRadius: 10, fontWeight: 800, cursor: 'pointer',
            fontSize: '0.9rem', flexShrink: 0,
          }}>Add</button>
        </div>
      </div>

      {/* ══ SECTION 4 — MILESTONES ══ */}
      <div style={{ background: '#1a1a1a', borderRadius: 14, padding: '18px 22px', border: '1px solid #252525' }}>
        <h3 style={{ color: '#555', fontSize: '0.8rem', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: 2 }}>
          🏆 Milestones
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { days: 3,  label: 'Rookie',     icon: '🔥', color: '#FF9800' },
            { days: 7,  label: 'Fighter',    icon: '⚡', color: '#2196F3' },
            { days: 14, label: 'Hero',       icon: '✨', color: '#FFD700' },
            { days: 21, label: 'Titan',      icon: '⚔️', color: '#FF1744' },
            { days: 30, label: 'Demon King', icon: '👹', color: '#B04AFF' },
          ].map(m => {
            const reached = streak >= m.days
            const current = getKey(streak) === m.days
            return (
              <div key={m.days} className="milestone-card" style={{
                flex: 1, minWidth: 90, textAlign: 'center',
                padding: '12px 8px', borderRadius: 12,
                background: reached ? `${m.color}15` : '#111',
                border: `1px solid ${reached ? m.color + '55' : '#222'}`,
                opacity: reached ? 1 : 0.4,
                boxShadow: current ? `0 0 16px ${m.color}44` : 'none',
              }}>
                <div style={{ fontSize: '1.6rem' }}>{m.icon}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, marginTop: 6, color: reached ? m.color : '#555' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#444', marginTop: 2 }}>{m.days} days</div>
                {reached
                  ? <div style={{ fontSize: '0.62rem', color: '#00c853', marginTop: 5 }}>✓ UNLOCKED</div>
                  : <div style={{ fontSize: '0.62rem', color: '#444', marginTop: 5 }}>{m.days - streak}d left</div>
                }
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

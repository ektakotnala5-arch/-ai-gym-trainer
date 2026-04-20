import { useState, useEffect } from 'react'
import Auth from './components/Auth'
import VideoFeed from './components/VideoFeed'
import Dashboard from './components/Dashboard'
import DietPlanner from './components/DietPlanner'
import HabitTracker from './components/HabitTracker'
import AIChat from './components/AIChat'
import './App.css'

export const EXERCISES = [
  // Chest
  { value: "bench_press", label: "Bench Press", group: "Chest" },
  { value: "incline_bench_press", label: "Incline Bench Press", group: "Chest" },
  { value: "decline_bench_press", label: "Decline Bench Press", group: "Chest" },
  { value: "incline_db_press", label: "Incline DB Press", group: "Chest" },
  { value: "decline_db_press", label: "Decline DB Press", group: "Chest" },
  { value: "chest_fly", label: "Chest Fly", group: "Chest" },
  { value: "incline_db_fly", label: "Incline DB Fly", group: "Chest" },
  { value: "cable_crossover", label: "Cable Crossover", group: "Chest" },
  { value: "high_cable_crossover", label: "High Cable Crossover", group: "Chest" },
  { value: "low_cable_crossover", label: "Low Cable Crossover", group: "Chest" },
  { value: "pec_deck", label: "Pec Deck", group: "Chest" },
  { value: "pushup", label: "Push Up", group: "Chest" },
  { value: "wide_pushup", label: "Wide Push Up", group: "Chest" },
  { value: "diamond_pushup", label: "Diamond Push Up", group: "Chest" },
  { value: "incline_pushup", label: "Incline Push Up", group: "Chest" },
  { value: "decline_pushup", label: "Decline Push Up", group: "Chest" },
  { value: "dips", label: "Dips", group: "Chest" },
  { value: "parallel_bar_dips", label: "Parallel Bar Dips", group: "Chest" },
  { value: "dips_behind_hips", label: "Bench Dips", group: "Chest" },
  // Back
  { value: "pullup", label: "Pull Up", group: "Back" },
  { value: "chinup", label: "Chin Up", group: "Back" },
  { value: "lat_pulldown", label: "Lat Pulldown", group: "Back" },
  { value: "close_grip_lat_pulldown", label: "Close Grip Lat Pulldown", group: "Back" },
  { value: "reverse_lat_pulldown", label: "Reverse Lat Pulldown", group: "Back" },
  { value: "straight_arm_pulldown", label: "Straight Arm Pulldown", group: "Back" },
  { value: "seated_cable_row", label: "Seated Cable Row", group: "Back" },
  { value: "low_pulley_row", label: "Low Pulley Row", group: "Back" },
  { value: "one_arm_db_row", label: "One Arm DB Row", group: "Back" },
  { value: "one_arm_cable_row", label: "One Arm Cable Row", group: "Back" },
  { value: "bent_over_row", label: "Bent Over Row", group: "Back" },
  { value: "t_bar_row", label: "T-Bar Row", group: "Back" },
  { value: "barbell_pullover", label: "Barbell Pullover", group: "Back" },
  { value: "deadlift", label: "Deadlift", group: "Back" },
  { value: "romanian_deadlift", label: "Romanian Deadlift", group: "Back" },
  { value: "sumo_deadlift", label: "Sumo Deadlift", group: "Back" },
  { value: "back_hyperextension", label: "Back Hyperextension", group: "Back" },
  { value: "reverse_pec_fly", label: "Reverse Pec Fly", group: "Back" },
  { value: "face_pull", label: "Face Pull", group: "Back" },
  { value: "barbell_shrug", label: "Barbell Shrug", group: "Back" },
  { value: "db_shrug", label: "DB Shrug", group: "Back" },
  { value: "plate_shrug", label: "Plate Shrug", group: "Back" },
  // Shoulders
  { value: "shoulder_press", label: "Shoulder Press", group: "Shoulders" },
  { value: "arnold_press", label: "Arnold Press", group: "Shoulders" },
  { value: "military_press", label: "Military Press", group: "Shoulders" },
  { value: "db_shoulder_press", label: "DB Shoulder Press", group: "Shoulders" },
  { value: "machine_shoulder_press", label: "Machine Shoulder Press", group: "Shoulders" },
  { value: "lateral_raise", label: "Lateral Raise", group: "Shoulders" },
  { value: "cable_lateral_raise", label: "Cable Lateral Raise", group: "Shoulders" },
  { value: "seated_lateral_raise", label: "Seated Lateral Raise", group: "Shoulders" },
  { value: "front_raise", label: "Front Raise", group: "Shoulders" },
  { value: "db_front_raise", label: "DB Front Raise", group: "Shoulders" },
  { value: "cable_front_raise", label: "Cable Front Raise", group: "Shoulders" },
  { value: "upright_row", label: "Upright Row", group: "Shoulders" },
  { value: "cable_upright_row", label: "Cable Upright Row", group: "Shoulders" },
  { value: "rear_delt_fly", label: "Rear Delt Fly", group: "Shoulders" },
  // Biceps
  { value: "bicep_curl", label: "Bicep Curl", group: "Biceps" },
  { value: "barbell_curl", label: "Barbell Curl", group: "Biceps" },
  { value: "ez_bar_curl", label: "EZ Bar Curl", group: "Biceps" },
  { value: "hammer_curl", label: "Hammer Curl", group: "Biceps" },
  { value: "concentration_curl", label: "Concentration Curl", group: "Biceps" },
  { value: "preacher_curl", label: "Preacher Curl", group: "Biceps" },
  { value: "preacher_db_curl", label: "Preacher DB Curl", group: "Biceps" },
  { value: "incline_db_curl", label: "Incline DB Curl", group: "Biceps" },
  { value: "cable_curl", label: "Cable Curl", group: "Biceps" },
  { value: "standing_cable_curl", label: "Standing Cable Curl", group: "Biceps" },
  { value: "spider_curl", label: "Spider Curl", group: "Biceps" },
  { value: "reverse_curl", label: "Reverse Curl", group: "Biceps" },
  { value: "21s_curl", label: "21s Curl", group: "Biceps" },
  // Triceps
  { value: "tricep_extension", label: "Tricep Extension", group: "Triceps" },
  { value: "overhead_tricep_extension", label: "Overhead Extension", group: "Triceps" },
  { value: "skull_crusher", label: "Skull Crusher", group: "Triceps" },
  { value: "tricep_pushdown", label: "Tricep Pushdown", group: "Triceps" },
  { value: "rope_pushdown", label: "Rope Pushdown", group: "Triceps" },
  { value: "v_bar_pushdown", label: "V-Bar Pushdown", group: "Triceps" },
  { value: "reverse_grip_pushdown", label: "Reverse Grip Pushdown", group: "Triceps" },
  { value: "one_arm_pushdown", label: "One Arm Pushdown", group: "Triceps" },
  { value: "tricep_dip", label: "Tricep Dip", group: "Triceps" },
  { value: "cable_kickback", label: "Cable Kickback", group: "Triceps" },
  { value: "oh_cable_extension", label: "OH Cable Extension", group: "Triceps" },
  { value: "close_grip_bench", label: "Close Grip Bench", group: "Triceps" },
  // Legs
  { value: "squat", label: "Squat", group: "Legs" },
  { value: "barbell_squat", label: "Barbell Squat", group: "Legs" },
  { value: "front_squat", label: "Front Squat", group: "Legs" },
  { value: "sumo_squat", label: "Sumo Squat", group: "Legs" },
  { value: "goblet_squat", label: "Goblet Squat", group: "Legs" },
  { value: "hack_squat", label: "Hack Squat", group: "Legs" },
  { value: "jump_squat", label: "Jump Squat", group: "Legs" },
  { value: "pistol_squat", label: "Pistol Squat", group: "Legs" },
  { value: "lunge", label: "Lunge", group: "Legs" },
  { value: "walking_lunge", label: "Walking Lunge", group: "Legs" },
  { value: "reverse_lunge", label: "Reverse Lunge", group: "Legs" },
  { value: "lateral_lunge", label: "Lateral Lunge", group: "Legs" },
  { value: "leg_press", label: "Leg Press", group: "Legs" },
  { value: "leg_extension", label: "Leg Extension", group: "Legs" },
  { value: "leg_curl", label: "Leg Curl", group: "Legs" },
  { value: "seated_leg_curl", label: "Seated Leg Curl", group: "Legs" },
  { value: "hip_thrust", label: "Hip Thrust", group: "Legs" },
  { value: "glute_bridge", label: "Glute Bridge", group: "Legs" },
  { value: "donkey_kick", label: "Donkey Kick", group: "Legs" },
  { value: "step_up", label: "Step Up", group: "Legs" },
  { value: "box_jump", label: "Box Jump", group: "Legs" },
  { value: "wall_sit", label: "Wall Sit", group: "Legs" },
  { value: "calf_raise", label: "Calf Raise", group: "Legs" },
  { value: "seated_calf_raise", label: "Seated Calf Raise", group: "Legs" },
  { value: "standing_calf_raise", label: "Standing Calf Raise", group: "Legs" },
  // Core
  { value: "plank", label: "Plank", group: "Core" },
  { value: "side_plank", label: "Side Plank", group: "Core" },
  { value: "crunch", label: "Crunch", group: "Core" },
  { value: "situp", label: "Sit Up", group: "Core" },
  { value: "v_up", label: "V Up", group: "Core" },
  { value: "cable_crunch", label: "Cable Crunch", group: "Core" },
  { value: "leg_raise", label: "Leg Raise", group: "Core" },
  { value: "hanging_leg_raise", label: "Hanging Leg Raise", group: "Core" },
  { value: "mountain_climber", label: "Mountain Climber", group: "Core" },
  { value: "bicycle_crunch", label: "Bicycle Crunch", group: "Core" },
  { value: "russian_twist", label: "Russian Twist", group: "Core" },
  { value: "flutter_kick", label: "Flutter Kick", group: "Core" },
  { value: "dead_bug", label: "Dead Bug", group: "Core" },
  // Cardio
  { value: "jumping_jack", label: "Jumping Jack", group: "Cardio" },
  { value: "burpee", label: "Burpee", group: "Cardio" },
  { value: "high_knees", label: "High Knees", group: "Cardio" },
  { value: "skipping", label: "Jump Rope", group: "Cardio" },
  { value: "running_in_place", label: "Running in Place", group: "Cardio" },
  { value: "butt_kicks", label: "Butt Kicks", group: "Cardio" },
  { value: "lateral_shuffle", label: "Lateral Shuffle", group: "Cardio" },
  { value: "speed_skater", label: "Speed Skater", group: "Cardio" },
  // Senior Friendly
  { value: "standing_march", label: "Standing March", group: "Senior" },
  { value: "toe_tap", label: "Toe Tap", group: "Senior" },
  { value: "seated_leg_raise", label: "Seated Leg Raise", group: "Senior" },
  { value: "arm_circle", label: "Arm Circle", group: "Senior" },
  { value: "shoulder_roll", label: "Shoulder Roll", group: "Senior" },
  { value: "chair_squat", label: "Chair Squat", group: "Senior" },
  { value: "heel_toe_walk", label: "Heel Toe Walk", group: "Senior" },
  // Yoga
  { value: "warrior_pose", label: "Warrior Pose", group: "Yoga" },
  { value: "downward_dog", label: "Downward Dog", group: "Yoga" },
  { value: "tree_pose", label: "Tree Pose", group: "Yoga" },
  { value: "cobra_pose", label: "Cobra Pose", group: "Yoga" },
  { value: "child_pose", label: "Child Pose", group: "Yoga" },
  { value: "cat_cow", label: "Cat-Cow", group: "Yoga" },
  { value: "bridge_pose", label: "Bridge Pose", group: "Yoga" },
  { value: "pigeon_pose", label: "Pigeon Pose", group: "Yoga" },
]

const GROUP_COLORS = {
  Chest: '#e91e63', Back: '#2196f3', Shoulders: '#9c27b0',
  Biceps: '#00c853', Triceps: '#ff9800', Legs: '#f44336',
  Core: '#00bcd4', Cardio: '#ff5722', Senior: '#8bc34a', Yoga: '#7c4dff',
}

const GROUP_ICONS = {
  Chest: '💪', Back: '🏋️', Shoulders: '🔝', Biceps: '💪',
  Triceps: '💪', Legs: '🦵', Core: '🎯', Cardio: '🏃',
  Senior: '🌱', Yoga: '🧘',
}

const TABS = [
  { id: 'workout', label: 'Workout', icon: '💪' },
  { id: 'diet', label: 'Diet', icon: '🥗' },
  { id: 'habit', label: 'Habits', icon: '📅' },
  { id: 'chat', label: 'AI Chat', icon: '🤖' },
]

const groups = [...new Set(EXERCISES.map(e => e.group))]

// ── Exercise Picker Panel ────────────────────────────────────────────
function ExercisePicker({ exercise, setExercise, isRunning }) {
  const [activeGroup, setActiveGroup] = useState('Biceps')
  const [search, setSearch] = useState('')

  const filtered = EXERCISES.filter(e =>
    (search ? e.label.toLowerCase().includes(search.toLowerCase()) : e.group === activeGroup)
  )

  return (
    <div style={{
      width: 260, background: '#080808', borderRight: '1px solid #1a1a1a',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Search */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #141414' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: '#444' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search exercises..."
            disabled={isRunning}
            style={{
              width: '100%', padding: '9px 12px 9px 34px',
              background: '#111', border: '1px solid #1e1e1e', borderRadius: 10,
              color: '#fff', fontSize: '0.82rem', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Group Pills */}
      {!search && (
        <div style={{
          padding: '10px 12px', display: 'flex', flexWrap: 'wrap', gap: 6,
          borderBottom: '1px solid #141414',
        }}>
          {groups.map(g => (
            <button key={g} onClick={() => !isRunning && setActiveGroup(g)}
              disabled={isRunning}
              style={{
                padding: '4px 10px', borderRadius: 20, border: 'none', cursor: isRunning ? 'not-allowed' : 'pointer',
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: 0.5,
                background: activeGroup === g ? GROUP_COLORS[g] || '#00c853' : '#151515',
                color: activeGroup === g ? '#fff' : '#555',
                transition: 'all 0.2s',
                opacity: isRunning ? 0.5 : 1,
              }}>
              {g}
            </button>
          ))}
        </div>
      )}

      {/* Exercise List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {filtered.map(ex => {
          const isActive = exercise === ex.value
          const color = GROUP_COLORS[ex.group] || '#00c853'
          return (
            <div key={ex.value}
              onClick={() => !isRunning && setExercise(ex.value)}
              style={{
                padding: '10px 16px', cursor: isRunning ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                background: isActive ? `${color}12` : 'transparent',
                borderLeft: isActive ? `3px solid ${color}` : '3px solid transparent',
                transition: 'all 0.15s',
                opacity: isRunning ? 0.5 : 1,
              }}
              onMouseEnter={e => { if (!isActive && !isRunning) e.currentTarget.style.background = '#111' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: isActive ? `${color}22` : '#151515',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem',
                border: isActive ? `1px solid ${color}44` : '1px solid #1e1e1e',
              }}>
                {GROUP_ICONS[ex.group] || '💪'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: '0.82rem', fontWeight: isActive ? 700 : 500,
                  color: isActive ? color : '#aaa',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {ex.label}
                </div>
                {search && (
                  <div style={{ fontSize: '0.65rem', color: '#444', marginTop: 1 }}>{ex.group}</div>
                )}
              </div>
              {isActive && (
                <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: '#333', fontSize: '0.82rem' }}>
            No exercises found
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main App ─────────────────────────────────────────────────────────
function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('workout')
  const [stats, setStats] = useState({ reps: 0, stage: null, angle: 0, feedback: [] })
  const [exercise, setExercise] = useState('bicep_curl')
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (savedUser && token) setUser(JSON.parse(savedUser))
    setLoading(false)
  }, [])

  const handleLogin = (userData) => setUser(userData)
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setTab('workout')
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: '#00c853', fontSize: '1.2rem', letterSpacing: 2
    }}>
      LOADING...
    </div>
  )

  if (!user) return <Auth onLogin={handleLogin} />

  const selectedExercise = EXERCISES.find(e => e.value === exercise)
  const groupColor = GROUP_COLORS[selectedExercise?.group] || '#00c853'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0a0a', fontFamily: "'Segoe UI', sans-serif" }}>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #333; }
        input { box-sizing: border-box; }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 0,
        padding: '0 24px', background: '#080808',
        borderBottom: '1px solid #141414', height: 58, flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 32 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #00c853, #00897b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', boxShadow: '0 0 12px rgba(0,200,83,0.3)',
          }}>🏋️</div>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: 1 }}>GYMAI</span>
        </div>

        {/* Nav Tabs */}
        <div style={{ display: 'flex', gap: 2 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '6px 18px', border: 'none', borderRadius: 8,
              cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem',
              background: tab === t.id ? '#1a1a1a' : 'transparent',
              color: tab === t.id ? '#fff' : '#555',
              transition: 'all 0.2s', letterSpacing: 0.5,
              position: 'relative',
            }}>
              <span style={{ marginRight: 6 }}>{t.icon}</span>
              {t.label}
              {tab === t.id && (
                <div style={{
                  position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)',
                  width: '60%', height: 2, background: '#00c853', borderRadius: 1,
                }} />
              )}
            </button>
          ))}
        </div>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600 }}>{user.name}</div>
            <div style={{ color: '#444', fontSize: '0.65rem', letterSpacing: 1 }}>ATHLETE</div>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00c853, #00897b)',
            color: '#000', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem',
            boxShadow: '0 0 10px rgba(0,200,83,0.3)',
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <button onClick={handleLogout} style={{
            padding: '5px 12px', background: 'transparent',
            border: '1px solid #1e1e1e', borderRadius: 8,
            color: '#444', cursor: 'pointer', fontSize: '0.75rem',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.borderColor = '#333' }}
            onMouseLeave={e => { e.target.style.color = '#444'; e.target.style.borderColor = '#1e1e1e' }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* WORKOUT TAB */}
        {tab === 'workout' && (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

            {/* Exercise Picker */}
            <ExercisePicker
              exercise={exercise}
              setExercise={setExercise}
              isRunning={isRunning}
            />

            {/* Camera */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Exercise label bar */}
              <div style={{
                padding: '8px 20px', background: '#080808',
                borderBottom: '1px solid #141414',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  padding: '3px 12px', borderRadius: 20, fontSize: '0.72rem',
                  fontWeight: 800, letterSpacing: 1,
                  background: `${groupColor}18`,
                  color: groupColor, border: `1px solid ${groupColor}33`,
                }}>
                  {selectedExercise?.group?.toUpperCase()}
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem', letterSpacing: 0.5 }}>
                  {selectedExercise?.label?.toUpperCase()}
                </div>
                {isRunning && (
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#e53935', animation: 'blink 1s infinite' }} />
                    <span style={{ color: '#e53935', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1 }}>TRACKING</span>
                  </div>
                )}
              </div>

              <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <VideoFeed
                  exercise={exercise}
                  onStats={setStats}
                  isRunning={isRunning}
                  setIsRunning={setIsRunning}
                />
                <Dashboard stats={stats} exercise={exercise} />
              </div>
            </div>
          </div>
        )}

        {tab === 'diet' && (
          <div style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f' }}>
            <DietPlanner />
          </div>
        )}
        {tab === 'habit' && (
          <div style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f' }}>
            <HabitTracker />
          </div>
        )}
        {tab === 'chat' && (
          <div style={{ flex: 1, overflow: 'hidden', background: '#0f0f0f' }}>
            <AIChat />
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  )
}

export default App

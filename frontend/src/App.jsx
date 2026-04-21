import { useState, useEffect } from 'react'
import Auth from './components/Auth'
import VideoFeed from './components/VideoFeed'
import Dashboard from './components/Dashboard'
import DietPlanner from './components/DietPlanner'
import HabitTracker from './components/HabitTracker'
import WorkoutPlanner from './components/WorkoutPlanner'
import Analytics, { recordSession } from './components/Analytics'
import AIChat from './components/AIChat'
import './App.css'

export const EXERCISES = [
  // Chest
  { value: "bench_press", label: "🏋️ Bench Press", group: "Chest" },
  { value: "incline_bench_press", label: "🏋️ Incline Bench Press", group: "Chest" },
  { value: "decline_bench_press", label: "🏋️ Decline Bench Press", group: "Chest" },
  { value: "incline_db_press", label: "💪 Incline DB Press", group: "Chest" },
  { value: "decline_db_press", label: "💪 Decline DB Press", group: "Chest" },
  { value: "chest_fly", label: "🦋 Chest Fly", group: "Chest" },
  { value: "incline_db_fly", label: "🦋 Incline DB Fly", group: "Chest" },
  { value: "cable_crossover", label: "🔀 Cable Crossover", group: "Chest" },
  { value: "pushup", label: "⬇️ Push Up", group: "Chest" },
  { value: "dips", label: "🪑 Dips", group: "Chest" },
  // Back
  { value: "pullup", label: "⬆️ Pull Up", group: "Back" },
  { value: "chinup", label: "⬆️ Chin Up", group: "Back" },
  { value: "lat_pulldown", label: "⬇️ Lat Pulldown", group: "Back" },
  { value: "seated_cable_row", label: "🚣 Seated Cable Row", group: "Back" },
  { value: "one_arm_db_row", label: "💪 One Arm DB Row", group: "Back" },
  { value: "bent_over_row", label: "🏋️ Bent Over Row", group: "Back" },
  { value: "deadlift", label: "🏋️ Deadlift", group: "Back" },
  { value: "romanian_deadlift", label: "🏋️ Romanian Deadlift", group: "Back" },
  { value: "face_pull", label: "🤜 Face Pull", group: "Back" },
  { value: "barbell_shrug", label: "🤷 Barbell Shrug", group: "Back" },
  // Shoulders
  { value: "shoulder_press", label: "🏋️ Shoulder Press", group: "Shoulders" },
  { value: "arnold_press", label: "💪 Arnold Press", group: "Shoulders" },
  { value: "military_press", label: "🏋️ Military Press", group: "Shoulders" },
  { value: "lateral_raise", label: "↔️ Lateral Raise", group: "Shoulders" },
  { value: "front_raise", label: "⬆️ Front Raise", group: "Shoulders" },
  { value: "upright_row", label: "⬆️ Upright Row", group: "Shoulders" },
  { value: "rear_delt_fly", label: "🦋 Rear Delt Fly", group: "Shoulders" },
  // Biceps
  { value: "bicep_curl", label: "💪 Bicep Curl", group: "Biceps" },
  { value: "barbell_curl", label: "🏋️ Barbell Curl", group: "Biceps" },
  { value: "hammer_curl", label: "🔨 Hammer Curl", group: "Biceps" },
  { value: "concentration_curl", label: "💪 Concentration Curl", group: "Biceps" },
  { value: "preacher_curl", label: "🙏 Preacher Curl", group: "Biceps" },
  { value: "cable_curl", label: "💪 Cable Curl", group: "Biceps" },
  // Triceps
  { value: "tricep_extension", label: "💪 Tricep Extension", group: "Triceps" },
  { value: "skull_crusher", label: "💀 Skull Crusher", group: "Triceps" },
  { value: "tricep_pushdown", label: "⬇️ Tricep Pushdown", group: "Triceps" },
  { value: "rope_pushdown", label: "🪢 Rope Pushdown", group: "Triceps" },
  { value: "tricep_dip", label: "🪑 Tricep Dip", group: "Triceps" },
  { value: "close_grip_bench", label: "🏋️ Close Grip Bench", group: "Triceps" },
  // Legs
  { value: "squat", label: "🦵 Squat", group: "Legs" },
  { value: "barbell_squat", label: "🏋️ Barbell Squat", group: "Legs" },
  { value: "front_squat", label: "🏋️ Front Squat", group: "Legs" },
  { value: "lunge", label: "🦵 Lunge", group: "Legs" },
  { value: "leg_press", label: "🦵 Leg Press", group: "Legs" },
  { value: "leg_extension", label: "🦵 Leg Extension", group: "Legs" },
  { value: "leg_curl", label: "🦵 Leg Curl", group: "Legs" },
  { value: "hip_thrust", label: "🍑 Hip Thrust", group: "Legs" },
  { value: "calf_raise", label: "🦶 Calf Raise", group: "Legs" },
  { value: "wall_sit", label: "🧱 Wall Sit", group: "Legs" },
  // Core
  { value: "plank", label: "🧘 Plank", group: "Core" },
  { value: "crunch", label: "💪 Crunch", group: "Core" },
  { value: "situp", label: "🔄 Sit Up", group: "Core" },
  { value: "leg_raise", label: "🦵 Leg Raise", group: "Core" },
  { value: "mountain_climber", label: "🧗 Mountain Climber", group: "Core" },
  { value: "bicycle_crunch", label: "🚴 Bicycle Crunch", group: "Core" },
  { value: "russian_twist", label: "🔄 Russian Twist", group: "Core" },
  // Cardio
  { value: "jumping_jack", label: "⭐ Jumping Jack", group: "Cardio" },
  { value: "burpee", label: "🔥 Burpee", group: "Cardio" },
  { value: "high_knees", label: "🏃 High Knees", group: "Cardio" },
  { value: "skipping", label: "🪢 Skipping", group: "Cardio" },
  // Senior Friendly
  { value: "standing_march", label: "🚶 Standing March", group: "Senior Friendly" },
  { value: "seated_leg_raise", label: "🪑 Seated Leg Raise", group: "Senior Friendly" },
  { value: "arm_circle", label: "⭕ Arm Circle", group: "Senior Friendly" },
  { value: "shoulder_roll", label: "🔄 Shoulder Roll", group: "Senior Friendly" },
  // Yoga
  { value: "warrior_pose", label: "🧘 Warrior Pose", group: "Yoga" },
  { value: "downward_dog", label: "🐕 Downward Dog", group: "Yoga" },
  { value: "tree_pose", label: "🌳 Tree Pose", group: "Yoga" },
  { value: "cobra_pose", label: "🐍 Cobra Pose", group: "Yoga" },
  { value: "child_pose", label: "🧘 Child Pose", group: "Yoga" },
]

const groups = [...new Set(EXERCISES.map(e => e.group))]

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('workout')
  const [stats, setStats] = useState({ reps: 0, stage: null, angle: 0, feedback: [] })
  const [exercise, setExercise] = useState('bicep_curl')
  const [isRunning, setIsRunning] = useState(false)
  const [lastSavedReps, setLastSavedReps] = useState(0)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (stats.reps > lastSavedReps && stats.reps > 0) {
      recordSession(exercise, stats.reps - lastSavedReps)
      setLastSavedReps(stats.reps)
    }
  }, [stats.reps])

  useEffect(() => {
    setLastSavedReps(0)
  }, [exercise, isRunning])

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
      justifyContent: 'center', color: '#00c853', fontSize: '1.2rem'
    }}>
      Loading...
    </div>
  )

  if (!user) return <Auth onLogin={handleLogin} />

  const tabStyle = (t) => ({
    padding: '8px 20px', border: 'none', borderRadius: 8,
    cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
    background: tab === t ? '#00c853' : '#2a2a2a',
    color: tab === t ? '#000' : '#fff',
    transition: 'all 0.2s'
  })

  return (
    <div className="app">
      <header className="header">
        <h1>🏋️ AI Gym Trainer</h1>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button style={tabStyle('workout')} onClick={() => setTab('workout')}>💪 Workout</button>
          <button style={tabStyle('diet')} onClick={() => setTab('diet')}>🥗 Diet</button>
          <button style={tabStyle('habit')} onClick={() => setTab('habit')}>📅 Habits</button>
          <button style={tabStyle('planner')} onClick={() => setTab('planner')}>🗓️ Planner</button>
          <button style={tabStyle('analytics')} onClick={() => setTab('analytics')}>📊 Analytics</button>
          <button style={tabStyle('chat')} onClick={() => setTab('chat')}>🤖 My AI</button>
        </div>

        {tab === 'workout' && (
          <select
            value={exercise}
            onChange={e => setExercise(e.target.value)}
            disabled={isRunning}
            style={{
              padding: '8px 12px', background: '#2a2a2a',
              color: '#fff', border: '1px solid #444', borderRadius: 8
            }}
          >
            {groups.map(group => (
              <optgroup key={group} label={group}>
                {EXERCISES.filter(e => e.group === group).map(ex => (
                  <option key={ex.value} value={ex.value}>{ex.label}</option>
                ))}
              </optgroup>
            ))}
          </select>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#00c853', color: '#000',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem'
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <span style={{ color: '#888', fontSize: '0.85rem' }}>{user.name}</span>
          <button onClick={handleLogout} style={{
            padding: '6px 14px', background: 'transparent',
            border: '1px solid #444', borderRadius: 8,
            color: '#888', cursor: 'pointer', fontSize: '0.8rem'
          }}>Logout</button>
        </div>
      </header>

      {tab === 'workout' && (
        <div className="main">
          <VideoFeed
            exercise={exercise}
            onStats={setStats}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
          />
          <Dashboard stats={stats} exercise={exercise} />
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
      {tab === 'planner' && (
        <div style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f' }}>
          <WorkoutPlanner />
        </div>
      )}
      {tab === 'analytics' && (
        <div style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f' }}>
          <Analytics />
        </div>
      )}
      {tab === 'chat' && (
        <div style={{ flex: 1, overflowY: 'auto', background: '#0f0f0f' }}>
          <AIChat />
        </div>
      )}
    </div>
  )
}

export default App

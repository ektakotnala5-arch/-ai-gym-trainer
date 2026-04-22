import { useState, useEffect } from 'react'
import Auth from './components/Auth'
import VideoFeed from './components/VideoFeed'
import Dashboard from './components/Dashboard'
import DietPlanner from './components/DietPlanner'
import HabitTracker from './components/HabitTracker'
import WorkoutPlanner from './components/WorkoutPlanner'
import Analytics from './components/Analytics'
import AIChat from './components/AIChat'
import './App.css'

export const EXERCISE_GROUPS = {
  Chest: [
    { value: "bench_press", label: "🏋️ Bench Press" },
    { value: "incline_bench_press", label: "🏋️ Incline Bench Press" },
    { value: "decline_bench_press", label: "🏋️ Decline Bench Press" },
    { value: "incline_db_press", label: "💪 Incline DB Press" },
    { value: "decline_db_press", label: "💪 Decline DB Press" },
    { value: "flat_db_press", label: "💪 Flat DB Press" },
    { value: "chest_fly", label: "🦋 Chest Fly" },
    { value: "incline_db_fly", label: "🦋 Incline DB Fly" },
    { value: "decline_db_fly", label: "🦋 Decline DB Fly" },
    { value: "cable_crossover", label: "🔀 Cable Crossover" },
    { value: "low_cable_fly", label: "🔀 Low Cable Fly" },
    { value: "high_cable_fly", label: "🔀 High Cable Fly" },
    { value: "pushup", label: "⬇️ Push Up" },
    { value: "wide_pushup", label: "⬇️ Wide Push Up" },
    { value: "diamond_pushup", label: "💎 Diamond Push Up" },
    { value: "decline_pushup", label: "⬇️ Decline Push Up" },
    { value: "incline_pushup", label: "⬆️ Incline Push Up" },
    { value: "dips", label: "🪑 Chest Dips" },
    { value: "pec_deck", label: "🦋 Pec Deck Machine" },
    { value: "svend_press", label: "🤲 Svend Press" },
  ],
  Back: [
    { value: "pullup", label: "⬆️ Pull Up" },
    { value: "chinup", label: "⬆️ Chin Up" },
    { value: "wide_pullup", label: "⬆️ Wide Grip Pull Up" },
    { value: "lat_pulldown", label: "⬇️ Lat Pulldown" },
    { value: "close_grip_pulldown", label: "⬇️ Close Grip Pulldown" },
    { value: "seated_cable_row", label: "🚣 Seated Cable Row" },
    { value: "one_arm_db_row", label: "💪 One Arm DB Row" },
    { value: "bent_over_row", label: "🏋️ Bent Over Row" },
    { value: "t_bar_row", label: "🏋️ T-Bar Row" },
    { value: "chest_supported_row", label: "🏋️ Chest Supported Row" },
    { value: "deadlift", label: "🏋️ Deadlift" },
    { value: "romanian_deadlift", label: "🏋️ Romanian Deadlift" },
    { value: "sumo_deadlift", label: "🏋️ Sumo Deadlift" },
    { value: "rack_pull", label: "🏋️ Rack Pull" },
    { value: "face_pull", label: "🤜 Face Pull" },
    { value: "barbell_shrug", label: "🤷 Barbell Shrug" },
    { value: "db_shrug", label: "🤷 DB Shrug" },
    { value: "straight_arm_pulldown", label: "⬇️ Straight Arm Pulldown" },
    { value: "hyperextension", label: "🔄 Hyperextension" },
    { value: "good_morning", label: "🌅 Good Morning" },
  ],
  Shoulders: [
    { value: "shoulder_press", label: "🏋️ Shoulder Press" },
    { value: "arnold_press", label: "💪 Arnold Press" },
    { value: "military_press", label: "🏋️ Military Press" },
    { value: "db_shoulder_press", label: "💪 DB Shoulder Press" },
    { value: "lateral_raise", label: "↔️ Lateral Raise" },
    { value: "cable_lateral_raise", label: "↔️ Cable Lateral Raise" },
    { value: "front_raise", label: "⬆️ Front Raise" },
    { value: "cable_front_raise", label: "⬆️ Cable Front Raise" },
    { value: "upright_row", label: "⬆️ Upright Row" },
    { value: "rear_delt_fly", label: "🦋 Rear Delt Fly" },
    { value: "cable_rear_delt_fly", label: "🦋 Cable Rear Delt Fly" },
    { value: "reverse_pec_deck", label: "🦋 Reverse Pec Deck" },
    { value: "landmine_press", label: "💪 Landmine Press" },
    { value: "push_press", label: "🏋️ Push Press" },
    { value: "behind_neck_press", label: "🏋️ Behind Neck Press" },
  ],
  Biceps: [
    { value: "bicep_curl", label: "💪 Bicep Curl" },
    { value: "barbell_curl", label: "🏋️ Barbell Curl" },
    { value: "hammer_curl", label: "🔨 Hammer Curl" },
    { value: "concentration_curl", label: "💪 Concentration Curl" },
    { value: "preacher_curl", label: "🙏 Preacher Curl" },
    { value: "cable_curl", label: "💪 Cable Curl" },
    { value: "incline_db_curl", label: "💪 Incline DB Curl" },
    { value: "spider_curl", label: "🕷️ Spider Curl" },
    { value: "reverse_curl", label: "🔄 Reverse Curl" },
    { value: "zottman_curl", label: "💪 Zottman Curl" },
    { value: "cross_body_curl", label: "💪 Cross Body Curl" },
    { value: "21s_curl", label: "💪 21s Curl" },
  ],
  Triceps: [
    { value: "tricep_extension", label: "💪 Tricep Extension" },
    { value: "skull_crusher", label: "💀 Skull Crusher" },
    { value: "tricep_pushdown", label: "⬇️ Tricep Pushdown" },
    { value: "rope_pushdown", label: "🪢 Rope Pushdown" },
    { value: "tricep_dip", label: "🪑 Tricep Dip" },
    { value: "close_grip_bench", label: "🏋️ Close Grip Bench" },
    { value: "overhead_tricep_extension", label: "💪 Overhead Extension" },
    { value: "cable_overhead_extension", label: "💪 Cable Overhead Ext" },
    { value: "kickback", label: "🦵 Tricep Kickback" },
    { value: "tate_press", label: "💪 Tate Press" },
    { value: "jm_press", label: "🏋️ JM Press" },
    { value: "bench_dip", label: "🪑 Bench Dip" },
  ],
  Legs: [
    { value: "squat", label: "🦵 Squat" },
    { value: "barbell_squat", label: "🏋️ Barbell Squat" },
    { value: "front_squat", label: "🏋️ Front Squat" },
    { value: "goblet_squat", label: "🏆 Goblet Squat" },
    { value: "hack_squat", label: "🏋️ Hack Squat" },
    { value: "sumo_squat", label: "🏋️ Sumo Squat" },
    { value: "bulgarian_split_squat", label: "🦵 Bulgarian Split Squat" },
    { value: "lunge", label: "🦵 Lunge" },
    { value: "walking_lunge", label: "🚶 Walking Lunge" },
    { value: "reverse_lunge", label: "🔄 Reverse Lunge" },
    { value: "leg_press", label: "🦵 Leg Press" },
    { value: "leg_extension", label: "🦵 Leg Extension" },
    { value: "leg_curl", label: "🦵 Leg Curl" },
    { value: "seated_leg_curl", label: "🦵 Seated Leg Curl" },
    { value: "hip_thrust", label: "🍑 Hip Thrust" },
    { value: "glute_bridge", label: "🍑 Glute Bridge" },
    { value: "calf_raise", label: "🦶 Calf Raise" },
    { value: "seated_calf_raise", label: "🦶 Seated Calf Raise" },
    { value: "wall_sit", label: "🧱 Wall Sit" },
    { value: "step_up", label: "⬆️ Step Up" },
    { value: "box_jump", label: "📦 Box Jump" },
    { value: "glute_kickback", label: "🍑 Glute Kickback" },
  ],
  Core: [
    { value: "plank", label: "🧘 Plank" },
    { value: "side_plank", label: "🧘 Side Plank" },
    { value: "crunch", label: "💪 Crunch" },
    { value: "situp", label: "🔄 Sit Up" },
    { value: "leg_raise", label: "🦵 Leg Raise" },
    { value: "hanging_leg_raise", label: "🦵 Hanging Leg Raise" },
    { value: "mountain_climber", label: "🧗 Mountain Climber" },
    { value: "bicycle_crunch", label: "🚴 Bicycle Crunch" },
    { value: "russian_twist", label: "🔄 Russian Twist" },
    { value: "cable_crunch", label: "💪 Cable Crunch" },
    { value: "ab_wheel_rollout", label: "🔄 Ab Wheel Rollout" },
    { value: "flutter_kick", label: "🦵 Flutter Kick" },
    { value: "dead_bug", label: "🐛 Dead Bug" },
    { value: "hollow_hold", label: "🧘 Hollow Hold" },
    { value: "v_up", label: "✌️ V-Up" },
    { value: "toe_touch", label: "👇 Toe Touch" },
  ],
  Cardio: [
    { value: "jumping_jack", label: "⭐ Jumping Jack" },
    { value: "burpee", label: "🔥 Burpee" },
    { value: "high_knees", label: "🏃 High Knees" },
    { value: "skipping", label: "🪢 Skipping" },
    { value: "jump_squat", label: "🦵 Jump Squat" },
    { value: "box_jump", label: "📦 Box Jump" },
    { value: "treadmill_run", label: "🏃 Treadmill Run" },
    { value: "cycling", label: "🚴 Cycling" },
    { value: "rowing_machine", label: "🚣 Rowing Machine" },
    { value: "stair_climber", label: "🪜 Stair Climber" },
    { value: "battle_ropes", label: "🪢 Battle Ropes" },
    { value: "sprint", label: "⚡ Sprint" },
  ],
  'Senior Friendly': [
    { value: "standing_march", label: "🚶 Standing March" },
    { value: "seated_leg_raise", label: "🪑 Seated Leg Raise" },
    { value: "arm_circle", label: "⭕ Arm Circle" },
    { value: "shoulder_roll", label: "🔄 Shoulder Roll" },
    { value: "seated_row_band", label: "🪢 Seated Band Row" },
    { value: "wall_pushup", label: "🧱 Wall Push Up" },
    { value: "chair_squat", label: "🪑 Chair Squat" },
    { value: "heel_raise", label: "🦶 Heel Raise" },
    { value: "seated_bicep_curl", label: "💪 Seated Bicep Curl" },
    { value: "side_leg_raise", label: "🦵 Side Leg Raise" },
  ],
  Yoga: [
    { value: "warrior_pose", label: "🧘 Warrior Pose" },
    { value: "downward_dog", label: "🐕 Downward Dog" },
    { value: "tree_pose", label: "🌳 Tree Pose" },
    { value: "cobra_pose", label: "🐍 Cobra Pose" },
    { value: "child_pose", label: "🧘 Child Pose" },
    { value: "sun_salutation", label: "☀️ Sun Salutation" },
    { value: "cat_cow", label: "🐄 Cat-Cow" },
    { value: "pigeon_pose", label: "🕊️ Pigeon Pose" },
    { value: "bridge_pose", label: "🌉 Bridge Pose" },
    { value: "boat_pose", label: "⛵ Boat Pose" },
  ],
}

// Flat list for compatibility
export const EXERCISES = Object.entries(EXERCISE_GROUPS).flatMap(([group, exs]) =>
  exs.map(ex => ({ ...ex, group }))
)

// Safe recordSession
const recordSession = (exercise, reps) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const key = 'gym_sessions'
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    const group = EXERCISES.find(e => e.value === exercise)?.group || 'Core'
    const idx = existing.findIndex(s => s.date === today && s.exercise === exercise)
    if (idx >= 0) {
      existing[idx].reps += reps
      existing[idx].sets += 1
    } else {
      existing.push({ date: today, exercise, reps, sets: 1, group })
    }
    localStorage.setItem(key, JSON.stringify(existing))
  } catch (e) {}
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('workout')
  const [stats, setStats] = useState({ reps: 0, stage: null, angle: 0, feedback: [] })
  const [exercise, setExercise] = useState('bicep_curl')
  const [isRunning, setIsRunning] = useState(false)
  const [lastSavedReps, setLastSavedReps] = useState(0)
  const [selectedGroup, setSelectedGroup] = useState('Biceps')

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (savedUser && token) setUser(JSON.parse(savedUser))
    setLoading(false)
    fetch('https://ai-gym-trainer-69ve.onrender.com/health').catch(() => {})
    const interval = setInterval(() => {
      fetch('https://ai-gym-trainer-69ve.onrender.com/health').catch(() => {})
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (stats.reps > lastSavedReps && stats.reps > 0) {
      recordSession(exercise, stats.reps - lastSavedReps)
      setLastSavedReps(stats.reps)
    }
  }, [stats.reps])

  useEffect(() => { setLastSavedReps(0) }, [exercise, isRunning])

  const handleLogin = (userData) => setUser(userData)
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setTab('workout')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00c853', fontSize: '1.2rem' }}>
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

  const groupColors = {
    Chest: '#f97316', Back: '#3b82f6', Shoulders: '#a855f7',
    Biceps: '#ec4899', Triceps: '#14b8a6', Legs: '#eab308',
    Core: '#00c853', Cardio: '#ef4444', 'Senior Friendly': '#64748b', Yoga: '#8b5cf6'
  }

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#00c853', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <span style={{ color: '#888', fontSize: '0.85rem' }}>{user.name}</span>
          <button onClick={handleLogout} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid #444', borderRadius: 8, color: '#888', cursor: 'pointer', fontSize: '0.8rem' }}>Logout</button>
        </div>
      </header>

      {tab === 'workout' && (
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Main workout area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="main">
              <VideoFeed exercise={exercise} onStats={setStats} isRunning={isRunning} setIsRunning={setIsRunning} />
              <Dashboard stats={stats} exercise={exercise} />
            </div>
          </div>

          {/* RIGHT SIDE - Exercise Selector Panel */}
          <div style={{
            width: 260, background: '#111', borderLeft: '1px solid #1e1e1e',
            overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8
          }}>
            <div style={{ color: '#666', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
              SELECT EXERCISE
            </div>

            {Object.entries(EXERCISE_GROUPS).map(([group, exs]) => (
              <div key={group}>
                {/* Group header - clickable */}
                <button
                  onClick={() => setSelectedGroup(selectedGroup === group ? null : group)}
                  style={{
                    width: '100%', padding: '10px 12px', border: 'none', borderRadius: 8,
                    background: selectedGroup === group ? groupColors[group] + '22' : '#1a1a1a',
                    color: selectedGroup === group ? groupColors[group] : '#aaa',
                    cursor: 'pointer', textAlign: 'left', fontWeight: 700,
                    fontSize: '0.82rem', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', borderLeft: selectedGroup === group ? `3px solid ${groupColors[group]}` : '3px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{group}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                    {selectedGroup === group ? '▲' : '▼'} {exs.length}
                  </span>
                </button>

                {/* Exercise list - shown when group is expanded */}
                {selectedGroup === group && (
                  <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {exs.map(ex => (
                      <button
                        key={ex.value}
                        onClick={() => { setExercise(ex.value); setIsRunning(false) }}
                        disabled={isRunning}
                        style={{
                          padding: '8px 12px 8px 20px', border: 'none', borderRadius: 6,
                          background: exercise === ex.value ? groupColors[group] : 'transparent',
                          color: exercise === ex.value ? '#000' : '#888',
                          cursor: isRunning ? 'not-allowed' : 'pointer',
                          textAlign: 'left', fontSize: '0.8rem', fontWeight: exercise === ex.value ? 700 : 400,
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={e => { if (exercise !== ex.value) e.target.style.background = '#2a2a2a'; e.target.style.color = '#fff' }}
                        onMouseLeave={e => { if (exercise !== ex.value) e.target.style.background = 'transparent'; e.target.style.color = exercise === ex.value ? '#000' : '#888' }}
                      >
                        {ex.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
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

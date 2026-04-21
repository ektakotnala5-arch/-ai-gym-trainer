import { useState } from 'react'

const GOALS = [
  { value: 'lose_weight', label: 'Lose Weight', icon: '🔥', color: '#ff6b35' },
  { value: 'build_muscle', label: 'Build Muscle', icon: '💪', color: '#00c853' },
  { value: 'improve_fitness', label: 'Improve Fitness', icon: '⚡', color: '#2196f3' },
  { value: 'maintain', label: 'Maintain', icon: '🎯', color: '#9c27b0' },
]

const LEVELS = [
  { value: 'beginner', label: 'Beginner', icon: '🌱', desc: '0-6 months' },
  { value: 'intermediate', label: 'Intermediate', icon: '⚡', desc: '6-24 months' },
  { value: 'advanced', label: 'Advanced', icon: '🔥', desc: '2+ years' },
]

const EQUIPMENT = [
  { value: 'gym', label: 'Full Gym', icon: '🏋️' },
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'minimal', label: 'Minimal', icon: '💪' },
]

const DAY_COLORS = {
  'Monday': '#00c853',
  'Tuesday': '#2196f3',
  'Wednesday': '#ff9800',
  'Thursday': '#e91e63',
  'Friday': '#9c27b0',
  'Saturday': '#00bcd4',
  'Sunday': '#ff5722',
}

// Static plan generator (no backend needed)
function generatePlan(goal, level, daysPerWeek, equipment) {
  const planTemplates = {
    build_muscle: {
      beginner: [
        { day: 'Monday', focus: 'Chest & Triceps', exercises: [
          { name: 'Bench Press', sets: 3, reps: '8-10' },
          { name: 'Incline DB Press', sets: 3, reps: '10-12' },
          { name: 'Push Ups', sets: 3, reps: '12-15' },
          { name: 'Tricep Pushdown', sets: 3, reps: '12-15' },
          { name: 'Overhead Extension', sets: 3, reps: '12-15' },
        ]},
        { day: 'Tuesday', focus: 'Back & Biceps', exercises: [
          { name: 'Pull Ups', sets: 3, reps: '6-8' },
          { name: 'Bent Over Row', sets: 3, reps: '8-10' },
          { name: 'Lat Pulldown', sets: 3, reps: '10-12' },
          { name: 'Bicep Curl', sets: 3, reps: '12-15' },
          { name: 'Hammer Curl', sets: 3, reps: '12-15' },
        ]},
        { day: 'Wednesday', focus: 'Rest & Recovery', rest: true, exercises: [] },
        { day: 'Thursday', focus: 'Shoulders', exercises: [
          { name: 'Shoulder Press', sets: 4, reps: '8-10' },
          { name: 'Lateral Raise', sets: 3, reps: '12-15' },
          { name: 'Front Raise', sets: 3, reps: '12-15' },
          { name: 'Face Pull', sets: 3, reps: '15-20' },
          { name: 'Rear Delt Fly', sets: 3, reps: '12-15' },
        ]},
        { day: 'Friday', focus: 'Legs', exercises: [
          { name: 'Squat', sets: 4, reps: '8-10' },
          { name: 'Leg Press', sets: 3, reps: '10-12' },
          { name: 'Leg Curl', sets: 3, reps: '12-15' },
          { name: 'Calf Raise', sets: 4, reps: '15-20' },
          { name: 'Hip Thrust', sets: 3, reps: '12-15' },
        ]},
        { day: 'Saturday', focus: 'Rest & Recovery', rest: true, exercises: [] },
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
    },
    lose_weight: {
      beginner: [
        { day: 'Monday', focus: 'Full Body + Cardio', exercises: [
          { name: 'Jumping Jacks', sets: 3, reps: '30 sec' },
          { name: 'Squat', sets: 3, reps: '15' },
          { name: 'Push Ups', sets: 3, reps: '10-12' },
          { name: 'Burpees', sets: 3, reps: '10' },
          { name: 'Mountain Climbers', sets: 3, reps: '30 sec' },
        ]},
        { day: 'Tuesday', focus: 'HIIT Cardio', exercises: [
          { name: 'High Knees', sets: 4, reps: '30 sec' },
          { name: 'Burpees', sets: 4, reps: '10' },
          { name: 'Jump Squat', sets: 3, reps: '15' },
          { name: 'Skipping', sets: 3, reps: '1 min' },
          { name: 'Box Jumps', sets: 3, reps: '10' },
        ]},
        { day: 'Wednesday', focus: 'Active Recovery', rest: true, exercises: [] },
        { day: 'Thursday', focus: 'Strength + Cardio', exercises: [
          { name: 'Deadlift', sets: 3, reps: '10' },
          { name: 'Lunge', sets: 3, reps: '12 each' },
          { name: 'Plank', sets: 3, reps: '45 sec' },
          { name: 'Russian Twist', sets: 3, reps: '20' },
          { name: 'Bicycle Crunch', sets: 3, reps: '20' },
        ]},
        { day: 'Friday', focus: 'Full Body Circuit', exercises: [
          { name: 'Squat to Press', sets: 3, reps: '12' },
          { name: 'Renegade Row', sets: 3, reps: '10' },
          { name: 'Walking Lunge', sets: 3, reps: '20 steps' },
          { name: 'Jump Rope', sets: 3, reps: '2 min' },
          { name: 'Plank', sets: 3, reps: '1 min' },
        ]},
        { day: 'Saturday', focus: 'Rest & Recovery', rest: true, exercises: [] },
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
    },
    improve_fitness: {
      beginner: [
        { day: 'Monday', focus: 'Upper Body', exercises: [
          { name: 'Push Ups', sets: 3, reps: '12-15' },
          { name: 'Dumbbell Row', sets: 3, reps: '12' },
          { name: 'Shoulder Press', sets: 3, reps: '12' },
          { name: 'Bicep Curl', sets: 3, reps: '12' },
          { name: 'Tricep Dips', sets: 3, reps: '12' },
        ]},
        { day: 'Tuesday', focus: 'Cardio', exercises: [
          { name: 'Jogging', sets: 1, reps: '20 min' },
          { name: 'High Knees', sets: 3, reps: '1 min' },
          { name: 'Jumping Jacks', sets: 3, reps: '1 min' },
          { name: 'Jump Rope', sets: 3, reps: '2 min' },
          { name: 'Burpees', sets: 3, reps: '10' },
        ]},
        { day: 'Wednesday', focus: 'Rest & Recovery', rest: true, exercises: [] },
        { day: 'Thursday', focus: 'Lower Body', exercises: [
          { name: 'Squat', sets: 4, reps: '12-15' },
          { name: 'Lunge', sets: 3, reps: '12 each' },
          { name: 'Hip Thrust', sets: 3, reps: '15' },
          { name: 'Leg Raise', sets: 3, reps: '15' },
          { name: 'Calf Raise', sets: 3, reps: '20' },
        ]},
        { day: 'Friday', focus: 'Core & Flexibility', exercises: [
          { name: 'Plank', sets: 3, reps: '1 min' },
          { name: 'Crunch', sets: 3, reps: '20' },
          { name: 'Russian Twist', sets: 3, reps: '20' },
          { name: 'Dead Bug', sets: 3, reps: '10 each' },
          { name: 'Bicycle Crunch', sets: 3, reps: '20' },
        ]},
        { day: 'Saturday', focus: 'Rest & Recovery', rest: true, exercises: [] },
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
    },
    maintain: {
      beginner: [
        { day: 'Monday', focus: 'Push Day', exercises: [
          { name: 'Bench Press', sets: 3, reps: '8-10' },
          { name: 'Shoulder Press', sets: 3, reps: '10' },
          { name: 'Tricep Pushdown', sets: 3, reps: '12' },
          { name: 'Lateral Raise', sets: 3, reps: '15' },
          { name: 'Push Ups', sets: 2, reps: '15' },
        ]},
        { day: 'Tuesday', focus: 'Pull Day', exercises: [
          { name: 'Pull Ups', sets: 3, reps: '8' },
          { name: 'Bent Over Row', sets: 3, reps: '10' },
          { name: 'Bicep Curl', sets: 3, reps: '12' },
          { name: 'Face Pull', sets: 3, reps: '15' },
          { name: 'Hammer Curl', sets: 2, reps: '12' },
        ]},
        { day: 'Wednesday', focus: 'Rest & Recovery', rest: true, exercises: [] },
        { day: 'Thursday', focus: 'Legs Day', exercises: [
          { name: 'Squat', sets: 4, reps: '8-10' },
          { name: 'Romanian Deadlift', sets: 3, reps: '10' },
          { name: 'Leg Press', sets: 3, reps: '12' },
          { name: 'Leg Curl', sets: 3, reps: '12' },
          { name: 'Calf Raise', sets: 4, reps: '20' },
        ]},
        { day: 'Friday', focus: 'Full Body', exercises: [
          { name: 'Deadlift', sets: 3, reps: '6-8' },
          { name: 'Bench Press', sets: 3, reps: '8' },
          { name: 'Pull Ups', sets: 3, reps: '8' },
          { name: 'Plank', sets: 3, reps: '1 min' },
          { name: 'Farmer Walk', sets: 3, reps: '40m' },
        ]},
        { day: 'Saturday', focus: 'Rest & Recovery', rest: true, exercises: [] },
        { day: 'Sunday', focus: 'Rest & Recovery', rest: true, exercises: [] },
      ],
    },
  }

  const goalPlan = planTemplates[goal] || planTemplates['build_muscle']
  const levelPlan = goalPlan[level] || goalPlan['beginner']
  return levelPlan.slice(0, daysPerWeek + (7 - daysPerWeek))
}

const TIPS = {
  lose_weight: [
    'Maintain a caloric deficit of 300-500 calories per day',
    'Aim for 150+ minutes of cardio per week',
    'Prioritize protein (1.6g per kg bodyweight) to preserve muscle',
    'Stay hydrated — drink 3+ liters of water daily',
    'Sleep 7-9 hours for optimal fat loss hormones',
  ],
  build_muscle: [
    'Eat in a caloric surplus of 200-300 calories per day',
    'Prioritize compound movements for maximum growth',
    'Progressive overload — add weight every 1-2 weeks',
    'Get 1.6-2.2g protein per kg bodyweight daily',
    'Rest 48-72 hours before training same muscle group',
  ],
  improve_fitness: [
    'Combine strength and cardio for best results',
    'Track your workouts to monitor progress',
    'Gradually increase intensity each week',
    'Focus on form before adding weight',
    'Consistency beats intensity every time',
  ],
  maintain: [
    'Keep calories at maintenance level',
    'Focus on strength retention with progressive overload',
    'Deload every 6-8 weeks to prevent burnout',
    'Mix up your routine every 8-12 weeks',
    'Sleep and recovery are as important as training',
  ],
}

export default function WorkoutPlanner() {
  const [form, setForm] = useState({
    fitness_level: 'beginner',
    goal: 'build_muscle',
    days_per_week: 5,
    equipment: 'gym'
  })
  const [plan, setPlan] = useState(null)
  const [activeDay, setActiveDay] = useState(0)
  const [generated, setGenerated] = useState(false)

  const selectedGoal = GOALS.find(g => g.value === form.goal)

  const handleGenerate = () => {
    const generatedPlan = generatePlan(form.goal, form.fitness_level, form.days_per_week, form.equipment)
    setPlan(generatedPlan)
    setActiveDay(0)
    setGenerated(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '0 0 60px 0' }}>

      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1f0f 0%, #0a0a0a 50%, #0f0f1f 100%)',
        padding: '40px 40px 32px',
        borderBottom: '1px solid #1a1a1a',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: `${selectedGoal?.color || '#00c853'}08`,
          border: `1px solid ${selectedGoal?.color || '#00c853'}15`
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: '2rem' }}>{selectedGoal?.icon}</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                AI Workout Planner
              </h1>
              <p style={{ color: '#555', margin: 0, fontSize: '0.85rem' }}>
                Personalized weekly training programs
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Config Panel */}
        <div style={{
          background: '#111', borderRadius: 20, padding: 28,
          border: '1px solid #1e1e1e', marginBottom: 32,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)'
        }}>
          <h3 style={{ color: '#666', fontSize: '0.75rem', letterSpacing: '2px', margin: '0 0 20px', textTransform: 'uppercase' }}>
            Configure Your Plan
          </h3>

          {/* Goal Selector */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '1px', display: 'block', marginBottom: 10, textTransform: 'uppercase' }}>
              Goal
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {GOALS.map(g => (
                <button
                  key={g.value}
                  onClick={() => setForm({ ...form, goal: g.value })}
                  style={{
                    padding: '10px 20px', borderRadius: 10, border: 'none',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                    background: form.goal === g.value ? g.color : '#1a1a1a',
                    color: form.goal === g.value ? '#000' : '#666',
                    transition: 'all 0.2s',
                    transform: form.goal === g.value ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: form.goal === g.value ? `0 4px 16px ${g.color}44` : 'none'
                  }}
                >
                  {g.icon} {g.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>

            {/* Level */}
            <div>
              <label style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '1px', display: 'block', marginBottom: 10, textTransform: 'uppercase' }}>
                Fitness Level
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {LEVELS.map(l => (
                  <button
                    key={l.value}
                    onClick={() => setForm({ ...form, fitness_level: l.value })}
                    style={{
                      padding: '10px 16px', borderRadius: 10, border: 'none',
                      cursor: 'pointer', textAlign: 'left',
                      background: form.fitness_level === l.value ? '#1e2e1e' : '#161616',
                      borderLeft: form.fitness_level === l.value ? '3px solid #00c853' : '3px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: form.fitness_level === l.value ? '#00c853' : '#555' }}>
                      {l.icon} {l.label}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#444', marginTop: 2 }}>{l.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '1px', display: 'block', marginBottom: 10, textTransform: 'uppercase' }}>
                Equipment
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {EQUIPMENT.map(e => (
                  <button
                    key={e.value}
                    onClick={() => setForm({ ...form, equipment: e.value })}
                    style={{
                      padding: '10px 16px', borderRadius: 10, border: 'none',
                      cursor: 'pointer', textAlign: 'left',
                      background: form.equipment === e.value ? '#1e2e1e' : '#161616',
                      borderLeft: form.equipment === e.value ? '3px solid #00c853' : '3px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: form.equipment === e.value ? '#00c853' : '#555' }}>
                      {e.icon} {e.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Days per week */}
            <div>
              <label style={{ color: '#555', fontSize: '0.75rem', letterSpacing: '1px', display: 'block', marginBottom: 10, textTransform: 'uppercase' }}>
                Days Per Week
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[2, 3, 4, 5, 6].map(d => (
                  <button
                    key={d}
                    onClick={() => setForm({ ...form, days_per_week: d })}
                    style={{
                      width: 44, height: 44, borderRadius: 10, border: 'none',
                      cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
                      background: form.days_per_week === d ? '#00c853' : '#1a1a1a',
                      color: form.days_per_week === d ? '#000' : '#555',
                      transition: 'all 0.2s',
                      boxShadow: form.days_per_week === d ? '0 4px 12px #00c85344' : 'none'
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p style={{ color: '#444', fontSize: '0.75rem', marginTop: 10 }}>
                {form.days_per_week} training days + {7 - form.days_per_week} rest days
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            style={{
              marginTop: 24, padding: '14px 40px',
              background: selectedGoal?.color || '#00c853',
              color: '#000', border: 'none', borderRadius: 12,
              fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              letterSpacing: '0.5px', transition: 'all 0.2s',
              boxShadow: `0 6px 20px ${selectedGoal?.color || '#00c853'}44`
            }}
          >
            ✨ Generate My {form.days_per_week}-Day Plan
          </button>
        </div>

        {/* Plan Output */}
        {plan && generated && (
          <div>
            {/* Week Overview Bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
              {plan.map((day, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  style={{
                    flex: '0 0 auto', padding: '10px 16px', borderRadius: 10,
                    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                    background: activeDay === i
                      ? (day.rest ? '#333' : DAY_COLORS[day.day] || '#00c853')
                      : '#111',
                    color: activeDay === i ? (day.rest ? '#fff' : '#000') : '#555',
                    fontWeight: 700, fontSize: '0.8rem',
                    borderBottom: activeDay !== i && !day.rest
                      ? `2px solid ${DAY_COLORS[day.day]}44`
                      : '2px solid transparent',
                    opacity: day.rest && activeDay !== i ? 0.5 : 1
                  }}
                >
                  <div>{day.day.slice(0, 3).toUpperCase()}</div>
                  <div style={{ fontSize: '0.65rem', marginTop: 2, fontWeight: 400 }}>
                    {day.rest ? 'REST' : day.focus.split(' ')[0].toUpperCase()}
                  </div>
                </button>
              ))}
            </div>

            {/* Active Day Detail */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>

              {/* Exercises */}
              <div style={{
                background: '#111', borderRadius: 20, overflow: 'hidden',
                border: '1px solid #1e1e1e'
              }}>
                {/* Day Header */}
                <div style={{
                  padding: '20px 24px',
                  background: plan[activeDay].rest
                    ? '#161616'
                    : `linear-gradient(135deg, ${DAY_COLORS[plan[activeDay].day]}15, transparent)`,
                  borderBottom: '1px solid #1a1a1a',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                      {plan[activeDay].day}
                    </h3>
                    <span style={{
                      color: plan[activeDay].rest ? '#555' : DAY_COLORS[plan[activeDay].day],
                      fontSize: '0.85rem'
                    }}>
                      {plan[activeDay].focus}
                    </span>
                  </div>
                  {!plan[activeDay].rest && (
                    <div style={{
                      background: `${DAY_COLORS[plan[activeDay].day]}22`,
                      color: DAY_COLORS[plan[activeDay].day],
                      padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600
                    }}>
                      {plan[activeDay].exercises.length} exercises
                    </div>
                  )}
                </div>

                {plan[activeDay].rest ? (
                  <div style={{ padding: 40, textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>😴</div>
                    <h3 style={{ color: '#555', margin: 0 }}>Rest & Recovery Day</h3>
                    <p style={{ color: '#333', fontSize: '0.85rem', marginTop: 8 }}>
                      Allow your muscles to recover. Light walking or stretching is fine.
                    </p>
                  </div>
                ) : (
                  <div style={{ padding: '8px 0' }}>
                    {plan[activeDay].exercises.map((ex, j) => (
                      <div key={j} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 24px',
                        borderBottom: j < plan[activeDay].exercises.length - 1 ? '1px solid #161616' : 'none',
                        transition: 'background 0.15s'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: `${DAY_COLORS[plan[activeDay].day]}22`,
                            color: DAY_COLORS[plan[activeDay].day],
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                          }}>
                            {j + 1}
                          </div>
                          <span style={{ color: '#ddd', fontSize: '0.95rem', fontWeight: 500 }}>
                            {ex.name}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <span style={{
                            background: '#1a1a1a', color: '#888',
                            padding: '4px 10px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600
                          }}>
                            {ex.sets} sets
                          </span>
                          <span style={{
                            background: `${DAY_COLORS[plan[activeDay].day]}18`,
                            color: DAY_COLORS[plan[activeDay].day],
                            padding: '4px 10px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600
                          }}>
                            {ex.reps} reps
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Panel — Tips & Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Summary Card */}
                <div style={{
                  background: '#111', borderRadius: 16, padding: 20,
                  border: '1px solid #1e1e1e'
                }}>
                  <h4 style={{ color: '#555', fontSize: '0.7rem', letterSpacing: '1.5px', margin: '0 0 16px', textTransform: 'uppercase' }}>
                    Week Summary
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { label: 'Training Days', value: form.days_per_week, color: '#00c853' },
                      { label: 'Rest Days', value: 7 - form.days_per_week, color: '#666' },
                      { label: 'Total Exercises', value: plan.reduce((a, d) => a + (d.exercises?.length || 0), 0), color: '#2196f3' },
                      { label: 'Total Sets', value: plan.reduce((a, d) => a + (d.exercises?.reduce((b, e) => b + e.sets, 0) || 0), 0), color: '#ff9800' },
                    ].map((s, i) => (
                      <div key={i} style={{
                        background: '#161616', borderRadius: 10,
                        padding: '12px 14px', textAlign: 'center'
                      }}>
                        <div style={{ color: s.color, fontSize: '1.4rem', fontWeight: 800 }}>{s.value}</div>
                        <div style={{ color: '#444', fontSize: '0.7rem', marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div style={{
                  background: '#111', borderRadius: 16, padding: 20,
                  border: '1px solid #1e1e1e', flex: 1
                }}>
                  <h4 style={{ color: '#555', fontSize: '0.7rem', letterSpacing: '1.5px', margin: '0 0 14px', textTransform: 'uppercase' }}>
                    💡 Pro Tips
                  </h4>
                  {(TIPS[form.goal] || TIPS['build_muscle']).map((tip, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 10, alignItems: 'flex-start',
                      marginBottom: 12, paddingBottom: 12,
                      borderBottom: i < 4 ? '1px solid #161616' : 'none'
                    }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: selectedGoal?.color || '#00c853',
                        flexShrink: 0, marginTop: 6
                      }} />
                      <span style={{ color: '#666', fontSize: '0.8rem', lineHeight: 1.5 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

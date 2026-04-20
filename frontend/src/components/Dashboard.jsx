import { useState, useEffect, useRef } from 'react'

const EXERCISE_TIPS = {
  bicep_curl: "Keep elbows pinned to sides. No swinging.",
  squat: "Break parallel. Knees track toes. Chest up.",
  pushup: "Full ROM. Body straight as a plank.",
  deadlift: "Neutral spine. Drive through heels.",
  bench_press: "Shoulder blades retracted. Feet flat.",
  lunge: "Front knee behind toes. Back knee toward floor.",
  plank: "Hips level. Breathe steady. Hold.",
  shoulder_press: "Press straight up. Brace core.",
  lat_pulldown: "Lean slightly back. Pull to upper chest.",
  default: "Focus on form. Control every rep.",
}

function AnimatedNumber({ value, color }) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)

  useEffect(() => {
    if (value !== prevRef.current) {
      prevRef.current = value
      setDisplay(value)
    }
  }, [value])

  return (
    <span style={{
      fontSize: '4.5rem', fontWeight: 900, color,
      fontVariantNumeric: 'tabular-nums',
      textShadow: `0 0 30px ${color}66`,
      transition: 'all 0.2s',
      display: 'block', lineHeight: 1,
    }}>
      {display ?? '0'}
    </span>
  )
}

function AngleArc({ angle }) {
  const r = 54
  const cx = 70, cy = 70
  const startAngle = -220
  const sweepAngle = 260
  const norm = Math.min(Math.max((angle || 0) / 180, 0), 1)
  const arcAngle = startAngle + sweepAngle * norm
  const toRad = (d) => (d * Math.PI) / 180
  const x = cx + r * Math.cos(toRad(arcAngle))
  const y = cy + r * Math.sin(toRad(arcAngle))
  const largeArc = sweepAngle * norm > 180 ? 1 : 0

  const describeArc = (start, sweep) => {
    const ex = cx + r * Math.cos(toRad(start + sweep))
    const ey = cy + r * Math.sin(toRad(start + sweep))
    return `M ${cx + r * Math.cos(toRad(start))} ${cy + r * Math.sin(toRad(start))} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${ex} ${ey}`
  }

  const color = angle > 120 ? '#ff9800' : angle > 60 ? '#00c853' : '#2196f3'

  return (
    <svg width={140} height={140} style={{ overflow: 'visible' }}>
      {/* Track */}
      <path d={describeArc(startAngle, sweepAngle)} fill="none" stroke="#1e1e1e" strokeWidth={10} strokeLinecap="round" />
      {/* Fill */}
      {angle > 0 && (
        <path d={describeArc(startAngle, sweepAngle * norm)} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }} />
      )}
      {/* Dot */}
      <circle cx={x} cy={y} r={7} fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
      {/* Label */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill={color} fontSize={22} fontWeight={800}>
        {angle || 0}°
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#444" fontSize={10} letterSpacing={1}>ANGLE</text>
    </svg>
  )
}

export default function Dashboard({ stats, exercise }) {
  const { reps, stage, angle, feedback } = stats
  const tip = EXERCISE_TIPS[exercise] || EXERCISE_TIPS.default
  const exerciseLabel = exercise.replace(/_/g, ' ').toUpperCase()
  const isGoodForm = !feedback || feedback.length === 0

  return (
    <div style={{
      width: 300, background: '#0d0d0d',
      display: 'flex', flexDirection: 'column',
      borderLeft: '1px solid #1a1a1a',
      fontFamily: "'Segoe UI', sans-serif",
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes repPop { 0%{transform:scale(1.4)} 100%{transform:scale(1)} }
        @keyframes formSlide { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
        .stat-card { transition: background 0.3s; }
        .stat-card:hover { background: #1e1e1e !important; }
      `}</style>

      {/* Exercise Header */}
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #0d1a12, #0d1520)',
        borderBottom: '1px solid #1a1a1a',
      }}>
        <div style={{ fontSize: '0.65rem', color: '#00c853', letterSpacing: 2, fontWeight: 700, marginBottom: 4 }}>
          NOW TRACKING
        </div>
        <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 800, letterSpacing: 1 }}>
          {exerciseLabel}
        </div>
      </div>

      {/* Reps Counter */}
      <div className="stat-card" style={{
        padding: '20px', background: '#111',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: 2, fontWeight: 700, marginBottom: 4 }}>REPS</div>
          <AnimatedNumber value={reps} color="#00c853" />
        </div>

        {/* Stage badge */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
        }}>
          <div style={{
            padding: '6px 16px', borderRadius: 20, fontWeight: 800, fontSize: '0.75rem',
            letterSpacing: 1, textTransform: 'uppercase',
            background: stage === 'up' ? 'rgba(0,200,83,0.15)' : 'rgba(33,150,243,0.15)',
            color: stage === 'up' ? '#00c853' : '#2196f3',
            border: `1px solid ${stage === 'up' ? '#00c85344' : '#2196f344'}`,
            minWidth: 70, textAlign: 'center',
            boxShadow: stage === 'up' ? '0 0 12px rgba(0,200,83,0.2)' : '0 0 12px rgba(33,150,243,0.2)',
          }}>
            {stage ? stage.toUpperCase() : '—'}
          </div>
          <div style={{ fontSize: '0.6rem', color: '#333', letterSpacing: 1 }}>STAGE</div>
        </div>
      </div>

      {/* Angle Arc */}
      <div className="stat-card" style={{
        padding: '20px', background: '#111',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <AngleArc angle={angle || 0} />
      </div>

      {/* Form Feedback */}
      <div style={{
        flex: 1, padding: '16px 20px', background: '#0d0d0d',
        borderBottom: '1px solid #1a1a1a', overflowY: 'auto',
      }}>
        <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>
          FORM CHECK
        </div>

        {isGoodForm ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 10,
            background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.2)',
            animation: 'formSlide 0.3s ease',
          }}>
            <div style={{ fontSize: '1.2rem' }}>✓</div>
            <div style={{ color: '#00c853', fontSize: '0.82rem', fontWeight: 600 }}>Perfect form — keep it up!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {feedback.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(255,87,34,0.08)', border: '1px solid rgba(255,87,34,0.2)',
                animation: 'formSlide 0.3s ease',
                animationDelay: `${i * 0.05}s`,
              }}>
                <div style={{ fontSize: '0.9rem', marginTop: 1 }}>⚠</div>
                <div style={{ color: '#ff7043', fontSize: '0.8rem', lineHeight: 1.5 }}>{f}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pro Tip */}
      <div style={{
        padding: '14px 20px',
        background: 'linear-gradient(135deg, #0a1a12, #0a1420)',
        borderTop: '1px solid #1a2a1a',
      }}>
        <div style={{ fontSize: '0.6rem', color: '#00c853', letterSpacing: 2, fontWeight: 700, marginBottom: 5 }}>
          PRO TIP
        </div>
        <div style={{ fontSize: '0.78rem', color: '#888', lineHeight: 1.6 }}>{tip}</div>
      </div>
    </div>
  )
}

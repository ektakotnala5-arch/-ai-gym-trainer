import { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'https://ai-gym-trainer-69ve.onrender.com'

export default function Dietician() {
  const [form, setForm] = useState({
    age: '', weight: '', height: '', gender: 'male',
    goal: 'lose_weight', activity: 'moderate',
    dietary_pref: 'vegetarian', lifestyle: 'general', allergies: []
  })
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('meals')

  const allergyOptions = ['gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish', 'fish']

  const toggleAllergy = (a) => {
    setForm(f => ({
      ...f,
      allergies: f.allergies.includes(a) ? f.allergies.filter(x => x !== a) : [...f.allergies, a]
    }))
  }

  const generate = async () => {
    if (!form.age || !form.weight || !form.height) {
      setError('Please fill age, weight and height!')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(`${API}/diet/plan`, {
        ...form,
        age: parseInt(form.age),
        weight: parseFloat(form.weight),
        height: parseFloat(form.height)
      })
      setPlan(res.data)
    } catch (err) {
      setError('Error fetching plan. Please try again.')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: '#111', border: '1px solid #333',
    borderRadius: 8, color: '#fff', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box'
  }

  const selectStyle = { ...inputStyle }

  const labelStyle = {
    color: '#888', fontSize: '0.8rem', marginBottom: 4, display: 'block'
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto', color: '#fff' }}>
      <h2 style={{ color: '#00c853', marginBottom: 4 }}>🥗 AI Diet Planner</h2>
      <p style={{ color: '#555', marginBottom: 24 }}>Get a personalized diet plan based on your body and goals</p>

      {/* Form */}
      <div style={{
        background: '#141414', border: '1px solid #222',
        borderRadius: 16, padding: 24, marginBottom: 24
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Age</label>
            <input style={inputStyle} type="number" placeholder="e.g. 22"
              value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Weight (kg)</label>
            <input style={inputStyle} type="number" placeholder="e.g. 70"
              value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Height (cm)</label>
            <input style={inputStyle} type="number" placeholder="e.g. 175"
              value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Gender</label>
            <select style={selectStyle} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Goal</label>
            <select style={selectStyle} value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })}>
              <option value="lose_weight">Lose Weight</option>
              <option value="gain_muscle">Gain Muscle</option>
              <option value="maintain">Maintain Weight</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Activity Level</label>
            <select style={selectStyle} value={form.activity} onChange={e => setForm({ ...form, activity: e.target.value })}>
              <option value="sedentary">Sedentary (no exercise)</option>
              <option value="light">Light (1-2 days/week)</option>
              <option value="moderate">Moderate (3-4 days/week)</option>
              <option value="active">Active (5-6 days/week)</option>
              <option value="very_active">Very Active (daily intense)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Dietary Preference</label>
            <select style={selectStyle} value={form.dietary_pref} onChange={e => setForm({ ...form, dietary_pref: e.target.value })}>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="non_vegetarian">Non-Vegetarian</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Lifestyle</label>
            <select style={selectStyle} value={form.lifestyle} onChange={e => setForm({ ...form, lifestyle: e.target.value })}>
              <option value="general">General</option>
              <option value="student">Student</option>
              <option value="office">Office Worker</option>
              <option value="athlete">Athlete</option>
            </select>
          </div>
        </div>

        {/* Allergies */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Allergies (select all that apply)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {allergyOptions.map(a => (
              <button key={a} onClick={() => toggleAllergy(a)} style={{
                padding: '6px 14px', borderRadius: 20,
                border: `1px solid ${form.allergies.includes(a) ? '#00c853' : '#333'}`,
                background: form.allergies.includes(a) ? '#00c85322' : 'transparent',
                color: form.allergies.includes(a) ? '#00c853' : '#555',
                cursor: 'pointer', fontSize: '0.85rem', textTransform: 'capitalize'
              }}>{a}</button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', background: '#1a0000',
            border: '1px solid #cc0000', borderRadius: 8,
            color: '#ff4444', fontSize: '0.85rem', marginBottom: 12
          }}>{error}</div>
        )}

        <button onClick={generate} disabled={loading} style={{
          width: '100%', padding: 14,
          background: loading ? '#333' : '#00c853',
          color: loading ? '#666' : '#000',
          border: 'none', borderRadius: 10,
          fontWeight: 800, fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? '⏳ Generating your plan...' : '🚀 Generate My Diet Plan'}
        </button>
      </div>

      {/* Results */}
      {plan && (
        <div>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Daily Calories', value: `${plan.daily_calories} kcal`, color: '#00c853' },
              { label: 'Protein', value: `${plan.protein_g}g`, color: '#2196f3' },
              { label: 'Carbs', value: `${plan.carbs_g}g`, color: '#ff9800' },
              { label: 'Fats', value: `${plan.fats_g}g`, color: '#e91e63' },
            ].map(s => (
              <div key={s.label} style={{
                background: '#141414', border: `1px solid ${s.color}33`,
                borderRadius: 12, padding: 16, textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ color: '#666', fontSize: '0.8rem', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* BMI + Water */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 12, padding: 16 }}>
              <div style={{ color: '#888', fontSize: '0.8rem' }}>BMI</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>{plan.bmi}</div>
              <div style={{
                display: 'inline-block', padding: '2px 10px', borderRadius: 20,
                background: plan.bmi_category === 'Normal' ? '#00c85322' : '#ff980022',
                color: plan.bmi_category === 'Normal' ? '#00c853' : '#ff9800',
                fontSize: '0.8rem', marginTop: 4
              }}>{plan.bmi_category}</div>
            </div>
            <div style={{ background: '#141414', border: '1px solid #222', borderRadius: 12, padding: 16 }}>
              <div style={{ color: '#888', fontSize: '0.8rem' }}>Daily Water Intake</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2196f3' }}>{plan.water_intake_litres}L</div>
              <div style={{ color: '#555', fontSize: '0.8rem', marginTop: 4 }}>{plan.meal_timing}</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['meals', 'grocery', 'tips'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                padding: '8px 20px', borderRadius: 8, border: 'none',
                background: activeTab === t ? '#00c853' : '#1a1a1a',
                color: activeTab === t ? '#000' : '#555',
                fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
              }}>{t === 'meals' ? '🍽️ Meal Plan' : t === 'grocery' ? '🛒 Grocery' : '💡 Tips'}</button>
            ))}
          </div>

          {/* Meals Tab */}
          {activeTab === 'meals' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plan.meals.map((meal, i) => (
                <div key={i} style={{
                  background: '#141414', border: '1px solid #222',
                  borderRadius: 12, padding: 16,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ color: '#00c853', fontSize: '0.8rem', marginBottom: 2 }}>{meal.time} — {meal.meal}</div>
                    <div style={{ color: '#fff', fontSize: '0.95rem' }}>{meal.name}</div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: 90 }}>
                    <div style={{ color: '#ff9800', fontWeight: 700 }}>{meal.calories} kcal</div>
                    <div style={{ color: '#2196f3', fontSize: '0.8rem' }}>{meal.protein}g protein</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grocery Tab */}
          {activeTab === 'grocery' && (
            <div style={{
              background: '#141414', border: '1px solid #222',
              borderRadius: 12, padding: 20
            }}>
              <h3 style={{ color: '#00c853', marginBottom: 16 }}>🛒 Your Grocery List</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {plan.grocery_list.map((item, i) => (
                  <div key={i} style={{
                    padding: '8px 12px', background: '#1a1a1a',
                    borderRadius: 8, color: '#ccc', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    <span style={{ color: '#00c853' }}>✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips Tab */}
          {activeTab === 'tips' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plan.tips.map((tip, i) => (
                <div key={i} style={{
                  background: '#141414', border: '1px solid #222',
                  borderRadius: 12, padding: 14,
                  display: 'flex', gap: 12, alignItems: 'flex-start'
                }}>
                  <span style={{ color: '#00c853', fontSize: '1.1rem', marginTop: 1 }}>💡</span>
                  <span style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: 1.5 }}>{tip}</span>
                </div>
              ))}
            </div>
          )}

          {plan.allergy_note && (
            <div style={{
              marginTop: 16, padding: 12, background: '#1a1000',
              border: '1px solid #ff9800', borderRadius: 8,
              color: '#ff9800', fontSize: '0.85rem'
            }}>⚠️ {plan.allergy_note}</div>
          )}
        </div>
      )}
    </div>
  )
}
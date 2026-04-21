import { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'https://ai-gym-trainer-69ve.onrender.com'

const ALLERGIES = [
  { value: 'gluten', label: '🌾 Gluten' },
  { value: 'dairy', label: '🥛 Dairy' },
  { value: 'nuts', label: '🥜 Nuts' },
  { value: 'eggs', label: '🥚 Eggs' },
  { value: 'soy', label: '🫘 Soy' },
  { value: 'fish', label: '🐟 Fish' },
  { value: 'shellfish', label: '🦐 Shellfish' },
]

export default function DietPlanner() {
  const [form, setForm] = useState({
    age: '', weight: '', height: '', gender: 'male',
    goal: 'lose_weight', activity: 'moderate',
    dietary_pref: 'vegetarian', lifestyle: 'general'
  })
  const [allergies, setAllergies] = useState([])
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const toggleAllergy = (val) => {
    setAllergies(prev =>
      prev.includes(val) ? prev.filter(a => a !== val) : [...prev, val]
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${API}/diet/plan`, {
        ...form,
        age: parseInt(form.age),
        weight: parseFloat(form.weight),
        height: parseFloat(form.height),
        allergies
      })
      setPlan(res.data)
    } catch (err) {
      alert('Error fetching plan. Is backend running?')
    }
    setLoading(false)
  }

  const inputStyle = {
    padding: '10px', background: '#2a2a2a', color: '#fff',
    border: '1px solid #444', borderRadius: '8px',
    fontSize: '0.95rem', width: '100%'
  }
  const labelStyle = { fontSize: '0.8rem', color: '#888', marginBottom: 4 }

  const getBMIColor = (cat) => ({
    Normal: '#00c853', Underweight: '#2196f3',
    Overweight: '#ff9800', Obese: '#e53935'
  }[cat] || '#fff')

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 6, color: '#00c853' }}>🥗 AI Diet Planner</h2>
      <p style={{ color: '#888', marginBottom: 24, fontSize: '0.9rem' }}>
        Personalised world-class plans for all ages, lifestyles and dietary needs
      </p>

      <div style={{ background: '#2a2a2a', borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <h3 style={{ color: '#2196f3', marginBottom: 16 }}>Your Profile</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
          {[
            { label: 'Age', name: 'age', placeholder: '25' },
            { label: 'Weight (kg)', name: 'weight', placeholder: '70' },
            { label: 'Height (cm)', name: 'height', placeholder: '175' },
          ].map(f => (
            <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={labelStyle}>{f.label}</span>
              <input type="number" name={f.name} placeholder={f.placeholder}
                value={form[f.name]} onChange={handleChange} style={inputStyle} />
            </div>
          ))}

          {[
            { label: 'Gender', name: 'gender', options: [['male','👨 Male'],['female','👩 Female']] },
            { label: 'Goal', name: 'goal', options: [['lose_weight','🔥 Lose Weight'],['gain_muscle','💪 Gain Muscle'],['maintain','⚖️ Maintain']] },
            { label: 'Activity', name: 'activity', options: [['sedentary','🪑 Sedentary'],['light','🚶 Light'],['moderate','🏃 Moderate'],['active','💪 Active'],['very_active','🔥 Very Active']] },
            { label: 'Diet Type', name: 'dietary_pref', options: [['vegetarian','🥦 Vegetarian'],['vegan','🌱 Vegan'],['non_vegetarian','🍗 Non Vegetarian']] },
            { label: 'Lifestyle', name: 'lifestyle', options: [['general','🧑 General'],['athlete','🏅 Athlete'],['office','💼 Office Worker'],['student','📚 Student']] },
          ].map(f => (
            <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={labelStyle}>{f.label}</span>
              <select name={f.name} value={form[f.name]} onChange={handleChange} style={inputStyle}>
                {f.options.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 8, marginBottom: 20 }}>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 10 }}>
            🚨 Allergies / Intolerances (select all that apply)
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {ALLERGIES.map(a => (
              <div key={a.value}
                onClick={() => toggleAllergy(a.value)}
                style={{
                  padding: '8px 16px', borderRadius: 20, cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: 600,
                  background: allergies.includes(a.value) ? '#e53935' : '#1a1a1a',
                  color: allergies.includes(a.value) ? '#fff' : '#888',
                  border: `1px solid ${allergies.includes(a.value) ? '#e53935' : '#444'}`,
                  transition: 'all 0.2s'
                }}>
                {a.label}
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{
          padding: '12px 32px', background: '#00c853', color: '#000',
          border: 'none', borderRadius: 10, fontSize: '1rem',
          fontWeight: 700, cursor: 'pointer'
        }}>
          {loading ? '⏳ Generating...' : '🚀 Generate My Diet Plan'}
        </button>
      </div>

      {plan && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            background: '#1a1a2e', borderRadius: 12, padding: 20,
            textAlign: 'center', border: '1px solid #00c853'
          }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00c853' }}>{plan.diet_type}</div>
            <div style={{ fontSize: '0.85rem', color: '#888', marginTop: 4 }}>{plan.meal_timing}</div>
            <div style={{ fontSize: '0.8rem', color: '#2196f3', marginTop: 4 }}>
              Age Group: {plan.age_group.charAt(0).toUpperCase() + plan.age_group.slice(1)}
            </div>
          </div>

          {plan.allergy_note && (
            <div style={{ background: '#2a1a1a', borderRadius: 12, padding: 16, border: '1px solid #e53935' }}>
              <div style={{ color: '#ff5722', fontSize: '0.9rem' }}>⚠️ {plan.allergy_note}</div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {[
              { label: 'BMI', value: plan.bmi, sub: plan.bmi_category, color: getBMIColor(plan.bmi_category) },
              { label: 'Calories', value: plan.daily_calories, sub: 'kcal/day', color: '#ff9800' },
              { label: 'Protein', value: plan.protein_g + 'g', sub: '/day', color: '#00c853' },
              { label: 'Carbs', value: plan.carbs_g + 'g', sub: '/day', color: '#2196f3' },
              { label: 'Fats', value: plan.fats_g + 'g', sub: '/day', color: '#e91e63' },
              { label: 'Water', value: plan.water_intake_litres + 'L', sub: '/day', color: '#00bcd4' },
            ].map(s => (
              <div key={s.label} style={{ background: '#2a2a2a', borderRadius: 12, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#888' }}>{s.label}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.65rem', color: '#666' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#2a2a2a', borderRadius: 12, padding: 20 }}>
            <h3 style={{ marginBottom: 16, color: '#ff9800' }}>🍽️ Daily Meal Plan</h3>
            {plan.meals.map((meal, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                padding: '14px 0',
                borderBottom: i < plan.meals.length - 1 ? '1px solid #333' : 'none'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>{meal.time} — {meal.meal}</div>
                  <div style={{ fontSize: '0.95rem', color: '#fff', marginTop: 2 }}>{meal.name}</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div style={{ color: '#ff9800', fontWeight: 600 }}>{meal.calories} kcal</div>
                  <div style={{ color: '#00c853', fontSize: '0.8rem' }}>{meal.protein}g protein</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: '#2a2a2a', borderRadius: 12, padding: 20 }}>
              <h3 style={{ marginBottom: 14, color: '#2196f3' }}>🛒 Grocery List</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {plan.grocery_list.map((item, i) => (
                  <div key={i} style={{
                    padding: '6px 12px', background: '#1a1a1a',
                    borderRadius: 20, fontSize: '0.82rem', color: '#ccc',
                    border: '1px solid #333'
                  }}>✓ {item}</div>
                ))}
              </div>
            </div>
            <div style={{ background: '#2a2a2a', borderRadius: 12, padding: 20, overflowY: 'auto', maxHeight: 500 }}>
              <h3 style={{ marginBottom: 12, color: '#e91e63' }}>💡 Expert Tips</h3>
              {plan.tips.map((tip, i) => (
                <div key={i} style={{
                  padding: '8px 0',
                  borderBottom: i < plan.tips.length - 1 ? '1px solid #333' : 'none',
                  fontSize: '0.85rem', color: '#ccc', lineHeight: 1.6
                }}>{tip}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
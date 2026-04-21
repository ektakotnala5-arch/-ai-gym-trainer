import { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'https://ai-gym-trainer-69ve.onrender.com'

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        const res = await axios.post(`${API}/auth/register`, form)
        localStorage.setItem('token', res.data.access_token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        onLogin(res.data.user)
      } else {
        const params = new URLSearchParams()
        params.append('username', form.email)
        params.append('password', form.password)
        const res = await axios.post(`${API}/auth/login`, params)
        localStorage.setItem('token', res.data.access_token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        onLogin(res.data.user)
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: '#111', border: '1px solid #333',
    borderRadius: 10, color: '#fff',
    fontSize: '0.95rem', outline: 'none',
    boxSizing: 'border-box', marginBottom: 12,
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#141414', border: '1px solid #222',
        borderRadius: 20, padding: 40, width: '100%', maxWidth: 420,
        boxShadow: '0 0 40px #00c85311'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏋️</div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>
            AI Gym Trainer
          </h1>
          <p style={{ color: '#555', margin: '6px 0 0', fontSize: '0.85rem' }}>
            {mode === 'login' ? 'Welcome back! Login to continue' : 'Create your account to get started'}
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex', background: '#0a0a0a',
          borderRadius: 10, padding: 4, marginBottom: 24
        }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }} style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: 8,
              background: mode === m ? '#00c853' : 'transparent',
              color: mode === m ? '#000' : '#555',
              fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
              transition: 'all 0.2s', textTransform: 'capitalize'
            }}>{m}</button>
          ))}
        </div>

        {/* Fields */}
        {mode === 'register' && (
          <input
            name="name" placeholder="Full Name" value={form.name}
            onChange={handle} style={inputStyle}
          />
        )}
        <input
          name="email" placeholder="Email Address" value={form.email}
          onChange={handle} type="email" style={inputStyle}
        />
        <input
          name="password" placeholder="Password" value={form.password}
          onChange={handle} type="password"
          onKeyDown={e => e.key === 'Enter' && submit()}
          style={{ ...inputStyle, marginBottom: 0 }}
        />

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 10, padding: '10px 14px',
            background: '#1a0000', border: '1px solid #cc0000',
            borderRadius: 8, color: '#ff4444', fontSize: '0.85rem'
          }}>{error}</div>
        )}

        {/* Submit */}
        <button onClick={submit} disabled={loading} style={{
          width: '100%', padding: '14px', marginTop: 16,
          background: loading ? '#333' : '#00c853',
          color: loading ? '#666' : '#000',
          border: 'none', borderRadius: 10,
          fontWeight: 800, fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}>
          {loading ? 'Please wait...' : mode === 'login' ? '🚀 Login' : '✨ Create Account'}
        </button>

        {/* Switch mode */}
        <p style={{ textAlign: 'center', marginTop: 20, color: '#555', fontSize: '0.85rem' }}>
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            style={{ color: '#00c853', cursor: 'pointer', fontWeight: 600 }}>
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  )
}
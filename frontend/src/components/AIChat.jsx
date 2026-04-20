import { useState, useRef, useEffect } from 'react'

const suggestions = [
  "Give me a chest workout plan 💪",
  "What should I eat to build muscle? 🥩",
  "How do I lose belly fat? 🔥",
  "Best exercises for beginners 🌱",
  "How many rest days do I need? 😴",
]

const renderMarkdown = (text) => {
  return text
    .replace(/### (.*)/g, '<h3 style="margin:8px 0 4px;color:#00c853">$1</h3>')
    .replace(/## (.*)/g, '<h2 style="margin:8px 0 4px;color:#00c853">$1</h2>')
    .replace(/# (.*)/g, '<h1 style="margin:8px 0 4px;color:#00c853">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:#333;padding:2px 6px;borderRadius:4px;fontFamily:monospace">$1</code>')
    .replace(/\|(.+)\|/g, (match) => {
      if (match.includes('---')) return ''
      const cells = match.split('|').filter(c => c.trim())
      return '<div style="display:flex;gap:6px;margin:2px 0">' + cells.map(c => `<span style="flex:1;padding:4px 8px;background:#222;border-radius:4px;font-size:0.85rem">${c.trim()}</span>`).join('') + '</div>'
    })
    .replace(/\n/g, '<br/>')
}

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! 👋 I'm MY AI — your personal assistant. Ask me anything about fitness, diet, science, or any topic!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    const newMessages = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8000/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: newMessages.slice(-6) })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "Sorry, try again!" }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Could not connect to server. Make sure backend is running!' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', background: '#0a0a0a' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1a1a1a', background: '#111', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #00c853, #00897b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🤖</div>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>MY AI</div>
          <div style={{ color: '#00c853', fontSize: '0.75rem' }}>● Online — Ask me anything, anytime!</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.length === 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => send(s)}
                style={{ padding: '8px 14px', background: '#111', border: '1px solid #333', borderRadius: 20, color: '#aaa', cursor: 'pointer', fontSize: '0.82rem' }}
                onMouseEnter={e => { e.target.style.borderColor = '#00c853'; e.target.style.color = '#00c853' }}
                onMouseLeave={e => { e.target.style.borderColor = '#333'; e.target.style.color = '#aaa' }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #00c853, #00897b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', marginRight: 10, marginTop: 4 }}>🤖</div>
            )}
            {m.role === 'user' ? (
              <div style={{ maxWidth: '70%', padding: '12px 16px', borderRadius: 16, borderBottomRightRadius: 4, background: 'linear-gradient(135deg, #00c853, #00897b)', color: '#000', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {m.content}
              </div>
            ) : (
              <div
                style={{ maxWidth: '70%', padding: '12px 16px', borderRadius: 16, borderBottomLeftRadius: 4, background: '#1a1a1a', color: '#e0e0e0', fontSize: '0.92rem', lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
              />
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #00c853, #00897b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>🤖</div>
            <div style={{ padding: '12px 16px', background: '#1a1a1a', borderRadius: 16, borderBottomLeftRadius: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0,1,2].map(j => (
                <div key={j} style={{ width: 8, height: 8, borderRadius: '50%', background: '#00c853', animation: 'bounce 1s infinite', animationDelay: `${j*0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid #1a1a1a', background: '#111', display: 'flex', gap: 12 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask MY AI anything..."
          style={{ flex: 1, padding: '12px 18px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 24, color: '#fff', fontSize: '0.92rem', outline: 'none' }}
        />
        <button onClick={() => send()} disabled={loading || !input.trim()}
          style={{ width: 48, height: 48, borderRadius: '50%', border: 'none', background: loading || !input.trim() ? '#222' : '#00c853', color: loading || !input.trim() ? '#444' : '#000', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', fontSize: '1.2rem' }}>
          ➤
        </button>
      </div>

      <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }`}</style>
    </div>
  )
}
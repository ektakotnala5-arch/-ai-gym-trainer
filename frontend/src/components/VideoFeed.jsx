import { useRef, useEffect, useCallback, useState } from 'react'

const WS_URL = 'wss://ai-gym-trainer-69ve.onrender.com/ws/session1'

const CAMERA_ERRORS = {
  NotFoundError: {
    icon: '📷',
    title: 'No Camera Detected',
    message: 'Your laptop camera could not be found.',
    steps: [
      'Check if camera is enabled in Device Manager',
      'Press Fn + camera key (some laptops have a hardware switch)',
      'Try: Settings → Privacy → Camera → Allow apps to use camera',
      'Update camera drivers from Device Manager',
      'Restart your browser and try again',
    ],
    color: '#ff9800',
  },
  NotAllowedError: {
    icon: '🔒',
    title: 'Camera Permission Denied',
    message: 'Browser was denied access to your camera.',
    steps: [
      'Click the camera icon in browser address bar',
      'Select "Allow" for camera access',
      'Refresh the page and try again',
    ],
    color: '#e53935',
  },
  NotReadableError: {
    icon: '⚠️',
    title: 'Camera In Use',
    message: 'Another app is currently using your camera.',
    steps: [
      'Close any video call apps (Zoom, Teams, Meet)',
      'Close other browser tabs using the camera',
      'Restart your browser',
    ],
    color: '#ff9800',
  },
  OverconstrainedError: {
    icon: '🔧',
    title: 'Camera Not Compatible',
    message: 'Camera does not support the required settings.',
    steps: [
      'Try a different browser (Chrome recommended)',
      'Connect an external USB webcam',
    ],
    color: '#ff9800',
  },
  default: {
    icon: '❌',
    title: 'Camera Error',
    message: 'Could not access your camera.',
    steps: [
      'Refresh the page and try again',
      'Try a different browser',
      'Connect an external USB webcam',
    ],
    color: '#e53935',
  },
}

export default function VideoFeed({ exercise, onStats, isRunning, setIsRunning }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const wsRef = useRef(null)
  const streamRef = useRef(null)
  const intervalRef = useRef(null)
  const [cameraError, setCameraError] = useState(null)
  const [retrying, setRetrying] = useState(false)

  const stopSession = useCallback(() => {
    clearInterval(intervalRef.current)
    if (wsRef.current) wsRef.current.close()
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    setIsRunning(false)
  }, [setIsRunning])

  const startSession = useCallback(async () => {
    setCameraError(null)
    setRetrying(true)

    // First check if any camera devices exist
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const cameras = devices.filter(d => d.kind === 'videoinput')
      if (cameras.length === 0) {
        setCameraError('NotFoundError')
        setRetrying(false)
        return
      }
    } catch {}

    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      })
    } catch (err) {
      // Try again with minimal constraints
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true })
      } catch (err2) {
        const errorType = err2.name || 'default'
        setCameraError(CAMERA_ERRORS[errorType] ? errorType : 'default')
        setRetrying(false)
        return
      }
    }

    setRetrying(false)
    streamRef.current = stream
    videoRef.current.srcObject = stream
    await videoRef.current.play()

    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      ws.send(JSON.stringify({ exercise }))
      setIsRunning(true)

      intervalRef.current = setInterval(() => {
        const canvas = canvasRef.current
        const video = videoRef.current
        if (!canvas || !video) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0)

        canvas.toBlob(blob => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64 = reader.result.split(',')[1]
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ frame: base64 }))
            }
          }
          reader.readAsDataURL(blob)
        }, 'image/jpeg', 0.7)
      }, 100)
    }

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.frame) {
        const img = new Image()
        img.onload = () => {
          const ctx = canvasRef.current?.getContext('2d')
          if (ctx) ctx.drawImage(img, 0, 0)
        }
        img.src = 'data:image/jpeg;base64,' + data.frame
      }
      onStats({
        reps: data.reps,
        stage: data.stage,
        angle: data.angle,
        feedback: data.feedback || []
      })
    }

    ws.onerror = () => stopSession()
  }, [exercise, onStats, setIsRunning, stopSession])

  useEffect(() => { return () => stopSession() }, [stopSession])

  const errInfo = cameraError ? CAMERA_ERRORS[cameraError] : null

  return (
    <div style={{ position: 'relative', flex: 1, background: '#000', minHeight: 0, overflow: 'hidden' }}>
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />

      {/* ── Camera Error Screen ── */}
      {cameraError && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
          padding: 32,
        }}>
          <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>{errInfo.icon}</div>

            <div style={{
              fontSize: '1.3rem', fontWeight: 800, color: '#fff',
              marginBottom: 8, letterSpacing: 0.5,
            }}>
              {errInfo.title}
            </div>

            <div style={{ fontSize: '0.88rem', color: '#666', marginBottom: 24, lineHeight: 1.6 }}>
              {errInfo.message}
            </div>

            {/* Fix Steps */}
            <div style={{
              background: '#111', borderRadius: 14, padding: '18px 20px',
              border: `1px solid ${errInfo.color}33`, textAlign: 'left', marginBottom: 24,
            }}>
              <div style={{ fontSize: '0.65rem', color: errInfo.color, letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>
                HOW TO FIX
              </div>
              {errInfo.steps.map((step, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '7px 0',
                  borderBottom: i < errInfo.steps.length - 1 ? '1px solid #1a1a1a' : 'none',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: `${errInfo.color}20`, color: errInfo.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 800, marginTop: 1,
                  }}>{i + 1}</div>
                  <div style={{ fontSize: '0.82rem', color: '#aaa', lineHeight: 1.5 }}>{step}</div>
                </div>
              ))}
            </div>

            <button onClick={startSession} disabled={retrying} style={{
              padding: '12px 40px', fontSize: '0.9rem', fontWeight: 800,
              background: retrying ? '#1a1a1a' : 'linear-gradient(135deg, #00c853, #00897b)',
              color: retrying ? '#444' : '#000',
              border: 'none', borderRadius: 50, cursor: retrying ? 'not-allowed' : 'pointer',
              letterSpacing: 1.5, textTransform: 'uppercase',
              boxShadow: retrying ? 'none' : '0 0 20px rgba(0,200,83,0.3)',
              transition: 'all 0.2s',
            }}>
              {retrying ? '⏳ Checking...' : '↻ Try Again'}
            </button>

            <div style={{ marginTop: 18, fontSize: '0.75rem', color: '#333', lineHeight: 1.6 }}>
              💡 No built-in camera? Connect a USB webcam and click Try Again.
            </div>
          </div>
        </div>
      )}

      {/* ── Idle Screen ── */}
      {!isRunning && !cameraError && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'linear-gradient(#00c853 1px, transparent 1px), linear-gradient(90deg, #00c853 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
          <div style={{
            position: 'absolute', width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,200,83,0.12) 0%, transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite',
          }} />

          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div style={{
              fontSize: '4rem', marginBottom: 8,
              filter: 'drop-shadow(0 0 20px rgba(0,200,83,0.5))',
              animation: 'float 3s ease-in-out infinite',
            }}>🏋️</div>
            <div style={{
              fontSize: '1.4rem', fontWeight: 800, color: '#fff',
              letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase',
            }}>Camera Ready</div>
            <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: 32, letterSpacing: 1 }}>
              Position yourself in frame
            </div>
            <button onClick={startSession} disabled={retrying} style={{
              padding: '14px 48px', fontSize: '1rem', fontWeight: 800,
              background: retrying ? '#1a1a1a' : 'linear-gradient(135deg, #00c853, #00897b)',
              color: retrying ? '#444' : '#000',
              border: 'none', borderRadius: 50, cursor: retrying ? 'not-allowed' : 'pointer',
              letterSpacing: 2, textTransform: 'uppercase',
              boxShadow: '0 0 30px rgba(0,200,83,0.4), 0 4px 20px rgba(0,0,0,0.4)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { if (!retrying) e.target.style.transform = 'scale(1.05)' }}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            >
              {retrying ? '⏳ Starting...' : '▶ Start Session'}
            </button>
          </div>
        </div>
      )}

      {/* ── Live indicators ── */}
      {isRunning && (
        <>
          <div style={{
            position: 'absolute', top: 16, left: 16,
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e53935', animation: 'blink 1s infinite' }} />
            <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1 }}>LIVE</span>
          </div>
          <button onClick={stopSession} style={{
            position: 'absolute', top: 16, right: 16,
            padding: '8px 20px', background: 'rgba(229,57,53,0.9)',
            backdropFilter: 'blur(8px)',
            color: '#fff', border: '1px solid rgba(229,57,53,0.5)',
            borderRadius: 20, cursor: 'pointer', fontSize: '0.8rem',
            fontWeight: 700, letterSpacing: 1,
          }}>
            ■ STOP
          </button>
        </>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.1);opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  )
}


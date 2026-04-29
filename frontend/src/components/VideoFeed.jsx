import { useRef, useEffect, useCallback, useState } from 'react'

const WS_URL = 'wss://ai-gym-trainer-69ve.onrender.com/ws/session1'

const CAMERA_ERRORS = {
  NotFoundError: {
    icon: '📷',
    title: 'No Camera Found',
    message: 'No camera was detected on your device.',
    steps: [
      'Allow camera access when prompted',
      'Check browser permissions in Settings',
      'Try refreshing the page',
      'Use Chrome or Safari for best support',
    ],
    color: '#ff9800',
  },
  NotAllowedError: {
    icon: '🔒',
    title: 'Camera Blocked',
    message: 'Camera permission was denied.',
    steps: [
      'Tap the lock/camera icon in address bar',
      'Set Camera to "Allow"',
      'Refresh the page and try again',
    ],
    color: '#e53935',
  },
  NotReadableError: {
    icon: '⚠️',
    title: 'Camera In Use',
    message: 'Camera is being used by another app.',
    steps: [
      'Close other apps using the camera',
      'Close other browser tabs',
      'Restart your browser',
    ],
    color: '#ff9800',
  },
  OverconstrainedError: {
    icon: '🔧',
    title: 'Camera Incompatible',
    message: 'Camera does not support required settings.',
    steps: [
      'Try Chrome (recommended)',
      'Try switching cameras',
    ],
    color: '#ff9800',
  },
  default: {
    icon: '❌',
    title: 'Camera Error',
    message: 'Could not access your camera.',
    steps: [
      'Refresh and try again',
      'Try a different browser',
      'Check camera permissions in Settings',
    ],
    color: '#e53935',
  },
}

export default function VideoFeed({ exercise, onStats, isRunning, setIsRunning, isMobile }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const wsRef = useRef(null)
  const streamRef = useRef(null)
  const intervalRef = useRef(null)
  const [cameraError, setCameraError] = useState(null)
  const [retrying, setRetrying] = useState(false)
  const [useFrontCamera, setUseFrontCamera] = useState(true)

  const stopSession = useCallback(() => {
    clearInterval(intervalRef.current)
    if (wsRef.current) wsRef.current.close()
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    setIsRunning(false)
  }, [setIsRunning])

  const startSession = useCallback(async (facingMode = 'user') => {
    setCameraError(null)
    setRetrying(true)

    // Check for camera devices
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
    // On mobile try with facingMode first
    try {
      const constraints = isMobile
        ? { video: { facingMode: { ideal: facingMode }, width: { ideal: 720 }, height: { ideal: 1280 } } }
        : { video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } }
      stream = await navigator.mediaDevices.getUserMedia(constraints)
    } catch (err) {
      // Fallback to minimal constraints
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
    try {
      await videoRef.current.play()
    } catch {}

    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      ws.send(JSON.stringify({ exercise }))
      setIsRunning(true)

      intervalRef.current = setInterval(() => {
        const canvas = canvasRef.current
        const video = videoRef.current
        if (!canvas || !video || video.videoWidth === 0) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        // Mirror on mobile front camera
        if (isMobile && facingMode === 'user') {
          ctx.save()
          ctx.scale(-1, 1)
          ctx.drawImage(video, -video.videoWidth, 0)
          ctx.restore()
        } else {
          ctx.drawImage(video, 0, 0)
        }

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
          const canvas = canvasRef.current
          if (!canvas) return
          const ctx = canvas.getContext('2d')
          canvas.width = img.width
          canvas.height = img.height
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
  }, [exercise, onStats, setIsRunning, stopSession, isMobile])

  const handleStartSession = () => startSession(useFrontCamera ? 'user' : 'environment')

  const toggleCamera = () => {
    const newFacing = !useFrontCamera
    setUseFrontCamera(newFacing)
    if (isRunning) {
      stopSession()
      setTimeout(() => startSession(newFacing ? 'user' : 'environment'), 300)
    }
  }

  useEffect(() => { return () => stopSession() }, [stopSession])

  const errInfo = cameraError ? CAMERA_ERRORS[cameraError] : null

  return (
    <div style={{ position: 'relative', flex: 1, background: '#000', minHeight: 0, overflow: 'hidden', height: '100%' }}>
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        playsInline  // CRITICAL for iOS Safari
        muted
        autoPlay
      />
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: isMobile ? 'cover' : 'contain',
          display: 'block'
        }}
      />

      {/* Camera Error Screen */}
      {cameraError && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #080b0f 0%, #0d1117 100%)',
          padding: 24,
        }}>
          <div style={{ maxWidth: 380, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: isMobile ? '3rem' : '3.5rem', marginBottom: 12 }}>{errInfo.icon}</div>
            <div style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>
              {errInfo.title}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: 24, lineHeight: 1.6 }}>
              {errInfo.message}
            </div>
            <div style={{
              background: '#0d1117', borderRadius: 14, padding: '16px 18px',
              border: `1px solid ${errInfo.color}33`, textAlign: 'left', marginBottom: 24,
            }}>
              <div style={{ fontSize: '0.62rem', color: errInfo.color, letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>HOW TO FIX</div>
              {errInfo.steps.map((step, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '8px 0',
                  borderBottom: i < errInfo.steps.length - 1 ? '1px solid #1a1a1a' : 'none',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: `${errInfo.color}20`, color: errInfo.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 800,
                  }}>{i + 1}</div>
                  <div style={{ fontSize: '0.83rem', color: '#aaa', lineHeight: 1.5 }}>{step}</div>
                </div>
              ))}
            </div>
            <button onClick={handleStartSession} disabled={retrying} style={{
              padding: isMobile ? '14px 0' : '12px 40px',
              width: isMobile ? '100%' : 'auto',
              fontSize: '0.9rem', fontWeight: 800,
              background: retrying ? '#1a1a1a' : 'linear-gradient(135deg, #00c853, #00897b)',
              color: retrying ? '#444' : '#000',
              border: 'none', borderRadius: 50, cursor: retrying ? 'not-allowed' : 'pointer',
              letterSpacing: 1.5, textTransform: 'uppercase',
              boxShadow: retrying ? 'none' : '0 0 20px rgba(0,200,83,0.3)',
              transition: 'all 0.2s',
            }}>
              {retrying ? '⏳ Checking...' : '↻ Try Again'}
            </button>
          </div>
        </div>
      )}

      {/* Idle Screen */}
      {!isRunning && !cameraError && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #080b0f 0%, #0d1117 60%, #080b0f 100%)',
        }}>
          {/* Grid bg */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'linear-gradient(#00c853 1px, transparent 1px), linear-gradient(90deg, #00c853 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }} />
          {/* Glow */}
          <div style={{
            position: 'absolute',
            width: isMobile ? 240 : 300, height: isMobile ? 240 : 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,200,83,0.1) 0%, transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite',
          }} />

          <div style={{ position: 'relative', textAlign: 'center', padding: '0 32px' }}>
            <div style={{
              fontSize: isMobile ? '3.5rem' : '4rem', marginBottom: 8,
              filter: 'drop-shadow(0 0 20px rgba(0,200,83,0.5))',
              animation: 'float 3s ease-in-out infinite',
            }}>🏋️</div>
            <div style={{
              fontSize: isMobile ? '1.2rem' : '1.4rem',
              fontWeight: 800, color: '#fff',
              letterSpacing: 2, marginBottom: 6, textTransform: 'uppercase',
            }}>Ready to Train</div>
            <div style={{ fontSize: '0.82rem', color: '#444', marginBottom: 32, letterSpacing: 1 }}>
              {isMobile ? 'Point camera at yourself' : 'Position yourself in frame'}
            </div>

            {/* START button */}
            <button
              onClick={handleStartSession}
              disabled={retrying}
              style={{
                padding: isMobile ? '16px 0' : '14px 48px',
                width: isMobile ? '100%' : 'auto',
                maxWidth: 280,
                fontSize: isMobile ? '1rem' : '1rem',
                fontWeight: 800,
                background: retrying ? '#1a1a1a' : 'linear-gradient(135deg, #00c853, #00897b)',
                color: retrying ? '#444' : '#000',
                border: 'none', borderRadius: 50, cursor: retrying ? 'not-allowed' : 'pointer',
                letterSpacing: 2, textTransform: 'uppercase',
                boxShadow: '0 0 40px rgba(0,200,83,0.4), 0 4px 20px rgba(0,0,0,0.4)',
                transition: 'all 0.2s',
                display: 'block', margin: '0 auto',
              }}
            >
              {retrying ? '⏳ Starting...' : '▶  Start Session'}
            </button>

            {/* Camera flip button (mobile only) */}
            {isMobile && (
              <button onClick={toggleCamera} style={{
                marginTop: 16, padding: '10px 24px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid #2a3a4a',
                borderRadius: 30, color: '#778', fontSize: '0.82rem', fontWeight: 600,
                cursor: 'pointer', letterSpacing: 1,
              }}>
                🔄 {useFrontCamera ? 'Use Back Camera' : 'Use Front Camera'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Live indicators */}
      {isRunning && (
        <>
          {/* LIVE badge */}
          <div style={{
            position: 'absolute', top: 16, left: 16,
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e53935', animation: 'blink 1s infinite' }} />
            <span style={{ color: '#fff', fontSize: '0.72rem', fontWeight: 700, letterSpacing: 1 }}>LIVE</span>
          </div>

          {/* Stop button + camera flip */}
          <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
            {isMobile && (
              <button onClick={toggleCamera} style={{
                padding: '7px 14px',
                background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                color: '#fff', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 20, cursor: 'pointer', fontSize: '1rem',
              }}>🔄</button>
            )}
            <button onClick={stopSession} style={{
              padding: '7px 18px',
              background: 'rgba(229,57,53,0.9)', backdropFilter: 'blur(8px)',
              color: '#fff', border: '1px solid rgba(229,57,53,0.4)',
              borderRadius: 20, cursor: 'pointer', fontSize: '0.8rem',
              fontWeight: 700, letterSpacing: 1,
            }}>
              ■ STOP
            </button>
          </div>
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

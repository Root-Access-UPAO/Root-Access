'use client'

import { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import Image from 'next/image'

/* ==========================================
   Movimiento permitido
   false si el usuario pidió reducir el movimiento (epilepsia fotosensible, mareo)
   o si la pestaña está oculta (no gastar CPU/batería en segundo plano).
   ========================================== */
const REDUCED = '(prefers-reduced-motion: reduce)'

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia(REDUCED)
  mq.addEventListener('change', cb)
  document.addEventListener('visibilitychange', cb)
  return () => {
    mq.removeEventListener('change', cb)
    document.removeEventListener('visibilitychange', cb)
  }
}

export function useMotionAllowed() {
  return useSyncExternalStore(
    subscribeMotion,
    () => !window.matchMedia(REDUCED).matches && !document.hidden,
    () => true,
  )
}

/* ==========================================
   COUNTDOWN TIMER
   ========================================== */
export function CountdownTimer({ wrapperClass = "countdown" }: { wrapperClass?: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00', secs: '00' })

  useEffect(() => {
    // Hora de Perú (UTC-5), sin importar la zona horaria del visitante
    const target = new Date('2026-11-19T08:00:00-05:00').getTime()
    
    const updateTime = () => {
      const now = new Date().getTime()
      const diff = target - now
      if (diff <= 0) {
        return false
      }
      setTimeLeft({
        days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        mins: String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0'),
        secs: String(Math.floor((diff / 1000) % 60)).padStart(2, '0')
      })
      return true
    }

    updateTime() // Initial call
    const timer = setInterval(() => {
      if (!updateTime()) clearInterval(timer)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className={wrapperClass}>
      <div><b>{timeLeft.days}</b><span>DÍAS</span></div>
      <i>:</i>
      <div><b>{timeLeft.hours}</b><span>HRS</span></div>
      <i>:</i>
      <div><b>{timeLeft.mins}</b><span>MIN</span></div>
      <i>:</i>
      <div><b>{timeLeft.secs}</b><span>SEG</span></div>
    </div>
  )
}

/* ==========================================
   FULLSCREEN DATAMOSH GLITCH
   Grid-aligned MPEG macroblock attack
   Triggers every ~30s, covers content
   ========================================== */
export function DatamoshGlitch() {
  const paused = !useMotionAllowed()
  const [phase, setPhase] = useState<'idle' | 'skull' | 'access'>('idle')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Trigger every ~5 minutes (300s), skip if paused
  useEffect(() => {
    const trigger = () => {
      const delay = 295000 + Math.random() * 10000 // ~295-305s (5 minutes)
      return setTimeout(() => {
        if (!paused) {
          setPhase('skull')
          setTimeout(() => setPhase('access'), 1000)
          setTimeout(() => setPhase('idle'), 4000) // 1s skull + 3s access = 4s total
        }
        timerRef = trigger()
      }, delay)
    }
    
    let timerRef: ReturnType<typeof setTimeout>;
    
    const hasSeenGlitch = typeof window !== 'undefined' ? sessionStorage.getItem('hasSeenGlitch') : null;

    if (!hasSeenGlitch) {
      // First trigger sooner so user sees it on very first visit
      timerRef = setTimeout(() => {
        if (!paused) {
          setPhase('skull')
          setTimeout(() => setPhase('access'), 1000)
          setTimeout(() => setPhase('idle'), 4000)
        }
        if (typeof window !== 'undefined') sessionStorage.setItem('hasSeenGlitch', 'true');
        timerRef = trigger()
      }, 5000)
    } else {
      // Already seen it this session, go straight to the 5-minute loop
      timerRef = trigger()
    }
    
    return () => clearTimeout(timerRef)
  }, [paused])

  // Canvas animation when active
  useEffect(() => {
    if (phase !== 'access') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animId: number
    let frame = 0
    const BLOCK = 16 // 16x16px aligned grid squares
    const cols = Math.ceil(canvas.width / BLOCK)
    const rows = Math.ceil(canvas.height / BLOCK)

    const colors = [
      '#ff0000', '#cc0000', '#990000', '#ff1a1a',
      '#0066ff', '#0044cc', '#0033aa', '#1a8cff',
      '#ff0033', '#0055dd', '#dd0000', '#0077ff',
    ]

    // Generate corruption regions - clusters of grid-aligned blocks
    interface Region {
      startCol: number; startRow: number
      spanCols: number; spanRows: number
      color: string; opacity: number
      shiftX: number; frame: number; maxFrame: number
    }

    let regions: Region[] = []

    const spawnRegions = () => {
      const count = 15 + Math.floor(Math.random() * 25)
      const newRegions: Region[] = []
      for (let i = 0; i < count; i++) {
        newRegions.push({
          startCol: Math.floor(Math.random() * cols),
          startRow: Math.floor(Math.random() * rows),
          spanCols: 2 + Math.floor(Math.random() * 8),
          spanRows: 1 + Math.floor(Math.random() * 4),
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 0.3 + Math.random() * 0.6,
          shiftX: Math.floor((Math.random() - 0.5) * 10) * BLOCK,
          frame: 0,
          maxFrame: 4 + Math.floor(Math.random() * 12),
        })
      }
      regions = newRegions
    }

    const render = () => {
      frame++

      // Every few frames, respawn corruption patterns
      if (frame % 4 === 0) spawnRegions()

      // Clear with semi-transparent black for trail effect
      ctx.fillStyle = frame % 6 === 0 ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.55)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid-aligned corruption blocks
      for (const r of regions) {
        r.frame++
        if (r.frame > r.maxFrame) continue

        ctx.globalAlpha = r.opacity * (1 - r.frame / r.maxFrame)
        ctx.fillStyle = r.color

        for (let c = 0; c < r.spanCols; c++) {
          for (let rr = 0; rr < r.spanRows; rr++) {
            const x = (r.startCol + c) * BLOCK + r.shiftX
            const y = (r.startRow + rr) * BLOCK
            ctx.fillRect(x, y, BLOCK, BLOCK)
          }
        }

        // RGB separation for some regions
        if (r.opacity > 0.5) {
          ctx.globalAlpha = r.opacity * 0.3
          ctx.fillStyle = '#ff0000'
          for (let c = 0; c < r.spanCols; c++) {
            for (let rr = 0; rr < r.spanRows; rr++) {
              ctx.fillRect((r.startCol + c) * BLOCK + r.shiftX - 3, (r.startRow + rr) * BLOCK, BLOCK, BLOCK)
            }
          }
          ctx.fillStyle = '#0066ff'
          for (let c = 0; c < r.spanCols; c++) {
            for (let rr = 0; rr < r.spanRows; rr++) {
              ctx.fillRect((r.startCol + c) * BLOCK + r.shiftX + 3, (r.startRow + rr) * BLOCK, BLOCK, BLOCK)
            }
          }
        }
      }

      // Horizontal displacement bands - whole rows shift
      if (frame % 3 === 0) {
        const bandRow = Math.floor(Math.random() * rows)
        const bandHeight = (1 + Math.floor(Math.random() * 3)) * BLOCK
        const shift = Math.floor((Math.random() - 0.5) * 6) * BLOCK
        ctx.globalAlpha = 0.4 + Math.random() * 0.4
        ctx.fillStyle = Math.random() < 0.5 ? '#ff0000' : '#0066ff'
        ctx.fillRect(shift, bandRow * BLOCK, canvas.width, bandHeight)
      }

      // Scanline glitch rows
      ctx.globalAlpha = 0.15
      ctx.fillStyle = '#ffffff'
      for (let i = 0; i < 3; i++) {
        const y = Math.floor(Math.random() * rows) * BLOCK
        ctx.fillRect(0, y, canvas.width, 1)
      }

      ctx.globalAlpha = 1
      animId = requestAnimationFrame(render)
    }

    spawnRegions()
    animId = requestAnimationFrame(render)

    return () => cancelAnimationFrame(animId)
  }, [phase])


  if (phase === 'idle') return null

  if (phase === 'skull') {
    return (
      <div className="datamosh-attack" style={{ zIndex: 50, background: '#010204', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Image src="/calavera.png" alt="" width={500} height={500} style={{ maxWidth: '80vw', maxHeight: '80vh', objectFit: 'contain' }} className="candado-glitch" />
        <div className="datamosh-scanlines" />
      </div>
    )
  }

  return (
    <div className="datamosh-attack" aria-hidden="true">
      <canvas ref={canvasRef} className="datamosh-canvas" />
      <div className="datamosh-scanlines" />
      <div className="datamosh-shake" />

      {/* Posiciones aleatorias generadas una vez al montar (no en cada render) */}
      <ErrorFlood />

      <div className="datamosh-title">
        <span data-text="ROOT">ROOT</span>
        <span data-text="ACCESS">ACCESS</span>
        <CountdownTimer wrapperClass="datamosh-countdown" />
      </div>
    </div>
  )
}

function makeErrorPositions() {
  const items = []
  const totalErrors = 120
  for (let i = 0; i < totalErrors; i++) {
    let top, left
    do {
      top = -5 + Math.random() * 105 // Allows slight off-screen overflow for better coverage
      left = -5 + Math.random() * 100
    } while (top > 30 && top < 70 && left > 22 && left < 78) // Safe zone for ROOT ACCESS and clock

    // Multiplying effect: delays start sparse, then explode into massive density
    const progress = i / (totalErrors - 1)
    const delay = Math.pow(progress, 3) * 2.6

    items.push({
      top: `${top}%`,
      left: `${left}%`,
      delay: `${delay.toFixed(2)}s`,
      scale: 0.4 + Math.random() * 1.8,
    })
  }
  return items
}

function ErrorFlood() {
  const [positions] = useState(makeErrorPositions)
  return (
    <>
      {positions.map((pos, i) => (
        <div key={i} className="error-text-glitch" data-text="ERROR" style={{
          top: pos.top,
          left: pos.left,
          transform: `scale(${pos.scale})`,
          animationDelay: pos.delay
        }}>
          ERROR
        </div>
      ))}
    </>
  )
}

/* ==========================================
   RANDOM LIGHTNING BOLTS
   Vertical, horizontal, diagonal
   ========================================== */
export function LightningBolts() {
  const [bolts, setBolts] = useState<Array<{
    id: number; x: number; y: number; rotation: number; length: number; opacity: number
  }>>([])

  const motion = useMotionAllowed()

  useEffect(() => {
    if (!motion) return
    let counter = 0
    const spawn = () => {
      const delay = 800 + Math.random() * 3000
      return setTimeout(() => {
        const newBolt = {
          id: counter++,
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360,
          length: 200 + Math.random() * 500,
          opacity: 0.3 + Math.random() * 0.7,
        }
        setBolts(prev => [...prev.slice(-6), newBolt])
        // Remove after flash
        setTimeout(() => {
          setBolts(prev => prev.filter(b => b.id !== newBolt.id))
        }, 150 + Math.random() * 200)
        timerRef = spawn()
      }, delay)
    }
    let timerRef = spawn()
    return () => clearTimeout(timerRef)
  }, [motion])

  return (
    <div className="lightning-field" aria-hidden="true">
      {(motion ? bolts : []).map(bolt => (
        <svg
          key={bolt.id}
          className="bolt-svg"
          style={{
            left: `${bolt.x}%`,
            top: `${bolt.y}%`,
            transform: `rotate(${bolt.rotation}deg)`,
            opacity: bolt.opacity,
            width: `${bolt.length}px`,
          }}
          viewBox="0 0 200 20"
          preserveAspectRatio="none"
        >
          <path
            d="M0 10 L30 4 L50 14 L80 3 L110 16 L140 6 L170 12 L200 10"
            fill="none"
            stroke="#62d5ff"
            strokeWidth="2.5"
            filter="url(#bolt-glow)"
          />
          <path
            d="M0 10 L30 4 L50 14 L80 3 L110 16 L140 6 L170 12 L200 10"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
          />
          <defs>
            <filter id="bolt-glow">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      ))}
    </div>
  )
}

/* ==========================================
   ELECTRIC TITLE – ROOT / ACCESS
   Letras de electricidad con arcos y chispas
   ========================================== */
export function ElectricTitle() {
  const lines = ['ROOT', 'ACCESS']
  const full = 'ROOTACCESS'
  const [visibleCount, setVisibleCount] = useState(0)
  const [glitchIndex, setGlitchIndex] = useState(-1)
  const isComplete = visibleCount >= full.length // derivado, no necesita estado
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number }>>([])
  const motion = useMotionAllowed()

  // Letter-by-letter reveal
  useEffect(() => {
    if (!motion) return // sin animación: el render muestra el título completo
    if (visibleCount < full.length) {
      const delay = 100 + Math.random() * 200
      const timer = setTimeout(() => {
        setGlitchIndex(visibleCount)
        // Spawn sparks on reveal
        const newSparks = Array.from({ length: 4 }, (_, i) => ({
          id: Date.now() + i,
          x: (Math.random() - 0.5) * 60,
          y: (Math.random() - 0.5) * 60,
        }))
        setSparks(prev => [...prev, ...newSparks])
        setTimeout(() => {
          setVisibleCount(c => c + 1)
          setGlitchIndex(-1)
        }, 120)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [visibleCount, motion])

  // Remove sparks after animation
  useEffect(() => {
    if (sparks.length === 0) return
    const timer = setTimeout(() => setSparks([]), 600)
    return () => clearTimeout(timer)
  }, [sparks])

  // Re-glitch random letters after complete
  useEffect(() => {
    if (!isComplete || !motion) return
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * full.length)
      setGlitchIndex(idx)
      // Random sparks
      setSparks(Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
      })))
      setTimeout(() => setGlitchIndex(-1), 100)
    }, 2000)
    return () => clearInterval(interval)
  }, [isComplete, motion])

  // Con movimiento reducido se muestra todo de una vez
  const shownCount = motion ? visibleCount : full.length
  const complete = motion ? isComplete : true
  let globalIdx = 0

  return (
    <div className="electric-title-wrapper">
      <h1 className="electric-title" aria-label="ROOT ACCESS">
        {lines.map((line, lineIdx) => (
          <span key={lineIdx} className="electric-line">
            {line.split('').map((char) => {
              const i = globalIdx++
              const isVisible = i < shownCount
              const isGlitching = i === glitchIndex
              let cls = 'e-letter'
              if (!isVisible) cls += ' e-hidden'
              if (isGlitching) cls += ' e-zap'
              if (isVisible && i === shownCount - 1 && !complete) cls += ' e-just-on'
              return (
                <span key={i} className={cls} data-char={char}>
                  {isVisible ? char : '\u00A0'}
                  {/* Electric arc to next letter */}
                  {isVisible && i < full.length - 1 && i !== 3 && (
                    <span className="arc" aria-hidden="true" />
                  )}
                </span>
              )
            })}
          </span>
        ))}
      </h1>
      {/* Flying sparks */}
      <div className="spark-field" aria-hidden="true">
        {sparks.map(s => (
          <span
            key={s.id}
            className="flying-spark"
            style={{ '--sx': `${s.x}px`, '--sy': `${s.y}px` } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  )
}

/* ==========================================
   GlitchImage – encapuchado ↔ cuervo
   ========================================== */
export function GlitchImage() {
  const [showCuervo, setShowCuervo] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)
  const motion = useMotionAllowed()

  useEffect(() => {
    if (!motion) return
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setShowCuervo(prev => !prev), 400)
      setTimeout(() => setIsGlitching(false), 700)
    }, 5000)
    return () => clearInterval(interval)
  }, [motion])

  return (
    <div className={`hero-image-container ${isGlitching ? 'datamosh-active' : ''}`}>
      <Image
        src="/encapuchado.png"
        alt="Hacker encapuchado"
        fill
        preload
        sizes="(max-width: 900px) 100vw, 520px"
        className={`hero-img ${!showCuervo ? 'img-visible' : 'img-hidden'}`}
      />
      <Image
        src="/cuervo.png"
        alt="Cuervo cibernético"
        fill
        sizes="(max-width: 900px) 100vw, 520px"
        className={`hero-img ${showCuervo ? 'img-visible' : 'img-hidden'}`}
      />
      <div className="datamosh-slice slice-1" aria-hidden="true" />
      <div className="datamosh-slice slice-2" aria-hidden="true" />
      <div className="datamosh-slice slice-3" aria-hidden="true" />
      <div className="datamosh-pixel" aria-hidden="true" />
    </div>
  )
}

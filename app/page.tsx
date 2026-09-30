'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Code2,
  Globe2,
  LockKeyhole,
  Menu,
  Network,
  ShieldCheck,
  TerminalSquare,
  X,
  Zap,
  Skull,
  AlertTriangle,
  Eye,
} from 'lucide-react'

const topics = [
  { icon: ShieldCheck, code: '01', title: 'Marco Legal y Delitos', text: 'Enfoque desde la investigación y la fiscalía.' },
  { icon: Globe2, code: '02', title: 'Pentesting Web', text: 'Identificación y explotación con OWASP Top 10.' },
  { icon: TerminalSquare, code: '03', title: 'Análisis de Logs', text: 'Detección de anomalías y respuesta a incidentes.' },
  { icon: AlertTriangle, code: '04', title: 'Gestión de Crisis', text: 'Simulación tabletop de ransomware bajo presión.' },
  { icon: Zap, code: '05', title: 'IA & Ciberseguridad', text: 'Automatización de la defensa y tendencias globales.' },
  { icon: Network, code: '06', title: 'Miniproyectos (ABP)', text: 'Retos prácticos de Red Team y Blue Team.' },
]

const scheduleDay1 = [
  ['08:00', 'Registro de asistentes y entrega de materiales', 'Comité organizador'],
  ['08:45', 'Palabras de bienvenida', 'Autoridades UPAO'],
  ['09:00', 'Inauguración, presentación y Demo en vivo de phishing', 'Director / Coordinador'],
  ['09:20', 'Conf. 1: La ciberdelincuencia en La Libertad (Inv. Operativa)', 'Comandante PNP (Por confirmar)'],
  ['10:20', 'Micro-ejercicio: ¿Es delito informático?', 'Audiencia'],
  ['10:35', 'Conf. 2: El delito informático desde la Fiscalía (Ley N.º 30096)', 'Fiscal Especializado (Por confirmar)'],
  ['11:35', 'Micro-ejercicio: ¿Esta evidencia es admisible?', 'Audiencia'],
  ['11:50', 'Coffee break', '—'],
  ['12:05', 'Charla técnica: OWASP Top 10 con demos en vivo', 'Docente UPAO / Invitado'],
  ['12:50', 'Almuerzo + Networking estructurado (Mesas temáticas)', 'Todos'],
  ['13:45', 'Reapertura de la jornada tarde', 'Coordinador'],
  ['14:00', 'Conf. 3: Seguridad de la información en el sector financiero', 'Oficial SI - Caja Trujillo'],
  ['15:00', 'Micro-ejercicio: Análisis de log de transacciones', 'Audiencia'],
  ['15:15', 'Taller interactivo: Simulación tabletop de ransomware', 'Docente especialista'],
  ['16:15', 'Break corto', '—'],
  ['16:30', 'Taller práctico: Análisis de logs y detección de anomalías', 'Docente especialista'],
  ['17:30', 'Conf. internacional: IA y ciberseguridad', 'Expositor Extranjero'],
  ['18:15', 'Charla relámpago: Ingeniería social y phishing', 'Por confirmar'],
  ['18:30', 'Cierre del Día 1 + Briefing para el Día 2', 'Coordinador'],
]

const scheduleDay2 = [
  ['08:30', 'Registro Día 2 y setup de equipos en el laboratorio', 'Comité organizador'],
  ['09:00', 'Briefing: Miniproyectos y criterios de evaluación', 'Coordinador / Docentes'],
  ['09:20', 'Nivelación Taller 1: App web, HTTP y Proxy (OWASP ZAP)', 'Facilitador'],
  ['09:45', 'Demo en vivo: Inyección SQL en DVWA paso a paso', 'Facilitador'],
  ['10:00', 'Práctica Guiada Taller 1: Análisis de vulnerabilidades web', 'Estudiantes y Mentores'],
  ['11:00', 'Coffee break', '—'],
  ['11:15', 'Nivelación Taller 2: Incidentes de seguridad y Logs', 'Facilitador'],
  ['11:35', 'Demo en vivo: Análisis de log real y patrón de ataque', 'Facilitador'],
  ['11:50', 'Práctica Guiada Taller 2: Detección y respuesta a incidentes', 'Estudiantes y Mentores'],
  ['12:50', 'Almuerzo', '—'],
  ['13:40', 'Reapertura y asignación definitiva de miniproyectos', 'Coordinador'],
  ['13:50', 'Desarrollo de Miniproyectos (Pentesting, Hardening, Análisis)', 'Equipos y Mentores'],
  ['15:50', 'Break corto', '—'],
  ['16:05', 'Presentación de miniproyectos (Pitch de 4 min por equipo)', 'Equipos'],
  ['16:55', 'Clausura, evaluación, reconocimientos y certificados', 'Autoridades'],
]

/* ==========================================
   COUNTDOWN TIMER
   ========================================== */
function CountdownTimer({ wrapperClass = "countdown" }: { wrapperClass?: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00', secs: '00' })

  useEffect(() => {
    const target = new Date('2026-11-19T08:00:00').getTime()
    
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
function DatamoshGlitch({ paused }: { paused: boolean }) {
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

  const errorPositions = useMemo(() => {
    if (phase !== 'access') return []
    const items = []
    const totalErrors = 120;
    for(let i=0; i<totalErrors; i++) {
      let top, left;
      do {
        top = -5 + Math.random() * 105; // Allows slight off-screen overflow for better coverage
        left = -5 + Math.random() * 100;
      } while (top > 30 && top < 70 && left > 22 && left < 78); // Safe zone for ROOT ACCESS and clock

      // Multiplying effect: delays start sparse, then explode into massive density
      const progress = i / (totalErrors - 1);
      const delay = Math.pow(progress, 3) * 2.6; 
      
      items.push({
        top: `${top}%`,
        left: `${left}%`,
        delay: `${delay.toFixed(2)}s`,
        scale: 0.4 + Math.random() * 1.8,
      })
    }
    return items
  }, [phase])

  if (phase === 'idle') return null

  if (phase === 'skull') {
    return (
      <div className="datamosh-attack" style={{ zIndex: 50, background: '#010204', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src="/calavera.png" alt="" style={{ maxWidth: '80vw', maxHeight: '80vh', objectFit: 'contain' }} className="candado-glitch" />
        <div className="datamosh-scanlines" />
      </div>
    )
  }

  return (
    <div className="datamosh-attack" aria-hidden="true">
      <canvas ref={canvasRef} className="datamosh-canvas" />
      <div className="datamosh-scanlines" />
      <div className="datamosh-shake" />

      {errorPositions.map((pos, i) => (
        <div key={i} className="error-text-glitch" data-text="ERROR" style={{
          top: pos.top,
          left: pos.left,
          transform: `scale(${pos.scale})`,
          animationDelay: pos.delay
        }}>
          ERROR
        </div>
      ))}

      <div className="datamosh-title">
        <span data-text="ROOT">ROOT</span>
        <span data-text="ACCESS">ACCESS</span>
        <CountdownTimer wrapperClass="datamosh-countdown" />
      </div>
    </div>
  )
}

/* ==========================================
   RANDOM LIGHTNING BOLTS
   Vertical, horizontal, diagonal
   ========================================== */
function LightningBolts() {
  const [bolts, setBolts] = useState<Array<{
    id: number; x: number; y: number; rotation: number; length: number; opacity: number
  }>>([])

  useEffect(() => {
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
  }, [])

  return (
    <div className="lightning-field" aria-hidden="true">
      {bolts.map(bolt => (
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
function ElectricTitle() {
  const lines = ['ROOT', 'ACCESS']
  const full = 'ROOTACCESS'
  const [visibleCount, setVisibleCount] = useState(0)
  const [glitchIndex, setGlitchIndex] = useState(-1)
  const [isComplete, setIsComplete] = useState(false)
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number }>>([])

  // Letter-by-letter reveal
  useEffect(() => {
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
    } else {
      setIsComplete(true)
    }
  }, [visibleCount])

  // Remove sparks after animation
  useEffect(() => {
    if (sparks.length === 0) return
    const timer = setTimeout(() => setSparks([]), 600)
    return () => clearTimeout(timer)
  }, [sparks])

  // Re-glitch random letters after complete
  useEffect(() => {
    if (!isComplete) return
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
  }, [isComplete])

  let globalIdx = 0

  return (
    <div className="electric-title-wrapper">
      <h1 className="electric-title" aria-label="ROOT ACCESS">
        {lines.map((line, lineIdx) => (
          <span key={lineIdx} className="electric-line">
            {line.split('').map((char) => {
              const i = globalIdx++
              const isVisible = i < visibleCount
              const isGlitching = i === glitchIndex
              let cls = 'e-letter'
              if (!isVisible) cls += ' e-hidden'
              if (isGlitching) cls += ' e-zap'
              if (isVisible && i === visibleCount - 1 && !isComplete) cls += ' e-just-on'
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
function GlitchImage() {
  const [showCuervo, setShowCuervo] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setShowCuervo(prev => !prev), 400)
      setTimeout(() => setIsGlitching(false), 700)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`hero-image-container ${isGlitching ? 'datamosh-active' : ''}`}>
      <img
        src="/encapuchado.png"
        alt="Hacker encapuchado"
        className={`hero-img ${!showCuervo ? 'img-visible' : 'img-hidden'}`}
      />
      <img
        src="/cuervo.png"
        alt="Cuervo cibernético"
        className={`hero-img ${showCuervo ? 'img-visible' : 'img-hidden'}`}
      />
      <div className="datamosh-slice slice-1" aria-hidden="true" />
      <div className="datamosh-slice slice-2" aria-hidden="true" />
      <div className="datamosh-slice slice-3" aria-hidden="true" />
      <div className="datamosh-pixel" aria-hidden="true" />
    </div>
  )
}

/* ==========================================
   Page
   ========================================== */
export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [glitchPaused, setGlitchPaused] = useState(false)

  // Resume datamosh when user scrolls back to hero
  useEffect(() => {
    if (!glitchPaused) return
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.3) {
        setGlitchPaused(false)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [glitchPaused])

  const pauseGlitch = () => setGlitchPaused(true)

  return (
    <main className="site-shell">
      <div className="noise" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      {/* FULLSCREEN DATAMOSH GLITCH */}
      <DatamoshGlitch paused={glitchPaused} />

      {/* RANDOM LIGHTNING BOLTS */}
      <LightningBolts />

      <header className="topbar">
        <a className="wordmark" href="#inicio" aria-label="Root Access, inicio" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logoprincipal.png" alt="Logo" style={{ height: '55px', width: 'auto', marginRight: '15px', objectFit: 'contain' }} />
          <span>ROOT <b>ACCESS</b></span>
        </a>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Navegación principal">
          <a href="/cronograma" onClick={() => setMenuOpen(false)}>Agenda</a>
          {['Temas', 'Ponente', 'Ubicación'].map((item) => (
            <a href={`#${item.toLowerCase()}`} key={item} onClick={() => setMenuOpen(false)}>{item}</a>
          ))}
          <a href="/inscripcion" className="nav-cta" onClick={() => { setMenuOpen(false); pauseGlitch() }}>Reservar lugar <ArrowUpRight size={15} /></a>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <section className="hero" id="inicio">
        <div className="grid-glow" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse-dot" /> Conferencia de ciberseguridad · 2026</div>
          <div className="threat-level">
            <AlertTriangle size={13} />
            <span>THREAT LEVEL:</span>
            <span className="threat-critical">CRITICAL</span>
            <span className="threat-bars"><i /><i /><i /><i /><i /></span>
          </div>
          <ElectricTitle />
          <p style={{ marginTop: '15px', color: '#8298a4', font: '13px/1.6 Arial', maxWidth: '400px' }}>
            Ciberdelincuencia y resiliencia digital: el sector público y privado frente a las amenazas de la región.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/inscripcion" onClick={pauseGlitch}>Inscribirme ahora <ArrowUpRight size={17} /></a>
          </div>
          <div className="hero-meta"><span><CalendarDays size={15} /> 19 Y 20 NOV 2026</span><span><Globe2 size={15} /> Trujillo, Perú</span></div>
        </div>
        <div className="hero-art">
          <div className="radar radar-one" /><div className="radar radar-two" />
          <GlitchImage />
          <div className="terminal-note note-left"><span>STATUS // ONLINE</span><br />root@access:~$ _</div>
          <div className="terminal-note note-right">ENCRYPTION<br /><b>AES-256</b><br /><span>● SECURE</span></div>
          <div className="skull-watermark" aria-hidden="true">
            <Skull size={180} strokeWidth={0.3} />
          </div>
        </div>
        <div className="scroll-indicator"><span /> Scroll to explore</div>

        <div className="warning-badge badge-1" aria-hidden="true">
          <Eye size={11} /> MONITORING ACTIVE
        </div>
        <div className="warning-badge badge-2" aria-hidden="true">
          <Skull size={11} /> INTRUSION DETECTED
        </div>
      </section>

      <section className="manifesto section-pad">
        <div className="manifesto-grid">
          <h2>La seguridad<br />empieza con <span>una pregunta.</span></h2>
          <div><p className="large-copy">Root Access es el punto de encuentro para quienes no esperan a que ocurra un ataque para empezar a defender.</p><p>Una jornada de aprendizaje, estrategia y conexión para la próxima generación de profesionales digitales. Sin humo. Sin atajos. Solo conocimiento accionable.</p><a className="arrow-link" href="#temas">Descubre el programa <ArrowUpRight size={18} /></a></div>
        </div>
      </section>

      <section className="topics section-pad" id="temas">
        <div className="section-heading"><div><h2>Áreas de <span>acceso</span></h2></div><p>Seis perspectivas.<br />Una misma misión.</p></div>
        <div className="topic-grid">{topics.map(({ icon: Icon, code, title, text }) => <article className="topic-card" key={code}><span className="topic-code">{code}</span><Icon size={25} strokeWidth={1.4} /><h3>{title}</h3><p>{text}</p><ArrowUpRight className="card-arrow" size={17} /></article>)}</div>
      </section>

      <section className="speaker section-pad" id="ponente">
        <div className="speaker-portrait" style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="candado-wrapper">
            <img src="/candado.png" alt="Seguridad y Defensa" className="candado-glitch" />
          </div>
        </div>
        <div className="speaker-copy">
          <h2>La defensa<br />es un <span>oficio.</span></h2>
          <p className="large-copy">"El atacante solo necesita acertar una vez. Tu trabajo es estar preparado todas las demás."</p>
          <div className="speaker-name">
            <strong>Ing. César Farro</strong><span>Coordinador y Docente de Ciberseguridad · UPAO</span>
          </div>
          <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#8298a4' }}>
            <p style={{ color: 'var(--cyan)' }}>Expertos Invitados (Por Confirmar):</p>
            <ul style={{ marginTop: '8px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <li>Comandante PNP – Unidad de Ciberdelincuencia</li>
              <li>Fiscal Especializado en Ciberdelitos</li>
              <li>Oficial de Seguridad de la Información – Caja Trujillo</li>
              <li>Expositor Internacional en IA</li>
            </ul>
          </div>
          <a className="arrow-link" href="/cronograma" style={{ marginTop: '20px' }}>Ver Cronograma Completo <ArrowUpRight size={18} /></a>
        </div>
      </section>

      <section className="register section-pad" id="registro" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', textAlign: 'center' }}>
        <div>
          <h2 style={{ fontSize: '3rem', margin: '15px 0 0 0' }}>Tu acceso<br />está <span style={{ color: 'var(--cyan)' }}>listo.</span></h2>
        </div>
        <div className="countdown-center">
          <CountdownTimer wrapperClass="countdown big-countdown" />
        </div>
        <a 
          className="button button-primary" 
          href="/inscripcion" 
          style={{ fontSize: '1.2rem', padding: '15px 40px' }}
        >
          Inscribirme ahora <ArrowUpRight size={20} />
        </a>
      </section>

      <footer className="footer" id="ubicación"><div className="footer-brand"><div className="wordmark" style={{ display: 'flex', alignItems: 'center' }}><img src="/logoprincipal.png" alt="Logo" style={{ height: '55px', width: 'auto', marginRight: '15px', objectFit: 'contain' }} /><span>ROOT <b>ACCESS</b></span></div><p>Conferencia de ciberseguridad<br />Universidad Privada Antenor Orrego</p></div><div className="footer-location"><p>Campus UPAO · Trujillo, Perú<br />19 y 20 de noviembre, 2026</p></div><div className="footer-social"><a href="#instagram" aria-label="Instagram"><Globe2 size={18} /></a><a href="#linkedin" aria-label="LinkedIn"><Network size={18} /></a><a href="#top" aria-label="Volver arriba"><ArrowUpRight size={18} /></a></div><div className="footer-bottom"><span>© 2026 ROOT ACCESS</span><span>POWERED BY UPAO <Check size={14} /></span></div></footer>
    </main>
  )
}

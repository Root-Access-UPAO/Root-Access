'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Press_Start_2P, VT323 } from 'next/font/google'
import { enviarInscripcion, type InscripcionPayload } from '@/lib/inscripcion-api'
import { HackCinematic, HOODED_ASCII } from '@/components/registro/hack-cinematic'

// Fuentes servidas desde el propio dominio (sin peticiones a Google en runtime)
const pressStart = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-press', display: 'swap' })
const vt323 = VT323({ weight: '400', subsets: ['latin'], variable: '--font-vt323', display: 'swap' })

const F = ['nombre', 'carrera', 'id', 'correo'];
const V: Record<string, (v: string) => boolean> = {
  nombre: (v) => v.trim().length >= 3,
  carrera: (v) => v.trim().length >= 3,
  id: (v) => /^\d{9}$/.test(v.trim()),
  correo: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim())
};
const M: Record<string, string> = {
  nombre: 'ERROR 403: campo requerido',
  carrera: 'ERROR 403: campo requerido',
  id: 'ERROR: debe tener exactamente 9 dígitos',
  correo: 'SYNTAX ERROR: correo no válido'
};
const LABD: Record<string, string> = { AMBOS_DIAS: 'Día 1 y Día 2', SOLO_DIA_1: 'Día 1', SOLO_DIA_2: 'Día 2' };
type GlitchBlock = { id: number; w: number; h: number; x: number; y: number; c: string; d: number; dx: number }

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const cols = ['#ff2244', '#1aa8ff', '#62d5ff', '#ffffff', '#7c3aed'];

const LABW: Record<string, string> = { MI_LAPTOP: 'Lleva su propia laptop', SIN_LAPTOP: 'Grupo de 2 (sin laptop)', NO_IRE: 'No asiste el día 2' };

export default function InscripcionPage() {
  const [formData, setFormData] = useState({
    nombre: '', carrera: '', id: '', correo: ''
  })
  const [day, setDay] = useState<InscripcionPayload['asistenciaJornada'] | null>(null)
  const [ws, setWs] = useState<InscripcionPayload['equipoDia2'] | null>(null)
  
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [bad, setBad] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<Record<string, string>>({})
  const [glitching, setGlitching] = useState<Record<string, boolean>>({})
  
  const [shake, setShake] = useState(false)
  
  const raRef = useRef<HTMLDivElement>(null)
  const ravenRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<Record<string, HTMLDivElement | null>>({})
  
  const [blocksMap, setBlocksMap] = useState<Record<string, GlitchBlock[]>>({})
  
  const [log, setLog] = useState('')
  const [ticket, setTicket] = useState<{ code: string, nombre: string, jornada: string, laptop: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [hackPhase, setHackPhase] = useState(0)

  // Progressive terminal reveal: which step is visible
  // 0=nombre, 1=carrera, 2=id, 3=correo, 4=rday, 5=rws, 6=goBtn
  const [revealStep, setRevealStep] = useState(0)

  const abortControllerRef = useRef<AbortController | null>(null)
  // Evita doble envío: el estado `busy` no se actualiza hasta el siguiente render.
  const submittingRef = useRef(false)
  // Todos los timers del componente pasan por aquí para limpiarlos al desmontar.
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const later = (fn: () => void, ms: number) => {
    const id = setTimeout(() => { timersRef.current.delete(id); fn() }, ms)
    timersRef.current.add(id)
    return id
  }

  const needWs = day && day !== 'SOLO_DIA_1';

  // XP: valor derivado, se calcula en el render (no necesita estado ni efecto)
  const xpTotal = 5 + (needWs ? 1 : 0);
  const xpDone = Object.keys(done).length + (day ? 1 : 0) + ((needWs && ws) ? 1 : 0);
  const xpVal = Math.round((xpDone / xpTotal) * 100);

  // Raven move
  const [ravenTop, setRavenTop] = useState(60)
  const [ravenHop, setRavenHop] = useState(false)
  
  const moveTo = (el: HTMLElement | null) => {
    if (!el) return;
    setRavenTop(el.offsetTop + 14)
    setRavenHop(false)
    later(() => setRavenHop(true), 10)
  }


  const triggerGlitch = (f: string) => {
    setGlitching(prev => ({ ...prev, [f]: false }))
    
    // Generate blocks
    const newBlocks = Array.from({ length: 12 }).map((_, i) => ({
      id: i, w: rnd(8, 34), h: rnd(14, 60), x: rnd(0, 90), y: rnd(0, 80),
      c: cols[Math.floor(rnd(0, cols.length))],
      d: Math.round(rnd(0, 450)), dx: Math.round(rnd(-70, 70))
    }))
    setBlocksMap(prev => ({ ...prev, [f]: newBlocks }))
    
    setShake(false)
    later(() => {
      setGlitching(prev => ({ ...prev, [f]: true }))
      setShake(true)
    }, 10)

    later(() => {
      setGlitching(prev => ({ ...prev, [f]: false }))
      setShake(false)
      setBlocksMap(prev => ({ ...prev, [f]: [] }))
    }, 1150)
  }

  const complete = (f: string, v: string) => {
    if (!V[f](v)) {
      if (v.trim()) {
        setBad(prev => ({ ...prev, [f]: true }))
        setDone(prev => { const n={...prev}; delete n[f]; return n })
        setStatus(prev => ({ ...prev, [f]: M[f] }))
        triggerGlitch(f)
      } else {
        setDone(prev => { const n={...prev}; delete n[f]; return n })
      }
      return false
    }
    
    if (!done[f]) {
      setDone(prev => ({ ...prev, [f]: true }))
      setBad(prev => ({ ...prev, [f]: false }))
      setStatus(prev => ({ ...prev, [f]: '✔ OK' }))
      triggerGlitch(f)
      
      const idx = F.indexOf(f);
      const nx = idx < F.length - 1 ? F[idx+1] : 'rday';
      // Reveal next field
      const nextStep = idx + 1; // 0→1, 1→2, 2→3, 3→4
      later(() => {
        setRevealStep(prev => Math.max(prev, nextStep))
        // Focus next field after it appears and scroll into view
        later(() => {
          moveTo(rowsRef.current[nx])
          const nextEl = idx < F.length - 1 ? document.getElementById(F[idx + 1]) : rowsRef.current[nx]
          if (nextEl) {
            nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
            if (idx < F.length - 1) (nextEl as HTMLInputElement).focus()
          }
        }, 80)
      }, 450)
    }
    return true;
  }

  const handleInput = (f: string, val: string) => {
    if (f === 'id') {
      val = val.replace(/\D/g, ''); // Elimina todo lo que no sea número
      if (val.length > 9) return; // Bloquea si intenta pasar de 9
    }
    
    setFormData(prev => ({ ...prev, [f]: val }))
    if (done[f] && !V[f](val)) {
      setDone(prev => { const n={...prev}; delete n[f]; return n })
      setStatus(prev => ({ ...prev, [f]: '' }))
    } else if (bad[f]) {
      setBad(prev => ({ ...prev, [f]: false }))
      setStatus(prev => ({ ...prev, [f]: '' }))
    }
  }

  const selDay = (v: InscripcionPayload['asistenciaJornada']) => {
    setDay(v)
    setDone(prev => ({ ...prev, rday: true }))
    setBad(prev => ({ ...prev, rday: false }))
    setStatus(prev => ({ ...prev, rday: '✔ OK' }))
    triggerGlitch('rday')
    
    let newWs: InscripcionPayload['equipoDia2'] | null = null
    if (v === 'SOLO_DIA_1') {
      newWs = 'NO_IRE'
    }
    setWs(newWs)
    setStatus(prev => ({ ...prev, rws: '' }))
    
    later(() => {
      if (v !== 'SOLO_DIA_1') {
        setRevealStep(prev => Math.max(prev, 5))
        later(() => {
          moveTo(rowsRef.current['rws'])
          rowsRef.current['rws']?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 80)
      } else {
        setRevealStep(prev => Math.max(prev, 6))
        later(() => {
          moveTo(rowsRef.current['goBtn'])
          rowsRef.current['goBtn']?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 80)
      }
    }, 450)
  }

  const selWs = (v: InscripcionPayload['equipoDia2']) => {
    setWs(v)
    setDone(prev => ({ ...prev, rws: true }))
    setBad(prev => ({ ...prev, rws: false }))
    setStatus(prev => ({ ...prev, rws: '✔ OK' }))
    triggerGlitch('rws')
    later(() => {
      setRevealStep(prev => Math.max(prev, 6))
      later(() => {
        moveTo(rowsRef.current['goBtn'])
        rowsRef.current['goBtn']?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 80)
    }, 450)
  }

  const typeLog = (lines: string[], cb?: () => void) => {
    let i = 0;
    setLog('')
    const next = () => {
      if (i >= lines.length) { cb?.(); return }
      setLog(prev => prev + (i ? '\n' : '') + lines[i])
      i++
      later(next, 450)
    }
    next()
  }

  const onSubmit = async () => {
    if (busy || submittingRef.current) return;
    let ok = true;
    F.forEach(f => {
      if (!complete(f, formData[f as keyof typeof formData])) {
        ok = false;
        setBad(prev => ({ ...prev, [f]: true }))
        setStatus(prev => ({ ...prev, [f]: M[f] }))
        triggerGlitch(f)
      }
    });
    
    if (!day) {
      ok = false;
      setStatus(prev => ({ ...prev, rday: 'ERROR 403: elige una jornada' }))
      setBad(prev => ({ ...prev, rday: true }))
      triggerGlitch('rday')
    }
    
    if (needWs && !ws) {
      ok = false;
      setStatus(prev => ({ ...prev, rws: 'ERROR 403: elige una opción' }))
      setBad(prev => ({ ...prev, rws: true }))
      triggerGlitch('rws')
    }
    
    if (!ok) return;
    
    submittingRef.current = true
    setBusy(true)
    setTicket(null)
    setLog('')

    const payload = {
      nombreUsuario: formData.nombre.trim(),
      carrera: formData.carrera.trim(),
      idEstudiante: formData.id.trim(),
      correo: formData.correo.trim(),
      asistenciaJornada: day!,
      // SOLO_DIA_1 no muestra la pregunta del día 2; el backend fuerza NO_IRE igualmente.
      equipoDia2: ws ?? 'NO_IRE',
      sitioWeb: honeypot || undefined,
    }
    
    abortControllerRef.current = new AbortController()
    const response = await enviarInscripcion(payload, abortControllerRef.current.signal)
    
    if (response.success) {
      setTicket({
        code: '',
        nombre: payload.nombreUsuario,
        jornada: LABD[payload.asistenciaJornada],
        laptop: LABW[payload.equipoDia2]
      })
      // Phase timing: skull 3.5s → vulnerability 6s → recovery 5s → recovered 2s = 16.5s total
      setHackPhase(1)
      later(() => setHackPhase(2), 3500)
      later(() => setHackPhase(3), 9500)
      later(() => setHackPhase(4), 14500)
      later(() => {
        setHackPhase(5)
        setBusy(false)
        submittingRef.current = false
      }, 16500)
    } else {
      typeLog(['> verificando credenciales...', '> generando token de acceso...', '> ACCESS DENIED X'], () => {
        if (response.validationErrors) {
          // Mapeo de nombres de campo del backend → nombres del form
          const fieldMap: Record<string, string> = {
            nombreUsuario: 'nombre',
            carrera: 'carrera',
            idEstudiante: 'id',
            correo: 'correo',
            asistenciaJornada: 'rday',
            equipoDia2: 'rws',
          }
          Object.keys(response.validationErrors).forEach(backendField => {
            const f = fieldMap[backendField] || backendField
            setStatus(prev => ({ ...prev, [f]: response.validationErrors![backendField] }))
            setBad(prev => ({ ...prev, [f]: true }))
            setDone(prev => { const n={...prev}; delete n[f]; return n })
            triggerGlitch(f)
          })
          setLog('> ACCESO DENEGADO: Errores de validación.')
        } else {
          setLog('> ACCESO DENEGADO: ' + response.error)
        }
        setBusy(false)
        submittingRef.current = false
      })
    }
  }

  useEffect(() => {
    later(() => moveTo(rowsRef.current['nombre']), 100)
    const timers = timersRef.current
    return () => {
      abortControllerRef.current?.abort()
      timers.forEach(clearTimeout)
      timers.clear()
    }
    // Solo al montar: moveTo/later usan refs y setters estables.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDots = Math.round(xpVal / 10)

  const renderGlitchBlocks = (f: string) => {
    return blocksMap[f]?.map((b) => (
      <div key={b.id} className="mb" style={{
        left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`, 
        background: b.c, '--d': `${b.d}ms`, '--dx': `${b.dx}px`
      } as React.CSSProperties}></div>
    ))
  }

  // Show form only when no hack is running
  const showForm = hackPhase === 0;
  // Show thank you only after hack sequence completes
  const showThankYou = hackPhase === 5 && ticket;

  return (
    <main className={`${pressStart.variable} ${vt323.variable} min-h-screen py-10 px-4 flex justify-center items-start bg-black`}>
      <style dangerouslySetInnerHTML={{__html: `
        
        #ra {
          --bg: #010204;
          --ac: #62d5ff;
          --ac2: #1aa8ff;
          --hot: #ff2244;
          --tx: #ecf4f8;
          --mut: #8998a7;
          background: var(--bg);
          border: 2px solid var(--ac);
          padding: 0 0 18px;
          font-family: var(--font-vt323), monospace;
          color: var(--tx);
          position: relative;
          overflow: visible;
          max-width: 680px;
          width: 100%;
        }
        #ra.shake { animation: shk .5s steps(1) 1; }
        @keyframes shk { 0% { transform: translate(0,0) } 15% { transform: translate(-4px,2px) } 30% { transform: translate(5px,-2px) } 45% { transform: translate(-3px,-3px) } 60% { transform: translate(4px,3px) } 80% { transform: translate(-2px,1px) } 100% { transform: none } }
        #ra .bar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-bottom: 2px solid var(--ac); font-family: var(--font-press), monospace; font-size: 11px; color: var(--ac); }
        #ra .dot { width: 10px; height: 10px; background: var(--mut); }
        #ra .xp { padding: 12px 20px 0 64px; font-family: var(--font-press), monospace; font-size: 11px; color: var(--ac2); display: flex; gap: 10px; align-items: center; }
        #ra .xpb { display: flex; gap: 3px; }
        #ra .xpb i { width: 12px; height: 12px; background: #16212b; display: block; }
        #ra .xpb i.on { background: var(--ac2); }
        #ra form { position: relative; padding: 8px 24px 0 64px; }
        #ra .row { margin-top: 14px; }
        #ra .lab { display: flex; justify-content: space-between; font-family: var(--font-press), monospace; font-size: 11px; color: var(--ac); margin-bottom: 6px; line-height: 1.6; }
        #ra .q { font-size: 20px; color: var(--tx); margin: 0 0 8px; }
        #ra .st { color: var(--ac2); font-size: 11px; }
        #ra .st.err { color: var(--hot); }
        #ra .box { position: relative; border: 2px solid var(--mut); background: #0f1620; box-shadow: 4px 4px 0 #16212b; }
        #ra .box:focus-within { border-color: var(--ac2); }
        #ra .row.done .box, #ra .row.done .opts { border-color: var(--ac); }
        #ra .row.bad .box, #ra .row.bad .opts { border-color: var(--hot); }
        #ra input { display: block; width: 100%; box-sizing: border-box; height: auto; border: none; background: transparent; box-shadow: none; border-radius: 0; padding: 6px 10px; font-family: var(--font-vt323), monospace; font-size: 22px; color: var(--tx); outline: none; }
        #ra input::placeholder { color: var(--mut); }
        #ra .opts { position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; }
        
        #ra .row.gl .box, #ra .row.gl .opts { animation: gl 1.1s steps(1) 1; }
        #ra .row.gl input { animation: cs 1.1s steps(1) 1; }
        
        @keyframes gl { 0% { transform: none; clip-path: inset(0); filter: none; } 8% { transform: translateX(-18px) skewX(-12deg); clip-path: inset(0 0 55% 0); filter: invert(1); } 16% { transform: translateX(20px) scaleY(1.15); clip-path: inset(40% 0 0 0); filter: hue-rotate(120deg) saturate(3); } 24% { transform: translateX(-10px); clip-path: inset(15% 0 45% 0); filter: none; } 32% { transform: translateX(14px) skewX(10deg); clip-path: inset(0); filter: invert(1); } 42% { transform: translateX(-22px) scaleY(.85); clip-path: inset(60% 0 5% 0); filter: hue-rotate(240deg) saturate(3); } 52% { transform: translateX(8px); clip-path: inset(0 0 30% 0); filter: none; } 62% { transform: translateX(-14px) skewX(-8deg); clip-path: inset(25% 0 25% 0); filter: invert(1); } 74% { transform: translateX(6px); clip-path: inset(0); filter: hue-rotate(60deg) saturate(2); } 86% { transform: translateX(-3px); clip-path: inset(0); filter: none; } 100% { transform: none; clip-path: inset(0); filter: none; } }
        @keyframes cs { 0% { text-shadow: none; } 10% { text-shadow: 8px 0 var(--hot), -8px 0 var(--ac2); } 30% { text-shadow: -6px 0 var(--hot), 6px 0 var(--ac2); } 50% { text-shadow: 10px 0 var(--hot), -10px 0 var(--ac2); } 70% { text-shadow: -5px 0 var(--hot), 5px 0 var(--ac2); } 90% { text-shadow: 3px 0 var(--hot), -3px 0 var(--ac2); } 100% { text-shadow: none; } }
        
        .mb { position: absolute; pointer-events: none; opacity: 0; z-index: 2; animation: mbk .5s steps(3) forwards; animation-delay: var(--d); }
        @keyframes mbk { 0% { opacity: 0; transform: translateX(0); } 12% { opacity: .95; } 65% { opacity: .95; transform: translateX(var(--dx)); } 100% { opacity: 0; transform: translateX(calc(var(--dx)*1.7)); } }
        
        #ra .opt { font-family: var(--font-press), monospace; font-size: 11px; line-height: 1.6; text-align: left; padding: 10px; background: #0f1620; border: 2px solid var(--mut); border-radius: 0; color: var(--tx); cursor: pointer; height: auto; box-shadow: 4px 4px 0 #16212b; transition: border-color 0.2s, background 0.2s; }
        #ra .opt:hover { border-color: var(--ac2); }
        #ra .opt.sel { border-color: var(--ac); background: #12261c; }
        #ra .opt small { display: block; font-family: var(--font-vt323), monospace; font-size: 18px; color: var(--mut); margin-top: 4px; }
        #ra .opt.sel small { color: var(--ac2); }
        #ra .tag { color: var(--hot); }
        
        #ra .go { font-family: var(--font-press), monospace; font-size: 12px; background: var(--ac); color: #04140b; border: 2px solid var(--ac); border-radius: 0; padding: 12px 18px; cursor: pointer; height: auto; box-shadow: 4px 4px 0 #16212b; }
        #ra .opt:focus-visible, #ra .go:focus-visible, #ra input:focus-visible { outline: 2px solid var(--ac2); outline-offset: 2px; }
        #ra .go:hover { background: var(--ac2); border-color: var(--ac2); }
        #ra .go:active { transform: translate(2px,2px); box-shadow: 2px 2px 0 #16212b; }
        
        #ra .log { font-size: 20px; color: var(--ac); margin-top: 14px; white-space: pre-wrap; }
        
        #ra .thank-you { padding: 24px 14px; text-align: center; }
        #ra .thank-you .ty-title { font-family: var(--font-press), monospace; font-size: 14px; color: var(--ac); margin-bottom: 16px; display: block; }
        #ra .thank-you .ty-sub { font-family: var(--font-press), monospace; font-size: 24px; color: var(--tx); display: block; letter-spacing: 2px; text-shadow: 0 0 20px rgba(98,213,255,0.4); }
        
        #raven { position: absolute; left: 14px; top: 60px; transition: top .5s cubic-bezier(.3,1.6,.5,1); color: var(--ac2); z-index: 3; }
        #raven img { display: block; height: 40px; width: auto; image-rendering: pixelated; }
        #raven.hop > * { animation: hp .5s ease-out 1; }
        @keyframes hp { 0% { transform: translateY(0); } 40% { transform: translateY(-18px); } 100% { transform: translateY(0); } }
        
        @media (prefers-reduced-motion: reduce) { 
          #ra.shake, #ra .row.gl .box, #ra .row.gl .opts, #ra .row.gl input, .mb, #raven.hop > * { animation: none !important; }
          #raven { transition: none; }
        }
        @media (max-width: 640px) {
          #raven { display: none; }
          #ra form { padding-left: 24px; }
          #ra .xp { padding-left: 24px; }
        }
      `}} />

      <div id="ra" className={shake ? 'shake' : ''} ref={raRef}>
        <div className="bar" style={{ justifyContent: 'space-between' }}>
          <span>access_request.exe</span>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ cursor: 'default' }}>-</span>
            <span style={{ display: 'inline-block', width: '9px', height: '9px', border: '2px solid currentColor', cursor: 'default' }}></span>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }} title="Cerrar">X</Link>
          </div>
        </div>
        
        {showForm && (
        <>
        <div className="xp">
          <span>perfil</span>
          <span className="xpb" id="xpb">
            {Array.from({ length: 10 }).map((_, i) => (
              <i key={i} className={i < onDots ? 'on' : ''}></i>
            ))}
          </span>
          <span id="xpt">{xpVal}%</span>
        </div>
        
        <div id="raven" style={{ top: `${ravenTop}px` }} className={ravenHop ? 'hop' : ''} ref={ravenRef}>
          <div>
            <Image src="/cuervo_gif.gif" alt="" width={398} height={401} unoptimized />
          </div>
        </div>
        
        <form id="frm" autoComplete="off" noValidate onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
          {/* Honeypot: fuera de pantalla (no display:none, que muchos bots detectan), oculto a lectores
              de pantalla y sin autocompletado. Si viene lleno, el backend responde éxito sin guardar. */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
            <label htmlFor="hp_sitio">No llenar este campo</label>
            <input id="hp_sitio" name="hp_sitio" type="text" autoComplete="off" tabIndex={-1} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          {F.map((f, fIdx) => {
            // Progressive reveal: only show field if revealStep >= its index
            if (fIdx > revealStep) return null;
            return (
            <div 
              key={f} 
              className={`row ${done[f] ? 'done' : ''} ${bad[f] ? 'bad' : ''} ${glitching[f] ? 'gl' : ''}`} 
              data-f={f}
              ref={el => { rowsRef.current[f] = el }}
            >
              <div className="lab">
                <label htmlFor={f}>&gt; {f === 'nombre' ? 'nombre_usuario' : (f === 'id' ? 'id_estudiante' : f)}:</label>
                <span id={`${f}-st`} className={`st ${bad[f] ? 'err' : ''}`} role={bad[f] ? 'alert' : undefined}>{status[f]}</span>
              </div>
              <div className="box">
                <input 
                  id={f}
                  name={f}
                  type={f === 'correo' ? 'email' : 'text'}
                  autoComplete={f === 'nombre' ? 'name' : (f === 'correo' ? 'email' : 'off')}
                  required
                  aria-invalid={bad[f] ? true : undefined}
                  aria-describedby={status[f] ? `${f}-st` : undefined}
                  value={formData[f as keyof typeof formData]}
                  placeholder={f === 'nombre' ? 'Nombre y apellidos' : (f === 'carrera' ? 'Ingeniería de Sistemas' : (f === 'id' ? '000253567' : 'nombre@upao.edu.pe'))}
                  inputMode={f === 'id' ? 'numeric' : (f === 'correo' ? 'email' : 'text')}
                  maxLength={f === 'id' ? 9 : 150}
                  onFocus={() => moveTo(rowsRef.current[f])}
                  onBlur={(e) => { if (e.target.value.trim()) complete(f, e.target.value) }}
                  onChange={(e) => handleInput(f, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      complete(f, formData[f as keyof typeof formData])
                    }
                  }}
                />
                {renderGlitchBlocks(f)}
              </div>
            </div>
            )
          })}

          {/* Day selection - visible when revealStep >= 4 */}
          {revealStep >= 4 && (
          <div 
            className={`row ${done['rday'] ? 'done' : ''} ${bad['rday'] ? 'bad' : ''} ${glitching['rday'] ? 'gl' : ''}`} 
            id="rday" 
            ref={el => { rowsRef.current['rday'] = el }}
          >
            <div className="lab">
              <span id="rday-lab">&gt; asistencia_jornada:</span>
              <span id="rday-st" className={`st ${bad['rday'] ? 'err' : ''}`} role={bad['rday'] ? 'alert' : undefined}>{status['rday']}</span>
            </div>
            <div className="opts" id="days" role="group" aria-labelledby="rday-lab" aria-describedby={status['rday'] ? 'rday-st' : undefined}>
              <button type="button" className={`opt ${day === 'AMBOS_DIAS' ? 'sel' : ''}`} aria-pressed={day === 'AMBOS_DIAS'} onClick={() => selDay('AMBOS_DIAS')}>
                AMBOS DÍAS<small><span className="tag">★ recomendado</span></small>
              </button>
              <button type="button" className={`opt ${day === 'SOLO_DIA_1' ? 'sel' : ''}`} aria-pressed={day === 'SOLO_DIA_1'} onClick={() => selDay('SOLO_DIA_1')}>
                SOLO DÍA 1<small>solo día 1</small>
              </button>
              <button type="button" className={`opt ${day === 'SOLO_DIA_2' ? 'sel' : ''}`} aria-pressed={day === 'SOLO_DIA_2'} onClick={() => selDay('SOLO_DIA_2')}>
                SOLO DÍA 2<small>solo día 2</small>
              </button>
              {renderGlitchBlocks('rday')}
            </div>
          </div>
          )}

          {/* Workspace selection - visible when revealStep >= 5 AND needWs */}
          {revealStep >= 5 && needWs && (
          <div 
            className={`row ${done['rws'] ? 'done' : ''} ${bad['rws'] ? 'bad' : ''} ${glitching['rws'] ? 'gl' : ''}`} 
            id="rws" 
            ref={el => { rowsRef.current['rws'] = el }}
          >
            <div className="lab">
              <span id="rws-lab">&gt; equipo_dia_2:</span>
              <span id="rws-st" className={`st ${bad['rws'] ? 'err' : ''}`} role={bad['rws'] ? 'alert' : undefined}>{status['rws']}</span>
            </div>
            <p className="q">El Día 2 realizaremos talleres de hacking web y análisis de logs.</p>
            <div className="opts" id="wss" role="group" aria-labelledby="rws-lab" aria-describedby={status['rws'] ? 'rws-st' : undefined}>
              <button type="button" className={`opt ${ws === 'MI_LAPTOP' ? 'sel' : ''}`} aria-pressed={ws === 'MI_LAPTOP'} onClick={() => selWs('MI_LAPTOP')}>
                MI LAPTOP<small>llevaré mi propia laptop</small>
              </button>
              <button type="button" className={`opt ${ws === 'SIN_LAPTOP' ? 'sel' : ''}`} aria-pressed={ws === 'SIN_LAPTOP'} onClick={() => selWs('SIN_LAPTOP')}>
                SIN LAPTOP<small>formaré grupo de 2</small>
              </button>
              {day !== 'SOLO_DIA_2' && (
                <button type="button" className={`opt ${ws === 'NO_IRE' ? 'sel' : ''}`} aria-pressed={ws === 'NO_IRE'} onClick={() => selWs('NO_IRE')}>
                  NO IRÉ<small>no asistiré el día 2</small>
                </button>
              )}
              {renderGlitchBlocks('rws')}
            </div>
          </div>
          )}

          {/* Submit button - visible when revealStep >= 6 */}
          {revealStep >= 6 && (
          <div className="row" style={{ display: 'flex', justifyContent: 'flex-end' }} ref={el => { rowsRef.current['goBtn'] = el }}>
            <button type="submit" className="go" id="go" disabled={busy} aria-busy={busy}>
              {busy ? 'Procesando...' : 'Inscribirme'}
            </button>
          </div>
          )}
          
          <div className="log" id="log" aria-live="polite">{log}</div>
        </form>
        </>
        )}

        {/* Simple thank you message after hack sequence */}
        {showThankYou && (
          <div className="thank-you" style={{ padding: '40px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes datamosh-ascii-subtle {
                0%, 75%, 100% { 
                  color: var(--ac2); 
                  transform: translate(0,0) skewX(0); 
                  text-shadow: 0 0 6px currentColor, 0 0 10px rgba(26,168,255,0.6); 
                }
                78%, 88% { 
                  color: var(--hot); 
                  transform: translate(-3px, 0) skewX(-4deg); 
                  text-shadow: 4px 0 #0ff, -4px 0 #f00; 
                }
                92% { 
                  color: #ffffff; 
                  transform: translate(3px, 0) skewX(4deg); 
                  text-shadow: -4px 0 #0ff, 4px 0 #f00; 
                }
              }
              .glitch-ascii {
                animation: datamosh-ascii-subtle 2.5s infinite;
              }
            `}} />
            <pre className="ty-ascii glitch-ascii" style={{
              fontFamily: '"DejaVu Sans Mono", "Cascadia Mono", Consolas, Menlo, "Courier New", monospace',
              letterSpacing: '0px',
              wordSpacing: '0px',
              lineHeight: 1,
              fontKerning: 'none',
              fontVariantLigatures: 'none',
              whiteSpace: 'pre',
              fontSize: 'clamp(5px, 1.7vw, 13px)',
              color: 'var(--ac2)',
              textShadow: '0 0 6px currentColor, 0 0 10px rgba(26,168,255,0.6)',
              margin: '0 0 30px 0',
              overflow: 'hidden',
              display: 'inline-block',
              textAlign: 'left'
            }}>
{HOODED_ASCII}
            </pre>
            <span style={{ 
              fontFamily: 'var(--font-press), monospace', 
              fontSize: '12px', 
              color: 'var(--ac2)', 
              textAlign: 'center', 
              display: 'block',
              textShadow: '0 0 10px rgba(26,168,255,0.4)',
              letterSpacing: '0px'
            }}>
              &gt; Gracias por tu inscripción
            </span>
          </div>
        )}
      </div>

      <HackCinematic phase={hackPhase} />
    </main>
  )
}

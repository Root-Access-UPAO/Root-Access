'use client'

import { useState, useRef, useEffect } from 'react'
import { enviarInscripcion } from '@/lib/inscripcion-api'

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
const LABW: Record<string, string> = { MI_LAPTOP: 'Lleva su propia laptop', SIN_LAPTOP: 'Grupo de 2 (sin laptop)', NO_IRE: 'No asiste el día 2' };

export default function InscripcionPage() {
  const [formData, setFormData] = useState({
    nombre: '', carrera: '', id: '', correo: ''
  })
  const [day, setDay] = useState<string | null>(null)
  const [ws, setWs] = useState<string | null>(null)
  
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [bad, setBad] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<Record<string, string>>({})
  const [glitching, setGlitching] = useState<Record<string, boolean>>({})
  
  const [xpVal, setXpVal] = useState(0)
  const [shake, setShake] = useState(false)
  
  const raRef = useRef<HTMLDivElement>(null)
  const ravenRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<Record<string, HTMLDivElement | null>>({})
  
  const [blocksMap, setBlocksMap] = useState<Record<string, any[]>>({})
  
  const [log, setLog] = useState('')
  const [ticket, setTicket] = useState<{ code: string, nombre: string, jornada: string, laptop: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [hackPhase, setHackPhase] = useState(0)

  // Progressive terminal reveal: which step is visible
  // 0=nombre, 1=carrera, 2=id, 3=correo, 4=rday, 5=rws, 6=goBtn
  const [revealStep, setRevealStep] = useState(0)

  const abortControllerRef = useRef<AbortController | null>(null)

  const needWs = day && day !== 'SOLO_DIA_1';

  // XP calculation
  useEffect(() => {
    let t = 5 + (needWs ? 1 : 0);
    let n = Object.keys(done).length + (day ? 1 : 0) + ((needWs && ws) ? 1 : 0);
    setXpVal(Math.round((n / t) * 100));
  }, [done, day, ws, needWs])

  // Raven move
  const [ravenTop, setRavenTop] = useState(60)
  const [ravenHop, setRavenHop] = useState(false)
  
  const moveTo = (el: HTMLElement | null) => {
    if (!el) return;
    setRavenTop(el.offsetTop + 14)
    setRavenHop(false)
    setTimeout(() => setRavenHop(true), 10)
  }

  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const cols = ['#ff2244', '#1aa8ff', '#62d5ff', '#ffffff', '#7c3aed'];

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
    setTimeout(() => {
      setGlitching(prev => ({ ...prev, [f]: true }))
      setShake(true)
    }, 10)

    setTimeout(() => {
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
      setTimeout(() => {
        setRevealStep(prev => Math.max(prev, nextStep))
        // Focus next field after it appears and scroll into view
        setTimeout(() => {
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

  const selDay = (v: string) => {
    setDay(v)
    setDone(prev => ({ ...prev, rday: true }))
    setBad(prev => ({ ...prev, rday: false }))
    setStatus(prev => ({ ...prev, rday: '✔ OK' }))
    triggerGlitch('rday')
    
    let newWs = null
    if (v === 'SOLO_DIA_1') {
      newWs = 'NO_IRE'
    }
    setWs(newWs)
    setStatus(prev => ({ ...prev, rws: '' }))
    
    setTimeout(() => {
      if (v !== 'SOLO_DIA_1') {
        setRevealStep(prev => Math.max(prev, 5))
        setTimeout(() => {
          moveTo(rowsRef.current['rws'])
          rowsRef.current['rws']?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 80)
      } else {
        setRevealStep(prev => Math.max(prev, 6))
        setTimeout(() => {
          moveTo(rowsRef.current['goBtn'])
          rowsRef.current['goBtn']?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 80)
      }
    }, 450)
  }

  const selWs = (v: string) => {
    setWs(v)
    setDone(prev => ({ ...prev, rws: true }))
    setBad(prev => ({ ...prev, rws: false }))
    setStatus(prev => ({ ...prev, rws: '✔ OK' }))
    triggerGlitch('rws')
    setTimeout(() => {
      setRevealStep(prev => Math.max(prev, 6))
      setTimeout(() => {
        moveTo(rowsRef.current['goBtn'])
        rowsRef.current['goBtn']?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 80)
    }, 450)
  }

  const typeLog = (lines: string[], cb?: () => void) => {
    let i = 0;
    setLog('')
    const next = () => {
      if (i >= lines.length) { cb && cb(); return }
      setLog(prev => prev + (i ? '\n' : '') + lines[i])
      i++
      setTimeout(next, 450)
    }
    next()
  }

  const onSubmit = async () => {
    if (busy || honeypot) return;
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
    
    setBusy(true)
    setTicket(null)
    setLog('')

    const payload = {
      nombreUsuario: formData.nombre.trim(),
      carrera: formData.carrera.trim(),
      idEstudiante: formData.id.trim(),
      correo: formData.correo.trim(),
      asistenciaJornada: day as any,
      equipoDia2: ws as any,
      sitioWeb: honeypot || undefined,
    }
    
    abortControllerRef.current = new AbortController()
    const response = await enviarInscripcion(payload, abortControllerRef.current.signal)
    
    if (response.success) {
      setTicket({
        code: '',
        nombre: payload.nombreUsuario,
        jornada: LABD[day!],
        laptop: LABW[ws!]
      })
      // Phase timing: skull 3.5s → vulnerability 6s → recovery 5s → recovered 2s = 16.5s total
      setHackPhase(1)
      setTimeout(() => setHackPhase(2), 3500)
      setTimeout(() => setHackPhase(3), 9500)
      setTimeout(() => setHackPhase(4), 14500)
      setTimeout(() => {
        setHackPhase(5)
        setBusy(false)
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
      })
    }
  }

  useEffect(() => {
    setTimeout(() => moveTo(rowsRef.current['nombre']), 100)
    return () => abortControllerRef.current?.abort()
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
    <main className="min-h-screen py-10 px-4 flex justify-center items-start bg-black">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
        
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
          font-family: 'VT323', monospace;
          color: var(--tx);
          position: relative;
          overflow: visible;
          max-width: 680px;
          width: 100%;
        }
        #ra.shake { animation: shk .5s steps(1) 1; }
        @keyframes shk { 0% { transform: translate(0,0) } 15% { transform: translate(-4px,2px) } 30% { transform: translate(5px,-2px) } 45% { transform: translate(-3px,-3px) } 60% { transform: translate(4px,3px) } 80% { transform: translate(-2px,1px) } 100% { transform: none } }
        #ra .bar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-bottom: 2px solid var(--ac); font-family: 'Press Start 2P', monospace; font-size: 11px; color: var(--ac); }
        #ra .dot { width: 10px; height: 10px; background: var(--mut); }
        #ra .xp { padding: 12px 20px 0 64px; font-family: 'Press Start 2P', monospace; font-size: 11px; color: var(--ac2); display: flex; gap: 10px; align-items: center; }
        #ra .xpb { display: flex; gap: 3px; }
        #ra .xpb i { width: 12px; height: 12px; background: #16212b; display: block; }
        #ra .xpb i.on { background: var(--ac2); }
        #ra form { position: relative; padding: 8px 24px 0 64px; }
        #ra .row { margin-top: 14px; }
        #ra .lab { display: flex; justify-content: space-between; font-family: 'Press Start 2P', monospace; font-size: 11px; color: var(--ac); margin-bottom: 6px; line-height: 1.6; }
        #ra .q { font-size: 20px; color: var(--tx); margin: 0 0 8px; }
        #ra .st { color: var(--ac2); font-size: 11px; }
        #ra .st.err { color: var(--hot); }
        #ra .box { position: relative; border: 2px solid var(--mut); background: #0f1620; box-shadow: 4px 4px 0 #16212b; }
        #ra .box:focus-within { border-color: var(--ac2); }
        #ra .row.done .box, #ra .row.done .opts { border-color: var(--ac); }
        #ra .row.bad .box, #ra .row.bad .opts { border-color: var(--hot); }
        #ra input { display: block; width: 100%; box-sizing: border-box; height: auto; border: none; background: transparent; box-shadow: none; border-radius: 0; padding: 6px 10px; font-family: 'VT323', monospace; font-size: 22px; color: var(--tx); outline: none; }
        #ra input::placeholder { color: var(--mut); }
        #ra .opts { position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; }
        
        #ra .row.gl .box, #ra .row.gl .opts { animation: gl 1.1s steps(1) 1; }
        #ra .row.gl input { animation: cs 1.1s steps(1) 1; }
        
        @keyframes gl { 0% { transform: none; clip-path: inset(0); filter: none; } 8% { transform: translateX(-18px) skewX(-12deg); clip-path: inset(0 0 55% 0); filter: invert(1); } 16% { transform: translateX(20px) scaleY(1.15); clip-path: inset(40% 0 0 0); filter: hue-rotate(120deg) saturate(3); } 24% { transform: translateX(-10px); clip-path: inset(15% 0 45% 0); filter: none; } 32% { transform: translateX(14px) skewX(10deg); clip-path: inset(0); filter: invert(1); } 42% { transform: translateX(-22px) scaleY(.85); clip-path: inset(60% 0 5% 0); filter: hue-rotate(240deg) saturate(3); } 52% { transform: translateX(8px); clip-path: inset(0 0 30% 0); filter: none; } 62% { transform: translateX(-14px) skewX(-8deg); clip-path: inset(25% 0 25% 0); filter: invert(1); } 74% { transform: translateX(6px); clip-path: inset(0); filter: hue-rotate(60deg) saturate(2); } 86% { transform: translateX(-3px); clip-path: inset(0); filter: none; } 100% { transform: none; clip-path: inset(0); filter: none; } }
        @keyframes cs { 0% { text-shadow: none; } 10% { text-shadow: 8px 0 var(--hot), -8px 0 var(--ac2); } 30% { text-shadow: -6px 0 var(--hot), 6px 0 var(--ac2); } 50% { text-shadow: 10px 0 var(--hot), -10px 0 var(--ac2); } 70% { text-shadow: -5px 0 var(--hot), 5px 0 var(--ac2); } 90% { text-shadow: 3px 0 var(--hot), -3px 0 var(--ac2); } 100% { text-shadow: none; } }
        
        .mb { position: absolute; pointer-events: none; opacity: 0; z-index: 2; animation: mbk .5s steps(3) forwards; animation-delay: var(--d); }
        @keyframes mbk { 0% { opacity: 0; transform: translateX(0); } 12% { opacity: .95; } 65% { opacity: .95; transform: translateX(var(--dx)); } 100% { opacity: 0; transform: translateX(calc(var(--dx)*1.7)); } }
        
        #ra .opt { font-family: 'Press Start 2P', monospace; font-size: 11px; line-height: 1.6; text-align: left; padding: 10px; background: #0f1620; border: 2px solid var(--mut); border-radius: 0; color: var(--tx); cursor: pointer; height: auto; box-shadow: 4px 4px 0 #16212b; transition: border-color 0.2s, background 0.2s; }
        #ra .opt:hover { border-color: var(--ac2); }
        #ra .opt.sel { border-color: var(--ac); background: #12261c; }
        #ra .opt small { display: block; font-family: 'VT323', monospace; font-size: 18px; color: var(--mut); margin-top: 4px; }
        #ra .opt.sel small { color: var(--ac2); }
        #ra .tag { color: var(--hot); }
        
        #ra .go { font-family: 'Press Start 2P', monospace; font-size: 12px; background: var(--ac); color: #04140b; border: 2px solid var(--ac); border-radius: 0; padding: 12px 18px; cursor: pointer; height: auto; box-shadow: 4px 4px 0 #16212b; }
        #ra .go:hover { background: var(--ac2); border-color: var(--ac2); }
        #ra .go:active { transform: translate(2px,2px); box-shadow: 2px 2px 0 #16212b; }
        
        #ra .log { font-size: 20px; color: var(--ac); margin-top: 14px; white-space: pre-wrap; }
        
        #ra .thank-you { padding: 24px 14px; text-align: center; }
        #ra .thank-you .ty-title { font-family: 'Press Start 2P', monospace; font-size: 14px; color: var(--ac); margin-bottom: 16px; display: block; }
        #ra .thank-you .ty-sub { font-family: 'Press Start 2P', monospace; font-size: 24px; color: var(--tx); display: block; letter-spacing: 2px; text-shadow: 0 0 20px rgba(98,213,255,0.4); }
        
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
            <a href="/" style={{ textDecoration: 'none', color: 'inherit' }} title="Cerrar">X</a>
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
            <img src="/cuervo_gif.gif" alt="" />
          </div>
        </div>
        
        <form id="frm" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <input type="text" style={{ display: 'none' }} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} />

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
                <span>&gt; {f === 'nombre' ? 'nombre_usuario' : (f === 'id' ? 'id_estudiante' : f)}:</span>
                <span className={`st ${bad[f] ? 'err' : ''}`}>{status[f]}</span>
              </div>
              <div className="box">
                <input 
                  id={f}
                  value={formData[f as keyof typeof formData]}
                  placeholder={f === 'nombre' ? 'Nombre y apellidos' : (f === 'carrera' ? 'Ingeniería de Sistemas' : (f === 'id' ? '000253567' : 'nombre@upao.edu.pe'))}
                  inputMode={f === 'id' ? 'numeric' : 'text'}
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
              <span>&gt; asistencia_jornada:</span>
              <span className={`st ${bad['rday'] ? 'err' : ''}`}>{status['rday']}</span>
            </div>
            <div className="opts" id="days">
              <button type="button" className={`opt ${day === 'AMBOS_DIAS' ? 'sel' : ''}`} aria-label="Asistiré ambos días" onClick={() => selDay('AMBOS_DIAS')}>
                AMBOS DÍAS<small><span className="tag">★ recomendado</span></small>
              </button>
              <button type="button" className={`opt ${day === 'SOLO_DIA_1' ? 'sel' : ''}`} aria-label="Solo asistiré el día 1" onClick={() => selDay('SOLO_DIA_1')}>
                SOLO DÍA 1<small>solo día 1</small>
              </button>
              <button type="button" className={`opt ${day === 'SOLO_DIA_2' ? 'sel' : ''}`} aria-label="Solo asistiré el día 2" onClick={() => selDay('SOLO_DIA_2')}>
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
              <span>&gt; equipo_dia_2:</span>
              <span className={`st ${bad['rws'] ? 'err' : ''}`}>{status['rws']}</span>
            </div>
            <p className="q">El Día 2 realizaremos talleres de hacking web y análisis de logs.</p>
            <div className="opts" id="wss">
              <button type="button" className={`opt ${ws === 'MI_LAPTOP' ? 'sel' : ''}`} aria-label="Llevaré mi propia laptop" onClick={() => selWs('MI_LAPTOP')}>
                MI LAPTOP<small>llevaré mi propia laptop</small>
              </button>
              <button type="button" className={`opt ${ws === 'SIN_LAPTOP' ? 'sel' : ''}`} aria-label="No tengo laptop, pero mi compañero asistirá y podemos formar grupo de 2" onClick={() => selWs('SIN_LAPTOP')}>
                SIN LAPTOP<small>formaré grupo de 2</small>
              </button>
              {day !== 'SOLO_DIA_2' && (
                <button type="button" className={`opt ${ws === 'NO_IRE' ? 'sel' : ''}`} aria-label="No asistiré el día 2" onClick={() => selWs('NO_IRE')}>
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
            <button type="button" className="go" id="go" onClick={onSubmit} disabled={busy}>
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
{`                         ░▓▓█▓                              
                       ▓█▓▒░▓███▓                           
                     ▓██▒░░░▒▓▒▓███                         
                   ▒██▒░░░░░▒▒▒▒▓███▒                       
                  ▓██▒▒▒░░░░░░▒▒▓▓████                      
                 ▓██▓░░▒░░░░░░░▒░░▒████                     
                ▒███▓▓▓░░░░░░▒▒▒▓▒▒░███▒                    
               ░███▒██░░░░░░░▒▒▒▒▒▒▒▒███░                   
               ███░▒█░░░░░░░░░░░░░░░░▓███                   
              ███░▓█░░░░░░░░▒▒▒▒▒▒░░░░████                  
             ▓██░██▒▓▓▓▒░░░░░▒▒▓████▒▒░████                 
            ▒██▓██▓▓▒░░░░░░░░░░░░░▒▓███▓███▒                
           ▒████▓░                    ▒▓████░               
          ██▓░      ░◆◆◆◆      ◆◆◆◆░     ░▓██▓              
         ▓░          ░▒▒░      ░▓▒░          █▓             
         ▒                                    ▒             
          ▒▓                                ▓█              
      ░▓████▓░                            ░▒▒████▒          
    ████▓▒░▒░ ░▒░                       ░░▒░░█▒░█████▒      
  ████▒▒▒  ░░  ░ ░░                   ░░  ▒ ░░ ░▓▓█████     
 ██▓░░░░ ░  ░  ░░   ░               ░░    ░     ░░░▒▒███    
██▒█░ ░░                                ░░░      ░░░▓▓██    
▓█░░░                                    ░      ░░ ░▒▓██    
▓▒░                                     ░      ░░░ ▒░▓██    
░░                                     ░          ░░▒▒▓     
░█░                                    ░           ▒▓▓█░    
▓▒░                                               ░░░▓█▓ 

          ██████╗  ██████╗  ██████╗ ████████╗
         ██╔══██╗██═══   ██╗██═══██╗╚══██╔══╝
         ██████╔╝██║   ██║██║   ██║   ██║
         ██╔══██╗██║   ██║██║   ██║   ██║
         ██║  ██║╚██████╔╝╚██████╔╝   ██║
         ╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝
 █████╗  ██████╗ ██████╗███████╗███████╗███████╗
██╔══██╗██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝
███████║██║     ██║     █████╗  ███████╗███████╗
██╔══██║██║     ██║     ██╔══╝  ╚════██║╚════██║
██║  ██║╚██████╗╚██████╗███████╗███████║███████║
╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚══════╝╚══════╝╚══════╝`}
            </pre>
            <span style={{ 
              fontFamily: '"Press Start 2P", monospace', 
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

function HackCinematic({ phase }: { phase: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loadingDots, setLoadingDots] = useState(0)
  const [errorItems, setErrorItems] = useState<{id: number, top: string, left: string, delay: string, scale: number, text: string}[]>([])

  // Canvas-based datamosh corruption (phases 1 & 2)
  useEffect(() => {
    if (phase !== 1 && phase !== 2) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animId: number
    let frame = 0
    const BLOCK = 16
    const cols = Math.ceil(canvas.width / BLOCK)
    const rows = Math.ceil(canvas.height / BLOCK)

    const colors = [
      '#ff0000', '#cc0000', '#990000', '#ff1a1a',
      '#0066ff', '#0044cc', '#0033aa', '#1a8cff',
      '#ff0033', '#0055dd', '#dd0000', '#0077ff',
      '#7c3aed', '#ff2244', '#62d5ff',
    ]

    interface Region {
      startCol: number; startRow: number
      spanCols: number; spanRows: number
      color: string; opacity: number
      shiftX: number; frame: number; maxFrame: number
    }

    let regions: Region[] = []

    const spawnRegions = () => {
      const count = 20 + Math.floor(Math.random() * 30)
      const newRegions: Region[] = []
      for (let i = 0; i < count; i++) {
        newRegions.push({
          startCol: Math.floor(Math.random() * cols),
          startRow: Math.floor(Math.random() * rows),
          spanCols: 2 + Math.floor(Math.random() * 10),
          spanRows: 1 + Math.floor(Math.random() * 5),
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 0.3 + Math.random() * 0.7,
          shiftX: Math.floor((Math.random() - 0.5) * 12) * BLOCK,
          frame: 0,
          maxFrame: 3 + Math.floor(Math.random() * 10),
        })
      }
      regions = newRegions
    }

    const render = () => {
      frame++
      if (frame % 3 === 0) spawnRegions()

      ctx.fillStyle = frame % 5 === 0 ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.5)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

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

      // Horizontal displacement bands
      if (frame % 2 === 0) {
        const bandRow = Math.floor(Math.random() * rows)
        const bandHeight = (1 + Math.floor(Math.random() * 4)) * BLOCK
        const shift = Math.floor((Math.random() - 0.5) * 8) * BLOCK
        ctx.globalAlpha = 0.4 + Math.random() * 0.5
        ctx.fillStyle = Math.random() < 0.5 ? '#ff0000' : '#0066ff'
        ctx.fillRect(shift, bandRow * BLOCK, canvas.width, bandHeight)
      }

      // Scanlines
      ctx.globalAlpha = 0.15
      ctx.fillStyle = '#ffffff'
      for (let i = 0; i < 4; i++) {
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

  // Spawn error messages continuously during phase 2
  useEffect(() => {
    if (phase !== 2) { setErrorItems([]); return }
    const errorTexts = [
      'ERROR', 'CRITICAL FAILURE', 'ACCESS DENIED', 'BREACH DETECTED',
      'MALWARE FOUND', 'FIREWALL DOWN', 'DATA CORRUPTED', 'OVERFLOW',
      'SEGFAULT', 'KERNEL PANIC', '0xDEADBEEF', 'STACK SMASH',
      'BUFFER OVERFLOW', 'SQL INJECTION', 'XSS DETECTED', 'ROOT EXPLOIT',
      'BACKDOOR ACTIVE', 'TROJAN HORSE', 'RANSOMWARE', 'ZERO DAY',
    ]
    let idCounter = 0
    // Initial burst
    const initial: typeof errorItems = []
    for (let i = 0; i < 40; i++) {
      initial.push({
        id: idCounter++,
        top: `${-5 + Math.random() * 110}%`,
        left: `${-5 + Math.random() * 110}%`,
        delay: `${(Math.random() * 1.5).toFixed(2)}s`,
        scale: 0.3 + Math.random() * 1.5,
        text: errorTexts[Math.floor(Math.random() * errorTexts.length)],
      })
    }
    setErrorItems(initial)

    // Keep spawning new errors
    const interval = setInterval(() => {
      const batch: typeof errorItems = []
      const count = 5 + Math.floor(Math.random() * 10)
      for (let i = 0; i < count; i++) {
        batch.push({
          id: idCounter++,
          top: `${-5 + Math.random() * 110}%`,
          left: `${-5 + Math.random() * 110}%`,
          delay: `${(Math.random() * 0.3).toFixed(2)}s`,
          scale: 0.3 + Math.random() * 1.5,
          text: errorTexts[Math.floor(Math.random() * errorTexts.length)],
        })
      }
      setErrorItems(prev => [...prev.slice(-80), ...batch])
    }, 400)

    return () => clearInterval(interval)
  }, [phase])

  // Loading dots for phase 3
  useEffect(() => {
    if (phase === 3) {
      const interval = setInterval(() => setLoadingDots(v => (v + 1) % 10), 300)
      return () => clearInterval(interval)
    }
  }, [phase])

  if (phase === 0 || phase === 5) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
      {/* Solid black background - NO fade transition to prevent flash bug */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'black' }} />

      {/* Canvas datamosh corruption for phases 1 & 2 */}
      {(phase === 1 || phase === 2) && (
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />
      )}

      {/* Scanlines overlay */}
      {(phase === 1 || phase === 2) && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 3px)',
        }} />
      )}

      {/* Phase 1: Calavera skull centered with glitch */}
      {phase === 1 && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img
            src="/calavera.png"
            alt=""
            className="candado-glitch"
            style={{
              maxWidth: '70vw', maxHeight: '70vh', objectFit: 'contain',
              filter: 'drop-shadow(0 0 40px rgba(255,0,0,0.6)) drop-shadow(0 0 80px rgba(0,102,255,0.4))',
            }}
          />
        </div>
      )}

      {/* Phase 2: Warning text + error flood */}
      {phase === 2 && (
        <>
          {/* Error messages everywhere */}
          {errorItems.map(e => (
            <div key={e.id} className="error-text-glitch" data-text={e.text} style={{
              top: e.top, left: e.left,
              transform: `scale(${e.scale})`,
              animationDelay: e.delay,
              zIndex: 5,
              fontSize: `${14 + Math.random() * 22}px`,
            }}>
              {e.text}
            </div>
          ))}

          {/* Central warning message */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '20px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '20px',
              padding: '20px 40px',
              background: 'rgba(0,0,0,0.7)',
              border: '2px solid #ff2244',
              boxShadow: '0 0 40px rgba(255,34,68,0.5), 0 0 80px rgba(255,34,68,0.2), inset 0 0 20px rgba(255,0,0,0.1)',
            }}>
              <span style={{ color: '#ff2244', fontSize: '48px', lineHeight: 1 }}>⚠</span>
              <span
                className="error-text-glitch"
                data-text="EL SISTEMA ESTÁ SIENDO VULNERADO"
                style={{
                  position: 'relative',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 'clamp(14px, 3.5vw, 32px)',
                  color: '#ffffff',
                  textShadow: '0 0 10px rgba(255,34,68,0.8), 0 0 30px rgba(255,0,0,0.5)',
                  opacity: 1,
                  animation: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                EL SISTEMA ESTÁ SIENDO VULNERADO
              </span>
              <span style={{ color: '#ff2244', fontSize: '48px', lineHeight: 1 }}>⚠</span>
            </div>
          </div>
        </>
      )}

      {/* Phase 3: Recovery loading */}
      {phase === 3 && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#010204', padding: '30px 40px',
            border: '2px solid #62d5ff', textAlign: 'center',
            fontFamily: '"Press Start 2P", monospace',
            boxShadow: '0 0 30px rgba(98,213,255,0.2)',
          }}>
            <div style={{ color: '#1aa8ff', marginBottom: '15px', fontSize: '14px' }}>recuperando sistema ...</div>
            <div style={{ color: '#62d5ff', fontSize: '20px', letterSpacing: '2px' }}>
              [{Array.from({length: 10}).map((_,i) => i <= loadingDots ? '■' : '□').join('')}]
            </div>
          </div>
        </div>
      )}

      {/* Phase 4: System recovered */}
      {phase === 4 && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#010204', padding: '30px 40px',
            border: '2px solid #39ff88', textAlign: 'center',
            fontFamily: '"Press Start 2P", monospace',
            boxShadow: '0 0 30px rgba(57,255,136,0.2)',
          }}>
            <div style={{ color: '#39ff88', fontSize: '18px' }}>sistema recuperado</div>
          </div>
        </div>
      )}
    </div>
  )
}

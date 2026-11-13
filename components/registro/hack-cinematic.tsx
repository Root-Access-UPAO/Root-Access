'use client'

/*
 * Cinemática de "hackeo" compartida por /inscripcion y por el botón "Reservar lugar".
 * Fases: 1 calavera + datamosh · 2 "EL SISTEMA ESTÁ SIENDO VULNERADO" + lluvia de errores
 *        3 "recuperando sistema" con barra · 4 "sistema recuperado".
 * (Movido desde app/inscripcion/page.tsx sin cambios de comportamiento.)
 */

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

/** Encapuchado + "ROOT ACCESS" en ASCII: pantalla final de la cinemática. */
export const HOODED_ASCII = `                         ░▓▓█▓                              
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
╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚══════╝╚══════╝╚══════╝`

export function HackCinematic({ phase }: { phase: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loadingDots, setLoadingDots] = useState(0)
  const [errorItems, setErrorItems] = useState<{id: number, top: string, left: string, delay: string, scale: number, text: string, size: number}[]>([])

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
    if (phase !== 2) return
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
        size: 14 + Math.random() * 22,
      })
    }
    // Ráfaga inicial en el siguiente tick (no setState síncrono dentro del efecto)
    const burst = setTimeout(() => setErrorItems(initial), 0)

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
          size: 14 + Math.random() * 22,
        })
      }
      setErrorItems(prev => [...prev.slice(-80), ...batch])
    }, 400)

    return () => {
      clearTimeout(burst)
      clearInterval(interval)
    }
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
          <Image
            src="/calavera.png"
            alt=""
            width={500}
            height={500}
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
              fontSize: `${e.size}px`,
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
                  fontFamily: 'var(--font-press), monospace',
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
            fontFamily: 'var(--font-press), monospace',
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
            fontFamily: 'var(--font-press), monospace',
            boxShadow: '0 0 30px rgba(57,255,136,0.2)',
          }}>
            <div style={{ color: '#39ff88', fontSize: '18px' }}>sistema recuperado</div>
          </div>
        </div>
      )}
    </div>
  )
}

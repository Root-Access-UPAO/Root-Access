'use client'

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Press_Start_2P } from 'next/font/google'
import { INSCRIPCION_URL } from '@/lib/links'
import { HackCinematic, HOODED_ASCII } from './hack-cinematic'

const pressStart = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-press', display: 'swap' })

/*
 * Enlace al formulario de inscripción con la cinemática completa de /inscripcion:
 *   1 calavera + datamosh → 2 "EL SISTEMA ESTÁ SIENDO VULNERADO" → 3 "recuperando sistema"
 *   → 4 "sistema recuperado" → 5 encapuchado + ROOT ACCESS: "Dándote acceso al formulario"
 *   y luego "Bienvenido" → redirige al formulario.
 *
 * Sigue siendo un <a href> real: sin JS, con Ctrl/Cmd/clic medio o "abrir en pestaña
 * nueva" el navegador navega normalmente sin animación.
 */

/** Momento (ms desde el clic) en que empieza cada fase. Ajustar aquí la duración total. */
const AT = { vulnerado: 3000, recuperando: 8000, recuperado: 12000, final: 13800, bienvenido: 15600, redirect: 17400 }

type Phase = 0 | 1 | 2 | 3 | 4 | 5

export function ReserveLink({ className, children, onNavigate }: { className?: string; children: ReactNode; onNavigate?: () => void }) {
  const [phase, setPhase] = useState<Phase>(0)
  const [welcome, setWelcome] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const rootRef = useRef<HTMLDivElement>(null)

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const go = () => { clearTimers(); window.location.assign(INSCRIPCION_URL) }

  // Limpia temporizadores al desmontar.
  useEffect(() => {
    const t = timers
    return () => t.current.forEach(clearTimeout)
  }, [])

  // Esc cancela; el foco pasa al overlay para que el teclado no quede detrás.
  const active = phase !== 0
  useEffect(() => {
    if (!active) return
    rootRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      timers.current.forEach(clearTimeout)
      timers.current = []
      setPhase(0)
      setWelcome(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.()
    // Respeta clic medio / modificadores: el usuario quiere otra pestaña.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { go(); return }

    clearTimers()
    setWelcome(false)
    setPhase(1)
    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms))
    at(AT.vulnerado, () => setPhase(2))
    at(AT.recuperando, () => setPhase(3))
    at(AT.recuperado, () => setPhase(4))
    at(AT.final, () => setPhase(5))
    at(AT.bienvenido, () => setWelcome(true))
    at(AT.redirect, go)
  }

  return (
    <>
      <a href={INSCRIPCION_URL} className={className} onClick={onClick}>{children}</a>

      {/* Portal a <body>: el header crea su propio contexto de apilamiento (z-index 5). */}
      {active && createPortal(
        <div ref={rootRef} tabIndex={-1} className={`access-root ${pressStart.variable}`} role="dialog" aria-modal="true" aria-label="Accediendo al formulario de inscripción">
          {phase <= 4 && <HackCinematic phase={phase} />}

          {phase === 5 && (
            <div className="access-finale" role="status">
              <pre className="access-finale__ascii" aria-hidden="true">{HOODED_ASCII}</pre>
              <p className="access-finale__msg" key={welcome ? 'w' : 'a'}>
                {welcome ? '> Bienvenido' : '> Dándote acceso al formulario...'}
              </p>
            </div>
          )}
        </div>,
        document.body,
      )}
    </>
  )
}

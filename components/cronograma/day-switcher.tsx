'use client'

import { useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export type ScheduleDay = { label: string; date: string; content: ReactNode }

const navButton = {
  display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none',
  color: '#8a98a4', cursor: 'pointer', font: 'bold 14px Arial',
} as const

/**
 * Cambia el día visible. El contenido de todos los días llega ya renderizado desde el
 * servidor (está en el HTML para buscadores); aquí solo se oculta el que no toca.
 */
export function DaySwitcher({ days }: { days: ScheduleDay[] }) {
  const [active, setActive] = useState(0)
  const prev = active > 0 ? active - 1 : null
  const next = active < days.length - 1 ? active + 1 : null

  return (
    <>
      <nav
        aria-label="Días del evento"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(6, 10, 16, 0.7)', border: '1px solid var(--line)', borderRadius: '12px', padding: '15px 25px', marginBottom: '50px' }}
      >
        {prev !== null ? (
          <button type="button" onClick={() => setActive(prev)} aria-controls="cronograma-dias" style={navButton}>
            <ArrowLeft size={18} aria-hidden="true" /> Ver {days[prev].label}
          </button>
        ) : <span />}

        {/* aria-live: el lector de pantalla anuncia el día al cambiar */}
        <div style={{ textAlign: 'center' }} aria-live="polite">
          <h2 style={{ margin: 0, color: 'var(--cyan)', font: 'bold 22px Arial' }}>{days[active].label.toUpperCase()}</h2>
          <span style={{ color: '#8a98a4', font: '12px monospace' }}>{days[active].date}</span>
        </div>

        {next !== null ? (
          <button type="button" onClick={() => setActive(next)} aria-controls="cronograma-dias" style={navButton}>
            Ver {days[next].label} <ArrowRight size={18} aria-hidden="true" />
          </button>
        ) : <span />}
      </nav>

      <div id="cronograma-dias">
        {days.map((day, i) => (
          <section key={day.label} hidden={i !== active} aria-label={`${day.label}, ${day.date}`}>
            {day.content}
          </section>
        ))}
      </div>
    </>
  )
}

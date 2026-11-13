'use client'

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useLimaDate } from './live-clock'

export type ScheduleDay = {
  label: string
  /** Fecha legible, p. ej. "Jueves 19 de noviembre" */
  date: string
  /** Fecha ISO (YYYY-MM-DD) para abrir automáticamente el día en curso */
  isoDate: string
  content: ReactNode
}

/**
 * Pestañas de día (patrón WAI-ARIA Tabs). El contenido de todos los días llega ya
 * renderizado desde el servidor (está en el HTML para buscadores); aquí solo se
 * oculta el que no toca. Durante el evento se abre solo el día de hoy.
 */
export function DaySwitcher({ days }: { days: ScheduleDay[] }) {
  const [chosen, setChosen] = useState<number | null>(null)
  const today = useLimaDate()
  const todayIndex = days.findIndex((d) => d.isoDate === today)
  const active = chosen ?? (todayIndex >= 0 ? todayIndex : 0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (i: number, focus = false) => {
    setChosen(i)
    if (focus) tabs.current[i]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const last = days.length - 1
    const keys: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }
    if (e.key in keys) { e.preventDefault(); select(keys[e.key], true) }
  }

  return (
    <>
      <div className="cr-tabs-wrap">
        <div role="tablist" aria-label="Días del evento" className="cr-tabs" onKeyDown={onKeyDown}>
          {days.map((day, i) => {
            const selected = i === active
            return (
              <button
                key={day.label}
                ref={(el) => { tabs.current[i] = el }}
                type="button"
                role="tab"
                id={`tab-dia-${i}`}
                aria-selected={selected}
                aria-controls={`panel-dia-${i}`}
                tabIndex={selected ? 0 : -1}
                className="cr-tab"
                onClick={() => select(i)}
              >
                <span className="cr-tab__label">
                  {day.label}
                  {day.isoDate === today && <span className="cr-tab__today">Hoy</span>}
                </span>
                <span className="cr-tab__date">{day.date}</span>
              </button>
            )
          })}
        </div>
      </div>

      {days.map((day, i) => (
        <section
          key={day.label}
          role="tabpanel"
          id={`panel-dia-${i}`}
          aria-labelledby={`tab-dia-${i}`}
          hidden={i !== active}
          tabIndex={0}
          className="cr-panel"
        >
          {day.content}
        </section>
      ))}
    </>
  )
}

'use client'

import { useSyncExternalStore } from 'react'

/*
 * Reloj compartido por minuto en hora de Lima (UTC-5, sin horario de verano).
 * Un único intervalo para toda la página; en el servidor devuelve null, así el HTML
 * inicial nunca depende de la hora y no hay errores de hidratación.
 */

const LIMA_OFFSET_MIN = -5 * 60
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined

const currentMinute = () => Math.floor(Date.now() / 60000)

function subscribe(cb: () => void) {
  listeners.add(cb)
  if (!timer) timer = setInterval(() => listeners.forEach((l) => l()), 30_000)
  return () => {
    listeners.delete(cb)
    if (listeners.size === 0 && timer) { clearInterval(timer); timer = undefined }
  }
}

/** Minutos UTC desde epoch, o null durante el render del servidor. */
function useMinute(): number | null {
  return useSyncExternalStore(subscribe, currentMinute, () => null)
}

function toLima(minute: number) {
  const d = new Date((minute + LIMA_OFFSET_MIN) * 60000)
  return { date: d.toISOString().slice(0, 10), minutes: d.getUTCHours() * 60 + d.getUTCMinutes() }
}

const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }

/** Fecha de hoy en Lima (YYYY-MM-DD) o null en el servidor. */
export function useLimaDate() {
  const minute = useMinute()
  return minute === null ? null : toLima(minute).date
}

/** Muestra "EN VIVO" solo mientras la actividad está ocurriendo. */
export function LiveBadge({ date, start, end }: { date: string; start: string; end: string }) {
  const minute = useMinute()
  if (minute === null) return null
  const now = toLima(minute)
  if (now.date !== date || now.minutes < toMin(start) || now.minutes >= toMin(end)) return null
  return <span className="cr-live"><span className="cr-live__dot" aria-hidden="true" />En vivo</span>
}

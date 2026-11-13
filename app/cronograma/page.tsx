import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Coffee, Moon, Sun, UserRound, UtensilsCrossed, Video } from 'lucide-react'
import { DaySwitcher } from '@/components/cronograma/day-switcher'
import { LiveBadge } from '@/components/cronograma/live-clock'
import { UpaoEscudo } from '@/components/brand/upao-logo'

export const metadata: Metadata = {
  title: 'Cronograma — ROOT ACCESS',
  description: 'Programa oficial de Root Access 2026: 16 horas de conferencias y talleres prácticos de ciberseguridad. 19 y 20 de noviembre de 2026, UPAO, Trujillo.',
  alternates: { canonical: '/cronograma' },
}

/* Fuente: "Organizacion Root Access (1).xlsx" (10/11/2026), hojas Cronograma, Ponentes y Paneles. */

type Kind = 'Apertura' | 'Inauguración' | 'Conferencia' | 'Pausa' | 'Almuerzo' | 'Taller práctico' | 'Cierre' | 'Clausura'

type Item = {
  start: string
  end: string
  kind: Kind
  title: string
  who: string
  org?: string
  url?: string
  /** Ponente aún no confirmado según la columna "Confirmado" del cronograma */
  pending?: boolean
  /** Modalidad virtual según la columna "Modalidad" */
  virtual?: boolean
}

const COMITE = 'Comité Organizador RootAccess'

const PANEL_ORG = 'Estudiantes de Ingeniería de Sistemas · UPAO'

const day1Morning: Item[] = [
  { start: '08:30', end: '08:45', kind: 'Apertura', title: 'Ingreso y recepción de asistentes', who: 'Orquesta Sinfónica de la UPAO y Comité Organizador' },
  { start: '08:45', end: '09:00', kind: 'Inauguración', title: 'Inauguración oficial de RootAccess UPAO y palabras de bienvenida institucional', who: 'Autoridades UPAO (Dr. Vladimir Urrelo) y Dirección de Escuela ISIA' },
  { start: '09:00', end: '10:00', kind: 'Conferencia', title: 'De las aulas a la industria: retos del futuro ingeniero frente a las amenazas actuales', who: 'Panel 1', org: PANEL_ORG },
  { start: '10:00', end: '11:00', kind: 'Conferencia', title: 'Prevención de fraudes digitales y ciberseguridad en el sector microfinanciero', who: 'Nancy Tirado Merino', org: 'Caja Trujillo', url: 'https://www.linkedin.com/in/nancy-t-957434138/' },
  { start: '11:00', end: '11:15', kind: 'Pausa', title: 'Coffee break técnico y networking de asistentes', who: COMITE },
  { start: '11:15', end: '12:15', kind: 'Conferencia', title: 'Ciberdelitos, leyes y casos', who: 'Dr. Lenin Araujo', org: 'Fiscalía' },
  { start: '12:15', end: '13:15', kind: 'Conferencia', title: 'Ciberseguridad y resiliencia tecnológica en el sector minero', who: 'José Ishikawa Delgado', org: 'Gerente · Minera Gold Fields', virtual: true },
  { start: '13:15', end: '14:30', kind: 'Almuerzo', title: 'Receso de almuerzo libre e intercambio profesional', who: COMITE },
]

const day1Afternoon: Item[] = [
  { start: '14:30', end: '16:30', kind: 'Taller práctico', title: 'Análisis forense digital e investigación con Autopsy', who: 'Alonso Eduardo Caballero Quezada', org: 'Consultor y especialista en ciberseguridad', url: 'https://www.linkedin.com/in/alonsocaballeroquezada/' },
  { start: '16:30', end: '16:45', kind: 'Pausa', title: 'Pausa activa y receso técnico', who: COMITE },
  { start: '16:45', end: '18:45', kind: 'Taller práctico', title: 'Fundamentos para el análisis de malware: pensar como un analista', who: 'Grover Cordova', org: 'CEO & Founder · Security Labs' },
  { start: '18:45', end: '19:00', kind: 'Cierre', title: 'Cierre y balance de la primera jornada RootAccess', who: COMITE },
]

const day2Morning: Item[] = [
  { start: '08:30', end: '08:45', kind: 'Apertura', title: 'Ingreso y recepción de asistentes', who: COMITE },
  { start: '08:45', end: '09:00', kind: 'Inauguración', title: 'Inauguración oficial de RootAccess UPAO y palabras de bienvenida institucional', who: 'Autoridades UPAO (Ing. Jaime Díaz) y Dirección de Escuela ISIA' },
  { start: '09:00', end: '10:00', kind: 'Conferencia', title: 'Ciberseguridad, cloud, infraestructura e IA', who: 'Sandra Castillo', org: 'Huawei' },
  { start: '10:00', end: '11:00', kind: 'Conferencia', title: 'Ciberseguridad y continuidad operativa en la cadena agroindustrial', who: 'Carlos Alexis Pérez Rojas', org: 'Gerente de TI y Transformación Digital · Virú Group', url: 'https://www.linkedin.com/in/carlos-p%C3%A9rez-rojas-070777/' },
  { start: '11:00', end: '11:15', kind: 'Pausa', title: 'Coffee break y networking tecnológico', who: COMITE },
  { start: '11:15', end: '12:15', kind: 'Conferencia', title: 'De las aulas a la industria: retos del futuro ingeniero frente a las amenazas actuales', who: 'Panel 2', org: PANEL_ORG },
  { start: '12:15', end: '13:15', kind: 'Conferencia', title: 'Conferencia magistral: IA generativa y automatización en la ciberdefensa', who: 'Jesus Rosales', org: 'Consultor en ciberseguridad · México', url: 'https://www.linkedin.com/in/jesus-rosales-salinas/', virtual: true },
  { start: '13:15', end: '14:30', kind: 'Almuerzo', title: 'Receso de almuerzo libre', who: COMITE },
]

const day2Afternoon: Item[] = [
  { start: '14:30', end: '15:30', kind: 'Conferencia', title: 'Fortinet, tecnología de ciberseguridad, SOC y la IA', who: 'Ing. Jorge Vigil', org: 'Fortinet Perú', virtual: true },
  { start: '15:30', end: '16:30', kind: 'Conferencia', title: 'Estrategias de ciberdefensa ofensiva y gestión de vulnerabilidades empresariales', who: 'Cesar Augusto Farro Flores', org: 'Founder & CEO · NPROS Cyber Tech LATAM', url: 'https://www.linkedin.com/in/cesar-farro-flores/' },
  { start: '16:30', end: '16:45', kind: 'Pausa', title: 'Pausa activa y receso técnico', who: COMITE },
  { start: '16:45', end: '18:45', kind: 'Taller práctico', title: 'Arquitectura y despliegue de monitoreo centralizado con Wazuh SIEM', who: 'Edward Vega Gavidia', org: 'Profesor universitario', url: 'https://www.linkedin.com/in/edward-vega-gavidia/' },
  { start: '18:45', end: '19:15', kind: 'Clausura', title: 'Ceremonia oficial de clausura, entrega de certificados y reconocimientos', who: 'Autoridades UPAO (Ing. Jaime Díaz / Dr. Vladimir Urrelo) y Comité Organizador' },
]

/** Horas netas por tipo, calculadas desde los horarios para que nunca se desfasen del cronograma. */
function hoursOf(items: Item[], kind: Kind) {
  const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
  return items.filter((it) => it.kind === kind).reduce((acc, it) => acc + toMin(it.end) - toMin(it.start), 0) / 60
}

const fmtH = (h: number) => `${Number.isInteger(h) ? h : h.toFixed(1)} h`

function summary(items: Item[]) {
  return { conf: hoursOf(items, 'Conferencia'), taller: hoursOf(items, 'Taller práctico') }
}

const day1Totals = summary([...day1Morning, ...day1Afternoon])
const day2Totals = summary([...day2Morning, ...day2Afternoon])
const totalConf = day1Totals.conf + day2Totals.conf
const totalTaller = day1Totals.taller + day2Totals.taller

/** Familia visual de cada tipo: define color, peso y forma de la fila. */
type Group = 'talk' | 'workshop' | 'ceremony' | 'logistic' | 'break'

const GROUP_OF: Record<Kind, Group> = {
  Apertura: 'logistic',
  Inauguración: 'ceremony',
  Conferencia: 'talk',
  Pausa: 'break',
  Almuerzo: 'break',
  'Taller práctico': 'workshop',
  Cierre: 'logistic',
  Clausura: 'ceremony',
}

const LEGEND: { group: Group; label: string }[] = [
  { group: 'talk', label: 'Conferencia' },
  { group: 'workshop', label: 'Taller práctico' },
  { group: 'ceremony', label: 'Ceremonia' },
  { group: 'break', label: 'Receso' },
]

const duration = (it: Item) => {
  const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
  const min = toMin(it.end) - toMin(it.start)
  return min % 60 === 0 ? `${min / 60} h` : min > 60 ? `${Math.floor(min / 60)} h ${min % 60} min` : `${min} min`
}

function Speaker({ it }: { it: Item }) {
  return (
    <p className="cr-who">
      <UserRound size={14} aria-hidden="true" />
      {it.url ? (
        <a href={it.url} target="_blank" rel="noopener noreferrer">
          {it.who}<ArrowUpRight size={12} aria-hidden="true" /><span className="sr-only"> (LinkedIn, abre en otra pestaña)</span>
        </a>
      ) : <span className="cr-who__name">{it.who}</span>}
      {it.org && <span className="cr-who__org">· {it.org}</span>}
    </p>
  )
}

function ScheduleBlock({ items, isoDate }: { items: Item[]; isoDate: string }) {
  return (
    <ol className="cr-list">
      {items.map((it) => {
        const group = GROUP_OF[it.kind]
        const live = <LiveBadge date={isoDate} start={it.start} end={it.end} />

        if (group === 'break') {
          const Icon = it.kind === 'Almuerzo' ? UtensilsCrossed : Coffee
          return (
            <li key={it.start} className="cr-break">
              <span className="cr-break__time"><time>{it.start}</time><span aria-hidden="true">–</span><span className="sr-only"> hasta las </span><time>{it.end}</time></span>
              <Icon size={15} aria-hidden="true" />
              <span className="cr-break__title">{it.title}</span>
              {live}
            </li>
          )
        }

        return (
          <li key={it.start} className={`cr-item cr-item--${group}`}>
            <div className="cr-time">
              <time className="cr-time__start">{it.start}</time>
              <span className="cr-time__end"><span className="sr-only">hasta las </span><time>{it.end}</time></span>
              <span className="cr-time__dur">{duration(it)}</span>
            </div>
            <div className="cr-body">
              <div className="cr-tags">
                <span className="cr-kind">{it.kind}</span>
                {it.virtual && <span className="cr-tag cr-tag--virtual"><Video size={11} aria-hidden="true" /> Virtual</span>}
                {it.pending && <span className="cr-tag cr-tag--pending">Por confirmar</span>}
                {live}
              </div>
              <h4 className="cr-title">{it.title}</h4>
              <Speaker it={it} />
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function DaySchedule({ theme, isoDate, morning, afternoon }: { theme: string; isoDate: string; morning: Item[]; afternoon: Item[] }) {
  const all = [...morning, ...afternoon]
  const t = summary(all)
  const talleres = all.filter((it) => it.kind === 'Taller práctico').length
  const conferencias = all.filter((it) => it.kind === 'Conferencia').length
  return (
    <>
      <div className="cr-day-head">
        <p className="cr-day-theme">{theme}</p>
        <ul className="cr-stats" aria-label="Resumen del día">
          <li className="cr-stat cr-stat--talk"><b>{conferencias}</b> conferencias · {fmtH(t.conf)}</li>
          <li className="cr-stat cr-stat--workshop"><b>{talleres}</b> {talleres === 1 ? 'taller' : 'talleres'} · {fmtH(t.taller)}</li>
        </ul>
      </div>
      <div className="cr-grid">
        <div>
          <h3 className="cr-half"><Sun size={20} aria-hidden="true" style={{ color: '#fbbf24' }} /> Jornada mañana</h3>
          <ScheduleBlock items={morning} isoDate={isoDate} />
        </div>
        <div>
          <h3 className="cr-half"><Moon size={20} aria-hidden="true" style={{ color: '#60a5fa' }} /> Jornada tarde</h3>
          <ScheduleBlock items={afternoon} isoDate={isoDate} />
        </div>
      </div>
    </>
  )
}

const DAY1 = '2026-11-19'
const DAY2 = '2026-11-20'

const days = [
  { label: 'Día 1', date: 'Jueves 19 de noviembre', isoDate: DAY1, content: <DaySchedule theme="Ciberdefensa, análisis forense y resiliencia operativa" isoDate={DAY1} morning={day1Morning} afternoon={day1Afternoon} /> },
  { label: 'Día 2', date: 'Viernes 20 de noviembre', isoDate: DAY2, content: <DaySchedule theme="Gobierno, SIEM, Red Team e infraestructuras críticas" isoDate={DAY2} morning={day2Morning} afternoon={day2Afternoon} /> },
]

export default function CronogramaPage() {
  return (
    <main className="site-shell cr-page">
      <div className="noise" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      <div className="cr-container">
        <div className="cr-topbar">
          <Link href="/" className="cr-back">
            <ArrowLeft size={16} aria-hidden="true" /> Volver al inicio
          </Link>
          <div className="brand-lockup brand-lockup--small">
            <span className="cr-topbar__name">ROOT <b>ACCESS</b></span>
            <span className="brand-lockup__divider" aria-hidden="true" />
            <UpaoEscudo size={48} />
          </div>
        </div>

        <header className="cr-header">
          <h1 className="cr-h1">Cronograma<br /><span>Detallado.</span></h1>
          <p className="cr-total">
            <b>{fmtH(totalConf + totalTaller).replace(' h', ' horas')}</b> netas · {fmtH(totalConf)} de conferencias + {fmtH(totalTaller)} de talleres prácticos
          </p>
          <ul className="cr-legend" aria-label="Tipos de actividad">
            {LEGEND.map(({ group, label }) => (
              <li key={group} className={`cr-legend__item cr-legend__item--${group}`}>{label}</li>
            ))}
          </ul>
        </header>

        <DaySwitcher days={days} />
      </div>
    </main>
  )
}

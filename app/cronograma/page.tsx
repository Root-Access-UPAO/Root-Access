import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Sun, Moon, UserRound } from 'lucide-react'
import { DaySwitcher } from '@/components/cronograma/day-switcher'

export const metadata: Metadata = {
  title: 'Cronograma — ROOT ACCESS',
  description: 'Programa oficial de Root Access 2026: 16 horas de conferencias y talleres prácticos de ciberseguridad. 19 y 20 de noviembre de 2026, UPAO, Trujillo.',
  alternates: { canonical: '/cronograma' },
}

/* Fuente: "Organizacion Root Access.xlsx", hojas Cronograma y Ponentes. */

type Kind = 'Apertura' | 'Inauguración' | 'Conferencia' | 'Pausa' | 'Almuerzo' | 'Taller práctico' | 'Cierre' | 'Clausura'

type Item = {
  start: string
  end: string
  kind: Kind
  title: string
  who: string
  org?: string
  url?: string
  /** Ponente aún no confirmado según la hoja Ponentes */
  pending?: boolean
}

const COMITE = 'Comité Organizador RootAccess'

const day1Morning: Item[] = [
  { start: '08:00', end: '08:30', kind: 'Apertura', title: 'Ingreso y recepción de asistentes (amenizado por la Orquesta Sinfónica de la UPAO)', who: 'Orquesta Sinfónica de la UPAO y Comité Organizador' },
  { start: '08:30', end: '09:00', kind: 'Inauguración', title: 'Inauguración oficial de RootAccess UPAO y palabras de bienvenida institucional', who: 'Autoridades UPAO y Dirección de Escuela ISIA' },
  { start: '09:00', end: '10:00', kind: 'Conferencia', title: 'Ciberseguridad y resiliencia tecnológica en el sector minero', who: 'José Ishikawa Delgado', org: 'Gerente · Minera Goldfields' },
  { start: '10:00', end: '11:00', kind: 'Conferencia', title: 'Ciberseguridad y continuidad operativa en la cadena agroindustrial', who: 'Carlos Alexis Pérez Rojas', org: 'Gerente de TI y Transformación Digital · Virú Group', url: 'https://www.linkedin.com/in/carlos-p%C3%A9rez-rojas-070777/' },
  { start: '11:00', end: '11:15', kind: 'Pausa', title: 'Coffee break técnico y networking de asistentes', who: COMITE },
  { start: '11:15', end: '12:15', kind: 'Conferencia', title: 'Prevención de fraudes digitales y ciberseguridad en el sector microfinanciero', who: 'Reynaldo Rodriguez Garcia', org: 'Oficial de Seguridad · Caja Trujillo', url: 'https://www.linkedin.com/in/reynaldo-rodriguez-garc%C3%ADa-49b26189/' },
  { start: '12:15', end: '13:15', kind: 'Conferencia', title: 'Estrategias de ciberdefensa ofensiva y gestión de vulnerabilidades empresariales', who: 'Cesar Augusto Farro Flores', org: 'Founder & CEO · NPROS Cyber Tech LATAM', url: 'https://www.linkedin.com/in/cesar-farro-flores/' },
  { start: '13:15', end: '14:30', kind: 'Almuerzo', title: 'Receso de almuerzo libre e intercambio profesional', who: COMITE },
]

const day1Afternoon: Item[] = [
  { start: '14:30', end: '16:30', kind: 'Taller práctico', title: 'Análisis forense digital e investigación con Autopsy', who: 'Alonso Eduardo Caballero Quezada', org: 'Consultor y especialista en ciberseguridad', url: 'https://www.linkedin.com/in/alonsocaballeroquezada/' },
  { start: '16:30', end: '16:45', kind: 'Pausa', title: 'Pausa activa y receso técnico', who: COMITE },
  { start: '16:45', end: '18:45', kind: 'Taller práctico', title: 'Hardening y bastionado de servidores en infraestructuras críticas', who: 'Jesus Rosales', org: 'Consultor en ciberseguridad · México', url: 'https://www.linkedin.com/in/jesus-rosales-salinas/', pending: true },
  { start: '18:45', end: '19:00', kind: 'Cierre', title: 'Cierre y balance de la primera jornada RootAccess', who: COMITE },
]

const day2Morning: Item[] = [
  { start: '08:30', end: '09:00', kind: 'Apertura', title: 'Recepción de asistentes, registro y resumen ejecutivo del Día 1', who: COMITE },
  { start: '09:00', end: '10:00', kind: 'Conferencia', title: 'Gobierno corporativo de ciberseguridad, compliance y gestión del riesgo CISO', who: 'Fiorella D. (virtual)', org: 'CISO · Ferreyros', url: 'https://www.linkedin.com/in/fiorella-d-9b80051a/' },
  { start: '10:00', end: '11:00', kind: 'Conferencia', title: 'Investigación de delitos informáticos y cadena de custodia de evidencia digital', who: 'Autoridad PNP', org: 'Fiscalía Especializada', pending: true },
  { start: '11:00', end: '11:15', kind: 'Pausa', title: 'Coffee break y networking tecnológico', who: COMITE },
  { start: '11:15', end: '12:15', kind: 'Conferencia', title: 'Protección de infraestructuras críticas y ciberseguridad en entornos OT/ICS', who: 'Betsy Córdova Veliz', org: 'Jefa de Seguridad de la Información · ENGIE', url: 'https://www.linkedin.com/in/betsy-cordova-veliz/', pending: true },
  { start: '12:15', end: '13:15', kind: 'Conferencia', title: 'Conferencia magistral: IA generativa y automatización en la ciberdefensa', who: 'Panel de expertos y especialistas RootAccess UPAO' },
  { start: '13:15', end: '14:30', kind: 'Almuerzo', title: 'Receso de almuerzo libre y networking', who: COMITE },
]

const day2Afternoon: Item[] = [
  { start: '14:30', end: '16:30', kind: 'Taller práctico', title: 'Arquitectura y despliegue de monitoreo centralizado con Wazuh SIEM', who: 'Edward Vega Gavidia', org: 'Profesor universitario', url: 'https://www.linkedin.com/in/edward-vega-gavidia/' },
  { start: '16:30', end: '16:45', kind: 'Pausa', title: 'Pausa activa y receso técnico', who: COMITE },
  { start: '16:45', end: '18:45', kind: 'Taller práctico', title: 'Simulación de ciberataques en entornos corporativos (Red Team)', who: 'Grover Cordova', org: 'CEO & Founder · Security Labs' },
  { start: '18:45', end: '19:15', kind: 'Clausura', title: 'Ceremonia oficial de clausura, entrega de certificados y reconocimientos', who: 'Autoridades UPAO y Comité Organizador' },
]

const KIND_COLOR: Record<Kind, string> = {
  Apertura: '#8a98a4',
  Inauguración: '#fbbf24',
  Conferencia: 'var(--cyan)',
  Pausa: '#8a98a4',
  Almuerzo: '#8a98a4',
  'Taller práctico': '#a78bfa',
  Cierre: '#8a98a4',
  Clausura: '#fbbf24',
}

function ScheduleBlock({ items }: { items: Item[] }) {
  return (
    <ol style={{ display: 'flex', flexDirection: 'column', gap: '15px', listStyle: 'none', margin: 0, padding: 0 }}>
      {items.map((it) => {
        const isBreak = it.kind === 'Pausa' || it.kind === 'Almuerzo'
        return (
          <li key={it.start} style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: '20px', background: isBreak ? 'transparent' : 'rgba(2, 4, 8, 0.4)', border: `1px ${isBreak ? 'dashed' : 'solid'} var(--line)`, padding: '16px 20px', borderRadius: '8px', alignItems: 'center' }}>
            <div style={{ color: 'var(--cyan)', font: 'bold 15px monospace', borderRight: '1px solid var(--line)', paddingRight: '16px', lineHeight: 1.5 }}>
              <time>{it.start}</time>
              <span style={{ display: 'block', color: '#5d6b77', fontWeight: 'normal', fontSize: '12px' }}>
                <span className="sr-only">hasta las </span><time>{it.end}</time>
              </span>
            </div>
            <div>
              <span style={{ display: 'inline-block', color: KIND_COLOR[it.kind], font: 'bold 10px monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>
                {it.kind}
              </span>
              <h4 style={{ margin: '0 0 6px 0', font: 'bold 15px/1.35 Arial', color: isBreak ? '#b4c0ca' : 'var(--white)' }}>{it.title}</h4>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', color: '#8a98a4', font: '13px Arial' }}>
                <UserRound size={13} style={{ color: 'var(--cyan)' }} aria-hidden="true" />
                {it.url ? (
                  <a href={it.url} target="_blank" rel="noopener noreferrer" style={{ color: '#d6e2ea', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    {it.who}<ArrowUpRight size={12} aria-hidden="true" /><span className="sr-only"> (LinkedIn, abre en otra pestaña)</span>
                  </a>
                ) : <span style={{ color: isBreak ? '#8a98a4' : '#d6e2ea' }}>{it.who}</span>}
                {it.org && <span>· {it.org}</span>}
                {it.pending && (
                  <span style={{ color: '#fbbf24', border: '1px solid rgba(251,191,36,.35)', borderRadius: '4px', padding: '0 6px', font: 'bold 10px monospace', letterSpacing: '0.08em' }}>
                    POR CONFIRMAR
                  </span>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function DaySchedule({ theme, morning, afternoon }: { theme: string; morning: Item[]; afternoon: Item[] }) {
  return (
    <>
      <p style={{ textAlign: 'center', color: '#b4c0ca', font: 'bold 13px monospace', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '-25px 0 40px' }}>
        {theme} · 4 h de conferencias + 4 h de talleres
      </p>
      <div className="schedule-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#e2e8f0', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
            <Sun size={20} style={{ color: '#fbbf24' }} aria-hidden="true" />
            <h3 style={{ margin: 0, font: 'bold 18px Arial', letterSpacing: '0.05em' }}>JORNADA MAÑANA</h3>
          </div>
          <ScheduleBlock items={morning} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#e2e8f0', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
            <Moon size={20} style={{ color: '#60a5fa' }} aria-hidden="true" />
            <h3 style={{ margin: 0, font: 'bold 18px Arial', letterSpacing: '0.05em' }}>JORNADA TARDE</h3>
          </div>
          <ScheduleBlock items={afternoon} />
        </div>
      </div>
    </>
  )
}

const days = [
  { label: 'Día 1', date: 'Jueves 19 de noviembre', content: <DaySchedule theme="Ciberdefensa, análisis forense y resiliencia operativa" morning={day1Morning} afternoon={day1Afternoon} /> },
  { label: 'Día 2', date: 'Viernes 20 de noviembre', content: <DaySchedule theme="Gobierno, SIEM, Red Team e infraestructuras críticas" morning={day2Morning} afternoon={day2Afternoon} /> },
]

export default function CronogramaPage() {
  return (
    <main className="site-shell" style={{ display: 'block', minHeight: '100vh', padding: '60px 20px' }}>
      <style>{`
        .schedule-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .schedule-grid { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>
      <div className="noise" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--cyan)', font: '12px monospace', textDecoration: 'none', marginBottom: '40px', transition: 'opacity 0.2s' }}>
          <ArrowLeft size={16} aria-hidden="true" /> Volver al inicio
        </Link>

        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ font: '900 clamp(2.5rem, 6vw, 4rem) Arial', letterSpacing: '-0.04em', margin: 0, lineHeight: 1 }}>Cronograma<br /><span style={{ color: 'var(--cyan)' }}>Detallado.</span></h1>
          <p style={{ color: '#8a98a4', font: '14px monospace', margin: '16px 0 0' }}>
            16 horas netas · 8 h de conferencias + 8 h de talleres prácticos
          </p>
        </header>

        <DaySwitcher days={days} />
      </div>
    </main>
  )
}

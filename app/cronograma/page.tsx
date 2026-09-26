'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Sun, Moon } from 'lucide-react'
import Link from 'next/link'

const day1Morning = [
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
]

const day1Afternoon = [
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

const day2Morning = [
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
]

const day2Afternoon = [
  ['13:40', 'Reapertura y asignación definitiva de miniproyectos', 'Coordinador'],
  ['13:50', 'Desarrollo de Miniproyectos (Pentesting, Hardening, Análisis)', 'Equipos y Mentores'],
  ['15:50', 'Break corto', '—'],
  ['16:05', 'Presentación de miniproyectos (Pitch de 4 min por equipo)', 'Equipos'],
  ['16:55', 'Clausura, evaluación, reconocimientos y certificados', 'Autoridades'],
]

export default function CronogramaPage() {
  const [activeDay, setActiveDay] = useState(1)

  const renderScheduleBlock = (items: string[][]) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {items.map(([time, title, detail], idx) => (
        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '20px', background: 'rgba(2, 4, 8, 0.4)', border: '1px solid var(--line)', padding: '16px 20px', borderRadius: '8px', alignItems: 'center' }}>
          <div style={{ color: 'var(--cyan)', font: 'bold 16px monospace', borderRight: '1px solid var(--line)', paddingRight: '20px' }}>
            {time}
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px 0', font: 'bold 15px Arial', color: 'var(--white)' }}>{title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8a98a4', font: '13px Arial' }}>
              <CheckCircle2 size={13} style={{ color: 'var(--cyan)' }} /> {detail}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <main className="site-shell" style={{ display: 'block', minHeight: '100vh', padding: '60px 20px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .schedule-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .schedule-grid { grid-template-columns: 1fr; gap: 40px; }
        }
      `}} />
      <div className="noise" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--cyan)', font: '12px monospace', textDecoration: 'none', marginBottom: '40px', transition: 'opacity 0.2s' }}>
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ font: '900 clamp(2.5rem, 6vw, 4rem) Arial', letterSpacing: '-0.04em', margin: 0, lineHeight: 1 }}>Cronograma<br /><span style={{ color: 'var(--cyan)' }}>Detallado.</span></h1>
        </header>

        {/* Day Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(6, 10, 16, 0.7)', border: '1px solid var(--line)', borderRadius: '12px', padding: '15px 25px', marginBottom: '50px' }}>
          {activeDay === 2 ? (
            <button onClick={() => setActiveDay(1)} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', color: '#8a98a4', cursor: 'pointer', font: 'bold 14px Arial' }}>
              <ArrowLeft size={18} /> Ver Día 1
            </button>
          ) : <div />}

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: 0, color: 'var(--cyan)', font: 'bold 22px Arial' }}>
              DÍA {activeDay}
            </h2>
            <span style={{ color: '#8a98a4', font: '12px monospace' }}>
              {activeDay === 1 ? 'Jueves 19 de Noviembre' : 'Viernes 20 de Noviembre'}
            </span>
          </div>

          {activeDay === 1 ? (
            <button onClick={() => setActiveDay(2)} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', color: '#8a98a4', cursor: 'pointer', font: 'bold 14px Arial' }}>
              Ver Día 2 <ArrowRight size={18} />
            </button>
          ) : <div />}
        </div>

        {/* Schedule Content */}
        <div className="schedule-grid">
          {/* Morning Block */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#e2e8f0', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
              <Sun size={20} style={{ color: '#fbbf24' }} />
              <h3 style={{ margin: 0, font: 'bold 18px Arial', letterSpacing: '0.05em' }}>JORNADA MAÑANA</h3>
            </div>
            {renderScheduleBlock(activeDay === 1 ? day1Morning : day2Morning)}
          </div>

          {/* Afternoon Block */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#e2e8f0', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
              <Moon size={20} style={{ color: '#60a5fa' }} />
              <h3 style={{ margin: 0, font: 'bold 18px Arial', letterSpacing: '0.05em' }}>JORNADA TARDE</h3>
            </div>
            {renderScheduleBlock(activeDay === 1 ? day1Afternoon : day2Afternoon)}
          </div>
        </div>

      </div>
    </main>
  )
}

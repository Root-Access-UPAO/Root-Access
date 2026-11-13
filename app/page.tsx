import Link from 'next/link'
import Image from 'next/image'
import { SiteHeader } from '@/components/home/site-header'
import { ReserveLink } from '@/components/registro/reserve-link'
import { UpaoEscudo } from '@/components/brand/upao-logo'
import { FirstEdition } from '@/components/home/first-edition'
import { SiteFooter } from '@/components/home/site-footer'
import { CountdownTimer, DatamoshGlitch, ElectricTitle, GlitchImage, LightningBolts } from '@/components/home/effects'
import {
  ArrowUpRight,
  CalendarDays,
  Globe2,
  Network,
  ShieldCheck,
  TerminalSquare,
  Zap,
  Skull,
  AlertTriangle,
  Eye,
  Quote,
} from 'lucide-react'

/* Autoridades de la Escuela de Ingeniería de Sistemas e IA (UPAO). */
const AUTHORITIES = [
  { name: 'Dr. Vladimir Urrelo', initials: 'VU', role: 'Director de la Escuela de Ingeniería de Sistemas e IA' },
  { name: 'Ing. Jaime Díaz', initials: 'JD', role: 'Autoridad · Escuela de Ingeniería de Sistemas e IA' },
]

/* "La seguridad empieza con una pregunta": cada pregunta se responde en una sesión real. */
const QUESTIONS: { q: string; day: string; workshop: boolean; where: string }[] = [
  { q: '¿Cómo se investiga un fraude digital después de que ocurre?', day: 'Día 1', workshop: true, where: 'Análisis forense con Autopsy' },
  { q: '¿Qué hace un analista frente a un malware desconocido?', day: 'Día 1', workshop: true, where: 'Fundamentos de análisis de malware' },
  { q: '¿Cómo se detecta un ataque antes de que cause daño?', day: 'Día 2', workshop: true, where: 'Monitoreo centralizado con Wazuh SIEM' },
  { q: '¿Cómo piensa alguien que quiere entrar a tu red?', day: 'Día 2', workshop: false, where: 'Ciberdefensa ofensiva y vulnerabilidades' },
]

/* Cada área muestra sesiones reales del cronograma (app/cronograma/page.tsx). */
type TopicSession = { when: string; what: string }
const topics: { icon: typeof ShieldCheck; code: string; title: string; text: string; hasWorkshop?: boolean; sessions: TopicSession[] }[] = [
  {
    icon: ShieldCheck, code: '01', title: 'Resiliencia Sectorial',
    text: 'Cómo la minería, la agroindustria y las microfinanzas sostienen su operación frente a amenazas reales.',
    sessions: [
      { when: 'Día 1 · 09:00', what: 'Fraudes digitales · Caja Trujillo' },
      { when: 'Día 2 · 10:00', what: 'Cadena agroindustrial · Virú Group' },
    ],
  },
  {
    icon: TerminalSquare, code: '02', title: 'Análisis Forense', hasWorkshop: true,
    text: 'Investigación práctica de evidencia digital con Autopsy y fundamentos para analizar malware.',
    sessions: [
      { when: 'Día 1 · 14:30', what: 'Taller: forense con Autopsy' },
      { when: 'Día 1 · 16:45', what: 'Taller: análisis de malware' },
    ],
  },
  {
    icon: Network, code: '03', title: 'SIEM y Monitoreo', hasWorkshop: true,
    text: 'Despliegue de monitoreo centralizado con Wazuh y operación de un SOC apoyado en IA.',
    sessions: [
      { when: 'Día 2 · 14:30', what: 'SOC e IA · Fortinet Perú' },
      { when: 'Día 2 · 16:45', what: 'Taller: Wazuh SIEM' },
    ],
  },
  {
    icon: AlertTriangle, code: '04', title: 'Red Team',
    text: 'Ciberdefensa ofensiva: pensar como el atacante para gestionar las vulnerabilidades de una empresa.',
    sessions: [{ when: 'Día 2 · 15:30', what: 'Ciberdefensa ofensiva · NPROS' }],
  },
  {
    icon: Zap, code: '05', title: 'IA & Ciberdefensa',
    text: 'IA generativa, cloud e infraestructura: cómo la automatización está cambiando la defensa.',
    sessions: [
      { when: 'Día 2 · 09:00', what: 'Cloud, infraestructura e IA · Huawei' },
      { when: 'Día 2 · 12:15', what: 'Conferencia magistral · IA generativa' },
    ],
  },
  {
    icon: Globe2, code: '06', title: 'Gobierno y Delitos',
    text: 'Ciberdelitos, marco legal y casos reales vistos desde quienes los investigan.',
    sessions: [
      { when: 'Día 1 · 10:15', what: 'Ciberdelitos, leyes y casos · Fiscalía' },
      { when: 'Día 2 · 11:15', what: 'Fraude móvil y privacidad · Claro' },
    ],
  },
]

/* ==========================================
   Page
   ========================================== */
export default function Page() {
  return (
    <main className="site-shell">
      <div className="noise" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      {/* FULLSCREEN DATAMOSH GLITCH */}
      <DatamoshGlitch />

      {/* RANDOM LIGHTNING BOLTS */}
      <LightningBolts />

      <SiteHeader />

      <section className="hero" id="inicio">
        <div className="grid-glow" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse-dot" /> Conferencia de ciberseguridad · 2026</div>
          <div className="threat-level">
            <AlertTriangle size={13} />
            <span>THREAT LEVEL:</span>
            <span className="threat-critical">CRITICAL</span>
            <span className="threat-bars"><i /><i /><i /><i /><i /></span>
          </div>
          <ElectricTitle />
          <p style={{ marginTop: '15px', color: '#8298a4', font: '13px/1.6 Arial', maxWidth: '400px' }}>
            Ciberdelincuencia y resiliencia digital: el sector público y privado frente a las amenazas de la región.
          </p>
          <div className="hero-actions">
            <ReserveLink className="button button-primary">Inscribirme ahora <ArrowUpRight size={17} /></ReserveLink>
            <Link className="button button-outline" href="/cronograma"><CalendarDays size={15} /> Ver cronograma</Link>
          </div>
          <div className="hero-meta"><span><CalendarDays size={15} /> 19 Y 20 NOV 2026</span><span><Globe2 size={15} /> Trujillo, Perú</span></div>
        </div>
        <div className="hero-art">
          <div className="radar radar-one" /><div className="radar radar-two" />
          <GlitchImage />
          <div className="terminal-note note-left"><span>STATUS // ONLINE</span><br />root@access:~$ _</div>
          <div className="terminal-note note-right">ENCRYPTION<br /><b>AES-256</b><br /><span>● SECURE</span></div>
          <div className="skull-watermark" aria-hidden="true">
            <Skull size={180} strokeWidth={0.3} />
          </div>
        </div>

        <div className="warning-badge badge-1" aria-hidden="true">
          <Eye size={11} /> MONITORING ACTIVE
        </div>
        <div className="warning-badge badge-2" aria-hidden="true">
          <Skull size={11} /> INTRUSION DETECTED
        </div>
      </section>

      <FirstEdition />

      <section className="manifesto section-pad">
        <div className="manifesto-grid">
          <div className="manifesto-lead">
            <p className="kicker">{'// Por qué Root Access'}</p>
            <h2>La seguridad<br />empieza con <span>una pregunta.</span></h2>
            <p className="large-copy">Root Access es el punto de encuentro para quienes no esperan a que ocurra un ataque para empezar a defender.</p>
            <p className="manifesto-body">Una jornada de aprendizaje, estrategia y conexión para la próxima generación de profesionales digitales. Sin humo. Sin atajos. Solo conocimiento accionable.</p>
          </div>
          <div className="questions">
            <div className="questions__bar" aria-hidden="true">
              <span className="questions__dots"><i /><i /><i /></span>
              <span className="questions__path">root@access:~/preguntas</span>
            </div>
            <div className="questions__inner">
              <p className="questions__title">Preguntas que vas a responder</p>
              <ol className="questions__list">
                {QUESTIONS.map((q, i) => (
                  <li key={q.q} className={q.workshop ? 'question question--workshop' : 'question'}>
                    <span className="question__idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span className="question__body">
                      <span className="question__text">{q.q}</span>
                      <span className="question__meta">
                        <span className="question__chip">{q.day}</span>
                        <span className="question__chip question__chip--kind">{q.workshop ? 'Taller práctico' : 'Conferencia'}</span>
                        <span className="question__where">{q.where}</span>
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="questions__footer">
                <span className="questions__live" aria-hidden="true" /> Respuestas en vivo · 19 y 20 de noviembre
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="topics section-pad" id="temas">
        <div className="section-heading">
          <div><h2>Áreas de <span>acceso</span></h2></div>
        </div>
        <ul className="topic-legend" aria-label="Formato">
          <li className="topic-legend__talk">Conferencia</li>
          <li className="topic-legend__workshop">Incluye taller práctico</li>
        </ul>
        <ul className="topic-grid">
          {topics.map(({ icon: Icon, code, title, text, hasWorkshop, sessions }) => (
            <li key={code}>
              <article className={hasWorkshop ? 'topic-card topic-card--workshop' : 'topic-card'}>
                <div className="topic-card__top">
                  <span className="topic-card__icon"><Icon size={24} strokeWidth={1.6} aria-hidden="true" /></span>
                  <span className="topic-code">{code}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <ul className="topic-sessions" aria-label={`Sesiones de ${title}`}>
                  {sessions.map((s) => (
                    <li key={s.when}><time>{s.when}</time><span>{s.what}</span></li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="speaker section-pad" id="ponente">
        <div className="speaker-portrait" style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="candado-wrapper">
            <Image src="/candado.webp" alt="Seguridad y Defensa" width={1200} height={800} unoptimized className="candado-glitch" />
          </div>
        </div>
        <div className="speaker-copy">
          <p className="kicker">{'// Quiénes lo hacen posible'}</p>
          <h2>La defensa<br />es un <span>oficio.</span></h2>
          <figure className="quote-card">
            <Quote className="quote-card__mark" size={34} aria-hidden="true" />
            <blockquote>El atacante solo necesita acertar una vez. Tu trabajo es estar preparado todas las demás.</blockquote>
            <figcaption>
              <span className="quote-card__avatar" aria-hidden="true">CF</span>
              <span className="quote-card__who"><strong>Ing. César Farro</strong><span>Coordinador y Docente de Ciberseguridad · UPAO</span></span>
            </figcaption>
          </figure>
          <div className="authorities">
            <div className="authorities__head">
              <UpaoEscudo size={30} />
              <p className="authorities__kicker">Con el respaldo de la Escuela de Ingeniería de Sistemas e IA</p>
            </div>
            <ul className="authorities__list">
              {AUTHORITIES.map((a) => (
                <li key={a.name} className="authority">
                  <span className="authority__avatar" aria-hidden="true">{a.initials}</span>
                  <span className="authority__text"><strong>{a.name}</strong><span>{a.role}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="register section-pad" id="registro" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', textAlign: 'center' }}>
        <div>
          <h2 style={{ fontSize: '3rem', margin: '15px 0 0 0' }}>Tu acceso<br />está <span style={{ color: 'var(--cyan)' }}>listo.</span></h2>
        </div>
        <div className="countdown-center">
          <CountdownTimer wrapperClass="countdown big-countdown" />
        </div>
        <ReserveLink className="button button-primary button-lg">
          Inscribirme ahora <ArrowUpRight size={20} />
        </ReserveLink>
      </section>

      <SiteFooter />
    </main>
  )
}

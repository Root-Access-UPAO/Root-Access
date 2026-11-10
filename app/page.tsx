import Link from 'next/link'
import Image from 'next/image'
import { SiteHeader } from '@/components/home/site-header'
import { INSCRIPCION_URL } from '@/lib/links'
import { CountdownTimer, DatamoshGlitch, ElectricTitle, GlitchImage, LightningBolts } from '@/components/home/effects'
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Globe2,
  Network,
  ShieldCheck,
  TerminalSquare,
  Zap,
  Skull,
  AlertTriangle,
  Eye,
} from 'lucide-react'

const topics = [
  { icon: ShieldCheck, code: '01', title: 'Resiliencia Sectorial', text: 'Minería, agroindustria y microfinanzas frente a amenazas reales.' },
  { icon: TerminalSquare, code: '02', title: 'Análisis Forense', text: 'Investigación práctica de evidencia digital con Autopsy.' },
  { icon: Network, code: '03', title: 'SIEM y Hardening', text: 'Monitoreo centralizado con Wazuh y bastionado de servidores.' },
  { icon: AlertTriangle, code: '04', title: 'Red Team', text: 'Simulación de ciberataques en entornos corporativos.' },
  { icon: Zap, code: '05', title: 'IA & Ciberdefensa', text: 'IA generativa y automatización de la defensa.' },
  { icon: Globe2, code: '06', title: 'Gobierno y Delitos', text: 'Gestión del riesgo, compliance y cadena de custodia digital.' },
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
            <a className="button button-primary" href={INSCRIPCION_URL}>Inscribirme ahora <ArrowUpRight size={17} /></a>
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
        <div className="scroll-indicator"><span /> Scroll to explore</div>

        <div className="warning-badge badge-1" aria-hidden="true">
          <Eye size={11} /> MONITORING ACTIVE
        </div>
        <div className="warning-badge badge-2" aria-hidden="true">
          <Skull size={11} /> INTRUSION DETECTED
        </div>
      </section>

      <section className="manifesto section-pad">
        <div className="manifesto-grid">
          <h2>La seguridad<br />empieza con <span>una pregunta.</span></h2>
          <div><p className="large-copy">Root Access es el punto de encuentro para quienes no esperan a que ocurra un ataque para empezar a defender.</p><p>Una jornada de aprendizaje, estrategia y conexión para la próxima generación de profesionales digitales. Sin humo. Sin atajos. Solo conocimiento accionable.</p><a className="arrow-link" href="#temas">Descubre el programa <ArrowUpRight size={18} /></a></div>
        </div>
      </section>

      <section className="topics section-pad" id="temas">
        <div className="section-heading"><div><h2>Áreas de <span>acceso</span></h2></div><p>Seis perspectivas.<br />Una misma misión.</p></div>
        <div className="topic-grid">{topics.map(({ icon: Icon, code, title, text }) => <article className="topic-card" key={code}><span className="topic-code">{code}</span><Icon size={25} strokeWidth={1.4} /><h3>{title}</h3><p>{text}</p><ArrowUpRight className="card-arrow" size={17} /></article>)}</div>
      </section>

      <section className="speaker section-pad" id="ponente">
        <div className="speaker-portrait" style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="candado-wrapper">
            <Image src="/candado.webp" alt="Seguridad y Defensa" width={1200} height={800} unoptimized className="candado-glitch" />
          </div>
        </div>
        <div className="speaker-copy">
          <h2>La defensa<br />es un <span>oficio.</span></h2>
          <p className="large-copy">&ldquo;El atacante solo necesita acertar una vez. Tu trabajo es estar preparado todas las demás.&rdquo;</p>
          <div className="speaker-name">
            <strong>Ing. César Farro</strong><span>Coordinador y Docente de Ciberseguridad · UPAO</span>
          </div>
          <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#8298a4' }}>
            <p style={{ color: 'var(--cyan)' }}>Ponentes confirmados:</p>
            <ul style={{ marginTop: '8px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <li>José Ishikawa Delgado – Minera Goldfields</li>
              <li>Carlos Alexis Pérez Rojas – Virú Group</li>
              <li>Reynaldo Rodriguez Garcia – Caja Trujillo</li>
              <li>Grover Cordova – Security Labs</li>
              <li>Alonso Caballero Quezada – Análisis forense digital</li>
              <li>Edward Vega Gavidia – Wazuh SIEM</li>
            </ul>
          </div>
          <Link className="arrow-link" href="/cronograma" style={{ marginTop: '20px' }}>Ver Cronograma Completo <ArrowUpRight size={18} /></Link>
        </div>
      </section>

      <section className="register section-pad" id="registro" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', textAlign: 'center' }}>
        <div>
          <h2 style={{ fontSize: '3rem', margin: '15px 0 0 0' }}>Tu acceso<br />está <span style={{ color: 'var(--cyan)' }}>listo.</span></h2>
        </div>
        <div className="countdown-center">
          <CountdownTimer wrapperClass="countdown big-countdown" />
        </div>
        <a className="button button-primary" href={INSCRIPCION_URL} style={{ fontSize: '1.2rem', padding: '15px 40px' }}>
          Inscribirme ahora <ArrowUpRight size={20} />
        </a>
      </section>

      <footer className="footer" id="ubicacion"><div className="footer-brand"><div className="wordmark" style={{ display: 'flex', alignItems: 'center' }}><Image src="/cuervo-logo.png" alt="" width={55} height={55} style={{ height: '55px', width: 'auto', marginRight: '15px', objectFit: 'contain' }} /><span>ROOT <b>ACCESS</b></span></div><p>Conferencia de ciberseguridad<br />Universidad Privada Antenor Orrego</p></div><div className="footer-location"><p>Campus UPAO · Trujillo, Perú<br />19 y 20 de noviembre, 2026</p></div><div className="footer-social"><a href="#instagram" aria-label="Instagram"><Globe2 size={18} /></a><a href="#linkedin" aria-label="LinkedIn"><Network size={18} /></a><a href="#top" aria-label="Volver arriba"><ArrowUpRight size={18} /></a></div><div className="footer-bottom"><span>© 2026 ROOT ACCESS</span><span>POWERED BY UPAO <Check size={14} /></span></div></footer>
    </main>
  )
}

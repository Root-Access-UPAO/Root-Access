import Image from 'next/image'
import { ArrowUpRight, CalendarDays, Clock, MapPin } from 'lucide-react'
import { UpaoWordmark } from '@/components/brand/upao-logo'
import { ReserveLink } from '@/components/registro/reserve-link'

const MAPS_URL = 'https://maps.app.goo.gl/tmt1U71iSXMKRmEU6'

/** Pie de página. Lleva id="ubicacion" porque el menú "Ubicación" apunta aquí. */
export function SiteFooter() {
  return (
    <footer className="site-footer" id="ubicacion">
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <a className="wordmark" href="#inicio" aria-label="Root Access, volver al inicio">
            <Image src="/cuervo-logo.png" alt="" width={48} height={48} style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
            <span>ROOT <b>ACCESS</b></span>
          </a>
          <p className="site-footer__tagline">El conocimiento también es una forma de defensa.</p>
          <p className="site-footer__muted">Conferencia de ciberseguridad · 1.ª edición</p>
        </div>

        <div>
          <p className="site-footer__title">Evento</p>
          <ul className="site-footer__list">
            <li><CalendarDays size={16} aria-hidden="true" /> 19 y 20 de noviembre, 2026</li>
            <li><Clock size={16} aria-hidden="true" /> Desde las 08:30</li>
            <li><MapPin size={16} aria-hidden="true" /> Campus UPAO · Trujillo, Perú</li>
          </ul>
          <a className="site-footer__maps" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
            Cómo llegar <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (Google Maps, abre en otra pestaña)</span>
          </a>
        </div>

        <nav aria-label="Secciones">
          <p className="site-footer__title">Explora</p>
          <ul className="site-footer__list site-footer__list--links">
            <li><a href="#temas">Áreas de acceso</a></li>
            <li><a href="#ponente">Quiénes lo hacen posible</a></li>
            <li><ReserveLink className="site-footer__reserve">Reservar lugar <ArrowUpRight size={14} aria-hidden="true" /></ReserveLink></li>
          </ul>
        </nav>

        <div className="site-footer__org">
          <p className="site-footer__title">Organiza</p>
          <UpaoWordmark height={64} />
          <p className="site-footer__muted">Escuela de Ingeniería de Sistemas e Inteligencia Artificial</p>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>© 2026 Root Access · Universidad Privada Antenor Orrego</span>
      </div>
    </footer>
  )
}

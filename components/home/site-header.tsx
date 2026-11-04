'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const NAV = [
  ['Temas', 'temas'],
  ['Ponente', 'ponente'],
  ['Ubicación', 'ubicacion'],
] as const

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="topbar">
      <a className="wordmark" href="#inicio" aria-label="Root Access, inicio" style={{ display: 'flex', alignItems: 'center' }}>
        <Image src="/cuervo-logo.png" alt="" width={55} height={55} style={{ height: '55px', width: 'auto', marginRight: '15px', objectFit: 'contain' }} />
        <span>ROOT <b>ACCESS</b></span>
      </a>
      <nav id="nav-principal" className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Navegación principal">
        <Link href="/cronograma" onClick={() => setMenuOpen(false)}>Agenda</Link>
        {NAV.map(([label, id]) => (
          <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
        <Link href="/inscripcion" className="nav-cta" onClick={() => setMenuOpen(false)}>Reservar lugar <ArrowUpRight size={15} /></Link>
      </nav>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="nav-principal">
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  )
}

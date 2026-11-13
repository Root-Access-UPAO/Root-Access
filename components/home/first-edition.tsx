import Image from 'next/image'
import { UpaoWordmark } from '@/components/brand/upao-logo'

/* Cifras tomadas del cronograma oficial (app/cronograma/page.tsx). */
const FACTS = [
  { value: '01', label: 'Primera edición' },
  { value: '2', label: 'Días de evento' },
  { value: '16 h', label: 'De conferencias y talleres' },
  { value: '11', label: 'Especialistas invitados' },
]

/**
 * Sección institucional: destaca a la UPAO como organizadora y que Root Access
 * es su primer evento de ciberseguridad. El escudo va a color sobre placa blanca
 * (la única pieza del sitio con el azul institucional original).
 */
export function FirstEdition() {
  return (
    <section className="first-ed section-pad" aria-labelledby="first-ed-title">
      <div className="first-ed__grid">
        {/* Columna de marca: escudo + "Organiza UPAO" juntos, como un solo bloque institucional */}
        <div className="first-ed__brand">
          <div className="first-ed__seal">
            <div className="first-ed__ring" aria-hidden="true" />
            <div className="first-ed__plate">
              {/* Mismo glitch que el candado de "La defensa es un oficio" (capas RGB en ::before/::after) */}
              <div className="escudo-glitch">
                <Image src="/upao-escudo.png" alt="Escudo de la Universidad Privada Antenor Orrego" width={201} height={201} className="first-ed__escudo" />
              </div>
            </div>
            <span className="first-ed__stamp">1.ª edición · 2026</span>
          </div>
          <div className="first-ed__org">
            <span>Organiza</span>
            <UpaoWordmark height={84} />
          </div>
        </div>

        <div className="first-ed__copy">
          <p className="first-ed__kicker">Hacemos historia en la UPAO</p>
          <h2 id="first-ed-title">
            Por primera vez, la UPAO <span>abre sus puertas a la ciberseguridad.</span>
          </h2>
          <p className="first-ed__lead">
            Root Access es el <strong>primer evento de ciberseguridad</strong> organizado por la
            Universidad Privada Antenor Orrego. Una iniciativa de la Escuela de Ingeniería de Sistemas
            e Inteligencia Artificial que reúne a la academia, la industria y el sector público en Trujillo.
          </p>
          <p className="first-ed__lead first-ed__lead--secondary">
            Durante dos días, estudiantes, docentes y profesionales compartirán el mismo espacio con
            especialistas de organizaciones como <strong>Caja Trujillo, Huawei, Fortinet, Virú Group y Gold Fields</strong>,
            además de representantes de la Fiscalía. No solo habrá charlas: también habrá talleres prácticos de
            análisis forense, análisis de malware y monitoreo con Wazuh SIEM, para que lo aprendido se lleve
            directo al teclado.
          </p>
          <p className="first-ed__sub">
            Es la primera edición, y queremos que sea el inicio de una tradición. Sé parte del comienzo.
          </p>

          <ul className="first-ed__facts">
            {FACTS.map((f) => (
              <li key={f.label}><b>{f.value}</b><span>{f.label}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

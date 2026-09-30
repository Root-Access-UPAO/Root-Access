const fs = require('fs');
let content = fs.readFileSync('app/inscripcion/page.tsx', 'utf8');

if (!content.includes('import { Skull }')) {
  content = content.replace('import { enviarInscripcion } from \'@/lib/inscripcion-api\'', 'import { enviarInscripcion } from \'@/lib/inscripcion-api\'\nimport { Skull } from \'lucide-react\'');
}

const newCinematic = `function HackCinematic({ phase }: { phase: number }) {
  const [blocks, setBlocks] = useState<{id: number, delay: number}[]>([])
  const [loadingDots, setLoadingDots] = useState(0)

  useEffect(() => {
    if (phase === 3) {
      const b = Array.from({length: 100}).map((_, i) => ({
        id: i,
        delay: Math.random() * 2.5
      }))
      setBlocks(b)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 3) {
      const interval = setInterval(() => setLoadingDots(v => (v + 1) % 10), 300)
      return () => clearInterval(interval)
    }
  }, [phase])

  if (phase === 0 || phase === 5) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'black', opacity: phase >= 4 ? 0 : 1, transition: phase >= 4 ? 'opacity 0.5s' : 'none' }}></div>
      
      {phase === 3 && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gridTemplateRows: 'repeat(10, 1fr)' }}>
          {blocks.map(b => (
            <div key={b.id} style={{ backgroundColor: 'black', animation: \\\`fadeOutBlock 0.1s steps(1) forwards\\\`, animationDelay: \\\`\${b.delay}s\\\` }}></div>
          ))}
        </div>
      )}

      {phase === 1 && (
        <div className="datamosh-attack datamosh-active" style={{ display: 'block' }}>
          <div className="datamosh-overlay"></div>
          <div className="datamosh-canvas">
            <div className="glitch-box b1"></div>
            <div className="glitch-box b2"></div>
            <div className="glitch-box b3"></div>
            <div className="glitch-box b4"></div>
            <div className="glitch-box b5"></div>
          </div>
          <div className="datamosh-skull">
            <Skull size={400} strokeWidth={0.5} />
          </div>
        </div>
      )}

      {phase === 2 && (
        <div className="datamosh-attack datamosh-active" style={{ display: 'block', mixBlendMode: 'normal' }}>
          <div className="datamosh-overlay"></div>
          <div className="error-text-glitch" data-text="ERROR EL SISTEMA ESTA SIENDO VULNERADO" style={{ fontSize: '70px', width: '100vw', whiteSpace: 'normal', lineHeight: '1.2' }}>
            ERROR EL SISTEMA ESTA SIENDO VULNERADO
          </div>
        </div>
      )}

      {(phase === 3 || phase === 4) && (
        <div style={{ position: 'relative', zIndex: 30, background: '#010204', padding: '20px', border: '2px solid #62d5ff', textAlign: 'center', fontFamily: '"Press Start 2P", monospace' }}>
          {phase === 3 ? (
            <>
              <div style={{ color: '#1aa8ff', marginBottom: '10px' }}>recuperando sistema ...</div>
              <div style={{ color: '#62d5ff', fontSize: '20px' }}>
                [{Array.from({length: 10}).map((_,i) => i <= loadingDots ? '■' : '□').join('')}]
              </div>
            </>
          ) : (
            <div style={{ color: '#39ff88', fontSize: '18px' }}>sistema recuperado</div>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: \\\`
        @keyframes fadeOutBlock {
          to { opacity: 0; }
        }
      \\\`}} />
    </div>
  )
}`;

// using regex to replace the function definition, regardless of its previous content
content = content.replace(/function HackCinematic\(\{ phase \}: \{ phase: number \}\) \{[\s\S]*?^}$/m, newCinematic);
fs.writeFileSync('app/inscripcion/page.tsx', content, 'utf8');

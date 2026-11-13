import Image from 'next/image'

const UPAO_NAME = 'Universidad Privada Antenor Orrego'

/**
 * Logos oficiales UPAO. Los PNG originales son azul institucional sobre transparente;
 * sobre el fondo oscuro del sitio se muestran en blanco monocromático (clase .upao-mono).
 */
export function UpaoEscudo({ size = 44, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/upao-escudo.png"
      alt={UPAO_NAME}
      width={size}
      height={size}
      className={`upao-mono ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

export function UpaoWordmark({ height = 48, className = '' }: { height?: number; className?: string }) {
  // Proporción del archivo original: 380 × 150
  const width = Math.round((height * 380) / 150)
  return (
    <Image
      src="/upao-wordmark.png"
      alt={UPAO_NAME}
      width={width}
      height={height}
      className={`upao-mono ${className}`}
      style={{ width, height }}
    />
  )
}

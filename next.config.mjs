const isDev = process.env.NODE_ENV !== 'production'

// Origen del backend (p. ej. http://localhost:8080) para permitirlo en connect-src.
let apiOrigin = ''
if (process.env.NEXT_PUBLIC_API_URL) {
  try {
    apiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL).origin
  } catch {
    throw new Error(`NEXT_PUBLIC_API_URL no es una URL válida: ${process.env.NEXT_PUBLIC_API_URL}`)
  }
}

// Next.js inyecta scripts inline para la hidratación; sin nonces hace falta 'unsafe-inline'.
// 'unsafe-eval' y ws: solo en desarrollo (React Refresh / HMR).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob:",
  `connect-src 'self'${apiOrigin ? ` ${apiOrigin}` : ''}${isDev ? ' ws: wss:' : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Solo si la API ya es HTTPS: con http://localhost forzaría https y rompería las pruebas locales.
  ...(!isDev && !apiOrigin.startsWith('http:') ? ['upgrade-insecure-requests'] : []),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  ...(isDev ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]),
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  // La inscripción ahora es por Google Forms (misma URL que lib/links.ts). Temporal (307) por si se vuelve al formulario propio.
  async redirects() {
    return [{ source: '/inscripcion', destination: 'https://forms.gle/A1wTM6cuhYgTfreQ7', permanent: false }]
  },
}

export default nextConfig

import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const title = 'ROOT ACCESS — Conferencia de Ciberseguridad'
const description = 'El conocimiento también es una forma de defensa. Root Access, conferencia de ciberseguridad UPAO. 19 y 20 de noviembre de 2026, Trujillo.'

export const metadata: Metadata = {
  // URL pública del sitio: necesaria para que og:image sea absoluta (WhatsApp/LinkedIn la exigen).
  // En Vercel, VERCEL_PROJECT_PRODUCTION_URL trae el dominio de producción sin "https://".
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000'),
  ),
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    siteName: 'ROOT ACCESS',
    title,
    description,
    url: '/',
  },
  twitter: { card: 'summary_large_image', title, description },
  icons: {
    icon: '/cuervo-icon.png',
    apple: '/cuervo-apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

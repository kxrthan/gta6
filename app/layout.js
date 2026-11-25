import { Bebas_Neue, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LoadingScreen from '@/components/ui/LoadingScreen'
import NewsTicker from '@/components/ui/NewsTicker'
import BackToTop from '@/components/ui/BackToTop'
import { ToastProvider } from '@/components/ui/Toast'
import { MapModalProvider } from '@/components/ui/MapModalContext'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://gta6fanpage.com'),
  title: {
    default: 'GTA 6 Fan Hub | News, Cheats, Guides & Vice City Intel',
    template: '%s | GTA 6 Fan Hub',
  },
  description: 'Your ultimate source for GTA 6 news, verified cheat codes, daily guides, interactive map intel, and Vice City blogs.',
  keywords: ['GTA 6', 'Grand Theft Auto 6', 'GTA VI', 'cheat codes', 'Vice City', 'Rockstar Games', 'PS5 cheats', 'Xbox cheats', 'PC cheats', 'Lucia', 'Jason'],
  authors: [{ name: 'GTA 6 Fan Hub Team' }],
  creator: 'GTA 6 Fan Hub',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://gta6fanpage.com',
    siteName: 'GTA 6 Fan Hub',
    title: 'GTA 6 Fan Hub | News, Cheats, Guides & Vice City Intel',
    description: 'Your ultimate source for GTA 6 news, cheat codes, guides, and blog posts.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GTA 6 Fan Hub Vice City' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTA 6 Fan Hub',
    description: 'Your ultimate source for GTA 6 news, cheat codes, guides, and blog posts.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable} dark`} suppressHydrationWarning>
      <body className="bg-gta-dark text-white antialiased min-h-screen selection:bg-gta-pink selection:text-white">
        <ToastProvider>
          <MapModalProvider>
            <LoadingScreen />
            <NewsTicker />
            <Navbar />
            <div className="pt-24 min-h-screen flex flex-col justify-between">
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <BackToTop />
          </MapModalProvider>
        </ToastProvider>
      </body>
    </html>
  )
}

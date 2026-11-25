import { Shield, Sparkles, Terminal } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'About GTA 6 Fan Hub | Mission, Tech Stack & Disclaimer',
  description: 'Learn about GTA 6 Fan Hub — an independent daily publication covering Grand Theft Auto VI news, cheat codes, guides, and Vice City culture.',
}

export default function AboutPage() {
  const features = [
    {
      title: 'Daily Curated Dispatches',
      desc: 'We track every official Rockstar press release, developer interview, patent filing, and credible insider leak.',
    },
    {
      title: 'Verified Cheat Codes Database',
      desc: 'Every cheat code in our catalog is rigorously verified on real consoles (PS5, Xbox) and PC rigs.',
    },
    {
      title: 'Open Source Spirit',
      desc: 'Built with modern web standards — Next.js 14 App Router, Tailwind CSS, Framer Motion, and markdown-driven SSG.',
    },
    {
      title: '100% Unofficial & Fan-Powered',
      desc: 'Created by hardcore GTA fans since the PS2 era who cannot wait for the return to Vice City.',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-gta-purple/40 bg-gta-purple/10 text-gta-purple text-xs font-heading tracking-[0.25em] mb-4">
          <Sparkles size={14} />
          OUR STORY & PHILOSOPHY
        </div>
        <h1 className="font-heading text-5xl sm:text-7xl text-white tracking-wide mb-4">
          ABOUT <span className="gradient-text">GTA 6 FAN HUB</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          The ultimate community destination for Grand Theft Auto VI enthusiasts, speedrunners, and lore masters.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="card-gta p-6 sm:p-10 space-y-8 text-gray-300 font-body leading-relaxed mb-10">
        <div>
          <h2 className="font-heading text-3xl text-white tracking-wide mb-3">
            THE VICE CITY DREAM
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-gray-300">
            For over two decades, Vice City has held a legendary spot in gaming culture. When Rockstar Games confirmed
            the return to Leonida with Lucia and Jason, we knew the fan community needed a dedicated home.
            GTA 6 Fan Hub was designed from the ground up to bring back that neon sunset vibe with state-of-the-art web performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
          {features.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-gta-dark/70 border border-gta-border/60">
              <h3 className="font-heading text-lg text-gta-teal mb-1">{item.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack Spotlight */}
        <div className="pt-6 border-t border-gta-border/60">
          <h2 className="font-heading text-2xl text-gta-pink mb-4 flex items-center gap-2">
            <Terminal size={20} />
            POWERED BY MODERN WEB TECH
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-center">
            <div className="p-3 rounded-lg bg-gta-dark border border-gta-border">
              <span className="text-white block font-bold">Next.js 14</span>
              <span className="text-gray-500 text-[10px]">App Router & SSG</span>
            </div>
            <div className="p-3 rounded-lg bg-gta-dark border border-gta-border">
              <span className="text-white block font-bold">Tailwind CSS</span>
              <span className="text-gray-500 text-[10px]">Custom GTA Theme</span>
            </div>
            <div className="p-3 rounded-lg bg-gta-dark border border-gta-border">
              <span className="text-white block font-bold">Framer Motion</span>
              <span className="text-gray-500 text-[10px]">Neon Animations</span>
            </div>
            <div className="p-3 rounded-lg bg-gta-dark border border-gta-border">
              <span className="text-white block font-bold">MDX + Gray Matter</span>
              <span className="text-gray-500 text-[10px]">Daily Blogging</span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-5 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-gray-400 leading-relaxed">
          <div className="flex items-center gap-2 font-heading text-sm text-red-400 uppercase tracking-wider mb-2">
            <Shield size={16} />
            LEGAL DISCLAIMER & TRADEMARK ATTRIBUTION
          </div>
          <p>
            GTA 6 Fan Hub is an independent, non-commercial fan website created by enthusiasts for the gaming community.
            Grand Theft Auto, GTA, Vice City, and Rockstar Games logos and character likenesses are registered trademarks
            of Rockstar Games and Take-Two Interactive Software, Inc. This website is not endorsed by, sponsored by, or
            affiliated with Rockstar Games or Take-Two Interactive in any manner.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link href="/contact" className="gta-btn-primary inline-block">
          CONTACT THE EDITORIAL TEAM
        </Link>
      </div>
    </div>
  )
}

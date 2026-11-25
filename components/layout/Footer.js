import Link from 'next/link'

const footerLinks = {
  content: [
    { href: '/blog', label: 'Blog & Dispatches' },
    { href: '/news', label: 'Breaking News' },
    { href: '/guides', label: 'Field Guides' },
    { href: '/cheats', label: 'Cheat Codes Database' },
    { href: '/vehicles', label: 'Cars & Police Cruisers' },
    { href: '/characters', label: 'Character & VCPD Dossiers' },
  ],
  pages: [
    { href: '/map', label: 'Vice City Map' },
    { href: '/about', label: 'About Project' },
    { href: '/contact', label: 'Contact Command' },
  ],
}

// Inline SVGs for social platforms
function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function YoutubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function DiscordIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-gta-navy border-t border-gta-border/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-3">
              <span className="font-heading text-4xl gradient-text">
                GTA<span className="text-gta-pink neon-text-pink">VI</span> FAN HUB
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-md font-body">
              The premier independent destination for daily Grand Theft Auto VI news, verified cheat codes,
              interactive map exploration, and comprehensive guides for Leonida and Vice City.
            </p>
            <div className="text-xs text-gray-500 border border-gta-border/60 rounded-xl p-4 bg-gta-card/40 max-w-md font-body">
              ⚠️ <strong className="text-gray-400">Fan Site Disclaimer:</strong> This is an unofficial fan site.
              Not affiliated with, endorsed by, or connected to Rockstar Games, Take-Two Interactive, or any of their
              subsidiaries. Grand Theft Auto and GTA VI are registered trademarks of Take-Two Interactive.
            </div>
          </div>

          {/* Content Links */}
          <div>
            <h3 className="font-heading text-lg text-gta-pink mb-4 tracking-wider uppercase">
              DISPATCHES
            </h3>
            <ul className="space-y-2.5 font-body">
              {footerLinks.content.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-gta-teal transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Page Links + Social */}
          <div>
            <h3 className="font-heading text-lg text-gta-purple mb-4 tracking-wider uppercase">
              NETWORK
            </h3>
            <ul className="space-y-2.5 mb-6 font-body">
              {footerLinks.pages.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-gta-teal transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-heading text-sm text-gta-teal mb-3 tracking-widest uppercase">
              TRANSMIT / FOLLOW
            </h3>
            <div className="flex gap-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on X / Twitter"
                className="p-2.5 bg-gta-card border border-gta-border rounded-lg hover:border-gta-pink hover:text-gta-pink text-gray-400 transition-all"
              >
                <XIcon />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe on YouTube"
                className="p-2.5 bg-gta-card border border-gta-border rounded-lg hover:border-red-500 hover:text-red-400 text-gray-400 transition-all"
              >
                <YoutubeIcon />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join Discord"
                className="p-2.5 bg-gta-card border border-gta-border rounded-lg hover:border-indigo-500 hover:text-indigo-400 text-gray-400 transition-all"
              >
                <DiscordIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gta-border/60 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 font-body">
          <p className="text-gray-500 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} GTA 6 Fan Hub · Built for Vice City Fans Worldwide.
          </p>
          <div className="flex gap-6 text-xs text-gray-500 font-heading tracking-wider">
            <Link href="/sitemap.xml" className="hover:text-gta-teal transition-colors">
              SITEMAP.XML
            </Link>
            <Link href="/robots.txt" className="hover:text-gta-teal transition-colors">
              ROBOTS.TXT
            </Link>
            <Link href="/rss.xml" className="hover:text-gta-teal transition-colors">
              RSS FEED
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

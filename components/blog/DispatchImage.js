import Image from 'next/image'

export default function DispatchImage({ src, alt, mainCaption, subCaption, caption, title }) {
  let actualSub = subCaption || ''
  let actualMain = mainCaption || caption || ''

  // Fallbacks from title or alt if formatted like "Sub // Main"
  if (!actualSub && !actualMain) {
    const raw = title || alt || ''
    if (raw.includes('//')) {
      const parts = raw.split('//').map((p) => p.trim())
      actualSub = parts[0]
      actualMain = parts.slice(1).join(' // ')
    } else {
      actualMain = raw
      actualSub = 'LEONIDA INTELLIGENCE DATABASE'
    }
  }

  const imageSrc = src || '/images/posts/map-coords.jpg'
  const altText = alt || actualMain || 'Dispatch Intel'

  return (
    <figure className="my-8 not-prose">
      <div className="relative w-full aspect-[16/9] sm:h-[400px] rounded-2xl overflow-hidden border border-gta-border/80 shadow-2xl bg-black group">
        <Image
          src={imageSrc}
          alt={altText}
          fill
          className="object-cover object-center brightness-[0.95] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 800px"
        />

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

        {/* Scanline / Telemetry Texture Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-30" />

        {/* Top telemetry badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className="px-2.5 py-1 rounded bg-black/85 border border-gta-teal/50 text-gta-teal font-mono text-[10px] tracking-widest uppercase backdrop-blur-md shadow-md">
            EVIDENCE CAPTURE
          </span>
        </div>

        {/* Bottom Dual On-Image Captions */}
        <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between">
          <div className="space-y-1 max-w-[85%]">
            {actualSub && (
              <span className="font-heading text-xs tracking-widest text-gta-teal uppercase block drop-shadow font-semibold">
                {actualSub}
              </span>
            )}
            {actualMain && (
              <h4 className="font-heading text-xl sm:text-2xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-bold tracking-wide leading-tight">
                {actualMain}
              </h4>
            )}
          </div>
        </div>
      </div>
    </figure>
  )
}

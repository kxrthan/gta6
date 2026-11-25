'use client'
import { motion } from 'framer-motion'

export default function CarCruiseAnimation() {
  // Trajectory for the top-view U-shaped pursuit:
  // Starts at the FEATURED DISPATCH section on the left border ->
  // moves slowly down the left margin to the starter of the footer section ->
  // turns right across the starter of the footer section ->
  // moves slowly up the right margin and ends at the FEATURED DISPATCH section.
  // Slow, smooth cruise with top-down (birds-eye) car SVGs and zero track background.

  const pathLeft = [
    '5.5vw',  // 0: Start at FEATURED DISPATCH (left border)
    '5.5vw',  // 1: Fades in at FEATURED DISPATCH
    '5.5vw',  // 2: Descending left margin (past vehicles)
    '5.5vw',  // 3: Mid-page left margin (cheats)
    '5.5vw',  // 4: Lower left margin (categories)
    '7vw',    // 5: Reaching starter of footer, curving right
    '12vw',   // 6: Rounding corner
    '25vw',   // 7: Cruising horizontally above footer
    '50vw',   // 8: Center above footer
    '75vw',   // 9: Cruising right above footer
    '90vw',   // 10: Approaching right corner
    '94vw',   // 11: Rounding corner up
    '94.5vw', // 12: Ascending right margin
    '94.5vw', // 13: Mid-page right margin
    '94.5vw', // 14: Approaching FEATURED DISPATCH
    '94.5vw', // 15: Reaches FEATURED DISPATCH (right border)
    '94.5vw', // 16: Ends at FEATURED DISPATCH
  ]

  const pathTop = [
    '0.5%',   // 0: FEATURED DISPATCH section start
    '2.5%',   // 1: Fades in
    '25%',    // 2: Descending left margin
    '55%',    // 3: Mid-page left margin
    '85%',    // 4: Lower left margin
    '93%',    // 5: Starter of footer section
    '96.5%',  // 6: Rounding corner
    '97.5%',  // 7: Cruising horizontally above footer
    '97.5%',  // 8: Center above footer
    '97.5%',  // 9: Cruising right above footer
    '96.5%',  // 10: Approaching right corner
    '93%',    // 11: Rounding corner up
    '85%',    // 12: Ascending right margin
    '55%',    // 13: Mid-page right margin
    '25%',    // 14: Approaching FEATURED DISPATCH
    '1.5%',   // 15: Reaches FEATURED DISPATCH
    '0.5%',   // 16: Ends at FEATURED DISPATCH
  ]

  // Default SVG faces UP (0 deg).
  // Down: 180 deg | Right: 90 deg | Up: 0 deg
  const pathRotate = [
    180,      // 0: Facing down
    180,      // 1: Facing down
    180,      // 2: Facing down
    180,      // 3: Facing down
    180,      // 4: Facing down
    155,      // 5: Curving right
    120,      // 6: Curving right
    90,       // 7: Facing right
    90,       // 8: Facing right
    90,       // 9: Facing right
    65,       // 10: Curving up
    30,       // 11: Curving up
    0,        // 12: Facing up
    0,        // 13: Facing up
    0,        // 14: Facing up
    0,        // 15: Facing up (FEATURED DISPATCH)
    0,        // 16: Ends facing up
  ]

  const pathOpacity = [
    0,        // 0: Fades in at FEATURED DISPATCH
    1,        // 1
    1,        // 2
    1,        // 3
    1,        // 4
    1,        // 5
    1,        // 6
    1,        // 7
    1,        // 8
    1,        // 9
    1,        // 10
    1,        // 11
    1,        // 12
    1,        // 13
    1,        // 14
    1,        // 15
    0,        // 16: Fades out at FEATURED DISPATCH
  ]

  const pathTimes = [
    0.0,
    0.03,
    0.15,
    0.30,
    0.44,
    0.48,
    0.51,
    0.55,
    0.60,
    0.65,
    0.68,
    0.72,
    0.77,
    0.86,
    0.93,
    0.98,
    1.0,
  ]

  // Slow, smooth cruise pace (34 seconds loop)
  const animationDuration = 34

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-20 bg-transparent select-none">
      {/* 1. Lucia & Jason's GTA 6 Sports Getaway Car (TOP-DOWN VIEW) */}
      <motion.div
        initial={{ left: '5.5vw', top: '0.5%', opacity: 0 }}
        animate={{
          left: pathLeft,
          top: pathTop,
          opacity: pathOpacity,
        }}
        transition={{
          duration: animationDuration,
          times: pathTimes,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: '56px', height: '112px' }}
      >
        <motion.div
          animate={{ rotate: pathRotate }}
          transition={{
            duration: animationDuration,
            times: pathTimes,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-full h-full relative flex items-center justify-center"
          style={{ transformOrigin: 'center center' }}
        >
          {/* Animated Twin Nitro Jet Flames trailing from rear exhausts */}
          <motion.div
            animate={{ scaleY: [1, 1.7, 0.9, 1.5], opacity: [0.75, 1, 0.6, 0.95] }}
            transition={{ duration: 0.22, repeat: Infinity }}
            className="absolute -bottom-4 left-[18px] w-2.5 h-6 bg-gradient-to-b from-gta-teal via-blue-500 to-transparent rounded-full blur-[1px]"
          />
          <motion.div
            animate={{ scaleY: [1.3, 1.5, 0.8, 1.7], opacity: [0.8, 1, 0.5, 0.9] }}
            transition={{ duration: 0.22, repeat: Infinity, delay: 0.05 }}
            className="absolute -bottom-4 right-[18px] w-2.5 h-6 bg-gradient-to-b from-gta-teal via-blue-500 to-transparent rounded-full blur-[1px]"
          />

          {/* Top-Down Sports Car SVG Graphic */}
          <svg width="56" height="112" viewBox="0 0 70 140" fill="none" className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            <defs>
              <linearGradient id="topCarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF2E88" />
                <stop offset="50%" stopColor="#7B2FF7" />
                <stop offset="100%" stopColor="#FF8A3D" />
              </linearGradient>
              <linearGradient id="headBeamL" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="headBeamR" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
              </linearGradient>
              <filter id="pinkGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
              </filter>
            </defs>

            {/* Neon Pink Underglow surrounding chassis */}
            <ellipse cx="35" cy="70" rx="30" ry="58" fill="#FF2E88" opacity="0.85" filter="url(#pinkGlow)" />

            {/* 4 Wide Racing Tires (Top-Down) */}
            {/* Front-Left Tire */}
            <rect x="6" y="24" width="7" height="22" rx="3.5" fill="#0A0A12" stroke="#00E5FF" strokeWidth="0.8" />
            {/* Front-Right Tire */}
            <rect x="57" y="24" width="7" height="22" rx="3.5" fill="#0A0A12" stroke="#00E5FF" strokeWidth="0.8" />
            {/* Rear-Left Tire */}
            <rect x="4" y="88" width="9" height="26" rx="4" fill="#0A0A12" stroke="#FF2E88" strokeWidth="0.8" />
            {/* Rear-Right Tire */}
            <rect x="57" y="88" width="9" height="26" rx="4" fill="#0A0A12" stroke="#FF2E88" strokeWidth="0.8" />

            {/* Aerodynamic Sports Car Chassis (Top-Down Silhouette) */}
            <path
              d="M35 10
                 C27 10 21 14 17 22
                 C13 30 14 44 15 54
                 C15 62 14 74 12 84
                 C10 94 11 110 16 122
                 C20 128 27 129 35 129
                 C43 129 50 128 54 122
                 C59 110 60 94 58 84
                 C56 74 55 62 55 54
                 C56 44 57 30 53 22
                 C49 14 43 10 35 10 Z"
              fill="url(#topCarGrad)"
              stroke="#FF2E88"
              strokeWidth="0.8"
            />

            {/* Front Hood Vents */}
            <path d="M28 26 L32 36 L30 36 L26 26 Z" fill="#06060C" opacity="0.8" />
            <path d="M42 26 L38 36 L40 36 L44 26 Z" fill="#06060C" opacity="0.8" />

            {/* Curved Front Windshield with Cyan Tint */}
            <path
              d="M18 52 C27 47 43 47 52 52 L48 68 C40 65 30 65 22 68 Z"
              fill="#06060C"
              stroke="#00E5FF"
              strokeWidth="1"
            />
            {/* Specular glass reflection */}
            <path d="M22 54 L32 50 L28 66 L23 66 Z" fill="#00E5FF" opacity="0.4" />

            {/* Sleek Carbon Fiber Roof */}
            <path d="M22 68 L48 68 L46 90 L24 90 Z" fill="#12121E" stroke="#FF2E88" strokeWidth="0.6" />
            <line x1="35" y1="69" x2="35" y2="89" stroke="#FF2E88" strokeWidth="0.8" opacity="0.6" />

            {/* Rear Vented Engine Cover & Louvers */}
            <path d="M24 91 L46 91 L44 112 L26 112 Z" fill="#06060C" stroke="#00E5FF" strokeWidth="0.6" />
            <line x1="28" y1="96" x2="42" y2="96" stroke="#FF8A3D" strokeWidth="1" />
            <line x1="28" y1="102" x2="42" y2="102" stroke="#FF8A3D" strokeWidth="1" />
            <line x1="29" y1="108" x2="41" y2="108" stroke="#FF8A3D" strokeWidth="1" />

            {/* Aerodynamic Wing Mirrors */}
            <polygon points="15,48 7,44 9,51 15,51" fill="#FF2E88" stroke="#06060C" strokeWidth="0.5" />
            <polygon points="55,48 63,44 61,51 55,51" fill="#FF2E88" stroke="#06060C" strokeWidth="0.5" />

            {/* Rear Carbon Wing / Spoiler */}
            <rect x="12" y="118" width="46" height="5" rx="2" fill="#06060C" stroke="#FF2E88" strokeWidth="1" />

            {/* Cyberpunk LED Headlights */}
            <path d="M20 16 L27 18 L24 22 Z" fill="#00E5FF" filter="drop-shadow(0 0 6px #00E5FF)" />
            <path d="M50 16 L43 18 L46 22 Z" fill="#00E5FF" filter="drop-shadow(0 0 6px #00E5FF)" />

            {/* Forward Headlight Cones (Top View Light Beams projecting into distance) */}
            <polygon points="21,15 4,-25 32,-25 26,15" fill="url(#headBeamL)" opacity="0.65" />
            <polygon points="49,15 38,-25 66,-25 44,15" fill="url(#headBeamR)" opacity="0.65" />

            {/* Rear Full-Width Neon Taillight Strip */}
            <rect x="18" y="125" width="34" height="2.5" rx="1" fill="#FF2E88" filter="drop-shadow(0 0 6px #FF2E88)" />

            {/* Twin Chrome Exhaust Tips */}
            <rect x="23" y="127" width="5" height="3" rx="1" fill="#475569" stroke="#00E5FF" strokeWidth="0.5" />
            <rect x="42" y="127" width="5" height="3" rx="1" fill="#475569" stroke="#00E5FF" strokeWidth="0.5" />
          </svg>

          {/* Text Indicator below car */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 px-2 py-0.5 rounded border border-gta-pink/40 shadow-lg pointer-events-none">
            <span className="text-[8px] font-heading tracking-widest text-gta-pink">
              LUCIA &amp; JASON · GETAWAY GT
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* 2. VCPD Police Pursuit Interceptor (TOP-DOWN VIEW) */}
      <motion.div
        initial={{ left: '5.5vw', top: '0.5%', opacity: 0 }}
        animate={{
          left: pathLeft,
          top: pathTop,
          opacity: pathOpacity,
        }}
        transition={{
          duration: animationDuration,
          times: pathTimes,
          delay: 2.2,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: '60px', height: '116px' }}
      >
        <motion.div
          animate={{ rotate: pathRotate }}
          transition={{
            duration: animationDuration,
            times: pathTimes,
            delay: 2.2,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-full h-full relative flex items-center justify-center"
          style={{ transformOrigin: 'center center' }}
        >
          {/* Top-Down VCPD Cruiser SVG Graphic */}
          <svg width="60" height="116" viewBox="0 0 74 144" fill="none" className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            <defs>
              <linearGradient id="vcpdPolBeamL" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="vcpdPolBeamR" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
              </linearGradient>
              <filter id="blueGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
              </filter>
            </defs>

            {/* Blue Police Underglow */}
            <ellipse cx="37" cy="72" rx="32" ry="60" fill="#3B82F6" opacity="0.75" filter="url(#blueGlow)" />

            {/* 4 Heavy-Duty Police Pursuit Tires */}
            <rect x="6" y="26" width="7" height="22" rx="3.5" fill="#020617" stroke="#94A3B8" strokeWidth="0.8" />
            <rect x="61" y="26" width="7" height="22" rx="3.5" fill="#020617" stroke="#94A3B8" strokeWidth="0.8" />
            <rect x="5" y="90" width="8" height="24" rx="3.5" fill="#020617" stroke="#94A3B8" strokeWidth="0.8" />
            <rect x="61" y="90" width="8" height="24" rx="3.5" fill="#020617" stroke="#94A3B8" strokeWidth="0.8" />

            {/* Heavy-Duty Front Pushbar (Bullbar) */}
            <rect x="22" y="6" width="30" height="4" rx="1" fill="#475569" stroke="#94A3B8" strokeWidth="0.8" />
            <rect x="26" y="8" width="3" height="6" fill="#94A3B8" />
            <rect x="45" y="8" width="3" height="6" fill="#94A3B8" />

            {/* Interceptor Cruiser Body (Top-Down Silhouette) */}
            <path
              d="M37 12
                 C29 12 23 15 19 23
                 C15 31 16 46 16 56
                 C16 64 15 76 14 86
                 C12 96 13 112 18 124
                 C22 130 30 131 37 131
                 C44 131 52 130 56 124
                 C61 112 62 96 60 86
                 C59 76 58 64 58 56
                 C58 46 59 31 55 23
                 C51 15 45 12 37 12 Z"
              fill="#0F172A"
              stroke="#38BDF8"
              strokeWidth="0.8"
            />

            {/* White Police Livery on Hood, Doors, and Roof */}
            <path d="M22 28 L52 28 L49 46 L25 46 Z" fill="#F8FAFC" />
            <text x="29" y="40" fill="#0F172A" fontSize="7" fontWeight="900" fontFamily="sans-serif">
              VCPD
            </text>

            {/* Front Windshield */}
            <path
              d="M20 50 C29 45 45 45 54 50 L50 66 C42 63 32 63 24 66 Z"
              fill="#1E293B"
              stroke="#64748B"
              strokeWidth="0.8"
            />

            {/* White Roof Section */}
            <path d="M24 66 L50 66 L48 88 L26 88 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.5" />
            <text x="29" y="82" fill="#0F172A" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
              911
            </text>

            {/* Rear Window */}
            <path d="M26 89 L48 89 L46 106 L28 106 Z" fill="#1E293B" stroke="#64748B" strokeWidth="0.8" />

            {/* Side Mirrors with Pursuit Spotlights */}
            <polygon points="16,46 9,43 11,49 16,49" fill="#0F172A" />
            <circle cx="8" cy="46" r="2" fill="#FFFFFF" />
            <polygon points="58,46 65,43 63,49 58,49" fill="#0F172A" />
            <circle cx="66" cy="46" r="2" fill="#FFFFFF" />

            {/* Police High-Beam Forward Spotlights */}
            <polygon points="23,16 6,-25 34,-25 28,16" fill="url(#vcpdPolBeamL)" opacity="0.7" />
            <polygon points="51,16 40,-25 68,-25 46,16" fill="url(#vcpdPolBeamR)" opacity="0.7" />

            {/* Rear Taillights */}
            <rect x="20" y="128" width="10" height="2" fill="#EF4444" filter="drop-shadow(0 0 4px #EF4444)" />
            <rect x="44" y="128" width="10" height="2" fill="#EF4444" filter="drop-shadow(0 0 4px #EF4444)" />
          </svg>

          {/* High-Intensity Roof Siren Lightbar (Alternating Red/Blue Strobes) */}
          <div className="absolute top-[52px] left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5 z-20 bg-black/90 p-1 rounded-full border border-gray-600 shadow-xl">
            {/* Red Strobe */}
            <motion.div
              animate={{ opacity: [1, 0.15, 1, 0.2, 1], scale: [1, 1.4, 1] }}
              transition={{ duration: 0.18, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_16px_#ef4444]"
            />
            {/* Center White Flasher */}
            <motion.div
              animate={{ opacity: [0.2, 1, 0.1, 1, 0.2] }}
              transition={{ duration: 0.12, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]"
            />
            {/* Blue Strobe */}
            <motion.div
              animate={{ opacity: [0.15, 1, 0.2, 1, 0.15], scale: [1, 1.4, 1] }}
              transition={{ duration: 0.18, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_16px_#3b82f6]"
            />
          </div>

          {/* Text Indicator below police car */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 px-2 py-0.5 rounded border border-blue-500/40 shadow-lg pointer-events-none">
            <span className="text-[8px] font-heading tracking-widest text-blue-400">
              VCPD PURSUIT INTERCEPTOR
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

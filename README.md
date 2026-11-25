# GTA 6 Fan Hub 🌴 Vice City

A production-ready, lightning-fast, and responsive GTA 6 fan website built with **Next.js 14 (App Router)**, **JavaScript**, **Tailwind CSS**, **Framer Motion**, and **MDX**.

---

## 🌴 Tech Stack & Features

- **Framework**: Next.js 14 App Router (Pure JavaScript, no TypeScript)
- **Styling**: Tailwind CSS with custom GTA 6 Vice City theme (Hot Pink `#FF2E88`, Sun Orange `#FF8A3D`, Neon Purple `#7B2FF7`, Electric Teal `#00E5FF`, Dark Navy `#0B0B14`)
- **Animations**: Framer Motion for hero parallax, 3D tilt, smooth marquee news ticker, scanlines, and screen reveals
- **Content Engine**: Local `.mdx` files in `/content/posts/` parsed via `gray-matter` + `next-mdx-remote`
- **Cheat Codes Engine**: Searchable & filterable `/data/cheats.json` database across PS5, Xbox Series X/S, and PC
- **GTA Aesthetics**:
  - Interactive Wanted Level Stars (1–5 stars) in navbar with police dispatch alert
  - Live fluctuating cash counter (`$8,452,100`) & health/armor bars
  - Striped retro sunset sun, silhouette palm trees, and 3D synthwave perspective grid
  - "Mission Passed" full-screen celebration on newsletter subscription
  - GTA-styled "WASTED" death screen 404 page
  - Mini radar GPS widget with coordinates
  - Smooth breaking news ticker pinned to top
- **SEO & Performance**:
  - 100% Static Generation (SSG) with `generateStaticParams`
  - Dynamic `sitemap.xml` and `robots.txt`
  - Auto-generated `rss.xml` feed
  - Dynamic Open Graph and Twitter Card metadata for every post
  - Responsive dark-mode-first design with reduced-motion accessibility

---

## 📁 Project Structure

```
gta/
├── app/
│   ├── layout.js              # Root layout with Bebas Neue & Inter fonts, Ticker, Navbar, Footer, ToastProvider
│   ├── globals.css            # Tailwind base, neon utilities, scanlines, retro grid, health/armor bars
│   ├── page.js                # Fullscreen Hero, Featured Post, Latest Posts, Trending Cheats, Categories, Newsletter
│   ├── not-found.js           # GTA "WASTED" custom 404 page
│   ├── sitemap.js             # Auto-generated XML sitemap
│   ├── robots.js              # Auto-generated robots.txt
│   ├── rss.xml/
│   │   └── route.js           # Auto-generated RSS 2.0 XML feed
│   ├── blog/
│   │   ├── page.js            # Blog listing server wrapper
│   │   ├── BlogClientPage.js  # Search, category filter, tag filter, and pagination
│   │   └── [slug]/
│   │       └── page.js        # SSG post page with MDXRemote, reading progress, TOC, related dispatches
│   ├── cheats/
│   │   ├── page.js            # Cheats server wrapper
│   │   └── CheatsClientPage.js# Searchable platform & category cheat codes with instant copy & toasts
│   ├── news/
│   │   └── page.js            # Breaking news & trailer dispatches
│   ├── guides/
│   │   └── page.js            # Field manual & strategy walkthroughs
│   ├── characters/
│   │   └── page.js            # VCPD suspect rap sheets (Lucia, Jason, El Rubio, Vance, Uncle Cal, Roxy)
│   ├── map/
│   │   └── page.js            # Satellite GPS reconnaissance for Leonida territories
│   ├── about/
│   │   └── page.js            # Project mission, tech stack, and fan disclaimer
│   ├── contact/
│   │   └── page.js            # Encrypted dispatch contact form with instant confirmation
│   └── admin/
│       └── page.js            # Password-protected dispatch drafter & MDX previewer (Pass: vicecity2026)
├── components/
│   ├── home/
│   │   ├── HeroSection.js     # Parallax sunset, striped sun, moving grid, palms, typewriter, countdown, radar
│   │   └── TrendingCheats.js  # Popular cheats cards with quick-copy
│   ├── layout/
│   │   ├── Navbar.js          # Sticky blur nav, wanted stars, money counter, health/armor bars, mobile menu
│   │   └── Footer.js          # Dispatches, network links, social SVGs, and legal disclaimer
│   ├── ui/
│   │   ├── Toast.js           # Toast context provider (Mission Passed & Cheat Activated modes)
│   │   ├── PostCard.js        # Post card with neon glow, fallback art banner, reading time, tags
│   │   ├── LoadingScreen.js   # GTA loading screen with progress percentage and neon loading bar
│   │   ├── NewsTicker.js      # Pinned marquee breaking news ticker
│   │   ├── CountdownTimer.js  # Animated launch countdown timer
│   │   ├── TypewriterText.js  # Retro cycling typewriter text
│   │   ├── NewsletterSignup.js# Newsletter signup with "Mission Passed" full-screen overlay
│   │   ├── ReadingProgress.js # Top gradient reading progress bar
│   │   └── BackToTop.js       # Floating neon scroll-to-top button
│   └── blog/
│       └── PostClientView.js  # Respect counter, Table of Contents, social share buttons, Copy URL
├── content/
│   └── posts/                 # MDX daily blog posts with YAML frontmatter
│       ├── gta6-release-date-confirmed.mdx
│       ├── top-10-things-to-do-first.mdx
│       ├── complete-cheat-codes-guide.mdx
│       └── new-leaked-map-coordinates-discovered.mdx
├── data/
│   └── cheats.json            # 20 verified cheat entries across Weapons, Vehicles, Player, Wanted, World
├── lib/
│   └── posts.js               # Post parsing, categories, tags, reading-time calculation
├── scripts/
│   └── new-post.js            # CLI generator: npm run new-post "Your Post Title"
├── public/                    # Static assets & images
├── tailwind.config.js         # Custom GTA palette, neon shadows, animations, and keyframes
├── next.config.mjs            # Next.js production configuration
└── package.json               # Dependencies and scripts
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18.17+ or 20+
- npm

### 2. Installation
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## ✍️ Daily Posting Workflow

### Creating a New Post via CLI
To scaffold a new post for today with all required frontmatter:
```bash
npm run new-post "Your Post Title"
```
This automatically:
1. Converts the title into a clean URL slug (e.g. `your-post-title.mdx`)
2. Inserts today's date in `YYYY-MM-DD`
3. Sets up frontmatter: `title`, `date`, `excerpt`, `category`, `tags`, `coverImage`, `author`, `featured`, `readingTime`
4. Creates the file in `content/posts/`

### Adding or Editing Cheat Codes
Open `data/cheats.json` and append a new JSON object:
```json
{
  "id": 21,
  "name": "Super Drift Mode",
  "description": "Increases vehicle traction and drift angle",
  "category": "Vehicles",
  "ps5": "△ R1 R1 ← R1 L1 R2 L1",
  "xbox": "Y RB RB ← RB LB RT LB",
  "pc": "DRIFTKING",
  "effect": "Maximum drift physics",
  "warning": null
}
```

### Web Dispatch Drafter (/admin)
Navigate to `/admin` in your browser.
- **Default password**: `vicecity2026`
- Fill out title, category, tags, excerpt, and body
- Click **"Copy MDX File"** and save into `content/posts/`

---

## 🌐 Deploying to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of GTA 6 fan website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com).
3. Click **"Add New..."** → **"Project"**.
4. Import your GitHub repository.
5. Framework preset will automatically detect **Next.js**.
6. Click **Deploy**. Vercel will run `npm run build` and deploy your SSG site globally on edge CDN!

---

## ⚖️ Legal Disclaimer
This is an unofficial, non-commercial fan site. Grand Theft Auto, GTA VI, Vice City, and Rockstar Games logos and trademarks are properties of Rockstar Games and Take-Two Interactive Software, Inc.

# gta6

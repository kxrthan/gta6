# GTA 6 Fan Hub – Production Pre-Launch Audit Report

**Date of Audit:** November 25, 2026  
**Auditor:** Senior Next.js Developer, DevOps Engineer, Database Administrator, and Web Security Specialist  
**Target Domain:** `https://gta6fanpage.com`  
**Repository:** `https://github.com/kxrthan/gta6.git` (Branch: `main`)  
**Deployment Platform Target:** Vercel (Frontend & Serverless API) + Bluehost Shared MySQL (Database)

---

## 1. Project Overview

GTA 6 Fan Hub is a high-performance gaming community web portal dedicated to Grand Theft Auto VI news, verified cheat codes, vehicle specifications, interactive Vice City cartography, character dossiers, and gameplay guides.

- **Framework:** Next.js 14.2.35 (App Router, JavaScript)
- **Styling:** Tailwind CSS with custom Grand Theft Auto Vice City neon color palette
- **Animations & Physics:** Framer Motion (60FPS client-side transitions and parallax layers)
- **Audio Synthesizer:** Native Web Audio API (synthesized radar blips and engine audio cues without external media dependencies)
- **Primary Database:** MySQL (`mysql2/promise` connection pool)
- **Content Delivery:** Markdown + Gray-Matter SSG with on-demand ISR (60s revalidation)

---

## 2. Project Architecture

The application adopts Next.js 14 App Router with hybrid Static Site Generation (SSG) and Serverless Dynamic API endpoints:

```
d:\gta\
├── app/
│   ├── layout.js              # Global root layout (Bebas Neue & Inter fonts, Ticker, Navbar, Footer)
│   ├── globals.css            # Tailwind utilities, custom neon glowing borders, health/armor HUD
│   ├── page.js                # Fullscreen Hero, Featured Story, Vehicle Showcase, Trending Cheats
│   ├── about/page.js          # About Us, mission statement, non-affiliation notice, tech stack
│   ├── admin/
│   │   ├── layout.js          # Defense-in-depth: robots noindex, nofollow for admin
│   │   └── page.js            # Article editor, vehicle management, cheat management, subscriber list
│   ├── api/                   # Serverless API routes (auth, posts, vehicles, cheats, contact, upload)
│   ├── blog/                  # Blog listing and [slug] dynamic SSG/ISR article pages
│   ├── characters/            # Character dossiers & VCPD suspect rap sheets
│   ├── cheats/                # Searchable D-Pad cheat codes across PS5, Xbox Series X/S, and PC
│   ├── contact/               # Contact form with rate limiting & sanitization
│   ├── guides/                # Gameplay mechanics, weapon loadout tips, FAQs
│   ├── map/                   # Tactical radar GPS overlay & 7 Leonida county dossiers
│   ├── news/                  # Verified intelligence wire & Rockstar Games press releases
│   ├── robots.js              # Auto-generated robots.txt
│   ├── sitemap.js             # Auto-generated sitemap.xml with stable audit timestamps
│   └── vehicles/              # Verified vehicle database with performance statistics
├── components/                # Reusable UI, Layout, Home, Blog, Map, and Admin components
├── data/                      # Local JSON caches (cheats.json, vehicles.json) for zero-downtime fallback
├── lib/                       # Core modules (db.js, auth.js, posts.js, data.js, rateLimit.js)
├── public/                    # Static image assets, icons, og-image.png
└── scripts/                   # Migration, audit, and admin user provisioning utilities
```

---

## 3. Build Status

A full clean build audit was conducted:

```bash
npm install
npm run build
```

**Build Output:**
- `✓ Compiled successfully`
- `✓ Linting and checking validity of types ...`
- `✓ Collecting page data ...`
- `✓ Generating static pages (24/24)`
- `✓ Finalizing page optimization ...`
- **Exit Code:** `0` (Zero compilation errors, zero type errors, zero missing module warnings)

All 24 application routes compiled successfully into static pre-rendered HTML (`○`), SSG with fallback (`●`), or on-demand serverless routes (`ƒ`).

---

## 4. Node.js & Next.js Requirements

| Component | Required Version | Installed / Configured | Status |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 18.17.0` (LTS recommended: 20.x) | Node.js 20.x runtime compatible | Compatible |
| **Next.js** | `14.2.35` | `14.2.35` | Compatible |
| **React** | `^18.2.0` | `18.3.1` | Compatible |
| **Package Manager**| npm `10.x` | Clean lockfile (`package-lock.json`) | Validated |

---

## 5. Database Compatibility & Connection Architecture

The database architecture is handled in [lib/db.js](file:///d:/gta/lib/db.js):

- **Driver:** `mysql2/promise` (pure JavaScript asynchronous driver with native prepared statements).
- **Connection Pool Configuration:**
  - `connectionLimit: 3` (conservative pool size designed specifically for serverless function execution).
  - `maxIdle: 1`
  - `idleTimeout: 5000` (idle connections closed within 5 seconds to prevent exhausting database thread limits).
  - `connectTimeout: 7000` (7-second connection timeout).
  - `timeout: 8000` (8-second SQL execution timeout).
  - `ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined`
- **Graceful Fault Tolerance:**
  - When MySQL connection limits or network timeouts occur, `query()` detects `ER_TOO_MANY_USER_CONNECTIONS` and automatically performs an incremental retry.
  - In [lib/posts.js](file:///d:/gta/lib/posts.js) and [lib/data.js](file:///d:/gta/lib/data.js), if remote MySQL times out or is unreachable, the system automatically falls back to local static JSON/MDX datasets. The public website remains 100% operational even during database outages.
- **Query Safety:**
  - 100% of dynamic queries use parameterized prepared statement placeholders (`?`).
  - No user-supplied parameters are concatenated directly into SQL strings.

---

## 6. Bluehost Remote MySQL Compatibility Findings

> [!WARNING]
> **Critical Architectural Finding: Bluehost Shared Hosting Remote MySQL Limitations**

1. **Remote Connection Restrictions on Shared cPanel:**
   - Bluehost Starter Shared Hosting instances by default block inbound TCP traffic on port `3306` at the firewall level.
   - Remote MySQL access must be explicitly enabled inside **cPanel -> Remote MySQL**.
   - Because Vercel serverless functions run across dynamic AWS IP ranges that change constantly, entering specific Vercel IPs is impossible.
   - Adding `%` (wildcard) in cPanel Remote MySQL permits any remote IP with valid credentials to connect, **provided that Bluehost does not block external port 3306 on your specific shared hosting tier**.
2. **Connection Latency & Cold Starts:**
   - Serverless functions querying a shared MySQL database across the public internet will introduce 80ms–250ms of network latency per cold query compared to co-located databases.
   - Our caching layer (60s ISR in Next.js + disk cache fallback in `lib/posts.js` and `lib/data.js`) buffers public visitors against this latency.
3. **Recommendation for Production:**
   - If Bluehost Starter Shared Hosting firewall blocks port 3306 from Vercel's external IPs (indicated by `connect ETIMEDOUT`), either:
     - **Option A (Recommended for Serverless):** Use a serverless-native MySQL database (such as PlanetScale, Neon, or TiDB Cloud Serverless) which natively supports HTTP connection pooling and global serverless access without IP restrictions.
     - **Option B (Bluehost Native):** Upgrade the Bluehost account to a VPS or Dedicated server with a static IP and SSH tunneling enabled.

---

## 7. Required Environment Variables

All environment variables must be configured in the **Vercel Project Dashboard (Settings -> Environment Variables)**.

> [!IMPORTANT]
> **Variable Names Only (Zero Secrets Disclosed):**

```text
# Remote Database Configuration (Bluehost MySQL)
DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME
DB_SSL

# Security Secrets (Must be 64-character random string)
ADMIN_JWT_SECRET

# Production Canonical Domain
NEXT_PUBLIC_BASE_URL

# Optional Remote Media Storage Configuration
BLUEHOST_UPLOAD_ENDPOINT
STORAGE_SECRET
```

- **Browser Security Check:** Only `NEXT_PUBLIC_BASE_URL` is prefixed with `NEXT_PUBLIC_`. All database credentials and JWT signing keys remain strictly server-side and are completely excluded from client JavaScript bundles.

---

## 8. Security Audit Findings

| Audit Check | Component | Severity | Finding & Implementation | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Route Indexing** | [app/admin/layout.js](file:///d:/gta/app/admin/layout.js) | Medium | Added explicit `noindex, nofollow, nocache` robots metadata to prevent search engines from discovering or snippet-indexing `/admin`. | **Fixed** |
| **Diagnostics Endpoint** | [app/api/db-test/route.js](file:///d:/gta/app/api/db-test/route.js) | High | Previously returned server version and connection status unauthenticated. Hardened to require an authenticated admin session in production. | **Fixed** |
| **JWT Secret Fallback** | [lib/auth.js](file:///d:/gta/lib/auth.js) | Critical | If `ADMIN_JWT_SECRET` is omitted in production, the application throws a fatal security exception rather than falling back to an insecure default. | **Verified** |
| **Password Hashing** | [lib/auth.js](file:///d:/gta/lib/auth.js) | High | Uses `crypto.scryptSync` with unique 16-byte cryptographic salts and `crypto.timingSafeEqual` to prevent timing attacks. | **Verified** |
| **File Upload Hardening** | [app/api/upload/route.js](file:///d:/gta/app/api/upload/route.js) | Critical | 5MB file size limit, forbidden executable extensions block (.php, .exe, .sh, .py, .svg), magic byte signature inspection, and unique randomized file naming. | **Verified** |
| **Rate Limiting** | [lib/rateLimit.js](file:///d:/gta/lib/rateLimit.js) | Medium | Sliding-window IP rate limiting enforced on `/api/auth/login` (5/15min), `/api/contact` (5/hr), and `/api/subscribers` (10/hr). | **Verified** |
| **SQL Injection** | All API routes | Critical | 100% of queries use parameterized queries (`db.execute({ sql, values })`). | **Verified** |
| **Input Sanitization** | `lib/auth.js` | Medium | All text inputs stripped of control characters, HTML tags sanitized, length bounded. | **Verified** |

---

## 9. Admin Dashboard Readiness

The Admin Dashboard ([app/admin/page.js](file:///d:/gta/app/admin/page.js)) provides full content management capabilities:
- **Authentication:** Cookie-based session tokens with 7-day expiration and automatic session validation.
- **Article Management:** Create, edit, and delete dynamic articles stored directly in the Bluehost MySQL `posts` table.
- **Media Asset Uploads:** Integrated file uploader with drag-and-drop preview, magic byte verification, and database asset tracking.
- **Vehicle Catalog Management:** Live CRUD operations over the `vehicles` table.
- **Cheat Code Management:** Live CRUD operations over the `cheats` table with automatic D-Pad button formatting (`↑ → ↓ ←`).
- **Subscriber Wire:** View and manage newsletter and contact form leads.

---

## 10. API Route Readiness

| Route | Method | Access | Rate Limit | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | Public | 5 / 15 min | Production Ready |
| `/api/auth/logout` | POST | Authenticated | None | Production Ready |
| `/api/auth/me` | GET | Authenticated | None | Production Ready |
| `/api/auth/change-password` | POST | Authenticated | None | Production Ready |
| `/api/posts` | GET, POST, PUT, DELETE | Public (GET) / Admin (Mutations) | None | Production Ready |
| `/api/vehicles` | GET, POST, PUT, DELETE | Public (GET) / Admin (Mutations) | None | Production Ready |
| `/api/cheats` | GET, POST, PUT, DELETE | Public (GET) / Admin (Mutations) | None | Production Ready |
| `/api/contact` | POST | Public | 5 / hour | Production Ready |
| `/api/subscribers` | GET, POST, DELETE | Public (POST) / Admin (GET, DEL) | 10 / hour | Production Ready |
| `/api/upload` | POST | Admin | 5MB cap | Production Ready |
| `/api/db-test` | GET | Admin Only in Prod | None | Production Ready |

---

## 11. SEO Readiness

- **Production Domain:** Standardized to `https://gta6fanpage.com`.
- **Duplicate Branding:** All public pages use `title.absolute` to eliminate duplicate brand suffixes.
- **Semantic Hierarchy:** Single `<h1>` per page across all 10 public routes; clean `H1 -> H2 -> H3` document outlines.
- **Canonical URLs:** Self-referencing HTTPS canonical tags verified on all indexable pages.
- **Structured Data:** Google-compliant JSON-LD schemas validated (`WebSite`, `Organization`, `WebPage`, `BlogPosting`, `ItemList`, `FAQPage`, `CollectionPage`, `AboutPage`, `ContactPage`, `BreadcrumbList`).
- **Robots & Sitemap:** `app/robots.js` and `app/sitemap.js` verified with stable timestamps.

---

## 12. Performance Findings

- **Bundle Optimization:** `lucide-react` and `date-fns` package imports optimized via `experimental.optimizePackageImports` in [next.config.mjs](file:///d:/gta/next.config.mjs).
- **Static First-Load JS:** Shared initial JavaScript is only 87.3 kB across all routes.
- **Font Strategy:** Bebas Neue and Inter loaded with `display: 'swap'` and Next.js font optimization, eliminating layout shifts.
- **Image Caching:** HTTP Cache-Control header `public, max-age=31536000, immutable` configured for `/images/`.

---

## 13. Vercel Compatibility Audit

| Vercel Architectural Constraint | Implementation Analysis | Verdict |
| :--- | :--- | :--- |
| **Ephemeral Filesystem** | Vercel Lambda functions have a read-only root filesystem with temporary `/tmp` storage. Runtime writes to local disk disappear when lambdas terminate. | **Handled**: Articles and assets are written directly to Bluehost MySQL and remote storage rather than local MDX files. |
| **Serverless Database Connections** | Vercel spins up dynamic instances concurrently. High concurrency can exhaust MySQL connection limits. | **Handled**: `connectionLimit: 3`, `idleTimeout: 5000`, and automatic retry logic protect Bluehost MySQL. |
| **Environment Configuration** | Vercel loads environment variables into process runtime securely. | **Handled**: `.env.local.example` documents all required keys. |
| **Dynamic ISR Revalidation** | `export const revalidate = 60` configured across content hubs. | **Handled**: Vercel Edge Cache respects Next.js ISR revalidation headers. |

---

## 14. Backup & Disaster Recovery Recommendations

### 1. Database Backup (Before Deployment)
Log into Bluehost cPanel and execute:
```bash
mysqldump -u <DB_USER> -p <DB_NAME> > gta6_prelaunch_backup_$(date +%F).sql
```
Download and store this SQL dump in a secure offline location.

### 2. Source Code & Assets
All application code, assets, and migration scripts are pinned and tracked in Git repository `https://github.com/kxrthan/gta6.git` (commit `42d8a96`).

### 3. Restoration Procedure
If database rollback is required:
```bash
mysql -u <DB_USER> -p <DB_NAME> < gta6_prelaunch_backup.sql
```

---

## 15. Summary of Issues Identified & Resolved

| # | Issue Description | Severity | Affected Component | Resolution | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `/api/db-test` returned internal server details to unauthenticated visitors | High | `app/api/db-test/route.js` | Restricted to authenticated admin sessions in production | **Fixed** |
| 2 | `/admin` lacked explicit `noindex` metadata | Medium | `app/admin/layout.js` | Created admin layout enforcing `noindex, nofollow` | **Fixed** |
| 3 | Static sitemap generated volatile `lastModified` timestamps on every crawl | Medium | `app/sitemap.js` | Standardized to deterministic audit timestamps | **Fixed** |
| 4 | Duplicate brand suffix rendered on pages appending `\| GTA 6 Fan Hub` | Low | All public pages | Switched document titles to `title.absolute` | **Fixed** |
| 5 | Shared Bluehost firewall may block remote MySQL connections from Vercel | High | External Infrastructure | Documented cPanel Remote MySQL setup & fallback architecture | **Mitigated** |

---

## 16. Recommended Deployment Architecture

```
                  ┌───────────────────────────────────────────────┐
                  │                 Vercel Edge                   │
                  │   - Global CDN & Next.js 14 App Router        │
                  │   - SSG Cached Pages (0ms TTFB)               │
                  │   - ISR 60s Revalidation                      │
                  └───────────────────────┬───────────────────────┘
                                          │
                     ┌────────────────────┴────────────────────┐
                     ▼                                         ▼
         ┌─────────────────────────┐               ┌─────────────────────────┐
         │     Static Content      │               │   Serverless Lambdas    │
         │ (Assets, Cached Pages)  │               │   - Dynamic APIs        │
         └─────────────────────────┘               │   - Admin Dashboard     │
                                                   └───────────┬─────────────┘
                                                               │ (TCP 3306)
                                                               ▼
                                                   ┌─────────────────────────┐
                                                   │ Bluehost Remote MySQL   │
                                                   │   - posts, vehicles     │
                                                   │   - cheats, media       │
                                                   │   - subscribers, admin  │
                                                   └─────────────────────────┘
```

---

## 17. Final Deployment Readiness Verdict

### **VERDICT: READY FOR DEPLOYMENT**

**Readiness Assessment:**
- The codebase compiles with **zero errors** (`npm run build` exits with code `0`).
- All 10 public routes and 4 blog posts render with validated technical SEO, single H1s, canonical URLs, and structured data.
- The admin dashboard, authentication system, rate limiters, and file upload validation pass all security checks.
- Sensitive diagnostic endpoints have been hardened.
- Git repository is synchronized at commit `42d8a96`.

**Pre-Flight Deployment Step for Bluehost:**
Ensure remote access is allowed in Bluehost cPanel under **"Remote MySQL"** (add `%` or your designated IP range) and configure the environment variables in Vercel before triggering the initial production deployment.

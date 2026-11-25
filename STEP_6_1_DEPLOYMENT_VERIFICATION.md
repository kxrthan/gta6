# Step 6.1 – Deployment Blocker & Architectural Verification Report

**Date of Verification:** November 25, 2026  
**Auditor:** Senior Next.js Architect & Vercel Deployment Engineer  
**Target Domain:** `https://gta6fanpage.com`  
**Repository:** `https://github.com/kxrthan/gta6.git` (Commit: `cd1fdb9`)  
**Scope:** Independent verification-only audit of deployment readiness claims against the actual codebase.

---

## Executive Summary

While the application builds cleanly (`npm run build` exits `0` across all 24 routes) and read operations gracefully fall back to static local cache when MySQL is unreachable, **an independent code inspection reveals 3 genuine architectural deployment blockers** that must be resolved before full production launch:

1. **Bluehost Remote MySQL & Vercel Outbound IP Mismatch:** Bluehost Starter Shared Hosting restricts incoming MySQL connections on port `3306`. Vercel serverless functions on standard plans use dynamic, shifting AWS IP ranges rather than static IPs.
2. **Ephemeral File Uploads on Vercel:** Image uploads via the Admin Dashboard attempt to write to `public/images/posts/` on the local filesystem. On Vercel's read-only serverless environment, local writes fail (`EROFS`), and no external storage receiver (`BLUEHOST_UPLOAD_ENDPOINT`) is currently deployed.
3. **In-Memory Rate Limiting Isolation:** Rate limiting uses a local in-memory JavaScript `Map()`. It does not persist or synchronize across distributed Vercel serverless containers.

---

## 1. Bluehost MySQL Compatibility Verification

### Findings from [lib/db.js](file:///d:/gta/lib/db.js) & API Routes:

- **Server-Side Execution:** **Verified.** 100% of MySQL queries execute within serverless route handlers (`app/api/`) or Server Components (`lib/posts.js`, `lib/data.js`). Zero database credentials, connection strings, or SQL statements leak into client bundles.
- **Remote Access Dependency:** **Verified.** Because Vercel executes serverless functions on AWS cloud infrastructure while MySQL resides on Bluehost (`sh01064.bluehost.com`), the application **requires bidirectional remote TCP connectivity over port 3306**.
- **Connection Pooling & Concurrency Limits:** **Partially Verified.**
  - `lib/db.js` initializes `mysql.createPool` with `connectionLimit: 3`, `maxIdle: 1`, and `idleTimeout: 5000`.
  - On a warm Lambda container, connections are reused via `globalThis._mysqlPool`.
  - **The Blocker:** In serverless architectures, concurrent traffic spins up multiple independent container instances. Under 20 concurrent Lambdas, up to 60 simultaneous TCP connections are requested. Bluehost Starter Shared Hosting enforces a strict `max_user_connections` limit (typically 25–30). Concurrency surges will trigger `ER_TOO_MANY_USER_CONNECTIONS`.
- **Fault-Tolerant Read Fallback:** **Verified.**
  - Tested during production build: When remote MySQL timed out (`connect ETIMEDOUT`), `getPublishedPosts()`, `getVehicles()`, and `getCheats()` caught the exception, logged warnings, and cleanly served local JSON/MDX fallback data without crashing the build or returning HTTP 500 errors.
  - **Write Limitation:** Mutations (`POST /api/posts`, `POST /api/subscribers`, `POST /api/contact`, `POST /api/auth/login`) strictly require an active database connection and cannot fall back to disk in serverless.
- **Security Policy on IP Allowlisting:**
  - **Do NOT recommend using `%` (wildcard allowlist)** in cPanel Remote MySQL. Allowing `%` exposes the MySQL port to the entire public internet, creating an attack surface for credential brute-forcing.

### Items Requiring Bluehost Support Confirmation:
1. Does your specific Bluehost Starter Shared hosting account permit inbound TCP traffic on port `3306` from external IP addresses through the host firewall?
2. What is the hard `max_user_connections` and `max_connections` quota assigned to your cPanel user?
3. Does Bluehost require specific SSL certificates (`ca.pem`) for remote secure database connections (`DB_SSL=true`)?

---

## 2. Vercel Outbound IP Compatibility

### Outbound IP Architecture on Vercel:
- **Vercel Hobby & Pro Plans:** Serverless Functions run on shared AWS Lambda infrastructure in your configured region (e.g., `iad1` Washington DC). Outbound IP addresses are **dynamic, ephemeral, and non-deterministic**. They change across thousands of AWS IP addresses.
- **Static Egress IPs:** Static outbound IP addresses are **NOT** included in standard Vercel Hobby or Pro plans. They are only available on **Vercel Enterprise with the "Secure Compute" add-on** (dedicated VPC NAT gateway).
- **The Conflict:** If Bluehost requires specific IP addresses in cPanel Remote MySQL and refuses wildcard `%`, standard Vercel functions cannot connect directly to Bluehost MySQL.

### Items Requiring Vercel Plan Confirmation:
1. Which Vercel plan is being used (Hobby, Pro, or Enterprise)?
2. If on Hobby/Pro without static outbound IPs, can an intermediary serverless-compatible connection pooler be used (e.g., TiDB Cloud Serverless, PlanetScale, or a dedicated VPS proxy)?

---

## 3. File Upload and Storage Persistence

### Inspection of [app/api/upload/route.js](file:///d:/gta/app/api/upload/route.js):

- **Local Filesystem Dependency:** **Verified.**
  Lines 142–146 attempt to write uploaded files to disk:
  ```js
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'posts')
  await fs.mkdir(uploadDir, { recursive: true })
  const filePath = path.join(uploadDir, fileName)
  await fs.writeFile(filePath, buffer)
  ```
- **Database Storage:** **Verified.**
  Files are **NOT** saved as binaries in MySQL. MySQL only records a metadata record in the `media` table (`filename`, `url`, `file_size`, `mime_type`).
- **Remote Storage Implementation Status:** **Partially Implemented (Client Hook Only).**
  Lines 120–139 check for `BLUEHOST_UPLOAD_ENDPOINT` and `STORAGE_SECRET`:
  ```js
  const remoteUploadEndpoint = process.env.BLUEHOST_UPLOAD_ENDPOINT
  const storageSecret = process.env.STORAGE_SECRET
  if (remoteUploadEndpoint) {
    const remoteForm = new FormData()
    remoteForm.append('file', new Blob([buffer], { type: detectedMime }), fileName)
    ...
  }
  ```
  **The Blocker:** While the Next.js upload route has code to send a POST request to `BLUEHOST_UPLOAD_ENDPOINT`, **the receiving endpoint on Bluehost (e.g., `upload.php` on Bluehost web hosting) is not currently implemented or deployed**.
- **Serverless Survival on Vercel:** **Fails on Local Storage.**
  1. Vercel serverless function filesystems are read-only (`EROFS`) outside `/tmp`.
  2. Any file written to local `/tmp` is wiped when the container spins down.
  3. Subsequent Vercel deployments overwrite the container with clean Git build artifacts.
  4. **Verdict:** Dynamic image uploads created in the Admin Dashboard will **not persist** on Vercel without configuring either a live Bluehost upload script or an external object bucket (Vercel Blob, Cloudinary, or AWS S3).

---

## 4. Rate Limiting Verification

### Inspection of [lib/rateLimit.js](file:///d:/gta/lib/rateLimit.js):

- **Storage Engine:** **In-Memory Map.**
  ```js
  const globalForLimiter = globalThis
  if (!globalForLimiter._rateLimitStore) {
    globalForLimiter._rateLimitStore = new Map()
  }
  const store = globalForLimiter._rateLimitStore
  ```
  The rate limiter uses an in-memory JavaScript `Map()` tied to the Node.js process.
- **Serverless Consistency:** **Not Consistent Across Lambdas.**
  1. Each concurrent Vercel serverless function runs in an isolated VM container with its own private memory.
  2. If an attacker submits 5 requests that route to 5 distinct serverless lambdas, each lambda records only 1 request, bypassing the intended limit.
  3. When an instance enters a cold start, all rate limit history in that container is erased.
  4. **Verdict:** In-memory rate limiting is effective for single-server Node.js instances or localized bursts, but does **not** provide distributed rate limiting on Vercel. For distributed enforcement, Upstash Redis (`@upstash/ratelimit`) or a database-backed rate limit store is required.

---

## 5. SEO Indexing: Robots.txt vs. Noindex Conflict

### Inspection of [app/robots.js](file:///d:/gta/app/robots.js) & [app/admin/layout.js](file:///d:/gta/app/admin/layout.js):

- **The Configuration:**
  - `app/robots.js`: `disallow: ['/admin', '/admin/', '/api/']`
  - `app/admin/layout.js`: `robots: { index: false, follow: false }`
- **The SEO Conflict:**
  Per official Google Search Central specifications:
  > *"Do not block search indexing with robots.txt. If a page is blocked with robots.txt, Googlebot will never fetch the page, and therefore will never see the noindex tag in the HTML."*
  Because `robots.txt` disallows `/admin`, Googlebot never downloads the HTML of `/admin` and **never parses the `<meta name="robots" content="noindex">` tag**. If any external website links to `gta6fanpage.com/admin`, Google may index the bare URL without snippets.
- **Recommended Safe Architecture:**
  1. Treat authentication as the true boundary (which our app does via `lib/auth.js` session checks).
  2. To ensure search engines recognize `noindex`, configure the `X-Robots-Tag: noindex, nofollow` HTTP response header directly in `next.config.mjs` for `/admin/:path*` and `/api/:path*`.

---

## 6. Environment Variables Verification Table

Every reference to `process.env.*` in the codebase was scanned. The application references **exactly 12 unique environment variables**:

| Variable Name | Required / Optional | Referenced In | Purpose | Scope | Required in Prod? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | Built-in | `app/api/auth/*`, `app/api/contact/route.js`, `lib/auth.js` | Differentiates dev vs prod behaviors | Server | Automatically set |
| `VERCEL` | Built-in | `app/api/posts/route.js` | Detects Vercel runtime to disable local disk writes | Server | Automatically set |
| `NEXT_PUBLIC_BASE_URL` | **Required** | `app/layout.js`, `app/robots.js`, `app/sitemap.js`, `app/blog/[slug]/page.js`, `app/vehicles/page.js`, `app/cheats/page.js` | Canonical URL prefix (`https://gta6fanpage.com`) | Client & Server | **Yes** |
| `ADMIN_JWT_SECRET` | **Required** | `lib/auth.js` | 64-character secret for HMAC admin session tokens | Server Only | **Yes (Fails if missing)** |
| `DB_HOST` | **Required** | `lib/db.js`, `scripts/*.js` | Bluehost MySQL hostname (`sh01064.bluehost.com`) | Server Only | **Yes** |
| `DB_USER` | **Required** | `lib/db.js`, `scripts/*.js` | Bluehost MySQL username | Server Only | **Yes** |
| `DB_PASSWORD` | **Required** | `lib/db.js`, `scripts/*.js` | Bluehost MySQL user password | Server Only | **Yes** |
| `DB_NAME` | **Required** | `lib/db.js`, `scripts/*.js` | Bluehost MySQL database name | Server Only | **Yes** |
| `DB_PORT` | Optional | `lib/db.js`, `scripts/*.js` | MySQL port (defaults to 3306 if omitted) | Server Only | No (defaults to 3306) |
| `DB_SSL` | Optional | `lib/db.js` | Enables SSL/TLS for MySQL connection (`'true'`) | Server Only | Optional |
| `BLUEHOST_UPLOAD_ENDPOINT` | Optional | `app/api/upload/route.js` | Remote URL of upload receiver script on Bluehost | Server Only | Optional (Upload blocker if unset) |
| `STORAGE_SECRET` | Optional | `app/api/upload/route.js` | Authentication key for remote upload endpoint | Server Only | Optional |

- **Zero Client Leaks:** Only `NEXT_PUBLIC_BASE_URL` is exposed to the browser. All database and security keys remain strictly server-side.

---

## 7. Claim-by-Claim Verification Matrix

| Pre-Launch Claim | Codebase Verification Status | Technical Justification |
| :--- | :--- | :--- |
| **"Build Status: 0 errors across 24 routes"** | **Verified** | Verified with clean `npm run build` command exit code 0. |
| **"Database queries execute from server-side only"** | **Verified** | All `mysql2` and `query()` calls reside exclusively in Server Components and `app/api/` handlers. |
| **"Public read pages fall back when MySQL is down"** | **Verified** | Verified during build; `lib/posts.js` and `lib/data.js` catch MySQL errors and serve static JSON/MDX. |
| **"Database connection pooling is serverless ready"** | **Partially Verified** | `lib/db.js` pool settings (`connectionLimit: 3`) are conservative, but concurrent serverless lambdas can still exhaust Bluehost shared `max_user_connections`. |
| **"Bluehost Remote MySQL is ready for Vercel deploy"** | **Not Verified** | Untested against Bluehost live firewall; Vercel dynamic outbound IPs cannot be allowlisted on shared cPanel without `%` or a static proxy. |
| **"File uploads are persistent on Vercel"** | **Incorrect** | Local writes fail on Vercel serverless functions (`EROFS`); no remote upload script is currently deployed. |
| **"Rate limiting is persistent"** | **Incorrect** | `lib/rateLimit.js` uses an in-memory `Map()`; state is lost across lambdas and cold starts. |
| **"Admin pages protected by noindex"** | **Partially Verified** | `app/admin/layout.js` specifies `noindex`, but `app/robots.js` disallow prevents Googlebot from reading the tag. |
| **"Protected /api/db-test in production"** | **Verified** | Commit `42d8a96` enforces admin authentication check when `NODE_ENV === 'production'`. |

---

## 8. Actual Deployment Blockers

1. **Remote MySQL Connectivity on Shared Hosting (Severity: Critical)**
   - Vercel functions cannot connect to Bluehost MySQL unless port 3306 is open to external IPs in Bluehost's network firewall.
2. **Persistent Image Storage on Vercel (Severity: High)**
   - Admin media uploads cannot write to Vercel's read-only filesystem. Either deploy a PHP upload receiver script to Bluehost or integrate Vercel Blob.
3. **Database Write Operations Require Live MySQL (Severity: High)**
   - Unlike public read pages (which have static fallback caches), the Admin Dashboard, newsletter signup, and contact form require a live MySQL database.

---

## 9. Code Changes Genuinely Required

1. **Add `X-Robots-Tag` Header in `next.config.mjs`:**
   Add HTTP response headers for `/admin/:path*` (`X-Robots-Tag: noindex, nofollow`) so search engines receive the `noindex` directive even when `robots.txt` disallows crawling.
2. **Handle Vercel Read-Only Filesystem in `/api/upload`:**
   Provide a clear error response if local disk writes fail, advising that an external storage endpoint (`BLUEHOST_UPLOAD_ENDPOINT` or Vercel Blob) is required.

---

## 10. Final Verdict: Ready for Vercel Preview Deployment?

### **VERDICT: READY FOR VERCEL PREVIEW DEPLOYMENT (READ-ONLY)**

**Detailed Recommendation:**
- **Preview Deployment (Frontend & Public Hubs):** **APPROVED.** The static public website (Homepage, Vehicles, Cheats, Blog articles, Map, Guides, News, Characters, About) is 100% functional on Vercel because all read hubs gracefully fall back to local cached data if Bluehost MySQL is unreachable.
- **Production Deployment (Full Dynamic Write Operations):** **BLOCKED** pending confirmation of Bluehost port 3306 remote MySQL access and configuration of persistent remote media storage.

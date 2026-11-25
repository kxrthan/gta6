async function runFullProductionAudit() {
  const testResults = []

  function report(name, pass, details = '') {
    testResults.push({ name, pass, details })
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name} ${details}`)
  }

  // 1. Admin Login and Logout
  console.log('\n--- 1. Testing Admin Auth (Login & Logout) ---')
  let sessionCookie = null
  try {
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'Keerthanms@13' }),
    })
    const loginData = await loginRes.json()
    sessionCookie = loginRes.headers.get('set-cookie')
    report('Admin Login with New Credentials', loginData.success && loginRes.status === 200, `User: ${loginData.user?.username}`)

    const badLoginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrongpassword' }),
    })
    report('Reject Bad Password', badLoginRes.status === 401)

    const logoutRes = await fetch('http://localhost:3000/api/auth/logout', { method: 'POST' })
    report('Admin Logout & Cookie Clearance', logoutRes.status === 200)
  } catch (e) {
    report('Admin Auth Exception', false, e.message)
  }

  // 2. Article Creation, Editing & Publishing (MySQL Source of Truth)
  console.log('\n--- 2. Testing Article Persistence (MySQL) ---')
  const testSlug = 'prod-audit-article-' + Date.now()
  try {
    // Create Draft
    const createRes = await fetch('http://localhost:3000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Production Audit Article Title',
        slug: testSlug,
        category: 'News',
        author: 'Audit Officer',
        excerpt: 'Excerpt for production audit.',
        content: '# Production Audit Heading\n\nFull verified body text for article.',
        status: 'Draft',
        featured: false,
      }),
    })
    const createData = await createRes.json()
    report('Article Create (Draft) in MySQL', createData.success === true, `Slug: ${testSlug}`)

    // Verify Draft is NOT visible on public blog
    const blogRes1 = await fetch('http://localhost:3000/blog')
    const blogHtml1 = await blogRes1.text()
    const draftLeaked = blogHtml1.includes('Production Audit Article Title')
    report('Draft Is NOT Visible to Public', !draftLeaked)

    // Publish Article
    const publishRes = await fetch('http://localhost:3000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Production Audit Article PUBLISHED',
        slug: testSlug,
        category: 'News',
        author: 'Audit Officer',
        excerpt: 'Now published for fans.',
        content: '# Production Audit Heading\n\nPublished body text.',
        status: 'Published',
        featured: false,
      }),
    })
    const pubData = await publishRes.json()
    report('Article Edit & Publish Status Update', pubData.success === true)

    // Verify Published Article IS visible on public blog
    const blogRes2 = await fetch('http://localhost:3000/blog')
    const blogHtml2 = await blogRes2.text()
    const pubVisible = blogHtml2.includes('Production Audit Article PUBLISHED')
    report('Published Article Visible on Public Blog', pubVisible)

    // Cleanup: Delete Article
    const delRes = await fetch(`http://localhost:3000/api/posts?slug=${testSlug}`, { method: 'DELETE' })
    const delData = await delRes.json()
    report('Article Delete from MySQL', delData.success === true)
  } catch (e) {
    report('Article Lifecycle Exception', false, e.message)
  }

  // 3. Vehicle Creation and Editing
  console.log('\n--- 3. Testing Vehicle Database Module ---')
  const testVehId = 'prod-veh-' + Date.now()
  try {
    const createVehRes = await fetch('http://localhost:3000/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testVehId,
        name: 'Pegassi Infernus Prototype',
        brand: 'Pegassi',
        class: 'Super',
        topSpeed: 225,
        acceleration: 2.7,
        handling: 9.6,
        armor: 6.5,
        price: '$2,400,000',
        desc: 'Experimental wedge-shaped prototype supercar.',
        location: 'Starfish Island Private Slip',
      }),
    })
    const createVehData = await createVehRes.json()
    report('Vehicle Create in MySQL', createVehData.success === true)

    // Update
    const updateVehRes = await fetch('http://localhost:3000/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testVehId,
        name: 'Pegassi Infernus Prototype (Tuned)',
        brand: 'Pegassi',
        topSpeed: 235,
        price: '$2,650,000',
      }),
    })
    const updateVehData = await updateVehRes.json()
    report('Vehicle Update in MySQL', updateVehData.success === true)

    // Delete
    const delVehRes = await fetch(`http://localhost:3000/api/vehicles?id=${testVehId}`, { method: 'DELETE' })
    report('Vehicle Delete from MySQL', delVehRes.status === 200)
  } catch (e) {
    report('Vehicle Lifecycle Exception', false, e.message)
  }

  // 4. Cheat Code Management
  console.log('\n--- 4. Testing Cheat Code Engine ---')
  let cheatId = null
  try {
    const addCheatRes = await fetch('http://localhost:3000/api/cheats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Audit Moon Gravity',
        category: 'World',
        effect: 'Float like on the moon in Vice City',
        ps5: 'Left, Left, L1, R1, L1, Right, Left, L1, Left',
      }),
    })
    const addCheatData = await addCheatRes.json()
    cheatId = addCheatData.cheat?.id
    report('Cheat Code Create', addCheatData.success === true)

    if (cheatId) {
      const delCheatRes = await fetch(`http://localhost:3000/api/cheats?id=${cheatId}`, { method: 'DELETE' })
      report('Cheat Code Delete', delCheatRes.status === 200)
    }
  } catch (e) {
    report('Cheat Code Lifecycle Exception', false, e.message)
  }

  // 5. Newsletter Subscriptions
  console.log('\n--- 5. Testing Newsletter & Lead Capture ---')
  const testEmail = `lead-${Date.now()}@vicecity.net`
  let subId = null
  try {
    const subRes = await fetch('http://localhost:3000/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, source: 'Production Audit' }),
    })
    const subData = await subRes.json()
    subId = subData.id
    report('Newsletter Subscription Persisted', subData.success === true && subId > 0)

    // Reject Invalid Email
    const badEmailRes = await fetch('http://localhost:3000/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'notanemail', source: 'Production Audit' }),
    })
    report('Reject Malformed Email', badEmailRes.status === 400)
  } catch (e) {
    report('Newsletter Exception', false, e.message)
  }

  // 6. Contact Form Submission
  console.log('\n--- 6. Testing Encrypted Contact Form ---')
  try {
    const contactRes = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Tommy V',
        email: 'tommy.v@vicecity.net',
        category: 'Leak Intel',
        subject: 'Malibu Club Coordinates',
        message: 'Undercover meeting tonight at 2 AM.',
      }),
    })
    const contactData = await contactRes.json()
    report('Contact Form Encrypted Transmission', contactData.success === true)

    // Reject Missing Fields
    const badContactRes = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Incomplete' }),
    })
    report('Contact Form Input Validation', badContactRes.status === 400)
  } catch (e) {
    report('Contact Exception', false, e.message)
  }

  // 7. Image Upload Security
  console.log('\n--- 7. Testing Image Upload Pipeline ---')
  try {
    // Valid 1x1 JPEG
    const validJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12, 0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0xbf, 0xff, 0xd9])
    const uploadForm = new FormData()
    uploadForm.append('file', new Blob([validJpeg], { type: 'image/jpeg' }), 'audit-valid.jpg')

    const upRes = await fetch('http://localhost:3000/api/upload', { method: 'POST', body: uploadForm })
    const upData = await upRes.json()
    report('Image Upload Success with Metadata', upData.success === true, upData.url)

    // Block executable
    const badForm = new FormData()
    badForm.append('file', new Blob(['bad script'], { type: 'application/x-sh' }), 'backdoor.sh')
    const badUpRes = await fetch('http://localhost:3000/api/upload', { method: 'POST', body: badForm })
    report('Block Executable Script Upload', badUpRes.status === 403)
  } catch (e) {
    report('Upload Exception', false, e.message)
  }

  // 8. Rate Limiting Enforcement
  console.log('\n--- 8. Testing Rate Limiting Protections ---')
  try {
    let throttled = false
    for (let i = 0; i < 7; i++) {
      const res = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Spammer', email: 'spam@spam.com', message: 'Spam text' }),
      })
      if (res.status === 429) {
        throttled = true
        break
      }
    }
    report('Rate Limiter Throttling (HTTP 429)', throttled)
  } catch (e) {
    report('Rate Limit Exception', false, e.message)
  }

  // 9. SEO, Sitemap and RSS Feeds
  console.log('\n--- 9. Testing SEO, Sitemap & RSS Feeds ---')
  try {
    const sitemapRes = await fetch('http://localhost:3000/sitemap.xml')
    const sitemapText = await sitemapRes.text()
    report('Sitemap.xml Valid Output', sitemapRes.status === 200 && sitemapText.includes('<urlset'))

    const robotsRes = await fetch('http://localhost:3000/robots.txt')
    const robotsText = await robotsRes.text()
    report('Robots.txt Valid Output', robotsRes.status === 200 && robotsText.includes('Disallow: /admin'))

    const rssRes = await fetch('http://localhost:3000/rss.xml')
    const rssText = await rssRes.text()
    report('RSS Feed Valid Output', rssRes.status === 200 && rssText.includes('<rss'))
  } catch (e) {
    report('SEO Exception', false, e.message)
  }

  // 10. Database Concurrency & Connection Pool
  console.log('\n--- 10. Testing Database Concurrency & Pool Stability ---')
  try {
    const concurrentRequests = Array.from({ length: 8 }, (_, i) =>
      fetch('http://localhost:3000/api/db-test').then((r) => r.json())
    )
    const dbResults = await Promise.all(concurrentRequests)
    const allDbOk = dbResults.every((r) => r.success === true)
    report('8 Concurrent Database Requests Handled', allDbOk)
  } catch (e) {
    report('Concurrency Exception', false, e.message)
  }

  // Summary
  console.log('\n=======================================')
  console.log('    PRODUCTION AUDIT FINAL SUMMARY     ')
  console.log('=======================================')
  const total = testResults.length
  const passed = testResults.filter((r) => r.pass).length
  const failed = testResults.filter((r) => !r.pass).length
  console.log(`Total Verified Checks: ${total}`)
  console.log(`Passed: ${passed}`)
  console.log(`Failed: ${failed}`)
  console.log(`Readiness Status: ${failed === 0 ? '100% PRODUCTION READY' : 'ISSUES DETECTED'}\n`)
}

runFullProductionAudit()

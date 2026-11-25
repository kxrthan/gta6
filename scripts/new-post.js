#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const title = process.argv[2]
if (!title) {
  console.error('Usage: npm run new-post "My Post Title"')
  process.exit(1)
}

const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const today = new Date().toISOString().split('T')[0]

const template = `---
title: "${title}"
date: "${today}"
excerpt: "Add your excerpt here."
category: "News"
tags: ["gta6", "vice city"]
coverImage: "/images/posts/${slug}.jpg"
author: "GTA 6 Fan Hub"
featured: false
readingTime: "3 min read"
---

# ${title}

Write your content here...
`

const postsDir = path.join(__dirname, '..', 'content', 'posts')
const filePath = path.join(postsDir, slug + '.mdx')

if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true })
if (fs.existsSync(filePath)) { console.error('Post already exists: ' + filePath); process.exit(1) }

fs.writeFileSync(filePath, template, 'utf-8')
console.log('Created: ' + filePath)

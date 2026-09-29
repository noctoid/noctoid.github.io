import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, basename, extname, resolve } from 'node:path'
import matter from 'gray-matter'

const CONTENT_DIR = resolve('content')
const BLOGS_DIR = join(CONTENT_DIR, 'blogs')
const PHOTOS_DIR = join(CONTENT_DIR, 'photography')

function buildPosts() {
  if (!existsSync(BLOGS_DIR)) mkdirSync(BLOGS_DIR, { recursive: true })

  return readdirSync(BLOGS_DIR)
    .filter((f) => extname(f).toLowerCase() === '.md')
    .map((file) => {
      const raw = readFileSync(join(BLOGS_DIR, file), 'utf8')
      const { data } = matter(raw)
      const slug = basename(file, extname(file))
      return {
        slug,
        file: `blogs/${file}`,
        title: data.title ?? slug,
        date: data.date ? String(data.date) : '',
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        summary: data.summary ?? '',
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

// A collection is a directory under content/photography/ containing a
// config.md whose frontmatter describes the photobook. The cover resolves to
// the first image that actually exists, so the cover flow never shows a broken
// thumbnail while a collection is still being assembled.
function resolveCover(dir, data) {
  if (data.cover && existsSync(join(dir, data.cover))) return data.cover
  const pages = Array.isArray(data.pages) ? data.pages : []
  for (const page of pages) {
    for (const img of Array.isArray(page.images) ? page.images : []) {
      if (img && img.file && existsSync(join(dir, img.file))) return img.file
    }
  }
  return ''
}

function buildCollections() {
  if (!existsSync(PHOTOS_DIR)) return []

  return readdirSync(PHOTOS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const dir = join(PHOTOS_DIR, d.name)
      const configPath = join(dir, 'config.md')
      if (!existsSync(configPath)) return null
      const raw = readFileSync(configPath, 'utf8')
      const { data } = matter(raw)
      return {
        slug: d.name,
        title: data.title ?? d.name,
        date: data.date ? String(data.date) : '',
        summary: data.summary ?? '',
        cover: resolveCover(dir, data),
        pages: Array.isArray(data.pages) ? data.pages : [],
      }
    })
    .filter((c) => c !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

function buildManifest() {
  const posts = buildPosts()
  const collections = buildCollections()

  const out = join(CONTENT_DIR, 'index.json')
  writeFileSync(out, `${JSON.stringify({ posts, collections }, null, 2)}\n`)
  console.log(`content/index.json: ${posts.length} post(s), ${collections.length} collection(s)`)
}

buildManifest()

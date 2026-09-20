import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, basename, extname, resolve } from 'node:path'
import matter from 'gray-matter'

const CONTENT_DIR = resolve('content')

function buildManifest() {
  if (!existsSync(CONTENT_DIR)) mkdirSync(CONTENT_DIR, { recursive: true })

  const posts = readdirSync(CONTENT_DIR)
    .filter((f) => extname(f).toLowerCase() === '.md')
    .map((file) => {
      const raw = readFileSync(join(CONTENT_DIR, file), 'utf8')
      const { data } = matter(raw)
      const slug = basename(file, extname(file))
      return {
        slug,
        file,
        title: data.title ?? slug,
        date: data.date ? String(data.date) : '',
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        summary: data.summary ?? '',
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  const out = join(CONTENT_DIR, 'index.json')
  writeFileSync(out, `${JSON.stringify({ posts }, null, 2)}\n`)
  console.log(`content/index.json: ${posts.length} post(s)`)
}

buildManifest()

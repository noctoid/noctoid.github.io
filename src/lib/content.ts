export interface PostMeta {
  slug: string
  file: string
  title: string
  date: string
  tags: string[]
  summary: string
}

export interface Manifest {
  posts: PostMeta[]
}

const BASE = import.meta.env.BASE_URL

let manifestPromise: Promise<Manifest> | null = null

export function getManifest(): Promise<Manifest> {
  if (!manifestPromise) {
    manifestPromise = fetch(`${BASE}content/index.json`).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to load content manifest (${res.status})`)
      }
      return res.json() as Promise<Manifest>
    })
  }
  return manifestPromise
}

export async function getPostMarkdown(slug: string): Promise<string> {
  const manifest = await getManifest()
  const post = manifest.posts.find((p) => p.slug === slug)
  if (!post) throw new Error(`Post not found: ${slug}`)
  const res = await fetch(`${BASE}content/${post.file}`)
  if (!res.ok) throw new Error(`Failed to load post (${res.status})`)
  return res.text()
}

export interface PostMeta {
  slug: string
  file: string
  title: string
  date: string
  tags: string[]
  summary: string
}

export interface CollectionImage {
  file: string
  caption?: string
  text?: string
}

export interface CollectionPage {
  title?: string
  text?: string
  images?: CollectionImage[]
}

export interface CollectionMeta {
  slug: string
  title: string
  date: string
  summary: string
  cover: string
  pages: CollectionPage[]
}

export interface Manifest {
  posts: PostMeta[]
  collections: CollectionMeta[]
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

export async function getCollections(): Promise<CollectionMeta[]> {
  const manifest = await getManifest()
  return manifest.collections
}

export async function getCollection(slug: string): Promise<CollectionMeta> {
  const manifest = await getManifest()
  const collection = manifest.collections.find((c) => c.slug === slug)
  if (!collection) throw new Error(`Collection not found: ${slug}`)
  return collection
}

// Images and covers are referenced by a path relative to their collection
// directory (e.g. `images/01.jpg`). Build the runtime URL from the slug.
export function collectionAssetUrl(slug: string, file: string): string {
  return `${BASE}content/photography/${encodeURIComponent(slug)}/${file}`
}

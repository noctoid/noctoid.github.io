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

export interface FileNode {
  name: string
  type: 'dir' | 'file'
  path: string
  ext?: string
  children?: FileNode[]
}

export interface Manifest {
  posts: PostMeta[]
  collections: CollectionMeta[]
  tree: FileNode[]
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

export async function getTree(): Promise<FileNode[]> {
  const manifest = await getManifest()
  return manifest.tree ?? []
}

export function collectionAssetUrl(slug: string, file: string): string {
  return `${BASE}content/photography/${encodeURIComponent(slug)}/${file}`
}

// A path relative to content/ (e.g. `blogs/welcome.md` or
// `photography/漫行于以太虚境/images/01.jpg`). Encode each segment so Chinese
// directory names survive the URL, but keep `/` separators.
export function contentAssetUrl(path: string): string {
  return `${BASE}content/${path.split('/').map(encodeURIComponent).join('/')}`
}

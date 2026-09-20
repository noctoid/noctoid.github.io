---
title: "Welcome to the rebuilt Noctoid blog"
date: "2026-09-17"
tags: ["meta", "windows-98"]
summary: "The site is back — now a Vue 3 single-page app that renders markdown from a content folder."
---

# Welcome back

This page is a single-page web app. Everything below the title bar is rendered
at runtime: the app fetches a manifest of posts and turns markdown into HTML.

## How it works

- `content/*.md` are the posts, each with YAML frontmatter (`title`, `date`, `tags`, `summary`).
- A build step globs those files and writes `content/index.json`.
- The SPA fetches the manifest for the article list, then fetches and renders the raw `.md` on demand.
- Code blocks are highlighted with Shiki.

```ts
const greeting: string = "hello, retro web"
console.log(greeting.toUpperCase())
```

## What's next

The visual design (retro-futuristic Windows 98) is still to come. The chrome is
a placeholder built on [98.css](https://jdan.github.io/98.css/).

[GitHub](https://github.com/noctoid)

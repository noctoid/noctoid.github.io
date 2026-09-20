import MarkdownIt, { type MarkdownIt as MarkdownItInstance } from 'markdown-it'
import { createHighlighterCoreSync } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import githubDark from '@shikijs/themes/github-dark'
import javascript from '@shikijs/langs/javascript'
import typescript from '@shikijs/langs/typescript'
import json from '@shikijs/langs/json'
import bash from '@shikijs/langs/bash'
import python from '@shikijs/langs/python'
import html from '@shikijs/langs/html'
import css from '@shikijs/langs/css'
import yaml from '@shikijs/langs/yaml'
import markdown from '@shikijs/langs/markdown'
import diff from '@shikijs/langs/diff'
import sql from '@shikijs/langs/sql'
import xml from '@shikijs/langs/xml'

// Sync core + JS regex engine: no WASM fetch, only the grammars listed below
// are bundled (the full `shiki` bundle pulls in every language, several MB).
// codeToHtml is synchronous, so it plugs into markdown-it's sync fence hook.
const highlighter = createHighlighterCoreSync({
  themes: [githubDark],
  langs: [
    javascript,
    typescript,
    json,
    bash,
    python,
    html,
    css,
    yaml,
    markdown,
    diff,
    sql,
    xml,
  ],
  engine: createJavaScriptRegexEngine(),
})

const md: MarkdownItInstance = new MarkdownIt({
  html: true,
  linkify: true,
})

const defaultFence = md.renderer.rules.fence
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const lang = token.info.trim().split(/\s+/)[0]
  if (lang && highlighter.getLoadedLanguages().includes(lang)) {
    return highlighter.codeToHtml(token.content, { lang, theme: 'github-dark' })
  }
  return defaultFence ? defaultFence(tokens, idx, options, env, self) : ''
}

// Strip the leading YAML frontmatter block. Metadata already lives in
// content/index.json; the renderer only needs the body.
function stripFrontmatter(src: string): string {
  return src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

export function renderMarkdown(src: string): string {
  return md.render(stripFrontmatter(src))
}

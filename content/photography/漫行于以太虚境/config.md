---
title: 漫行于以太虚境
date: '2026-09-29'
summary: 一场关于虚空与漫游的影像漫记。
cover: images/L1002334.jpg
pages:
  - images:
      - file: images/L1002334.jpg
  - images:
      - file: images/_A732521.jpg
  - images:
      - file: images/4-2.jpg
  - images:
      - file: images/4.jpg
  - images:
      - file: images/5.jpg
  - images:
      - file: images/9.jpg
  - images:
      - file: images/15.jpg
  - images:
      - file: images/16.jpg
  - images:
      - file: images/18.jpg
  - images:
      - file: images/19.jpg
  - images:
      - file: images/22.jpg
  - images:
      - file: images/30.jpg
  - images:
      - file: images/31.jpg
  - images:
      - file: images/000000900017.jpg
  - images:
      - file: images/20230207-parent-with-3-sons.jpg
  - images:
      - file: images/DSC06983.jpg
  - images:
      - file: images/DSC07015.jpg
  - images:
      - file: images/DSC07080.jpg
  - images:
      - file: images/DSC07120.jpg
  - images:
      - file: images/DSC07143.jpg
  - images:
      - file: images/DSC07251.jpg
  - images:
      - file: images/DSC07253.jpg
  - images:
      - file: images/DSC07275.jpg
  - images:
      - file: images/DSC07281.jpg
  - images:
      - file: images/DSC07282.jpg
  - images:
      - file: images/DSC07291.jpg
  - images:
      - file: images/DSC07311.jpg
  - images:
      - file: images/DSC07312.jpg
  - images:
      - file: images/DSC07336.jpg
  - images:
      - file: images/DSC07482.jpg
  - images:
      - file: images/L1002315.jpg
  - images:
      - file: images/L1002328.jpg
  - images:
      - file: images/L1002343.jpg
  - images:
      - file: images/L1005890.jpg
  - images:
      - file: images/L1005892-2.jpg
  - images:
      - file: images/m9+L1000897.JPG
  - images:
      - file: images/m9+L1006631.JPG
---

# 漫行于以太虚境

`config.md` is the single source of truth for this collection. Its frontmatter
describes the photobook as an ordered sequence of pages, each grouping one or
more images together with the text that sits next to them.

## Directory layout

This collection contains:

- `config.md` — this file; the frontmatter holds the structure.
- `images/` — the photos, referenced by relative path from `config.md`.

## Schema

### Collection metadata (frontmatter)

| Field | Type | Meaning |
| --- | --- | --- |
| `title` | string | Display name of the collection. |
| `date` | string | Creation date (`YYYY-MM-DD`). |
| `summary` | string | One-line description shown in the collection list. |
| `cover` | string | Cover image path, relative to `config.md` (e.g. `images/cover.jpg`). |

### `pages` (frontmatter)

An ordered list of pages. Images inside the **same** `pages` entry are rendered
on the same page (or the same spread), in array order. Page order is array
order.

| Field | Type | Meaning |
| --- | --- | --- |
| `title` | string | Optional page title. |
| `text` | string | Optional page-level text, rendered at the top of the page. |
| `images` | array | One or more images that share this page. |

### `images` (per image)

| Field | Type | Meaning |
| --- | --- | --- |
| `file` | string | Image path, relative to `config.md` (e.g. `images/01.jpg`). Required. |
| `caption` | string | Short text rendered directly next to / under the image. |
| `text` | string | Longer text describing the image or the idea it presents. |

## Conventions

- `caption` is the short line beside the photo; `text` is the longer passage
  that describes the image or the concept behind it. Either may be omitted.
- Text can be any language; this collection defaults to Chinese.
- Image paths are relative to `config.md` and start with `images/` (e.g.
  `images/01.jpg`). All photos live in the `images/` directory.
- Multi-line text uses a YAML block scalar (e.g. `text: |`), rather than one
  long single line.

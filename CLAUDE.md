# CLAUDE.md — Unique Soccer Academy website

This file tells Claude Code how to work on this project. Read it before every task.

## What this project is

The official website of **Unique Soccer Academy (USA)**, a third-division football club in
Kasoa-Apra (Gomoa East, Central Region, Ghana). It was first built by Isaac Otabil in his first
year at Ghana Communications Technology University as a mid-semester project, and it is now being
redesigned to look modern, animated and professional.

## Hard rules

1. **Plain HTML, CSS and vanilla JavaScript only.** No React, no Tailwind, no jQuery, no build step.
   The site must run by opening the files with VS Code Live Server and deploy as-is to GitHub Pages.
2. **Allowed external resources:** Google Fonts and Font Awesome 6 (cdnjs). Nothing else from a CDN.
3. **Never invent club facts.** Names, dates, scores, player names, phone numbers and stats come
   only from the existing pages or from Isaac. When content is missing, use a clearly marked
   placeholder like `TODO: add real result` and list every placeholder in your summary.
4. **Keep every existing real link** (Facebook, WhatsApp, email, phone numbers, Google Maps embeds).
5. **Work one phase at a time.** Do only what the current prompt asks. Don't start the next phase.
6. **Mobile first.** Every change must look right at 360px, 768px, 1024px and 1440px widths, with no
   horizontal scrolling.
7. **Respect `prefers-reduced-motion`.** Every animation must switch off or become a simple fade
   when the user has reduced motion turned on.
8. **Accessibility basics always:** real `<button>`s for things that act like buttons, `alt` text on
   every image, visible focus styles, keyboard support for menus, the lightbox and modals,
   colour contrast of at least 4.5:1 for text.

## How to explain your work to Isaac

Isaac is an IT student who wants to **understand** the code, not just receive it.

- Before editing, give a short plan: which files you'll touch and why.
- Prefer targeted edits over rewriting whole files, unless a file is too tangled to fix.
- After editing, explain in **plain, simple words**:
  - what each new or changed file does,
  - what each new CSS technique or JS concept is and why it's used
    (for example: "CSS variables", "IntersectionObserver", "event delegation"),
  - how to see the change in the browser.
- Finish every task with a **commit message in this two-part format**:

  ```
  Short summary in the imperative (max ~60 characters)

  - Bullet describing one change
  - Bullet describing another change
  ```

## Brand and design system

The colours come from the club crest (red shield, gold/yellow, black).

| Token | Value | Use |
|---|---|---|
| `--black` | `#0B0B0D` | Header, footer, dark sections |
| `--charcoal` | `#16171B` | Cards on dark sections |
| `--gold` | `#F5C518` | Main accent, buttons, highlights |
| `--gold-dark` | `#D4A90F` | Button hover |
| `--red` | `#D62828` | Secondary accent, badges, underlines |
| `--white` | `#FFFFFF` | Text on dark |
| `--off-white` | `#F7F5EF` | Light section backgrounds |
| `--grey` | `#6B6F76` | Muted text |

- **Fonts:** `Oswald` (600/700, uppercase) for headings, `Inter` (400/500/600) for body text.
- **Radius:** `--radius-sm: 8px`, `--radius: 16px`, `--radius-lg: 24px`.
- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px as `--space-*` variables.
- **Shadows:** one soft (`--shadow-sm`) and one deep (`--shadow-lg`) shadow variable.
- **Motion:** `--ease: cubic-bezier(.22,1,.36,1)`, durations 200ms (hover) / 600ms (reveal).
- Sections alternate between dark (`--black`) and light (`--off-white`) backgrounds.
- Never use pure `yellow` (#FFFF00) or Times New Roman again.

## Project structure (target)

```
/
├── index.html            Home
├── about.html            Story, timeline, leadership, schedule
├── team.html             Coaches and players
├── news.html             News, announcements, fixtures & results
├── gallery.html          Photos and videos (tabs + lightbox)
├── contact.html          Contact cards, join form, maps, FAQ
├── 404.html              Friendly "page not found"
├── css/style.css         All styles, split into numbered sections
├── js/layout.js          Builds the shared header and footer on every page
├── js/main.js            Menu, scroll effects, animations, back-to-top
├── js/data.js            Editable content: news, fixtures, players, gallery items
├── js/gallery.js         Gallery tabs and lightbox
├── js/news.js            News page: ticker, filters, next-match countdown, results
├── js/contact.js         Join form validation → WhatsApp message
├── assets/images/        Optimised images (.webp + original fallback)
├── assets/videos/        Videos + poster images
├── site.webmanifest, robots.txt, sitemap.xml
├── README.md
└── CLAUDE.md
```

## CSS organisation

`css/style.css` is split into clearly commented, numbered sections:
`1 Tokens` → `2 Reset & base` → `3 Typography` → `4 Layout helpers` → `5 Buttons` →
`6 Header & nav` → `7 Footer` → `8 Components (cards, badges, tables, tabs, modal)` →
`9 Page sections` → `10 Animations` → `11 Utilities` → `12 Media queries`.
Use class names that describe what something **is** (`.card`, `.hero`, `.fixture`), not
numbered copies (`.mission1`, `.mission2`).

## Testing checklist (run after every phase)

- Open every page with Live Server, no console errors.
- Check 360px, 768px and 1440px widths in DevTools; no sideways scroll.
- Tab through the page with the keyboard; focus is always visible.
- Turn on "Emulate prefers-reduced-motion" in DevTools; nothing jumps around.

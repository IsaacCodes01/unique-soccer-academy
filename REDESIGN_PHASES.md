# Unique Soccer Academy — Redesign Plan for Claude Code

This is the full redesign, split into **14 phases**. Each phase has:

- **Goal**: what you'll have when it's done
- **Fixes**: which problems from the review it solves
- **Prompt**: copy it into Claude Code in VS Code
- **Check**: what to look at yourself before committing

## How to work through it

1. Put `CLAUDE.md` and this file in the root of the repo. Claude Code reads `CLAUDE.md` automatically.
2. Do **one phase per session**. When Claude Code finishes, read its explanation, test the
   site with **Live Server**, then commit using the message it gives you.
3. If a phase goes wrong, run `git restore .` (before committing) or `git revert HEAD`
   (after committing) and paste the prompt again with a note about what to do differently.
4. Tick the boxes as you go.

---

## Phase 0: Safety net and baseline ☐

**Goal:** A separate branch to work on, and "before" screenshots to compare with at the end.

```bash
git checkout -b redesign
mkdir -p docs/screenshots/before
```

**Prompt:**
```
Read CLAUDE.md and REDESIGN_PHASES.md, then read every file in this project.
Don't change any code yet.
1. Give me a short summary of how the site is built today: pages, CSS, JS, assets.
2. List every problem you find, grouped as Header/Nav, Visual design, Content, Code quality,
   Performance, Accessibility, SEO.
3. List every real fact about the club you find (dates, names, phone numbers, links), so we
   never lose them during the redesign.
4. Tell me how to take full-page screenshots of each page in Chrome DevTools so I can save
   "before" pictures in docs/screenshots/before/.
```

**Check:** Save the facts list somewhere. Take the "before" screenshots.

---

## Phase 1: Clean up and restructure the files ☐

**Goal:** A tidy folder structure with no duplicate or dead files, and valid HTML on every page.

**Fixes:** duplicate `gallery.html`/`photos.html`, unused `news.html`, misleading `node.js` name,
`<center>` tags, invalid CSS (`padding-top: -8px`, `line-height: 1.;`), missing meta tags,
vague titles, generic alt text, `.ogg` sources that don't exist.

**Prompt:**
```
Phase 1: cleanup and restructure. Follow CLAUDE.md.
1. Create the target folders: css/, js/, assets/images/, assets/videos/, docs/.
   Move images/ into assets/images/ and videos/ into assets/videos/, and update every path.
2. Rename node.js to js/main.js and update the <script> tags. Move the inline "current year"
   script into js/main.js.
3. Delete the duplicates: gallery.html is identical to photos.html, and news.html is not linked
   anywhere. Before deleting, show me proof they are duplicates/unused.
4. Remove every <center> tag (we'll centre things with CSS later) and fix invalid CSS
   (negative padding, "line-height: 1.;").
5. In every page's <head> add: <meta charset="UTF-8">, a unique <meta name="description">,
   a title in the form "Page | Unique Soccer Academy", and a theme-color meta tag.
6. Replace every alt="Player's image" with alt="Unique Soccer Academy photo 1", 2, 3...
   and mark them TODO so I can write real descriptions later.
7. Remove the .ogg <source> lines because those files don't exist.
Don't change the look of the site in this phase. Explain every change in plain words.
```

**Check:** Every page still opens and looks the same. No 404s in the DevTools Network tab.

---

## Phase 2: Design system (colours, fonts, spacing) ☐

**Goal:** One set of CSS variables that the whole site uses, plus a clean, organised stylesheet.

**Fixes:** harsh pure yellow, Times New Roman/Arial mix, repeated `.mission/.mission1/.mission2`
classes, no consistent spacing.

**Prompt:**
```
Phase 2: design system. Follow the "Brand and design system" and "CSS organisation" sections
of CLAUDE.md.
1. Load Google Fonts Oswald (600,700) and Inter (400,500,600) with preconnect, on every page.
2. Rewrite the top of css/style.css into section 1 (Tokens: colours, fonts, spacing, radius,
   shadows, motion as CSS variables), section 2 (a modern reset and base styles) and
   section 3 (typography scale using clamp() so headings shrink smoothly on phones).
3. Create reusable classes: .container (max-width 1200px, side padding), .section,
   .section--dark, .section--light, .section-title (with a small red accent bar above it),
   .eyebrow (small uppercase gold label), .btn, .btn--primary (gold), .btn--outline,
   .btn--ghost, .card, .badge.
4. Replace .mission, .mission1, .mission2 and the other near-duplicate rules with these shared
   classes. Delete CSS that is no longer used.
5. Add a visible :focus-visible style that uses the gold colour.
Explain what CSS variables and clamp() are, in simple words, with one example each from our code.
```

**Check:** The site now uses the new fonts and colours everywhere. It's okay if some sections look
unfinished, because the next phases rebuild them.

---

## Phase 3: Shared header and footer (write once, use everywhere) ☐

**Goal:** The header and footer live in **one** JavaScript file instead of being copied into
9 HTML files.

**Fixes:** header/footer duplicated in every page, so every change had to be made 9 times.

**Prompt:**
```
Phase 3: shared layout. Create js/layout.js that inserts the header into
<div id="site-header"></div> and the footer into <div id="site-footer"></div> on every page.
- Store the nav links in one array (label, href, icon) so adding a page means editing one line.
- Automatically add class="active" and aria-current="page" to the link that matches the current
  page.
- It must work when opened with Live Server AND on GitHub Pages (so no fetch() of HTML files;
  build the markup in JavaScript).
- Load it with <script src="js/layout.js" defer> before js/main.js on every page.
- Nav items for now: Home, About, Team, News, Gallery, Contact, plus a "Join Us" button.
  (team.html will be created in a later phase. Create a simple placeholder page for now so the
  link isn't broken.)
Remove the old copied header/nav/footer markup from all pages.
Explain what "defer" does and why we build the header in JS, in simple words.
```

**Check:** Change one nav label in `layout.js` and confirm it changes on every page. Then change it back.

---

## Phase 4: The new header and navigation ☐

**Goal:** A single, slim, modern sticky header that works perfectly on phones.

**Fixes:** two stacked fixed bars, nav wrapping into 3 rows on mobile and covering content,
hard-coded `padding-top: 125px`, only the first dropdown working on tap, icons outside the links.

**Prompt:**
```
Phase 4: header and navigation. Restyle the header that js/layout.js builds.
Desktop:
- One bar, 72px tall: crest + "UNIQUE SOCCER ACADEMY" wordmark on the left, links in the
  middle/right, gold "Join Us" button on the far right.
- On the home page the header starts transparent over the hero; after scrolling 60px it
  becomes solid black with a blur (backdrop-filter) and shrinks to 64px. On other pages it is
  solid from the start.
- Link hover: a gold underline that grows from the centre. Active link: gold text + underline.
- A thin gold scroll-progress bar along the bottom edge of the header.
Mobile (below 900px):
- Hamburger button (a real <button> with aria-expanded and aria-controls) that animates into an X.
- Full-height slide-in menu from the right with a dark overlay. Links fade in one after another
  (staggered). The Join Us button sits at the bottom of the menu, with the social icons.
- Close the menu with the X, the overlay, the Escape key, or by clicking a link. Lock page
  scrolling while it is open. Keep keyboard focus inside the menu while it is open.
Also:
- Remove the old fixed padding-top. Use a CSS variable --header-h so content always starts
  below the header.
- Hide the header when scrolling down and show it when scrolling up (only on mobile).
- Put all header JS in js/main.js and use requestAnimationFrame or passive listeners so
  scrolling stays smooth.
Explain aria-expanded, backdrop-filter and the scroll logic in simple words.
```

**Check:** Test at 360px: the menu opens and closes, nothing hides the page content, and Tab/Escape work.

---

## Phase 5: The new footer ☐

**Goal:** A clean, professional footer with readable text.

**Fixes:** 5 cramped columns, logo repeated 3 times, white text on olive (poor contrast),
placeholder Instagram link, sponsor link pointing to WhatsApp.

**Prompt:**
```
Phase 5: footer. Rebuild the footer from js/layout.js:
- Top: a gold "call to action" band: "Ready to become a champion?" + "Join the Academy" button
  (WhatsApp link) and "Contact Us" button.
- Main area on --black, 4 columns (stacking on mobile):
  1) Crest, short club description, motto "Where Champions Are Made"
  2) Quick links (from the same nav array)
  3) Contact: location link, phone numbers, email, WhatsApp (keep the real ones)
  4) Follow us: round social icon buttons with hover lift + gold glow; sponsor logo (Opass
     Construction) with the label "Proudly sponsored by"
- Bottom bar: © current year, "Built by Isaac Otabil", back-to-top link.
- The Instagram link is a placeholder: mark it TODO and hide it until I give the real URL.
- The sponsor logo should not link to WhatsApp. Make it plain text for now, with a TODO.
Check text contrast is at least 4.5:1.
```

**Check:** The footer looks good at every width, and all links open the right places.

---

## Phase 6: Home page ☐

**Goal:** A home page that looks like a real professional club website.

**Fixes:** plain hero with no call to action, mission/vision hidden behind hover, large
`Pitch.png`, no sections showing what the club does.

**Prompt:**
```
Phase 6: home page. Rebuild index.html with these sections, using the shared classes:
1. HERO (full viewport height, minus the header):
   - Pitch photo background with a dark gradient overlay and a slow "Ken Burns" zoom.
   - Small gold eyebrow "Kasoa-Apra · Est. 2020".
   - Huge Oswald headline "WHERE CHAMPIONS ARE MADE", with each word sliding up one after
     another on load.
   - One-line intro text, then two buttons: "Join the Academy" (primary, WhatsApp) and
     "Watch Highlights" (outline, goes to gallery.html#videos).
   - Crest floating gently on the right on desktop (hidden on small phones).
   - An animated scroll-down mouse icon at the bottom.
2. STATS STRIP: 4 counters that count up when they come into view:
   "2020 Founded", "14–19 Age group", "5 Training days a week", "TODO Players".
3. ABOUT PREVIEW: two columns, photo with a gold offset frame + short story + "Our Story"
   button to about.html.
4. MISSION & VISION: two cards, always visible (no hover-to-reveal), each with an icon;
   hover = lift + gold border glow.
5. WHAT WE OFFER: 3–4 cards (Team Training, Personal Training, Scholarship Pathways, Character
   Development) with icons.
6. LATEST NEWS: the 3 newest items from js/data.js (create data.js with an empty news array
   and a nice "No news yet. Stay tuned!" empty state).
7. GALLERY PREVIEW: 6 photos in a modern grid + "View Gallery" button.
8. SPONSORS: "Our Partners" with the Opass Construction logo, greyscale that turns colour on hover.
Use only real text from the old site, or TODO placeholders. Explain the Ken Burns effect and
the counter animation in simple words.
```

**Check:** Scroll slowly through the page on desktop and phone. Every section should look
intentional and nothing should overlap.

---

## Phase 7: About page ☐

**Goal:** Tell the club's story properly.

**Fixes:** wall of text, schedule hidden in a hover card, `border="5"` table, "SCHUDLES" typo.

**Prompt:**
```
Phase 7: about page. Rebuild about.html:
1. PAGE BANNER (reusable component for all inner pages): short dark banner with a background
   photo, page title, and breadcrumb "Home / About".
2. OUR STORY: the existing history split into readable paragraphs, with the crest.
3. TIMELINE: vertical timeline (alternating left/right on desktop, single line on mobile),
   with dots that fill gold as you scroll:
   - 20 March 2020: founded in Anyaa, Greater Accra, with 12 players at Anyaa M/A School
   - Moved to Auntie-Aku's Kokompe Park (date: TODO)
   - 11 February 2024: moved to the current home in Apra
   - Partnership with Mr. Emmanuel Opare Asamoah (Opass Construction) (date: TODO)
4. LEADERSHIP: cards for Mr. Nii Perrygrino Otoo (Founder) and Mr. Emmanuel Opare Asamoah
   (CEO, Opass Construction, major sponsor), with photo placeholders.
5. TRAINING SCHEDULE: a styled, always-visible table (proper <thead>, zebra rows, today's day
   highlighted gold using JS). On mobile it turns into stacked day cards. Fix "SCHUDLES".
6. WHO CAN JOIN: age group 14–19 card + "Join Us" button.
7. SUPPORT US: the sponsorship text as a highlighted call-to-action section.
```

**Check:** Look at the schedule on a phone, and check that today's day is highlighted.

---

## Phase 8: Gallery (photos + videos + lightbox) ☐

**Goal:** A modern media gallery.

**Fixes:** a photo click only opened the raw image in a new tab, a click on the video play
button also opened a new tab, videos had no posters, and Photos/Videos were separate pages.

**Prompt:**
```
Phase 8: gallery. Turn gallery.html into one page with two tabs, "Photos" and "Videos"
(accessible tabs with role="tablist"; gallery.html#videos opens the Videos tab).
Delete photos.html and videos.html and point everything to gallery.html.
Photos:
- List the photos in js/data.js (src, alt, category) and build the grid from it in
  js/gallery.js.
- Masonry-style responsive grid (CSS columns), images lazy-loaded, fade/scale in on scroll,
  hover zoom with a dark overlay and an expand icon.
- Lightbox: dark overlay, large image, caption, next/prev arrows, counter "3 / 16",
  keyboard arrows + Escape, swipe left/right on phones, click outside to close.
Videos:
- Cards with a poster image and a big play button. Clicking opens the video in a modal and plays
  it. Closing pauses it. Remove the old openvideo() new-tab behaviour.
- Generate poster images from the first frame of each video (tell me the ffmpeg command,
  or use a sensible fallback).
Explain how the lightbox code works step by step in plain words.
```

**Check:** Open the lightbox with the keyboard only, and try swiping on a phone in DevTools.

---

## Phase 9: News, announcements and fixtures ☐

**Goal:** One "News" page that is easy to keep updated, with no HTML editing needed.

**Fixes:** three empty pages (news1, announcements, news), a "BREAKING!" ticker with no news in it.

**Prompt:**
```
Phase 9: news. Merge news1.html and announcements.html into news.html, then delete them.
In js/data.js define three arrays with an example structure in comments, all EMPTY for now:
  news:          { date, title, summary, image, category: "News" | "Announcement" }
  fixtures:      { date, time, home, away, venue, competition }
  results:       { date, home, away, homeScore, awayScore, competition }
news.html should have:
1. Page banner.
2. A ticker bar that scrolls the latest headlines (pauses on hover, hidden when there are
   no items or when reduced motion is on).
3. Filter chips: All / News / Announcements / Fixtures & Results.
4. News cards (image, category badge, date, title, summary) that animate in.
5. NEXT MATCH card: big "USA vs Opponent" layout with a live countdown timer to kick-off.
6. Results list with W/D/L coloured badges.
7. A friendly designed empty state for each section ("No fixtures yet. Check back soon").
Then add a short "How to add news" comment at the top of data.js so I can update content myself.
```

**Check:** Add one fake news item and one fake fixture to `data.js`, check they display, then remove them.

---

## Phase 10: Team page ☐

**Goal:** Show the people behind the club.

**Prompt:**
```
Phase 10: team page. Build team.html:
- Page banner.
- Filter buttons: All / Coaches / Goalkeepers / Defenders / Midfielders / Forwards.
- Player cards built from a "players" array in js/data.js:
  { name, number, position, photo, age } (EMPTY for now, with an example in comments).
  Card style: photo, big faded shirt number in the background, name, position badge;
  hover = 3D tilt (small, using CSS transform on mouse move, disabled on touch and reduced motion).
- Coaches/staff section with Mr. Nii Perrygrino Otoo as Founder.
- Empty state: "Squad coming soon".
Explain how the filter works and how the tilt effect calculates the angle.
```

**Check:** Add 2 example players to `data.js` and try the filters.

---

## Phase 11: Contact and join form ☐

**Goal:** A useful contact page that lets players apply to join.

**Fixes:** big grey box of links, fixed-width 450px maps causing sideways scroll, no form.

**Prompt:**
```
Phase 11: contact page. Rebuild contact.html:
1. Page banner.
2. Contact cards grid: Call (both hotlines, tel: links), WhatsApp, Email, Facebook. Each card
   has an icon circle, hover lift, and a "copy" button for the phone/email that shows a small
   "Copied!" toast.
3. JOIN THE ACADEMY form: full name, age (14–19), position (select), phone, guardian's phone,
   message. Floating labels, inline validation messages, accessible errors.
   On submit, js/contact.js builds a neat message and opens WhatsApp (wa.me/233544400543)
   with it pre-filled. No backend needed.
4. FIND US: the two Google Maps embeds in responsive 16:9 frames with rounded corners, each
   with a title card ("Training ground: Apra, Gomoa East" / "Office: Ablekuma Agbagena") and a
   "Get directions" button.
5. FAQ accordion (smooth open/close, one open at a time): "What age can join?",
   "When is training?", "How do I join?", "How can I sponsor?", using only real info.
Explain how the form builds the WhatsApp link, including encodeURIComponent, in simple words.
```

**Check:** Submit the form with empty fields (you should see errors), then with valid data (WhatsApp should open with the message).

---

## Phase 12: Animations and modern polish ☐

**Goal:** Smooth, premium motion across the whole site, without making it slow or annoying.

**Prompt:**
```
Phase 12: animations and polish across the whole site.
1. Scroll-reveal system in js/main.js using IntersectionObserver: add data-reveal="up|left|
   right|zoom" and optional data-delay to elements. Elements animate once. Apply it to section
   titles, cards and images on every page, with staggered delays in grids.
2. Page load: a short preloader with the crest pulsing (max 800ms, skipped on repeat visits
   within the session), then the page fades in.
3. Smooth fade-out when clicking internal links, then fade-in on the next page.
4. Buttons: subtle shine sweep on hover; arrow icons slide right; press = scale(.97).
5. Section titles: red accent bar grows when revealed.
6. Back-to-top button: appears after scrolling, with a circular progress ring showing how far
   down the page you are.
7. Custom styled scrollbar and ::selection colour in brand colours.
8. Make sure EVERYTHING respects prefers-reduced-motion and only animates transform/opacity
   (for performance).
Explain IntersectionObserver and why we only animate transform and opacity.
```

**Check:** Turn on "Emulate prefers-reduced-motion: reduce" in DevTools (Rendering tab), and check that nothing slides around.

---

## Phase 13: Performance, SEO and extras ☐

**Goal:** A fast site on mobile data that looks good when shared on WhatsApp/Facebook.

**Fixes:** 2.7 MB `Pitch.png`, uncompressed photos, no social preview, no 404 page.

**Prompt:**
```
Phase 13: performance and SEO.
1. Convert all images to WebP (target: hero under 250KB, gallery photos under 150KB, max width
   1600px) using sharp via npx or cwebp. Keep the originals as fallbacks with <picture>.
   Tell me the exact command first and explain it.
2. Add width and height to every <img> to stop layout jumping; loading="lazy" on everything
   below the fold; fetchpriority="high" on the hero image.
3. Add Open Graph and Twitter meta tags (title, description, image) so links look good on
   WhatsApp and Facebook. Create a 1200x630 share image from the crest and pitch.
4. Add site.webmanifest, robots.txt, sitemap.xml and a styled 404.html (football-themed:
   "Offside! This page doesn't exist", with a Home button).
5. Add JSON-LD structured data for a SportsOrganization on index.html (real info only).
6. Run Lighthouse in Chrome DevTools and tell me how to read the results. Aim for 90+ in all
   four categories, and fix what it reports.
```

**Check:** Lighthouse scores, and the total page weight of the home page in the Network tab.

---

## Phase 14: Final QA, README and deploy ☐

**Goal:** Ship it.

**Prompt:**
```
Phase 14: final QA and deploy.
1. Go through every page and list any bugs, layout issues, broken links, console errors,
   leftover old CSS/JS, or unused files. Fix them.
2. List every remaining TODO placeholder in one table (file, line, what's needed) so I can
   collect the real info.
3. Update README.md: tick off completed features, update the project structure, and tell me
   where to put "after" screenshots (docs/screenshots/after/).
4. Tell me the exact git commands to merge the redesign branch into main and confirm the
   GitHub Pages settings.
```

```bash
git checkout main
git merge redesign
git push origin main
```

**Check:** Open the live site on your actual phone, and share the link on WhatsApp to see the preview card.

---

## Problem → Phase map

| Problem from the review | Fixed in |
|---|---|
| Two stacked header bars, nav covers content on mobile | 4 |
| Only first dropdown works on tap, icons outside links | 3, 4 |
| Times New Roman / Arial mix, harsh pure yellow | 2 |
| Mission, Vision, Schedule, Age group hidden behind hover | 6, 7 |
| Plain hero with no call to action | 6 |
| Cramped 5-column footer, poor contrast | 5 |
| Header/footer copied into 9 files | 3 |
| Duplicate/unused pages (gallery, photos, news) | 1, 8, 9 |
| Photos/videos open raw files in new tab, no posters | 8 |
| Empty News/Announcement pages | 9 |
| No team, fixtures or join section | 9, 10, 11 |
| Fixed-width maps cause sideways scroll | 11 |
| Placeholder Instagram link, sponsor → WhatsApp | 5 |
| `<center>`, invalid CSS, duplicate classes, `node.js` name | 1, 2 |
| Missing meta tags, vague titles, generic alt text | 1, 13 |
| 2.7 MB hero image, uncompressed photos | 13 |
| No animations | 4, 6, 12 |
| Outdated README | 14 |

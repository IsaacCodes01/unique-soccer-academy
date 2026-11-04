<div align="center">

<img src="assets/images/RYFC%20copy.png" alt="Royal Unique FC crest" width="120">

# Royal Unique FC

### *Where Champions Are Made*

The official website of **Royal Unique FC** (formerly Unique Soccer Academy), a third-division football club in
**Kasoa-Apra, Gomoa East, Central Region, Ghana**.

[**🌐 Live Site**](https://isaaccodes01.github.io/unique-soccer-academy/) ·
[Facebook](https://facebook.com/profile.php?id=61565360907088) ·
[WhatsApp](https://wa.me/233544400543) ·
[Email](mailto:uniquesocceracademy1@gmail.com)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-222?style=flat&logo=github)

</div>

---

## 📸 Preview

| Before (2025, first-year project) | After (2026 redesign) |
|---|---|
| ![Home page before the redesign, desktop](docs/screenshots/before/home-1440.png) | ![Home page after the redesign, desktop](docs/screenshots/after/home-1440.png) |
| ![Home page before the redesign, phone](docs/screenshots/before/home-360.png) | ![Home page after the redesign, phone](docs/screenshots/after/home-360.png) |

---

## ⚽ About the Club

Royal Unique FC (then called Unique Soccer Academy) was founded on **20th March 2020** by **Mr. Nii Perrygrino Otoo** in Anyaa,
Greater Accra, with just 12 players training at Anyaa M/A School. The academy later moved to
Auntie-Aku's Kokompe Park, and on **11th February 2024** it moved to its current home in **Apra**.
Mr. Otoo now leads the academy alongside **Mr. Emmanuel Opare Asamoah**, CEO of
**Opas Construction**, the club's major sponsor.

**Mission:** To nurture football talent while creating pathways for our players to reach
professional clubs, academies and scholarship opportunities, locally and internationally.

**Vision:** To become a globally respected institution that transforms promising young
footballers into professional athletes and well-rounded individuals.

---

## ✨ Features

### Design and experience
- [x] Modern brand design based on the club crest (black, gold and red), with Oswald + Inter fonts
- [x] Sticky header that turns from transparent to solid on scroll, with a scroll-progress bar
- [x] Animated hamburger menu with a slide-in mobile navigation (keyboard and screen-reader friendly)
- [x] Full-screen hero with a Ken Burns background, animated headline and call-to-action buttons
- [x] Scroll-reveal animations, count-up stats, hover micro-interactions and page transitions
- [x] Fully responsive from 360px phones to large desktops
- [x] Respects the user's *reduced motion* setting

### Pages
- [x] **Home**: hero, stats, mission & vision, what we offer, latest news, gallery preview, sponsors
- [x] **About**: club story, interactive timeline, leadership, training schedule, who can join
- [x] **Team**: coaches and players with position filters and a 3D tilt on hover
- [x] **News**: news & announcements with a headline ticker, next-match countdown, fixtures and results
- [x] **Gallery**: photo grid with a swipeable lightbox, plus a video player modal
- [x] **Contact**: contact cards, *Join the Academy* form (sends via WhatsApp), maps, FAQ
- [x] **404**: a friendly "Offside!" page

### Under the hood
- [x] Header and footer written once in `js/layout.js` and shared by every page
- [x] Content (news, fixtures, players, photos) lives in `js/data.js`, so updates need no HTML
- [x] Optimised WebP images, lazy loading and a fast Lighthouse score
- [x] SEO meta tags, Open Graph share previews, sitemap and structured data

---

## 🗂️ Project Structure

```
unique-soccer-academy/
├── index.html          # Home
├── about.html          # Story, timeline, leadership, schedule
├── team.html           # Coaches and players
├── news.html           # News, announcements, fixtures & results
├── gallery.html        # Photos and videos
├── contact.html        # Contact, join form, maps, FAQ
├── 404.html            # Page not found
├── css/
│   └── style.css       # All styles, 12 numbered sections (tokens → base → … → media queries)
├── js/
│   ├── boot.js         # Runs first, in <head>: preloader, WebP fallback
│   ├── layout.js       # Shared header + footer, image helpers
│   ├── main.js         # Menu, scroll effects, hero slideshow, reveals, page transitions
│   ├── data.js         # ✏️ Editable site content (news, fixtures, results, photos, videos, team)
│   ├── gallery.js      # Gallery tabs, lightbox and video player
│   ├── news.js         # News page: ticker, filters, countdown, results
│   ├── team.js         # Team page: cards, position filter, 3D tilt
│   └── contact.js      # Copy buttons, join form → WhatsApp, FAQ
├── assets/
│   ├── images/         # Photos (.jpg/.png + .webp + -thumb.webp), crest, icons, share image
│   └── videos/         # Gallery videos
├── docs/screenshots/
│   ├── before/         # The 2025 site, at 360px and 1440px
│   └── after/          # The 2026 redesign (add these, see below)
├── .github/
│   ├── workflows/optimize-images.yml   # Makes WebP copies when you push photos
│   └── scripts/optimize-images.js
├── site.webmanifest    # Name, colours and icons for "Add to Home screen"
├── robots.txt          # Rules for search engines
├── sitemap.xml         # List of pages for search engines
├── CLAUDE.md           # Rules for Claude Code
└── REDESIGN_PHASES.md  # The 14-phase redesign plan
```

### Adding the "after" screenshots

Put them in **`docs/screenshots/after/`**, named exactly like the ones in `before/` so the two
can be compared side by side: `home-1440.png`, `home-360.png`, `about-1440.png`, `about-360.png`,
and so on for `team`, `news`, `gallery` and `contact`. The Preview table at the top already
points to `after/home-1440.png` and `after/home-360.png`, so those two show up as soon as they exist.

To take them in Chrome: open the live site, press `F12`, click the phone/tablet icon
(*Toggle device toolbar*), type the width (360 or 1440) at the top, then open the `⋮` menu in that
toolbar and choose **Capture full size screenshot**.

---

## 🚀 Run It Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/IsaacCodes01/unique-soccer-academy.git
   cd unique-soccer-academy
   ```
2. Open the folder in **VS Code**.
3. Install the **Live Server** extension, right-click `index.html`, and choose **Open with Live Server**.

No installs or build step needed. It's plain HTML, CSS and JavaScript.

---

## ✏️ Updating the Content

All changing content lives in **`js/data.js`**. To add a news post, a fixture, a result or a
player, copy the example in the comment above that list, paste it between the `[` and `]`,
fill it in, save, and refresh the page. The pages sort everything by date for you.

```js
const NEWS = [
    {
        date: "2026-11-15",                  // year-month-day
        title: "Headline of the story",
        summary: "One or two sentences about what happened.",
        category: "News",                    // or "Announcement"
        image: "assets/images/Unique_10.jpg", // optional
        imageAlt: "What the photo shows"
    },
];
```

### Gallery photos and videos

Photos and videos are listed in `PHOTOS` and `VIDEOS` in `js/data.js`. To add a photo, put the
file in `assets/images/` and add one line with its `src`, `alt` (what the photo shows), `category`,
`width` and `height`.

### Video posters

Until a video has a `poster`, its card shows the video's own first frame. To make real poster
images, install [ffmpeg](https://ffmpeg.org/download.html) and run this from the project folder
(Git Bash):

```bash
mkdir -p assets/videos/posters
for v in assets/videos/*.mp4; do
  ffmpeg -y -ss 0.5 -i "$v" -frames:v 1 -q:v 3 "assets/videos/posters/$(basename "${v%.mp4}").jpg"
done
```

`-ss 0.5` takes the frame at half a second (the very first frame is often black), `-frames:v 1`
saves one frame, and `-q:v 3` is the JPEG quality (2 = best, 31 = worst). Then set each video's
poster in `js/data.js`, e.g. `poster: "assets/videos/posters/Unique_vids_1.jpg"`.

### Optimising images

Every `.jpg`/`.png` in `assets/images/` has a smaller `.webp` copy next to it, and each gallery
photo also has a 600px-wide `-thumb.webp` for the grids. The pages load the WebP and keep the
original as a fallback (`<picture>`).

**This happens automatically.** When you push a new or changed `.jpg`/`.png`, the GitHub Action
in `.github/workflows/optimize-images.yml` makes the WebP copies, commits them and republishes
the site (watch it in the repository's **Actions** tab). Afterwards run `git pull` so your
computer has the new files too.

To make them on your own computer instead (for example to preview before pushing), run these
three commands from the project folder (they work in PowerShell and Git Bash; `npx` downloads the
tool for you, nothing is added to the project):

```bash
# 1. Photos: WebP, at most 1600 x 1080, quality 65
npx sharp-cli@5 -i "assets/images/Unique_*.jpg" -o assets/images/ -f webp -q 65 --effort 6 resize 1600 1080 --fit inside --withoutEnlargement

# 2. Small copies for the photo grids, 600px wide
npx sharp-cli@5 -i "assets/images/Unique_*.jpg" -o "assets/images/{name}-thumb.webp" -f webp -q 65 --effort 6 resize 600 --withoutEnlargement

# 3. Hero and logos: higher quality, at most 1600px wide
npx sharp-cli@5 -i assets/images/Pitch.png assets/images/Opas.png "assets/images/RYFC copy.png" -o assets/images/ -f webp -q 80 --effort 6 resize 1600 --withoutEnlargement
```

- `-i` is the input (in quotes, `*` matches every photo), `-o` the output folder or file name
  (`{name}` = the original name without `.jpg`), `-f webp` the format.
- `-q` is the quality (1 to 100): lower is smaller but blurrier. `--effort 6` makes the smallest file.
- `resize W H --fit inside` shrinks the image to fit in a W x H box without cropping or stretching;
  `--withoutEnlargement` never makes a small image bigger.
- A new photo with a different name (say `player-10.jpg`) needs the same commands with its own name
  after `-i`. Forgot? No problem: the page shows the original instead (see `js/boot.js`).

Targets: hero under 250KB, gallery photos under 150KB.

### Share preview and SEO

- `assets/images/share-image.jpg` (1200 x 630) is the picture WhatsApp and Facebook show when
  someone shares a link. Each page's `<head>` has the Open Graph (`og:`) and Twitter tags for it.
  Facebook keeps old previews for a while: paste a link into the
  [Sharing Debugger](https://developers.facebook.com/tools/debug/) and click *Scrape Again*.
- `sitemap.xml` lists every page. Add new pages to it, and send it to Google in
  [Search Console](https://search.google.com/search-console).
- `robots.txt` only counts at the root of a domain. On GitHub Pages the site lives in
  `/unique-soccer-academy/`, so search engines read `isaaccodes01.github.io/robots.txt` instead.
  The file is ready for when the club gets its own domain; until then, submit the sitemap in
  Search Console.

---

## 🌍 Deployment

The site is hosted on **GitHub Pages** from the `main` branch.
Any push to `main` updates the live site within a minute or two.

*Settings → Pages → Build and deployment → Source: **Deploy from a branch** → Branch: **`main`**, folder **`/ (root)`***

GitHub Pages shows `404.html` automatically for any address that doesn't exist.

---

## 🎨 Brand Colours

| Colour | Hex | Use |
|---|---|---|
| ⬛ Black | `#0B0B0D` | Header, footer, dark sections |
| 🟨 Gold | `#F5C518` | Main accent and buttons |
| 🟥 Red | `#D62828` | Highlights and badges |
| ⬜ Off-white | `#F7F5EF` | Light sections |

---

## 🤝 Sponsorship

We welcome individuals, businesses and organisations who want to support young football talent,
through equipment, training support or visibility.
Reach us on [WhatsApp](https://wa.me/233544400543) or at
[uniquesocceracademy1@gmail.com](mailto:uniquesocceracademy1@gmail.com).

**Proudly sponsored by Opas Construction.**

---

## 👨🏾‍💻 Author

Built and maintained by **Isaac Otabil**, an IT student at Ghana Communications Technology University.

The first version was built in my first year as a mid-semester exam project (graded **A**).
The 2026 redesign was planned and built with the help of Claude Code.

---

<div align="center">

© Royal Unique FC · Kasoa-Apra, Ghana

</div>

<div align="center">

<img src="assets/images/usa_logo.png" alt="Unique Soccer Academy crest" width="120">

# Unique Soccer Academy

### *Where Champions Are Made*

The official website of **Unique Soccer Academy**, a third-division football club in
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
| ![Before](docs/screenshots/before/home.png) | ![After](docs/screenshots/after/home.png) |

---

## ⚽ About the Club

Unique Soccer Academy was founded on **20th March 2020** by **Mr. Nii Perrygrino Otoo** in Anyaa,
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
- [ ] Modern brand design based on the club crest (black, gold and red), with Oswald + Inter fonts
- [ ] Sticky header that turns from transparent to solid on scroll, with a scroll-progress bar
- [ ] Animated hamburger menu with a slide-in mobile navigation (keyboard and screen-reader friendly)
- [ ] Full-screen hero with a Ken Burns background, animated headline and call-to-action buttons
- [ ] Scroll-reveal animations, count-up stats, hover micro-interactions and page transitions
- [ ] Fully responsive from 360px phones to large desktops
- [ ] Respects the user's *reduced motion* setting

### Pages
- [ ] **Home**: hero, stats, mission & vision, what we offer, latest news, gallery preview, sponsors
- [ ] **About**: club story, interactive timeline, leadership, training schedule, who can join
- [ ] **Team**: coaches and players with position filters
- [ ] **News**: news & announcements, next-match countdown, fixtures and results
- [ ] **Gallery**: photo grid with a swipeable lightbox, plus a video player modal
- [ ] **Contact**: contact cards, *Join the Academy* form (sends via WhatsApp), maps, FAQ
- [ ] **404**: a friendly "Offside!" page

### Under the hood
- [ ] Header and footer written once in `js/layout.js` and shared by every page
- [ ] Content (news, fixtures, players, photos) lives in `js/data.js`, so updates need no HTML
- [ ] Optimised WebP images, lazy loading and a fast Lighthouse score
- [ ] SEO meta tags, Open Graph share previews, sitemap and structured data

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
│   └── style.css       # All styles (tokens → base → components → pages → animations)
├── js/
│   ├── layout.js       # Shared header + footer
│   ├── main.js         # Menu, scroll effects, animations
│   ├── data.js         # ✏️ Editable site content
│   ├── gallery.js      # Gallery tabs and lightbox
│   ├── news.js         # News page: ticker, filters, countdown, results
│   ├── team.js         # Team page: cards, position filter, 3D tilt
│   └── contact.js      # Join form → WhatsApp
├── assets/
│   ├── images/
│   └── videos/
├── docs/screenshots/   # Before/after screenshots
├── CLAUDE.md           # Rules for Claude Code
└── REDESIGN_PHASES.md  # Step-by-step redesign plan
```

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
player, copy an example object, fill it in, save, and refresh the page.

```js
news: [
  {
    date: "2026-11-15",
    title: "Pre-season training camp begins",
    summary: "Players report to Apra for the start of camp.",
    image: "assets/images/news/camp.webp",
    category: "News"            // or "Announcement"
  }
],
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

---

## 🌍 Deployment

The site is hosted on **GitHub Pages** from the `main` branch.
Any push to `main` updates the live site within a minute or two.

*Settings → Pages → Source: Deploy from a branch → `main` / root*

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

© Unique Soccer Academy · Kasoa-Apra, Ghana

</div>

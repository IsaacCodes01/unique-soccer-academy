/* ==========================================================================
   gallery.js (gallery.html only)
   Builds the photo grid and the video cards from PHOTOS and VIDEOS in
   js/data.js. Uses reducedMotion and escapeHTML from js/main.js, which
   loads first.
   1. Tabs          2. Photo grid     3. Video cards
   4. Scroll-in     5. Dialog helpers 6. Lightbox      7. Video modal
   8. Start-up
   ========================================================================== */

const gallery = document.querySelector(".gallery");
const lightbox = document.getElementById("lightbox");
const videoModal = document.getElementById("video-modal");

/* --------------------------------------------------------------------------
   1. TABS
   Only the selected tab can be reached with Tab ("roving tabindex":
   tabindex 0 on it, -1 on the others); the arrow keys move between tabs.
   Each tab's aria-controls is the id of its panel, which is also the
   #hash in the address bar, so gallery.html#videos opens Videos.
   -------------------------------------------------------------------------- */
function initTabs() {
    const tablist = gallery.querySelector('[role="tablist"]');
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];

    function selectTab(tab, { focus = false, updateHash = false } = {}) {
        tabs.forEach((t) => {
            const selected = t === tab;
            t.setAttribute("aria-selected", selected);
            t.tabIndex = selected ? 0 : -1;
            document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
        });

        if (focus) tab.focus();
        // replaceState changes the address without reloading or jumping,
        // so the link can be shared and Back doesn't step through tabs
        if (updateHash) history.replaceState(null, "", "#" + tab.getAttribute("aria-controls"));
    }

    // The tab whose panel matches the #hash, or the first tab
    function tabFromHash() {
        return tabs.find((t) => "#" + t.getAttribute("aria-controls") === window.location.hash) || tabs[0];
    }

    tablist.addEventListener("click", (event) => {
        const tab = event.target.closest('[role="tab"]');
        if (tab) selectTab(tab, { updateHash: true });
    });

    tablist.addEventListener("keydown", (event) => {
        const index = tabs.indexOf(document.activeElement);
        let next = null;

        // % wraps round: right from the last tab goes to the first
        if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
        if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (event.key === "Home") next = tabs[0];
        if (event.key === "End") next = tabs[tabs.length - 1];

        if (next) {
            event.preventDefault(); // stop Home/End scrolling the page
            selectTab(next, { focus: true, updateHash: true });
        }
    });

    // e.g. someone edits the #hash by hand while on the page
    window.addEventListener("hashchange", () => selectTab(tabFromHash()));

    selectTab(tabFromHash());

    gallery.querySelector('[data-count-for="photos"]').textContent = PHOTOS.length;
    gallery.querySelector('[data-count-for="videos"]').textContent = VIDEOS.length;
}

/* --------------------------------------------------------------------------
   2. PHOTO GRID
   Each photo is a real <button>, so it works with Tab + Enter. The
   button's name for screen readers is the photo's alt text.
   data-index remembers which photo it is, for the lightbox.
   -------------------------------------------------------------------------- */
function buildPhotoGrid() {
    const photoGrid = document.getElementById("photo-grid");

    photoGrid.innerHTML = PHOTOS.map((photo, i) => `
        <li class="masonry__item">
            <button class="masonry__btn" type="button" data-index="${i}" aria-haspopup="dialog">
                <img src="${escapeHTML(photo.src)}" alt="${escapeHTML(photo.alt)}"
                     width="${Number(photo.width) || ""}" height="${Number(photo.height) || ""}"
                     loading="lazy" decoding="async">
                <span class="masonry__overlay" aria-hidden="true"><i class="fa-solid fa-expand"></i></span>
            </button>
        </li>`).join("");

    // Event delegation: one listener for the whole grid instead of 16
    photoGrid.addEventListener("click", (event) => {
        const button = event.target.closest(".masonry__btn");
        if (button) openLightbox(Number(button.dataset.index), button);
    });
}

/* --------------------------------------------------------------------------
   3. VIDEO CARDS
   The small <video> on each card is only a picture: no controls, and
   preload="metadata" downloads just the start of the file (enough for
   its length and first frame). "#t=0.1" asks the browser to show the
   frame at 0.1 seconds, which works as a poster until real poster
   images are added in js/data.js.
   -------------------------------------------------------------------------- */
function buildVideoGrid() {
    const videoGrid = document.getElementById("video-grid");

    videoGrid.innerHTML = VIDEOS.map((video, i) => `
        <li class="video-card">
            <button class="video-card__btn" type="button" data-index="${i}" aria-haspopup="dialog">
                <span class="video-card__media">
                    <video class="video-card__thumb" src="${escapeHTML(video.src)}#t=0.1"
                           ${video.poster ? `poster="${escapeHTML(video.poster)}"` : ""}
                           preload="metadata" muted playsinline tabindex="-1" aria-hidden="true"></video>
                    <span class="video-card__play" aria-hidden="true"><i class="fa-solid fa-play"></i></span>
                    <span class="video-card__duration" hidden></span>
                </span>
                <span class="video-card__body">
                    <span class="video-card__title">${escapeHTML(video.title)}</span>
                    <span class="video-card__hint">Play video</span>
                </span>
            </button>
        </li>`).join("");

    // Once a thumbnail knows its length, show it as "0:09" on the card
    videoGrid.querySelectorAll(".video-card__thumb").forEach((thumb) => {
        thumb.addEventListener("loadedmetadata", () => {
            const seconds = Math.round(thumb.duration);
            if (!Number.isFinite(seconds)) return;
            const label = thumb.parentElement.querySelector(".video-card__duration");
            label.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
            label.hidden = false;
        });
    });

    videoGrid.addEventListener("click", (event) => {
        const button = event.target.closest(".video-card__btn");
        if (button) openVideo(Number(button.dataset.index), button);
    });
}

/* --------------------------------------------------------------------------
   4. SCROLL-IN ANIMATION
   Same idea as the stat counters in main.js: an IntersectionObserver adds
   .is-visible when an item scrolls into view, and the CSS fades and
   scales it in (section 10 of style.css). Items in the hidden tab aren't
   on screen, so they animate when their tab is opened.
   With reduced motion we skip this: everything is simply there.
   -------------------------------------------------------------------------- */
function initScrollIn() {
    if (!("IntersectionObserver" in window) || reducedMotion.matches) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // animate only once
        });
    }, { rootMargin: "0px 0px -8% 0px" });

    gallery.querySelectorAll(".masonry__item, .video-card").forEach((item) => {
        item.classList.add("reveal");
        revealObserver.observe(item);
    });
}

/* --------------------------------------------------------------------------
   5. DIALOG HELPERS (shared by the lightbox and the video modal)
   showModal() opens a <dialog> on top of the page, makes everything
   behind it unclickable and closes it on Escape. We also stop the page
   scrolling behind it, and on close send keyboard focus back to the
   button that opened it, so the visitor doesn't lose their place.
   -------------------------------------------------------------------------- */
let dialogOpener = null;

function openDialog(dialog, button) {
    dialogOpener = button;
    dialog.showModal();
    document.body.classList.add("dialog-open");
}

function initDialog(dialog) {
    // "close" fires however the dialog was closed: X, Escape or a click outside
    dialog.addEventListener("close", () => {
        document.body.classList.remove("dialog-open");
        if (dialogOpener) dialogOpener.focus();
    });
    dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
}

/* --------------------------------------------------------------------------
   6. LIGHTBOX
   -------------------------------------------------------------------------- */
const SWIPE_MIN = 50; // px a finger must travel sideways to count as a swipe
let currentPhoto = 0;

function showPhoto(index) {
    // Wrap round: after the last photo comes the first, and before the
    // first comes the last ("+ PHOTOS.length" turns -1 into 15, not -1)
    currentPhoto = (index + PHOTOS.length) % PHOTOS.length;
    const photo = PHOTOS[currentPhoto];
    const img = lightbox.querySelector(".lightbox__img");

    // Hide the old photo, swap the file, and fade in once it has loaded
    // (the "load" listener is in initLightbox). The same photo again
    // wouldn't fire "load", so we only swap when it is a different one.
    if (img.getAttribute("src") !== photo.src) {
        img.classList.remove("is-loaded");
        img.src = photo.src;
    }
    img.alt = photo.alt;

    lightbox.querySelector(".lightbox__counter").textContent = `${currentPhoto + 1} / ${PHOTOS.length}`;
    lightbox.querySelector(".lightbox__category").textContent = photo.category;
    lightbox.querySelector(".lightbox__text").textContent = photo.alt;

    // Start downloading the photos on either side, so Next/Previous is instant
    [currentPhoto + 1, currentPhoto - 1].forEach((i) => {
        new Image().src = PHOTOS[(i + PHOTOS.length) % PHOTOS.length].src;
    });
}

function openLightbox(index, button) {
    showPhoto(index);
    openDialog(lightbox, button);
}

function initLightbox() {
    const img = lightbox.querySelector(".lightbox__img");
    img.addEventListener("load", () => img.classList.add("is-loaded"));

    lightbox.querySelector(".lightbox__arrow--prev").addEventListener("click", () => showPhoto(currentPhoto - 1));
    lightbox.querySelector(".lightbox__arrow--next").addEventListener("click", () => showPhoto(currentPhoto + 1));

    // Arrow keys. Escape needs no code: <dialog> closes itself on Escape.
    lightbox.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") showPhoto(currentPhoto + 1);
        if (event.key === "ArrowLeft") showPhoto(currentPhoto - 1);
    });

    // Click outside to close: anywhere that isn't the photo, its caption
    // or a button counts as "outside"
    lightbox.addEventListener("click", (event) => {
        if (!event.target.closest("img, figcaption, button")) lightbox.close();
    });

    // Swipe: remember where the finger went down, compare where it lifted.
    // Mostly sideways and far enough = swipe. Left = next, right = previous.
    let startX = null;
    let startY = null;

    lightbox.addEventListener("touchstart", (event) => {
        startX = event.changedTouches[0].clientX;
        startY = event.changedTouches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener("touchend", (event) => {
        if (startX === null) return;
        const dx = event.changedTouches[0].clientX - startX;
        const dy = event.changedTouches[0].clientY - startY;
        startX = null;

        if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy)) {
            showPhoto(currentPhoto + (dx < 0 ? 1 : -1));
        }
    }, { passive: true });
}

/* --------------------------------------------------------------------------
   7. VIDEO MODAL
   One <video> player is reused for every video: we just swap its src.
   -------------------------------------------------------------------------- */
function openVideo(index, button) {
    const video = VIDEOS[index];
    const player = videoModal.querySelector(".video-modal__player");

    videoModal.querySelector(".video-modal__title").textContent = video.title;
    if (player.getAttribute("src") !== video.src) {
        player.src = video.src;
        player.poster = video.poster || "";
    }

    openDialog(videoModal, button);
    // play() returns a Promise. If the browser refuses to autoplay, the
    // catch() swallows the error and the visitor just presses play.
    player.play().catch(() => {});
}

function initVideoModal() {
    const player = videoModal.querySelector(".video-modal__player");

    // Closing (X, Escape or outside click) pauses the video
    videoModal.addEventListener("close", () => player.pause());

    // The dialog box is exactly as big as its content, so a click whose
    // target is the <dialog> itself must have landed on the dark backdrop
    videoModal.addEventListener("click", (event) => {
        if (event.target === videoModal) videoModal.close();
    });
}

/* --------------------------------------------------------------------------
   8. START-UP
   -------------------------------------------------------------------------- */
if (gallery && lightbox && videoModal && typeof PHOTOS !== "undefined" && typeof VIDEOS !== "undefined") {
    initTabs();
    buildPhotoGrid();
    buildVideoGrid();
    initScrollIn();
    initDialog(lightbox);
    initDialog(videoModal);
    initLightbox();
    initVideoModal();
}

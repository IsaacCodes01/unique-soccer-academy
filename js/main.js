/* ==========================================================================
   main.js
   Runs after layout.js has built the header, so the header already exists.
   1. Mobile menu                2. Header scroll effects
   3. Newsletter form (footer)   4. Hero slideshow (home)
   5. Stat counters (home)       6. Latest news (home)
   7. Timeline dots (about)      8. Today's training (about)
   9. Scroll reveal              10. Page fade-out
   ========================================================================== */

// True when the visitor has asked their device for less motion
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const header = document.querySelector(".site-header");

if (header) {
    const toggle = header.querySelector(".nav-toggle");
    const menu = header.querySelector(".nav");
    const overlay = header.querySelector(".nav-overlay");
    const progressBar = header.querySelector(".scroll-progress");

    // The same width as the 900px breakpoint in style.css
    const mobileQuery = window.matchMedia("(max-width: 899.98px)");

    /* ----------------------------------------------------------------------
       1. MOBILE MENU
       ---------------------------------------------------------------------- */
    function isMenuOpen() {
        return toggle.getAttribute("aria-expanded") === "true";
    }

    function openMenu() {
        toggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("menu-open");
        header.classList.remove("is-hidden");
        // Move keyboard focus to the first link in the menu
        menu.querySelector("a").focus();
    }

    function closeMenu(returnFocus = true) {
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
        if (returnFocus) toggle.focus();
    }

    toggle.addEventListener("click", () => {
        if (isMenuOpen()) closeMenu();
        else openMenu();
    });

    overlay.addEventListener("click", () => closeMenu());

    // Event delegation: one listener on the whole menu instead of one per link.
    // closest("a") finds the link even if the click landed on its icon.
    menu.addEventListener("click", (event) => {
        if (event.target.closest("a") && isMenuOpen()) closeMenu(false);
    });

    document.addEventListener("keydown", (event) => {
        if (!isMenuOpen()) return;

        if (event.key === "Escape") {
            closeMenu();
            return;
        }

        // Focus trap: Tab from the last menu item jumps back to the X button,
        // Shift+Tab from the X button jumps to the last menu item.
        if (event.key === "Tab") {
            const links = menu.querySelectorAll("a");
            const last = links[links.length - 1];

            if (event.shiftKey && document.activeElement === toggle) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                toggle.focus();
            } else if (!toggle.contains(document.activeElement) && !menu.contains(document.activeElement)) {
                // Focus somehow escaped (e.g. clicked the logo): bring it back
                event.preventDefault();
                toggle.focus();
            }
        }
    });

    // If the window is widened to desktop while the menu is open, close it
    mobileQuery.addEventListener("change", (event) => {
        if (!event.matches && isMenuOpen()) closeMenu(false);
        if (!event.matches) header.classList.remove("is-hidden");
    });

    /* ----------------------------------------------------------------------
       2. HEADER SCROLL EFFECTS
       The scroll event can fire many times per frame. Instead of doing the
       work every time, we ask the browser for ONE requestAnimationFrame
       call before the next paint, and ignore extra scroll events until it
       has run ("ticking" remembers that one is already booked).
       ---------------------------------------------------------------------- */
    const SCROLLED_AT = 60;  // px scrolled before the header turns solid
    const HIDE_AFTER = 5;    // ignore tiny wobbles smaller than this
    const BACK_TO_TOP_AT = 600; // px scrolled before the back-to-top button appears
    const backToTop = document.querySelector(".back-to-top");
    const ring = backToTop && backToTop.querySelector(".back-to-top__progress");
    let lastY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const y = window.scrollY;

        // Solid + smaller after 60px
        header.classList.toggle("is-scrolled", y > SCROLLED_AT);

        // Progress bar: how far down the page we are, from 0 to 1
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(y / scrollable, 1) : 0;
        progressBar.style.setProperty("--progress", progress);

        // Back-to-top button: only once we are far enough down. Its ring
        // fills up with the same progress: dash offset 100 = empty, 0 = full.
        if (backToTop) {
            backToTop.classList.toggle("is-visible", y > BACK_TO_TOP_AT);
            ring.style.strokeDashoffset = 100 - progress * 100;
        }

        // Hide on scroll down, show on scroll up (mobile only, menu closed)
        const delta = y - lastY;
        if (Math.abs(delta) > HIDE_AFTER) {
            const hide = mobileQuery.matches && !isMenuOpen() && delta > 0 && y > header.offsetHeight;
            header.classList.toggle("is-hidden", hide);
            lastY = y;
        }

        ticking = false;
    }

    function requestUpdate() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(updateHeader);
        }
    }

    // "passive: true" promises we won't call preventDefault(), so the browser
    // can scroll straight away without waiting for our code to finish.
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    // A keyboard user tabbing into a hidden header should see it
    header.addEventListener("focusin", () => header.classList.remove("is-hidden"));

    // Scroll smoothly to the top (or jump, with reduced motion), then move
    // keyboard focus to the logo link so Tab carries on from the top.
    // preventScroll stops focus() from interrupting the smooth scroll.
    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
            header.querySelector(".brand").focus({ preventScroll: true });
        });
    }

    updateHeader(); // set the right state on load (e.g. after a refresh mid-page)
}

/* ==========================================================================
   3. NEWSLETTER FORM (footer)
   The site has no server or mailing-list service yet, so a sign-up opens
   the visitor's email app with a ready-made "please subscribe me" email
   to the club. They only have to press Send.
   TODO: swap this for a real mailing-list service when the club has one.
   ========================================================================== */
const newsletterForm = document.querySelector(".newsletter__form");

if (newsletterForm) {
    const emailInput = newsletterForm.querySelector(".newsletter__input");
    const status = document.getElementById("newsletter-status");
    const CLUB_EMAIL = "uniquesocceracademy1@gmail.com";

    newsletterForm.addEventListener("submit", (event) => {
        event.preventDefault(); // stop the browser reloading the page

        const email = emailInput.value.trim();

        // checkValidity() uses the browser's own rules for type="email"
        if (!email || !emailInput.checkValidity()) {
            emailInput.setAttribute("aria-invalid", "true");
            status.className = "newsletter__status is-error";
            status.textContent = "Please enter a valid email address, like name@example.com.";
            emailInput.focus();
            return;
        }

        emailInput.removeAttribute("aria-invalid");

        // encodeURIComponent makes spaces, @ and line breaks safe inside a link
        const subject = encodeURIComponent("Newsletter subscription");
        const body = encodeURIComponent(`Hello, please add ${email} to the Royal Unique FC newsletter.`);
        window.location.href = `mailto:${CLUB_EMAIL}?subject=${subject}&body=${body}`;

        status.className = "newsletter__status is-success";
        status.textContent = "Thanks! Your email app should open now. Press Send to finish subscribing.";
        newsletterForm.reset();
    });
}

/* ==========================================================================
   4. HERO SLIDESHOW (home page)
   The photos sit on top of each other; only the one with .is-active is
   visible (opacity 1). Every 6 seconds we move .is-active to the next
   photo and the CSS opacity transition makes them cross-fade.
   The slow zoom ("Ken Burns") is a CSS animation, see section 10 of
   style.css. With reduced motion we do nothing: just the first photo.
   ========================================================================== */
const hero = document.querySelector(".hero");

if (hero && !reducedMotion.matches) {
    const slidesBox = hero.querySelector(".hero__slides");
    const toggleBtn = hero.querySelector(".hero__toggle");
    const toggleIcon = toggleBtn.querySelector("i");
    const toggleText = toggleBtn.querySelector(".visually-hidden");
    const SLIDE_TIME = 6000; // ms each photo stays before fading to the next

    let current = slidesBox.querySelector(".hero__slide");
    const ready = [current]; // photos that have finished downloading, in page order
    let timer = null;
    let paused = false;

    function showNext() {
        if (ready.length < 2) return; // nothing to fade to yet
        const next = ready[(ready.indexOf(current) + 1) % ready.length];
        current.classList.remove("is-active");
        next.classList.add("is-active");
        current = next;
    }

    function play() {
        paused = false;
        hero.classList.remove("is-paused"); // CSS: zoom runs again
        clearInterval(timer);
        timer = setInterval(showNext, SLIDE_TIME);
        toggleIcon.className = "fa-solid fa-pause";
        toggleText.textContent = "Pause background slideshow";
    }

    function pause() {
        paused = true;
        hero.classList.add("is-paused"); // CSS: zoom freezes where it is
        clearInterval(timer);
        toggleIcon.className = "fa-solid fa-play";
        toggleText.textContent = "Play background slideshow";
    }

    // Downloads the other photos (listed in js/data.js). Each one is added
    // to the page straight away but only joins the slideshow once its
    // "load" event says the download is finished, so we never fade to a
    // half-loaded photo. If none of them load, the first photo just stays.
    function loadOtherSlides() {
        if (typeof HERO_SLIDES === "undefined") return;

        HERO_SLIDES.forEach((src) => {
            const img = new Image();
            img.className = "hero__slide";
            img.alt = "";
            img.decoding = "async";
            img.addEventListener("load", () => {
                ready.push(img);
                // Keep the same order as in the page, whatever finished first
                const all = [...slidesBox.children];
                ready.sort((a, b) => all.indexOf(a) - all.indexOf(b));
            });
            setImageSrc(img, src); // the .webp, with the original as fallback (layout.js)
            slidesBox.appendChild(img);
        });
    }

    toggleBtn.hidden = false;
    toggleBtn.addEventListener("click", () => {
        if (paused) play();
        else pause();
    });

    // "load" fires when the first photo, fonts and CSS are all done
    if (document.readyState === "complete") loadOtherSlides();
    else window.addEventListener("load", loadOtherSlides, { once: true });

    // If reduced motion is switched on while the page is open, stop
    reducedMotion.addEventListener("change", (event) => {
        if (event.matches) {
            pause();
            toggleBtn.hidden = true;
        }
    });

    play();
}

/* ==========================================================================
   5. STAT COUNTERS (home page)
   An IntersectionObserver tells us when an element scrolls into view,
   without us checking the scroll position ourselves. When a number is
   60% visible we count it up from 0 to its data-count value, once.
   ========================================================================== */
const counters = document.querySelectorAll("[data-count]");

function countUp(el) {
    const target = Number(el.dataset.count);
    const DURATION = 1600; // ms
    let start = null;

    // requestAnimationFrame calls step() before every screen refresh
    // (about 60 times a second) and passes in the current time.
    function step(now) {
        if (start === null) start = now;
        const progress = Math.min((now - start) / DURATION, 1); // 0 -> 1
        // "Ease out": fast at first, slowing down near the end
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

if (counters.length && "IntersectionObserver" in window && !reducedMotion.matches) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            countUp(entry.target);
            observer.unobserve(entry.target); // count only once
        });
    }, { threshold: 0.6 });

    counters.forEach((el) => {
        el.textContent = "0";
        counterObserver.observe(el);
    });
}

/* ==========================================================================
   6. LATEST NEWS (home page)
   Shows the 3 newest items from NEWS in js/data.js. While NEWS is empty,
   the "No news yet" message written in index.html simply stays.
   escapeHTML, formatDate and newsCard are also used by js/news.js.
   ========================================================================== */
const latestNews = document.getElementById("latest-news");
const NEWS_PAGE = "news.html";

// Turns characters like < and & into safe text, so a typo in data.js
// can't break the page's HTML
function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// "2024-09-19" -> "19 Sept 2024"
function formatDate(isoDate) {
    return new Date(isoDate + "T00:00:00").toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric"
    });
}

// "14:30" -> "2:30pm" (also used by js/news.js)
function formatTime(time) {
    if (!time) return "Time TBC";
    const [h, m] = time.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")}${h < 12 ? "am" : "pm"}`;
}

// "Isaac Otabil" -> "IO", "Coach" -> "C": the first letter of the first
// and the last word
function initials(name) {
    const words = name.trim().split(/\s+/);
    const first = words[0][0];
    const last = words.length > 1 ? words[words.length - 1][0] : "";
    return (first + last).toUpperCase();
}

// One news card, shared by the home page and news.html.
// Layout: picture on the left, words on the right (on every screen size).
// "fallbackLink" is where the title goes when the item has no link of its
// own: news.html on the home page, nowhere ("") on news.html itself.
// A link starting with "http" goes to another website (e.g. our Facebook
// post), so it opens in a new tab and the card says where it goes.
// data-reveal="up": it rises in when scrolled to (section 9).
function newsCard(item, fallbackLink = NEWS_PAGE) {
    const link = item.link || fallbackLink;
    const isExternal = /^https?:/.test(link);
    const isFacebook = /facebook\.com|fb\.watch/.test(link);
    const category = item.category === "Announcement" ? "Announcement" : "News";

    // No photo? The club crest on black keeps every card the same shape.
    const media = item.image
        ? pictureHTML(escapeHTML(item.image), `class="news-card__img" alt="${escapeHTML(item.imageAlt || "")}" loading="lazy"`)
        : `<span class="news-card__placeholder">${pictureHTML(escapeHTML(LOGO_SRC), 'alt="" width="804" height="933" loading="lazy"')}</span>`;

    // Who posted it: their photo if there is one, otherwise their initials
    let avatar = "";
    if (item.author) {
        avatar = item.authorPhoto
            ? pictureHTML(escapeHTML(item.authorPhoto), 'class="avatar" alt="" width="28" height="28" loading="lazy"')
            : `<span class="avatar" aria-hidden="true">${escapeHTML(initials(item.author))}</span>`;
    }

    const published = formatDate(item.date) + (item.time ? `, ${formatTime(item.time)}` : "");

    const newTab = isExternal
        ? ` target="_blank" rel="noopener"`
        : "";
    const title = link
        ? `<a href="${escapeHTML(link)}"${newTab}>${escapeHTML(item.title)}${isExternal ? '<span class="visually-hidden"> (opens in a new tab)</span>' : ""}</a>`
        : escapeHTML(item.title);

    // A hint under the summary; the whole card is already the link
    let source = "";
    if (isFacebook) source = `<span class="news-card__source"><i class="fab fa-facebook-f" aria-hidden="true"></i> Read on Facebook</span>`;
    else if (isExternal) source = `<span class="news-card__source"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Read more</span>`;

    return `
        <article class="news-card${link ? " news-card--link" : ""}" data-reveal="up">
            <div class="news-card__media">${media}</div>
            <div class="news-card__body">
                <div class="news-card__meta">
                    <span class="news-card__category news-card__category--${category.toLowerCase()}">${category}</span>
                    <span class="news-card__byline">
                        ${avatar}
                        ${item.author ? `<span class="visually-hidden">Posted by ${escapeHTML(item.author)},</span>` : ""}
                        <time class="news-card__date" datetime="${escapeHTML(item.date + (item.time ? "T" + item.time : ""))}">${published}</time>
                    </span>
                </div>
                <h3 class="news-card__title">${title}</h3>
                <p class="news-card__summary">${escapeHTML(item.summary)}</p>
                ${source}
            </div>
        </article>`;
}

if (latestNews && typeof NEWS !== "undefined" && NEWS.length > 0) {
    // Copy the list ([...NEWS]) so sorting doesn't change the original,
    // newest date first, then keep the first 3
    const newest = [...NEWS]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3);

    latestNews.innerHTML = newest.map((item) => newsCard(item)).join("");
}

/* ==========================================================================
   7. TIMELINE DOTS (about page)
   An IntersectionObserver watches each timeline item. rootMargin
   "-40%" at the bottom shrinks the watched area to the top 60% of the
   screen, so an item counts as "reached" once it scrolls up past that
   line. Scrolling back up empties the dot again. Without JS (or this
   browser feature) the list never gets .is-enhanced, so all dots stay gold.
   Only colours change, so this also runs with reduced motion.
   ========================================================================== */
const timeline = document.querySelector(".timeline");

if (timeline && "IntersectionObserver" in window) {
    timeline.classList.add("is-enhanced"); // CSS: dots start hollow

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // Inside the top 60%, or already scrolled off the top = reached.
            // Still below the line = not yet.
            const reached = entry.isIntersecting || entry.boundingClientRect.top < 0;
            entry.target.classList.toggle("is-reached", reached);
        });
    }, { rootMargin: "0px 0px -40% 0px" });

    timeline.querySelectorAll(".timeline__item").forEach((item) => timelineObserver.observe(item));
}

/* ==========================================================================
   8. TODAY'S TRAINING (about page)
   Each schedule row has data-day with the same number getDay() gives
   (0 = Sunday ... 6 = Saturday). We colour today's row gold and write a
   one-line summary above the table. On a day without a session (e.g.
   Saturday), the summary names the next day that has one instead.
   ========================================================================== */
const scheduleRows = [...document.querySelectorAll(".schedule tr[data-day]")];
const scheduleToday = document.getElementById("schedule-today");

if (scheduleRows.length && scheduleToday) {
    const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date().getDay();

    // The row for a day number, or undefined if there's no session that day
    const rowFor = (day) => scheduleRows.find((row) => Number(row.dataset.day) === day);

    // "Team Training, 5:30am – 7:30am", read from the row's two cells
    const describe = (row) => {
        const [time, programme] = row.querySelectorAll("td");
        return escapeHTML(`${programme.textContent}, ${time.textContent}`);
    };

    const todayRow = rowFor(today);

    if (todayRow) {
        todayRow.classList.add("is-today");
        todayRow.setAttribute("aria-current", "date"); // screen readers: "current date"
        todayRow.querySelector("th").insertAdjacentHTML("beforeend", ' <span class="badge badge--dark">Today</span>');
        scheduleToday.innerHTML = `<i class="fa-solid fa-calendar-day" aria-hidden="true"></i>
            Today (${DAY_NAMES[today]}): <strong>${describe(todayRow)}</strong>`;
    } else {
        // Step forward a day at a time; % 7 wraps Saturday (6) round to Sunday (0)
        let next = today;
        do {
            next = (next + 1) % 7;
        } while (!rowFor(next));

        scheduleToday.innerHTML = `<i class="fa-solid fa-calendar-day" aria-hidden="true"></i>
            No session today (${DAY_NAMES[today]}). Next up: <strong>${DAY_NAMES[next]}, ${describe(rowFor(next))}</strong>`;
    }

    scheduleToday.hidden = false;
}

/* ==========================================================================
   9. SCROLL REVEAL (every page)
   Give an element data-reveal="up", "left", "right" or "zoom" and it
   animates in the first time it scrolls into view (the animations are in
   section 10 of style.css). data-delay="200" makes it wait 200ms first,
   which staggers the cards in a grid.

   IntersectionObserver: we tell the browser which elements to watch and
   it calls us back when one enters or leaves the screen. Much cheaper
   than checking every element's position on every scroll event.
   rootMargin "-8%" at the bottom means "count it as visible once it is
   8% of the screen height above the bottom edge", so the animation
   happens where you can actually see it.

   Elements without data-delay that come into view at the same moment
   (they arrive in one batch of "entries") are staggered automatically,
   80ms apart. That's how the cards drawn by news.js, team.js and
   gallery.js ripple in without each needing its own delay.
   ========================================================================== */
const REVEAL_STAGGER = 80;   // ms between items revealed together
const REVEAL_MAX_DELAY = 400; // so the 20th photo doesn't wait 1.6 seconds

let revealObserver = null;

if ("IntersectionObserver" in window && !reducedMotion.matches) {
    revealObserver = new IntersectionObserver((entries, observer) => {
        let inBatch = 0;
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            // ?? means "use the right side when the left is missing"
            const delay = el.dataset.delay ?? Math.min(inBatch * REVEAL_STAGGER, REVEAL_MAX_DELAY);
            inBatch++;
            el.style.setProperty("--reveal-delay", `${delay}ms`);
            el.classList.add("is-revealed");
            observer.unobserve(el); // animate only once
        });
    }, { rootMargin: "0px 0px -8% 0px" });
}

// Starts watching every [data-reveal] inside "root" that hasn't been
// revealed yet. news.js, team.js and gallery.js call it again after
// drawing new cards. Without the observer (old browser or reduced
// motion) everything is simply marked as revealed.
function watchReveals(root = document) {
    root.querySelectorAll("[data-reveal]:not(.is-revealed)").forEach((el) => {
        if (revealObserver) revealObserver.observe(el);
        else el.classList.add("is-revealed");
    });
}

watchReveals();

/* ==========================================================================
   10. PAGE FADE-OUT (every page)
   Clicking a link to another page of this site fades the page out
   (.is-leaving in style.css), waits for the fade, then goes. The next
   page fades itself in with CSS. Links that open something else
   (other websites, email, phone, new tabs, #sections of this page)
   are left completely alone.
   ========================================================================== */
const LEAVE_TIME = 250; // ms, the same as the .is-leaving fade in style.css

document.addEventListener("click", (event) => {
    // defaultPrevented: another script already handled this click
    if (reducedMotion.matches || event.defaultPrevented) return;

    // Ctrl/Cmd/Shift-click and middle-click open new tabs or windows
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    // link.href is always the full address, e.g. http://127.0.0.1:5500/about.html
    const url = new URL(link.href);
    if (!url.protocol.startsWith("http") || url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return; // a #section on this page

    event.preventDefault();
    document.documentElement.classList.add("is-leaving");
    setTimeout(() => {
        location.href = url.href;
    }, LEAVE_TIME);
});

// The Back button can bring a page back from the browser's memory (the
// "back/forward cache") exactly as we left it: faded out. "pageshow"
// fires then with event.persisted = true, so we fade it back in.
window.addEventListener("pageshow", (event) => {
    if (event.persisted) document.documentElement.classList.remove("is-leaving");
});

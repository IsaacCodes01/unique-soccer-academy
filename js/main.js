/* ==========================================================================
   main.js
   Runs after layout.js has built the header, so the header already exists.
   1. Mobile menu   2. Header scroll effects   3. Old media helpers
   4. Newsletter form (footer)
   ========================================================================== */

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

    updateHeader(); // set the right state on load (e.g. after a refresh mid-page)
}

/* ==========================================================================
   3. OLD MEDIA HELPERS (replaced by the lightbox in Phase 8)
   ========================================================================== */
//Opens the image in another tab for a better view
function openImage(img){
    window.open(img.src, '_blank');
}
// Opens the video in another tab foe a better view
function openvideo(videoElement) {
    const videoSrc = videoElement.currentSrc || videoElement.src;
    window.open(videoSrc, '_blank');
}

/* ==========================================================================
   4. NEWSLETTER FORM (footer)
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
        const body = encodeURIComponent(`Hello, please add ${email} to the Unique Soccer Academy newsletter.`);
        window.location.href = `mailto:${CLUB_EMAIL}?subject=${subject}&body=${body}`;

        status.className = "newsletter__status is-success";
        status.textContent = "Thanks! Your email app should open now. Press Send to finish subscribing.";
        newsletterForm.reset();
    });
}

/* ==========================================================================
   layout.js
   Builds the shared header (logo + navigation) and footer and puts them
   into <div id="site-header"></div> and <div id="site-footer"></div>.
   Every page loads this file, so a change here shows up on every page.
   ========================================================================== */

// The navigation menu. One line per page: to add a page, add one line here.
// "match" lists extra pages that should also highlight this link.
const NAV_LINKS = [
    { label: "Home",    href: "index.html",   icon: "fa-solid fa-house" },
    { label: "About",   href: "about.html",   icon: "fa-solid fa-circle-info" },
    { label: "Team",    href: "team.html",    icon: "fa-solid fa-users" },
    // TODO (Phase 9): change to news.html once news1 + announcements are merged
    { label: "News",    href: "news1.html",   icon: "fa-solid fa-newspaper", match: ["announcements.html"] },
    // TODO (Phase 8): change to gallery.html once photos + videos are merged
    { label: "Gallery", href: "photos.html",  icon: "fa-solid fa-images",    match: ["videos.html"] },
    { label: "Contact", href: "contact.html", icon: "fa-solid fa-address-book" }
];

// The gold call-to-action button at the end of the menu
const JOIN_LINK = { label: "Join Us", href: "contact.html", icon: "fa-solid fa-futbol" };

// Social icons shown at the bottom of the mobile menu and in the footer.
// A link with an empty href still shows its icon, but as a "coming soon"
// icon that can't be clicked (see socialButton below).
const SOCIAL_LINKS = [
    { label: "Facebook",  href: "https://facebook.com/profile.php?id=61565360907088", icon: "fab fa-facebook-f" },
    { label: "WhatsApp",  href: "https://wa.me/233544400543",                        icon: "fab fa-whatsapp" },
    // TODO: add the club's real Instagram URL
    { label: "Instagram", href: "",                                                  icon: "fab fa-instagram" }
];

// Contact details shown in the footer (the same ones as on contact.html)
const CONTACT = {
    location: { label: "Kasoa-Apra, Central Region, Ghana", href: "https://maps.app.goo.gl/uH5maqUhNKFrEUw36" },
    phones: ["0533185607", "0544400543"],
    email: "uniquesocceracademy1@gmail.com",
    whatsapp: { label: "0544400543", href: "https://wa.me/233544400543" }
};

const LOGO_SRC = "assets/images/RYFC copy.png";
const SPONSOR_LOGO_SRC = "assets/images/Opas.png";

// Pages whose header starts transparent over a big hero image
const HERO_PAGES = ["index.html"];

// Works out the file name of the page we are on, e.g. "about.html".
// "/unique-soccer-academy/" (GitHub Pages home) gives "" -> "index.html".
// "/about" (GitHub Pages also serves pages without .html) gives "about.html".
function getCurrentPage() {
    let page = window.location.pathname.split("/").pop();
    if (page === "") page = "index.html";
    if (!page.includes(".")) page += ".html";
    return page.toLowerCase();
}

// Builds one <li><a>...</a></li> for the menu.
// "--i" is the link's position (0, 1, 2...) so CSS can delay each one a bit
// more than the last for the staggered fade-in on mobile.
function navItem(link, index, currentPage) {
    const pages = [link.href, ...(link.match || [])];
    const isActive = pages.includes(currentPage);
    const activeAttrs = isActive ? ' class="nav__link is-active" aria-current="page"' : ' class="nav__link"';

    return `
        <li class="nav__item" style="--i: ${index}">
            <a href="${link.href}"${activeAttrs}>
                <i class="${link.icon}" aria-hidden="true"></i> ${link.label}
            </a>
        </li>`;
}

// Builds one round social icon. With a real href it is a link that opens in
// a new tab. Without one it is a plain <span>: you can see the icon, but it
// can't be clicked or tabbed to, and screen readers hear "coming soon".
function socialButton(s, className) {
    if (!s.href) {
        return `
        <span class="${className} is-placeholder" title="${s.label} coming soon">
            <i class="${s.icon}" aria-hidden="true"></i>
            <span class="visually-hidden">${s.label} (coming soon)</span>
        </span>`;
    }
    return `
        <a class="${className}" href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}">
            <i class="${s.icon}" aria-hidden="true"></i>
        </a>`;
}

function buildHeader(currentPage) {
    const links = NAV_LINKS.map((link, i) => navItem(link, i, currentPage)).join("");
    const socials = SOCIAL_LINKS.map((s) => socialButton(s, "nav__social")).join("");
    const overlayClass = HERO_PAGES.includes(currentPage) ? " site-header--overlay" : "";

    return `
        <header class="site-header${overlayClass}">
            <div class="site-header__inner container">
                <a class="brand" href="index.html" aria-label="Unique Soccer Academy home">
                    <img class="brand__crest" src="${LOGO_SRC}" alt="">
                    <span class="brand__name">Unique Soccer <span class="text-gold">Academy</span></span>
                </a>

                <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu">
                    <span class="nav-toggle__bar" aria-hidden="true"></span>
                    <span class="nav-toggle__bar" aria-hidden="true"></span>
                    <span class="nav-toggle__bar" aria-hidden="true"></span>
                    <span class="visually-hidden">Menu</span>
                </button>

                <div class="nav-overlay" aria-hidden="true"></div>

                <nav class="nav" id="site-menu" aria-label="Main">
                    <ul class="nav__list">
                        ${links}
                    </ul>
                    <div class="nav__footer">
                        <a class="btn btn--primary nav__cta" href="${JOIN_LINK.href}">
                            <i class="${JOIN_LINK.icon}" aria-hidden="true"></i> ${JOIN_LINK.label}
                        </a>
                        <div class="nav__socials">${socials}</div>
                    </div>
                </nav>
            </div>
            <div class="scroll-progress" aria-hidden="true"></div>
        </header>`;
}

// Turns "0544400543" into "tel:+233544400543" (Ghana's country code
// replaces the leading 0) so tapping the number on a phone starts a call.
function telHref(number) {
    return "tel:+233" + number.slice(1);
}

function buildFooter() {
    const year = new Date().getFullYear();

    const quickLinks = NAV_LINKS.map((link) => `
        <li><a class="footer__link" href="${link.href}">${link.label}</a></li>`).join("");

    const phones = CONTACT.phones.map((number) => `
        <li>
            <i class="fa-solid fa-phone" aria-hidden="true"></i>
            <a class="footer__link" href="${telHref(number)}"><span class="visually-hidden">Call </span>${number}</a>
        </li>`).join("");

    const socials = SOCIAL_LINKS.map((s) => socialButton(s, "social-btn")).join("");

    return `
        <footer class="site-footer">
            <!-- Gold call-to-action band -->
            <div class="footer-cta">
                <div class="footer-cta__inner container">
                    <h2 class="footer-cta__title">Ready to become a champion?</h2>
                    <div class="btn-group">
                        <a class="btn btn--dark" href="${CONTACT.whatsapp.href}" target="_blank" rel="noopener">
                            <i class="fab fa-whatsapp" aria-hidden="true"></i> Join the Academy
                        </a>
                        <a class="btn btn--outline" href="contact.html">
                            <i class="fa-solid fa-envelope" aria-hidden="true"></i> Contact Us
                        </a>
                    </div>
                </div>
            </div>

            <!-- Four columns: about, quick links, contact, follow us -->
            <div class="footer-main container">
                <div class="footer-col footer-col--about">
                    <a class="footer-brand" href="index.html" aria-label="Unique Soccer Academy home">
                        <img class="footer-brand__crest" src="${LOGO_SRC}" alt="">
                        <span class="footer-brand__name">Unique Soccer <span class="text-gold">Academy</span></span>
                    </a>
                    <p>A third-division football club in Kasoa-Apra, in the Central Region of Ghana.</p>
                    <p class="footer-motto">Where <span class="text-gold">Champions</span> Are Made</p>
                </div>

                <nav class="footer-col" aria-label="Footer">
                    <h3 class="footer-col__title">Quick links</h3>
                    <ul class="footer-list footer-list--pairs">${quickLinks}
                    </ul>
                </nav>

                <div class="footer-col">
                    <h3 class="footer-col__title">Contact</h3>
                    <ul class="footer-list footer-list--icons">
                        <li>
                            <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
                            <a class="footer__link" href="${CONTACT.location.href}" target="_blank" rel="noopener">${CONTACT.location.label}</a>
                        </li>${phones}
                        <li>
                            <i class="fa-solid fa-envelope" aria-hidden="true"></i>
                            <a class="footer__link" href="mailto:${CONTACT.email}">${CONTACT.email}</a>
                        </li>
                        <li>
                            <i class="fab fa-whatsapp" aria-hidden="true"></i>
                            <a class="footer__link" href="${CONTACT.whatsapp.href}" target="_blank" rel="noopener"><span class="visually-hidden">WhatsApp </span>${CONTACT.whatsapp.label}</a>
                        </li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h3 class="footer-col__title">Follow us</h3>
                    <div class="social-list">${socials}
                    </div>

                    <div class="sponsor">
                        <p class="sponsor__label">Proudly sponsored by</p>
                        <!-- TODO: link to Opas Construction's real website or page once Isaac has it -->
                        <div class="sponsor__body">
                            <img class="sponsor__logo" src="${SPONSOR_LOGO_SRC}" alt="Opas Construction logo" width="56" height="56">
                            <span class="sponsor__name">Opas Construction</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Newsletter. There is no mailing-list service yet, so js/main.js
                 turns a sign-up into an email to the club (see section 4 there). -->
            <div class="newsletter">
              <div class="newsletter__inner container">
                <div class="newsletter__text">
                    <h3 class="newsletter__title">Subscribe to our newsletter</h3>
                    <p>Get the latest club news and match updates in your inbox.</p>
                </div>
                <div class="newsletter__signup">
                    <form class="newsletter__form" novalidate>
                        <label class="visually-hidden" for="newsletter-email">Email address</label>
                        <input class="newsletter__input" id="newsletter-email" name="email" type="email"
                               placeholder="Your email address" autocomplete="email" required
                               aria-describedby="newsletter-status">
                        <button class="btn btn--primary" type="submit">Subscribe</button>
                    </form>
                    <p class="newsletter__status" id="newsletter-status" role="status"></p>
                </div>
              </div>
            </div>

            <!-- Bottom bar -->
            <div class="footer-bottom">
                <div class="footer-bottom__inner container">
                    <p>&copy; ${year} Unique Soccer Academy. All rights reserved.</p>
                    <p>Built by Isaac Otabil</p>
                    <a class="footer__link footer-bottom__top" href="#site-header">
                        Back to top <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
        </footer>`;
}

// Put the header and footer into the page (skip if a page has no placeholder)
const headerSlot = document.getElementById("site-header");
const footerSlot = document.getElementById("site-footer");

if (headerSlot) {
    const page = getCurrentPage();
    headerSlot.innerHTML = buildHeader(page);
    // Lets the CSS pull the hero up underneath the transparent header
    if (HERO_PAGES.includes(page)) document.body.classList.add("has-hero-header");
}
if (footerSlot) footerSlot.innerHTML = buildFooter();

// Floating back-to-top button, bottom right. It is a real <button> because
// it does something (scrolls) instead of going to another page.
// main.js shows it after scrolling down and handles the click.
document.body.insertAdjacentHTML("beforeend", `
    <button class="back-to-top" type="button">
        <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
        <span class="visually-hidden">Back to top</span>
    </button>`);

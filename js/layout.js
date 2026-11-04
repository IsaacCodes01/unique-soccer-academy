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
    { label: "News",    href: "news.html",    icon: "fa-solid fa-newspaper" },
    { label: "Gallery", href: "gallery.html", icon: "fa-solid fa-images" },
    { label: "Contact", href: "contact.html", icon: "fa-solid fa-address-book" }
];

// The gold call-to-action button at the end of the menu
const JOIN_LINK = { label: "Join Us", href: "contact.html#join", icon: "fa-solid fa-futbol" };

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

// The newsletter service that stores the subscribers and sends the emails
// (see "Newsletter" in README.md).
// - action: the address the service gives for its sign-up form. While it
//   is "", a sign-up opens an email to the club instead (js/main.js).
// - emailField: the name the service expects for the email box:
//   "email" for Buttondown, "EMAIL" for Brevo, "fields[email]" for MailerLite.
// TODO: paste the club's form address once the account exists, e.g.
//   "https://buttondown.com/api/emails/embed-subscribe/USERNAME"
const NEWSLETTER = {
    action: "",
    emailField: "email"
};

const LOGO_SRC = "assets/images/RYFC copy.png";
const SPONSOR_LOGO_SRC = "assets/images/Opas.png";

/* --------------------------------------------------------------------------
   Image helpers, used by every script (this file loads before the others).
   Every .jpg/.png in assets/images has a smaller .webp copy next to it
   (see "Optimising images" in README.md).
   -------------------------------------------------------------------------- */

// "assets/images/Unique_7.jpg" -> "assets/images/Unique_7.webp"
function webpOf(src) {
    return src.replace(/\.(jpe?g|png)$/i, ".webp");
}

// "assets/images/Unique_7.jpg" -> "assets/images/Unique_7-thumb.webp",
// a 600px-wide copy for small grid tiles
function thumbOf(src) {
    return src.replace(/\.(jpe?g|png)$/i, "-thumb.webp");
}

// Builds <picture><source ...webp><img ...original></picture>.
// The browser takes the first <source> it understands (the WebP) and
// falls back to the <img> src. boot.js also falls back if the .webp file
// is missing. "attrs" is everything else the <img> needs (alt, class...).
// "webp" picks a different WebP file, e.g. thumbOf(src) for a thumbnail.
// srcset uses spaces to separate a file from its size, so a space in a
// file name ("RYFC copy") must be written as %20 there.
function pictureHTML(src, attrs, webp = webpOf(src)) {
    if (webp === src) return `<img src="${src}" ${attrs}>`; // not a jpg/png: no WebP copy
    return `<picture><source srcset="${webp.replace(/ /g, "%20")}" type="image/webp"><img src="${src}" ${attrs}></picture>`;
}

// For an <img> whose src is set from JavaScript: load the WebP, and keep
// the original in data-fallback for boot.js to use if the WebP fails
function setImageSrc(img, src) {
    const webp = webpOf(src);
    if (webp !== src) img.dataset.fallback = src;
    img.src = webp;
}

// Runs "callback" whenever a media query (from matchMedia) starts or stops
// matching. Safari before iOS 14 only knows the old addListener(), and
// calling the newer addEventListener() there crashes the whole script.
function onMediaChange(query, callback) {
    if (query.addEventListener) query.addEventListener("change", callback);
    else if (query.addListener) query.addListener(callback);
}

// Pages whose header starts transparent over a big hero image
const HERO_PAGES = ["index.html"];

// Pages without the gold "Ready to become a champion?" band in the footer.
// The contact page already has the join form and contact details, so the
// band would only send people to the page they're on.
const NO_CTA_PAGES = ["contact.html"];

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
                <a class="brand" href="index.html" aria-label="Royal Unique FC home">
                    ${pictureHTML(LOGO_SRC, 'class="brand__crest" alt="" width="804" height="933"')}
                    <span class="brand__name">Royal Unique <span class="text-gold">FC</span></span>
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

function buildFooter(currentPage) {
    const year = new Date().getFullYear();

    const quickLinks = NAV_LINKS.map((link) => `
        <li><a class="footer__link" href="${link.href}">${link.label}</a></li>`).join("");

    const phones = CONTACT.phones.map((number) => `
        <li>
            <i class="fa-solid fa-phone" aria-hidden="true"></i>
            <a class="footer__link" href="${telHref(number)}"><span class="visually-hidden">Call </span>${number}</a>
        </li>`).join("");

    const socials = SOCIAL_LINKS.map((s) => socialButton(s, "social-btn")).join("");

    // Gold call-to-action band: "" (nothing) on NO_CTA_PAGES
    const showCta = !NO_CTA_PAGES.includes(currentPage);
    const cta = showCta ? `
            <!-- Gold call-to-action band -->
            <div class="footer-cta">
                <div class="footer-cta__inner container">
                    <h2 class="footer-cta__title">Ready to become a champion?</h2>
                    <div class="btn-group">
                        <a class="btn btn--dark" href="${JOIN_LINK.href}">
                            <i class="${JOIN_LINK.icon}" aria-hidden="true"></i> Join the Academy
                        </a>
                        <a class="btn btn--outline" href="contact.html#contact-cards">
                            <i class="fa-solid fa-envelope" aria-hidden="true"></i> Contact Us
                        </a>
                    </div>
                </div>
            </div>` : "";

    return `
        <footer class="site-footer${showCta ? "" : " site-footer--no-cta"}">${cta}

            <!-- Four columns: about, quick links, contact, follow us -->
            <div class="footer-main container">
                <div class="footer-col footer-col--about">
                    <a class="footer-brand" href="index.html" aria-label="Royal Unique FC home">
                        ${pictureHTML(LOGO_SRC, 'class="footer-brand__crest" alt="" width="804" height="933" loading="lazy"')}
                        <span class="footer-brand__name">Royal Unique <span class="text-gold">FC</span></span>
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
                            ${pictureHTML(SPONSOR_LOGO_SRC, 'class="sponsor__logo" alt="Opas Construction logo" width="506" height="507" loading="lazy"')}
                            <span class="sponsor__name">Opas Construction</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Newsletter. With a service set in NEWSLETTER (top of this file)
                 the form posts the email to it; the service's "confirm your
                 email" page opens in a new tab (target="_blank"), so the
                 visitor stays on our site. Without one, js/main.js turns a
                 sign-up into an email to the club (see section 3 there). -->
            <div class="newsletter">
              <div class="newsletter__inner container">
                <div class="newsletter__text">
                    <h3 class="newsletter__title">Subscribe to our newsletter</h3>
                    <p>Get the latest club news and match updates in your inbox.</p>
                </div>
                <div class="newsletter__signup">
                    <form class="newsletter__form" novalidate${NEWSLETTER.action ? ` action="${NEWSLETTER.action}" method="post" target="_blank"` : ""}>
                        <label class="visually-hidden" for="newsletter-email">Email address</label>
                        <input class="newsletter__input" id="newsletter-email" name="${NEWSLETTER.emailField}" type="email"
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
                    <p>&copy; ${year} Royal Unique FC. All rights reserved.</p>
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

const page = getCurrentPage();

// (Hero pages also need class="has-hero-header" on their <body> in the HTML,
// so the CSS pulls the hero up under the transparent header from the start.)
if (headerSlot) headerSlot.innerHTML = buildHeader(page);
if (footerSlot) footerSlot.innerHTML = buildFooter(page);

// Floating back-to-top button, bottom right. It is a real <button> because
// it does something (scrolls) instead of going to another page.
// main.js shows it after scrolling down and handles the click.
// The SVG is the ring that fills up as you scroll: a faint full circle
// (the track) with the progress circle on top. pathLength="100" lets
// main.js and the CSS treat the ring's length as 100, whatever its size.
document.body.insertAdjacentHTML("beforeend", `
    <button class="back-to-top" type="button">
        <svg class="back-to-top__ring" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <circle class="back-to-top__track" cx="24" cy="24" r="22" pathLength="100"></circle>
            <circle class="back-to-top__progress" cx="24" cy="24" r="22" pathLength="100"></circle>
        </svg>
        <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
        <span class="visually-hidden">Back to top</span>
    </button>`);

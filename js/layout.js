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

const LOGO_SRC = "assets/images/RYFC copy.png";

// Works out the file name of the page we are on, e.g. "about.html".
// "/unique-soccer-academy/" (GitHub Pages home) gives "" -> "index.html".
// "/about" (GitHub Pages also serves pages without .html) gives "about.html".
function getCurrentPage() {
    let page = window.location.pathname.split("/").pop();
    if (page === "") page = "index.html";
    if (!page.includes(".")) page += ".html";
    return page.toLowerCase();
}

// Builds one <li><a>...</a></li> for the menu
function navItem(link, currentPage) {
    const pages = [link.href, ...(link.match || [])];
    const isActive = pages.includes(currentPage);
    const activeAttrs = isActive ? ' class="active" aria-current="page"' : "";

    return `
        <li>
            <a href="${link.href}"${activeAttrs}>
                <i class="${link.icon}" aria-hidden="true"></i> ${link.label}
            </a>
        </li>`;
}

function buildHeader(currentPage) {
    const links = NAV_LINKS.map((link) => navItem(link, currentPage)).join("");

    return `
        <header class="header">
            <a class="header__brand" href="index.html" aria-label="Unique Soccer Academy home">
                <img class="ulogo" src="${LOGO_SRC}" alt="">
                <span class="usa"><span class="us">UNIQUE SOCCER</span><br>ACADEMY</span>
            </a>
        </header>
        <div class="subheader">
            <nav class="navbar" aria-label="Main">
                <ul>
                    ${links}
                    <li>
                        <a class="btn btn--primary nav__cta" href="${JOIN_LINK.href}">
                            <i class="${JOIN_LINK.icon}" aria-hidden="true"></i> ${JOIN_LINK.label}
                        </a>
                    </li>
                </ul>
            </nav>
        </div>`;
}

// Same content as the old copied footer (it gets a full redesign in Phase 5)
function buildFooter() {
    const year = new Date().getFullYear();

    return `
        <footer>
            <div class="end">
                <div class="footers">
                    <div class="fh">
                        <img class="ulogo" src="${LOGO_SRC}" alt="Unique Soccer Academy logo">
                        <h3 class="usa"><span class="us">UNIQUE SOCCER</span><br>ACADEMY</h3>
                    </div>
                    <p>&copy; ${year} Unique Soccer Academy. All rights reserved.</p>
                </div>
                <div class="footers">
                    <p><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Location</p>
                    <a href="https://maps.app.goo.gl/uH5maqUhNKFrEUw36" target="_blank" rel="noopener">Kasoa-Apra, Ghana</a>
                </div>
                <div class="footers">
                    <p>Contact Us On Our Socials</p>
                    <a href="https://facebook.com/profile.php?id=61565360907088" target="_blank" rel="noopener"><i class="fab fa-facebook-f" aria-hidden="true"></i> Facebook</a>
                    <!-- TODO (Phase 5): placeholder link, needs the club's real Instagram URL -->
                    <a href="https://instagram.com" target="_blank" rel="noopener"><i class="fab fa-instagram" aria-hidden="true"></i> Instagram</a>
                    <a href="https://wa.me/233544400543" target="_blank" rel="noopener"><i class="fab fa-whatsapp" aria-hidden="true"></i> WhatsApp</a>
                </div>
                <div class="footers">
                    <p>Sponsors</p>
                    <div class="fh">
                        <img class="ulogo" src="assets/images/Opas.png" alt="Opass Construction logo">
                        <!-- TODO (Phase 5): sponsor should not link to WhatsApp -->
                        <a href="https://wa.me/233544400543" target="_blank" rel="noopener">Opass Construction</a>
                    </div>
                </div>
                <div class="footers">
                    <p>Motto</p>
                    <div class="fh">
                        <img class="ulogo" src="${LOGO_SRC}" alt="Unique Soccer Academy logo">
                        <h3>WHERE <span class="text-gold">CHAMPIONS</span> ARE MADE</h3>
                    </div>
                </div>
            </div>
        </footer>`;
}

// Put the header and footer into the page (skip if a page has no placeholder)
const headerSlot = document.getElementById("site-header");
const footerSlot = document.getElementById("site-footer");

if (headerSlot) headerSlot.innerHTML = buildHeader(getCurrentPage());
if (footerSlot) footerSlot.innerHTML = buildFooter();

/* ==========================================================================
   team.js (team.html only)
   Builds the coach and player cards from STAFF and PLAYERS in js/data.js.
   Uses reducedMotion, escapeHTML and watchReveals from js/main.js,
   which loads first.
   1. Helpers        2. Cards          3. Filter chips
   4. 3D tilt        5. Start-up
   ========================================================================== */

const teamPage = document.querySelector(".team-page");

/* --------------------------------------------------------------------------
   1. HELPERS
   -------------------------------------------------------------------------- */

// The filter buttons' data-filter values, in the order the squad is shown
const POSITIONS = ["goalkeeper", "defender", "midfielder", "forward"];

// Words for the screen-reader message and the "none yet" box
const FILTER_WORDS = {
    all: "everyone",
    coaches: "coaches and staff",
    goalkeeper: "goalkeepers",
    defender: "defenders",
    midfielder: "midfielders",
    forward: "forwards"
};

// " Midfielder " -> "midfielder", so small typos in data.js still match
const positionKey = (player) => String(player.position || "").trim().toLowerCase();

// Goalkeepers first, forwards last, then by shirt number. A position that
// isn't one of the four goes at the end. [...PLAYERS] copies the list, so
// the one in data.js is untouched.
function sortedSquad() {
    const rank = (player) => {
        const index = POSITIONS.indexOf(positionKey(player));
        return index === -1 ? POSITIONS.length : index;
    };
    return [...PLAYERS].sort((a, b) =>
        rank(a) - rank(b) || (Number(a.number) || 0) - (Number(b.number) || 0));
}

// The friendly box shown when a list is empty (same look as the news page)
function emptyState(icon, title, text) {
    return `
        <div class="news-empty">
            <span class="news-empty__icon" aria-hidden="true"><i class="${icon}"></i></span>
            <h4 class="news-empty__title">${title}</h4>
            <p>${text}</p>
        </div>`;
}

/* --------------------------------------------------------------------------
   2. CARDS
   Every card has data-reveal="up". After drawing a list, watchReveals()
   (main.js, section 9) makes the cards rise in, one after another, as
   they scroll into view.
   -------------------------------------------------------------------------- */

// The photo, or a silhouette until there is one
function cardMedia(person) {
    const inside = person.photo
        ? pictureHTML(escapeHTML(person.photo), `class="profile-card__photo" alt="Photo of ${escapeHTML(person.name)}" width="400" height="500" loading="lazy"`)
        : `<div class="profile-card__placeholder" aria-hidden="true">
               <i class="fa-solid fa-user"></i><span>Photo coming soon</span>
           </div>`;
    return `<div class="profile-card__media">${inside}</div>`;
}

function playerCard(player) {
    const hasNumber = player.number !== undefined && player.number !== "";
    const meta = [
        hasNumber ? `No. ${escapeHTML(player.number)}` : "",
        player.age ? `Age ${escapeHTML(player.age)}` : ""
    ].filter(Boolean).join(" &middot; ");

    return `
        <article class="profile-card" data-reveal="up">
            ${cardMedia(player)}
            ${hasNumber ? `<span class="profile-card__number" aria-hidden="true">${escapeHTML(player.number)}</span>` : ""}
            <div class="profile-card__body">
                <span class="badge">${escapeHTML(player.position || "Player")}</span>
                <h4 class="profile-card__name">${escapeHTML(player.name)}</h4>
                ${meta ? `<p class="profile-card__meta">${meta}</p>` : ""}
            </div>
        </article>`;
}

function staffCard(person) {
    // The hidden name makes the link say "WhatsApp Mr. ..." to screen readers
    const whatsapp = person.whatsapp
        ? `<a class="btn btn--primary profile-card__btn" href="${escapeHTML(person.whatsapp)}" target="_blank" rel="noopener">
               <i class="fab fa-whatsapp" aria-hidden="true"></i> WhatsApp
               <span class="visually-hidden">${escapeHTML(person.name)}</span>
           </a>`
        : "";

    return `
        <article class="profile-card" data-reveal="up">
            ${cardMedia(person)}
            <div class="profile-card__body">
                <span class="badge badge--gold">${escapeHTML(person.role)}</span>
                <h4 class="profile-card__name">${escapeHTML(person.name)}</h4>
                ${whatsapp}
            </div>
        </article>`;
}

const staffList = document.getElementById("staff-list");
const squadList = document.getElementById("squad-list");

function renderStaff() {
    if (STAFF.length === 0) {
        staffList.innerHTML = emptyState("fa-solid fa-clipboard", "Coaches coming soon",
            "Our coaches and staff will appear here.");
        return;
    }
    staffList.innerHTML = STAFF.map(staffCard).join("");
    watchReveals(staffList);
}

// Drawn again every time a filter chip is clicked
function renderSquad(filter) {
    if (PLAYERS.length === 0) {
        squadList.innerHTML = emptyState("fa-solid fa-shirt", "Squad coming soon",
            "Player profiles will appear here.");
        return;
    }

    const players = sortedSquad().filter((player) =>
        filter === "all" || positionKey(player) === filter);

    if (players.length === 0) {
        squadList.innerHTML = emptyState("fa-solid fa-shirt", `No ${FILTER_WORDS[filter]} yet`,
            "Check back soon, or tap All to see the whole squad.");
        return;
    }

    squadList.innerHTML = players.map(playerCard).join("");
    watchReveals(squadList);
}

/* --------------------------------------------------------------------------
   3. FILTER CHIPS
   Each chip has a data-filter value. Clicking one:
   - sets aria-pressed="true" on it and "false" on the others (the CSS
     styles that attribute, and screen readers say "pressed"),
   - hides the staff block unless the filter is "all" or "coaches",
   - hides the squad block when the filter is "coaches",
   - otherwise draws the squad again, keeping only players whose
     position matches the filter.
   -------------------------------------------------------------------------- */
function initFilters() {
    const chips = [...teamPage.querySelectorAll(".chip")];
    const staffBlock = document.getElementById("staff-block");
    const squadBlock = document.getElementById("squad-block");
    const status = document.getElementById("filter-status");

    const counts = { all: STAFF.length + PLAYERS.length, coaches: STAFF.length };
    POSITIONS.forEach((position) => {
        counts[position] = PLAYERS.filter((player) => positionKey(player) === position).length;
    });

    // Fill in the little numbers; 0 stays empty, and CSS hides empty ones
    chips.forEach((chip) => {
        chip.querySelector(".chip__count").textContent = counts[chip.dataset.filter] || "";
    });

    function applyFilter(filter) {
        chips.forEach((chip) => chip.setAttribute("aria-pressed", chip.dataset.filter === filter));
        staffBlock.hidden = filter !== "all" && filter !== "coaches";
        squadBlock.hidden = filter === "coaches";
        if (!squadBlock.hidden) renderSquad(filter);
        status.textContent = `Showing ${FILTER_WORDS[filter]}: ${counts[filter]}`;
    }

    // Event delegation: one listener for all six chips
    teamPage.querySelector(".chips").addEventListener("click", (event) => {
        const chip = event.target.closest(".chip");
        if (chip) applyFilter(chip.dataset.filter);
    });

    renderSquad("all");
}

/* --------------------------------------------------------------------------
   4. 3D TILT
   Only with a real mouse: not on touch screens, and not with reduced
   motion. When the mouse is over a card we work out where it is inside
   the card as a fraction from 0 to 1:
       x = 0 at the left edge, 0.5 in the middle, 1 at the right edge
       y = 0 at the top,       0.5 in the middle, 1 at the bottom
   "x - 0.5" turns that into -0.5 ... +0.5 (0 in the middle), and "* 2"
   into -1 ... +1. Multiplying by MAX_TILT gives -8deg ... +8deg.
   - rotateY (turning left/right) comes from x
   - rotateX (tipping forward/back) comes from y, flipped (0.5 - y)
   With these signs the part of the card under the mouse dips away from
   you, as if you were pressing on it. The CSS does the actual turning.
   -------------------------------------------------------------------------- */
const MAX_TILT = 8; // degrees, at the very edge of the card

// A device whose main pointer is a mouse or trackpad that can hover
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

function initTilt() {
    let card = null;         // the card under the mouse right now
    let lastMove = null;     // the newest mouse position
    let frame = 0;           // the waiting requestAnimationFrame, 0 = none

    // Updates the card once per screen refresh, however often the mouse
    // reports a move (that can be more often than the screen redraws)
    function tilt() {
        frame = 0;
        const box = card.getBoundingClientRect();
        // Math.min/max keep it 0-1 even at the very edge
        const x = Math.min(Math.max((lastMove.clientX - box.left) / box.width, 0), 1);
        const y = Math.min(Math.max((lastMove.clientY - box.top) / box.height, 0), 1);

        card.style.setProperty("--tilt-y", `${((x - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
        card.style.setProperty("--tilt-x", `${((0.5 - y) * 2 * MAX_TILT).toFixed(2)}deg`);
        card.style.setProperty("--shine-x", `${(x * 100).toFixed(1)}%`);
        card.style.setProperty("--shine-y", `${(y * 100).toFixed(1)}%`);
    }

    // Lay the card flat again (the CSS transition eases it back)
    function flatten() {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        if (!card) return;
        card.classList.remove("is-tilting");
        ["--tilt-x", "--tilt-y", "--shine-x", "--shine-y"].forEach((name) => card.style.removeProperty(name));
        card = null;
    }

    // Event delegation again: one listener on the section works for every
    // card, even the ones drawn again after a filter click
    teamPage.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse" || !canHover.matches || reducedMotion.matches) {
            flatten();
            return;
        }

        const over = event.target.closest(".profile-card");
        if (over !== card) flatten(); // moved off a card, or onto another one
        if (!over) return;

        card = over;
        card.classList.add("is-tilting");
        lastMove = event;
        if (!frame) frame = requestAnimationFrame(tilt);
    });

    teamPage.addEventListener("pointerleave", flatten);
}

/* --------------------------------------------------------------------------
   5. START-UP
   -------------------------------------------------------------------------- */
if (teamPage) {
    renderStaff();
    initFilters();
    initTilt();
}

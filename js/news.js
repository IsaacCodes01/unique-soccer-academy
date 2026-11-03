/* ==========================================================================
   news.js (news.html only)
   Builds the news page from NEWS, FIXTURES, RESULTS and CLUB_NAMES in
   js/data.js. Uses reducedMotion, escapeHTML, formatDate, formatTime and
   newsCard from js/main.js, which loads first.
   1. Helpers        2. Ticker          3. News cards
   4. Next match     5. Results         6. Filter chips
   7. Start-up
   ========================================================================== */

const newsPage = document.querySelector(".news-page");

/* --------------------------------------------------------------------------
   1. HELPERS
   -------------------------------------------------------------------------- */

// Newest date first. [...list] copies it, so the list in data.js is untouched.
const newestFirst = (list) => [...list].sort((a, b) => b.date.localeCompare(a.date));

// True if a team name is one of ours, e.g. "unique soccer academy " counts
function isClub(name) {
    const clean = String(name).trim().toLowerCase();
    return CLUB_NAMES.some((ours) => ours.toLowerCase() === clean);
}

// Ghana is on GMT all year (no summer time), so a Ghana kick-off time is
// the same as UTC. The "Z" on the end means UTC, so a visitor in another
// country still gets a countdown to the right moment.
function kickOff(fixture) {
    return new Date(`${fixture.date}T${fixture.time || "00:00"}:00Z`);
}

// The friendly box shown when a list is empty
function emptyState(icon, title, text) {
    return `
        <div class="news-empty">
            <span class="news-empty__icon" aria-hidden="true"><i class="${icon}"></i></span>
            <h4 class="news-empty__title">${title}</h4>
            <p>${text}</p>
        </div>`;
}

// A team's crest: the club crest for us, a plain shield for anyone else
function crest(name, size = "") {
    return isClub(name)
        ? `<img class="crest ${size}" src="${escapeHTML(LOGO_SRC)}" alt="" width="64" height="64">`
        : `<span class="crest crest--other ${size}" aria-hidden="true"><i class="fa-solid fa-shield"></i></span>`;
}

/* --------------------------------------------------------------------------
   2. TICKER
   The headlines are written twice, one after the other. The CSS slides
   the whole strip left by exactly half its width (-50%) and starts again;
   at that moment the second copy sits where the first one started, so
   the jump can't be seen and the loop looks endless.
   Hovering pauses it (CSS), and the button pauses it for keyboard and
   touch users. With reduced motion, or no news, it stays hidden.
   -------------------------------------------------------------------------- */
const TICKER_SPEED = 60; // pixels per second, the same for short and long strips

function initTicker() {
    const ticker = document.getElementById("ticker");
    if (NEWS.length === 0 || reducedMotion.matches) return;

    const track = ticker.querySelector(".ticker__track");
    const toggle = ticker.querySelector(".ticker__toggle");
    const toggleIcon = toggle.querySelector("i");
    const toggleText = toggle.querySelector(".visually-hidden");

    const headlines = newestFirst(NEWS).slice(0, 6).map((item) => `
        <span class="ticker__item">
            <span class="ticker__tag">${item.category === "Announcement" ? "Announcement" : "News"}</span>
            ${escapeHTML(item.title)}
        </span>`).join("");

    track.innerHTML = headlines + headlines;
    ticker.hidden = false;

    // Now that it's on screen we can measure it: half the strip is one copy
    const seconds = (track.scrollWidth / 2) / TICKER_SPEED;
    track.style.setProperty("--ticker-duration", `${Math.max(seconds, 10)}s`);

    toggle.addEventListener("click", () => {
        const paused = ticker.classList.toggle("is-paused");
        toggleIcon.className = paused ? "fa-solid fa-play" : "fa-solid fa-pause";
        toggleText.textContent = paused ? "Play headlines" : "Pause headlines";
    });

    // Reduced motion switched on while the page is open: hide it
    reducedMotion.addEventListener("change", (event) => {
        if (event.matches) ticker.hidden = true;
    });
}

/* --------------------------------------------------------------------------
   3. NEWS CARDS
   Drawn again every time a filter chip is clicked. Each card gets --i
   (0, 1, 2...) so the CSS can start each one 80ms after the last.
   -------------------------------------------------------------------------- */
const newsList = document.getElementById("news-list");

let cardObserver = null;
if ("IntersectionObserver" in window && !reducedMotion.matches) {
    cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // animate only once
        });
    }, { rootMargin: "0px 0px -8% 0px" });
}

const NEWS_EMPTY = {
    all:           ["No news yet. Check back soon", "News and announcements from the club will appear here."],
    news:          ["No news yet. Check back soon", "Stories from the club will appear here."],
    announcements: ["No announcements yet. Check back soon", "Official club notices will appear here."]
};

function renderNews(filter) {
    const items = newestFirst(NEWS).filter((item) => {
        if (filter === "news") return item.category !== "Announcement";
        if (filter === "announcements") return item.category === "Announcement";
        return true;
    });

    if (items.length === 0) {
        const [title, text] = NEWS_EMPTY[filter];
        newsList.innerHTML = emptyState("fa-regular fa-newspaper", title, text);
        return;
    }

    // "" = no fallback link: a card without its own link isn't clickable here
    newsList.innerHTML = items.map((item) => newsCard(item, "")).join("");

    if (cardObserver) {
        newsList.querySelectorAll(".news-card").forEach((card, i) => {
            card.style.setProperty("--i", Math.min(i, 5)); // don't make card 20 wait 1.6s
            card.classList.add("rise");
            cardObserver.observe(card);
        });
    }
}

/* --------------------------------------------------------------------------
   4. NEXT MATCH + COUNTDOWN
   The next match is the soonest fixture that kicked off less than two
   hours ago or hasn't kicked off yet. setInterval runs tick() once a
   second; each time we subtract "now" from the kick-off time (dates
   subtract as milliseconds) and split the gap into days, hours, minutes
   and seconds.
   -------------------------------------------------------------------------- */
const MATCH_LENGTH = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

function upcomingFixtures() {
    const now = Date.now();
    return FIXTURES
        .filter((f) => kickOff(f).getTime() + MATCH_LENGTH > now)
        .sort((a, b) => kickOff(a) - kickOff(b));
}

function renderNextMatch() {
    const box = document.getElementById("next-match");
    const moreBox = document.getElementById("more-fixtures");
    const [next, ...later] = upcomingFixtures();

    if (!next) {
        box.innerHTML = emptyState("fa-regular fa-calendar", "No fixtures yet. Check back soon",
            "Our next match will appear here with a countdown to kick-off.");
        return;
    }

    box.innerHTML = `
        <article class="next-match">
            <p class="next-match__competition">${escapeHTML(next.competition || "Match")}</p>
            <div class="next-match__teams">
                <div class="next-match__team">
                    ${crest(next.home, "crest--lg")}
                    <span class="next-match__name">${escapeHTML(next.home)}</span>
                </div>
                <span class="next-match__vs">vs</span>
                <div class="next-match__team">
                    ${crest(next.away, "crest--lg")}
                    <span class="next-match__name">${escapeHTML(next.away)}</span>
                </div>
            </div>
            <div class="countdown" role="timer" aria-label="Time until kick-off">
                <div class="countdown__unit"><span class="countdown__num" data-unit="days">0</span> Days</div>
                <div class="countdown__unit"><span class="countdown__num" data-unit="hours">00</span> Hours</div>
                <div class="countdown__unit"><span class="countdown__num" data-unit="mins">00</span> Mins</div>
                <div class="countdown__unit"><span class="countdown__num" data-unit="secs">00</span> Secs</div>
            </div>
            <p class="countdown__done" hidden></p>
            <ul class="next-match__info">
                <li><i class="fa-regular fa-calendar" aria-hidden="true"></i>
                    <time datetime="${escapeHTML(next.date)}">${formatDate(next.date)}</time></li>
                <li><i class="fa-regular fa-clock" aria-hidden="true"></i> ${formatTime(next.time)}</li>
                ${next.venue ? `<li><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${escapeHTML(next.venue)}</li>` : ""}
            </ul>
        </article>`;

    startCountdown(box.querySelector(".next-match"), kickOff(next));

    if (later.length) {
        moreBox.innerHTML = `
            <h4 class="fixture-list__title">Coming up</h4>
            <ul class="fixture-list">
                ${later.map((f) => `
                    <li class="fixture">
                        <span class="fixture__date">
                            <time datetime="${escapeHTML(f.date)}">${formatDate(f.date)}</time>
                            &middot; ${formatTime(f.time)}
                        </span>
                        <span class="fixture__teams">${escapeHTML(f.home)} <span class="fixture__vs">vs</span> ${escapeHTML(f.away)}</span>
                        <span class="fixture__venue">${escapeHTML([f.competition, f.venue].filter(Boolean).join(" · "))}</span>
                    </li>`).join("")}
            </ul>`;
    }
}

function startCountdown(card, kickOffTime) {
    const nums = {};
    card.querySelectorAll("[data-unit]").forEach((el) => { nums[el.dataset.unit] = el; });
    const countdown = card.querySelector(".countdown");
    const done = card.querySelector(".countdown__done");

    const SECOND = 1000, MINUTE = 60 * SECOND, HOUR = 60 * MINUTE, DAY = 24 * HOUR;
    let timer = null;

    function tick() {
        const gap = kickOffTime - Date.now(); // milliseconds left

        if (gap <= 0) {
            clearInterval(timer);
            countdown.hidden = true;
            done.hidden = false;
            done.textContent = "It's matchday! Kick-off has started.";
            return;
        }

        // Math.floor drops the leftover; % keeps only what's left over
        // after the bigger units, e.g. the hours that don't make a full day
        nums.days.textContent = Math.floor(gap / DAY);
        nums.hours.textContent = String(Math.floor((gap % DAY) / HOUR)).padStart(2, "0");
        nums.mins.textContent = String(Math.floor((gap % HOUR) / MINUTE)).padStart(2, "0");
        nums.secs.textContent = String(Math.floor((gap % MINUTE) / SECOND)).padStart(2, "0");
    }

    tick(); // show the right numbers straight away, not after 1 second
    timer = setInterval(tick, SECOND);
}

/* --------------------------------------------------------------------------
   5. RESULTS
   W / D / L is from our side's point of view: we compare our goals with
   theirs. If neither team is in CLUB_NAMES, the row just has no badge.
   -------------------------------------------------------------------------- */
const OUTCOMES = {
    W: { word: "Win",  css: "result-badge--win" },
    D: { word: "Draw", css: "result-badge--draw" },
    L: { word: "Loss", css: "result-badge--loss" }
};

function outcome(result) {
    const home = Number(result.homeScore);
    const away = Number(result.awayScore);
    let ours, theirs;
    if (isClub(result.home)) [ours, theirs] = [home, away];
    else if (isClub(result.away)) [ours, theirs] = [away, home];
    else return null;
    return ours > theirs ? "W" : ours < theirs ? "L" : "D";
}

function renderResults() {
    const box = document.getElementById("results");

    if (RESULTS.length === 0) {
        box.innerHTML = emptyState("fa-solid fa-trophy", "No results yet. Check back soon",
            "Scores from our matches will appear here after each game.");
        return;
    }

    box.innerHTML = `
        <ol class="results">
            ${newestFirst(RESULTS).map((r) => {
                const key = outcome(r);
                const badge = key
                    ? `<span class="result-badge ${OUTCOMES[key].css}">
                           <span aria-hidden="true">${key}</span>
                           <span class="visually-hidden">${OUTCOMES[key].word}</span>
                       </span>`
                    : "";
                return `
                <li class="result">
                    ${badge}
                    <div class="result__body">
                        <p class="result__meta">
                            <time datetime="${escapeHTML(r.date)}">${formatDate(r.date)}</time>
                            ${r.competition ? `&middot; ${escapeHTML(r.competition)}` : ""}
                        </p>
                        <p class="result__line">
                            <span class="result__team${isClub(r.home) ? " is-ours" : ""}">${escapeHTML(r.home)}</span>
                            <span class="result__score">${Number(r.homeScore)} &ndash; ${Number(r.awayScore)}</span>
                            <span class="result__team${isClub(r.away) ? " is-ours" : ""}">${escapeHTML(r.away)}</span>
                        </p>
                    </div>
                </li>`;
            }).join("")}
        </ol>`;
}

/* --------------------------------------------------------------------------
   6. FILTER CHIPS
   aria-pressed="true" marks the chip that is on (screen readers say
   "pressed"), and the CSS styles it from that same attribute. The
   news part and the matches part are shown or hidden with "hidden".
   -------------------------------------------------------------------------- */
function initFilters() {
    const chips = [...newsPage.querySelectorAll(".chip")];
    const newsBlock = document.getElementById("news-block");
    const matchesBlock = document.getElementById("matches-block");
    const status = document.getElementById("filter-status");

    const announcementCount = NEWS.filter((item) => item.category === "Announcement").length;
    const counts = {
        all: NEWS.length + FIXTURES.length + RESULTS.length,
        news: NEWS.length - announcementCount,
        announcements: announcementCount,
        fixtures: FIXTURES.length + RESULTS.length
    };
    const LABELS = { all: "everything", news: "news", announcements: "announcements", fixtures: "fixtures and results" };

    // Fill in the little numbers; 0 stays empty, and CSS hides empty ones
    chips.forEach((chip) => {
        const count = counts[chip.dataset.filter];
        chip.querySelector(".chip__count").textContent = count || "";
    });

    function applyFilter(filter) {
        chips.forEach((chip) => chip.setAttribute("aria-pressed", chip.dataset.filter === filter));
        newsBlock.hidden = filter === "fixtures";
        matchesBlock.hidden = filter === "news" || filter === "announcements";
        if (!newsBlock.hidden) renderNews(filter);
        status.textContent = `Showing ${LABELS[filter]}`;
    }

    // Event delegation: one listener for all four chips
    newsPage.querySelector(".chips").addEventListener("click", (event) => {
        const chip = event.target.closest(".chip");
        if (chip) applyFilter(chip.dataset.filter);
    });

    renderNews("all");
}

/* --------------------------------------------------------------------------
   7. START-UP
   -------------------------------------------------------------------------- */
if (newsPage) {
    initTicker();
    initFilters();
    renderNextMatch();
    renderResults();
}

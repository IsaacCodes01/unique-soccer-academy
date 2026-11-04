/* ==========================================================================
   demo-data.js — SAMPLE CONTENT FOR PREVIEWING ONLY
   Nothing here is real. Two ways to switch it on:
   1. Set DEMO_ALWAYS_ON below to true (and back to false when done), or
   2. Add "?demo" to the address once, e.g. news.html?demo. It then stays
      on while you click around the site, until you visit any page with
      "?demo=off" or close the browser tab.
   Before the site goes live: delete this file and the <script> line that
   loads it in news.html, index.html and team.html.
   ========================================================================== */

const DEMO_ALWAYS_ON = false;

// sessionStorage remembers a value for this browser tab only. It can be
// blocked (e.g. in some private windows), so it is wrapped in try/catch:
// if it fails, "?demo" still works for the page it is on.
function isDemoOn() {
    const param = new URLSearchParams(window.location.search).get("demo"); // null if absent
    let remembered = false;
    try {
        if (param !== null) sessionStorage.setItem("usa-demo", param === "off" ? "off" : "on");
        remembered = sessionStorage.getItem("usa-demo") === "on";
    } catch (error) {
        remembered = param !== null && param !== "off";
    }
    return DEMO_ALWAYS_ON || remembered;
}

if (isDemoOn()) {
    // Dates are worked out from today, so the countdown always has a
    // match to count down to. daysFromToday(-3) = 3 days ago, "2026-11-01".
    const daysFromToday = (days) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().slice(0, 10);
    };

    NEWS.push(
        {
            date: daysFromToday(-1), time: "18:45",
            title: "Demo: pre-season friendly confirmed",
            summary: "This is sample text to show how a news story with a photo looks. Clicking it opens the club's Facebook page.",
            category: "News",
            image: "assets/images/Unique_10.jpg",
            imageAlt: "Pre-season friendly poster",
            author: "Demo Writer",
            link: "https://facebook.com/profile.php?id=61565360907088"
        },
        {
            date: daysFromToday(-2), time: "09:00",
            title: "Demo: training moves to the evening session",
            summary: "This is a sample announcement with no photo, so the club crest fills the picture space. It has no link, so it isn't clickable.",
            category: "Announcement",
            author: "Royal Unique FC",
            authorPhoto: "assets/images/RYFC copy.png"
        },
        {
            date: daysFromToday(-6),
            title: "Demo: players back on the pitch",
            summary: "A sample story with a photo but no publish time and no author, to show those parts are optional.",
            category: "News",
            image: "assets/images/Unique_6.jpg",
            imageAlt: "Three academy players in yellow kits smiling on the pitch"
        }
    );

    FIXTURES.push(
        { date: daysFromToday(5),  time: "15:00", home: "Royal Unique FC", away: "Demo City FC",
          venue: "Demo Park", competition: "Demo League" },
        { date: daysFromToday(12), time: "09:30", home: "Demo Rovers", away: "Royal Unique FC",
          venue: "Demo Rovers Ground", competition: "Demo Cup" }
    );

    RESULTS.push(
        { date: daysFromToday(-4),  home: "Royal Unique FC", away: "Demo United", homeScore: 2, awayScore: 1, competition: "Demo League" },
        { date: daysFromToday(-11), home: "Demo Stars", away: "Royal Unique FC", homeScore: 1, awayScore: 1, competition: "Demo League" },
        { date: daysFromToday(-18), home: "Demo Athletic", away: "Royal Unique FC", homeScore: 3, awayScore: 0, competition: "Demo Cup" }
    );

    // Made-up people with no photos: real photos would put fake names on
    // real players. The kit photo shows how a picture is cropped.
    PLAYERS.push(
        { name: "Demo Keeper", number: 1, position: "Goalkeeper", photo: "", age: 18 },
        { name: "Demo Defender", number: 4, position: "Defender", photo: "", age: 17 },
        { name: "Demo Playmaker With A Long Name", number: 10, position: "Midfielder", photo: "", age: 16 },
        { name: "Demo Kit Model", number: 31, position: "Midfielder", photo: "assets/images/Unique_17.jpg" },
        { name: "Demo Striker", number: 9, position: "Forward", photo: "", age: 19 }
    );

    STAFF.push({ name: "Demo Coach", role: "Head Coach", photo: "" });

    // A gold label in the bottom-left corner so nobody mistakes this for real news
    document.body.insertAdjacentHTML("beforeend",
        '<p class="demo-notice"><strong>Demo mode:</strong> sample content. Open <a href="?demo=off">?demo=off</a> to hide it.</p>');
}

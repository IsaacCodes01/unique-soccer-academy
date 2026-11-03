/* ==========================================================================
   demo-data.js — SAMPLE CONTENT FOR PREVIEWING ONLY
   Nothing here is real. It only switches on when "?demo" is added to the
   address, e.g.  news.html?demo  or  index.html?demo. Without it, this
   file does nothing and visitors see the real lists in js/data.js.
   Before the site goes live: delete this file and the <script> line that
   loads it in news.html and index.html.
   ========================================================================== */

if (new URLSearchParams(window.location.search).has("demo")) {
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
            author: "Unique Soccer Academy",
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
        { date: daysFromToday(5),  time: "15:00", home: "Unique Soccer Academy", away: "Demo City FC",
          venue: "Demo Park", competition: "Demo League" },
        { date: daysFromToday(12), time: "09:30", home: "Demo Rovers", away: "Unique Soccer Academy",
          venue: "Demo Rovers Ground", competition: "Demo Cup" }
    );

    RESULTS.push(
        { date: daysFromToday(-4),  home: "Unique Soccer Academy", away: "Demo United", homeScore: 2, awayScore: 1, competition: "Demo League" },
        { date: daysFromToday(-11), home: "Demo Stars", away: "Unique Soccer Academy", homeScore: 1, awayScore: 1, competition: "Demo League" },
        { date: daysFromToday(-18), home: "Demo Athletic", away: "Unique Soccer Academy", homeScore: 3, awayScore: 0, competition: "Demo Cup" }
    );

    // A gold label in the bottom-left corner so nobody mistakes this for real news
    document.body.insertAdjacentHTML("beforeend",
        '<p class="demo-notice"><strong>Demo mode:</strong> sample content. Remove "?demo" from the address to hide it.</p>');
}

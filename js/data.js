/* ==========================================================================
   data.js
   Editable content for the site. Change things here, not in the HTML.
   1. Hero slideshow photos   2. News & announcements   3. Fixtures
   4. Results                 5. Gallery photos         6. Gallery videos
   7. Players                 8. Coaches & staff

   HOW TO ADD NEWS (or a fixture, or a result)
   1. Find the list below: NEWS, FIXTURES or RESULTS.
   2. Copy the example in the comment just above it.
   3. Paste it between the [ and the ], fill it in and keep the comma
      after the closing }. Each item is one { ... } block.
   4. Save, then open news.html to check it. The order in the list
      doesn't matter: the pages sort everything by date for you.
   Tips:
   - Dates are always year-month-day: "2024-09-19".
   - Times are 24-hour Ghana time: "14:30" is 2:30pm.
   - Put text in "double quotes". If the text itself needs a double
     quote, use a single one (') instead.
   - A page went blank? Press F12 and look at the Console: it names the
     line with the typo (usually a missing comma or quote).
   - When a match is played, move it from FIXTURES to RESULTS and add
     the score.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. HERO SLIDESHOW (home page)
   The first photo is written straight into index.html so it loads first.
   These extra photos are downloaded only after the page has finished
   loading, then join the cross-fade one by one.
   -------------------------------------------------------------------------- */
const HERO_SLIDES = [
    "assets/images/Unique_13.jpg",
    "assets/images/team_1.jpg",
    "assets/images/team_2.jpg"
];

/* --------------------------------------------------------------------------
   2. NEWS & ANNOUNCEMENTS
   news.html shows them all; the home page shows the 3 newest. While this
   list is empty, both pages show "No news yet".

   Example (copy into the list and fill in):
   {
       date: "2024-09-19",                  // year-month-day it was published
       time: "14:30",                       // optional, 24-hour time it was published
       title: "Headline of the story",
       summary: "One or two sentences about what happened.",
       category: "News",                    // "News" or "Announcement"
       image: "assets/images/Unique_10.jpg", // optional; without it the card shows the club crest
       imageAlt: "What the photo shows",    // needed if there is an image
       author: "Full Name",                 // optional, who posted it (their initials show in a circle)
       authorPhoto: "",                     // optional, a small square photo of them instead of initials
       link: ""                             // optional: paste the Facebook post's address here and
                                            // clicking the card opens it on Facebook
   },
   To get a Facebook post's address: on Facebook, click the post's date
   (just under the page name) and copy the address from the address bar.
   -------------------------------------------------------------------------- */
const NEWS = [];


/* --------------------------------------------------------------------------
   3. FIXTURES (upcoming matches)
   The soonest one becomes the big NEXT MATCH card with a countdown; the
   rest are listed under it. A match drops off this list by itself two
   hours after kick-off, so old fixtures never show as "next".

   Example:
   {
       date: "2024-09-19",                  // year-month-day
       time: "14:30",                       // 24-hour Ghana time
       home: "Topsky FC Academy",           // the home team
       away: "Royal Unique FC",             // the away team
       venue: "Opeikuma Topsky School Park",
       competition: "Pre-season friendly"
   },
   -------------------------------------------------------------------------- */
const FIXTURES = [];


/* --------------------------------------------------------------------------
   4. RESULTS (matches already played)
   Newest first on the page. The W / D / L badge is worked out from the
   score, using CLUB_NAMES to know which side is ours.

   Example:
   {
       date: "2024-10-05",
       home: "Royal Unique FC",
       away: "Example FC",                  // made-up example, not a real match
       homeScore: 2,                        // numbers, no quotes
       awayScore: 1,
       competition: "League"
   },
   -------------------------------------------------------------------------- */
const RESULTS = [];

// The names our club may be written as in FIXTURES and RESULTS
// (capital letters don't matter). Our side gets the club crest, the
// other side a plain shield.
// The old names are kept so matches typed before the rename still match.
const CLUB_NAMES = ["Royal Unique FC", "Unique Soccer Academy", "USA"];


/* --------------------------------------------------------------------------
   5. GALLERY PHOTOS (gallery.html)
   The grid and the lightbox show the photos in this order.
   - alt:      what the photo shows (read out by screen readers, and used
               as the caption in the lightbox)
   - category: a short label shown as a badge in the lightbox
   - width / height: the photo's real size in pixels. The browser uses
               them to save the right amount of space before the photo
               has downloaded, so the grid doesn't jump around.
   New photo? Its .webp and -thumb.webp copies are made for you by
   GitHub when you push (see "Optimising images" in README.md).
   -------------------------------------------------------------------------- */
const PHOTOS = [
    { src: "assets/images/team_2.jpg",           width: 1280, height: 958,  category: "Team",     alt: "Players in the black Royal Unique FC training kit lined up on the artificial pitch, hands on hips" },
    { src: "assets/images/team_1.jpg",           width: 1280, height: 720,  category: "Team",     alt: "Three players in the black Royal Unique FC training shirts standing on the artificial pitch" },
    { src: "assets/images/team_3.jpg",           width: 1280, height: 720,  category: "Team",     alt: "Three players in black training shirts standing together on the pitch" },
    { src: "assets/images/team_4.jpg",           width: 958,  height: 1280, category: "Training", alt: "Players in the black training kit running a ball drill between cones on the artificial pitch" },
    { src: "assets/images/kimmich_2.jpg",        width: 958,  height: 1280, category: "Training", alt: "Player in the number 19 shirt dribbling between cones while the goalkeeper and a teammate watch" },
    { src: "assets/images/Rahman_1 copy.jpg",    width: 958,  height: 1280, category: "Training", alt: "Player in black dribbling towards the goalkeeper in a green kit on the artificial pitch" },
    { src: "assets/images/Kwaku_8.jpg",          width: 958,  height: 1280, category: "Training", alt: "Player in black dribbling a red ball past yellow cones on the artificial pitch" },
    { src: "assets/images/Dembele_3.jpg",        width: 958,  height: 1280, category: "Training", alt: "Player in black chasing a red ball on the artificial pitch as a teammate watches" },
    { src: "assets/images/courtois_2.jpg",       width: 958,  height: 1280, category: "Training", alt: "Player in black striking a red ball on the artificial pitch" },
    { src: "assets/images/courtois_3.jpg",       width: 958,  height: 1280, category: "Training", alt: "Player in black passing a red ball during a cone drill, with teammates behind" },
    { src: "assets/images/unique_2 copy.jpg",    width: 1280, height: 958,  category: "Training", alt: "Wide view of players training across the artificial pitch" },
    { src: "assets/images/unique_training.jpg",  width: 2048, height: 1536, category: "Training", alt: "Wide view of a training session on the grass field, with players spread across the pitch" },
    { src: "assets/images/tictac.jpg",           width: 1536, height: 2048, category: "Training", alt: "Players in a line running a ball drill between yellow cones under a cloudy sky" },
    { src: "assets/images/warm.jpg",             width: 1536, height: 2048, category: "Training", alt: "Players warming up across a grass pitch under a cloudy sky" },
    { src: "assets/images/mbappe.jpg",           width: 1536, height: 2048, category: "Players",  alt: "Player in the number 10 shirt controlling the ball beside a cone on a grass pitch" },
    { src: "assets/images/Enock.jpeg",           width: 960,  height: 1280, category: "Players",  alt: "Player in the black number 9 shirt, seen from behind, waiting for the ball on a grass pitch" },
    { src: "assets/images/kwabena.jpg",          width: 1536, height: 2048, category: "Players",  alt: "Player in the number 9 shirt, seen from behind, during a passing drill on grass" },
    { src: "assets/images/court.jpg",            width: 1536, height: 2048, category: "Players",  alt: "Player in the black number 90 shirt dribbling a yellow ball past a cone on a grass pitch" },
    { src: "assets/images/demb.jpg",             width: 1536, height: 2048, category: "Players",  alt: "Player in a black training shirt running with a yellow ball on a grass pitch" },
    { src: "assets/images/kimm.jpg",             width: 1536, height: 2048, category: "Players",  alt: "Player in black running with the ball across a wide grass training field" },
    { src: "assets/images/Unique_1.jpg",  width: 960,  height: 1280, category: "Players",  alt: "Player in the yellow kit holding a pair of boots on a grassy pitch under a cloudy sky" },
    { src: "assets/images/Unique_2.jpg",  width: 958,  height: 962,  category: "Players",  alt: "Two players in yellow kits standing side by side on the pitch" },
    { src: "assets/images/Unique_3.jpg",  width: 960,  height: 1280, category: "Training", alt: "Player in the yellow kit stretching before training" },
    { src: "assets/images/Unique_4.jpg",  width: 810,  height: 1080, category: "Training", alt: "Two players, one in goalkeeper gloves and a training bib, posing on the pitch" },
    { src: "assets/images/Unique_5.jpg",  width: 960,  height: 1280, category: "Players",  alt: "Player in the yellow kit and red boots on the training ground" },
    { src: "assets/images/Unique_8.jpg",  width: 810,  height: 1080, category: "Training", alt: "Player controlling the ball on the grass" },
    { src: "assets/images/Unique_7.jpg",  width: 958,  height: 1280, category: "Training", alt: "Player in the yellow kit standing over a ball, with a goalpost behind" },
    { src: "assets/images/Unique_10.jpg", width: 940,  height: 788,  category: "Matchday", alt: "Pre-season friendly poster: Topsky FC Academy vs Unique Soccer Academy, 19 September 2024, 2:30pm, Opeikuma Topsky School Park" },
    { src: "assets/images/Unique_11.jpg", width: 720,  height: 960,  category: "Players",  alt: "Player in the yellow kit with a hand on the hip under a bright blue sky" },
    { src: "assets/images/Unique_13.jpg", width: 1125, height: 1138, category: "Training", alt: "Two players in black training vests giving a thumbs-up on the training ground" },
    { src: "assets/images/Unique_14.jpg", width: 720,  height: 960,  category: "Players",  alt: "Player in a yellow, green and black shirt giving a thumbs-up on a grass pitch" },
    { src: "assets/images/Unique_16.jpg", width: 720,  height: 960,  category: "Players",  alt: "Player in the yellow kit giving two thumbs-up under a cloudy sky" },
    { src: "assets/images/Unique_17.jpg", width: 1080, height: 741,  category: "Kit",      alt: "Front and back of the black club shirt, number 31" }
];

/* --------------------------------------------------------------------------
   6. GALLERY VIDEOS (gallery.html)
   - poster: a still image shown on the card before the video plays.
             While it is "", the card shows the video's own first frame
             instead. To make real posters, see "Video posters" in README.md.
   -------------------------------------------------------------------------- */
const VIDEOS = [
    // TODO: add real titles for the three videos
    { src: "assets/videos/Unique_vids_1.mp4", title: "Academy video 1", poster: "" },
    { src: "assets/videos/Unique_vids_2.mp4", title: "Academy video 2", poster: "" },
    { src: "assets/videos/Unique_vids_3.mp4", title: "Academy video 3", poster: "" }
];

/* --------------------------------------------------------------------------
   7. PLAYERS (team.html)
   The squad is sorted for you: goalkeepers, defenders, midfielders, then
   forwards, and by shirt number inside each group. While this list is
   empty, the page shows "Squad coming soon".

   The 20 slots below are blank placeholders: each shows a silhouette and
   "Name coming soon". Fill in one slot per player (name, number,
   position, photo, age). Delete any slot you don't need.

   Example (copy into the list and fill in):
   {
       name: "Full Name",
       number: 10,                          // shirt number, no quotes
       position: "Midfielder",              // exactly one of: "Goalkeeper", "Defender",
                                            // "Midfielder", "Forward" (the filter buttons use these)
       photo: "assets/images/player-10.jpg", // optional; a portrait (taller than wide) looks best.
                                            // Without it the card shows a silhouette.
       age: 17                              // optional, a number, no quotes
   },
   TODO: fill in the 20 player slots
   -------------------------------------------------------------------------- */
const PLAYERS = [
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
    { name: "", number: "", position: "", photo: "", age: "" },
];


/* --------------------------------------------------------------------------
   8. COACHES & STAFF (team.html)
   Shown in this order, under the "Coaches" filter button.

   Example:
   {
       name: "Full Name",
       role: "Head Coach",                  // shown in the gold badge
       photo: "",                           // optional, like the players' photos
       whatsapp: ""                         // optional, a https://wa.me/233... link
   },
   TODO: add the real coaches and staff
   -------------------------------------------------------------------------- */
const STAFF = [
    { name: "Mr. Nii Perrygrino Otoo", role: "Founder", photo: "", whatsapp: "https://wa.me/233577789073" }
];

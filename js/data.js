/* ==========================================================================
   data.js
   Editable content for the site. Change things here, not in the HTML.
   1. Hero slideshow photos   2. News
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. HERO SLIDESHOW (home page)
   The first photo is written straight into index.html so it loads first.
   These extra photos are downloaded only after the page has finished
   loading, then join the cross-fade one by one.
   TODO: swap in Isaac's chosen landscape hero photos when they are ready.
   -------------------------------------------------------------------------- */
const HERO_SLIDES = [
    "assets/images/Unique_13.jpg",
    "assets/images/Unique_6.jpg",
    "assets/images/Unique_2.jpg"
];

/* --------------------------------------------------------------------------
   2. NEWS
   The home page shows the 3 newest items (sorted by date, newest first).
   While this list is empty, the home page shows "No news yet. Stay tuned!".

   To add a story, copy this example into the list and fill it in:
   {
       title: "Headline of the story",
       date: "2024-09-19",                 // year-month-day
       summary: "One or two sentences about what happened.",
       image: "assets/images/Unique_9.jpg", // optional
       imageAlt: "What the photo shows",    // needed if there is an image
       link: "news1.html"                   // optional, page with the full story
   },
   -------------------------------------------------------------------------- */
const NEWS = [];

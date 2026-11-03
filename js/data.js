/* ==========================================================================
   data.js
   Editable content for the site. Change things here, not in the HTML.
   1. Hero slideshow photos   2. News   3. Gallery photos   4. Gallery videos
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


/* --------------------------------------------------------------------------
   3. GALLERY PHOTOS (gallery.html)
   The grid and the lightbox show the photos in this order.
   - alt:      what the photo shows (read out by screen readers, and used
               as the caption in the lightbox)
   - category: a short label shown as a badge in the lightbox
   - width / height: the photo's real size in pixels. The browser uses
               them to save the right amount of space before the photo
               has downloaded, so the grid doesn't jump around.
   -------------------------------------------------------------------------- */
const PHOTOS = [
    { src: "assets/images/Unique_1.jpg",  width: 960,  height: 1280, category: "Players",  alt: "Player in the yellow kit holding a pair of boots on a grassy pitch under a cloudy sky" },
    { src: "assets/images/Unique_2.jpg",  width: 958,  height: 962,  category: "Players",  alt: "Two players in yellow kits standing side by side on the pitch" },
    { src: "assets/images/Unique_3.jpg",  width: 960,  height: 1280, category: "Training", alt: "Player in the yellow kit stretching before training" },
    { src: "assets/images/Unique_4.jpg",  width: 810,  height: 1080, category: "Training", alt: "Two players, one in goalkeeper gloves and a training bib, posing on the pitch" },
    { src: "assets/images/Unique_5.jpg",  width: 960,  height: 1280, category: "Players",  alt: "Player in the yellow kit and red boots on the training ground" },
    { src: "assets/images/Unique_8.jpg",  width: 810,  height: 1080, category: "Training", alt: "Player controlling the ball on the grass" },
    { src: "assets/images/Unique_6.jpg",  width: 960,  height: 1280, category: "Players",  alt: "Three academy players in yellow kits smiling on the pitch" },
    { src: "assets/images/Unique_7.jpg",  width: 958,  height: 1280, category: "Training", alt: "Player in the yellow kit standing over a ball, with a goalpost behind" },
    { src: "assets/images/Unique_9.jpg",  width: 1080, height: 1080, category: "Matchday", alt: "Poster for the pre-season match against Topsky FC on Thursday 19 September at 2:30pm, Opeikuma Topsky School Park" },
    { src: "assets/images/Unique_10.jpg", width: 940,  height: 788,  category: "Matchday", alt: "Pre-season friendly poster: Topsky FC Academy vs Unique Soccer Academy, 19 September 2024, 2:30pm, Opeikuma Topsky School Park" },
    { src: "assets/images/Unique_11.jpg", width: 720,  height: 960,  category: "Players",  alt: "Player in the yellow kit with a hand on the hip under a bright blue sky" },
    { src: "assets/images/Unique_12.jpg", width: 720,  height: 960,  category: "Players",  alt: "Smiling player in the yellow kit and turquoise boots on a dry pitch, with a ball nearby" },
    { src: "assets/images/Unique_13.jpg", width: 1125, height: 1138, category: "Training", alt: "Two players in black training vests giving a thumbs-up on the training ground" },
    { src: "assets/images/Unique_14.jpg", width: 720,  height: 960,  category: "Players",  alt: "Player in a yellow, green and black shirt giving a thumbs-up on a grass pitch" },
    { src: "assets/images/Unique_16.jpg", width: 720,  height: 960,  category: "Players",  alt: "Player in the yellow kit giving two thumbs-up under a cloudy sky" },
    { src: "assets/images/Unique_17.jpg", width: 1080, height: 741,  category: "Kit",      alt: "Front and back of the black club shirt, number 31" }
];

/* --------------------------------------------------------------------------
   4. GALLERY VIDEOS (gallery.html)
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

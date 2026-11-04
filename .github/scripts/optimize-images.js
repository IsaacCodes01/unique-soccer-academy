/* ==========================================================================
   optimize-images.js
   Makes the WebP copies of the photos in assets/images (and its folders).
   It is run by GitHub Actions (.github/workflows/optimize-images.yml)
   every time new photos are pushed, so nobody has to do it by hand.

   For each .jpg / .jpeg (a photo):
     Unique_7.jpg -> Unique_7.webp        at most 1600 x 1080, quality 65
                  -> Unique_7-thumb.webp  600px wide, for the photo grids
   For each .png (the hero picture and logos):
     Opas.png     -> Opas.webp            at most 1600px wide, quality 80
   Skipped: the favicons/app icons, share-image.jpg (WhatsApp/Facebook
   want a JPG) and files that are already .webp.

   Which files does it convert?
   - every image that has no .webp copy yet, and
   - every image listed in the CHANGED environment variable (the files
     changed in this push), so a REPLACED photo gets a fresh copy too.
   Images that didn't change are left alone.
   ========================================================================== */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMAGES_DIR = "assets/images";
const SKIP = /^(favicon|android-chrome|apple-touch-icon|share-image)|-thumb\./i;
const PHOTO_LIMIT_KB = 150; // only a warning: the photo is still used

// Every file in a folder and the folders inside it
function allFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? allFiles(full) : [full];
    });
}

// "assets\\images\\a.jpg" (Windows) and "assets/images/a.jpg" become the same
const normal = (file) => file.split(path.sep).join("/");

const changed = new Set((process.env.CHANGED || "").split("\n").map((f) => f.trim()).filter(Boolean));

async function convert(file) {
    const isPhoto = /\.jpe?g$/i.test(file);
    const webp = file.replace(/\.(jpe?g|png)$/i, ".webp");

    if (isPhoto) {
        await sharp(file)
            .rotate() // turns phone photos the right way up (EXIF orientation)
            .resize(1600, 1080, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 65, effort: 6 })
            .toFile(webp);
        await sharp(file)
            .rotate()
            .resize(600, null, { withoutEnlargement: true })
            .webp({ quality: 65, effort: 6 })
            .toFile(file.replace(/\.(jpe?g)$/i, "-thumb.webp"));
    } else {
        await sharp(file)
            .resize(1600, null, { withoutEnlargement: true })
            .webp({ quality: 80, effort: 6 })
            .toFile(webp);
    }

    const kb = Math.round(fs.statSync(webp).size / 1024);
    const warn = isPhoto && kb > PHOTO_LIMIT_KB ? `  (over ${PHOTO_LIMIT_KB}KB: still works, just slower)` : "";
    console.log(`made ${normal(webp)}  ${kb}KB${warn}`);
}

(async () => {
    const todo = allFiles(IMAGES_DIR).filter((file) => {
        if (!/\.(jpe?g|png)$/i.test(file) || SKIP.test(path.basename(file))) return false;
        const webp = file.replace(/\.(jpe?g|png)$/i, ".webp");
        return !fs.existsSync(webp) || changed.has(normal(file));
    });

    if (todo.length === 0) console.log("Nothing to do: every image already has its WebP copy.");
    for (const file of todo) await convert(file);
})().catch((error) => {
    console.error(error);
    process.exit(1); // marks the GitHub Actions run as failed (red cross)
});

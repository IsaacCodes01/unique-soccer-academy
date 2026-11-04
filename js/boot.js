/* ==========================================================================
   boot.js
   The only script loaded in the <head> WITHOUT "defer", so it runs before
   the browser draws anything. It must stay tiny: the page waits for it.
   1. Adds the "js" class to <html>. The CSS only hides things that are
      waiting to animate in (data-reveal) when this class is there, so
      without JavaScript nothing is ever left invisible.
   2. Decides whether to show the preloader (the pulsing crest). Only on
      the first page of a visit, and never with reduced motion.
   3. WebP safety net: if a .webp photo fails to load (the file is
      missing, or a very old browser), shows the original .jpg/.png.

   The whole file is wrapped in (function () { ... })(), a function that
   runs straight away. Its variables stay inside it, so they can't clash
   with names in the other scripts.
   ========================================================================== */
(function () {
    const root = document.documentElement; // the <html> element
    root.classList.add("js");

    // Safety net: if any script crashes (e.g. an old phone that doesn't
    // know some newer JavaScript), take the "js" class off again. Then the
    // CSS stops hiding the data-reveal sections, so the visitor still sees
    // every word and photo, just without the animations.
    window.addEventListener("error", (event) => {
        if (event.target !== window) return;
        root.classList.remove("js");

        // Debug mode: add ?debug to the address (e.g. index.html?debug) and
        // every error is written in a red box at the top of the screen, so
        // it can be read on a phone that has no developer tools.
        if (location.search.indexOf("debug") === -1) return;
        const box = document.createElement("pre");
        box.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:99999;margin:0;padding:8px;" +
            "background:#D62828;color:#fff;font:12px/1.4 monospace;white-space:pre-wrap;";
        const file = (event.filename || "").split("/").pop();
        box.textContent = `${event.message}\n${file} line ${event.lineno}:${event.colno}`;
        (document.body || root).appendChild(box);
    });

    // In debug mode, also say so when there was no error at all
    if (location.search.indexOf("debug") !== -1) {
        window.addEventListener("load", () => {
            if (!root.classList.contains("js")) return; // an error box is already showing
            const box = document.createElement("pre");
            box.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:99999;margin:0;padding:8px;" +
                "background:#0B0B0D;color:#F5C518;font:12px/1.4 monospace;";
            box.textContent = "No errors. Browser: " + navigator.userAgent;
            document.body.appendChild(box);
        });
    }

    // 3. WebP safety net. A <picture> does NOT fall back to its <img> by
    // itself when the .webp is missing: the photo is just broken. So we
    // listen for every image error on the page. "error" events don't
    // bubble up, but the "true" at the end (capture phase) lets the
    // document hear them on the way down. This sits at the top so it is
    // listening before any photo starts loading.
    document.addEventListener("error", (event) => {
        const img = event.target;
        if (img.tagName !== "IMG") return;

        // Inside a <picture>: remove the <source> lines and the browser
        // loads the <img>'s own src (the original) instead
        const sources = img.parentElement.tagName === "PICTURE"
            ? img.parentElement.querySelectorAll("source")
            : [];
        if (sources.length) {
            sources.forEach((source) => source.remove());
        } else if (img.dataset.fallback) {
            // Photos whose src is set from JavaScript (hero slideshow,
            // lightbox) keep their original in data-fallback
            img.src = img.dataset.fallback;
            delete img.dataset.fallback; // only once, so a missing original can't loop
        }
    }, true);

    const MIN_TIME = 400; // ms: long enough to see one pulse
    const MAX_TIME = 800; // ms: never keep anyone waiting longer than this

    // sessionStorage remembers things until the tab is closed, so the
    // preloader shows once per visit, not on every page. It can throw an
    // error (e.g. some private-browsing modes), hence the try/catch.
    let seenThisVisit = false;
    try {
        seenThisVisit = sessionStorage.getItem("usa-preloaded") === "yes";
        sessionStorage.setItem("usa-preloaded", "yes");
    } catch (error) {
        // No storage: just show the preloader, it's short anyway
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seenThisVisit || reducedMotion) return;

    // CSS (section 10) draws the black screen and crest while
    // .is-preloading is on, and fades them out when it comes off
    root.classList.add("has-preloader", "is-preloading");

    const start = Date.now();
    const finish = () => root.classList.remove("is-preloading");

    // Whatever happens, stop at MAX_TIME
    setTimeout(finish, MAX_TIME);

    // "load" = page, images and fonts finished. If that's quick, still
    // wait until MIN_TIME so the crest doesn't just flicker.
    window.addEventListener("load", () => {
        const waited = Date.now() - start;
        setTimeout(finish, Math.max(0, MIN_TIME - waited));
    }, { once: true });
})();

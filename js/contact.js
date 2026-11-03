/* ==========================================================================
   contact.js (contact.html only)
   1. Copy buttons + "Copied!" toast
   2. Join form: check the fields, then open WhatsApp with a ready message
   3. FAQ accordion (one answer open at a time)
   ========================================================================== */

/* ==========================================================================
   1. COPY BUTTONS + TOAST
   Each copy button has data-copy="..." with the text to copy. One click
   listener on the whole page catches clicks on any of them ("event
   delegation"), so we don't need a listener per button.
   ========================================================================== */
const toast = document.getElementById("toast");
let toastTimer = null;

// Shows the toast for 2 seconds. Calling it again restarts the 2 seconds.
// After it fades out (300ms) the text is emptied, so screen readers
// browsing the page later don't find an old "Copied!" lying around.
function showToast(html) {
    toast.innerHTML = html;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("is-visible");
        toastTimer = setTimeout(() => { toast.textContent = ""; }, 300);
    }, 2000);
}

// The modern clipboard API only works on https:// and localhost. On a plain
// http:// address (e.g. testing on a phone over Wi-Fi) we fall back to the
// old way: put the text in a hidden box, select it and "copy".
async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }
    const box = document.createElement("textarea");
    box.value = text;
    box.setAttribute("readonly", "");
    box.style.position = "fixed";
    box.style.opacity = "0";
    document.body.append(box);
    box.select();
    const copied = document.execCommand("copy");
    box.remove();
    if (!copied) throw new Error("Copy failed");
}

document.addEventListener("click", async (event) => {
    const button = event.target.closest(".copy-btn");
    if (!button) return;

    const text = button.dataset.copy;
    try {
        await copyText(text);
        showToast(`<i class="fa-solid fa-check" aria-hidden="true"></i> Copied!<span class="visually-hidden"> ${text}</span>`);

        // Swap the button's icon to a tick for a moment
        button.classList.add("is-copied");
        setTimeout(() => button.classList.remove("is-copied"), 1500);
    } catch {
        showToast(`Couldn't copy. Please copy it by hand: ${text}`);
    }
});

/* ==========================================================================
   2. JOIN FORM
   Each field has a rule. A rule returns "" when the value is fine, or the
   error message to show under the field. Errors appear when the visitor
   leaves a field (blur) or presses Send, and disappear as soon as they
   fix the value. When everything is fine we build the WhatsApp link.
   ========================================================================== */
const joinForm = document.getElementById("join-form");

if (joinForm) {
    const CLUB_WHATSAPP = "233544400543"; // wa.me needs the number with 233 and no leading 0
    const status = document.getElementById("join-status");

    // Ghana numbers: 10 digits starting with 0 (0241234567),
    // or 233 / +233 followed by the last 9 digits
    function isGhanaPhone(value) {
        const digits = value.replace(/[\s-]/g, ""); // ignore spaces and dashes
        return /^(0\d{9}|\+?233\d{9})$/.test(digits);
    }

    const RULES = {
        name(value) {
            if (!value) return "Please enter your full name.";
            if (value.length < 3) return "Please enter your full name (at least 3 letters).";
            return "";
        },
        age(value) {
            if (!value) return "Please enter your age.";
            const age = Number(value);
            if (!Number.isInteger(age)) return "Please enter your age as a whole number, like 16.";
            if (age < 14 || age > 19) return "The academy is for players aged 14 to 19.";
            return "";
        },
        position(value) {
            return value ? "" : "Please choose a position.";
        },
        phone(value) {
            if (!value) return "Please enter your phone number.";
            return isGhanaPhone(value) ? "" : "Please enter a 10-digit number, like 0241234567.";
        },
        guardian(value) {
            if (!value) return "Please enter a parent or guardian's phone number.";
            return isGhanaPhone(value) ? "" : "Please enter a 10-digit number, like 0241234567.";
        }
    };

    // Checks one field, shows or clears its message, and returns true if it's fine.
    // aria-invalid tells screen readers the field has a problem; the message
    // is linked to the field with aria-describedby (in the HTML), so it's
    // read out together with the label.
    function checkField(field) {
        const rule = RULES[field.name];
        if (!rule) return true;

        const message = rule(field.value.trim());
        const errorBox = document.getElementById(`${field.id}-error`);

        errorBox.textContent = message;
        if (message) {
            field.setAttribute("aria-invalid", "true");
        } else {
            field.removeAttribute("aria-invalid");
        }
        return !message;
    }

    const fields = [...joinForm.elements].filter((el) => RULES[el.name]);

    fields.forEach((field) => {
        // Leaving a field that has something in it: check it
        field.addEventListener("blur", () => {
            if (field.value.trim()) checkField(field);
        });
        // Once a field shows an error, re-check on every key so the
        // message goes away the moment the value is fixed
        field.addEventListener(field.tagName === "SELECT" ? "change" : "input", () => {
            if (field.hasAttribute("aria-invalid")) checkField(field);
        });
    });

    // Turns the form into a tidy WhatsApp message. *stars* make text bold
    // in WhatsApp.
    function buildMessage(data) {
        const lines = [
            "Hello Unique Soccer Academy! I would like to join the academy.",
            "",
            `*Name:* ${data.name}`,
            `*Age:* ${data.age}`,
            `*Position:* ${data.position}`,
            `*Phone:* ${data.phone}`,
            `*Parent/guardian's phone:* ${data.guardian}`
        ];
        if (data.message) {
            lines.push("", "*Message:*", data.message);
        }
        return lines.join("\n");
    }

    joinForm.addEventListener("submit", (event) => {
        event.preventDefault(); // stop the browser reloading the page

        // Check every field (map, not every(), so all errors show at once)
        const results = fields.map(checkField);
        const firstBad = fields[results.indexOf(false)];

        if (firstBad) {
            const count = results.filter((ok) => !ok).length;
            status.className = "join-form__status is-error";
            status.textContent = count === 1
                ? "Please fix the highlighted field."
                : `Please fix the ${count} highlighted fields.`;
            firstBad.focus();
            return;
        }

        // FormData reads every field by its name="" into one object
        const data = Object.fromEntries(
            [...new FormData(joinForm)].map(([key, value]) => [key, value.trim()])
        );

        // encodeURIComponent turns spaces, line breaks, *, & and ? into
        // codes like %20 and %0A, so the message can't break the link
        const url = `https://wa.me/${CLUB_WHATSAPP}?text=${encodeURIComponent(buildMessage(data))}`;
        window.open(url, "_blank", "noopener");

        // Pop-up blockers can stop window.open, so offer a normal link too
        status.className = "join-form__status is-success";
        status.innerHTML = `<i class="fa-solid fa-circle-check" aria-hidden="true"></i>
            WhatsApp is opening with your message. Press <strong>Send</strong> there to finish.
            Nothing happened? <a href="${url}" target="_blank" rel="noopener">Open WhatsApp</a>`;
    });
}

/* ==========================================================================
   3. FAQ ACCORDION
   Each question is a <button> with aria-expanded="true/false", which
   screen readers announce as "expanded" or "collapsed". The CSS reads
   the .is-open class to show the answer and fade it in. Opening one
   closes the others, so only one answer shows at a time.
   ========================================================================== */
const faq = document.querySelector(".faq");

if (faq) {
    const faqButtons = [...faq.querySelectorAll(".faq__btn")];

    function setOpen(button, open) {
        button.setAttribute("aria-expanded", String(open));
        button.closest(".faq__item").classList.toggle("is-open", open);
    }

    // The HTML starts with every answer open (for visitors without JS).
    // Fold them all away, then switch on the folding styles.
    faqButtons.forEach((button) => setOpen(button, false));
    faq.classList.add("is-enhanced");

    faq.addEventListener("click", (event) => {
        const button = event.target.closest(".faq__btn");
        if (!button) return;

        const wasOpen = button.getAttribute("aria-expanded") === "true";
        faqButtons.forEach((other) => setOpen(other, false));
        setOpen(button, !wasOpen); // a second click on an open question closes it
    });
}

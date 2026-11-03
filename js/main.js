// Inserts the current year into the footer copyright on every page
const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

//Opens the image in another tab for a better view
function openImage(img){
    window.open(img.src, '_blank');
}
// Opens the video in another tab foe a better view
function openvideo(videoElement) {
    const videoSrc = videoElement.currentSrc || videoElement.src;
    window.open(videoSrc, '_blank');
}

document.querySelector('.dropdown-toggle').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent navigation to #
    this.parentElement.classList.toggle('dropdown-open');
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
        document.querySelector('.dropdown').classList.remove('dropdown-open');
    }
});


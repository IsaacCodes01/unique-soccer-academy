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

// Check if device supports touch
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Add click functionality for mobile devices
if (isTouchDevice()) {
  document.addEventListener('DOMContentLoaded', function() {
    const missionBoxes = document.querySelectorAll('.mission');
    
    missionBoxes.forEach(box => {
      box.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Toggle active class on clicked box
        this.classList.toggle('active');
        
        // Close other box when one is opened 
         missionBoxes.forEach(otherBox => {
           if (otherBox !== this) {
             otherBox.classList.remove('active');
           }
         });
      });
      
      // Close box when clicking outside (optional)
       document.addEventListener('click', function(e) {
        if (!box.contains(e.target)) {
          box.classList.remove('active');
        }
      });
    });
  });
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


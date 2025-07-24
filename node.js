//Opens the image in another tab for a better view
function openImage(img){
    window.open(img.src, '_blank');
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


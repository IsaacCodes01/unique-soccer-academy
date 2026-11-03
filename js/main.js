//Opens the image in another tab for a better view
function openImage(img){
    window.open(img.src, '_blank');
}
// Opens the video in another tab foe a better view
function openvideo(videoElement) {
    const videoSrc = videoElement.currentSrc || videoElement.src;
    window.open(videoSrc, '_blank');
}

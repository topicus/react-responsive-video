export function isFullScreen() {
  return (document.fullScreenElement && document.fullScreenElement !== null)
       || document.mozFullScreen
       || document.webkitIsFullScreen;
}

export function exitFullscreenFunction() {
  return document.exitFullscreen
    || document.msExitFullscreen
    || document.mozCancelFullScreen
    || document.webkitExitFullscreen;
}

export function requestFullScreen(el) {
  return el.requestFullscreen
    || el.webkitRequestFullScreen
    || el.mozRequestFullScreen
    || el.msRequestFullscreen ;
}

export function toggleFullScreen(el) {
  if(isFullScreen()) {
    exitFullscreenFunction().call(document);
  } else {
    if(el) requestFullScreen(el).call(el);
  }
}

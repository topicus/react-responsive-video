let start = 0;
let distance = 0;
let scrubTimer = null;
let skipTimer = null;
let currentTime = 0;
let vid, progressBar, scrubDirection, scrubDivider, tap, scrubTime;
let holding = false;
let scrubbing = false;

function updateTime(value) {
  currentTime += value
  if(currentTime < 0) return 0;
  if(currentTime > vid.duration) return vid.duration;
  return currentTime;
}

function handleStart(e) {
  holding = true;
  start = e.targetTouches[0].pageX;
  distance = 0;
  e.preventDefault();
}

function handleEnd(e) {
  holding = false;
  distance = 0;
  progressBar.className = 'touchscrub-progress-bar-passive';
  scrubTime.className = 'touchscrub-time-passive';
  scrubDirection.style.display = 'none';
  scrubDivider.style.display = 'none';
  scrubDirection.style.left = '50%';
  scrubDirection.style.width = '0%';
  vid.style.opacity = 1;
  vid.currentTime = currentTime;
  clearInterval(scrubTimer);
  clearInterval(skipTimer);
}

function handleMove(e) {
  let x = e.targetTouches[0].pageX;
  distance = ((x - start) * window.devicePixelRatio) / 2;
  scrubbing = holding && Math.abs(distance) > 10;

  if(scrubbing) {
    progressBar.style.display = 'block';
    scrubDirection.style.display = 'block';
    scrubDivider.style.display = 'block';
    scrubTime.className = 'touchscrub-time-active';
    progressBar.className = 'touchscrub-progress-bar-active';
    vid.style.opacity = 0.5;
    currentTime = vid.currentTime ? vid.currentTime : 0;
    skipTimer = setInterval(() => {
      vid.currentTime = currentTime;
    }, 500);

    scrubTimer = setInterval(() => {
      currentTime = updateTime( (distance / vid.duration) / 5 );
      progressBar.style.width = (currentTime / vid.duration) * 100 + '%';
      scrubTime.innerHTML = isNaN(currentTime) ? 0 : currentTime.toFixed(1);
    }, 1);
    holding = false;
  }

  let centerX = (vid.offsetWidth / 2);
  let absDistance = Math.abs(distance);
  scrubDirection.style.width = absDistance + 'px';
  if(distance < 0) {
    scrubDirection.style.left = (centerX - absDistance) + 'px';
  } else {
    scrubDirection.style.left = centerX + 'px';
  }
}

function handleTap(e) {
  if(vid.paused) {
    vid.play();
  } else {
    vid.pause();
  }
}

function handleTimeUpdate(e) {
  if(!scrubbing) {
    scrubTime.innerHTML = vid.currentTime.toFixed(1);
    progressBar.style.width = (vid.currentTime / vid.duration) * 100 + '%';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  vid = document.querySelector('.touchscrub-container video');
  progressBar = document.getElementById('touchscrub-progress-bar');
  scrubDirection = document.querySelector('.touchscrub-scrub-direction');
  scrubDivider = document.querySelector('.touchscrub-scrub-divider');
  scrubTime = document.getElementById('touchscrub-time');
  tap = new Tap(vid);

  // Events
  vid.addEventListener('touchstart', handleStart, false);
  vid.addEventListener('touchend', handleEnd, false);
  vid.addEventListener('touchmove', handleMove, false);
  vid.addEventListener('tap', handleTap, false);
  vid.addEventListener('timeupdate', handleTimeUpdate, false);

});
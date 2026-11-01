(function () {
  'use strict';

  const video = document.getElementById('hero-background-video');

  if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let previousX = null;
  let targetTime = 0;
  let idleTimer = null;
  let duration = 0;

  function resumeDrift() {
    video.playbackRate = 0.25;
    video.play().catch(function () {});
  }

  function initializeVideo() {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    duration = video.duration;
    targetTime = video.currentTime || 0;
    resumeDrift();
  }

  function pauseForScrub(clientX) {
    if (!duration || !Number.isFinite(duration)) return;

    if (previousX === null) {
      targetTime = video.currentTime;
      previousX = clientX;
    } else {
      const delta = clientX - previousX;
      targetTime = Math.max(0, Math.min(duration, targetTime + (delta / window.innerWidth) * duration * 0.8));
      video.currentTime = targetTime;
      previousX = clientX;
    }

    video.pause();
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(function () {
      previousX = null;
      resumeDrift();
    }, 450);
  }

  video.addEventListener('loadedmetadata', initializeVideo);

  if (video.readyState >= 1) initializeVideo();

  video.addEventListener('seeked', function () {
    targetTime = video.currentTime;
  });

  window.addEventListener('pointermove', function (event) {
    if (event.pointerType === 'mouse') pauseForScrub(event.clientX);
  });

  window.addEventListener('touchmove', function (event) {
    if (event.touches.length) pauseForScrub(event.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('pointerleave', function () {
    window.clearTimeout(idleTimer);
    previousX = null;
    idleTimer = window.setTimeout(resumeDrift, 280);
  });
})();
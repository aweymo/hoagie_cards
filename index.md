---
title: "Happy Birthday Hoagie Card"
layout: default
---

# HOAGIE CARD

<div class="text-card">
  <p><strong>Happy Birthday Bella!</strong><br>
  Xani, Please accept this overdue card.<br>
  I was too busy to make you a hoagie card in April.</p>
</div>

<div class="viewer-container">
  <div class="viewer-wrapper">
    <div class="viewer" id="viewer1"></div>
    <button class="fullscreen-btn" onclick="toggleFullscreen('viewer1')">🥪 Fullscreen 🥪</button>
  </div>
  <div class="viewer-wrapper">
    <div class="viewer" id="viewer2"></div>
    <button class="fullscreen-btn" onclick="toggleFullscreen('viewer2')">🥪 Fullscreen 🥪</button>
  </div>
</div>

<script type="module" src="/assets/script.js"></script>
<script>
  function toggleFullscreen(id) {
    const elem = document.getElementById(id);
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  }
</script>

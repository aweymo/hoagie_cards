---
title: "Happy Birthday Hoagie Card"
layout: default
---

# 🥪 Happy Birthday, [Name]!

This 3D card is made entirely from sandwich parts...  
Because you’re the whole meal! 🍅🧀🥬

<div class="viewer-container">
  <div class="viewer-wrapper">
    <div class="viewer" id="viewer1"></div>
    <button class="fullscreen-btn" onclick="toggleFullscreen('viewer1')">🔲 Fullscreen</button>
  </div>
  <div class="viewer-wrapper">
    <div class="viewer" id="viewer2"></div>
    <button class="fullscreen-btn" onclick="toggleFullscreen('viewer2')">🔲 Fullscreen</button>
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

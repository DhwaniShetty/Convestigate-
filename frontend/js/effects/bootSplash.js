/**
 * Boot Splash — plays once on every app launch, before the landing screen.
 * Sequence: black screen -> evidence image fades in -> logo reveal -> fade out.
 * Mirrors the "app-open intro" pattern used by Netflix / Temple Run.
 */
export function playBootSplash(onComplete) {
  const root = document.getElementById('boot-splash-root');
  if (!root) {
    if (onComplete) onComplete();
    return;
  }

  root.innerHTML = `
    <div class="boot-splash" id="boot-splash">
      <div class="boot-splash-bg"></div>
      <div class="boot-splash-vignette"></div>
      <div class="boot-splash-scan"></div>
      <div class="boot-splash-content">
        <span class="boot-splash-tape">CASE FILES // RESTRICTED ACCESS</span>
        <h1 class="boot-splash-logo">
          <span class="boot-word-conv">CONV</span><span class="boot-word-estigate">ESTIGATE</span>
        </h1>
        <div class="boot-splash-tagline">REASON FROM EVIDENCE, NOT SPECULATION</div>
      </div>
      <div class="boot-splash-skip" id="boot-splash-skip">SKIP ▸</div>
    </div>
  `;

  const splash = document.getElementById('boot-splash');
  const skipBtn = document.getElementById('boot-splash-skip');
  let finished = false;
  let autoTimer = null;

  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(autoTimer);
    splash.classList.add('exit');
    setTimeout(() => {
      root.innerHTML = '';
      root.style.background = 'transparent';
      if (onComplete) onComplete();
    }, 650);
  };

  // Stage 1 (0ms): pure black hold, then image fades in
  setTimeout(() => splash.classList.add('stage-image'), 550);
  // Stage 2: logo + tape stamp reveal
  setTimeout(() => splash.classList.add('stage-logo'), 1250);
  // Stage 3: tagline reveal
  setTimeout(() => splash.classList.add('stage-tagline'), 2000);
  // Skip button appears shortly after logo, in case user wants to jump ahead
  setTimeout(() => skipBtn.classList.add('visible'), 1600);

  // Auto-advance into the app after the full sequence has played
  autoTimer = setTimeout(finish, 3600);

  skipBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    finish();
  });
  splash.addEventListener('click', finish);
}

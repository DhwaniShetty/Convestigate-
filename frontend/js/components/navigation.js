import { gameState } from '../state/gameState.js?v=13';
import { sound } from '../effects/soundSystem.js';
import { cinematic } from '../effects/cinematic.js';

export function renderNavigation(container) {
  const state = gameState.getState();
  const currentCase = state.currentCase;
  const remainingSeconds = state.investigationTimer?.deadlineAt
    ? Math.max(0, Math.ceil((state.investigationTimer.deadlineAt - Date.now()) / 1000))
    : 15 * 60;
  const timerText = `${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(remainingSeconds % 60).padStart(2, '0')}`;

  container.innerHTML = `
    <header class="hud-header">
      <div class="hud-brand" id="nav-brand-home">
        <div class="hud-logo">CONV<span>ESTIGATE</span></div>
        <span class="stamp stamp-red">CASE ${currentCase ? currentCase.case_id : '014'}</span>
      </div>

      <div class="hud-case-info">
        <span class="hud-case-tag">${currentCase ? currentCase.title : 'THE MAN WHO MOVED'}</span>
      </div>

      <div style="display: flex; align-items: center; gap: 10px;">
        ${state.investigationTimer?.deadlineAt ? `
          <span class="hud-timer" title="Time remaining to solve this case">⏱ CASE <span id="hud-investigation-timer">${timerText}</span></span>
        ` : ''}
        ${currentCase ? `
          <button class="btn-sound-toggle" id="nav-btn-manga" style="border-color: var(--blood-red-bright); color: var(--blood-red-bright);" title="Replay Manga Story Presentation">
            📖 MANGA STORY
          </button>
        ` : ''}

        <button class="btn-sound-toggle" id="nav-btn-guide" style="border-color: var(--border-medium); color: #ffffff;" title="How to Play / Field Manual">
          📋 QUICK GUIDE
        </button>

        <nav class="hud-nav">
          <button class="nav-link ${state.currentScreen === 'LANDING' ? 'active' : ''}" id="nav-btn-landing">Cases</button>
          <button class="nav-link ${state.currentScreen === 'BRIEFING' ? 'active' : ''}" id="nav-btn-briefing">Briefing</button>
          <button class="nav-link ${['DASHBOARD', 'EVIDENCE', 'BOARD', 'PUZZLES'].includes(state.currentScreen) ? 'active' : ''}" id="nav-btn-investigate">Investigation</button>
          <button class="nav-link ${state.currentScreen === 'FINAL_INVESTIGATION' || state.currentScreen === 'FINAL_ANSWER' ? 'active' : ''}" id="nav-btn-final">Final Verdict</button>
        </nav>
      </div>
    </header>
  `;

  // Event handlers
  const navClick = (action) => {
    sound.playClick();
    action();
  };

  container.querySelector('#nav-brand-home')?.addEventListener('click', () => navClick(() => gameState.setScreen('LANDING')));
  container.querySelector('#nav-btn-landing')?.addEventListener('click', () => navClick(() => gameState.setScreen('LANDING')));
  container.querySelector('#nav-btn-briefing')?.addEventListener('click', () => navClick(() => gameState.setScreen('BRIEFING')));
  container.querySelector('#nav-btn-investigate')?.addEventListener('click', () => navClick(() => gameState.setScreen('DASHBOARD')));
  container.querySelector('#nav-btn-final')?.addEventListener('click', () => navClick(() => gameState.setScreen('FINAL_INVESTIGATION')));

  container.querySelector('#nav-btn-manga')?.addEventListener('click', () => {
    sound.playClick();
    cinematic.openMangaStory(currentCase);
  });

  container.querySelector('#nav-btn-guide')?.addEventListener('click', () => {
    cinematic.openFieldManual();
  });
}


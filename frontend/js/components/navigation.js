import { gameState } from '../state/gameState.js';

export function renderNavigation(container) {
  const state = gameState.getState();
  const currentCase = state.currentCase;

  // Format countdown mm:ss
  const mins = Math.floor(state.ai.countdownSeconds / 60);
  const secs = state.ai.countdownSeconds % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  container.innerHTML = `
    <header class="hud-header">
      <div class="hud-brand" id="nav-brand-home">
        <div class="hud-logo">CONV<span>ESTIGATE</span></div>
        <span class="stamp stamp-red">CASE ${currentCase ? currentCase.case_id : '014'}</span>
      </div>

      <div class="hud-case-info">
        <span class="hud-case-tag">${currentCase ? currentCase.title : 'THE MAN WHO MOVED'}</span>
        ${state.ai.state === 'VANISHED' ? `
          <div class="hud-timer">
            <span>⚠️ COUNTDOWN</span>
            <span id="hud-timer-display">${timeFormatted}</span>
          </div>
        ` : ''}
      </div>

      <nav class="hud-nav">
        <button class="nav-link ${state.currentScreen === 'LANDING' ? 'active' : ''}" id="nav-btn-landing">Cases</button>
        <button class="nav-link ${state.currentScreen === 'BRIEFING' ? 'active' : ''}" id="nav-btn-briefing">Briefing</button>
        <button class="nav-link ${['DASHBOARD', 'EVIDENCE', 'SUSPECTS', 'BOARD', 'PUZZLES'].includes(state.currentScreen) ? 'active' : ''}" id="nav-btn-investigate">Investigation</button>
        <button class="nav-link ${state.currentScreen === 'FINAL_INVESTIGATION' || state.currentScreen === 'FINAL_ANSWER' ? 'active' : ''}" id="nav-btn-final">Final Verdict</button>
      </nav>
    </header>
  `;

  // Event handlers
  container.querySelector('#nav-brand-home')?.addEventListener('click', () => gameState.setScreen('LANDING'));
  container.querySelector('#nav-btn-landing')?.addEventListener('click', () => gameState.setScreen('LANDING'));
  container.querySelector('#nav-btn-briefing')?.addEventListener('click', () => gameState.setScreen('BRIEFING'));
  container.querySelector('#nav-btn-investigate')?.addEventListener('click', () => gameState.setScreen('DASHBOARD'));
  container.querySelector('#nav-btn-final')?.addEventListener('click', () => gameState.setScreen('FINAL_INVESTIGATION'));
}

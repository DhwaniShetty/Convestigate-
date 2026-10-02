import { gameState } from './state/gameState.js?v=13';
import { getCaseById, loadCases } from './data/caseLoader.js?v=8';
import { renderNavigation } from './components/navigation.js?v=3';
import { renderLandingScreen } from './components/landingScreen.js?v=10';
import { renderLobbyScreen } from './components/lobbyScreen.js?v=7';
import { renderCaseBriefing } from './components/caseBriefing.js';
import { renderDashboard } from './components/dashboard.js?v=2';
import { renderFinalInvestigation } from './components/finalInvestigation.js';
import { renderFinalAnswer } from './components/finalAnswer.js';
import { renderResultsScreen } from './components/resultsScreen.js';
import { cinematic } from './effects/cinematic.js';

import { playBootSplash } from './effects/bootSplash.js';

class App {
  constructor() {
    this.navContainer = document.getElementById('hud-nav-root');
    this.screenContainers = {
      LANDING: document.getElementById('screen-landing'),
      LOBBY: document.getElementById('screen-lobby'),
      BRIEFING: document.getElementById('screen-briefing'),
      DASHBOARD: document.getElementById('screen-dashboard'),
      FINAL_INVESTIGATION: document.getElementById('screen-final-investigation'),
      FINAL_ANSWER: document.getElementById('screen-final-answer'),
      RESULTS: document.getElementById('screen-results')
    };

    this.init();
  }

  async init() {
    // Initialize cinematic atmosphere and effects
    cinematic.init();

    // Initial case load based on state (which reads from sessionStorage or defaults to '014')
    const initialCaseId = gameState.getState().currentCaseId || '014';
    const initialCase = getCaseById(initialCaseId);
    gameState.loadCase(initialCase);

    if (gameState.getState().sessionId) await gameState.restoreSavedSession();

    // If there is an active session, ensure we restore the screen
    if (gameState.getState().sessionId) {
      const savedScreen = sessionStorage.getItem('conv_current_screen') || 'LANDING';
      gameState.setScreen(savedScreen);
    } else {
      gameState.setScreen('LANDING');
    }

    // Subscribe to state changes
    gameState.subscribe(state => this.handleStateChange(state));

    // Initial render
    this.render();
    if (gameState.getState().sessionId) gameState.startInvestigationTimer();
  }

  handleStateChange(state) {
    this.render();
  }

  render() {
    const state = gameState.getState();

    // Render Navigation
    if (this.navContainer) {
      renderNavigation(this.navContainer);
    }

    // Toggle active screen visibility
    Object.keys(this.screenContainers).forEach(screenKey => {
      const container = this.screenContainers[screenKey];
      if (container) {
        if (state.currentScreen === screenKey) {
          container.classList.add('active');
          this.renderScreen(screenKey, container);
        } else {
          container.classList.remove('active');
        }
      }
    });
  }

  renderScreen(screenKey, container) {
    switch (screenKey) {
      case 'LANDING':
        renderLandingScreen(container);
        break;
      case 'LOBBY':
        renderLobbyScreen(container);
        break;
      case 'BRIEFING':
        renderCaseBriefing(container);
        break;
      case 'DASHBOARD':
        renderDashboard(container);
        break;
      case 'FINAL_INVESTIGATION':
        renderFinalInvestigation(container);
        break;
      case 'FINAL_ANSWER':
        renderFinalAnswer(container);
        break;
      case 'RESULTS':
        renderResultsScreen(container);
        break;
    }
  }
}

// Bootstrap application on DOM ready
// document.addEventListener('DOMContentLoaded', () => {
//   window.convestigateApp = new App();
// });

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadCases();
  } catch (error) {
    console.warn('Could not sync case catalogue with the API; using bundled cases.', error);
  }
  window.convestigateApp = new App();
  playBootSplash();
});

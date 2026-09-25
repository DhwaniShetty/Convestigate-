import { gameState } from './state/gameState.js';
import { getCaseById } from './data/caseLoader.js';
import { renderNavigation } from './components/navigation.js';
import { renderLandingScreen } from './components/landingScreen.js';
import { renderLobbyScreen } from './components/lobbyScreen.js';
import { renderCaseBriefing } from './components/caseBriefing.js';
import { renderDashboard } from './components/dashboard.js';
import { renderFinalInvestigation } from './components/finalInvestigation.js';
import { renderFinalAnswer } from './components/finalAnswer.js';
import { renderResultsScreen } from './components/resultsScreen.js';

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

  init() {
    // Initial case load (Case 014: The Man Who Moved)
    const initialCase = getCaseById('014');
    gameState.loadCase(initialCase);

    // Subscribe to state changes
    gameState.subscribe(state => this.handleStateChange(state));

    // Initial render
    this.render();
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
document.addEventListener('DOMContentLoaded', () => {
  window.convestigateApp = new App();
});

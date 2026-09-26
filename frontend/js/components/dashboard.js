import { gameState } from '../state/gameState.js';
import { renderEvidenceRoom } from './evidenceRoom.js';
import { renderSuspectDatabase } from './suspectDatabase.js';
import { renderInvestigationBoard } from './investigationBoard.js';
import { renderP01Timeline } from './puzzles/p01Timeline.js';
import { renderP02Employment } from './puzzles/p02Employment.js';
import { renderP03Connection } from './puzzles/p03Connection.js';
import { renderP04Witness } from './puzzles/p04Witness.js';
import { renderP05Missing } from './puzzles/p05Missing.js';
import { renderAIPanel } from './aiPanel.js';
import { renderNotesPanel } from './notesPanel.js';
import { sound } from '../effects/soundSystem.js';

let activeTab = 'overview';
let activeRightTab = 'ai'; // 'ai' or 'notes'

export function renderDashboard(container) {
  const state = gameState.getState();
  const c = state.currentCase;
  const solvedCount = Object.values(state.puzzleProgress).filter(Boolean).length;
  const totalPuzzles = 5;

  container.innerHTML = `
    <div class="dashboard-layout">
      <!-- Left Investigation Navigation Sidebar -->
      <aside class="dash-sidebar">
        <div class="sidebar-heading">CONSOLE DIRECTORY</div>
        <ul class="sidebar-menu">
          <li class="sidebar-item ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
            <span>DASHBOARD OVERVIEW</span>
          </li>
          <li class="sidebar-item ${activeTab === 'evidence' ? 'active' : ''}" data-tab="evidence">
            <span>EVIDENCE REPOSITORY</span>
            <span class="sidebar-badge">${Object.keys(state.evidenceMap).length}</span>
          </li>
          <li class="sidebar-item ${activeTab === 'suspects' ? 'active' : ''}" data-tab="suspects">
            <span>SUSPECT DATABASE</span>
            <span class="sidebar-badge">${state.suspects.length}</span>
          </li>
          <li class="sidebar-item ${activeTab === 'board' ? 'active' : ''}" data-tab="board">
            <span>INVESTIGATION BOARD</span>
            <span class="sidebar-badge highlight">${state.connections.length}</span>
          </li>
        </ul>

        <div class="sidebar-heading" style="margin-top: 16px;">CRITICAL PUZZLES</div>
        <ul class="sidebar-menu">
          <li class="sidebar-item ${activeTab === 'p01' ? 'active' : ''}" data-tab="p01">
            <span>P01 TIMELINE</span>
            <span class="sidebar-badge ${state.puzzleProgress.P01 ? 'highlight' : ''}">${state.puzzleProgress.P01 ? '✓' : '1'}</span>
          </li>
          <li class="sidebar-item ${activeTab === 'p02' ? 'active' : ''}" data-tab="p02">
            <span>P02 EMPLOYMENT</span>
            <span class="sidebar-badge ${state.puzzleProgress.P02 ? 'highlight' : ''}">${state.puzzleProgress.P02 ? '✓' : '2'}</span>
          </li>
          <li class="sidebar-item ${activeTab === 'p03' ? 'active' : ''}" data-tab="p03">
            <span>P03 CONNECTION</span>
            <span class="sidebar-badge ${state.puzzleProgress.P03 ? 'highlight' : ''}">${state.puzzleProgress.P03 ? '✓' : '3'}</span>
          </li>
          <li class="sidebar-item ${activeTab === 'p04' ? 'active' : ''}" data-tab="p04">
            <span>P04 WITNESSES</span>
            <span class="sidebar-badge ${state.puzzleProgress.P04 ? 'highlight' : ''}">${state.puzzleProgress.P04 ? '✓' : '4'}</span>
          </li>
          <li class="sidebar-item ${activeTab === 'p05' ? 'active' : ''}" data-tab="p05">
            <span>P05 MISSING RECORD</span>
            <span class="sidebar-badge ${state.puzzleProgress.P05 ? 'highlight' : ''}">${state.puzzleProgress.P05 ? '✓' : '5'}</span>
          </li>
        </ul>

        <div style="margin-top: auto; padding: 16px;">
          <div style="background: var(--bg-darkest); border: 1px solid var(--border-medium); padding: 12px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.75rem;">
              <span>PROGRESS</span>
              <span style="color: var(--blood-red-bright); font-weight: bold;">${solvedCount}/${totalPuzzles}</span>
            </div>
            <div style="width: 100%; height: 6px; background: #222; margin-top: 6px; border-radius: 1px; overflow: hidden;">
              <div style="width: ${(solvedCount / totalPuzzles) * 100}%; height: 100%; background: var(--blood-red);"></div>
            </div>
          </div>
          <button class="btn btn-primary" id="btn-dash-verdict" style="width: 100%; font-size: 0.8rem;">
            SUBMIT FINAL VERDICT →
          </button>
        </div>
      </aside>

      <!-- Center Dynamic Stage -->
      <main class="dash-center" id="dash-center-stage">
        <!-- Rendered dynamically -->
      </main>

      <!-- Right Panel: AI Advisor / Notes Notebook -->
      <aside class="dash-right-panel">
        <div style="display: flex; border-bottom: 2px solid var(--border-subtle); background: var(--bg-darkest);">
          <button class="nav-link ${activeRightTab === 'ai' ? 'active' : ''}" id="tab-toggle-ai" style="flex: 1; border-radius: 0; padding: 10px;">
            AI ADVISOR
          </button>
          <button class="nav-link ${activeRightTab === 'notes' ? 'active' : ''}" id="tab-toggle-notes" style="flex: 1; border-radius: 0; padding: 10px;">
            NOTES (${state.notes.length})
          </button>
        </div>
        <div id="dash-right-content" style="flex: 1; overflow: hidden;">
          <!-- Rendered dynamically -->
        </div>
      </aside>
    </div>
  `;

  // Attach tab click handlers
  container.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      sound.playClick();
      activeTab = item.getAttribute('data-tab');
      renderDashboard(container);
    });
  });

  // Right panel toggle handlers
  container.querySelector('#tab-toggle-ai')?.addEventListener('click', () => {
    sound.playClick();
    activeRightTab = 'ai';
    renderDashboard(container);
  });
  container.querySelector('#tab-toggle-notes')?.addEventListener('click', () => {
    sound.playClick();
    activeRightTab = 'notes';
    renderDashboard(container);
  });

  // Final verdict button
  container.querySelector('#btn-dash-verdict')?.addEventListener('click', () => {
    sound.playStamp();
    gameState.setScreen('FINAL_INVESTIGATION');
  });

  // Render Right Panel
  const rightContainer = container.querySelector('#dash-right-content');
  if (rightContainer) {
    if (activeRightTab === 'ai') {
      renderAIPanel(rightContainer);
    } else {
      renderNotesPanel(rightContainer);
    }
  }

  // Render Center Stage based on active tab
  const stage = container.querySelector('#dash-center-stage');
  if (stage) {
    switch (activeTab) {
      case 'overview':
        renderOverviewStage(stage, c, solvedCount, totalPuzzles);
        break;
      case 'evidence':
        renderEvidenceRoom(stage);
        break;
      case 'suspects':
        renderSuspectDatabase(stage);
        break;
      case 'board':
        renderInvestigationBoard(stage);
        break;
      case 'p01':
        renderP01Timeline(stage);
        break;
      case 'p02':
        renderP02Employment(stage);
        break;
      case 'p03':
        renderP03Connection(stage);
        break;
      case 'p04':
        renderP04Witness(stage);
        break;
      case 'p05':
        renderP05Missing(stage);
        break;
      default:
        renderOverviewStage(stage, c, solvedCount, totalPuzzles);
    }
  }
}

function renderOverviewStage(container, c, solvedCount, totalPuzzles) {
  const state = gameState.getState();
  container.innerHTML = `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
        <div>
          <span class="stamp stamp-red">COMMAND CONSOLE</span>
          <h1 style="font-family: var(--font-headline); font-size: 2.2rem; letter-spacing: 2px; margin-top: 4px;">
            ${c ? c.title : 'ACTIVE CASE'}
          </h1>
          <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            ${c ? c.synopsis : 'Case overview and evidence docket active.'}
          </p>
        </div>
        <span class="stamp stamp-white">STATUS: ${c ? c.status : 'IN PROGRESS'}</span>
      </div>

      <!-- Quick Action Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <div class="case-card" id="card-jump-evidence" style="cursor: pointer;">
          <span class="stamp stamp-white" style="font-size: 0.65rem;">REPOSITORY</span>
          <h3 style="font-family: var(--font-headline); font-size: 1.2rem; color: #fff;">EVIDENCE DOCKET</h3>
          <p style="font-size: 0.8rem; color: var(--text-secondary);">
            ${Object.values(state.evidenceMap).filter(e => e.status !== 'locked').length} items unlocked. Click to open full evidence files.
          </p>
          <span style="color: var(--blood-red-bright); font-size: 0.75rem; font-weight: bold; margin-top: auto;">OPEN EVIDENCE ROOM →</span>
        </div>

        <div class="case-card" id="card-jump-board" style="cursor: pointer;">
          <span class="stamp stamp-red" style="font-size: 0.65rem;">GRAPH MAP</span>
          <h3 style="font-family: var(--font-headline); font-size: 1.2rem; color: #fff;">INVESTIGATION BOARD</h3>
          <p style="font-size: 0.8rem; color: var(--text-secondary);">
            Interactive pinboard showing confirmed and questioned entity links.
          </p>
          <span style="color: var(--blood-red-bright); font-size: 0.75rem; font-weight: bold; margin-top: auto;">VIEW CORKBOARD →</span>
        </div>

        <div class="case-card" id="card-jump-p01" style="cursor: pointer;">
          <span class="stamp stamp-white" style="font-size: 0.65rem;">NEXT PUZZLE</span>
          <h3 style="font-family: var(--font-headline); font-size: 1.2rem; color: #fff;">P01 TIMELINE</h3>
          <p style="font-size: 0.8rem; color: var(--text-secondary);">
            Sequence departure, movement, and body discovery times.
          </p>
          <span style="color: var(--blood-red-bright); font-size: 0.75rem; font-weight: bold; margin-top: auto;">SOLVE PUZZLE →</span>
        </div>
      </div>

      <!-- Live Timeline Strip -->
      <div class="dossier-card" style="margin-bottom: 24px;">
        <h3 class="dossier-subtitle">INITIAL TIMELINE OVERVIEW</h3>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
          ${(state.timeline || []).map(t => `
            <div style="display: flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 0.85rem; padding: 6px 10px; background: var(--bg-dark); border-left: 2px solid var(--blood-red);">
              <span style="color: var(--blood-red-bright); font-weight: bold; min-width: 60px;">[${t.time}]</span>
              <span style="color: #ffffff;">${t.event}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Quick jumps
  container.querySelector('#card-jump-evidence')?.addEventListener('click', () => {
    activeTab = 'evidence';
    renderDashboard(document.querySelector('#screen-dashboard'));
  });
  container.querySelector('#card-jump-board')?.addEventListener('click', () => {
    activeTab = 'board';
    renderDashboard(document.querySelector('#screen-dashboard'));
  });
  container.querySelector('#card-jump-p01')?.addEventListener('click', () => {
    activeTab = 'p01';
    renderDashboard(document.querySelector('#screen-dashboard'));
  });
}

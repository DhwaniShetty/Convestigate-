import { gameState } from '../../state/gameState.js';
import { setDashboardTab } from '../dashboard.js';
import { sound } from '../../effects/soundSystem.js';
import { submitTimelinePuzzle } from '../../utils/api.js';

let localOrder = null;

let draftVersion = -1;

export function renderP01Timeline(container) {
  const state = gameState.getState();
  if (draftVersion !== gameState.caseVersion) {
    draftVersion = gameState.caseVersion;
    localOrder = null;
  }
  const isCompleted = state.puzzleProgress.P01;

  if (!localOrder) {
    localOrder = [...state.timeline];

    if (!isCompleted && localOrder.length > 2) {
      localOrder = [localOrder[1], localOrder[0], ...localOrder.slice(2)];
    }
  }

  container.innerHTML = `
    <div class="puzzle-box">
      <div class="puzzle-header">
        <div>
          <span class="stamp stamp-red">PUZZLE P01</span>
          <h2 style="font-family: var(--font-headline); font-size: 1.5rem; letter-spacing: 1px; margin-top: 4px;">
            TIMELINE CHRONOLOGY RECONSTRUCTION
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            Order the events in verified chronological progression from earliest to latest.
          </p>
        </div>
        <div>
          ${isCompleted ? '<span class="stamp stamp-white">COMPLETED // VERIFIED</span>' : '<span class="status-pill">PENDING VERIFICATION</span>'}
        </div>
      </div>

      <div class="timeline-sort-list">
        ${localOrder.map((ev, index) => `
          <div class="timeline-drag-item ${isCompleted ? 'correct' : ''}" data-index="${index}">
            <div style="display: flex; align-items: center; gap: 14px;">
              <span class="stamp stamp-white" style="font-size: 0.65rem; transform: none; min-width: 32px; text-align: center;">#${index + 1}</span>
              <div>
                <strong style="color: var(--blood-red-bright); font-family: var(--font-mono); font-size: 0.85rem;">[${ev.time}]</strong>
                <span style="color: #ffffff; font-size: 0.9rem; margin-left: 8px;">${ev.event}</span>
              </div>
            </div>

            ${!isCompleted ? `
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-move-up" data-idx="${index}" style="padding: 4px 8px; font-size: 0.7rem;" ${index === 0 ? 'disabled' : ''}>▲</button>
                <button class="btn btn-move-down" data-idx="${index}" style="padding: 4px 8px; font-size: 0.7rem;" ${index === localOrder.length - 1 ? 'disabled' : ''}>▼</button>
              </div>
            ` : '<span style="color: var(--blood-red-bright); font-weight: bold; font-size: 0.8rem;">CHRONOLOGY LOCKED</span>'}
          </div>
        `).join('')}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 8px; flex-wrap: wrap; gap: 12px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
          UNLOCKS: E01, E02 (LIBRARY RECORD & PARK STATEMENT)
        </span>
        <div style="display: flex; gap: 10px;">
          ${!isCompleted ? `
            <button class="btn btn-primary" id="btn-submit-p01">VERIFY CHRONOLOGY →</button>
          ` : `
            <button class="btn btn-disabled" disabled>PUZZLE SOLVED</button>
          `}
          <button class="btn btn-primary" id="btn-next-p02" style="padding: 10px 20px;">
            NEXT PUZZLE (P02) →
          </button>
        </div>
      </div>
    </div>
  `;

  // Up/down buttons
  container.querySelectorAll('.btn-move-up').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      if (idx > 0) {
        const temp = localOrder[idx];
        localOrder[idx] = localOrder[idx - 1];
        localOrder[idx - 1] = temp;
        renderP01Timeline(container);
      }
    });
  });

  container.querySelectorAll('.btn-move-down').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      if (idx < localOrder.length - 1) {
        const temp = localOrder[idx];
        localOrder[idx] = localOrder[idx + 1];
        localOrder[idx + 1] = temp;
        renderP01Timeline(container);
      }
    });
  });

  container.querySelector('#btn-submit-p01')?.addEventListener('click', async () => {
    const sessionId = gameState.getState().sessionId;

    if (!sessionId) {
      alert('No active backend session found.');
      return;
    }

    const order = localOrder.map(ev => ev.time);

    try {
      const result = await gameState.submitPuzzle('P01', () => submitTimelinePuzzle(sessionId, order));
      if (!result) return;

      console.log('P01 BACKEND RESULT:', result);

      if (result.correct) {

        renderP01Timeline(container);
      } else {
        alert(result.message || 'Incorrect order. Try again.');
      }

    } catch (error) {
      console.error('P01 submission failed:', error);
      alert(`P01 submission failed: ${error.message}`);
    }
  });
  container.querySelector('#btn-next-p02')?.addEventListener('click', () => {
    sound.playStamp();
    setDashboardTab('p02');
  });
}

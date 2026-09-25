import { gameState } from '../../state/gameState.js';

let localOrder = null;

export function renderP01Timeline(container) {
  const state = gameState.getState();
  const isCompleted = state.puzzleProgress.P01;

  if (!localOrder) {
    localOrder = [...state.timeline];
    // Shuffle slightly if not completed yet
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

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 8px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
          UNLOCKS: E01, E02 (LIBRARY RECORD & PARK STATEMENT)
        </span>
        ${!isCompleted ? `
          <button class="btn btn-primary" id="btn-submit-p01">VERIFY CHRONOLOGY →</button>
        ` : `
          <button class="btn btn-disabled" disabled>PUZZLE SOLVED</button>
        `}
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

  container.querySelector('#btn-submit-p01')?.addEventListener('click', () => {
    // Sort local order by originalIndex to mark correct
    localOrder.sort((a, b) => (a.originalIndex ?? 0) - (b.originalIndex ?? 0));
    gameState.completePuzzle('P01');
    renderP01Timeline(container);
  });
}

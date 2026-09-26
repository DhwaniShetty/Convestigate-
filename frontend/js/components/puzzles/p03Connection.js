import { gameState } from '../../state/gameState.js';

export function renderP03Connection(container) {
  const state = gameState.getState();
  const isCompleted = state.puzzleProgress.P03;
  const connections = state.connections || [];

  container.innerHTML = `
    <div class="puzzle-box">
      <div class="puzzle-header">
        <div>
          <span class="stamp stamp-red">PUZZLE P03</span>
          <h2 style="font-family: var(--font-headline); font-size: 1.5rem; letter-spacing: 1px; margin-top: 4px;">
            ENTITY RELATIONSHIP MAPPING
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            Investigate connections between Victim, Suspects, Prior Case Subjects, and Administrative Gaps.
          </p>
        </div>
        <div>
          ${isCompleted ? '<span class="stamp stamp-white">COMPLETED // VERIFIED</span>' : '<span class="status-pill">PENDING VERIFICATION</span>'}
        </div>
      </div>

      <div style="background: var(--bg-dark); border: 1px solid var(--border-subtle); padding: 14px; margin-bottom: 12px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--blood-red-bright); font-weight: bold;">
          DEDUCTIVE PRINCIPLE:
        </span>
        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">
          Do not assume proximity equals causation. Distinguish between verified administrative links and speculative homicide connections.
        </p>
      </div>

      <div class="connection-list">
        ${connections.slice(0, 5).map(conn => `
          <div class="connection-item">
            <div>
              <strong style="color: #ffffff; font-size: 0.9rem;">${conn.connection}</strong>
              <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">${conn.reasoning || 'Audit trail under review.'}</p>
            </div>
            <div>
              <span class="conn-status-tag status-${conn.status}">${conn.status}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 16px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
          UNLOCKS: E05, E06 (CASE ARCHIVE & TRANSFER ORDER)
        </span>
        ${!isCompleted ? `
          <button class="btn btn-primary" id="btn-submit-p03">VALIDATE GRAPH CONNECTIONS →</button>
        ` : `
          <button class="btn btn-disabled" disabled>PUZZLE SOLVED</button>
        `}
      </div>
    </div>
  `;

  container.querySelector('#btn-submit-p03')?.addEventListener('click', () => {
    gameState.completePuzzle('P03');
    renderP03Connection(container);
  });
}

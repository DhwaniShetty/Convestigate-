import { gameState } from '../../state/gameState.js';
import { setDashboardTab } from '../dashboard.js';
import { sound } from '../../effects/soundSystem.js';
import { submitConnectionPuzzle } from '../../utils/api.js';

export function renderP03Connection(container) {
  const state = gameState.getState();
  const isCompleted = state.puzzleProgress.P03;
  const connections = state.connections || [];
  const connectionsData = connections;

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
        ${connections.map((conn, index) => `
          <div class="connection-item">
            <div style="flex: 1;">
              <strong style="color: #ffffff; font-size: 0.9rem;">
                ${conn.connection}
              </strong>

              <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                ${conn.reasoning || 'Audit trail under review.'}
              </p>
            </div>

            ${!isCompleted ? `
              <select
                class="p03-status-select"
                data-connection-index="${index}"
                style="background: var(--bg-dark); color: #ffffff; border: 1px solid var(--border-subtle); padding: 6px; border-radius: 4px;"
              >
                <option value="">SELECT</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="RELEVANT">RELEVANT</option>
                <option value="UNKNOWN">UNKNOWN</option>
                <option value="NOT_ESTABLISHED">NOT ESTABLISHED</option>
              </select>
            ` : `
              <span class="conn-status-tag status-${conn.status}">
                ${conn.status}
              </span>
            `}
          </div>
        `).join('')}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 16px; flex-wrap: wrap; gap: 12px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
          UNLOCKS: E05, E06 (CASE ARCHIVE & TRANSFER ORDER)
        </span>
        <div style="display: flex; gap: 10px;">
          ${!isCompleted ? `
            <button class="btn btn-primary" id="btn-submit-p03">VALIDATE GRAPH CONNECTIONS →</button>
          ` : `
            <button class="btn btn-disabled" disabled>PUZZLE SOLVED</button>
          `}
          <button class="btn btn-primary" id="btn-next-p04" style="padding: 10px 20px;">
            NEXT PUZZLE (P04) →
          </button>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-submit-p03')?.addEventListener('click', async () => {
  const sessionId = gameState.getState().sessionId;

  if (!sessionId) {
    alert('No active backend session found.');
    return;
  }

  const statusSelects = container.querySelectorAll('.p03-status-select');

  const connections = Array.from(statusSelects).map(select => {
    const index = Number(select.dataset.connectionIndex);
    const connection = connectionsData[index];

    return {
      from: connection.from,
      to: connection.to,
      status: select.value
    };
  });

  if (connections.some(connection => !connection.status)) {
    alert('Please classify all six connections before submitting.');
    return;
  }

  try {
    const result = await submitConnectionPuzzle(
      sessionId,
      connections
    );

    console.log('P03 BACKEND RESULT:', result);

    if (result.correct) {
      gameState.completePuzzle('P03');
      renderP03Connection(container);
    } else {
      alert(result.message || 'Incorrect connection analysis. Try again.');
    }

  } catch (error) {
    console.error('P03 submission failed:', error);
    alert(`P03 submission failed: ${error.message}`);
  }
});

  container.querySelector('#btn-next-p04')?.addEventListener('click', () => {
    sound.playStamp();
    setDashboardTab('p04');
  });
}
import { gameState } from '../state/gameState.js';

export function renderLobbyScreen(container) {
  const state = gameState.getState();
  const lobby = state.lobby;

  container.innerHTML = `
    <div style="max-width: 700px; margin: 40px auto; padding: 0 20px;">
      <div class="dossier-card">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-medium); padding-bottom: 16px; margin-bottom: 20px;">
          <div>
            <span class="stamp stamp-red">FIELD OPERATIONS LOBBY</span>
            <h2 style="font-family: var(--font-headline); font-size: 1.8rem; letter-spacing: 2px; margin-top: 6px;">
              INVESTIGATION CODE: <span style="color: var(--blood-red-bright);">${lobby.gameId}</span>
            </h2>
          </div>
          <button class="btn btn-outline-red" id="btn-copy-code" style="font-size: 0.75rem;">
            COPY CODE
          </button>
        </div>

        <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 24px;">
          Synchronizing tactical evidence board across connected detective terminals. When all investigators are ready, initiate field briefing.
        </p>

        <div style="margin-bottom: 24px;">
          <h4 style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px;">
            ASSIGNED INVESTIGATORS (2/4)
          </h4>
          <div class="lobby-roster">
            ${lobby.players.map(p => `
              <div class="lobby-player-row">
                <div class="lobby-player-info">
                  <div class="status-dot active"></div>
                  <strong style="color: #ffffff;">${p.name}</strong>
                  ${p.isHost ? '<span class="stamp stamp-white" style="font-size: 0.6rem; transform: none;">LEAD</span>' : ''}
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="status-pill">${p.status}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
          <button class="btn" id="btn-lobby-back">← RETURN TO CASES</button>
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-outline-red" id="btn-lobby-toggle-ready">TOGGLE READY</button>
            <button class="btn btn-primary" id="btn-lobby-start">BEGIN CASE BRIEFING →</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Listeners
  container.querySelector('#btn-copy-code')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(lobby.gameId);
    const btn = container.querySelector('#btn-copy-code');
    if (btn) btn.textContent = 'COPIED!';
    setTimeout(() => { if (btn) btn.textContent = 'COPY CODE'; }, 1500);
  });

  container.querySelector('#btn-lobby-back')?.addEventListener('click', () => {
    gameState.setScreen('LANDING');
  });

  container.querySelector('#btn-lobby-toggle-ready')?.addEventListener('click', () => {
    const player = lobby.players.find(p => p.isHost);
    if (player) {
      player.status = player.status === 'Ready' ? 'Standing By' : 'Ready';
      renderLobbyScreen(container);
    }
  });

  container.querySelector('#btn-lobby-start')?.addEventListener('click', () => {
    gameState.setScreen('BRIEFING');
  });
}

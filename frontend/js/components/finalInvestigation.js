import { gameState } from '../state/gameState.js';

export function renderFinalInvestigation(container) {
  const state = gameState.getState();
  const c = state.currentCase;
  const puzzleKeys = ['P01', 'P02', 'P03', 'P04', 'P05'];
  const puzzlesSolved = puzzleKeys.map(k => ({ id: k, solved: !!state.puzzleProgress[k] }));
  const allSolved = puzzlesSolved.every(p => p.solved);

  container.innerHTML = `
    <div style="max-width: 900px; margin: 30px auto; padding: 0 20px;">
      <div class="dossier-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--border-medium); padding-bottom: 16px; margin-bottom: 20px;">
          <div>
            <span class="stamp stamp-red">PRE-VERDICT SYNTHESIS</span>
            <h1 style="font-family: var(--font-headline); font-size: 2.2rem; letter-spacing: 2px; margin-top: 4px;">
              FINAL INVESTIGATION AUDIT
            </h1>
            <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
              Verify all evidence chains and complete the pre-verdict checklist before submitting deductive findings.
            </p>
          </div>
          <span class="stamp stamp-white">DOCKET #${c?.case_id || '014'}</span>
        </div>

        <!-- Case Summary Review -->
        <div class="dossier-section">
          <h4 class="dossier-subtitle">CASE SUMMARY & TIMELINE REVIEW</h4>
          <p style="font-size: 0.9rem; color: #ffffff; line-height: 1.5;">
            ${c?.synopsis}
          </p>
        </div>

        <!-- Checklist -->
        <div class="dossier-section">
          <h4 class="dossier-subtitle">INVESTIGATION READINESS CHECKLIST</h4>
          <div class="checklist-group">
            ${puzzlesSolved.map(p => `
              <div class="checklist-item ${p.solved ? 'complete' : ''}">
                <span class="checklist-check">${p.solved ? '✓' : '✗'}</span>
                <div>
                  <strong style="color: #ffffff; font-size: 0.9rem;">${p.id} PUZZLE COMPLETION</strong>
                  <p style="font-size: 0.75rem; color: var(--text-secondary);">${p.solved ? 'Evidence audited and unlocked.' : 'Pending investigation analysis.'}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Theory Review -->
        <div class="dossier-section">
          <h4 class="dossier-subtitle">COMPETING HYPOTHESES REVIEW</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${(c?.hypotheses || []).map(h => `
              <div style="background: var(--bg-dark); border: 1px solid var(--border-subtle); padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-family: var(--font-mono); font-size: 0.85rem; color: #ffffff;">${h.statement}</span>
                <span class="status-pill">${h.id}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid var(--border-medium); padding-top: 20px; margin-top: 16px;">
          <button class="btn" id="btn-final-back">← RETURN TO DASHBOARD</button>
          <button class="btn btn-primary" id="btn-proceed-answer" style="padding: 12px 24px;">
            PROCEED TO FINAL VERDICT →
          </button>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-final-back')?.addEventListener('click', () => {
    gameState.setScreen('DASHBOARD');
  });

  container.querySelector('#btn-proceed-answer')?.addEventListener('click', () => {
    gameState.setScreen('FINAL_ANSWER');
  });
}

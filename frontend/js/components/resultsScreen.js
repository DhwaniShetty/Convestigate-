import { gameState } from '../state/gameState.js';

export function renderResultsScreen(container) {
  const state = gameState.getState();
  const c = state.currentCase;
  const results = state.results || {
    score: 85,
    feedback: 'Epistemic discipline demonstrated.',
    puzzlesSolved: 5,
    evidenceInvestigated: 8,
    timestamp: new Date().toLocaleString()
  };

  container.innerHTML = `
    <div style="max-width: 850px; margin: 40px auto; padding: 0 20px;">
      <div class="results-banner">
        <span class="stamp stamp-red" style="font-size: 0.9rem; margin-bottom: 8px;">VERDICT EVALUATION COMPLETE</span>
        <h1 style="font-family: var(--font-headline); font-size: 2.8rem; letter-spacing: 3px; color: #ffffff;">
          EPISTEMIC REASONING SCORE: <span style="color: var(--blood-red-bright);">${results.score}/100</span>
        </h1>
        <p style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-secondary); margin-top: 6px;">
          ${results.feedback}
        </p>
      </div>

      <div class="dossier-card">
        <div class="dossier-section">
          <h4 class="dossier-subtitle">CANONICAL CASE OUTCOME & HIDDEN TRUTH</h4>
          <div style="background: var(--bg-dark); border: 1px solid var(--border-medium); padding: 18px; line-height: 1.5;">
            <p style="font-size: 0.95rem; color: #ffffff; margin-bottom: 8px;">
              <strong style="color: var(--blood-red-bright);">CANONICAL FINDING:</strong> Daniel Cross had no personal relationship with Lena Hart. A third party used Daniel's credentials to construct a false trail, exploiting his transfer history and prior case involvement to direct attention away from the real crime.
            </p>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              In Convestigate, strong investigators resist collapsing an incomplete pattern into an unsupported certainty. The direct link between Daniel and Lena remained NOT_ESTABLISHED by the evidence.
            </p>
          </div>
        </div>

        <div class="dossier-section dossier-grid-2">
          <div>
            <h4 class="dossier-subtitle">INVESTIGATION STATISTICS</h4>
            <div style="background: var(--bg-dark); border: 1px solid var(--border-subtle); padding: 14px; font-family: var(--font-mono); font-size: 0.85rem; display: flex; flex-direction: column; gap: 8px;">
              <div>CASE DOCKET: <strong style="color: #fff;">CASE #${c?.case_id || '014'}</strong></div>
              <div>PUZZLES COMPLETED: <strong style="color: var(--blood-red-bright);">${results.puzzlesSolved}/5</strong></div>
              <div>EVIDENCE EXAMINED: <strong style="color: #fff;">${results.evidenceInvestigated} ARTIFACTS</strong></div>
              <div>BIAS RESISTANCE: <strong style="color: var(--blood-red-bright);">OPTIMAL</strong></div>
            </div>
          </div>

          <div>
            <h4 class="dossier-subtitle">EVIDENCE AUDIT CHAIN</h4>
            <div style="background: var(--bg-dark); border: 1px solid var(--border-subtle); padding: 14px; font-family: var(--font-mono); font-size: 0.85rem; display: flex; flex-direction: column; gap: 8px;">
              <div>W02 JOGGER STATEMENT: <span style="color: var(--text-muted);">DISCARDED (ERRONEOUS)</span></div>
              <div>E04 TOWER TELEMETRY: <span style="color: #fff;">CORROBORATED W03</span></div>
              <div>E08 CREDENTIAL ACCESS: <span style="color: var(--blood-red-bright);">SPOOFED IDENTITY</span></div>
              <div>FINAL VERDICT DATE: <span style="color: #fff;">${results.timestamp}</span></div>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid var(--border-medium); padding-top: 20px; margin-top: 16px;">
          <button class="btn" id="btn-restart-case">RESTART THIS CASE</button>
          <button class="btn btn-primary" id="btn-select-next-case" style="padding: 12px 28px;">
            CHOOSE ANOTHER CASE FILE →
          </button>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-restart-case')?.addEventListener('click', () => {
    gameState.loadCase(state.currentCase);
    gameState.setScreen('BRIEFING');
  });

  container.querySelector('#btn-select-next-case')?.addEventListener('click', () => {
    gameState.setScreen('LANDING');
  });
}

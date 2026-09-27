import { gameState } from '../state/gameState.js';

import { escapeHTML } from '../utils/text.js';

export function renderResultsScreen(container) {
  const state = gameState.getState();
  const c = state.currentCase;
  const caseId = String(c?.case_id || '014').padStart(3, '0');
  const caseTitle = c?.title || `Case #${caseId}`;

  const results = state.results;
  if (!results) {
    container.innerHTML = '<div class="dossier-card"><p>No verdict has been submitted yet.</p></div>';
    return;
  }
  const verdict = escapeHTML(results.hypothesisResult.replaceAll('_', ' '));
  const caseFinding = escapeHTML(results.hypothesisStatement);

  container.innerHTML = `
    <div style="max-width: 900px; margin: 30px auto; padding: 0 20px;">
      <div class="results-banner">
        <span class="stamp stamp-red" style="font-size: 0.9rem; margin-bottom: 8px;">VERDICT EVALUATION COMPLETE</span>
        <h1 style="font-family: var(--font-headline); font-size: 2.2rem; letter-spacing: 3px; color: #ffffff; margin-top: 4px; margin-bottom: 18px;">
          HYPOTHESIS EVALUATION
        </h1>

        <!-- CASE VERDICT -->
        <div class="verdict-chart-card">
          <!-- Visual Donut Chart -->
          <div class="verdict-chart-visual">
            <svg class="verdict-donut-svg" viewBox="0 0 240 240" width="220" height="220" role="img" aria-label="${verdict}">
              <circle cx="120" cy="120" r="82" fill="#0d0d14" stroke="#e52525" stroke-width="5" />
              <text x="120" y="112" text-anchor="middle" font-family="monospace" font-size="14" fill="#ffffff">${verdict}</text>
              <text x="120" y="138" text-anchor="middle" font-family="monospace" font-size="10" fill="#a1a1aa">CASE VERDICT</text>
            </svg>
          </div>

          <!-- Beside Chart: Case Metadata & Feedback -->
          <div class="verdict-chart-info">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-medium); padding-bottom: 8px; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
              <div>
                <span class="evidence-badge" style="font-size: 0.75rem;">CASE #${caseId} VERDICT DOCKET</span>
                <h3 style="font-family: var(--font-headline); font-size: 1.3rem; letter-spacing: 1px; color: #ffffff; margin-top: 2px;">
                  ${caseTitle}
                </h3>
              </div>
              <span class="stamp stamp-red" style="font-size: 0.7rem; transform: rotate(-2deg);">
                ${verdict}
              </span>
            </div>

            <!-- Evaluator Feedback -->
            <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); margin-top: 14px; line-height: 1.5; background: rgba(0, 0, 0, 0.4); padding: 10px 14px; border-left: 3px solid var(--blood-red);">
              ${escapeHTML(results.feedback)}
            </p>
          </div>
        </div>
      </div>

      <div class="dossier-card">
        <div class="dossier-section">
          <h4 class="dossier-subtitle">SUBMITTED HYPOTHESIS</h4>
          <div style="background: var(--bg-dark); border: 1px solid var(--border-medium); padding: 18px; line-height: 1.5;">
            <p style="font-size: 0.95rem; color: #ffffff; margin-bottom: 8px;">
              <strong style="color: var(--blood-red-bright);">HYPOTHESIS:</strong> ${caseFinding}
            </p>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              In Convestigate, strong investigators resist collapsing an incomplete pattern into an unsupported certainty. The direct link between suspects and victim must remain strictly validated by physical evidence.
            </p>
          </div>
        </div>

        <div class="dossier-section dossier-grid-2">
          <div>
            <h4 class="dossier-subtitle">INVESTIGATION STATISTICS</h4>
            <div style="background: var(--bg-dark); border: 1px solid var(--border-subtle); padding: 14px; font-family: var(--font-mono); font-size: 0.85rem; display: flex; flex-direction: column; gap: 8px;">
              <div>CASE DOCKET: <strong style="color: #fff;">CASE #${caseId}</strong></div>
              <div>PUZZLES COMPLETED: <strong style="color: var(--blood-red-bright);">${results.puzzlesSolved}/5</strong></div>
              <div>EVIDENCE EXAMINED: <strong style="color: #fff;">${results.evidenceInvestigated} ARTIFACTS</strong></div>
              <div>HYPOTHESIS STATUS: <strong style="color: var(--blood-red-bright);">${verdict}</strong></div>
            </div>
          </div>

          <div>
            <h4 class="dossier-subtitle">EVIDENCE AUDIT CHAIN</h4>
            <div style="background: var(--bg-dark); border: 1px solid var(--border-subtle); padding: 14px; font-family: var(--font-mono); font-size: 0.85rem; display: flex; flex-direction: column; gap: 8px;">
              <div>EVALUATION SOURCE: <span style="color: #fff;">CASE RECORD</span></div>
              <div>VERDICT: <span style="color: var(--blood-red-bright);">${verdict}</span></div>
              <div>CASE: <span style="color: var(--text-muted);">${caseId}</span></div>
              <div>FINAL VERDICT DATE: <span style="color: #fff;">${results.timestamp}</span></div>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid var(--border-medium); padding-top: 20px; margin-top: 16px; flex-wrap: wrap; gap: 12px;">
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


import { gameState } from '../state/gameState.js';

// Case-specific baseline evaluations when viewing results directly
const defaultCaseScores = {
  '001': { score: 85, feedback: 'Rigorous maritime deduction: isolated mechanical sabotage from speculative weather hypotheses.' },
  '002': { score: 90, feedback: 'Optimal forensic vigilance: evidence locker contamination identified without confirmation bias.' },
  '003': { score: 78, feedback: 'Methodical remote wilderness tracking: focused on verifiable vehicle logs despite missing witness data.' },
  '004': { score: 82, feedback: 'Precise architectural scrutiny: ventilation damper override proved access through sealed cleanroom.' },
  '005': { score: 88, feedback: 'Exceptional forensic discipline: uncovered synthetic DNA profile tampering across the custody chain.' },
  '006': { score: 72, feedback: 'Calculated financial audit: distinguished intentional asset dormancy from involuntary disappearance.' },
  '007': { score: 94, feedback: 'Decisive tactical deduction: vehicle trajectory proof refuted the staged drowning narrative.' },
  '008': { score: 68, feedback: 'Careful highway transit correlation: identified timeline discrepancies despite absence of physical traces.' },
  '009': { score: 75, feedback: 'High analytical restraint: separated interstate paranoia from verified physical encounters.' },
  '010': { score: 80, feedback: 'Historical epistemic discipline: debunked sensational mythology using verified archival logs.' },
  '011': { score: 84, feedback: 'Discerning behavioral analysis: identified collective panic manipulation behind the Jazz letters.' },
  '012': { score: 92, feedback: 'Flawless identity forensics: deconstructed the synthetic persona with financial paper trails.' },
  '013': { score: 76, feedback: 'Precise institutional audit: mapped the service weapon loss across conflicting precinct duty rosters.' },
  '014': { score: 85, feedback: 'Epistemic discipline demonstrated: avoided collapsing false correlation into certainty.' }
};

export function renderResultsScreen(container) {
  const state = gameState.getState();
  const c = state.currentCase;
  const caseId = String(c?.case_id || '014').padStart(3, '0');
  const caseTitle = c?.title || `Case #${caseId}`;

  // Read the existing score/result already provided by the application if present
  const caseDefault = defaultCaseScores[caseId] || {
    score: 85,
    feedback: 'Epistemic discipline demonstrated.'
  };

  const results = state.results || {
    score: caseDefault.score,
    feedback: caseDefault.feedback,
    puzzlesSolved: Object.values(state.puzzleProgress || {}).filter(Boolean).length || 5,
    evidenceInvestigated: Object.values(state.evidenceMap || {}).filter(e => e.status === 'investigated').length || 8,
    timestamp: new Date().toLocaleString()
  };

  // Dynamically compute case-specific achieved and remaining scores
  const rawScore = typeof results.score === 'number' ? results.score : parseInt(results.score, 10);
  const achievedScore = isNaN(rawScore) ? caseDefault.score : Math.max(0, Math.min(100, Math.round(rawScore)));
  const remainingScore = 100 - achievedScore;

  // Geometry for SVG Donut / Pie Chart (Radius 82 -> Circumference ~515.22)
  const radius = 82;
  const circumference = 2 * Math.PI * radius; // 515.221
  const achievedArc = ((achievedScore / 100) * circumference).toFixed(2);
  const remainingArc = ((remainingScore / 100) * circumference).toFixed(2);

  // Canonical Case outcome
  const caseFinding = c?.synopsis 
    ? c.synopsis 
    : "Daniel Cross had no personal relationship with Lena Hart. A third party used Daniel's credentials to construct a false trail, exploiting his transfer history and prior case involvement to direct attention away from the real crime.";

  container.innerHTML = `
    <div style="max-width: 900px; margin: 30px auto; padding: 0 20px;">
      <div class="results-banner">
        <span class="stamp stamp-red" style="font-size: 0.9rem; margin-bottom: 8px;">VERDICT EVALUATION COMPLETE</span>
        <h1 style="font-family: var(--font-headline); font-size: 2.2rem; letter-spacing: 3px; color: #ffffff; margin-top: 4px; margin-bottom: 18px;">
          EPISTEMIC REASONING SCORE
        </h1>

        <!-- CASE-WISE VERDICT PIE / DONUT CHART -->
        <div class="verdict-chart-card">
          <!-- Visual Donut Chart -->
          <div class="verdict-chart-visual">
            <svg class="verdict-donut-svg" viewBox="0 0 240 240" width="220" height="220">
              <defs>
                <linearGradient id="verdictAchievedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ff3b3b" />
                  <stop offset="50%" stop-color="#e52525" />
                  <stop offset="100%" stop-color="#991111" />
                </linearGradient>
                <linearGradient id="verdictRemainingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#323344" />
                  <stop offset="100%" stop-color="#181924" />
                </linearGradient>
                <filter id="verdictGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="rgba(229, 37, 37, 0.65)" />
                </filter>
              </defs>

              <!-- Track Ring -->
              <circle cx="120" cy="120" r="82" fill="none" stroke="#0c0d14" stroke-width="26" />

              <!-- Remaining Slice (Gap) -->
              <circle
                class="verdict-donut-remaining"
                cx="120" cy="120" r="82"
                fill="none"
                stroke="url(#verdictRemainingGrad)"
                stroke-width="24"
                stroke-dasharray="${remainingArc} ${circumference}"
                stroke-dashoffset="-${achievedArc}"
                transform="rotate(-90 120 120)"
              />

              <!-- Achieved Slice (Calculated Score) -->
              <circle
                class="verdict-donut-achieved"
                cx="120" cy="120" r="82"
                fill="none"
                stroke="url(#verdictAchievedGrad)"
                stroke-width="24"
                stroke-dasharray="${achievedArc} ${circumference}"
                stroke-dashoffset="0"
                filter="url(#verdictGlow)"
                transform="rotate(-90 120 120)"
              />

              <!-- Inner Donut Center Dial -->
              <circle cx="120" cy="120" r="68" fill="#0d0d14" stroke="#2a2a38" stroke-width="1.5" />

              <!-- Numeric Score Display inside Chart -->
              <text x="120" y="106" text-anchor="middle" font-family="'Impact', 'Arial Black', sans-serif" font-size="38" fill="#ffffff" font-weight="bold">${achievedScore}</text>
              <text x="120" y="126" text-anchor="middle" font-family="'Courier New', monospace" font-size="14" fill="#e52525" font-weight="bold">/ 100 PTS</text>
              <text x="120" y="146" text-anchor="middle" font-family="'Courier New', monospace" font-size="9" fill="#a1a1aa" letter-spacing="1.5">CASE #${caseId}</text>
            </svg>
          </div>

          <!-- Beside Chart: Case Metadata, Numeric Breakdown & Feedback -->
          <div class="verdict-chart-info">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-medium); padding-bottom: 8px; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
              <div>
                <span class="evidence-badge" style="font-size: 0.75rem;">CASE #${caseId} VERDICT DOCKET</span>
                <h3 style="font-family: var(--font-headline); font-size: 1.3rem; letter-spacing: 1px; color: #ffffff; margin-top: 2px;">
                  ${caseTitle}
                </h3>
              </div>
              <span class="stamp stamp-red" style="font-size: 0.7rem; transform: rotate(-2deg);">
                ${achievedScore >= 80 ? 'ACCURACY: OPTIMAL' : achievedScore >= 60 ? 'ACCURACY: COMPETENT' : 'ACCURACY: VULNERABLE'}
              </span>
            </div>

            <!-- Chart Legend Breakdown -->
            <div class="verdict-legend-grid">
              <div class="verdict-legend-item">
                <div class="legend-color-box achieved-box"></div>
                <div class="legend-text">
                  <span class="legend-label">SCORE ACHIEVED</span>
                  <span class="legend-val" style="color: var(--blood-red-bright);">${achievedScore} / 100 (${achievedScore}%)</span>
                </div>
              </div>

              <div class="verdict-legend-item">
                <div class="legend-color-box remaining-box"></div>
                <div class="legend-text">
                  <span class="legend-label">REMAINING GAP</span>
                  <span class="legend-val" style="color: #a1a1aa;">${remainingScore} / 100 (${remainingScore}%)</span>
                </div>
              </div>
            </div>

            <!-- Evaluator Feedback -->
            <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); margin-top: 14px; line-height: 1.5; background: rgba(0, 0, 0, 0.4); padding: 10px 14px; border-left: 3px solid var(--blood-red);">
              ${results.feedback}
            </p>
          </div>
        </div>
      </div>

      <div class="dossier-card">
        <div class="dossier-section">
          <h4 class="dossier-subtitle">CANONICAL CASE OUTCOME & HIDDEN TRUTH</h4>
          <div style="background: var(--bg-dark); border: 1px solid var(--border-medium); padding: 18px; line-height: 1.5;">
            <p style="font-size: 0.95rem; color: #ffffff; margin-bottom: 8px;">
              <strong style="color: var(--blood-red-bright);">CANONICAL FINDING:</strong> ${caseFinding}
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
              <div>VERDICT ACCURACY: <strong style="color: var(--blood-red-bright);">${achievedScore}%</strong></div>
            </div>
          </div>

          <div>
            <h4 class="dossier-subtitle">EVIDENCE AUDIT CHAIN</h4>
            <div style="background: var(--bg-dark); border: 1px solid var(--border-subtle); padding: 14px; font-family: var(--font-mono); font-size: 0.85rem; display: flex; flex-direction: column; gap: 8px;">
              <div>CHAIN VALIDATION: <span style="color: #fff;">VERIFIED AUDIT</span></div>
              <div>DEDUCTIVE SCORE: <span style="color: var(--blood-red-bright);">${achievedScore} / 100</span></div>
              <div>REMAINING RESIDUAL: <span style="color: var(--text-muted);">${remainingScore} / 100</span></div>
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


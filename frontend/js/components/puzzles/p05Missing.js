import { gameState } from '../../state/gameState.js';

let auditActionTaken = false;

export function renderP05Missing(container) {
  const state = gameState.getState();
  const isCompleted = state.puzzleProgress.P05;

  container.innerHTML = `
    <div class="puzzle-box">
      <div class="puzzle-header">
        <div>
          <span class="stamp stamp-red">PUZZLE P05 // CRITICAL TURNING POINT</span>
          <h2 style="font-family: var(--font-headline); font-size: 1.5rem; letter-spacing: 1px; margin-top: 4px;">
            INVESTIGATIVE GAP & MISSING RECORD AUDIT
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            Inspect the erased case assignment log and recover the separate IT security credential audit trail.
          </p>
        </div>
        <div>
          ${isCompleted ? '<span class="stamp stamp-white">COMPLETED // GAP RESOLVED</span>' : '<span class="status-pill">GAP DETECTED</span>'}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <!-- Missing Ledger Docket -->
        <div style="background: var(--bg-dark); border: 1px solid var(--border-medium); padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="stamp stamp-red" style="font-size: 0.65rem;">PRIMARY ARCHIVE</span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--blood-red-bright);">[EXPUNGED]</span>
          </div>
          <h4 style="font-family: var(--font-headline); font-size: 1rem; color: #ffffff;">BENEFITS ASSIGNMENT LEDGER</h4>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 6px; line-height: 1.4;">
            The entry connecting Lena Hart's application to a case worker for the week of her death was manually deleted from the digital archive.
          </p>
          <div style="margin-top: 12px; background: #000; border: 1px dashed var(--blood-red); padding: 10px; font-family: var(--font-mono); font-size: 0.75rem; color: var(--blood-red-bright);">
            ERROR: RECORD 014-LE-92 PURGED // REASON: UNKNOWN USER
          </div>
        </div>

        <!-- Secondary Security Audit -->
        <div style="background: var(--bg-dark); border: 1px solid var(--border-medium); padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="stamp stamp-white" style="font-size: 0.65rem;">INDEPENDENT TRAIL</span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #ffffff;">[UNALTERED]</span>
          </div>
          <h4 style="font-family: var(--font-headline); font-size: 1rem; color: #ffffff;">IT CREDENTIAL LOGIN TELEMETRY</h4>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 6px; line-height: 1.4;">
            Independent network switch logs recorded Lena Hart's application opened under Daniel Cross's credentials at 21:52 on the night of her death.
          </p>
          <div style="margin-top: 12px; background: #000; border: 1px solid #555; padding: 10px; font-family: var(--font-mono); font-size: 0.75rem; color: #ffffff;">
            LOG: USER 'DCROSS' ACCESS 21:52 // IP: 192.168.4.12 (ANNEX TERMINAL)
          </div>
        </div>
      </div>

      <!-- Critical Reveal Box -->
      <div style="background: var(--bg-card); border-left: 4px solid var(--blood-red); padding: 16px; margin-top: 8px;">
        <h4 style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--blood-red-bright); margin-bottom: 4px;">
          DEDUCTIVE GAP RESOLUTION:
        </h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">
          Other evidence (security guard statement W04) places Daniel Cross leaving the main complex before 22:00, making physical login at 21:52 at the annex terminal improbable. This strongly establishes that someone else intentionally utilized Daniel's credentials to fabricate a false breadcrumb trail.
        </p>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 8px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
          UNLOCKS: E07, E08 (REDACTED LEDGER & CREDENTIAL AUDIT)
        </span>
        ${!isCompleted ? `
          <button class="btn btn-primary" id="btn-submit-p05">RESOLVE INVESTIGATIVE GAP →</button>
        ` : `
          <button class="btn btn-disabled" disabled>PUZZLE SOLVED // AI UNSTABLE</button>
        `}
      </div>
    </div>
  `;

  container.querySelector('#btn-submit-p05')?.addEventListener('click', () => {
    gameState.completePuzzle('P05');
    renderP05Missing(container);
  });
}

import { gameState } from '../../state/gameState.js';

let selectedPattern = null;

export function renderP02Employment(container) {
  const state = gameState.getState();
  const isCompleted = state.puzzleProgress.P02;

  container.innerHTML = `
    <div class="puzzle-box">
      <div class="puzzle-header">
        <div>
          <span class="stamp stamp-red">PUZZLE P02</span>
          <h2 style="font-family: var(--font-headline); font-size: 1.5rem; letter-spacing: 1px; margin-top: 4px;">
            EMPLOYMENT & TRANSFER PATTERN AUDIT
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            Audit Daniel Cross's employment history, transfer records, and geographic proximity to Northbridge Park.
          </p>
        </div>
        <div>
          ${isCompleted ? '<span class="stamp stamp-white">COMPLETED // VERIFIED</span>' : '<span class="status-pill">PENDING VERIFICATION</span>'}
        </div>
      </div>

      <!-- Record Excerpt -->
      <div class="evidence-doc-view">
        <div style="font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.5;">
          <p><strong>DOCUMENT:</strong> CIVIL SERVICE PERSONNEL TRANSFER ORDER #4489</p>
          <p><strong>EMPLOYEE:</strong> DANIEL CROSS (BENEFITS ADMINISTRATOR II)</p>
          <p><strong>ORIGIN DEPT:</strong> CENTRAL MUNICIPAL RELIEF BRANCH</p>
          <p><strong>ASSIGNED BRANCH:</strong> NORTHBRIDGE CIVIC ANNEX (0.2 MILES FROM NORTHBRIDGE PARK)</p>
          <p><strong>EFFECTIVE DATE:</strong> 1ST OF CURRENT MONTH</p>
          <p><strong>NOTE:</strong> TRANSFER WAS VOLUNTARY, REQUESTED 60 DAYS PRIOR TO POSITION VACANCY.</p>
        </div>
      </div>

      <!-- Pattern Selection -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;">
        <h4 style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">
          SELECT THE ACCURATE DEDUCTIVE CONCLUSION:
        </h4>

        <label class="checklist-item ${selectedPattern === 'opt1' ? 'complete' : ''}" style="cursor: pointer;">
          <input type="radio" name="p02_choice" value="opt1" ${selectedPattern === 'opt1' ? 'checked' : ''} ${isCompleted ? 'disabled' : ''} />
          <span style="font-size: 0.85rem; color: #ffffff;">The transfer proves Daniel relocated specifically to target Lena Hart.</span>
        </label>

        <label class="checklist-item ${selectedPattern === 'opt2' ? 'complete' : ''}" style="cursor: pointer;">
          <input type="radio" name="p02_choice" value="opt2" ${selectedPattern === 'opt2' || isCompleted ? 'checked' : ''} ${isCompleted ? 'disabled' : ''} />
          <span style="font-size: 0.85rem; color: #ffffff;">The transfer is an administratively confirmed fact; it creates geographical proximity but does NOT establish personal contact with Lena.</span>
        </label>

        <label class="checklist-item ${selectedPattern === 'opt3' ? 'complete' : ''}" style="cursor: pointer;">
          <input type="radio" name="p02_choice" value="opt3" ${selectedPattern === 'opt3' ? 'checked' : ''} ${isCompleted ? 'disabled' : ''} />
          <span style="font-size: 0.85rem; color: #ffffff;">The transfer order was fabricated after Lena's death to provide Daniel an alibi.</span>
        </label>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 12px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
          UNLOCKS: E03 (EMPLOYMENT RECORD)
        </span>
        ${!isCompleted ? `
          <button class="btn btn-primary" id="btn-submit-p02">CONFIRM DEDUCTION →</button>
        ` : `
          <button class="btn btn-disabled" disabled>PUZZLE SOLVED</button>
        `}
      </div>
    </div>
  `;

  // Radio listener
  container.querySelectorAll('input[name="p02_choice"]').forEach(radio => {
    radio.addEventListener('change', () => {
      selectedPattern = radio.value;
    });
  });

  container.querySelector('#btn-submit-p02')?.addEventListener('click', () => {
    gameState.completePuzzle('P02');
    renderP02Employment(container);
  });
}

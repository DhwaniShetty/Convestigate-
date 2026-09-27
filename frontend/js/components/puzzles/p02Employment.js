import { gameState } from '../../state/gameState.js';
import { setDashboardTab } from '../dashboard.js';
import { sound } from '../../effects/soundSystem.js';
import { submitEmploymentPuzzle } from '../../utils/api.js';

let selectedPattern = null;

let draftVersion = -1;

export function renderP02Employment(container) {
  const state = gameState.getState();
  if (draftVersion !== gameState.caseVersion) {
    draftVersion = gameState.caseVersion;
    selectedPattern = null;
  }
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
          <p><strong>DOCUMENT:</strong> ${state.currentCase.evidence.find(e => e.id === 'E03')?.name}</p>
          <p>${state.currentCase.evidence.find(e => e.id === 'E03')?.description}</p>
          <p>${state.currentCase.puzzles.find(p => p.id === 'P02')?.description}</p>
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

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 12px; flex-wrap: wrap; gap: 12px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
          UNLOCKS: E03 (EMPLOYMENT RECORD)
        </span>
        <div style="display: flex; gap: 10px;">
          ${!isCompleted ? `
            <button class="btn btn-primary" id="btn-submit-p02">CONFIRM DEDUCTION →</button>
          ` : `
            <button class="btn btn-disabled" disabled>PUZZLE SOLVED</button>
          `}
          <button class="btn btn-primary" id="btn-next-p03" style="padding: 10px 20px;">
            NEXT PUZZLE (P03) →
          </button>
        </div>
      </div>
    </div>
  `;

  // Radio listener
  container.querySelectorAll('input[name="p02_choice"]').forEach(radio => {
    radio.addEventListener('change', () => {
      selectedPattern = radio.value;
    });
  });

  container.querySelector('#btn-submit-p02')?.addEventListener('click', async () => {
    const sessionId = gameState.getState().sessionId;

    if (!sessionId) {
      alert('No active backend session found.');
      return;
    }

    if (!selectedPattern) {
      alert('Please select an option before submitting.');
      return;
    }

    const employmentVerified = selectedPattern === 'opt2';
    const transferVerified = selectedPattern === 'opt2';

    try {
      const result = await gameState.submitPuzzle('P02', () => submitEmploymentPuzzle(
        sessionId,
        employmentVerified,
        transferVerified
      ));
      if (!result) return;

      console.log('P02 BACKEND RESULT:', result);

      if (result.correct) {

        renderP02Employment(container);
      } else {
        alert(result.message || 'Incorrect deduction. Try again.');
      }

    } catch (error) {
      console.error('P02 submission failed:', error);
      alert(`P02 submission failed: ${error.message}`);
    }
  });
  container.querySelector('#btn-next-p03')?.addEventListener('click', () => {
    sound.playStamp();
    setDashboardTab('p03');
  });
}
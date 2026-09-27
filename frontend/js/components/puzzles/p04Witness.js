import { gameState } from '../../state/gameState.js';
import { submitWitnessPuzzle } from '../../utils/api.js';
import { eventBus, EVENTS } from '../../state/eventBus.js';
import { setDashboardTab } from '../dashboard.js';
import { sound } from '../../effects/soundSystem.js';

let selectedWitnesses = [];

let draftVersion = -1;

export function renderP04Witness(container) {
  const state = gameState.getState();
  if (draftVersion !== gameState.caseVersion) {
    draftVersion = gameState.caseVersion;
    selectedWitnesses = [];
  }
  const isCompleted = state.puzzleProgress.P04;

  const statements = (state.currentCase.puzzles.find(p => p.id === 'P04').witnesses || []).map(w => ({
    id: w.id, witness: w.name, time: w.related_event, text: w.statement
  }));

  container.innerHTML = `
    <div class="puzzle-box">
      <div class="puzzle-header">
        <div>
          <span class="stamp stamp-red">PUZZLE P04</span>
          <h2 style="font-family: var(--font-headline); font-size: 1.5rem; letter-spacing: 1px; margin-top: 4px;">
            CONTRADICTORY WITNESS STATEMENTS
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            Compare statements covering the crucial 20-minute window. Select the TWO conflicting accounts that cannot both be accurate.
          </p>
        </div>
        <div>
          ${isCompleted ? '<span class="stamp stamp-white">COMPLETED // VERIFIED</span>' : '<span class="status-pill">PENDING VERIFICATION</span>'}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
        ${statements.map(stmt => {
          const isSelected = selectedWitnesses.includes(stmt.id) || (isCompleted && ['W02', 'W03'].includes(stmt.id));
          return `
            <div class="statement-card" data-w-id="${stmt.id}" style="background: var(--bg-dark); border: 2px solid ${isSelected ? 'var(--blood-red)' : 'var(--border-subtle)'}; padding: 16px; cursor: pointer; transition: all var(--transition-fast);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span class="stamp stamp-white" style="font-size: 0.65rem; transform: none;">${stmt.id} // ${stmt.witness}</span>
                <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--blood-red-bright); font-weight: bold;">${stmt.time}</span>
              </div>
              <p style="font-family: var(--font-mono); font-size: 0.85rem; color: #ffffff; line-height: 1.4;">"${stmt.text}"</p>
              <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
                <span style="font-size: 0.75rem; font-family: var(--font-mono); color: ${isSelected ? 'var(--blood-red-bright)' : 'var(--text-muted)'};">
                  ${isSelected ? '● MARKED AS CONFLICT' : '○ CLICK TO SELECT'}
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${isCompleted ? `
        <div style="background: var(--bg-card); border-left: 4px solid var(--blood-red); padding: 14px; margin-top: 12px;">
          <h4 style="color: var(--blood-red-bright); font-family: var(--font-mono); font-size: 0.85rem; margin-bottom: 4px;">CONTRADICTION IDENTIFIED:</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">
            The jogger's sighting (W02) at 22:10 inside the park cannot reconcile with Lena's verified phone call to her mother (W03) at 22:15 on the residential road. The jogger's dark, brief sighting was an erroneous misidentification.
          </p>
        </div>
      ` : ''}

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 12px; flex-wrap: wrap; gap: 12px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
          UNLOCKS: E04 (PHONE TOWER LOG)
        </span>
        <div style="display: flex; gap: 10px;">
          ${!isCompleted ? `
            <button class="btn btn-primary" id="btn-submit-p04">CONFIRM CONTRADICTION →</button>
          ` : `
            <button class="btn btn-disabled" disabled>PUZZLE SOLVED</button>
          `}
          <button class="btn btn-primary" id="btn-next-p05" style="padding: 10px 20px;">
            NEXT PUZZLE (P05) →
          </button>
        </div>
      </div>
    </div>
  `;

  // Statement card click
  container.querySelectorAll('.statement-card').forEach(card => {
    card.addEventListener('click', () => {
      if (isCompleted) return;
      const wid = card.getAttribute('data-w-id');
      if (selectedWitnesses.includes(wid)) {
        selectedWitnesses = selectedWitnesses.filter(id => id !== wid);
      } else {
        if (selectedWitnesses.length < 2) {
          selectedWitnesses.push(wid);
        } else {
          selectedWitnesses = [selectedWitnesses[1], wid];
        }
      }
      renderP04Witness(container);
    });
  });

  container.querySelector('#btn-submit-p04')?.addEventListener('click', async () => {
    const sessionId = gameState.getState().sessionId;

    if (!sessionId) {
      alert('No active backend session found.');
      return;
    }

    console.log('P04 SELECTED WITNESSES:', selectedWitnesses);

    if (selectedWitnesses.length !== 2) {
      alert('Please select exactly two witness statements.');
      return;
    }

    if (!selectedWitnesses.includes('W02')) {
      alert('Your selection does not identify the unreliable witness.');
      return;
    }

    const unreliableWitness = selectedWitnesses.find(id => id === 'W02');

    const caseId = gameState.getState().currentCase.case_id;

    try {
      const result = await gameState.submitPuzzle('P04', () => submitWitnessPuzzle(
        sessionId,
        caseId,
        unreliableWitness,
        '',
        ''
      ));
      if (!result) return;

      console.log('P04 BACKEND RESULT:', result);

      if (result.correct) {
        eventBus.emit(EVENTS.CONTRADICTION_FOUND, { selectedWitnesses });


        renderP04Witness(container);
      } else {
        alert(result.message || 'Incorrect witness analysis. Try again.');
      }

    } catch (error) {
      console.error('P04 submission failed:', error);
      alert(`P04 submission failed: ${error.message}`);
    }
  });

  container.querySelector('#btn-next-p05')?.addEventListener('click', () => {
    sound.playStamp();
    setDashboardTab('p05');
  });
}

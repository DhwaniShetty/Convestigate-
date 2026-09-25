import { gameState } from '../../state/gameState.js';
import { eventBus, EVENTS } from '../../state/eventBus.js';

let selectedWitnesses = [];

export function renderP04Witness(container) {
  const state = gameState.getState();
  const isCompleted = state.puzzleProgress.P04;

  const statements = [
    {
      id: 'W01',
      witness: 'Marcus Reed (Friend)',
      time: '21:47 - 21:50',
      text: 'I walked Lena to the library exit and watched her head off alone toward the park side of campus. I didn\'t see anyone with her.'
    },
    {
      id: 'W02',
      witness: 'Anonymous Jogger',
      time: '22:10 (Inside Park)',
      text: 'I saw a young woman matching Lena\'s description walking with an unidentified man on the east path of the park in the dark.'
    },
    {
      id: 'W03',
      witness: 'Elena Hart (Mother)',
      time: '22:15 (Phone Call)',
      text: 'Lena called me at quarter past ten and said she was almost home, just a few minutes away on the residential road. She was alone and sounded completely normal.'
    },
    {
      id: 'W04',
      witness: 'Night Security Guard',
      time: '21:40 - 22:00',
      text: 'I remember Daniel Cross\'s car in the staff lot dropping off paperwork. Nothing unusual, he drove off before ten.'
    }
  ];

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

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 12px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
          UNLOCKS: E04 (PHONE TOWER LOG)
        </span>
        ${!isCompleted ? `
          <button class="btn btn-primary" id="btn-submit-p04">CONFIRM CONTRADICTION →</button>
        ` : `
          <button class="btn btn-disabled" disabled>PUZZLE SOLVED</button>
        `}
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

  container.querySelector('#btn-submit-p04')?.addEventListener('click', () => {
    eventBus.emit(EVENTS.CONTRADICTION_FOUND, { selectedWitnesses });
    gameState.completePuzzle('P04');
    renderP04Witness(container);
  });
}

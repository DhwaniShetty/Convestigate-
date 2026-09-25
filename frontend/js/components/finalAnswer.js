import { gameState } from '../state/gameState.js';

let selectedSuspectId = null;
let selectedHypothesisId = null;
let selectedEvidenceIds = [];

export function renderFinalAnswer(container) {
  const state = gameState.getState();
  const c = state.currentCase;
  const suspects = state.suspects || [];
  const hypotheses = c?.hypotheses || [];
  const unlockedEvidence = Object.values(state.evidenceMap).filter(e => e.status !== 'locked');

  container.innerHTML = `
    <div style="max-width: 900px; margin: 30px auto; padding: 0 20px;">
      <div class="dossier-card">
        <div style="border-bottom: 2px solid var(--border-medium); padding-bottom: 16px; margin-bottom: 20px;">
          <span class="stamp stamp-red">OFFICIAL INDICTMENT</span>
          <h1 style="font-family: var(--font-headline); font-size: 2.2rem; letter-spacing: 2px; margin-top: 4px;">
            FINAL DEDUCTIVE SUBMISSION
          </h1>
          <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            Conclude your investigation. State your findings based on audited facts, not speculative proximity.
          </p>
        </div>

        <!-- 1. Suspect / Responsible Party Selection -->
        <div class="dossier-section">
          <h4 class="dossier-subtitle">1. SELECT PRIMARY RESPONSIBLE ENTITY / FINDING</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px;">
            ${suspects.map(s => `
              <label class="checklist-item ${selectedSuspectId === s.id ? 'complete' : ''}" style="cursor: pointer; ${selectedSuspectId === s.id ? 'border-color: var(--blood-red); background: var(--bg-card-hover);' : ''}">
                <input type="radio" name="final_suspect" value="${s.id}" ${selectedSuspectId === s.id ? 'checked' : ''} />
                <div>
                  <strong style="color: #ffffff; font-size: 0.9rem;">${s.name}</strong>
                  <p style="font-size: 0.75rem; color: var(--text-muted);">${s.occupation}</p>
                </div>
              </label>
            `).join('')}
            <label class="checklist-item ${selectedSuspectId === 'INSUFFICIENT' ? 'complete' : ''}" style="cursor: pointer; ${selectedSuspectId === 'INSUFFICIENT' ? 'border-color: var(--blood-red); background: var(--bg-card-hover);' : ''}">
              <input type="radio" name="final_suspect" value="INSUFFICIENT" ${selectedSuspectId === 'INSUFFICIENT' ? 'checked' : ''} />
              <div>
                <strong style="color: var(--blood-red-bright); font-size: 0.9rem;">INSUFFICIENT EVIDENCE / FRAMED THIRD PARTY</strong>
                <p style="font-size: 0.75rem; color: var(--text-muted);">Physical culprit not established by records</p>
              </div>
            </label>
          </div>
        </div>

        <!-- 2. Theory / Motive Selection -->
        <div class="dossier-section">
          <h4 class="dossier-subtitle">2. SELECT SUPPORTED CAUSAL HYPOTHESIS</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${hypotheses.map(h => `
              <label class="checklist-item ${selectedHypothesisId === h.id ? 'complete' : ''}" style="cursor: pointer; ${selectedHypothesisId === h.id ? 'border-color: var(--blood-red);' : ''}">
                <input type="radio" name="final_hypothesis" value="${h.id}" ${selectedHypothesisId === h.id ? 'checked' : ''} />
                <span style="font-family: var(--font-mono); font-size: 0.85rem; color: #ffffff;">[${h.id}] ${h.statement}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- 3. Key Evidence Selection -->
        <div class="dossier-section">
          <h4 class="dossier-subtitle">3. SELECT CORROBORATING EVIDENCE ARTIFACTS (UP TO 3)</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px;">
            ${unlockedEvidence.map(ev => {
              const isSelected = selectedEvidenceIds.includes(ev.id);
              return `
                <label class="checklist-item ${isSelected ? 'complete' : ''}" style="cursor: pointer; ${isSelected ? 'border-color: var(--blood-red);' : ''}">
                  <input type="checkbox" class="ev-checkbox" value="${ev.id}" ${isSelected ? 'checked' : ''} />
                  <div>
                    <strong style="font-size: 0.85rem; color: #ffffff;">${ev.id} // ${ev.name}</strong>
                    <p style="font-size: 0.7rem; color: var(--text-muted);">${ev.type}</p>
                  </div>
                </label>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 4. Written Explanation -->
        <div class="dossier-section">
          <h4 class="dossier-subtitle">4. DEDUCTIVE EXPLANATION & SUMMARY OF UNRESOLVED FACTS</h4>
          <textarea class="form-input" id="final-reasoning-input" placeholder="Explain your deductive reconstruction, noting why correlation was rejected and which facts remain unproven..." style="width: 100%; height: 90px; resize: none;"></textarea>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid var(--border-medium); padding-top: 20px; margin-top: 16px;">
          <button class="btn" id="btn-answer-back">← BACK TO CHECKLIST</button>
          <button class="btn btn-primary" id="btn-submit-verdict" style="padding: 12px 28px; font-size: 0.95rem;">
            SUBMIT VERDICT FOR EVALUATION →
          </button>
        </div>
      </div>
    </div>
  `;

  // Suspect selection
  container.querySelectorAll('input[name="final_suspect"]').forEach(radio => {
    radio.addEventListener('change', () => {
      selectedSuspectId = radio.value;
      renderFinalAnswer(container);
    });
  });

  // Hypothesis selection
  container.querySelectorAll('input[name="final_hypothesis"]').forEach(radio => {
    radio.addEventListener('change', () => {
      selectedHypothesisId = radio.value;
      renderFinalAnswer(container);
    });
  });

  // Evidence checkbox selection
  container.querySelectorAll('.ev-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const eid = cb.value;
      if (cb.checked) {
        if (!selectedEvidenceIds.includes(eid)) selectedEvidenceIds.push(eid);
      } else {
        selectedEvidenceIds = selectedEvidenceIds.filter(id => id !== eid);
      }
      renderFinalAnswer(container);
    });
  });

  // Back button
  container.querySelector('#btn-answer-back')?.addEventListener('click', () => {
    gameState.setScreen('FINAL_INVESTIGATION');
  });

  // Submit verdict
  container.querySelector('#btn-submit-verdict')?.addEventListener('click', () => {
    const reasoningText = container.querySelector('#final-reasoning-input')?.value || '';
    gameState.submitFinalAnswer({
      suspectId: selectedSuspectId,
      hypothesisId: selectedHypothesisId,
      selectedEvidenceIds,
      reasoningText
    });
  });
}

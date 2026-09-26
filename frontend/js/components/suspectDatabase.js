import { gameState } from '../state/gameState.js';
import { eventBus, EVENTS } from '../state/eventBus.js';
import { sound } from '../effects/soundSystem.js';

let selectedSuspectId = null;
let interrogationMoves = 10;
let suspectStress = 45; // percentage
let suspectTrust = 35; // percentage
let currentStatementIndex = 0;
let isPresentEvidenceOpen = false;
let hintBannerText = 'Examine stated alibi against timestamped records.';

export function renderSuspectDatabase(container) {
  const state = gameState.getState();
  const suspects = state.suspects || [];

  if (!selectedSuspectId && suspects.length > 0) {
    selectedSuspectId = suspects[0].id;
  }

  const selectedSuspect = suspects.find(s => s.id === selectedSuspectId) || suspects[0];
  const unlockedEvidence = Object.values(state.evidenceMap).filter(e => e.status !== 'locked');

  // Statements for interrogation record
  const statementsOnRecord = [
    {
      topic: 'ALIBI',
      quote: selectedSuspect?.alibi || 'I was nowhere near the scene. Check the official logs.',
      contradictedBy: 'E04'
    },
    {
      topic: 'MOVEMENTS',
      quote: 'I left before 22:00 and drove straight home without making any stops.',
      contradictedBy: 'E08'
    }
  ];

  const currentStatement = statementsOnRecord[currentStatementIndex] || statementsOnRecord[0];

  container.innerHTML = `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <span class="stamp stamp-red">INTERROGATION SUITE</span>
          <h2 style="font-family: var(--font-headline); font-size: 1.6rem; letter-spacing: 1px; margin-top: 4px;">
            PERSONS OF INTEREST & CONFRONTATION
          </h2>
        </div>
        <div style="display: flex; gap: 8px;">
          ${suspects.map(s => `
            <button class="btn ${s.id === selectedSuspect?.id ? 'btn-primary' : ''} btn-switch-suspect" data-id="${s.id}" style="font-size: 0.75rem; padding: 6px 12px;">
              ${s.name.toUpperCase()}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Main Interrogation Console (Matching Screenshot 1 & 3) -->
      <div class="interrogation-console" id="interrogation-box">
        <!-- Top HUD Bar: Clock Dial, Gauges -->
        <div class="interrogation-hud-top">
          <div class="confession-moves-box">
            <div class="confession-dial">
              <div class="confession-pointer"></div>
              <span class="confession-dial-text" id="moves-count">${interrogationMoves}</span>
            </div>
            <span class="confession-label">CONFESSION MOVES</span>
          </div>

          <div style="text-align: center;">
            <span class="stamp stamp-white" style="font-size: 0.65rem;">SUSPECT #${selectedSuspect?.id || '01'}</span>
            <div style="font-family: var(--font-headline); font-size: 1.1rem; color: #ffffff; margin-top: 2px;">
              ${selectedSuspect?.name || 'UNKNOWN'}
            </div>
          </div>

          <!-- Polygraph Gauges (Trust & Stress) -->
          <div class="polygraph-container">
            <div class="gauge-col">
              <span class="gauge-label">TRUST</span>
              <div class="gauge-track">
                <div class="gauge-fill" style="height: ${suspectTrust}%; background: #ffffff;"></div>
                <div class="gauge-needle" style="top: ${100 - suspectTrust}%;"></div>
              </div>
            </div>
            <div class="gauge-col">
              <span class="gauge-label">STRESS</span>
              <div class="gauge-track">
                <div class="gauge-fill" style="height: ${suspectStress}%; background: var(--blood-red);"></div>
                <div class="gauge-needle" style="top: ${100 - suspectStress}%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Halftone Portrait Stage -->
        <div class="suspect-portrait-stage">
          <div class="suspect-portrait-art">
            <div style="font-size: 3.5rem;">🕵️</div>
            <span style="font-family: var(--font-headline); font-size: 0.8rem; color: #ffffff; margin-top: 4px; letter-spacing: 1px;">
              ${selectedSuspect?.name}
            </span>
          </div>
          <div class="polygraph-badge">POLYGRAPH 1x</div>
        </div>

        <!-- Hint Guidance Banner -->
        <div class="interrogation-hint-banner" id="interrogation-hint">
          <strong>PROCEDURE:</strong> ${hintBannerText}
        </div>

        <!-- Ruled Lined Notebook Paper (Matching Screenshot 1 & 3) -->
        <div class="interrogation-record-sheet">
          <div class="record-header-tag">INTERROGATION RECORD</div>
          <p class="record-transcript" id="current-statement-text">
            <strong>${selectedSuspect?.name}:</strong> "${currentStatement.quote}"
          </p>
        </div>

        <!-- 3 Bottom Action Cards: PRESS, EMPATHIZE, EVIDENCE -->
        <div class="action-cards-deck">
          <div class="action-card" id="card-press">
            <div class="card-header-press">PRESS</div>
            <div class="card-body-text">turn up the heat</div>
          </div>

          <div class="action-card" id="card-empathize">
            <div class="card-header-empathize">EMPATHIZE</div>
            <div class="card-body-text">open them up</div>
          </div>

          <div class="action-card" id="card-evidence">
            <div class="card-header-evidence">EVIDENCE</div>
            <div class="card-body-text">open the case file</div>
          </div>
        </div>

        <!-- PRESENT EVIDENCE MODAL (Matching Screenshot 1) -->
        <div class="present-evidence-modal ${isPresentEvidenceOpen ? 'open' : ''}" id="present-ev-overlay">
          <div class="present-ev-header">
            <div>
              <div class="present-ev-title">PRESENT EVIDENCE</div>
              <span style="font-family: var(--font-mono); font-size: 0.75rem; color: #555;">
                Pick the item that contradicts a statement on record.
              </span>
            </div>
            <button class="modal-close" id="btn-close-present-ev" style="color: #000; font-size: 1.8rem; font-weight: bold;">&times;</button>
          </div>

          <div class="present-ev-list">
            ${unlockedEvidence.map(ev => `
              <div class="present-ev-item" data-ev-id="${ev.id}">
                <div class="present-ev-icon">📄</div>
                <div>
                  <div class="present-ev-name">${ev.name}</div>
                  <div class="present-ev-desc">${ev.description}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="present-ev-record-footer">
            <div class="on-record-pager">
              <span style="font-family: var(--font-headline); font-size: 0.85rem; letter-spacing: 1px;">
                ON RECORD ${currentStatementIndex + 1}/${statementsOnRecord.length}
              </span>
              <div style="display: flex; gap: 4px;">
                <button class="btn btn-stmt-prev" style="padding: 2px 8px; font-size: 0.7rem;" ${currentStatementIndex === 0 ? 'disabled' : ''}>◀</button>
                <button class="btn btn-stmt-next" style="padding: 2px 8px; font-size: 0.7rem;" ${currentStatementIndex === statementsOnRecord.length - 1 ? 'disabled' : ''}>▶</button>
              </div>
            </div>
            <div class="record-statement-quote">
              [his alibi] "${currentStatement.quote}"
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Suspect switcher buttons
  container.querySelectorAll('.btn-switch-suspect').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      selectedSuspectId = btn.getAttribute('data-id');
      renderSuspectDatabase(container);
    });
  });

  // Action Cards Click Listeners
  container.querySelector('#card-press')?.addEventListener('click', () => {
    sound.playStamp();
    if (interrogationMoves > 0) {
      interrogationMoves -= 1;
      suspectStress = Math.min(100, suspectStress + 18);
      suspectTrust = Math.max(0, suspectTrust - 8);
      hintBannerText = 'Suspect under increased pressure. Stress spiked on polygraph!';
      renderSuspectDatabase(container);
    }
  });

  container.querySelector('#card-empathize')?.addEventListener('click', () => {
    sound.playClick();
    if (interrogationMoves > 0) {
      interrogationMoves -= 1;
      suspectTrust = Math.min(100, suspectTrust + 20);
      suspectStress = Math.max(0, suspectStress - 10);
      hintBannerText = 'Trust built. Suspect defense lowered; cross-examine with evidence now.';
      renderSuspectDatabase(container);
    }
  });

  container.querySelector('#card-evidence')?.addEventListener('click', () => {
    sound.playClick();
    isPresentEvidenceOpen = true;
    renderSuspectDatabase(container);
  });

  // Present Evidence Modal Controls
  container.querySelector('#btn-close-present-ev')?.addEventListener('click', () => {
    sound.playClick();
    isPresentEvidenceOpen = false;
    renderSuspectDatabase(container);
  });

  container.querySelectorAll('.present-ev-item').forEach(item => {
    item.addEventListener('click', () => {
      const evId = item.getAttribute('data-ev-id');
      const ev = state.evidenceMap[evId];
      isPresentEvidenceOpen = false;

      // Check contradiction
      if (currentStatement.contradictedBy === evId || evId === 'E04' || evId === 'E08') {
        sound.playStamp();
        hintBannerText = `CONTRADICTION PROVEN! Presented ${ev.name}. Suspect alibi collapsed!`;
        suspectStress = 95;
        eventBus.emit(EVENTS.CONTRADICTION_FOUND, { suspectId: selectedSuspect.id, evidenceId: evId });
        gameState.addNote(`Contradicted ${selectedSuspect.name} with ${ev.name}: alibi broken.`);
      } else {
        sound.playClick();
        hintBannerText = `Presented ${ev?.name || 'evidence'}. Did not produce an immediate confession. Try another piece.`;
      }
      renderSuspectDatabase(container);
    });
  });

  // Statement Pagination
  container.querySelector('.btn-stmt-prev')?.addEventListener('click', () => {
    if (currentStatementIndex > 0) {
      currentStatementIndex -= 1;
      renderSuspectDatabase(container);
    }
  });

  container.querySelector('.btn-stmt-next')?.addEventListener('click', () => {
    if (currentStatementIndex < statementsOnRecord.length - 1) {
      currentStatementIndex += 1;
      renderSuspectDatabase(container);
    }
  });
}

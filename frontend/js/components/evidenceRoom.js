import { gameState } from '../state/gameState.js';
import { eventBus, EVENTS } from '../state/eventBus.js';
import { sound } from '../effects/soundSystem.js';

let currentFilter = 'ALL';
let activeEvidenceModal = null;

export function renderEvidenceRoom(container) {
  const state = gameState.getState();
  const evidenceList = Object.values(state.evidenceMap);

  const filtered = currentFilter === 'ALL'
    ? evidenceList
    : evidenceList.filter(e => (e.category || '').toUpperCase() === currentFilter);

  container.innerHTML = `
    <div>
      <div class="evidence-toolbar">
        <div>
          <span class="stamp stamp-white">EVIDENCE REPOSITORY</span>
          <h2 style="font-family: var(--font-headline); font-size: 1.6rem; letter-spacing: 1px; margin-top: 4px;">
            SECURED CASE ARTIFACTS
          </h2>
        </div>

        <div class="category-tabs">
          <button class="tab-btn ${currentFilter === 'ALL' ? 'active' : ''}" data-filter="ALL">ALL (${evidenceList.length})</button>
          <button class="tab-btn ${currentFilter === 'DOCUMENTS' ? 'active' : ''}" data-filter="DOCUMENTS">DOCS</button>
          <button class="tab-btn ${currentFilter === 'RECORDS' ? 'active' : ''}" data-filter="RECORDS">RECORDS</button>
          <button class="tab-btn ${currentFilter === 'WITNESS' ? 'active' : ''}" data-filter="WITNESS">WITNESS</button>
          <button class="tab-btn ${currentFilter === 'PHOTOS' ? 'active' : ''}" data-filter="PHOTOS">PHOTOS</button>
        </div>
      </div>

      <div class="evidence-grid">
        ${filtered.map(item => {
          const isLocked = item.status === 'locked';
          const isInvestigated = item.status === 'investigated';

          return `
            <div class="evidence-card ${isLocked ? 'locked' : ''} ${isInvestigated ? 'investigated' : ''}" data-evidence-id="${item.id}">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="evidence-badge">${item.id} // ${item.type || 'DOCUMENT'}</span>
                ${isInvestigated ? '<span class="stamp stamp-red" style="font-size: 0.6rem; transform: none;">INVESTIGATED</span>' : ''}
                ${isLocked ? '<span class="stamp stamp-white" style="font-size: 0.6rem; transform: none;">LOCKED</span>' : ''}
              </div>

              <h4 class="evidence-name">${item.name}</h4>
              <p class="evidence-desc">${isLocked ? 'Item encrypted. Solve associated puzzle to unlock custody chain.' : item.description}</p>
              
              <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 8px;">
                <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">
                  SOURCE: ${isLocked ? 'RESTRICTED' : (item.source || 'Station File')}
                </span>
                ${!isLocked ? '<span style="font-size: 0.75rem; font-weight: bold; color: var(--blood-red-bright);">EXAMINE →</span>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Evidence Detail Modal -->
      <div class="modal-overlay" id="evidence-detail-modal">
        <div class="modal-box" style="max-width: 650px;">
          <div class="modal-header">
            <div>
              <span class="stamp stamp-red" id="modal-ev-tag">EVIDENCE LOG</span>
              <h3 class="modal-title" id="modal-ev-name" style="margin-top: 4px;">DOCUMENT TITLE</h3>
            </div>
            <button class="modal-close" id="modal-ev-close">&times;</button>
          </div>

          <div id="modal-ev-body">
            <!-- Dynamic Content -->
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 20px;">
            <button class="btn" id="modal-ev-dismiss">CLOSE DOCKET</button>
            <button class="btn btn-primary" id="modal-ev-tag-clue">MARK CRITICAL CLUE</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Filter tabs listeners
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.getAttribute('data-filter');
      renderEvidenceRoom(container);
    });
  });

  // Modal setup
  const modal = container.querySelector('#evidence-detail-modal');
  const modalClose = () => {
    sound.playClick();
    modal?.classList.remove('open');
  };
  container.querySelector('#modal-ev-close')?.addEventListener('click', modalClose);
  container.querySelector('#modal-ev-dismiss')?.addEventListener('click', modalClose);

  // Evidence card click
  container.querySelectorAll('.evidence-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('locked')) {
        sound.playClick();
        return;
      }
      sound.playStamp();
      const evId = card.getAttribute('data-evidence-id');
      const item = state.evidenceMap[evId];
      if (!item) return;

      gameState.openEvidence(evId);
      activeEvidenceModal = item;

      // Populate modal
      container.querySelector('#modal-ev-tag').textContent = `${item.id} // ${item.type || 'DOCUMENT'}`;
      container.querySelector('#modal-ev-name').textContent = item.name;
      
      const body = container.querySelector('#modal-ev-body');
      if (body) {
        body.innerHTML = `
          <div class="evidence-doc-view">
            <p style="font-size: 0.95rem; margin-bottom: 14px; color: #000000; font-family: var(--font-mono); line-height: 1.5;">
              ${item.description}
            </p>
            <div style="border-top: 1px dashed #666; padding-top: 10px; font-size: 0.8rem; color: #444; font-family: var(--font-mono);">
              <div style="margin-bottom: 4px;"><strong>CHAIN OF CUSTODY:</strong> ${item.source || 'Evidence Archive'}</div>
              <div style="margin-bottom: 8px;"><strong>RELIABILITY RATING:</strong> ${item.reliability || 'VERIFIED AUDIT'}</div>
              ${item.clue ? `
                <div class="key-clue-badge">
                  <span>KEY DEDUCTIVE VALUE:</span>
                  <span class="clue-highlight-sweep">${item.clue}</span>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }

      modal?.classList.add('open');
    });
  });

  // Mark clue listener
  container.querySelector('#modal-ev-tag-clue')?.addEventListener('click', () => {
    if (activeEvidenceModal) {
      eventBus.emit(EVENTS.CLUE_FOUND, { evidenceId: activeEvidenceModal.id, clue: activeEvidenceModal.clue });
      gameState.addNote(`Investigated ${activeEvidenceModal.id} (${activeEvidenceModal.name}): ${activeEvidenceModal.clue || activeEvidenceModal.description}`);
      modalClose();
      renderEvidenceRoom(container);
    }
  });
}

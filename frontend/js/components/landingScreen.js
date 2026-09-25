import { gameState } from '../state/gameState.js';
import { ALL_CASES, getCaseById } from '../data/caseLoader.js';

let activeCategory = 'ALL';

export function renderLandingScreen(container) {
  const state = gameState.getState();

  const filteredCases = activeCategory === 'ALL'
    ? ALL_CASES
    : activeCategory === 'COLD'
      ? ALL_CASES.filter(c => c.status.includes('COLD') || c.status.includes('ARCHIVAL') || c.status.includes('UNRESOLVED'))
      : ALL_CASES.filter(c => c.status.includes('ACTIVE') || c.status.includes('AUDIT') || c.status.includes('OPEN') || c.status.includes('INQUEST'));

  container.innerHTML = `
    <div class="landing-hero">
      <div class="stamp stamp-red" style="margin-bottom: 12px;">CONVESTIGATE // 14 ARCHIVED DOCKETS</div>
      <h1 class="landing-title">CONV<span>ESTIGATE</span></h1>
      <p class="landing-tagline">SELECT A CASE DOCKET // REASON FROM EVIDENCE, NOT SPECULATION</p>
      
      <div class="landing-actions">
        <button class="btn btn-primary" id="btn-quick-start">
          <span>INVESTIGATE SELECTED CASE</span>
        </button>
        <button class="btn btn-outline-red" id="btn-open-create">
          <span>CREATE CASE ROOM</span>
        </button>
        <button class="btn" id="btn-open-join">
          <span>JOIN ROOM CODE</span>
        </button>
      </div>

      <!-- 14 Cases Filter Toolbar -->
      <div class="case-filter-bar">
        <div>
          <span class="stamp stamp-white">TOTAL CASES AVAILABLE (${ALL_CASES.length})</span>
        </div>
        <div class="category-tabs">
          <button class="tab-btn ${activeCategory === 'ALL' ? 'active' : ''}" data-cat="ALL">ALL 14 CASES</button>
          <button class="tab-btn ${activeCategory === 'ACTIVE' ? 'active' : ''}" data-cat="ACTIVE">ACTIVE FILES</button>
          <button class="tab-btn ${activeCategory === 'COLD' ? 'active' : ''}" data-cat="COLD">COLD & HISTORICAL</button>
        </div>
      </div>

      <!-- 14 Cases Grid -->
      <div class="case-grid-14">
        ${filteredCases.map(c => `
          <div class="case-card ${state.currentCaseId === c.case_id ? 'active-case' : ''}" data-case-id="${c.case_id}">
            ${c.image ? `
              <div class="case-card-thumb">
                <img src="${c.image}" alt="Case ${c.case_id}" class="case-card-img" onerror="this.parentElement.style.display='none'" />
              </div>
            ` : ''}
            <div class="case-card-header">
              <span class="case-number">CASE ${c.case_id}</span>
              <span class="status-pill">${c.difficulty}</span>
            </div>
            <div class="case-card-footer" style="justify-content: center;">
              <span style="color: var(--blood-red-bright); font-weight: bold; letter-spacing: 0.5px;">OPEN DOCKET →</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Case Start / Briefing Modal (Matching Screenshot 2) -->
    <div class="case-intro-popup" id="case-intro-modal">
      <div class="case-intro-card">
        <h2 class="case-intro-title" id="intro-popup-title">CASE 014 // THE MAN WHO MOVED</h2>
        <div class="case-intro-avatar" id="intro-popup-avatar">🕵️</div>
        <div class="case-intro-sub" id="intro-popup-victim">LENA HART</div>
        <div class="case-intro-role" id="intro-popup-role">19, University Student</div>
        <p class="case-intro-synopsis" id="intro-popup-desc">
          Lena Hart's murder appears connected to government benefits administrator Daniel Cross and an earlier death involving Maria Bell. Someone is using Daniel's history to construct a false pattern.
        </p>
        <div class="case-intro-objective">
          FILL THE TIMELINE IN AUDIT SEQUENCE. CATCH CONTRADICTIONS, THEN DISPROVE FALSE CORRELATION.
        </div>
        <button class="btn btn-primary" id="btn-begin-intro" style="width: 100%; padding: 14px; font-size: 1.1rem; letter-spacing: 2px;">
          BEGIN
        </button>
      </div>
    </div>

    <!-- Create Investigation Modal -->
    <div class="modal-overlay" id="modal-create-game">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title">CREATE INVESTIGATION</div>
          <button class="modal-close" id="close-modal-create">&times;</button>
        </div>
        <div class="form-group">
          <label class="form-label">Lead Investigator Name</label>
          <input type="text" class="form-input" id="input-creator-name" value="Detective Cross" placeholder="Enter your name" />
        </div>
        <div class="form-group">
          <label class="form-label">Investigation Code / Room ID</label>
          <input type="text" class="form-input" id="input-game-id" value="CONV-8492" readonly />
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;">
          <button class="btn" id="btn-cancel-create">CANCEL</button>
          <button class="btn btn-primary" id="btn-confirm-create">ENTER LOBBY</button>
        </div>
      </div>
    </div>

    <!-- Join Investigation Modal -->
    <div class="modal-overlay" id="modal-join-game">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title">JOIN INVESTIGATION</div>
          <button class="modal-close" id="close-modal-join">&times;</button>
        </div>
        <div class="form-group">
          <label class="form-label">Partner Investigator Name</label>
          <input type="text" class="form-input" id="input-joiner-name" placeholder="Enter your callsign" />
        </div>
        <div class="form-group">
          <label class="form-label">Investigation Access Code</label>
          <input type="text" class="form-input" id="input-join-code" placeholder="e.g. CONV-8492" />
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;">
          <button class="btn" id="btn-cancel-join">CANCEL</button>
          <button class="btn btn-primary" id="btn-confirm-join">CONNECT</button>
        </div>
      </div>
    </div>
  `;

  // Filter category listeners
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-cat');
      renderLandingScreen(container);
    });
  });

  // Modal references
  const introModal = container.querySelector('#case-intro-modal');
  const modalCreate = container.querySelector('#modal-create-game');
  const modalJoin = container.querySelector('#modal-join-game');

  // Case card clicks -> Open the Noir Case Intro Modal (Screenshot 2 style)
  container.querySelectorAll('.case-card').forEach(card => {
    card.addEventListener('click', () => {
      const caseId = card.getAttribute('data-case-id');
      const caseData = getCaseById(caseId);
      gameState.loadCase(caseData);

      container.querySelectorAll('.case-card').forEach(c => c.classList.remove('active-case'));
      card.classList.add('active-case');

      // Populate intro modal
      container.querySelector('#intro-popup-title').textContent = `CASE ${caseData.case_id} // ${caseData.title}`;
      container.querySelector('#intro-popup-victim').textContent = caseData.victim?.name || 'CENTRAL SUBJECT';
      container.querySelector('#intro-popup-role').textContent = `${caseData.victim?.age ? caseData.victim.age + ', ' : ''}${caseData.victim?.occupation || 'Victim Profile'}`;
      container.querySelector('#intro-popup-desc').textContent = caseData.synopsis;

      introModal?.classList.add('open');
    });
  });

  // Begin button in intro modal
  container.querySelector('#btn-begin-intro')?.addEventListener('click', () => {
    introModal?.classList.remove('open');
    gameState.setScreen('BRIEFING');
  });

  // Start selected case directly
  container.querySelector('#btn-quick-start')?.addEventListener('click', () => {
    const caseData = getCaseById(gameState.getState().currentCaseId);
    gameState.loadCase(caseData);
    gameState.setScreen('BRIEFING');
  });

  // Create / Join modal controls
  container.querySelector('#btn-open-create')?.addEventListener('click', () => modalCreate?.classList.add('open'));
  container.querySelector('#close-modal-create')?.addEventListener('click', () => modalCreate?.classList.remove('open'));
  container.querySelector('#btn-cancel-create')?.addEventListener('click', () => modalCreate?.classList.remove('open'));
  container.querySelector('#btn-confirm-create')?.addEventListener('click', () => {
    modalCreate?.classList.remove('open');
    gameState.setScreen('LOBBY');
  });

  container.querySelector('#btn-open-join')?.addEventListener('click', () => modalJoin?.classList.add('open'));
  container.querySelector('#close-modal-join')?.addEventListener('click', () => modalJoin?.classList.remove('open'));
  container.querySelector('#btn-cancel-join')?.addEventListener('click', () => modalJoin?.classList.remove('open'));
  container.querySelector('#btn-confirm-join')?.addEventListener('click', () => {
    modalJoin?.classList.remove('open');
    gameState.setScreen('LOBBY');
  });
}

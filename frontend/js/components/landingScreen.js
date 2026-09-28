import { gameState } from '../state/gameState.js';
import { ALL_CASES, getCaseById } from '../data/caseLoader.js';
import { cinematic } from '../effects/cinematic.js';
import { sound } from '../effects/soundSystem.js';
import { createSession } from '../utils/api.js';

let caseSearchQuery = '';

export function renderLandingScreen(container) {
  const state = gameState.getState();

  const query = caseSearchQuery.trim().toLowerCase();
  const filteredCases = query
    ? ALL_CASES.filter(c => 
        c.title.toLowerCase().includes(query) ||
        c.case_id.includes(query) ||
        (c.synopsis && c.synopsis.toLowerCase().includes(query)) ||
        (c.victim?.name && c.victim.name.toLowerCase().includes(query))
      )
    : ALL_CASES;

  container.innerHTML = `
    <div class="landing-hero">
      <div class="stamp stamp-red" style="margin-bottom: 12px; animation: stamp-pop 0.4s ease-out;">CONVESTIGATE // 14 ARCHIVED DOCKETS</div>
      <h1 class="landing-title">CONV<span>ESTIGATE</span></h1>
      <p class="landing-tagline">SELECT A CASE DOCKET // REASON FROM EVIDENCE, NOT SPECULATION</p>
      
      

      <!-- 14 Cases Filter Toolbar -->
      <div class="case-filter-bar">
        <div>
          <span class="stamp stamp-white">TOTAL CASES AVAILABLE (${ALL_CASES.length})</span>
        </div>
        <div style="flex: 1; max-width: 360px; margin-left: 20px;">
          <input type="text" class="form-input" id="case-search-input" placeholder="Search case dockets..." value="${caseSearchQuery}" style="width: 100%; padding: 6px 12px; font-size: 0.85rem;" />
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
            <div class="case-card-title" style="margin: 4px 0 2px; font-size: 1.05rem;">${c.title}</div>
            <div class="case-card-desc" style="font-size: 0.78rem; line-height: 1.35; margin-bottom: 6px;">${c.synopsis.slice(0, 85)}...</div>
            <div class="case-card-footer" style="justify-content: space-between;">
              <span class="card-status-label" style="font-size: 0.72rem; color: ${state.currentCaseId === c.case_id ? 'var(--blood-red-bright)' : 'var(--text-muted)'};">
                ${state.currentCaseId === c.case_id ? '✓ SELECTED' : 'CLICK TO SELECT'}
              </span>
              <span class="card-open-link" style="color: var(--blood-red-bright); font-weight: bold; letter-spacing: 0.5px; cursor: pointer;">
                OPEN BRIEFING →
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Case Start / Briefing Modal -->
    <div class="case-intro-popup" id="case-intro-modal">
      <div class="case-intro-card">
        <button class="modal-close" id="btn-close-case-intro" style="position: absolute; top: 12px; right: 14px; font-size: 1.5rem; background: none; border: none; color: #fff; cursor: pointer;">&times;</button>
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
          ENTER CASE BRIEFING →
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
          <input type="text" class="form-input" id="input-game-id" value="${state.lobby.gameId}" readonly />
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
          <input type="text" class="form-input" id="input-join-code" placeholder="e.g. ${state.lobby.gameId}" />
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;">
          <button class="btn" id="btn-cancel-join">CANCEL</button>
          <button class="btn btn-primary" id="btn-confirm-join">CONNECT</button>
        </div>
      </div>
    </div>
  `;

  // Search input handler
  const searchInput = container.querySelector('#case-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      caseSearchQuery = e.target.value;
      const targetQuery = caseSearchQuery.trim().toLowerCase();
      container.querySelectorAll('.case-card').forEach(card => {
        const cId = card.getAttribute('data-case-id');
        const caseItem = getCaseById(cId);
        if (!caseItem) return;
        const matches = !targetQuery || 
          caseItem.title.toLowerCase().includes(targetQuery) ||
          caseItem.case_id.includes(targetQuery) ||
          (caseItem.synopsis && caseItem.synopsis.toLowerCase().includes(targetQuery));
        card.style.display = matches ? '' : 'none';
      });
    });
  }

  // Modal references
  const introModal = container.querySelector('#case-intro-modal');
  const modalCreate = container.querySelector('#modal-create-game');
  const modalJoin = container.querySelector('#modal-join-game');

  // Case card clicks -> Select Case & Update UI
  container.querySelectorAll('.case-card').forEach(card => {
    const caseId = card.getAttribute('data-case-id');
    const caseData = getCaseById(caseId);

    // Clicking anywhere on card selects it
    card.addEventListener('click', () => {
      sound.playStamp();
      gameState.loadCase(caseData);

      container.querySelectorAll('.case-card').forEach(c => {
        c.classList.remove('active-case');
        const lbl = c.querySelector('.card-status-label');
        if (lbl) {
          lbl.textContent = 'CLICK TO SELECT';
          lbl.style.color = 'var(--text-muted)';
        }
      });

      card.classList.add('active-case');
      const activeLbl = card.querySelector('.card-status-label');
      if (activeLbl) {
        activeLbl.textContent = '✓ SELECTED';
        activeLbl.style.color = 'var(--blood-red-bright)';
      }

      // Update the main action button
      const quickBtn = container.querySelector('#btn-quick-start');
      if (quickBtn) {
        quickBtn.innerHTML = `<span>👉 OPEN BRIEFING // CASE #${caseId}: ${caseData.title} →</span>`;
      }

      cinematic.showToast({
        icon: '📁',
        tag: 'DOCKET SELECTED',
        title: `Case #${caseId}: ${caseData.title}`,
        desc: 'Click "OPEN BRIEFING" button to examine victim profile and docket protocol.'
      });
    });

    // Clicking "OPEN BRIEFING →" link launches cinematic case opening into Briefing
    card.querySelector('.card-open-link')?.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playStamp();
      gameState.loadCase(caseData);
      cinematic.playCinematicCaseOpening(caseData, () => {
        gameState.setScreen('BRIEFING');
      });
    });

    // Double clicking anywhere on a case card also starts case opening
    card.addEventListener('dblclick', () => {
      sound.playStamp();
      gameState.loadCase(caseData);
      cinematic.playCinematicCaseOpening(caseData, () => {
        gameState.setScreen('BRIEFING');
      });
    });
  });

  // Main CTA Button -> Launches Cinematic Case Opening sequence and enters Case Briefing!
  container.querySelector('#btn-quick-start')?.addEventListener('click', async () => {

    sound.playStamp();

    const currentCaseId = gameState.getState().currentCaseId || '014';

    const caseData = getCaseById(currentCaseId);

    const playerName =
      gameState.getState().lobby.playerName || 'Detective Cross';

    try {
      const session = await createSession(
        currentCaseId,
        2,
        playerName
      );

      gameState.state.sessionId = session.session_id;

      gameState.loadCase(caseData);

      console.log('BACKEND SESSION CREATED:', session);

      cinematic.playCinematicCaseOpening(caseData, () => {

        gameState.setScreen('BRIEFING');

      });

    } catch (error) {

      console.error('Failed to create backend session:', error);

      alert(`Unable to start investigation: ${error.message}`);

    }

});

  // Modal controls
  container.querySelector('#btn-close-case-intro')?.addEventListener('click', () => {
    sound.playClick();
    introModal?.classList.remove('open');
  });

  container.querySelector('#btn-begin-intro')?.addEventListener('click', () => {
    sound.playStamp();
    introModal?.classList.remove('open');
    const currentCaseId = gameState.getState().currentCaseId || '014';
    const caseData = getCaseById(currentCaseId);
    gameState.loadCase(caseData);
    cinematic.playCinematicCaseOpening(caseData, () => {
      gameState.setScreen('BRIEFING');
    });
  });

  // Create / Join modal controls
  container.querySelector('#btn-open-create')?.addEventListener('click', () => {
    sound.playClick();
    modalCreate?.classList.add('open');
  });
  container.querySelector('#close-modal-create')?.addEventListener('click', () => modalCreate?.classList.remove('open'));
  container.querySelector('#btn-cancel-create')?.addEventListener('click', () => modalCreate?.classList.remove('open'));
  container.querySelector('#btn-confirm-create')?.addEventListener('click', () => {
    sound.playClick();
    const nameInput = container.querySelector('#input-creator-name');
    if (nameInput && nameInput.value.trim()) {
      gameState.state.lobby.playerName = nameInput.value.trim();
    }
    modalCreate?.classList.remove('open');
    gameState.setScreen('LOBBY');
  });

  container.querySelector('#btn-open-join')?.addEventListener('click', () => {
    sound.playClick();
    modalJoin?.classList.add('open');
  });
  container.querySelector('#close-modal-join')?.addEventListener('click', () => modalJoin?.classList.remove('open'));
  container.querySelector('#btn-cancel-join')?.addEventListener('click', () => modalJoin?.classList.remove('open'));
  container.querySelector('#btn-confirm-join')?.addEventListener('click', () => {
    sound.playClick();
    const joinCode = container.querySelector('#input-join-code')?.value.trim();
    const joinerName = container.querySelector('#input-joiner-name')?.value.trim();
    if (joinCode) {
      gameState.state.lobby.gameId = joinCode;
    }
    if (joinerName) {
      gameState.state.lobby.playerName = joinerName;
    }
    modalJoin?.classList.remove('open');
    gameState.setScreen('LOBBY');
  });
}

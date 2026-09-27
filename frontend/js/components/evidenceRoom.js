import { gameState } from '../state/gameState.js';
import { eventBus, EVENTS } from '../state/eventBus.js';
import { sound } from '../effects/soundSystem.js';
import { setDashboardTab } from './dashboard.js';

let currentFilter = 'ALL';
let activeEvidenceModal = null;
let evidenceSearchQuery = '';
let evidenceVersion = -1;

export function renderEvidenceRoom(container) {
  if (evidenceVersion !== gameState.caseVersion) {
    evidenceVersion = gameState.caseVersion;
    activeEvidenceModal = null;
    evidenceSearchQuery = '';
    currentFilter = 'ALL';
  }
  const state = gameState.getState();
  const currentCase = state.currentCase;
  const caseIdNum = String(currentCase?.case_id || '014').padStart(3, '0');
  const caseTitle = currentCase?.title || 'Current Investigation';

  // Base evidence from state
  const baseEvidenceList = Object.values(state.evidenceMap);

  const casePhotoEvidence = [];

  // Merge items: in PHOTOS tab show casePhotoEvidence. In ALL tab show both.
  let allCombinedEvidence = [...baseEvidenceList];
  casePhotoEvidence.forEach(ph => {
    if (!allCombinedEvidence.some(e => e.id === ph.id)) {
      allCombinedEvidence.push(ph);
    }
  });

  // Filter by category
  let filtered = currentFilter === 'ALL'
    ? allCombinedEvidence
    : currentFilter === 'PHOTOS'
      ? casePhotoEvidence
      : allCombinedEvidence.filter(e => (e.category || '').toUpperCase() === currentFilter);

  // Filter by search query if typed
  const sQuery = evidenceSearchQuery.trim().toLowerCase();
  if (sQuery) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(sQuery) ||
      item.id.toLowerCase().includes(sQuery) ||
      (item.description && item.description.toLowerCase().includes(sQuery)) ||
      (item.clue && item.clue.toLowerCase().includes(sQuery)) ||
      (item.type && item.type.toLowerCase().includes(sQuery))
    );
  }

function formatInvestigativeTimestamps(text) {
  if (!text) return '';
  return text
    .replace(/\b(\d{1,2}:\d{2}(?::\d{2})?(?:\s*(?:AM|PM|hrs|HRS))?)\b/g, '<mark class="evidence-timestamp-pill"><span class="timestamp-glyph">⏱</span>$1</mark>')
    .replace(/\b(\d{4}-\d{2}-\d{2})\b/g, '<mark class="evidence-timestamp-pill"><span class="timestamp-glyph">📅</span>$1</mark>')
    .replace(/\b(\d{1,2}\s+(?:hours|hrs|minutes|mins)\s+prior)\b/gi, '<mark class="evidence-timestamp-pill"><span class="timestamp-glyph">⏳</span>$1</mark>');
}

function renderPhysicalEvidenceDetail(item) {
  const typeStr = (item.type || '').toLowerCase();
  const nameStr = (item.name || '').toLowerCase();
  const catStr = (item.category || '').toLowerCase();
  const formattedDesc = formatInvestigativeTimestamps(item.description || '');

  // 1. CCTV & SURVEILLANCE
  if (typeStr.includes('cctv') || typeStr.includes('surveillance') || nameStr.includes('cctv') || nameStr.includes('surveillance')) {
    return `
      <div class="evidence-cctv-screen">
        <div class="cctv-scanline-overlay"></div>
        <div class="cctv-header-strip">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="cctv-rec-pill"><span class="cctv-rec-dot"></span> REC ● 1080P</span>
            <span>FEED_${item.id} [OPTICAL SURVEILLANCE]</span>
          </div>
          <div><mark class="evidence-timestamp-pill"><span class="timestamp-glyph">⏱</span>TIMESTAMP SECURED</mark></div>
        </div>

        ${item.image ? `
          <div class="evidence-photo-frame" id="ev-modal-photo-frame" title="Click to inspect forensic frame">
            <img src="${item.image}" alt="${item.name}" />
            <div class="photo-zoom-hint">🔍 CLICK TO INSPECT FRAME</div>
          </div>
        ` : ''}

        <div style="margin-top: 10px; font-family: var(--font-mono); font-size: 0.88rem; color: #d0f0d0; line-height: 1.55;">
          ${formattedDesc}
        </div>

        <div style="margin-top: 10px; border-top: 1px dashed #2a3a33; padding-top: 8px; font-size: 0.75rem; color: #88aa99; font-family: var(--font-mono); display: flex; justify-content: space-between; flex-wrap: wrap;">
          <span>PROVENANCE: ${item.source || 'Digital Surveillance Server'}</span>
          <span>RELIABILITY: <strong style="color: #39ff14;">${item.reliability || 'VERIFIED FEED'}</strong></span>
        </div>

        ${item.clue ? `
          <div class="key-clue-badge" style="margin-top: 12px;">
            <span style="color: var(--blood-red-bright); font-weight: bold;">[SURVEILLANCE DISCOVERY]</span>
            <span class="clue-highlight-sweep">${item.clue}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  // 2. PHOTOGRAPHS / FORENSIC PRINTS
  if (catStr === 'photos' || item.image) {
    return `
      <div class="evidence-photo-mount">
        <div class="photo-tape-top-left"></div>
        <div class="photo-tape-top-right"></div>
        
        <div class="evidence-photo-frame" id="ev-modal-photo-frame" title="Click to toggle forensic zoom">
          <img src="${item.image}" alt="${item.name}" />
          <div class="photo-zoom-hint">🔍 CLICK TO TOGGLE FORENSIC ZOOM</div>
        </div>

        <div class="forensic-scale-bar">
          <span>FORENSIC CALIBRATION SCALE</span>
          <span class="forensic-scale-ticks">|··|··|··|··| 0 - 5 - 10 CM</span>
          <span>CSU-UNIT #09</span>
        </div>

        <div style="margin-top: 12px; font-family: var(--font-mono); font-size: 0.88rem; color: #f0f0f0; line-height: 1.55;">
          ${formattedDesc}
        </div>

        <div style="margin-top: 10px; border-top: 1px dashed #444; padding-top: 8px; font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); display: flex; justify-content: space-between; flex-wrap: wrap;">
          <span>CHAIN OF CUSTODY: ${item.source || 'Crime Scene Unit Archive'}</span>
          <span>AUDIT: <strong style="color: #ffffff;">${item.reliability || 'AUTHENTICATED'}</strong></span>
        </div>

        ${item.clue ? `
          <div class="key-clue-badge" style="margin-top: 12px;">
            <span style="color: var(--blood-red-bright); font-weight: bold;">[KEY PHYSICAL CLUE]</span>
            <span class="clue-highlight-sweep">${item.clue}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  // 3. WITNESS TESTIMONY & SWORN STATEMENTS
  if (catStr === 'witness' || typeStr.includes('statement') || typeStr.includes('interview') || typeStr.includes('deposition')) {
    return `
      <div class="evidence-dossier-paper" style="border-left: 5px solid var(--blood-red);">
        <div class="dossier-paperclip"></div>
        <div class="dossier-watermark">TESTIMONY</div>
        <div class="dossier-confidential-stamp">RECORDED INTERVIEW</div>

        <div style="border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 12px; display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: bold;">
          <span>DEPOSITION RECORD // EXHIBIT ${item.id}</span>
          <span>STATION AUDIO DUMP 📼</span>
        </div>

        <div style="font-size: 0.92rem; color: #111111; line-height: 1.6; margin-bottom: 12px; font-style: italic;">
          "${formattedDesc}"
        </div>

        <div style="border-top: 1px dashed #888; padding-top: 8px; font-size: 0.75rem; color: #444; display: flex; justify-content: space-between; flex-wrap: wrap;">
          <span>WITNESS / SOURCE: <strong>${item.source || 'Recorded Audio Interview'}</strong></span>
          <span>CREDIBILITY: <strong style="color: var(--blood-red);">${item.reliability || 'UNDER SCRUTINY'}</strong></span>
        </div>

        ${item.clue ? `
          <div class="key-clue-badge" style="margin-top: 12px; background: rgba(192, 21, 21, 0.9); color: #fff;">
            <span style="font-weight: bold; color: #ffe600;">[CONTRADICTION DETECTED]</span>
            <span class="clue-highlight-sweep" style="color: #fff;">${item.clue}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  // 4. PHONE MESSAGES & TELECOMMUNICATION TRANSCRIPTS
  if (typeStr.includes('phone') || typeStr.includes('message') || typeStr.includes('chat') || typeStr.includes('sms') || typeStr.includes('transcript')) {
    return `
      <div class="evidence-phone-extract">
        <div class="phone-terminal-header">
          <span>CELLULAR LOG EXTRACTION // SIM-DUMP</span>
          <span>DEVICE_ID: EVD-${item.id}</span>
        </div>

        <div class="phone-sms-bubble">
          <div style="font-size: 0.7rem; color: var(--blood-red-bright); margin-bottom: 4px;">INTERCEPTED TRANSMISSION:</div>
          <div style="line-height: 1.5;">${formattedDesc}</div>
        </div>

        <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between; margin-top: 10px; flex-wrap: wrap;">
          <span>NETWORK LOG: ${item.source || 'Cellular Carrier'}</span>
          <span>AUDIT RATING: ${item.reliability || 'CRYPTOGRAPHICALLY VERIFIED'}</span>
        </div>

        ${item.clue ? `
          <div class="key-clue-badge" style="margin-top: 12px;">
            <span style="color: var(--blood-red-bright); font-weight: bold;">[DIGITAL EVIDENCE]</span>
            <span class="clue-highlight-sweep">${item.clue}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  // 5. PHYSICAL OBJECT / WEAPONS / BALLISTICS / SPECIMENS
  if (typeStr.includes('object') || typeStr.includes('weapon') || typeStr.includes('ballistic') || typeStr.includes('specimen') || typeStr.includes('trace') || typeStr.includes('key')) {
    return `
      <div class="evidence-specimen-bag">
        <div class="specimen-hazard-seal"></div>
        <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.75rem; color: #ffe600; margin-bottom: 8px;">
          <span>SPECIMEN POUCH: ITEM #${item.id}</span>
          <span>TAMPER SEAL: #8492-CSU</span>
        </div>

        <div style="font-family: var(--font-mono); font-size: 0.9rem; color: #ffffff; line-height: 1.5; margin-bottom: 12px;">
          ${formattedDesc}
        </div>

        <div style="border-top: 1px dashed #555; padding-top: 8px; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between; flex-wrap: wrap;">
          <span>LOCATION RECOVERED: ${item.source || 'Scene Recovery'}</span>
          <span>STATUS: <strong style="color: #fff;">${item.reliability || 'CHAIN SECURED'}</strong></span>
        </div>

        ${item.clue ? `
          <div class="key-clue-badge" style="margin-top: 12px;">
            <span style="color: var(--blood-red-bright); font-weight: bold;">[FORENSIC FINDING]</span>
            <span class="clue-highlight-sweep">${item.clue}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  // 6. DEFAULT ARCHIVAL DOSSIER & OFFICIAL RECORDS
  return `
    <div class="evidence-dossier-paper">
      <div class="dossier-paperclip"></div>
      <div class="dossier-watermark">CONFIDENTIAL</div>
      <div class="dossier-confidential-stamp">OFFICIAL EXHIBIT</div>

      <div style="border-bottom: 1px solid #aaa; padding-bottom: 6px; margin-bottom: 12px; font-size: 0.75rem; color: #555; display: flex; justify-content: space-between;">
        <span>INVESTIGATION DOCKET // REF: ${item.id}</span>
        <span>CATEGORY: ${(item.category || 'RECORD').toUpperCase()}</span>
      </div>

      <div style="font-size: 0.92rem; color: #0a0a0e; line-height: 1.6; margin-bottom: 14px;">
        ${formattedDesc}
      </div>

      <div style="border-top: 1px dashed #999; padding-top: 8px; font-size: 0.75rem; color: #444; display: flex; justify-content: space-between; flex-wrap: wrap;">
        <span>CHAIN OF CUSTODY: <strong>${item.source || 'Police Archives'}</strong></span>
        <span>AUDIT RATING: <strong>${item.reliability || 'VERIFIED'}</strong></span>
      </div>

      ${item.clue ? `
        <div class="key-clue-badge" style="margin-top: 12px; background: rgba(192, 21, 21, 0.92); color: #ffffff;">
          <span style="font-weight: bold; color: #ffe600;">[KEY DEDUCTIVE VALUE]</span>
          <span class="clue-highlight-sweep" style="color: #ffffff;">${item.clue}</span>
        </div>
      ` : ''}
    </div>
  `;
}

  container.innerHTML = `
    <div class="evidence-room-container">
      <div class="evidence-dimmable">
        <div class="evidence-toolbar" style="flex-wrap: wrap; gap: 14px;">
          <div>
            <span class="stamp stamp-white">CASE #${caseIdNum} EVIDENCE REPOSITORY</span>
            <h2 style="font-family: var(--font-headline); font-size: 1.6rem; letter-spacing: 1px; margin-top: 4px;">
              SECURED CASE ARTIFACTS
            </h2>
          </div>

          <div style="flex: 1; min-width: 200px; max-width: 320px;">
            <input type="text" class="form-input" id="evidence-search-input" placeholder="Search evidence docket..." value="${evidenceSearchQuery}" style="width: 100%; padding: 6px 10px; font-size: 0.8rem;" />
          </div>

          <div class="category-tabs">
            <button class="tab-btn ${currentFilter === 'ALL' ? 'active' : ''}" data-filter="ALL">ALL (${allCombinedEvidence.length})</button>
            <button class="tab-btn ${currentFilter === 'RECORDS' ? 'active' : ''}" data-filter="RECORDS">RECORDS</button>
            <button class="tab-btn ${currentFilter === 'WITNESS' ? 'active' : ''}" data-filter="WITNESS">WITNESS</button>
            <button class="tab-btn ${currentFilter === 'PHOTOS' ? 'active' : ''}" data-filter="PHOTOS">PHOTOS (${casePhotoEvidence.length})</button>
          </div>
        </div>

        <div class="evidence-grid" style="margin-top: 16px;">
          ${filtered.map(item => {
            const isLocked = item.status === 'locked';
            const isInvestigated = item.status === 'investigated';
            const hasImage = !!item.image;

            return `
              <div class="evidence-card ${isLocked ? 'locked' : ''} ${isInvestigated ? 'investigated' : ''}" data-evidence-id="${item.id}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <span class="evidence-badge">${item.id} // ${item.type || 'DOCUMENT'}</span>
                  ${isInvestigated ? '<span class="stamp stamp-red" style="font-size: 0.6rem; transform: none;">INVESTIGATED</span>' : ''}
                  ${isLocked ? '<span class="stamp stamp-white" style="font-size: 0.6rem; transform: none;">LOCKED</span>' : ''}
                </div>

                ${hasImage ? `
                  <div class="evidence-card-thumb" style="width: 100%; height: 130px; margin: 6px 0; overflow: hidden; border: 1px solid var(--border-medium); background: #000;">
                    <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; filter: contrast(1.15);" onerror="this.parentElement.style.display='none'" />
                  </div>
                ` : ''}

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

        <!-- Linear Workflow Navigation Footer -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid var(--border-medium); padding-top: 20px; margin-top: 28px; flex-wrap: wrap; gap: 12px;">
          <button class="btn" id="btn-ev-back-overview">
            ← DASHBOARD OVERVIEW
          </button>
          <button class="btn btn-primary" id="btn-ev-next-board" style="padding: 12px 28px; font-size: 0.95rem;">
            PROCEED TO INVESTIGATION BOARD →
          </button>
        </div>
      </div>

      <!-- Evidence Detail Modal -->
      <div class="modal-overlay" id="evidence-detail-modal">
        <div class="modal-box evidence-modal-box" id="evidence-modal-card" style="max-width: 680px; position: relative;">
          <div class="modal-header">
            <div>
              <span class="stamp stamp-red" id="modal-ev-tag">EVIDENCE LOG</span>
              <h3 class="modal-title" id="modal-ev-name" style="margin-top: 4px;">DOCUMENT TITLE</h3>
            </div>
            <button class="modal-close" id="modal-ev-close" title="Close docket (Esc)">&times;</button>
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

  const roomContainer = container.querySelector('.evidence-room-container');
  const modal = container.querySelector('#evidence-detail-modal');
  const modalBox = modal?.querySelector('#evidence-modal-card');

  // Search input listener
  const searchInput = container.querySelector('#evidence-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      evidenceSearchQuery = e.target.value;
      renderEvidenceRoom(container);
    });
  }

  // Filter tabs listeners
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      currentFilter = btn.getAttribute('data-filter');
      renderEvidenceRoom(container);
    });
  });

  // Flow navigation buttons
  container.querySelector('#btn-ev-back-overview')?.addEventListener('click', () => {
    sound.playClick();
    setDashboardTab('overview');
  });

  container.querySelector('#btn-ev-next-board')?.addEventListener('click', () => {
    sound.playStamp();
    setDashboardTab('board');
  });

  // Smooth return to investigation modal close
  let isClosing = false;
  const smoothClose = () => {
    if (isClosing || !modal?.classList.contains('open')) return;
    isClosing = true;
    sound.playClick();
    modal.classList.add('closing');
    roomContainer?.classList.remove('evidence-inspecting-active');

    setTimeout(() => {
      modal.classList.remove('open', 'closing');
      if (modalBox) {
        modalBox.style.transform = '';
      }
      isClosing = false;
      renderEvidenceRoom(container);
    }, 220);
  };

  container.querySelector('#modal-ev-close')?.addEventListener('click', smoothClose);
  container.querySelector('#modal-ev-dismiss')?.addEventListener('click', smoothClose);

  // Close when clicking outside modal box
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      smoothClose();
    }
  });

  // Keyboard shortcut: Escape closes modal
  const handleKeydown = (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      smoothClose();
      document.removeEventListener('keydown', handleKeydown);
    }
  };
  document.addEventListener('keydown', handleKeydown);

  // Subtle interactive 3D mouse parallax tilt
  if (modal && modalBox) {
    modal.addEventListener('mousemove', (e) => {
      if (!modal.classList.contains('open') || isClosing) return;
      const rect = modalBox.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      const tiltX = (-deltaY * 3.5).toFixed(2);
      const tiltY = (deltaX * 3.5).toFixed(2);
      modalBox.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1)`;
    });

    modal.addEventListener('mouseleave', () => {
      if (modal.classList.contains('open') && !isClosing) {
        modalBox.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)`;
      }
    });
  }

  // Evidence card click
  container.querySelectorAll('.evidence-card').forEach(card => {
    card.addEventListener('click', async () => {
      if (card.classList.contains('locked')) {
        sound.playClick();
        return;
      }
      
      const evId = card.getAttribute('data-evidence-id');
      const item = allCombinedEvidence.find(e => e.id === evId);
      if (!item) return;

      // Card selection feedback & audio stamp
      card.classList.add('card-selected-burst');
      sound.playStamp();
      
      // Surrounding UI subtly dims
      roomContainer?.classList.add('evidence-inspecting-active');

      const context = gameState.requestContext();
      card.setAttribute('aria-busy', 'true');
      const notice = document.createElement('p');
      notice.setAttribute('role', 'status');
      notice.textContent = 'Recording evidence inspection…';
      card.appendChild(notice);
      const inspected = await gameState.openEvidence(evId);
      if (!gameState.isCurrentRequest(context)) return;
      card.removeAttribute('aria-busy');
      notice.remove();
      if (!inspected) {
        roomContainer?.classList.remove('evidence-inspecting-active');
        const error = document.createElement('p');
        error.setAttribute('role', 'alert');
        error.textContent = gameState.getState().evidenceErrors?.[evId] || 'Unable to inspect evidence. Please retry.';
        card.appendChild(error);
        return;
      }
      activeEvidenceModal = item;

      // Populate modal
      const tagEl = container.querySelector('#modal-ev-tag');
      const nameEl = container.querySelector('#modal-ev-name');
      if (tagEl) tagEl.textContent = `${item.id} // ${item.type || 'DOCUMENT'}`;
      if (nameEl) nameEl.textContent = item.name;
      
      const body = container.querySelector('#modal-ev-body');
      if (body) {
        body.innerHTML = renderPhysicalEvidenceDetail(item);

        // Click-to-zoom interactive forensic inspection on photo frame
        const photoFrame = body.querySelector('#ev-modal-photo-frame');
        if (photoFrame) {
          photoFrame.addEventListener('click', () => {
            sound.playClick();
            photoFrame.classList.toggle('is-zoomed');
            const hint = photoFrame.querySelector('.photo-zoom-hint');
            if (hint) {
              hint.textContent = photoFrame.classList.contains('is-zoomed')
                ? '🔍 CLICK TO RESET ZOOM'
                : '🔍 CLICK TO TOGGLE FORENSIC ZOOM';
            }
          });
        }
      }

      // Open modal with focus zoom animation
      if (modalBox) {
        modalBox.style.transform = '';
      }
      modal?.classList.add('open');
    });
  });

  // Mark clue listener with discovery feedback
  container.querySelector('#modal-ev-tag-clue')?.addEventListener('click', () => {
    if (activeEvidenceModal) {
      sound.playDiscovery();

      // Spawn discovery stamp slam onto physical document
      if (modalBox) {
        const existingStamp = modalBox.querySelector('.discovery-stamp-slam');
        if (!existingStamp) {
          const stampEl = document.createElement('div');
          stampEl.className = 'discovery-stamp-slam';
          stampEl.textContent = 'CRITICAL DEDUCTION LOGGED';
          modalBox.appendChild(stampEl);
        }
      }

      eventBus.emit(EVENTS.CLUE_FOUND, { evidenceId: activeEvidenceModal.id, clue: activeEvidenceModal.clue });
      gameState.addNote(`Investigated ${activeEvidenceModal.id} (${activeEvidenceModal.name}): ${activeEvidenceModal.clue || activeEvidenceModal.description}`);
      
      // Return smoothly to investigation after discovery feedback
      setTimeout(() => {
        smoothClose();
      }, 550);
    }
  });
}

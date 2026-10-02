import { gameState } from '../state/gameState.js?v=13';
import { eventBus, EVENTS } from '../state/eventBus.js';
import { sound } from '../effects/soundSystem.js';
import { cinematic } from '../effects/cinematic.js';
import { setDashboardTab } from './dashboard.js';

let selectedFirstNode = null;
let boardNoteText = '';
let lastCreatedConnId = null;

function isEvidenceNode(ent) {
  const type = (ent.node_type || '').toLowerCase();
  return type.includes('document') || type.includes('event') || type.includes('gap') || type.includes('evidence');
}

function getNodeImage(ent, caseId, currentCase) {
  const nodeType = (ent.node_type || '').toLowerCase();
  const name = (ent.name || '').toLowerCase();
  const role = (ent.role || '').toLowerCase();
  const cid = String(caseId || currentCase?.case_id || '014').padStart(3, '0');

  // Evidence / Document / Event / Gap nodes mapped to the 8 cropped evidence icons
  if (isEvidenceNode(ent)) {
    if (name.includes('photo') || name.includes('camera') || name.includes('cctv') || name.includes('surveillance') || name.includes('scene')) {
      return 'assets/board/icons/icon_camera_photo.png';
    }
    if (name.includes('print') || name.includes('fingerprint') || name.includes('touch')) {
      return 'assets/board/icons/icon_fingerprint.png';
    }
    if (name.includes('glass') || name.includes('window') || name.includes('door') || name.includes('intrusion') || name.includes('chisel')) {
      return 'assets/board/icons/icon_broken_glass.png';
    }
    if (name.includes('blood') || name.includes('serology') || name.includes('dna') || name.includes('wound') || name.includes('profile')) {
      return 'assets/board/icons/icon_blood_drop.png';
    }
    if (name.includes('phone') || name.includes('telecom') || name.includes('tower') || name.includes('text') || name.includes('sim') || name.includes('call')) {
      return 'assets/board/icons/icon_phone.png';
    }
    if (name.includes('money') || name.includes('bank') || name.includes('dollar') || name.includes('currency') || name.includes('cash') || name.includes('pawn')) {
      return 'assets/board/icons/icon_money_transfer.png';
    }
    if (name.includes('location') || name.includes('station') || name.includes('route') || name.includes('transit') || name.includes('pin') || name.includes('toll') || name.includes('gap') || name.includes('missing')) {
      return 'assets/board/icons/icon_location_pin.png';
    }
    return 'assets/board/icons/icon_document.png';
  }

  // Specific case character matching across all 14 cases to the 6 cropped portraits:
  // Case 014: Lena Hart, Daniel Cross, Maria Bell
  if (name.includes('lena') || name.includes('hart')) {
    return 'assets/board/portraits/subject_001_female_wavy.png';
  }
  if (name.includes('cross')) {
    return cid === '007' ? 'assets/board/portraits/subject_003_male_glasses.png' : 'assets/board/portraits/subject_002_male_stubble.png';
  }
  if (name.includes('maria') || name.includes('bell')) {
    return 'assets/board/portraits/subject_005_female_short.png';
  }

  // Case 001: Eleanor Voss, Adrian Voss, Marcus Voss, Daniel Mercer
  if (name.includes('eleanor')) return 'assets/board/portraits/subject_005_female_short.png';
  if (name.includes('adrian voss')) return 'assets/board/portraits/subject_002_male_stubble.png';
  if (name.includes('marcus')) return 'assets/board/portraits/subject_006_male_bald.png';
  if (cid === '001' && name.includes('mercer')) return 'assets/board/portraits/subject_003_male_glasses.png';

  // Case 002: Maya Rao, Arjun Rao, Daniel Mehta, Vikram Sethi
  if (name.includes('maya')) return 'assets/board/portraits/subject_001_female_wavy.png';
  if (name.includes('arjun')) return 'assets/board/portraits/subject_002_male_stubble.png';
  if (name.includes('mehta')) return 'assets/board/portraits/subject_003_male_glasses.png';
  if (name.includes('vikram') || name.includes('sethi')) return 'assets/board/portraits/subject_004_male_cop.png';

  // Case 003: Ronald Paul, Unknown Man
  if (name.includes('ronald')) return 'assets/board/portraits/subject_002_male_stubble.png';
  if (cid === '003' && name.includes('unknown')) return 'assets/board/portraits/subject_006_male_bald.png';

  // Case 004: Katherine Ward, Julian Mercer, Garrison Vance
  if (name.includes('katherine') || name.includes('ward')) return 'assets/board/portraits/subject_005_female_short.png';
  if (name.includes('julian')) return 'assets/board/portraits/subject_003_male_glasses.png';
  if (name.includes('garrison') || name.includes('vance')) return 'assets/board/portraits/subject_004_male_cop.png';

  // Case 005: Elena Marquez, Adrian Vale, Ray Caldwell
  if (name.includes('elena') || name.includes('marquez')) return 'assets/board/portraits/subject_005_female_short.png';
  if (name.includes('vale')) return 'assets/board/portraits/subject_003_male_glasses.png';
  if (name.includes('caldwell')) return 'assets/board/portraits/subject_004_male_cop.png';

  // Case 006: Tim Molnar, The Driver
  if (name.includes('molnar') || name.includes('tim')) return 'assets/board/portraits/subject_002_male_stubble.png';
  if (name.includes('driver')) return 'assets/board/portraits/subject_006_male_bald.png';

  // Case 007: Daniel Cross (above), Thomas Locke
  if (name.includes('locke')) return 'assets/board/portraits/subject_002_male_stubble.png';

  // Case 008: Bryce Laspisa, Unknown Roadside Contact
  if (name.includes('bryce') || name.includes('laspisa')) return 'assets/board/portraits/subject_002_male_stubble.png';
  if (cid === '008') return 'assets/board/portraits/subject_006_male_bald.png';

  // Case 009: Blair Adams, Missing Participant
  if (name.includes('blair') || name.includes('adams')) return 'assets/board/portraits/subject_002_male_stubble.png';
  if (cid === '009') return 'assets/board/portraits/subject_003_male_glasses.png';

  // Case 010: Whitechapel Victims, Independent Offenders
  if (name.includes('whitechapel')) return 'assets/board/portraits/subject_005_female_short.png';
  if (cid === '010') return 'assets/board/portraits/subject_006_male_bald.png';

  // Case 011: Italian Grocery Merchants, Jazz Letter Author
  if (name.includes('italian') || name.includes('grocery') || name.includes('merchant')) return 'assets/board/portraits/subject_006_male_bald.png';
  if (name.includes('jazz')) return 'assets/board/portraits/subject_003_male_glasses.png';

  // Case 012: Mike Mercer, Graham Foster
  if (cid === '012' && name.includes('mercer')) return 'assets/board/portraits/subject_003_male_glasses.png';
  if (name.includes('foster') || name.includes('graham')) return 'assets/board/portraits/subject_006_male_bald.png';

  // Case 013: Sergeant Daniel Mercer, Officer Keith Bradley
  if (cid === '013' && name.includes('mercer')) return 'assets/board/portraits/subject_004_male_cop.png';
  if (name.includes('bradley') || name.includes('keith')) return 'assets/board/portraits/subject_006_male_bald.png';

  // Role heuristics:
  if (role.includes('officer') || role.includes('sergeant') || role.includes('police') || role.includes('detective') || role.includes('security')) {
    return 'assets/board/portraits/subject_004_male_cop.png';
  }
  if (role.includes('doctor') || role.includes('director') || role.includes('analyst') || role.includes('broker') || role.includes('researcher')) {
    return 'assets/board/portraits/subject_003_male_glasses.png';
  }
  if (role.includes('student') || role.includes('young') || role.includes('designer') || role.includes('heir')) {
    return 'assets/board/portraits/subject_002_male_stubble.png';
  }

  return 'assets/board/portraits/subject_006_male_bald.png';
}

function resolveSpacedEntities(rawEntities) {
  // Balanced corkboard coordinates to prevent card overlapping and keep lines clear
  const balancedLayout = [
    { x: 340, y: 20 },   // Top Center (Victim)
    { x: 70,  y: 190 },  // Mid-Left (Suspect 1)
    { x: 610, y: 190 },  // Mid-Right (Related Person)
    { x: 90,  y: 400 },  // Bottom-Left (Document / Record)
    { x: 580, y: 400 },  // Bottom-Right (Investigative Gap)
    { x: 340, y: 280 }   // Center Nexus
  ];

  return rawEntities.map((ent, idx) => {
    let x = ent.x;
    let y = ent.y;

    const isOverlapping = rawEntities.slice(0, idx).some(prev => {
      const prevX = prev.x ?? 0;
      const prevY = prev.y ?? 0;
      return Math.abs(prevX - (x ?? 0)) < 205 && Math.abs(prevY - (y ?? 0)) < 110;
    });

    if (x == null || y == null || isOverlapping) {
      const fallbackPos = balancedLayout[idx % balancedLayout.length];
      x = fallbackPos.x;
      y = fallbackPos.y;
    }

    return { ...ent, x, y };
  });
}

export function renderInvestigationBoard(container) {
  const target = (container && container.isConnected) ? container : (document.querySelector('#dash-center-stage') || container);
  if (!target) return;

  const state = gameState.getState();
  const currentCase = state.currentCase;
  const caseIdNum = String(currentCase?.case_id || '014').padStart(3, '0');
  const puzzleP03 = currentCase?.puzzles?.find(p => p.type === 'relationship_mapping');
  
  // Clean entities on board mapped with appropriate portraits/icons
  let rawEntities = [];
  if (puzzleP03?.entities && puzzleP03.entities.length > 0) {
    rawEntities = puzzleP03.entities.map(ent => ({
      ...ent,
      role: ent.role || ''
    }));
  } else {
    // Dynamically generate for cases without custom P03 entities
    const victimName = currentCase?.victim?.name || 'Victim';
    const victimRole = currentCase?.victim?.occupation || 'Victim of Crime';
    const suspects = currentCase?.suspects || [];

    rawEntities.push({
      id: 'N01',
      name: victimName,
      role: victimRole,
      node_type: 'victim',
      x: 340,
      y: 20
    });

    if (suspects[0]) {
      rawEntities.push({
        id: 'N02',
        name: suspects[0].name,
        role: suspects[0].occupation || 'Primary Suspect',
        node_type: 'suspect',
        x: 70,
        y: 190
      });
    }

    if (suspects[1]) {
      rawEntities.push({
        id: 'N03',
        name: suspects[1].name,
        role: suspects[1].occupation || 'Person of Interest',
        node_type: 'suspect',
        x: 610,
        y: 190
      });
    }

    if (suspects[2]) {
      rawEntities.push({
        id: 'N04',
        name: suspects[2].name,
        role: suspects[2].occupation || 'Witness / Contractor',
        node_type: 'suspect',
        x: 90,
        y: 400
      });
    }

    rawEntities.push({
      id: 'N05',
      name: currentCase?.evidence?.[0]?.name || 'Forensic Custody Log',
      role: 'Audited Physical Evidence',
      node_type: 'event_document',
      x: 580,
      y: 400
    });
  }

  // Ensure nodes are properly spaced, preventing card overlapping and line occlusion
  const entities = resolveSpacedEntities(rawEntities);
  const connections = state.connections || [];

  target.innerHTML = `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <div>
          <span class="stamp stamp-red">CASE #${caseIdNum} EVIDENCE CORRELATION BOARD</span>
          <h2 style="font-family: var(--font-headline); font-size: 1.6rem; letter-spacing: 1px; margin-top: 4px;">
            PHYSICAL & ADMINISTRATIVE LINKAGES
          </h2>
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
          ${selectedFirstNode ? `FIRST NODE SELECTED: <strong style="color: var(--blood-red-bright);">${selectedFirstNode.name}</strong> (Click 2nd node to connect)` : 'Click two nodes to construct a relationship connection.'}
        </div>
      </div>

      <!-- Quick User Guide Banner -->
      <div class="board-guide-banner">
        <span>📍 <strong>HOW TO PIN A LINK:</strong> Click Node 1, then click Node 2 to draw a correlation string. Click "SEVER LINK" below to delete.</span>
        <span style="color: var(--text-muted); font-size: 0.72rem;">INTERACTIVE CORKBOARD // SYSTEM v2.4</span>
      </div>

      <!-- Interactive Board Scratchpad / Deduction Input -->
      <div style="background: var(--bg-darkest); border: 1px solid var(--border-medium); padding: 10px 14px; margin-bottom: 14px; display: flex; align-items: center; gap: 10px;">
        <span class="stamp stamp-white" style="font-size: 0.65rem; transform: none; white-space: nowrap;">BOARD DEDUCTION</span>
        <input type="text" class="form-input" id="board-note-input" placeholder="Type observation or link deduction to log in notebook..." value="${boardNoteText}" style="flex: 1; padding: 7px 12px; font-size: 0.82rem;" />
        <button class="btn btn-primary" id="btn-board-save-note" style="padding: 7px 16px; font-size: 0.75rem; white-space: nowrap;">
          LOG NOTE
        </button>
      </div>

      <!-- Corkboard Viewport with SVG Lines -->
      <div class="board-viewport" id="board-canvas-box" style="min-height: 600px;">
        <svg class="board-svg-canvas" id="board-svg"></svg>
        <div class="board-node-container" id="board-nodes-wrap" style="min-height: 600px;">
          ${entities.map(ent => {
            const isEvidence = isEvidenceNode(ent);
            const imgPath = getNodeImage(ent, caseIdNum, currentCase);
            return `
            <div class="board-node ${selectedFirstNode?.id === ent.id ? 'selected' : ''}" 
                 id="bnode-${ent.id}" 
                 data-node-id="${ent.id}" 
                 style="left: ${ent.x || 100}px; top: ${ent.y || 100}px;">
              <div class="board-node-pin" id="pin-${ent.id}"></div>
              <div class="board-node-type">${ent.node_type || 'PERSON'}</div>
              <div class="${isEvidence ? 'board-node-icon-frame' : 'board-node-thumb-frame'}">
                <img src="${imgPath}" alt="${ent.name}" class="${isEvidence ? 'board-node-icon-img' : 'board-node-thumb-img'}" />
              </div>
              <div class="board-node-title">${ent.name}</div>
              ${ent.role ? `<div class="board-node-role">${ent.role}</div>` : ''}
            </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Action Bar Below Board with CLEAR CONNECTIONS button -->
      <div class="board-controls-bar" style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; margin-bottom: 20px; padding: 10px 16px; background: rgba(12, 12, 18, 0.75); border: 1px solid var(--border-medium); flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <button class="btn btn-outline-red" id="btn-clear-connections" style="padding: 7px 16px; font-size: 0.8rem; font-family: var(--font-mono); letter-spacing: 1px; display: inline-flex; align-items: center; gap: 8px;">
            <span>✂️</span> CLEAR CONNECTIONS
          </button>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary);">
            Sever all active linkage strings from the board
          </span>
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
          ACTIVE LINKAGES: <strong id="board-conn-count" style="color: var(--blood-red-bright);">${connections.length}</strong>
        </div>
      </div>

      <!-- Connection Manager List -->
      <div style="margin-top: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h4 style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">
            ACTIVE LINKAGES (${connections.length})
          </h4>
          <span style="font-size: 0.75rem; color: var(--text-secondary); font-family: var(--font-mono);">
            Status: <span style="color: #ffffff;">CONFIRMED</span> | <span style="color: var(--blood-red-bright);">RELEVANT</span> | <span style="color: #777;">NOT ESTABLISHED</span>
          </span>
        </div>

        <div class="connection-list">
          ${connections.map(conn => {
            const fromEnt = entities.find(e => e.id === conn.from);
            const toEnt = entities.find(e => e.id === conn.to);
            const label = conn.connection || `${fromEnt?.name || conn.from} ➔ ${toEnt?.name || conn.to}`;

            return `
              <div class="connection-item" data-conn-from="${conn.from}" data-conn-to="${conn.to}">
                <div>
                  <strong style="color: #ffffff; font-size: 0.9rem;">${label}</strong>
                  ${conn.reasoning ? `<p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">${conn.reasoning}</p>` : ''}
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="conn-status-tag status-${conn.status || 'UNKNOWN'}">${conn.status || 'UNKNOWN'}</span>
                  ${conn.custom ? `
                    <button class="btn btn-outline-red btn-remove-conn" data-conn-id="${conn.id}" style="padding: 4px 8px; font-size: 0.65rem;">
                      SEVER LINK
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Linear Workflow Navigation Footer -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid var(--border-medium); padding-top: 20px; margin-top: 24px; flex-wrap: wrap; gap: 12px;">
        <button class="btn" id="btn-board-back-ev">
          ← EVIDENCE REPOSITORY
        </button>
        <button class="btn btn-primary" id="btn-board-next-puzzles" style="padding: 12px 28px; font-size: 0.95rem;">
          PROCEED TO TIMELINE PUZZLE (P01) →
        </button>
      </div>
    </div>
  `;

  // Draw SVG lines between connected nodes both synchronously and after layout pass
  drawConnectionLines(target, entities, connections);
  setTimeout(() => {
    drawConnectionLines(target, entities, connections);
  }, 40);

  // Clear all connections listener
  target.querySelector('#btn-clear-connections')?.addEventListener('click', (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    sound.playGlitch();

    // 1. Reset frontend node selection state used for creating connections
    selectedFirstNode = null;
    lastCreatedConnId = null;

    // 2. Clear existing frontend connection state
    if (gameState && gameState.state) {
      gameState.state.connections = [];
    }
    if (typeof gameState?.clearConnections === 'function') {
      gameState.clearConnections();
    } else if (typeof gameState?.notify === 'function') {
      gameState.notify();
    }

    // 3. Immediately clear all drawn connection lines from SVG canvas
    const currentStage = document.querySelector('#dash-center-stage') || target;
    const svg = currentStage.querySelector('#board-svg');
    if (svg) {
      svg.innerHTML = `
        <defs>
          <filter id="stringGlowRed" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="#ff2222" flood-opacity="0.9" />
          </filter>
          <filter id="stringGlowWhite" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="#ffffff" flood-opacity="0.85" />
          </filter>
        </defs>
      `;
    }

    // 4. Remove active selection highlight from all node cards
    currentStage.querySelectorAll('.board-node').forEach(node => {
      node.classList.remove('selected');
    });

    // 5. Provide audio/visual feedback
    cinematic.showToast({
      icon: '✂️',
      tag: 'LINKAGES CLEARED',
      title: 'Connections Removed',
      desc: 'All correlation lines severed. Nodes ready for new connections.'
    });

    // 6. Immediately re-render the Investigation Board in the live stage
    renderInvestigationBoard(currentStage);
  });

  // Scratchpad note input handler
  const noteInput = target.querySelector('#board-note-input');
  if (noteInput) {
    noteInput.addEventListener('input', (e) => {
      boardNoteText = e.target.value;
    });
    noteInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveBoardNote();
      }
    });
  }

  const saveBoardNote = () => {
    const text = boardNoteText.trim();
    if (text) {
      sound.playStamp();
      gameState.addNote(`[BOARD DEDUCTION] ${text}`);
      cinematic.showToast({
        icon: '📌',
        tag: 'NOTE PINNED',
        title: 'Board Deduction Recorded',
        desc: text
      });
      boardNoteText = '';
      if (noteInput) noteInput.value = '';
    }
  };

  target.querySelector('#btn-board-save-note')?.addEventListener('click', saveBoardNote);

  // Flow navigation buttons
  target.querySelector('#btn-board-back-ev')?.addEventListener('click', () => {
    sound.playClick();
    setDashboardTab('evidence');
  });

  target.querySelector('#btn-board-next-puzzles')?.addEventListener('click', () => {
    sound.playStamp();
    setDashboardTab('p01');
  });

  // Node selection for creating connections
  target.querySelectorAll('.board-node').forEach(nodeEl => {
    nodeEl.addEventListener('click', () => {
      sound.playClick();
      const nodeId = nodeEl.getAttribute('data-node-id');
      const clickedEntity = entities.find(e => e.id === nodeId);
      if (!clickedEntity) return;

      const currentStage = document.querySelector('#dash-center-stage') || target;

      if (!selectedFirstNode) {
        selectedFirstNode = clickedEntity;
        renderInvestigationBoard(currentStage);
      } else if (selectedFirstNode.id === clickedEntity.id) {
        selectedFirstNode = null;
        renderInvestigationBoard(currentStage);
      } else {
        // Connect the two nodes with high-visibility link
        const connId = `${selectedFirstNode.id}-${clickedEntity.id}`;
        lastCreatedConnId = connId;

        const node1 = selectedFirstNode;
        const node2 = clickedEntity;
        selectedFirstNode = null;

        gameState.addConnection(node1.id, node2.id, 'RELEVANT');
        eventBus.emit(EVENTS.CONNECTION_CREATED, { from: node1.name, to: node2.name });

        // Trigger visual pin sparks on both connected nodes
        const liveNow = document.querySelector('#dash-center-stage') || currentStage;
        const pin1 = liveNow.querySelector(`#pin-${node1.id}`);
        const pin2 = liveNow.querySelector(`#pin-${node2.id}`);
        pin1?.classList.add('pin-flash');
        pin2?.classList.add('pin-flash');

        renderInvestigationBoard(liveNow);

        setTimeout(() => {
          lastCreatedConnId = null;
        }, 1200);
      }
    });
  });

  // Remove connection listener
  target.querySelectorAll('.btn-remove-conn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playGlitch();
      const connId = btn.getAttribute('data-conn-id');
      gameState.removeConnection(connId);
      const currentStage = document.querySelector('#dash-center-stage') || target;
      renderInvestigationBoard(currentStage);
    });
  });

  // Connection item hover highlight
  target.querySelectorAll('.connection-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const from = item.getAttribute('data-conn-from');
      const to = item.getAttribute('data-conn-to');
      target.querySelector(`#bnode-${from}`)?.classList.add('selected');
      target.querySelector(`#bnode-${to}`)?.classList.add('selected');
    });
    item.addEventListener('mouseleave', () => {
      const from = item.getAttribute('data-conn-from');
      const to = item.getAttribute('data-conn-to');
      if (selectedFirstNode?.id !== from) target.querySelector(`#bnode-${from}`)?.classList.remove('selected');
      if (selectedFirstNode?.id !== to) target.querySelector(`#bnode-${to}`)?.classList.remove('selected');
    });
  });
}

function drawConnectionLines(container, entities, connections) {
  const target = (container && container.isConnected) ? container : document.querySelector('#dash-center-stage');
  if (!target) return;
  const svg = target.querySelector('#board-svg');
  if (!svg) return;

  svg.innerHTML = `
    <defs>
      <filter id="stringGlowRed" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="#ff2222" flood-opacity="0.9" />
      </filter>
      <filter id="stringGlowWhite" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="#ffffff" flood-opacity="0.85" />
      </filter>
    </defs>
  `;

  if (!connections || connections.length === 0) {
    return;
  }

  connections.forEach(conn => {
    const fromEl = target.querySelector(`#bnode-${conn.from}`);
    const toEl = target.querySelector(`#bnode-${conn.to}`);
    if (fromEl && toEl) {
      // Connect between centers of the two nodes
      const x1 = fromEl.offsetLeft + fromEl.offsetWidth / 2;
      const y1 = fromEl.offsetTop + fromEl.offsetHeight / 2;
      const x2 = toEl.offsetLeft + toEl.offsetWidth / 2;
      const y2 = toEl.offsetTop + toEl.offsetHeight / 2;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const isNew = conn.id === lastCreatedConnId || `${conn.from}-${conn.to}` === lastCreatedConnId || `${conn.to}-${conn.from}` === lastCreatedConnId;

      // 1. Heavy high-contrast black backer stroke: ensures string never fades into dark background
      const shadowLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      shadowLine.setAttribute('x1', x1);
      shadowLine.setAttribute('y1', y1);
      shadowLine.setAttribute('x2', x2);
      shadowLine.setAttribute('y2', y2);
      shadowLine.setAttribute('stroke', '#000000');
      shadowLine.setAttribute('stroke-width', '6.5');
      shadowLine.setAttribute('stroke-linecap', 'round');
      shadowLine.setAttribute('opacity', '0.95');
      g.appendChild(shadowLine);

      // 2. Strong, high-contrast foreground connection line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke-linecap', 'round');

      if (conn.status === 'CONFIRMED') {
        line.setAttribute('stroke', '#ffffff');
        line.setAttribute('stroke-width', '3');
        line.setAttribute('filter', 'url(#stringGlowWhite)');
        line.classList.add('conn-line-confirmed', 'conn-line-flowing');
      } else if (conn.status === 'RELEVANT') {
        line.setAttribute('stroke', '#ff2222');
        line.setAttribute('stroke-width', '3');
        line.setAttribute('filter', 'url(#stringGlowRed)');
        line.classList.add('conn-line-relevant', 'conn-line-flowing');
      } else {
        line.setAttribute('stroke', '#d4d4d8');
        line.setAttribute('stroke-width', '2.5');
        line.setAttribute('stroke-dasharray', '5,5');
      }

      if (isNew) {
        line.classList.add('conn-line-new');
      }
      g.appendChild(line);

      svg.appendChild(g);
    }
  });
}


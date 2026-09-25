import { gameState } from '../state/gameState.js';
import { eventBus, EVENTS } from '../state/eventBus.js';

let selectedFirstNode = null;

export function renderInvestigationBoard(container) {
  const state = gameState.getState();
  const currentCase = state.currentCase;
  const puzzleP03 = currentCase?.puzzles?.find(p => p.type === 'relationship_mapping');
  
  // Entities on board
  const entities = puzzleP03?.entities || [
    { id: 'N01', name: state.currentCase?.victim?.name || 'Victim', node_type: 'victim', x: 250, y: 80 },
    { id: 'N02', name: state.suspects[0]?.name || 'Suspect', node_type: 'suspect', x: 120, y: 260 },
    { id: 'N03', name: 'Document Record', node_type: 'event_document', x: 380, y: 260 }
  ];

  const connections = state.connections || [];

  container.innerHTML = `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <span class="stamp stamp-red">EVIDENCE CORRELATION BOARD</span>
          <h2 style="font-family: var(--font-headline); font-size: 1.6rem; letter-spacing: 1px; margin-top: 4px;">
            PHYSICAL & ADMINISTRATIVE LINKAGES
          </h2>
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
          ${selectedFirstNode ? `FIRST NODE SELECTED: <strong style="color: var(--blood-red-bright);">${selectedFirstNode.name}</strong> (Click 2nd node to connect)` : 'Click two nodes to construct a relationship connection.'}
        </div>
      </div>

      <!-- Corkboard Viewport with SVG Lines -->
      <div class="board-viewport" id="board-canvas-box">
        <svg class="board-svg-canvas" id="board-svg"></svg>
        <div class="board-node-container" id="board-nodes-wrap">
          ${entities.map(ent => `
            <div class="board-node ${selectedFirstNode?.id === ent.id ? 'selected' : ''}" 
                 id="bnode-${ent.id}" 
                 data-node-id="${ent.id}" 
                 style="left: ${ent.x || 100}px; top: ${ent.y || 100}px;">
              <div class="board-node-pin"></div>
              <div class="board-node-type">${ent.node_type}</div>
              <div class="board-node-title">${ent.name}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Connection Manager List -->
      <div style="margin-top: 24px;">
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
              <div class="connection-item">
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
    </div>
  `;

  // Draw SVG lines between connected nodes
  setTimeout(() => {
    drawConnectionLines(container, entities, connections);
  }, 50);

  // Node selection for creating connections
  container.querySelectorAll('.board-node').forEach(nodeEl => {
    nodeEl.addEventListener('click', () => {
      const nodeId = nodeEl.getAttribute('data-node-id');
      const clickedEntity = entities.find(e => e.id === nodeId);
      if (!clickedEntity) return;

      if (!selectedFirstNode) {
        selectedFirstNode = clickedEntity;
        renderInvestigationBoard(container);
      } else if (selectedFirstNode.id === clickedEntity.id) {
        selectedFirstNode = null;
        renderInvestigationBoard(container);
      } else {
        // Connect the two nodes
        gameState.addConnection(selectedFirstNode.id, clickedEntity.id, 'RELEVANT');
        selectedFirstNode = null;
        renderInvestigationBoard(container);
      }
    });
  });

  // Remove connection listener
  container.querySelectorAll('.btn-remove-conn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const connId = btn.getAttribute('data-conn-id');
      gameState.removeConnection(connId);
      renderInvestigationBoard(container);
    });
  });
}

function drawConnectionLines(container, entities, connections) {
  const svg = container.querySelector('#board-svg');
  if (!svg) return;

  svg.innerHTML = '';
  connections.forEach(conn => {
    const fromEl = container.querySelector(`#bnode-${conn.from}`);
    const toEl = container.querySelector(`#bnode-${conn.to}`);
    if (fromEl && toEl) {
      const x1 = fromEl.offsetLeft + fromEl.offsetWidth / 2;
      const y1 = fromEl.offsetTop + fromEl.offsetHeight / 2;
      const x2 = toEl.offsetLeft + toEl.offsetWidth / 2;
      const y2 = toEl.offsetTop + toEl.offsetHeight / 2;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);

      // Color coding per Black/White/Blood Red theme
      if (conn.status === 'CONFIRMED') {
        line.setAttribute('stroke', '#ffffff');
        line.setAttribute('stroke-width', '2');
      } else if (conn.status === 'RELEVANT') {
        line.setAttribute('stroke', '#dc2626');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '4,4');
      } else {
        line.setAttribute('stroke', '#52525b');
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('stroke-dasharray', '2,2');
      }
      svg.appendChild(line);
    }
  });
}

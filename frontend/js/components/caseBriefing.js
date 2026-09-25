import { gameState } from '../state/gameState.js';

export function renderCaseBriefing(container) {
  const state = gameState.getState();
  const c = state.currentCase || {
    case_id: '014',
    title: 'THE MAN WHO MOVED',
    synopsis: 'Lena Hart murder investigation.',
    victim: { name: 'Lena Hart', age: 19, occupation: 'Student' },
    suspects: [],
    evidence: []
  };

  const initialEvidence = Object.values(state.evidenceMap).filter(e => e.status !== 'locked');

  container.innerHTML = `
    <div class="briefing-container">
      <div class="dossier-card">
        <div class="dossier-stamp-wrap">
          <span class="stamp stamp-red">CONFIDENTIAL DOCKET</span>
        </div>

        <div class="briefing-header">
          <span class="briefing-case-id">CASE ARCHIVE // #${c.case_id}</span>
          <h1 class="briefing-title">${c.title}</h1>
          <p style="color: var(--text-secondary); margin-top: 8px; font-size: 0.95rem; max-width: 800px;">
            ${c.synopsis}
          </p>
        </div>

        <div class="dossier-section dossier-grid-2">
          <div>
            <h4 class="dossier-subtitle">VICTIM DOSSIER</h4>
            <div style="background: var(--bg-dark); border: 1px solid var(--border-subtle); padding: 16px;">
              <h3 style="font-family: var(--font-headline); font-size: 1.2rem; color: #ffffff;">${c.victim?.name || 'Unknown'}</h3>
              <p style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--blood-red-bright); margin-bottom: 8px;">
                AGE: ${c.victim?.age || 'N/A'} // OCCUPATION: ${c.victim?.occupation || 'N/A'}
              </p>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">
                ${c.victim?.background || 'No additional file background recorded.'}
              </p>
            </div>
          </div>

          <div>
            <h4 class="dossier-subtitle">CASE PROTOCOL & RULES</h4>
            <div style="background: var(--bg-dark); border: 1px solid var(--border-subtle); padding: 16px; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">
              <p style="margin-bottom: 8px;"><strong style="color: #ffffff;">EPISTEMIC DISCIPLINE:</strong> Separate verified physical facts from early narrative speculation.</p>
              <p style="margin-bottom: 8px;"><strong style="color: #ffffff;">ADAPTIVE ADVISOR:</strong> Query the AI panel for analytical feedback and procedural hints.</p>
              <p><strong style="color: var(--blood-red-bright);">OBJECTIVE:</strong> Reconstruct timelines, solve record puzzles, and assemble the final deduction.</p>
            </div>
          </div>
        </div>

        <div class="dossier-section">
          <h4 class="dossier-subtitle">PRIMARY PERSONS OF INTEREST (${state.suspects.length})</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
            ${state.suspects.map(s => `
              <div style="background: var(--bg-dark); border: 1px solid var(--border-subtle); padding: 12px;">
                <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--blood-red-bright); font-weight: bold;">ID #${s.id}</span>
                <h4 style="font-family: var(--font-headline); font-size: 1rem; color: #ffffff; margin-top: 2px;">${s.name}</h4>
                <p style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${s.occupation}</p>
                <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 6px;">Relation: ${s.relationship_to_victim}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="dossier-section">
          <h4 class="dossier-subtitle">INITIAL OPEN EVIDENCE (${initialEvidence.length})</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px;">
            ${initialEvidence.map(ev => `
              <div style="background: var(--bg-dark); border: 1px solid var(--border-subtle); padding: 12px; border-left: 3px solid var(--blood-red);">
                <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--blood-red-bright); font-weight: bold;">${ev.id} // ${ev.type}</span>
                <h4 style="font-family: var(--font-headline); font-size: 0.95rem; color: #ffffff; margin-top: 2px;">${ev.name}</h4>
                <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">${ev.description}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid var(--border-medium); padding-top: 24px; margin-top: 10px;">
          <button class="btn" id="btn-briefing-back">← CHOOSE ANOTHER CASE</button>
          <button class="btn btn-primary" id="btn-briefing-start" style="padding: 12px 28px; font-size: 0.95rem;">
            ENTER INVESTIGATION CONSOLE →
          </button>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-briefing-back')?.addEventListener('click', () => {
    gameState.setScreen('LANDING');
  });

  container.querySelector('#btn-briefing-start')?.addEventListener('click', () => {
    gameState.setScreen('DASHBOARD');
  });
}

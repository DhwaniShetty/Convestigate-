import { gameState } from '../../state/gameState.js';
import { setDashboardTab } from '../dashboard.js';
import { sound } from '../../effects/soundSystem.js';
import { submitDynamicPuzzle } from '../../utils/api.js';
import { CASE_SCHEMAS } from '../../utils/puzzle_schemas.js';

export function renderP0XGeneric(container, puzzleId) {
  const state = gameState.getState();
  const caseId = state.currentCase.case_id;
  const isCompleted = state.puzzleProgress[puzzleId];
  
  const pData = state.currentCase.puzzles.find(p => p.id === puzzleId);
  if (!pData) return;

  const schemaInfo = CASE_SCHEMAS[caseId] && CASE_SCHEMAS[caseId][puzzleId];
  if (!schemaInfo) {
    container.innerHTML = `<div class="puzzle-box">Error: No schema found for ${caseId} ${puzzleId}</div>`;
    return;
  }

  const { schema, type: puzzleType, endpoint } = schemaInfo;

  container.innerHTML = `
    <div class="puzzle-box">
      <div class="puzzle-header">
        <div>
          <span class="stamp stamp-red">PUZZLE ${puzzleId}</span>
          <h2 style="font-family: var(--font-headline); font-size: 1.5rem; letter-spacing: 1px; margin-top: 4px; text-transform: uppercase;">
            ${pData.name}
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            ${pData.description}
          </p>
        </div>
        <div>
          ${isCompleted ? '<span class="stamp stamp-white">COMPLETED // VERIFIED</span>' : '<span class="status-pill">PENDING VERIFICATION</span>'}
        </div>
      </div>
      
      <div class="dynamic-form" style="margin-top: 20px; padding: 16px; background: var(--bg-dark); border: 1px solid var(--border-medium);">
        ${renderFormFields(schema, isCompleted, '')}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 20px; flex-wrap: wrap; gap: 12px;">
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
          UNLOCKS: ${(pData.unlocks || []).join(', ')}
        </span>
        <div style="display: flex; gap: 10px;">
          ${!isCompleted ? `
            <button class="btn btn-primary" id="btn-submit-${puzzleId}">VERIFY ANALYSIS →</button>
          ` : `
            <button class="btn btn-disabled" disabled>PUZZLE SOLVED</button>
          `}
          ${puzzleId !== 'P05' ? `
            <button class="btn btn-primary" id="btn-next-${puzzleId}" style="padding: 10px 20px;">
              NEXT PUZZLE →
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  if (!isCompleted) {
    container.querySelector(`#btn-submit-${puzzleId}`)?.addEventListener('click', async () => {
      sound.playClick();
      const sessionId = gameState.getState().sessionId;
      if (!sessionId) return;
      
      const payload = collectPayload(container, schema, caseId);
      
      try {
        const result = await submitDynamicPuzzle(sessionId, endpoint, payload);
        if (result.correct) {
          gameState.completePuzzle(puzzleId);
          renderP0XGeneric(container, puzzleId); // re-render as completed
        } else {
          alert(result.message || 'Incorrect. Please review the evidence and try again.');
        }
      } catch (err) {
        console.error('Submission failed', err);
        alert('Submission failed: ' + err.message);
      }
    });
  }

  if (puzzleId !== 'P05') {
    container.querySelector(`#btn-next-${puzzleId}`)?.addEventListener('click', () => {
      sound.playStamp();
      const nextId = 'p0' + (parseInt(puzzleId[2]) + 1);
      setDashboardTab(nextId);
    });
  }
}

function renderFormFields(schema, isCompleted, prefix) {
  if (schema.type === 'compound' || schema.type === 'dict') {
    return Object.entries(schema.fields).map(([key, field]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const label = key.replace(/_/g, ' ').toUpperCase();
      
      if (field.type === 'boolean') {
        return `
          <div style="margin-bottom: 12px; display: flex; flex-direction: column; gap: 6px;">
            <label style="color: #fff; font-family: var(--font-mono); font-size: 0.85rem;">${label}?</label>
            <div style="display: flex; gap: 12px;">
              <label><input type="radio" name="${fullKey}" value="true" ${isCompleted ? 'disabled' : ''}> TRUE</label>
              <label><input type="radio" name="${fullKey}" value="false" ${isCompleted ? 'disabled' : ''}> FALSE</label>
            </div>
          </div>
        `;
      } else if (field.type === 'string') {
        return `
          <div style="margin-bottom: 12px; display: flex; flex-direction: column; gap: 6px;">
            <label style="color: #fff; font-family: var(--font-mono); font-size: 0.85rem;">${label}</label>
            <input type="text" name="${fullKey}" style="background: #111; color: #fff; border: 1px solid var(--border-medium); padding: 8px; width: 100%; font-family: var(--font-mono);" ${isCompleted ? 'disabled' : ''} placeholder="Enter exact text...">
          </div>
        `;
      } else if (field.type === 'list') {
        return `
          <div style="margin-bottom: 12px; display: flex; flex-direction: column; gap: 6px;">
            <label style="color: #fff; font-family: var(--font-mono); font-size: 0.85rem;">${label} (comma separated)</label>
            <input type="text" name="${fullKey}" style="background: #111; color: #fff; border: 1px solid var(--border-medium); padding: 8px; width: 100%; font-family: var(--font-mono);" ${isCompleted ? 'disabled' : ''} placeholder="e.g. voluntary_disappearance, third_party_intervention">
          </div>
        `;
      } else if (field.type === 'dict') {
        return `
          <div style="margin-bottom: 16px; padding-left: 12px; border-left: 2px solid var(--border-subtle);">
            <label style="color: var(--text-secondary); font-family: var(--font-headline); font-size: 1rem; display:block; margin-bottom: 8px;">${label}</label>
            ${renderFormFields(field, isCompleted, fullKey)}
          </div>
        `;
      }
      return '';
    }).join('');
  } else if (schema.type === 'list') {
    const key = schema.key || 'hypotheses';
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const label = key.replace(/_/g, ' ').toUpperCase();
    return `
      <div style="margin-bottom: 12px; display: flex; flex-direction: column; gap: 6px;">
        <label style="color: #fff; font-family: var(--font-mono); font-size: 0.85rem;">ENTER ${label} (comma separated)</label>
        <input type="text" name="${fullKey}" style="background: #111; color: #fff; border: 1px solid var(--border-medium); padding: 8px; width: 100%; font-family: var(--font-mono);" ${isCompleted ? 'disabled' : ''} placeholder="e.g. voluntary_disappearance">
      </div>
    `;
  } else {
    return `<div style="color: red;">Unsupported schema type: ${schema.type}</div>`;
  }
}

function collectPayload(container, schema, caseId) {
  const payload = { case_id: caseId };
  
  function collectFields(schemaObj, prefix, targetObj) {
    if (schemaObj.type === 'compound' || schemaObj.type === 'dict') {
      Object.entries(schemaObj.fields).forEach(([key, field]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (field.type === 'boolean') {
          const checked = container.querySelector(`input[name="${fullKey}"]:checked`);
          targetObj[key] = checked ? (checked.value === 'true') : null;
        } else if (field.type === 'string') {
          const val = container.querySelector(`input[name="${fullKey}"]`)?.value.trim();
          targetObj[key] = val || "";
        } else if (field.type === 'list') {
          const val = container.querySelector(`input[name="${fullKey}"]`)?.value.trim();
          targetObj[key] = val ? val.split(',').map(s => s.trim()) : [];
        } else if (field.type === 'dict') {
          targetObj[key] = {};
          collectFields(field, fullKey, targetObj[key]);
        }
      });
    } else if (schemaObj.type === 'list') {
      const key = schemaObj.key || 'hypotheses';
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const val = container.querySelector(`input[name="${fullKey}"]`)?.value.trim();
      targetObj[key] = val ? val.split(',').map(s => s.trim()) : [];
    }
  }
  
  collectFields(schema, '', payload);
  return payload;
}

import { gameState } from '../state/gameState.js';

let editingNoteId = null;

export function renderNotesPanel(container) {
  const state = gameState.getState();
  const notes = state.notes || [];

  container.innerHTML = `
    <div class="notes-container" style="padding: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-medium); padding-bottom: 10px;">
        <div>
          <span class="stamp stamp-red">FIELD LOG</span>
          <h3 style="font-family: var(--font-headline); font-size: 1.2rem; letter-spacing: 1px; margin-top: 4px;">
            INVESTIGATOR NOTEBOOK (${notes.length})
          </h3>
        </div>
      </div>

      <!-- Add New Note Form -->
      <div style="background: var(--bg-darkest); border: 1px solid var(--border-medium); padding: 12px;">
        <textarea class="form-input" id="note-input-field" placeholder="Record new hypothesis or contradiction..." style="width: 100%; height: 60px; resize: none; margin-bottom: 8px;"></textarea>
        <div style="display: flex; justify-content: flex-end;">
          <button class="btn btn-primary" id="btn-save-note" style="padding: 6px 14px; font-size: 0.75rem;">
            LOG NOTE
          </button>
        </div>
      </div>

      <!-- Notes List -->
      <div style="display: flex; flex-direction: column; gap: 10px; max-height: 400px; overflow-y: auto;">
        ${notes.map(n => `
          <div class="note-paper">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="note-date">${n.timestamp}</span>
              <div class="note-actions">
                <button class="btn btn-outline-red btn-delete-note" data-note-id="${n.id}" style="padding: 2px 6px; font-size: 0.65rem;">
                  DELETE
                </button>
              </div>
            </div>
            <div class="note-text">${n.text}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Add note listener
  container.querySelector('#btn-save-note')?.addEventListener('click', () => {
    const input = container.querySelector('#note-input-field');
    const text = input?.value.trim();
    if (text) {
      gameState.addNote(text);
      input.value = '';
      renderNotesPanel(container);
    }
  });

  // Delete note listeners
  container.querySelectorAll('.btn-delete-note').forEach(btn => {
    btn.addEventListener('click', () => {
      const noteId = parseInt(btn.getAttribute('data-note-id'), 10);
      gameState.deleteNote(noteId);
      renderNotesPanel(container);
    });
  });
}

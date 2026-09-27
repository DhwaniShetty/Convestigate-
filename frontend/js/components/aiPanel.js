import { gameState } from '../state/gameState.js';
import { escapeHTML } from '../utils/text.js';
import { sound } from '../effects/soundSystem.js';

export function renderAIPanel(container) {
  const state = gameState.getState();
  const ai = state.ai;
  const isVanished = ai.state === 'VANISHED';
  const busy = ai.chatPending || ai.hintPending;
  const disabled = busy || ai.gameOver;

  if (isVanished) {
    container.innerHTML = `
      <div class="ai-vanished-overlay">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">⚠️</div>
        <div class="stamp stamp-red" style="font-size: 0.9rem; margin-bottom: 8px;">CONNECTION LOST</div>
        <h2 style="font-family: var(--font-headline); font-size: 1.5rem; letter-spacing: 2px; color: var(--blood-red-bright);">
          AI INVESTIGATOR OFFLINE
        </h2>

        <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); max-width: 260px; line-height: 1.4; margin: 16px 0;">
          The AI advisor has disconnected. You must complete the final investigation on your own.
        </p>

        <div style="font-style: italic; font-family: var(--font-mono); font-size: 0.75rem; color: var(--blood-red-bright); border-top: 1px solid var(--border-medium); padding-top: 12px;">
          "The perfect disappearance isn't one where nobody sees you leave. It's one where everyone agrees on why you left."
        </div>

        ${ai.error ? `<p role="alert">${escapeHTML(ai.error)}</p>` : ''}
        <button class="btn btn-outline-red" id="btn-reconnect-ai" style="margin-top: 20px; font-size: 0.75rem;">
          ATTEMPT PROTOCOL RESTORE
        </button>
      </div>
    `;

    container.querySelector('#btn-reconnect-ai')?.addEventListener('click', () => {
      void gameState.refreshAI();
    });
    return;
  }

  // Active AI Interface
  container.innerHTML = `
    <div class="ai-panel-wrapper ai-mood-${ai.state.toLowerCase()}">
      <!-- Backend AI state -->
      <div class="ai-header">
        <div class="ai-state-indicator">
          <div class="status-dot active"></div>
          <span style="color: ${ai.state === 'PANIC' || ai.state === 'THREATENED' ? 'var(--blood-red-bright)' : '#ffffff'};">
            AI: ${ai.state}
          </span>
        </div>

      </div>

      <!-- Avatar & Mood Graphic -->
      <div class="ai-avatar-section">
        <div class="ai-avatar">
          ${ai.state === 'PANIC' ? '⚡' : ai.state === 'THREATENED' ? '👁️' : 'AI'}
        </div>
        <div style="font-family: var(--font-headline); font-size: 0.85rem; letter-spacing: 1px; color: #ffffff;">
          DETECTIVE CORE v4.1
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">
          STATUS: ${ai.state === 'PANIC' ? 'CRITICAL SYSTEM INSTABILITY' : 'REASONING ADVISOR'}
        </div>
      </div>

      <!-- Messages Thread -->
      <div class="ai-messages-scroll" id="ai-msg-list">
        ${ai.messages.map(m => `
          <div class="ai-msg ${m.sender === 'user' ? 'ai-msg-user' : m.sender === 'hint' ? 'ai-msg-hint' : 'ai-msg-assistant'}">
            ${escapeHTML(m.text)}
          </div>
        `).join('')}
      </div>

      ${ai.error ? `<p role="alert" style="color: var(--blood-red-bright);">${escapeHTML(ai.error)}</p>` : ''}
      ${busy ? '<p role="status" aria-live="polite">Waiting for the AI investigator...</p>' : ''}
      <!-- Bottom Chat & Hint Controls -->
      <div class="ai-controls">
        <button class="btn btn-outline-red" id="btn-ai-hint" ${disabled || ai.hintsRemaining <= 0 ? 'disabled' : ''} style="font-size: 0.75rem; width: 100%;">
          ${ai.hintPending ? 'REQUESTING HINT...' : `REQUEST PROCEDURAL HINT (${ai.hintsRemaining} REMAINING)`}
        </button>
        <div class="ai-input-row">
          <input type="text" class="form-input" id="input-ai-msg" value="${escapeHTML(ai.draft)}" ${disabled ? 'disabled' : ''} placeholder="Query investigation advisor..." style="flex: 1; padding: 6px 10px; font-size: 0.8rem;" />
          <button class="btn btn-primary" id="btn-send-ai-msg" ${disabled ? 'disabled' : ''} style="padding: 6px 14px;">${ai.chatPending ? 'SENDING...' : 'SEND'}</button>
        </div>
      </div>
    </div>
  `;

  // Scroll to bottom
  const msgList = container.querySelector('#ai-msg-list');
  if (msgList) msgList.scrollTop = msgList.scrollHeight;

  container.querySelector('#btn-ai-hint')?.addEventListener('click', () => {
    sound.playDiscovery();
    const puzzleId = Object.keys(state.puzzleProgress).find(id => !state.puzzleProgress[id]) || null;
    void gameState.requestAIHint(puzzleId);
  });

  const input = container.querySelector('#input-ai-msg');
  input?.addEventListener('input', () => { ai.draft = input.value; });
  const handleSend = () => {
    if (input?.value.trim()) {
      sound.playClick();
      void gameState.sendAIMessage(input.value);
    }
  };
  container.querySelector('#btn-send-ai-msg')?.addEventListener('click', handleSend);
  input?.addEventListener('keydown', event => {
    if (event.key === 'Enter') handleSend();
  });
}

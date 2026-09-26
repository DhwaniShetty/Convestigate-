import { gameState } from '../state/gameState.js';
import { eventBus, EVENTS } from '../state/eventBus.js';
import { sound } from '../effects/soundSystem.js';

export function renderAIPanel(container) {
  const state = gameState.getState();
  const ai = state.ai;
  const isVanished = ai.state === 'VANISHED';

  // Format countdown mm:ss
  const mins = Math.floor(ai.countdownSeconds / 60);
  const secs = ai.countdownSeconds % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (isVanished) {
    container.innerHTML = `
      <div class="ai-vanished-overlay">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">⚠️</div>
        <div class="stamp stamp-red" style="font-size: 0.9rem; margin-bottom: 8px;">CONNECTION LOST</div>
        <h2 style="font-family: var(--font-headline); font-size: 1.5rem; letter-spacing: 2px; color: var(--blood-red-bright);">
          AI INVESTIGATOR OFFLINE
        </h2>
        
        <div class="countdown-box-active">
          <div class="countdown-digits">
            ${timeFormatted}
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); letter-spacing: 2px;">
            EMERGENCY BUFFER COUNTDOWN
          </span>
        </div>

        <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary); max-width: 260px; line-height: 1.4; margin-bottom: 16px;">
          The AI advisor has disconnected. You must complete the final investigation on your own.
        </p>

        <div style="font-style: italic; font-family: var(--font-mono); font-size: 0.75rem; color: var(--blood-red-bright); border-top: 1px solid var(--border-medium); padding-top: 12px;">
          "The perfect disappearance isn't one where nobody sees you leave. It's one where everyone agrees on why you left."
        </div>

        <button class="btn btn-outline-red" id="btn-reconnect-ai" style="margin-top: 20px; font-size: 0.75rem;">
          ATTEMPT PROTOCOL RESTORE
        </button>
      </div>
    `;

    container.querySelector('#btn-reconnect-ai')?.addEventListener('click', () => {
      gameState.setAIState('CALM');
      renderAIPanel(container);
    });
    return;
  }

  // Active AI Interface
  container.innerHTML = `
    <div class="ai-panel-wrapper ai-mood-${ai.state.toLowerCase()}">
      <!-- AI Header & Mood Switcher for testing/interaction -->
      <div class="ai-header">
        <div class="ai-state-indicator">
          <div class="status-dot active"></div>
          <span style="color: ${ai.state === 'PANIC' || ai.state === 'THREATENED' ? 'var(--blood-red-bright)' : '#ffffff'};">
            AI: ${ai.state}
          </span>
        </div>
        <div style="display: flex; gap: 4px;">
          <button class="btn btn-mood" data-mood="CALM" style="padding: 2px 6px; font-size: 0.6rem;">CALM</button>
          <button class="btn btn-mood" data-mood="EXCITED" style="padding: 2px 6px; font-size: 0.6rem;">EXC</button>
          <button class="btn btn-mood" data-mood="DEFENSIVE" style="padding: 2px 6px; font-size: 0.6rem;">DEF</button>
          <button class="btn btn-mood" data-mood="THREATENED" style="padding: 2px 6px; font-size: 0.6rem;">THR</button>
          <button class="btn btn-mood" data-mood="PANIC" style="padding: 2px 6px; font-size: 0.6rem;">PANIC</button>
          <button class="btn btn-mood" data-mood="VANISHED" style="padding: 2px 6px; font-size: 0.6rem; color: var(--blood-red-bright);">DISC</button>
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
            ${m.text}
          </div>
        `).join('')}
      </div>

      <!-- Bottom Chat & Hint Controls -->
      <div class="ai-controls">
        <button class="btn btn-outline-red" id="btn-ai-hint" style="font-size: 0.75rem; width: 100%;">
          REQUEST PROCEDURAL HINT (${ai.hintsRemaining} REMAINING)
        </button>
        <div class="ai-input-row">
          <input type="text" class="form-input" id="input-ai-msg" placeholder="Query investigation advisor..." style="flex: 1; padding: 6px 10px; font-size: 0.8rem;" />
          <button class="btn btn-primary" id="btn-send-ai-msg" style="padding: 6px 14px;">SEND</button>
        </div>
      </div>
    </div>
  `;

  // Scroll to bottom
  const msgList = container.querySelector('#ai-msg-list');
  if (msgList) msgList.scrollTop = msgList.scrollHeight;

  // Mood switchers
  container.querySelectorAll('.btn-mood').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playClick();
      const mood = btn.getAttribute('data-mood');
      gameState.setAIState(mood);
      renderAIPanel(container);
    });
  });

  // Hint button
  container.querySelector('#btn-ai-hint')?.addEventListener('click', () => {
    sound.playDiscovery();
    gameState.requestAIHint('P01');
    renderAIPanel(container);
  });

  // Send message
  const handleSend = () => {
    const input = container.querySelector('#input-ai-msg');
    const text = input?.value.trim();
    if (text) {
      sound.playClick();
      gameState.addAIMessage('user', text);
      input.value = '';

      // Mock advisor reply
      setTimeout(() => {
        sound.playTypewriter();
        let reply = 'Examining the docket records. Notice any inconsistencies between stated time windows and physical logs.';
        if (text.toLowerCase().includes('daniel') || text.toLowerCase().includes('cross')) {
          reply = 'Daniel Cross has a verified administrative connection, but be careful not to conflate geographic proximity with direct homicide culpability.';
        } else if (text.toLowerCase().includes('jogger')) {
          reply = 'The jogger only caught a brief glimpse in poor lighting. Compare their 22:10 sighting with the cellular triangulation log.';
        }
        gameState.addAIMessage('assistant', reply);
        renderAIPanel(container);
      }, 500);

      renderAIPanel(container);
    }
  };

  container.querySelector('#btn-send-ai-msg')?.addEventListener('click', handleSend);
  container.querySelector('#input-ai-msg')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}

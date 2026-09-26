/**
 * EventBus - Central Event Dispatcher & Cinematic Animation Hooks
 * Strictly prepared for future animation integration without altering logic.
 */

class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(callback);
    return () => this.off(eventName, callback);
  }

  off(eventName, callback) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).delete(callback);
    }
  }

  emit(eventName, payload = {}) {
    console.log(`[EventBus] ${eventName}`, payload);
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).forEach(callback => {
        try {
          callback(payload);
        } catch (err) {
          console.error(`Error in listener for ${eventName}:`, err);
        }
      });
    }

    // Trigger visual hook if DOM element exists
    const hookAttr = `data-hook-${eventName.toLowerCase().replace(/_/g, '-')}`;
    const targetElement = document.querySelector(`[${hookAttr}]`);
    if (targetElement) {
      targetElement.classList.add('animation-triggered');
      setTimeout(() => targetElement.classList.remove('animation-triggered'), 1000);
    }
  }
}

export const eventBus = new EventBus();

// Standard Game Events as specified in Architecture Doc
export const EVENTS = {
  CASE_STARTED: 'CASE_STARTED',
  EVIDENCE_OPENED: 'EVIDENCE_OPENED',
  EVIDENCE_DISCOVERED: 'EVIDENCE_DISCOVERED',
  CLUE_FOUND: 'CLUE_FOUND',
  CONNECTION_CREATED: 'CONNECTION_CREATED',
  CONTRADICTION_FOUND: 'CONTRADICTION_FOUND',
  PUZZLE_COMPLETED: 'PUZZLE_COMPLETED',
  AI_STATE_CHANGED: 'AI_STATE_CHANGED',
  AI_HINT_REQUESTED: 'AI_HINT_REQUESTED',
  AI_HINT_GIVEN: 'AI_HINT_GIVEN',
  AI_PANIC: 'AI_PANIC',
  AI_VANISHED: 'AI_VANISHED',
  COUNTDOWN_STARTED: 'COUNTDOWN_STARTED',
  FINAL_INVESTIGATION_STARTED: 'FINAL_INVESTIGATION_STARTED',
  SCREEN_CHANGED: 'SCREEN_CHANGED'
};

/**
 * CinematicOrchestrator - Central Animation & Atmospheric Controller
 * Connects reactive events to the 3 WOW Moments, atmosphere, and micro-interactions.
 */
import { eventBus, EVENTS } from '../state/eventBus.js';
import { gameState } from '../state/gameState.js';
import { sound } from './soundSystem.js';
import { mangaStory } from './mangaStory.js';

class CinematicOrchestrator {
  constructor() {
    this.atmosphereRoot = null;
    this.overlayRoot = null;
    this.toastContainer = null;
    this.manualRoot = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    // Get or create container roots
    this.atmosphereRoot = document.getElementById('cinematic-atmosphere');
    if (!this.atmosphereRoot) {
      this.atmosphereRoot = document.createElement('div');
      this.atmosphereRoot.id = 'cinematic-atmosphere';
      this.atmosphereRoot.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.atmosphereRoot);
    }

    this.overlayRoot = document.getElementById('cinematic-overlay-root');
    if (!this.overlayRoot) {
      this.overlayRoot = document.createElement('div');
      this.overlayRoot.id = 'cinematic-overlay-root';
      document.body.appendChild(this.overlayRoot);
    }

    this.toastContainer = document.getElementById('toast-container');
    if (!this.toastContainer) {
      this.toastContainer = document.createElement('div');
      this.toastContainer.id = 'toast-container';
      this.toastContainer.className = 'toast-container';
      document.body.appendChild(this.toastContainer);
    }

    this.manualRoot = document.getElementById('manual-modal-root');
    if (!this.manualRoot) {
      this.manualRoot = document.createElement('div');
      this.manualRoot.id = 'manual-modal-root';
      document.body.appendChild(this.manualRoot);
    }

    // Build atmospheric layers
    this.atmosphereRoot.innerHTML = `
      <div class="cinematic-scanlines"></div>
      <div class="cinematic-vignette" id="cinematic-vignette"></div>
    `;

    // Listen to global user interactions to wake audio
    const handleFirstUserGesture = () => {
      sound.resume();
      window.removeEventListener('click', handleFirstUserGesture);
      window.removeEventListener('keydown', handleFirstUserGesture);
    };
    window.addEventListener('click', handleFirstUserGesture);
    // Subtle physical desk parallax on mouse move
    const surfaceEl = document.getElementById('carved-noir-surface');
    if (surfaceEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let rafId = null;
      window.addEventListener('mousemove', (e) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 8;
          const y = (e.clientY / window.innerHeight - 0.5) * 8;
          surfaceEl.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
          rafId = null;
        });
      }, { passive: true });
    }

    // Bind event bus hooks
    this.bindEvents();
    this.initialized = true;

    // Initial atmospheric sync
    this.syncTensionState(gameState.getState().ai?.state || 'CALM');
  }

  bindEvents() {
    // Atmosphere & Tension based on AI state
    eventBus.on(EVENTS.AI_STATE_CHANGED, ({ newState }) => {
      this.syncTensionState(newState);
      if (newState === 'PANIC') {
        this.triggerScreenJolt();
        sound.playGlitch();
        this.showToast({
          icon: '⚡',
          tag: 'SYSTEM ALARM',
          title: 'AI Instability Detected',
          desc: 'Analytical defenses are collapsing. Emotional strain critical.'
        });
      }
    });

    // WOW MOMENT 3: AI VANISHED
    eventBus.on(EVENTS.AI_VANISHED, () => {
      this.triggerAIVanishSequence();
    });

    // WOW MOMENT 2: CLUE FOUND & EVIDENCE DISCOVERY
    eventBus.on(EVENTS.CLUE_FOUND, ({ evidenceId, clue }) => {
      sound.playDiscovery();
      this.triggerScreenJolt();
      this.showToast({
        icon: '🔍',
        tag: 'DEDUCTION RECORDED',
        title: `Clue Correlated: ${evidenceId}`,
        desc: clue || 'Critical evidentiary note added to case notebook.'
      });
    });

    eventBus.on(EVENTS.EVIDENCE_DISCOVERED, ({ evidenceId }) => {
      sound.playStamp();
      this.showToast({
        icon: '📁',
        tag: 'NEW EVIDENCE UNLOCKED',
        title: `Chain of Custody: ${evidenceId}`,
        desc: 'New forensic documents are now open for examination in the repository.'
      });
    });

    // Connection Created on Corkboard
    eventBus.on(EVENTS.CONNECTION_CREATED, ({ from, to }) => {
      sound.playDiscovery();
      this.triggerScreenJolt();
      this.showToast({
        icon: '📌',
        tag: 'LINK ESTABLISHED',
        title: 'Board Correlation Pinned',
        desc: `Physical linkage constructed between ${from} and ${to}.`
      });
    });

    // Puzzle Completed
    eventBus.on(EVENTS.PUZZLE_COMPLETED, ({ puzzleId }) => {
      sound.playDiscovery();
      this.triggerScreenJolt();
      this.showToast({
        icon: '✓',
        tag: 'AUDIT VERIFIED',
        title: `${puzzleId} Solved`,
        desc: 'Chronological timeline verified. Correlated custody logs unlocked.'
      });
    });

    // Keyboard ESC to close modals or guide
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  syncTensionState(aiState) {
    const validTensions = ['calm', 'excited', 'defensive', 'threatened', 'panic', 'vanished'];
    validTensions.forEach(t => document.body.classList.remove(`tension-${t}`));
    const normalized = (aiState || 'calm').toLowerCase();
    document.body.classList.add(`tension-${normalized}`);
  }

  triggerScreenJolt() {
    const appRoot = document.getElementById('app-root');
    if (appRoot) {
      appRoot.classList.remove('screen-jolt');
      void appRoot.offsetWidth; // Force reflow
      appRoot.classList.add('screen-jolt');
      setTimeout(() => appRoot.classList.remove('screen-jolt'), 400);
    }
  }

  /**
   * WOW MOMENT 1: REUSABLE CINEMATIC MURDER-MYSTERY MANGA PRESENTATION
   * Supports: Fullscreen, split, vertical panels, character close-ups,
   * CCTV/phone evidence, speech/thought bubbles, and cinematic transitions.
   */
  playCinematicCaseOpening(caseData, onComplete) {
    mangaStory.presentCase(caseData, onComplete);
  }

  openMangaStory(caseData, onComplete) {
    mangaStory.presentCase(caseData, onComplete);
  }

  /**
   * WOW MOMENT 3: AI PANIC → VANISH → CONNECTION LOST → COUNTDOWN STROBE
   */
  triggerAIVanishSequence() {
    sound.playVanish();
    this.triggerScreenJolt();

    // Flash burst
    const flash = document.createElement('div');
    flash.className = 'vanish-flash-effect';
    flash.innerHTML = `<div class="crt-shutdown-line"></div>`;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 600);

    this.syncTensionState('vanished');

    this.showToast({
      icon: '⚠️',
      tag: 'CONNECTION SEVERED',
      title: 'AI Advisor Offline',
      desc: 'Emergency security buffer active. The clock is running.'
    });

    // Start heartbeat audio loop while vanished
    this.startHeartbeatAudio();
  }

  startHeartbeatAudio() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      const state = gameState.getState();
      if (state.ai?.state === 'VANISHED') {
        sound.playHeartbeat();
      } else {
        clearInterval(this.heartbeatInterval);
      }
    }, 2000);
  }

  /**
   * Toast notification helper
   */
  showToast({ icon = 'ℹ️', tag = 'FORENSIC ALERT', title = '', desc = '', duration = 4500 }) {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'convestigate-toast';
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div style="flex: 1;">
        <div class="toast-tag">${tag}</div>
        <div class="toast-title">${title}</div>
        <div class="toast-desc">${desc}</div>
      </div>
    `;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hiding');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  }

  /**
   * Interactive Detective Field Manual / Quick Guide Modal
   */
  openFieldManual() {
    if (!this.manualRoot) return;
    sound.playClick();

    this.manualRoot.innerHTML = `
      <div class="modal-overlay open" id="field-manual-modal">
        <div class="modal-box guide-modal-box">
          <div class="modal-header">
            <div>
              <span class="stamp stamp-red">FIELD MANUAL</span>
              <h3 class="modal-title" style="margin-top: 4px;">INVESTIGATOR'S QUICK PROTOCOL</h3>
            </div>
            <button class="modal-close" id="btn-close-manual">&times;</button>
          </div>

          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 10px; line-height: 1.4;">
            Convestigate is an epistemic deduction game. You are not guessing who is guilty—you are uncovering verifiable custody chains, identifying contradictions, and dismantling fabricated narratives.
          </p>

          <div class="guide-step-grid">
            <div class="guide-step-card">
              <div class="guide-step-num">01</div>
              <div class="guide-step-title">EXAMINE EVIDENCE</div>
              <p class="guide-step-desc">Open documents, witness statements, and cell tower pings in the Evidence Repository. Mark critical clues to log findings.</p>
            </div>

            <div class="guide-step-card">
              <div class="guide-step-num">02</div>
              <div class="guide-step-title">MAP CONNECTIONS</div>
              <p class="guide-step-desc">On the corkboard, click any node then click a second node to pin a physical or administrative linkage between suspects and events.</p>
            </div>

            <div class="guide-step-card">
              <div class="guide-step-num">03</div>
              <div class="guide-step-title">SOLVE 5 PUZZLES</div>
              <p class="guide-step-desc">Tackle timeline reconstruction, employment records, and missing audit logs to unlock sealed evidence files.</p>
            </div>

            <div class="guide-step-card">
              <div class="guide-step-num">04</div>
              <div class="guide-step-title">CONSULT THE AI</div>
              <p class="guide-step-desc">Query your AI detective core for hints. But beware: as you uncover the truth, the AI will grow defensive and may suddenly vanish.</p>
            </div>
          </div>

          <div style="background: rgba(192, 21, 21, 0.1); border: 1px solid var(--blood-red-deep); padding: 12px 16px; margin-bottom: 20px;">
            <strong style="color: var(--blood-red-bright); font-size: 0.85rem; font-family: var(--font-mono);">PRO-TIP:</strong>
            <span style="font-size: 0.8rem; color: #ffffff; margin-left: 6px;">
              Proximity does not equal culpability. Disprove false correlation by looking closely at timestamps!
            </span>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button class="btn btn-primary" id="btn-dismiss-manual" style="padding: 10px 24px;">
              UNDERSTOOD // RESUME INVESTIGATION
            </button>
          </div>
        </div>
      </div>
    `;

    const close = () => {
      const modal = this.manualRoot.querySelector('#field-manual-modal');
      if (modal) modal.classList.remove('open');
      this.manualRoot.innerHTML = '';
      sound.playClick();
    };

    this.manualRoot.querySelector('#btn-close-manual')?.addEventListener('click', close);
    this.manualRoot.querySelector('#btn-dismiss-manual')?.addEventListener('click', close);
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    if (this.manualRoot) this.manualRoot.innerHTML = '';
  }
}

export const cinematic = new CinematicOrchestrator();

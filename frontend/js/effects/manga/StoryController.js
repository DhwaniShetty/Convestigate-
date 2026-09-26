import { MangaPage } from './MangaPage.js';
import { sound } from '../soundSystem.js';

/**
 * Maps any case to its corresponding set of 6 finished manga scene images
 */
function getCaseMangaImages(caseData) {
  const idStr = String(caseData?.case_id || '001').padStart(3, '0');
  const num = parseInt(idStr, 10) || 1;

  // We have all 14 high-resolution finished manga case sheets: 001 through 014
  let targetId = '001';
  if (['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012', '013', '014'].includes(idStr)) {
    targetId = idStr;
  } else {
    const mappedNum = ((num - 1) % 14) + 1;
    targetId = String(mappedNum).padStart(3, '0');
  }

  const folder = `assets/manga/cases/case_${targetId}`;
  return {
    caseId: targetId,
    title: caseData?.title || `CASE ${targetId}`,
    header: `${folder}/header.jpg`,
    fullPage: `${folder}/full_page.jpg`,
    panels: [
      `${folder}/panel_1.jpg`,
      `${folder}/panel_2.jpg`,
      `${folder}/panel_3.jpg`,
      `${folder}/panel_4.jpg`,
      `${folder}/panel_5.jpg`,
      `${folder}/panel_6.jpg`
    ]
  };
}

/**
 * StoryController - Manages the Interactive 2x3 Fixed-Grid Manga Storyline
 * - NEXT, PREV, RESET controls
 * - Left / Right arrow-key navigation
 * - Fixed 2x3 layout with zero layout shifting
 * - Progressive reveal from Block 1 to Block 6
 */
export class StoryController {
  constructor() {
    this.stageRoot = null;
    this.currentPage = null;
    this.caseData = null;
    this.mangaData = null;
    this.onCompleteCallback = null;
    this.keyHandler = null;
  }

  /**
   * Main entry point
   */
  presentCase(caseData, onComplete) {
    sound.resume();
    this.caseData = caseData;
    this.onCompleteCallback = onComplete;
    this.mangaData = getCaseMangaImages(caseData);

    // Get or create overlay root
    let root = document.getElementById('cinematic-overlay-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'cinematic-overlay-root';
      document.body.appendChild(root);
    }
    root.innerHTML = '';

    const stage = document.createElement('div');
    stage.className = 'manga-stage-overlay';
    stage.id = 'manga-active-stage';
    root.appendChild(stage);
    this.stageRoot = stage;

    // Attach keyboard navigation
    this.setupKeyboardNavigation();

    // Render the fixed grid stage
    this.renderStage();
  }

  renderStage() {
    if (!this.stageRoot) return;

    this.currentPage = new MangaPage(this.mangaData, {
      onReveal: (count, total) => this.updateControlsUI(count, total)
    });

    this.stageRoot.innerHTML = `
      <!-- Paper grain, screentone dots & atmospheric vignette -->
      <div class="manga-page-paper-grain" aria-hidden="true"></div>
      <div class="manga-page-screentone" aria-hidden="true"></div>
      <div class="manga-stage-vignette" aria-hidden="true"></div>

      <!-- Top HUD Header -->
      <header class="manga-hud-bar manga-hud-top">
        <div class="manga-hud-title">
          <span>CONVESTIGATE // MANGA STORY</span>
          <span style="color: #555566;">•</span>
          <span style="color: #ffffff;">CASE #${this.caseData?.case_id || this.mangaData.caseId}: ${this.caseData?.title || 'ACTIVE INVESTIGATION'}</span>
        </div>

        <div style="display: flex; align-items: center; gap: 14px;">
          <div class="manga-hud-page-indicator" id="manga-step-indicator">
            BLOCK 1 / 6 REVEALED
          </div>
          <button class="manga-nav-btn" id="manga-btn-close-top" title="Exit to Investigation (ESC)">
            ✕ CLOSE [ESC]
          </button>
        </div>
      </header>

      <!-- Central Fixed 2x3 Grid Container -->
      <main class="manga-stage-center" id="manga-stage-center">
        <div id="manga-page-mount" class="manga-page-mount"></div>
      </main>

      <!-- Bottom HUD Controls -->
      <footer class="manga-hud-bar manga-hud-bottom">
        <div class="manga-hud-hints">
          <span class="manga-key-hint">← PREV</span>
          <span class="manga-key-sep">•</span>
          <span class="manga-key-hint">NEXT →</span>
          <span class="manga-key-sep">•</span>
          <span class="manga-key-hint">R: RESET</span>
          <span class="manga-key-sep">•</span>
          <span class="manga-key-hint">ESC: CLOSE</span>
        </div>

        <div class="manga-hud-actions">
          <!-- RESET Button (returns to Block 1 only) -->
          <button class="manga-nav-btn" id="manga-btn-reset" disabled title="Reset to Block 1">
            ↺ RESET
          </button>

          <!-- PREV Button (hides only most recently revealed block) -->
          <button class="manga-nav-btn" id="manga-btn-prev" disabled title="Hide latest block (Left Arrow)">
            ← PREV
          </button>

          <!-- Visual Grid Representation [1] [ ] [ ] [ ] [ ] [ ] -->
          <div class="manga-mini-matrix" id="manga-mini-matrix" aria-label="Grid State">
            <span class="matrix-cell active" data-cell="1">1</span>
            <span class="matrix-cell" data-cell="2">2</span>
            <span class="matrix-cell" data-cell="3">3</span>
            <span class="matrix-cell" data-cell="4">4</span>
            <span class="matrix-cell" data-cell="5">5</span>
            <span class="matrix-cell" data-cell="6">6</span>
          </div>

          <!-- NEXT Button (reveals only the next block) -->
          <button class="manga-nav-btn primary" id="manga-btn-next" title="Reveal next block (Right Arrow)">
            NEXT [ 2 / 6 ] →
          </button>

          <!-- Final Proceed Button -->
          <button class="manga-nav-btn complete-btn" id="manga-btn-proceed" style="display: none;">
            ENTER CASE →
          </button>
        </div>
      </footer>
    `;

    const mount = this.stageRoot.querySelector('#manga-page-mount');
    if (mount) {
      mount.appendChild(this.currentPage.render());
    }

    // Attach button listeners
    this.stageRoot.querySelector('#manga-btn-next')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleNext();
    });

    this.stageRoot.querySelector('#manga-btn-prev')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handlePrev();
    });

    this.stageRoot.querySelector('#manga-btn-reset')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleReset();
    });

    this.stageRoot.querySelector('#manga-btn-close-top')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeMangaPresentation();
    });

    this.stageRoot.querySelector('#manga-btn-proceed')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeMangaPresentation();
    });

    // Initial button state sync
    this.updateControlsUI(1, 6);
  }

  handleNext() {
    if (!this.currentPage) return;
    if (this.currentPage.isFinal()) {
      this.closeMangaPresentation();
      return;
    }
    sound.playClick();
    this.currentPage.revealNext();
  }

  handlePrev() {
    if (!this.currentPage) return;
    if (this.currentPage.isFirst()) return;
    sound.playClick();
    this.currentPage.revealPrev();
  }

  handleReset() {
    if (!this.currentPage) return;
    sound.playClick();
    this.currentPage.reset();
  }

  updateControlsUI(count, total) {
    if (!this.stageRoot) return;

    const nextBtn = this.stageRoot.querySelector('#manga-btn-next');
    const prevBtn = this.stageRoot.querySelector('#manga-btn-prev');
    const resetBtn = this.stageRoot.querySelector('#manga-btn-reset');
    const proceedBtn = this.stageRoot.querySelector('#manga-btn-proceed');
    const indicator = this.stageRoot.querySelector('#manga-step-indicator');
    const matrixCells = this.stageRoot.querySelectorAll('.matrix-cell');

    // Update Top indicator
    if (indicator) {
      if (count >= total) {
        indicator.textContent = `ALL 6 BLOCKS REVEALED`;
        indicator.classList.add('completed');
      } else {
        indicator.textContent = `BLOCK ${count} / ${total} REVEALED`;
        indicator.classList.remove('completed');
      }
    }

    // Update Mini Matrix cells
    matrixCells.forEach((cell, idx) => {
      if (idx < count) {
        cell.classList.add('active');
      } else {
        cell.classList.remove('active');
      }
    });

    // PREV button: disabled at first block (count === 1)
    if (prevBtn) {
      prevBtn.disabled = count <= 1;
    }

    // RESET button: disabled at first block
    if (resetBtn) {
      resetBtn.disabled = count <= 1;
    }

    // NEXT button: disabled at final block (count === 6)
    if (nextBtn) {
      if (count >= total) {
        nextBtn.disabled = true;
        nextBtn.innerHTML = `FINAL BLOCK [ 6 / 6 ]`;
        nextBtn.classList.remove('primary');
      } else {
        nextBtn.disabled = false;
        nextBtn.innerHTML = `NEXT [ ${count + 1} / ${total} ] →`;
        nextBtn.classList.add('primary');
      }
    }

    // ENTER CASE / Proceed button visibility at final block
    if (proceedBtn) {
      proceedBtn.style.display = count >= total ? 'inline-flex' : 'none';
    }

    // Play special sound cues at specific blocks
    if (count === 6) {
      sound.playStamp();
    } else if (count === 4) {
      sound.playDiscovery();
    }
  }

  setupKeyboardNavigation() {
    this.cleanupKeyboardNavigation();

    this.keyHandler = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.handlePrev();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        this.handleReset();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.closeMangaPresentation();
      }
    };

    window.addEventListener('keydown', this.keyHandler);
  }

  cleanupKeyboardNavigation() {
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
  }

  closeMangaPresentation() {
    this.cleanupKeyboardNavigation();

    if (!this.stageRoot) {
      if (typeof this.onCompleteCallback === 'function') this.onCompleteCallback();
      return;
    }

    sound.playStamp();
    this.stageRoot.classList.add('page-turn-exit');

    setTimeout(() => {
      if (this.stageRoot && this.stageRoot.parentElement) {
        this.stageRoot.parentElement.removeChild(this.stageRoot);
      }
      this.stageRoot = null;
      if (typeof this.onCompleteCallback === 'function') {
        this.onCompleteCallback();
      }
    }, 280);
  }
}

export const storyController = new StoryController();

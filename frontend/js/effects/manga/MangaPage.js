/**
 * MangaPage - Fixed 2x3 Manga Grid Component
 * STRICT COMPLIANCE:
 * - Fixed 2x3 grid containing 6 storyline blocks (2 columns x 3 rows)
 * - Grid structure exists from the beginning and NEVER shifts or rearranges
 * - Initial state: Block 1 visible, Blocks 2-6 hidden
 * - Progressive reveal: 1 -> 2 -> 3 -> 4 -> 5 -> 6
 * - Previously revealed blocks remain visible in their original positions
 * - Displays the provided manga scene artwork directly
 */
export class MangaPage {
  /**
   * @param {Object} mangaData { caseId, header, fullPage, panels: string[6], title }
   * @param {Object} options { onReveal: (count, total) => void }
   */
  constructor(mangaData, options = {}) {
    this.mangaData = mangaData;
    this.options = options;
    this.revealedCount = 1; // Block 1 visible initially
    this.totalBlocks = 6;
    this.blockElements = [];
    this.domElement = null;
  }

  render() {
    const pageWrapper = document.createElement('div');
    pageWrapper.className = 'manga-sheet-wrapper';

    // Optional Manga Title Header Banner if present
    if (this.mangaData.header) {
      const headerEl = document.createElement('div');
      headerEl.className = 'manga-sheet-header';
      headerEl.innerHTML = `
        <img 
          src="${this.mangaData.header}" 
          alt="${this.mangaData.title || 'Manga Scene'}" 
          class="manga-sheet-header-img"
          onerror="this.parentElement.style.display='none'"
        />
      `;
      pageWrapper.appendChild(headerEl);
    }

    // Fixed 2x3 Grid Container (2 columns x 3 rows)
    const grid = document.createElement('div');
    grid.className = 'manga-grid-2x3';
    grid.setAttribute('role', 'region');
    grid.setAttribute('aria-label', '2x3 Manga Storyline Grid');

    this.blockElements = [];

    // Create exactly 6 storyline blocks in fixed 2x3 slots
    for (let i = 0; i < this.totalBlocks; i++) {
      const blockIndex = i + 1;
      const block = document.createElement('div');
      block.className = `manga-grid-block manga-block-${blockIndex}`;
      block.setAttribute('data-block', String(blockIndex));

      // Initial state: Block 1 visible (revealed), Blocks 2-6 hidden
      const isInitiallyRevealed = i === 0;
      if (isInitiallyRevealed) {
        block.classList.add('revealed', 'active-revealed');
      } else {
        block.classList.add('hidden');
      }

      const imageSrc = this.mangaData.panels?.[i] || '';

      block.innerHTML = `
        <!-- Unrevealed placeholder frame (visible when block is hidden) -->
        <div class="manga-block-placeholder" aria-hidden="true">
          <div class="manga-placeholder-box">
            <span class="manga-placeholder-symbol">[ ]</span>
            <span class="manga-placeholder-number">BLOCK ${blockIndex}</span>
          </div>
        </div>

        <!-- Provided Manga Scene Image -->
        <img 
          src="${imageSrc}" 
          alt="Scene Block ${blockIndex}" 
          class="manga-block-img" 
          loading="eager"
        />

        <!-- Panel Frame Border Overlay -->
        <div class="manga-block-border-rim" aria-hidden="true"></div>
      `;

      // Allow clicking an unrevealed block or next block directly
      block.addEventListener('click', () => {
        if (i === this.revealedCount) {
          this.revealNext();
        }
      });

      grid.appendChild(block);
      this.blockElements.push(block);
    }

    pageWrapper.appendChild(grid);
    this.domElement = pageWrapper;
    return pageWrapper;
  }

  /**
   * Reveal ONLY the next block (e.g. 1 -> 2 -> 3 -> 4 -> 5 -> 6)
   * Previously revealed blocks remain visible in their original positions.
   */
  revealNext() {
    if (this.revealedCount >= this.totalBlocks) return this.revealedCount;

    const targetIndex = this.revealedCount; // 0-indexed for the next block
    const blockEl = this.blockElements[targetIndex];

    if (blockEl) {
      blockEl.classList.remove('hidden');
      blockEl.classList.add('revealed', 'active-revealed', 'just-revealed');

      // Clear previous active focus highlight
      this.blockElements.forEach((b, idx) => {
        if (idx !== targetIndex) b.classList.remove('active-revealed');
      });

      setTimeout(() => {
        blockEl.classList.remove('just-revealed');
      }, 500);
    }

    this.revealedCount++;

    if (typeof this.options.onReveal === 'function') {
      this.options.onReveal(this.revealedCount, this.totalBlocks);
    }

    return this.revealedCount;
  }

  /**
   * Hide only the most recently revealed block while keeping earlier blocks visible.
   */
  revealPrev() {
    if (this.revealedCount <= 1) return this.revealedCount;

    const targetIndex = this.revealedCount - 1; // 0-indexed for the most recently revealed
    const blockEl = this.blockElements[targetIndex];

    if (blockEl) {
      blockEl.classList.remove('revealed', 'active-revealed');
      blockEl.classList.add('hidden');
    }

    this.revealedCount--;

    // Set active highlight on the previous block (now the latest visible)
    const prevBlock = this.blockElements[this.revealedCount - 1];
    if (prevBlock) {
      prevBlock.classList.add('active-revealed');
    }

    if (typeof this.options.onReveal === 'function') {
      this.options.onReveal(this.revealedCount, this.totalBlocks);
    }

    return this.revealedCount;
  }

  /**
   * RESET returns to Block 1 only.
   * Blocks 2-6 become hidden; Block 1 remains visible in its original position.
   */
  reset() {
    for (let i = 1; i < this.totalBlocks; i++) {
      const blockEl = this.blockElements[i];
      if (blockEl) {
        blockEl.classList.remove('revealed', 'active-revealed');
        blockEl.classList.add('hidden');
      }
    }

    // Ensure Block 1 is visible and active
    const block1 = this.blockElements[0];
    if (block1) {
      block1.classList.remove('hidden');
      block1.classList.add('revealed', 'active-revealed');
    }

    this.revealedCount = 1;

    if (typeof this.options.onReveal === 'function') {
      this.options.onReveal(this.revealedCount, this.totalBlocks);
    }

    return this.revealedCount;
  }

  isFinal() {
    return this.revealedCount >= this.totalBlocks;
  }

  isFirst() {
    return this.revealedCount <= 1;
  }

  getCount() {
    return this.revealedCount;
  }

  getTotal() {
    return this.totalBlocks;
  }
}

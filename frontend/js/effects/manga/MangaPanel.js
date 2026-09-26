/**
 * MangaPanel - Individual Panel Frame Component
 * Represents a discrete panel in the interactive manga layout.
 * Supports:
 * - Ink borders, corner tags, speed lines, halftone dot overlays
 * - Reading-beat focus and dimming states
 * - Discovery flash highlights and camera zoom/parallax
 */
export class MangaPanel {
  constructor(options = {}) {
    this.id = options.id || `panel-${Math.random().toString(36).substr(2, 9)}`;
    this.className = options.className || '';
    this.tagText = options.tagText || '';
    this.tagColor = options.tagColor || ''; // 'red', 'cyan', or default
    this.speedlines = options.speedlines || false; // boolean or 'intense'
    this.contentHtml = options.contentHtml || '';
    this.onClick = options.onClick || null;
    this.domElement = null;
  }

  render() {
    const el = document.createElement('div');
    el.id = this.id;
    el.className = `manga-panel ${this.className} ink-reveal`;

    let tagHtml = '';
    if (this.tagText) {
      tagHtml = `<div class="panel-tag-badge ${this.tagColor}">${this.tagText}</div>`;
    }

    let speedlinesHtml = '';
    if (this.speedlines) {
      speedlinesHtml = `<div class="manga-speedlines ${this.speedlines === 'intense' ? 'intense' : ''}" aria-hidden="true"></div>`;
    }

    el.innerHTML = `
      ${tagHtml}
      ${speedlinesHtml}
      ${this.contentHtml}
    `;

    if (typeof this.onClick === 'function') {
      el.addEventListener('click', (e) => {
        this.onClick(e, this);
      });
    }

    this.domElement = el;
    return el;
  }

  setActive(isActive) {
    if (!this.domElement) return;
    if (isActive) {
      this.domElement.classList.add('panel-beat-active');
      this.domElement.classList.remove('panel-dimmed');
    } else {
      this.domElement.classList.remove('panel-beat-active');
    }
  }

  setDimmed(isDimmed) {
    if (!this.domElement) return;
    if (isDimmed) {
      this.domElement.classList.add('panel-dimmed');
    } else {
      this.domElement.classList.remove('panel-dimmed');
    }
  }

  triggerDiscoveryFlash() {
    if (!this.domElement) return;
    const flash = document.createElement('div');
    flash.className = 'manga-discovery-flash';
    this.domElement.appendChild(flash);
    setTimeout(() => flash.remove(), 700);
  }

  setContent(html) {
    this.contentHtml = html;
    if (this.domElement) {
      this.domElement.innerHTML = `
        ${this.tagText ? `<div class="panel-tag-badge ${this.tagColor}">${this.tagText}</div>` : ''}
        ${this.speedlines ? `<div class="manga-speedlines" aria-hidden="true"></div>` : ''}
        ${html}
      `;
    }
  }
}

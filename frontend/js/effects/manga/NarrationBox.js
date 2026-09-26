/**
 * NarrationBox - Manga Archival Noir Narration Box Component
 * Displays case background exposition and investigation directives.
 */
export class NarrationBox {
  constructor(text = '', options = {}) {
    this.text = text;
    this.options = options;
    this.domElement = null;
    this.typewriterInterval = null;
  }

  render() {
    const el = document.createElement('div');
    el.className = `manga-narration-box ${this.options.className || ''}`;

    el.innerHTML = `
      <span class="narration-quote-mark">“</span>
      <p class="narration-text">
        <span class="narration-text-content">${this.text}</span>
      </p>
    `;

    this.domElement = el;
    return el;
  }

  startTypewriter(speed = 15, onComplete = null) {
    if (!this.domElement) return;
    const target = this.domElement.querySelector('.narration-text-content');
    if (!target) return;

    if (this.typewriterInterval) clearInterval(this.typewriterInterval);

    const fullText = this.text;
    target.textContent = '';
    let index = 0;

    this.typewriterInterval = setInterval(() => {
      if (index < fullText.length) {
        target.textContent += fullText[index];
        index++;
      } else {
        clearInterval(this.typewriterInterval);
        this.typewriterInterval = null;
        if (typeof onComplete === 'function') onComplete();
      }
    }, speed);
  }
}

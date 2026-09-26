/**
 * SpeechBubble - Manga Dialogue Presentation Component
 * Supports:
 * - Speech bubbles (with directional tail pointer)
 * - Shout / exclamation bubbles (spiked jagged comic burst outline)
 * - Thought bubbles (cloud / dashed outline with circular trail dots)
 * - Typewriter text animation with fast-forward on click
 */
export class SpeechBubble {
  constructor(options = {}) {
    this.type = options.type || 'speech'; // 'speech', 'shout', 'thought'
    this.tail = options.tail || 'left'; // 'left', 'right', 'none'
    this.text = options.text || '';
    this.speaker = options.speaker || '';
    this.domElement = null;
    this.typewriterInterval = null;
    this.isTyping = false;
  }

  static formatQuote(text) {
    if (!text) return '“...”';
    let clean = String(text).replace(/^["'“]|["'”]$/g, '').trim();
    if (clean.length > 90) {
      clean = clean.slice(0, 87).trim() + '...';
    }
    return `“${clean}”`;
  }

  render() {
    const el = document.createElement('div');
    el.className = 'manga-bubble-container';

    let typeClass = '';
    if (this.type === 'shout') typeClass = 'bubble-shout';
    else if (this.type === 'thought') typeClass = 'bubble-thought';

    let tailClass = '';
    if (this.type !== 'thought' && this.tail !== 'none') {
      tailClass = `tail-${this.tail}`;
    }

    el.innerHTML = `
      <div class="manga-bubble ${typeClass} ${tailClass}">
        ${this.speaker ? `<div style="font-family: var(--font-mono); font-size: 0.65rem; color: #777; text-transform: uppercase; margin-bottom: 2px;">${this.speaker}:</div>` : ''}
        <p class="manga-bubble-text">
          <span class="bubble-text-content"></span><span class="typewriter-cursor"></span>
        </p>
      </div>
    `;

    // Fast-forward on click
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.fastForward();
    });

    this.domElement = el;
    return el;
  }

  startTypewriter(speed = 18, onComplete = null) {
    if (!this.domElement) return;
    const textTarget = this.domElement.querySelector('.bubble-text-content');
    const cursor = this.domElement.querySelector('.typewriter-cursor');
    if (!textTarget) return;

    if (this.typewriterInterval) clearInterval(this.typewriterInterval);

    const fullText = SpeechBubble.formatQuote(this.text);
    let index = 0;
    this.isTyping = true;
    textTarget.textContent = '';
    if (cursor) cursor.style.display = 'inline-block';

    this.typewriterInterval = setInterval(() => {
      if (index < fullText.length) {
        textTarget.textContent += fullText[index];
        index++;
      } else {
        this.finishTypewriter(onComplete);
      }
    }, speed);
  }

  fastForward() {
    if (!this.isTyping) return;
    const textTarget = this.domElement?.querySelector('.bubble-text-content');
    if (textTarget) {
      textTarget.textContent = SpeechBubble.formatQuote(this.text);
    }
    this.finishTypewriter();
  }

  finishTypewriter(callback = null) {
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
    this.typewriterInterval = null;
    this.isTyping = false;
    const cursor = this.domElement?.querySelector('.typewriter-cursor');
    if (cursor) cursor.style.display = 'none';
    if (typeof callback === 'function') callback();
  }
}

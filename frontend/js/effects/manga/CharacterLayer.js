/**
 * CharacterLayer - Manga Character Visual Presentation Component
 * Handles rendering characters in panels with:
 * - Dynamic noir expressions (calm, shocked, defensive, sweating, accusing)
 * - Close-up / bust / reaction shot compositions
 * - Role metadata and noir badge tags
 */
export class CharacterLayer {
  static getAvatarIcon(role = '') {
    const r = role.toLowerCase();
    if (r.includes('admin') || r.includes('director') || r.includes('executive') || r.includes('manager')) return '💼';
    if (r.includes('security') || r.includes('officer') || r.includes('guard')) return '🛡️';
    if (r.includes('doctor') || r.includes('scientist') || r.includes('researcher') || r.includes('biologist')) return '🔬';
    if (r.includes('student') || r.includes('intern')) return '🎓';
    if (r.includes('engineer') || r.includes('technician')) return '⚙️';
    if (r.includes('analyst') || r.includes('auditor')) return '📊';
    return '👤';
  }

  static render(character, options = {}) {
    const name = character?.name || 'Unknown Subject';
    const role = character?.occupation || character?.role || 'Person of Interest';
    const expression = options.expression || 'calm'; // 'calm', 'shocked', 'defensive', 'sweating', 'accusing'
    const pose = options.pose || 'bust'; // 'bust', 'closeup', 'reaction'
    const avatar = options.avatar || CharacterLayer.getAvatarIcon(role);
    const showFooter = options.showFooter !== false;

    // Resolve hand-drawn manga sketch asset
    let image = options.image || character?.image;
    if (!image) {
      const r = (role || '').toLowerCase();
      if (r.includes('admin') || r.includes('director') || r.includes('executive') || r.includes('manager')) {
        image = 'assets/manga/suspect_admin.jpg';
      } else if (r.includes('student') || r.includes('intern') || r.includes('researcher') || r.includes('witness')) {
        image = 'assets/manga/suspect_student.jpg';
      } else {
        image = 'assets/manga/detective_sketch.jpg';
      }
    }

    let expressionBadge = '';
    let expressionOverlay = '';

    if (expression === 'shocked') {
      expressionBadge = `<span class="character-expression-sweat" title="Agitated / Shocked">⚡</span>`;
      expressionOverlay = `
        <div style="position: absolute; top: 12px; right: 14px; z-index: 10; color: var(--blood-red-bright); font-weight: bold; font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 1.5px; background: rgba(0,0,0,0.85); padding: 2px 8px; border: 1px solid var(--blood-red);">
          [ PULSE SPIKE // SHOCK ]
        </div>
      `;
    } else if (expression === 'sweating' || expression === 'defensive') {
      expressionBadge = `<span class="character-expression-sweat" title="Defensive / Under Pressure">💧</span>`;
      expressionOverlay = `
        <div style="position: absolute; top: 12px; right: 14px; z-index: 10; color: #f59e0b; font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 1.5px; background: rgba(0,0,0,0.85); padding: 2px 8px; border: 1px solid #d97706;">
          [ DEFENSIVE RECOIL ]
        </div>
      `;
    }

    return `
      <div class="character-art-stage ${pose}">
        ${image ? `
          <img src="${image}" class="character-sketch-img" alt="${name}" />
          <div class="character-sketch-overlay"></div>
        ` : `
          <div class="character-bust-canvas">
            <div class="character-avatar-noir">
              ${avatar}
              ${expressionBadge}
            </div>
          </div>
        `}
        ${expressionOverlay}

        ${showFooter ? `
          <div class="character-panel-footer">
            <h3 class="character-panel-name">${name}</h3>
            <div class="character-panel-role">${role}</div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

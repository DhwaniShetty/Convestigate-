/**
 * EvidencePanel - Evidence / Document / CCTV / Phone Inset Panel Component
 * Displays forensic exhibits inside manga panels with authentic aesthetic overlays.
 */
export class EvidencePanel {
  static render(evidence, options = {}) {
    const ev = evidence || {
      id: 'E01',
      name: 'Forensic Exhibit',
      type: 'Record',
      clue: 'Critical anomaly detected in chain of custody logs.',
      status: 'VERIFIED LOG'
    };

    const typeLower = (ev.type || '').toLowerCase();
    const nameLower = (ev.name || '').toLowerCase();
    const isPhone = typeLower.includes('phone') || typeLower.includes('cell') || nameLower.includes('call') || nameLower.includes('telemetry') || nameLower.includes('sms');
    const time = options.time || '22:18';

    if (isPhone) {
      return `
        <div class="phone-evidence-body">
          <div class="phone-bar-top">
            <span>📶 5G SECURE</span>
            <span>NODE [${time}]</span>
            <span>🔋 74%</span>
          </div>

          <div style="margin: auto 0;">
            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: #93c5fd; letter-spacing: 1px; font-weight: bold; margin-bottom: 4px;">
              📱 ${ev.name} // ${ev.id}
            </div>
            <div class="phone-sms-bubble">
              <p class="phone-sms-text">${ev.clue || ev.description || 'Abrupt signal disruption recorded at carrier node.'}</p>
            </div>
          </div>

          <div style="font-family: var(--font-mono); font-size: 0.65rem; color: #38bdf8; letter-spacing: 1px;">
            ✓ TOWER PING VERIFIED // ARCHIVE SEALED
          </div>
        </div>
      `;
    }

    // Default CCTV / Access Log / Forensic Document exhibit
    return `
      <div class="cctv-evidence-body">
        <div class="cctv-scanlines-fx" aria-hidden="true"></div>

        <div class="cctv-header">
          <div>
            <span class="cctv-rec-dot"></span>
            <span>CCTV TELEMETRY // ${ev.id}</span>
          </div>
          <div>REC [${time}]</div>
        </div>

        <div style="margin: auto 0; position: relative; z-index: 10;">
          <h4 class="cctv-clue-title">${ev.name}</h4>
          <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--blood-red-bright); text-transform: uppercase; letter-spacing: 1px;">
            ${ev.type || 'EXHIBIT'}
          </span>
          <p class="cctv-clue-desc">${ev.clue || ev.description || 'Physical evidence integrity audited.'}</p>
        </div>

        <div class="cctv-status-footer" style="position: relative; z-index: 10;">
          ✓ ${ev.status === 'unlocked' ? 'CHAIN OF CUSTODY VERIFIED' : 'LOGGED IN EVIDENCE VAULT'}
        </div>
      </div>
    `;
  }
}

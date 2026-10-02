import { gameState } from '../state/gameState.js?v=13';

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

export function renderResultsScreen(container) {
  const state = gameState.getState();
  const result = state.results;
  const title = escapeHTML(state.currentCase?.title || 'Investigation');
  if (!result) {
    container.innerHTML = `<section class="results-banner"><h1>${title}</h1><p>No verdict has been submitted yet.</p></section>`;
    return;
  }

  if (result.expired) {
    container.innerHTML = `
      <section class="results-banner" aria-live="assertive">
        <span class="stamp stamp-red">CASE CLOSED</span>
        <h1>${title}</h1>
        <h2>TIME EXPIRED</h2>
        <p>The 15-minute investigation window ended. You are out of time; this case cannot be continued.</p>
      </section>
    `;
    return;
  }

  container.innerHTML = `
    <section class="results-banner" aria-live="polite">
      <span class="stamp stamp-red">INVESTIGATION COMPLETE</span>
      <h1>${title}</h1>
      <h2>VERDICT: ${escapeHTML(result.hypothesisResult || 'NOT ESTABLISHED')}</h2>
      <p>${escapeHTML(result.hypothesisStatement || result.feedback || '')}</p>
      <p>PUZZLES VERIFIED: ${Number(result.puzzlesSolved) || 0} / 5</p>
    </section>
  `;
}

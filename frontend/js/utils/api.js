// Local development runs FastAPI on port 8000. A deployment can set
// window.CONVESTIGATE_API_URL before app.js loads to point at its API host.
export const API_BASE_URL = (
  globalThis.CONVESTIGATE_API_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '');

async function request(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      ...(body === undefined ? {} : {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    });
  } catch (error) {
    throw new Error(
      `Cannot reach the Convestigate API at ${API_BASE_URL}. Start the backend with "uvicorn src.api.main:app --reload".`,
      { cause: error }
    );
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const detail = Array.isArray(error.detail)
      ? error.detail.map(item => item.msg).join(', ')
      : error.detail;
    const apiError = new Error(detail || `The API could not complete the request (${response.status}).`);
    apiError.status = response.status;
    if (response.status === 410 && error.expired) apiError.code = 'CASE_EXPIRED';
    throw apiError;
  }
  return response.json();
}

const sessionPath = sessionId => `/sessions/${encodeURIComponent(sessionId)}`;

export function createSession(caseId, playerCount, username) {
  return request('/sessions', {
    method: 'POST',
    body: { case_id: caseId, player_count: playerCount, username }
  });
}

export function getSessionState(sessionId) {
  return request(sessionPath(sessionId));
}

export function submitTimelinePuzzle(sessionId, order) {
  return request(`${sessionPath(sessionId)}/puzzles/timeline`, { method: 'POST', body: { order } });
}

export function submitEmploymentPuzzle(sessionId, employmentVerified, transferVerified) {
  return request(`${sessionPath(sessionId)}/puzzles/employment`, {
    method: 'POST', body: { employment_verified: employmentVerified, transfer_verified: transferVerified }
  });
}

export function submitConnectionPuzzle(sessionId, caseId, connections) {
  return request(`${sessionPath(sessionId)}/puzzles/connection`, {
    method: 'POST', body: { case_id: caseId, connections }
  });
}

export function submitWitnessPuzzle(sessionId, caseId, unreliableWitness, significance, limitation) {
  return request(`${sessionPath(sessionId)}/puzzles/contradictory`, {
    method: 'POST', body: {
      case_id: caseId,
      unreliable_witness: unreliableWitness,
      significance,
      limitation
    }
  });
}

export function submitMissingRecordPuzzle(sessionId, caseId, missingRecord, location, credentialUse, avoidsDirectAccusation) {
  return request(`${sessionPath(sessionId)}/puzzles/missing-record`, {
    method: 'POST', body: {
      case_id: caseId,
      missing_record: missingRecord,
      location,
      credential_use: credentialUse,
      avoids_direct_accusation: avoidsDirectAccusation
    }
  });
}

export function submitDynamicPuzzle(sessionId, endpoint, payload) {
  return request(`${sessionPath(sessionId)}/puzzles/${endpoint}`, { method: 'POST', body: payload });
}

export function sendAIMessage(sessionId, message) {
  if (!sessionId) throw new Error('Start an investigation before contacting the AI.');
  return request(`${sessionPath(sessionId)}/ai`, { method: 'POST', body: { message } });
}

export function requestHint(sessionId, puzzleId) {
  if (!sessionId) throw new Error('Start an investigation before requesting a hint.');
  return request(`${sessionPath(sessionId)}/hint`, { method: 'POST', body: { puzzle_id: puzzleId } });
}

export function submitFinalReasoning(sessionId, hypothesisId, reasoning) {
  if (!sessionId) throw new Error('Start an investigation before submitting your conclusion.');
  return request(`${sessionPath(sessionId)}/final-reasoning`, {
    method: 'POST', body: { hypothesis_id: hypothesisId, reasoning }
  });
}

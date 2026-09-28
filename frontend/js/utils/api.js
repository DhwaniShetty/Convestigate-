const API_BASE_URL = window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8000'
  : 'https://convestigate-1.onrender.com';

export async function createSession(caseId, playerCount, username) {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      case_id: caseId,
      player_count: playerCount,
      username: username
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to create session');
  }

  return await response.json();
}

export async function getSessionState(sessionId) {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to get session state');
  }

  return await response.json();
}

export async function submitTimelinePuzzle(sessionId, order) {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/puzzles/timeline`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order: order
      })
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to submit timeline puzzle');
  }

  return await response.json();
}

export async function submitEmploymentPuzzle(
  sessionId,
  employmentVerified,
  transferVerified
) {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/puzzles/employment`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        employment_verified: employmentVerified,
        transfer_verified: transferVerified
      })
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || 'Failed to submit employment puzzle'
    );
  }

  return await response.json();
}

export async function submitConnectionPuzzle(sessionId, caseId, connections) {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/puzzles/connection`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        case_id: caseId,
        connections: connections
      })
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || 'Failed to submit connection puzzle'
    );
  }

  return await response.json();
}

export async function submitWitnessPuzzle(
  sessionId,
  caseId,
  unreliableWitness,
  significance,
  limitation
) {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/puzzles/contradictory`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        case_id: caseId,
        unreliable_witness: unreliableWitness,
        significance: significance,
        limitation: limitation
      })
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || 'Failed to submit witness puzzle'
    );
  }

  return await response.json();
}

export async function submitMissingRecordPuzzle(
  sessionId,
  caseId,
  missingRecord,
  location,
  credentialUse,
  avoidsDirectAccusation
) {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/puzzles/missing-record`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        case_id: caseId,
        missing_record: missingRecord,
        location: location,
        credential_use: credentialUse,
        avoids_direct_accusation: avoidsDirectAccusation
      })
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.detail || 'Failed to submit missing record puzzle'
    );
  }

  return await response.json();
}


export async function submitDynamicPuzzle(sessionId, endpoint, payload) {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/puzzles/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to submit puzzle");
  }
  return await response.json();
}


// The backend owns AI access and verdict evaluation; only session-scoped data is sent.
async function requestJSON(path, payload) {
  let response;
  try {
    response = await fetch(API_BASE_URL + path, payload === undefined ? {} : {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    throw new Error('Cannot reach the investigation server. Check the connection and try again.');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.detail;
    throw new Error(typeof detail === 'string' ? detail :
      Array.isArray(detail) ? detail.map(item => item.msg).join('; ') :
      'The server could not complete the request. Please try again.');
  }
  if (!data) throw new Error('The server returned an invalid response.');
  return data;
}

function sessionPath(sessionId, action) {
  if (!sessionId) throw new Error('Start an investigation before contacting the advisor.');
  return `/sessions/${encodeURIComponent(sessionId)}/${action}`;
}

export function sendAIMessage(sessionId, message) {
  return requestJSON(sessionPath(sessionId, 'ai'), { message });
}

export function requestHint(sessionId, puzzleId) {
  return requestJSON(sessionPath(sessionId, 'hint'), { puzzle_id: puzzleId });
}

export function submitFinalReasoning(sessionId, hypothesisId, reasoning) {
  return requestJSON(sessionPath(sessionId, 'final-reasoning'), {
    hypothesis_id: hypothesisId, reasoning
  });
}

export function getCases() {
  return requestJSON('/cases');
}

export function inspectEvidence(sessionId, evidenceId) {
  return requestJSON(sessionPath(sessionId, 'evidence/' + encodeURIComponent(evidenceId)), {});
}

export function getCaseDetails(caseId) {
  return requestJSON(`/cases/${encodeURIComponent(caseId)}`);
}

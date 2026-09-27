const API_BASE_URL = 'http://127.0.0.1:8000';

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


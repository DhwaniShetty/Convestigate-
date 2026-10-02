import json
import ssl
from pathlib import Path

import pytest
from test_integration import client
from smoke_test_75_puzzles import generate_payload, load_schemas
from src.case.case_loader import load_case

CASE_IDS = [f'{i:03d}' for i in range(1, 16)]


def answers(case_id):
    case = load_case(case_id)
    schemas = load_schemas()[case_id]
    for puzzle in case.puzzles:
        info = schemas[puzzle['id']]
        info['original_data'] = puzzle
        yield puzzle, info['endpoint'], {**generate_payload(info, case.timeline), 'case_id': case_id}


@pytest.mark.parametrize('case_id', CASE_IDS)
def test_canonical_catalogue(client, case_id):
    records = client.get('/cases').json()
    assert [c['case_id'] for c in records] == CASE_IDS
    public = next(c for c in records if c['case_id'] == case_id)
    source = json.loads(Path(f'data/case_{case_id}.json').read_text(encoding='utf-8'))
    for key in ('title', 'victim', 'suspects', 'timeline', 'puzzles', 'evidence', 'genre', 'difficulty', 'status'):
        assert public[key] == source[key]
    assert [p['id'] for p in public['puzzles']] == ['P01', 'P02', 'P03', 'P04', 'P05']
    assert public['hypotheses'] == [{'id': h['id'], 'statement': h['statement']} for h in source['hypotheses']]


@pytest.mark.parametrize('case_id', CASE_IDS)
def test_full_progression_evidence_and_final_gates(client, case_id):
    from src.api.main import sessions
    from src.database.db import get_connection
    created = client.post('/sessions', json={'case_id': case_id}).json()
    sid = created['session_id']
    session = sessions[sid]
    case = load_case(case_id)
    final = {'hypothesis_id': case.hypotheses[0]['id'], 'reasoning': 'Case-specific evidence reconstruction.'}
    steps = list(answers(case_id))
    # Valid answers cannot be used to skip prerequisites.
    _, endpoint, payload = steps[-1]
    assert client.post(f'/sessions/{sid}/puzzles/{endpoint}', json=payload).status_code in (400, 403)
    for count in range(6):
        if count in (0, 1, 4):
            r = client.post(f'/sessions/{sid}/final-reasoning', json=final)
            assert r.status_code == 403, r.text
            assert not session.get('final_reasoning_submitted')
            assert not session['game_state'].game_over
        if count == 5:
            break
        puzzle, endpoint, payload = steps[count]
        r = client.post(f'/sessions/{sid}/puzzles/{endpoint}', json=payload)
        assert r.status_code == 200, r.text
        assert r.json()['correct'], (case_id, puzzle['id'], r.json())
        state = client.get(f'/sessions/{sid}').json()
        assert state['case_id'] == case_id
        assert state['solved_puzzle_ids'] == [p['id'] for p in case.puzzles[:count + 1]]
    state = client.get(f'/sessions/{sid}').json()
    for eid in state['unlocked_evidence']:
        for _ in range(2):
            r = client.post(f'/sessions/{sid}/evidence/{eid}')
            assert r.status_code == 200
            assert eid in r.json()['inspected_evidence']
    with get_connection() as connection:
        count = connection.execute(
            "SELECT COUNT(*) FROM player_actions WHERE session_id=? AND action_type='inspect_evidence'",
            (session['db_session_id'],)).fetchone()[0]
    assert count == len(state['unlocked_evidence'])
    r = client.post(f'/sessions/{sid}/final-reasoning', json=final)
    assert r.status_code == 200, r.text
    assert r.json()['game_over'] and len(r.json()['solved_puzzles']) == 5
    expected = {'supported': 'SUPPORTED', 'contradicted': 'CONTRADICTED'}.get(case.hypotheses[0]['final_status'], 'NOT_ESTABLISHED')
    assert r.json()['hypothesis_result'] == expected
    assert client.post(f'/sessions/{sid}/final-reasoning', json=final).status_code == 400


def test_gemini_uses_verified_system_tls(monkeypatch):
    import src.ai.llm_integration as llm
    seen = {}
    monkeypatch.setenv('GEMINI_API_KEY', 'test-only-placeholder')
    monkeypatch.setattr(llm.genai, 'Client', lambda **kwargs: seen.update(kwargs))
    llm.LLMIntegration()
    context = seen['http_options']['client_args']['verify']
    assert isinstance(context, ssl.SSLContext)
    assert context.verify_mode == ssl.CERT_REQUIRED
    assert context.check_hostname is True

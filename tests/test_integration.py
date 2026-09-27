"""
tests/test_integration.py

Automated unit + integration tests covering:

  1. PlayerModel.get_behavior_profile() — all profiles, with and
     without solve times.
  2. AdaptiveAI state machine — all six states.
  3. AdaptiveAI.decide() — idempotency / no runaway counter inflation.
  4. AdaptiveAI.react_to_puzzle() — slug and canonical ID mapping.
  5. AdaptiveAI vanish logic.
  6. AdaptiveAI.react_to_final_reasoning().
  7. Case / case_loader — hypotheses and related_persons loading.
  8. FastAPI endpoints via TestClient — session, puzzle solves,
     hint, final-reasoning, AI chat.

Run with:
    python -m pytest tests/test_integration.py -v
"""

import pytest

# ---------------------------------------------------------------------------
# Minimal stubs to avoid importing the real Gemini client during unit tests.
# ---------------------------------------------------------------------------


class _FakeLLM:
    """Replaces LLMIntegration so tests never call Gemini."""

    def generate_response(self, prompt):
        return "Test AI response."

    def generate_structured_response(self, prompt):
        return {"result": "test"}


class _FakeAdaptiveAI:
    """AdaptiveAI with Gemini replaced by _FakeLLM."""

    def __init__(self):
        from src.ai.adaptive_ai import AdaptiveAI
        self._ai = AdaptiveAI.__new__(AdaptiveAI)
        self._ai.llm = _FakeLLM()

    def __getattr__(self, name):
        return getattr(self._ai, name)


# ---------------------------------------------------------------------------
# Shared GameState factory
# ---------------------------------------------------------------------------


def make_game_state(case_id="014"):
    from src.game.game_state import GameState
    return GameState(case_id)


# ===========================================================================
# 1. PlayerModel.get_behavior_profile()
# ===========================================================================


class TestPlayerModelBehaviorProfile:

    def _player(self):
        from src.player.player_model import PlayerModel
        return PlayerModel()

    def test_unknown_when_no_data(self):
        p = self._player()
        assert p.get_behavior_profile() == "UNKNOWN"

    def test_struggling_two_mistakes_no_times(self):
        p = self._player()
        p.record_mistake()
        p.record_mistake()
        assert p.get_behavior_profile() == "STRUGGLING"

    def test_hint_dependent_no_times(self):
        p = self._player()
        p.record_hint()
        p.record_hint()
        assert p.get_behavior_profile() == "HINT_DEPENDENT"

    def test_struggling_takes_priority_over_hint_dependent(self):
        """2+ mistakes should be STRUGGLING even if hints >= 2."""
        p = self._player()
        p.record_mistake()
        p.record_mistake()
        p.record_hint()
        p.record_hint()
        # STRUGGLING fires before HINT_DEPENDENT in the new ordering
        assert p.get_behavior_profile() == "STRUGGLING"

    def test_fast_and_accurate_with_times(self):
        p = self._player()
        p.record_solve_time(10)   # < 15 seconds
        p.record_solve_time(8)
        assert p.get_behavior_profile() == "FAST_AND_ACCURATE"

    def test_fast_but_reckless_with_times(self):
        p = self._player()
        p.record_solve_time(10)
        p.record_mistake()
        p.record_mistake()
        assert p.get_behavior_profile() == "FAST_BUT_RECKLESS"

    def test_normal_with_slow_times_no_mistakes(self):
        p = self._player()
        p.record_solve_time(60)
        assert p.get_behavior_profile() == "NORMAL"

    def test_struggling_overrides_speed_classification(self):
        """
        When mistakes >= 2 AND average_time < 15, the speed check
        fires first and returns FAST_BUT_RECKLESS, not STRUGGLING.
        """
        p = self._player()
        p.record_solve_time(5)
        p.record_mistake()
        p.record_mistake()
        # Fast + reckless takes priority because speed check is first
        assert p.get_behavior_profile() == "FAST_BUT_RECKLESS"

    def test_single_hint_no_times_stays_unknown(self):
        """One hint is not enough to be HINT_DEPENDENT."""
        p = self._player()
        p.record_hint()
        assert p.get_behavior_profile() == "UNKNOWN"


# ===========================================================================
# 2. AdaptiveAI state machine
# ===========================================================================


class TestAdaptiveAIStateMachine:

    def _ai_and_state(self):
        ai = _FakeAdaptiveAI()
        gs = make_game_state()
        return ai, gs

    def test_default_state_is_calm(self):
        ai, gs = self._ai_and_state()
        assert ai.get_state(gs) == "CALM"

    def test_comfortable_when_trust_ge_2(self):
        ai, gs = self._ai_and_state()
        gs.ai_trust = 2
        assert ai.get_state(gs) == "COMFORTABLE"

    def test_excited_when_thrill_ge_3(self):
        ai, gs = self._ai_and_state()
        gs.ai_thrill = 3
        assert ai.get_state(gs) == "EXCITED"

    def test_defensive_when_threat_ge_2(self):
        ai, gs = self._ai_and_state()
        gs.ai_threat = 2
        assert ai.get_state(gs) == "DEFENSIVE"

    def test_threatened_when_threat_ge_3(self):
        ai, gs = self._ai_and_state()
        gs.ai_threat = 3
        assert ai.get_state(gs) == "THREATENED"

    def test_panic_when_threat_ge_5(self):
        ai, gs = self._ai_and_state()
        gs.ai_threat = 5
        assert ai.get_state(gs) == "PANIC"

    def test_threat_overrides_thrill_at_3(self):
        """threat >= 3 should return THREATENED, not EXCITED."""
        ai, gs = self._ai_and_state()
        gs.ai_thrill = 5
        gs.ai_threat = 3
        assert ai.get_state(gs) == "THREATENED"

    def test_choose_action_all_states(self):
        ai, gs = self._ai_and_state()

        action_map = {
            0: "PROVIDE_NORMAL_GUIDANCE",    # CALM
        }

        # CALM
        assert ai.choose_action(gs) == "PROVIDE_NORMAL_GUIDANCE"

        # COMFORTABLE
        gs.ai_trust = 2
        assert ai.choose_action(gs) == "PROVIDE_HELPFUL_CLUE"

        # reset and check EXCITED
        gs2 = make_game_state()
        gs2.ai_thrill = 3
        assert ai.choose_action(gs2) == "PUSH_PATTERN_RECOGNITION"

        # DEFENSIVE
        gs3 = make_game_state()
        gs3.ai_threat = 2
        assert ai.choose_action(gs3) == "REDIRECT_ATTENTION"

        # THREATENED
        gs4 = make_game_state()
        gs4.ai_threat = 3
        assert ai.choose_action(gs4) == "WITHHOLD_INFORMATION"

        # PANIC
        gs5 = make_game_state()
        gs5.ai_threat = 5
        assert ai.choose_action(gs5) == "CREATE_CONFUSION"


# ===========================================================================
# 3. AdaptiveAI.decide() — idempotency
# ===========================================================================


class TestAdaptiveAIDecide:

    def _setup(self):
        ai = _FakeAdaptiveAI()
        gs = make_game_state()
        return ai, gs

    def test_struggling_increments_trust(self):
        ai, gs = self._setup()
        ai.decide("STRUGGLING", gs)
        assert gs.ai_trust == 1

    def test_second_identical_call_is_idempotent(self):
        """Calling decide() twice with same profile must not double-count."""
        ai, gs = self._setup()
        ai.decide("STRUGGLING", gs)
        ai.decide("STRUGGLING", gs)
        assert gs.ai_trust == 1  # NOT 2

    def test_hint_dependent_clamps_trust_at_zero(self):
        ai, gs = self._setup()
        gs.ai_trust = 0
        ai.decide("HINT_DEPENDENT", gs)
        assert gs.ai_trust == 0   # clamped, not -1

    def test_hint_dependent_increments_threat(self):
        ai, gs = self._setup()
        ai.decide("HINT_DEPENDENT", gs)
        assert gs.ai_threat == 1

    def test_fast_and_accurate_increments_thrill_and_threat(self):
        ai, gs = self._setup()
        ai.decide("FAST_AND_ACCURATE", gs)
        assert gs.ai_thrill == 2
        assert gs.ai_threat == 1

    def test_fast_but_reckless_increments_thrill(self):
        ai, gs = self._setup()
        ai.decide("FAST_BUT_RECKLESS", gs)
        assert gs.ai_thrill == 1

    def test_unknown_returns_normal_no_side_effects(self):
        ai, gs = self._setup()
        result = ai.decide("UNKNOWN", gs)
        assert result == "NORMAL"
        assert gs.ai_trust == 0
        assert gs.ai_threat == 0
        assert gs.ai_thrill == 0

    def test_profile_change_updates_counters_again(self):
        """A profile change after idempotency must re-apply counters."""
        ai, gs = self._setup()
        ai.decide("STRUGGLING", gs)   # trust = 1
        ai.decide("STRUGGLING", gs)   # idempotent, trust still 1
        ai.decide("HINT_DEPENDENT", gs)  # profile changed, threat += 1
        assert gs.ai_trust == 1
        assert gs.ai_threat == 1


# ===========================================================================
# 4. AdaptiveAI.react_to_puzzle() — slug and canonical ID mapping
# ===========================================================================


class TestAdaptiveAIReactToPuzzle:

    def _setup(self):
        ai = _FakeAdaptiveAI()
        gs = make_game_state()
        return ai, gs

    def test_timeline_slug_returns_calm(self):
        ai, gs = self._setup()
        result = ai.react_to_puzzle("timeline", gs)
        assert result == "CALM"
        assert gs.ai_thrill == 0
        assert gs.ai_threat == 0

    def test_p01_canonical_returns_calm(self):
        ai, gs = self._setup()
        result = ai.react_to_puzzle("P01", gs)
        assert result == "CALM"

    def test_employment_slug_increments_thrill(self):
        ai, gs = self._setup()
        result = ai.react_to_puzzle("employment", gs)
        assert result == "CURIOUS"
        assert gs.ai_thrill == 1

    def test_connection_slug_increments_thrill_and_threat(self):
        ai, gs = self._setup()
        result = ai.react_to_puzzle("connection", gs)
        assert result == "EXCITED"
        assert gs.ai_thrill == 1
        assert gs.ai_threat == 1

    def test_contradictory_slug_increments_threat(self):
        ai, gs = self._setup()
        result = ai.react_to_puzzle("contradictory", gs)
        assert result == "DEFENSIVE"
        assert gs.ai_threat == 1

    def test_missing_record_slug_increments_threat_by_two(self):
        ai, gs = self._setup()
        result = ai.react_to_puzzle("missing_record", gs)
        assert result == "THREATENED"
        assert gs.ai_threat == 2

    def test_p05_canonical_same_as_slug(self):
        ai, gs = self._setup()
        result = ai.react_to_puzzle("P05", gs)
        assert result == "THREATENED"
        assert gs.ai_threat == 2

    def test_unknown_puzzle_returns_calm(self):
        ai, gs = self._setup()
        result = ai.react_to_puzzle("UNKNOWN_PUZZLE", gs)
        assert result == "CALM"


# ===========================================================================
# 5. AdaptiveAI vanish logic
# ===========================================================================


class TestAdaptiveAIVanish:

    def test_no_vanish_below_threshold(self):
        ai = _FakeAdaptiveAI()
        gs = make_game_state()
        gs.ai_threat = 4
        result = ai.trigger_vanish(gs)
        assert result == "AI_REMAINS"
        assert gs.ai_vanished is False

    def test_vanish_at_threshold(self):
        ai = _FakeAdaptiveAI()
        gs = make_game_state()
        gs.ai_threat = 5
        result = ai.trigger_vanish(gs)
        assert result == "AI_VANISHED"
        assert gs.ai_vanished is True
        assert gs.countdown_active is True


# ===========================================================================
# 6. AdaptiveAI.react_to_final_reasoning()
# ===========================================================================


class TestAdaptiveAIFinalReasoning:

    def test_supported_increments_threat(self):
        ai = _FakeAdaptiveAI()
        gs = make_game_state()
        ai.react_to_final_reasoning("SUPPORTED", gs)
        assert gs.ai_threat == 1

    def test_contradicted_increments_threat(self):
        ai = _FakeAdaptiveAI()
        gs = make_game_state()
        ai.react_to_final_reasoning("CONTRADICTED", gs)
        assert gs.ai_threat == 1

    def test_not_established_no_change(self):
        ai = _FakeAdaptiveAI()
        gs = make_game_state()
        ai.react_to_final_reasoning("NOT_ESTABLISHED", gs)
        assert gs.ai_threat == 0

    def test_returns_new_ai_state(self):
        ai = _FakeAdaptiveAI()
        gs = make_game_state()
        gs.ai_threat = 4
        state = ai.react_to_final_reasoning("SUPPORTED", gs)
        # threat goes 4 -> 5, so state should be PANIC
        assert state == "PANIC"


# ===========================================================================
# 7. Case / case_loader
# ===========================================================================


class TestCaseLoader:

    def test_hypotheses_loaded(self):
        from src.case.case_loader import load_case
        case = load_case()
        assert len(case.hypotheses) == 5
        ids = [h["id"] for h in case.hypotheses]
        assert "H1" in ids
        assert "H4" in ids

    def test_related_persons_loaded(self):
        from src.case.case_loader import load_case
        case = load_case()
        assert len(case.related_persons) >= 1
        assert case.related_persons[0]["id"] == "601"

    def test_case_basic_fields(self):
        from src.case.case_loader import load_case
        case = load_case()
        assert case.case_id == "014"
        assert len(case.suspects) == 3
        assert len(case.puzzles) == 5


# ===========================================================================
# 8. FastAPI endpoints (TestClient — no real Gemini calls)
# ===========================================================================


@pytest.fixture()
def client(monkeypatch, tmp_path):
    """
    Return a FastAPI TestClient with Gemini patched out so tests
    don't need a live API key.
    """
    from src.database import db
    monkeypatch.setattr(db, "DATABASE_NAME", str(tmp_path / "integration.db"))
    db.create_database()
    import src.api.main as api_module
    api_module.sessions.clear()
    from src.ai import adaptive_ai as ai_module

    # Patch LLMIntegration inside adaptive_ai so AdaptiveAI()
    # uses _FakeLLM instead of the real Gemini client.
    monkeypatch.setattr(
        ai_module,
        "LLMIntegration",
        lambda: _FakeLLM()
    )

    # Also patch it inside the llm_integration module itself.
    import src.ai.llm_integration as llm_module
    monkeypatch.setattr(
        llm_module,
        "LLMIntegration",
        lambda: _FakeLLM()
    )

    from fastapi.testclient import TestClient
    return TestClient(api_module.app)


def solve_case014_until(client, sid, count):
    """Submit the frontend's structured answers in puzzle order."""
    case = client.get("/cases/014").json()
    answers = [
        ("timeline", {"order": [t["time"] for t in case["timeline"]], "solve_time": 12.0}),
        ("employment", {"employment_verified": True, "transfer_verified": True, "solve_time": 20.0}),
        ("connection", {"connections": case["puzzles"][2]["connections"]}),
        ("contradictory", {"case_id": "014", "unreliable_witness": "W02"}),
        ("missing-record", {"case_id": "014", "missing_record": "Case Assignment Log",
                            "location": "weekly assignment ledger", "credential_use": True,
                            "avoids_direct_accusation": True}),
    ]
    for endpoint, answer in answers[:count]:
        response = client.post(f"/sessions/{sid}/puzzles/{endpoint}", json=answer)
        assert response.status_code == 200, response.text
        assert response.json()["correct"] is True
    return answers


class TestAPIEndpoints:

    # ------------------------------------------------------------------
    # Session lifecycle
    # ------------------------------------------------------------------

    def test_create_session_014(self, client):
        r = client.post("/sessions", json={"case_id": "014"})
        assert r.status_code == 200
        data = r.json()
        assert "session_id" in data
        assert data["ai_state"] == "CALM"

    def test_create_session_invalid_case(self, client):
        r = client.post("/sessions", json={"case_id": "999"})
        assert r.status_code == 404

    def test_get_session(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        r = client.get(f"/sessions/{sid}")
        assert r.status_code == 200
        assert r.json()["player_behavior_profile"] == "UNKNOWN"

    def test_get_session_not_found(self, client):
        r = client.get("/sessions/does-not-exist")
        assert r.status_code == 404

    # ------------------------------------------------------------------
    # Timeline puzzle
    # ------------------------------------------------------------------

    def test_timeline_correct(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        payload = {
            "order": ["21:47", "22:03", "22:18", "22:41"],
            "solve_time": 12.0
        }
        r = client.post(
            f"/sessions/{sid}/puzzles/timeline", json=payload
        )
        assert r.status_code == 200
        data = r.json()
        assert data["correct"] is True
        assert "timeline" in data["solved_puzzles"]

    def test_timeline_incorrect_records_mistake(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        payload = {"order": ["22:41", "21:47", "22:03", "22:18"]}
        r = client.post(
            f"/sessions/{sid}/puzzles/timeline", json=payload
        )
        assert r.status_code == 200
        data = r.json()
        assert data["correct"] is False
        assert data["mistakes"] == 1

    # ------------------------------------------------------------------
    # Employment puzzle
    # ------------------------------------------------------------------

    def test_employment_correct(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        answers = solve_case014_until(client, sid, 1)

        r = client.post(
            f"/sessions/{sid}/puzzles/employment",
            json=answers[1][1]
        )
        assert r.status_code == 200
        assert r.json()["correct"] is True


    def test_employment_incorrect(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        answers = solve_case014_until(client, sid, 1)

        r = client.post(
            f"/sessions/{sid}/puzzles/employment",
            json={"employment_verified": False, "transfer_verified": False}
        )
        assert r.status_code == 200
        assert r.json()["correct"] is False


    # ------------------------------------------------------------------
    # Connection puzzle
    # ------------------------------------------------------------------

    def test_connection_correct(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        answers = solve_case014_until(client, sid, 2)

        r = client.post(
            f"/sessions/{sid}/puzzles/connection",
            json=answers[2][1]
        )
        assert r.status_code == 200
        assert r.json()["correct"] is True


    # ------------------------------------------------------------------
    # Contradictory puzzle
    # ------------------------------------------------------------------

    def test_contradictory_correct(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        answers = solve_case014_until(client, sid, 3)

        r = client.post(
            f"/sessions/{sid}/puzzles/contradictory",
            json=answers[3][1]
        )
        assert r.status_code == 200
        assert r.json()["correct"] is True


    # ------------------------------------------------------------------
    # Missing record puzzle
    # ------------------------------------------------------------------

    def test_missing_record_correct(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        answers = solve_case014_until(client, sid, 4)

        r = client.post(
            f"/sessions/{sid}/puzzles/missing-record",
            json=answers[4][1]
        )
        assert r.status_code == 200
        assert r.json()["correct"] is True


    # ------------------------------------------------------------------
    # Hint endpoint
    # ------------------------------------------------------------------

    def test_hint_increments_hints_used(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        r = client.post(f"/sessions/{sid}/hint", json={})
        assert r.status_code == 200
        assert r.json()["hints_used"] == 1

    def test_two_hints_trigger_hint_dependent(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        client.post(f"/sessions/{sid}/hint", json={})
        r = client.post(f"/sessions/{sid}/hint", json={})
        data = r.json()
        assert data["hints_used"] == 2
        assert data["player_behavior"] == "HINT_DEPENDENT"

    # ------------------------------------------------------------------
    # AI chat endpoint
    # ------------------------------------------------------------------

    def test_ai_chat_returns_response(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        r = client.post(
            f"/sessions/{sid}/ai",
            json={"message": "I found a clue."}
        )
        assert r.status_code == 200
        data = r.json()
        assert "response" in data
        assert data["response"] == "Test AI response."
        assert "ai_state" in data
        assert "player_behavior" in data

    def test_ai_chat_idempotent_on_same_behavior(self, client):
        """
        Sending multiple chat messages without changing behaviour
        should NOT keep accumulating threat/thrill.
        """
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        for _ in range(5):
            client.post(
                f"/sessions/{sid}/ai",
                json={"message": "test"}
            )

        r = client.get(f"/sessions/{sid}")
        data = r.json()
        # With UNKNOWN behavior, decide() returns NORMAL and no
        # counters are touched, so all should remain 0.
        assert data["ai_trust"] == 0
        assert data["ai_threat"] == 0
        assert data["ai_thrill"] == 0

    def test_ai_chat_blocked_after_vanish(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        # Force vanish state.
        from src.api.main import sessions
        sessions[sid]["game_state"].ai_threat = 5
        sessions[sid]["game_state"].ai_vanished = True

        r = client.post(
            f"/sessions/{sid}/ai",
            json={"message": "hello"}
        )
        assert r.status_code == 400

    # ------------------------------------------------------------------
    # Final reasoning endpoint
    # ------------------------------------------------------------------

    def test_final_reasoning_supported_hypothesis(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        # H4 has final_status == "supported"
        r = client.post(
            f"/sessions/{sid}/final-reasoning",
            json={
                "hypothesis_id": "H4",
                "reasoning": "Someone framed Daniel."
            }
        )
        assert r.status_code == 200
        data = r.json()
        assert data["hypothesis_result"] == "SUPPORTED"
        assert data["game_over"] is True

    def test_final_reasoning_contradicted_hypothesis(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        # H1 has final_status == "contradicted"
        r = client.post(
            f"/sessions/{sid}/final-reasoning",
            json={
                "hypothesis_id": "H1",
                "reasoning": "Daniel did it."
            }
        )
        assert r.status_code == 200
        data = r.json()
        assert data["hypothesis_result"] == "CONTRADICTED"
        assert data["game_over"] is True

    def test_final_reasoning_invalid_hypothesis(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        r = client.post(
            f"/sessions/{sid}/final-reasoning",
            json={"hypothesis_id": "H99", "reasoning": "test"}
        )
        assert r.status_code == 404

    def test_final_reasoning_blocks_after_game_over(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        client.post(
            f"/sessions/{sid}/final-reasoning",
            json={"hypothesis_id": "H4", "reasoning": "test"}
        )

        # Second submission should be blocked.
        r = client.post(
            f"/sessions/{sid}/final-reasoning",
            json={"hypothesis_id": "H3", "reasoning": "test"}
        )
        assert r.status_code == 400

    # ------------------------------------------------------------------
    # AI state transitions via puzzle flow
    # ------------------------------------------------------------------

    def test_puzzle_flow_updates_ai_state(self, client):
        """
        Solving P03 (connection) should raise ai_thrill and ai_threat,
        which is detectable via GET /sessions/{id}.
        """
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        answers = solve_case014_until(client, sid, 2)

        # Solve connection puzzle — react_to_puzzle("connection") should
        # add thrill+1 threat+1.
        client.post(
            f"/sessions/{sid}/puzzles/connection",
            json=answers[2][1]
        )

        r = client.get(f"/sessions/{sid}")
        data = r.json()
        assert data["ai_thrill"] >= 1
        assert data["ai_threat"] >= 1


    def test_two_mistakes_causes_struggling_behavior(self, client):
        sid = client.post(
            "/sessions", json={"case_id": "014"}
        ).json()["session_id"]

        # Submit two wrong timeline answers to rack up mistakes.
        wrong = {"order": ["22:41", "21:47", "22:03", "22:18"]}
        client.post(f"/sessions/{sid}/puzzles/timeline", json=wrong)
        client.post(f"/sessions/{sid}/puzzles/timeline", json=wrong)

        r = client.get(f"/sessions/{sid}")
        assert r.json()["player_behavior_profile"] == "STRUGGLING"

class TestMergeIntegration:
    @pytest.mark.parametrize("case_id", [f"{i:03d}" for i in range(1, 16)])
    def test_all_cases_keep_ai_session_state(self, client, case_id):
        case = client.get(f"/cases/{case_id}")
        assert case.status_code == 200
        response = client.post("/sessions", json={"case_id": case_id, "username": "integration"})
        assert response.status_code == 200
        session = response.json()
        assert session["current_puzzle"] == case.json()["puzzles"][0]["type"]
        assert session["ai_state"] == "CALM"
        assert client.get(f"/sessions/{session['session_id']}").json()["player_behavior_profile"] == "UNKNOWN"

    def test_full_case_then_final_reasoning(self, client):
        sid = client.post("/sessions", json={"case_id": "014"}).json()["session_id"]
        solve_case014_until(client, sid, 5)
        payload = {"hypothesis_id": "H4", "reasoning": "The records support this hypothesis."}
        response = client.post(f"/sessions/{sid}/final-reasoning", json=payload)
        assert response.status_code == 200
        assert response.json()["game_over"] is True
        assert client.post(f"/sessions/{sid}/final-reasoning", json=payload).status_code == 400

    def test_puzzle_prerequisite_is_preserved(self, client):
        sid = client.post("/sessions", json={"case_id": "014"}).json()["session_id"]
        response = client.post(f"/sessions/{sid}/puzzles/employment",
                               json={"employment_verified": True, "transfer_verified": True})
        assert response.status_code == 403

    def test_repeat_solution_does_not_inflate_ai(self, client):
        sid = client.post("/sessions", json={"case_id": "014"}).json()["session_id"]
        answers = solve_case014_until(client, sid, 3)
        before = client.get(f"/sessions/{sid}").json()
        client.post(f"/sessions/{sid}/puzzles/connection", json=answers[2][1])
        after = client.get(f"/sessions/{sid}").json()
        assert (before["ai_thrill"], before["ai_threat"]) == (after["ai_thrill"], after["ai_threat"])

    def test_hint_and_evidence_tracking(self, client):
        from src.database.db import get_connection
        import src.api.main as api
        sid = client.post("/sessions", json={"case_id": "014"}).json()["session_id"]
        solve_case014_until(client, sid, 1)
        session = api.sessions[sid]
        evidence_id = session["game_state"].unlocked_evidence[0]
        for _ in range(2):
            assert client.post(f"/sessions/{sid}/evidence/{evidence_id}").status_code == 200
        assert session["player"].evidence_inspected == 1
        assert client.post(f"/sessions/{sid}/hint", json={"puzzle_id": "P02"}).status_code == 200
        connection = get_connection()
        try:
            assert connection.execute("SELECT COUNT(*) FROM player_actions WHERE action_type = 'inspect_evidence'").fetchone()[0] == 1
            assert connection.execute("SELECT hints_used FROM player_behaviour").fetchone()[0] == 1
        finally:
            connection.close()

    @pytest.mark.parametrize("case_id", ["001", "003", "005"])
    def test_new_case_puzzle_updates_ai_and_database(self, client, case_id):
        from src.database.db import get_connection
        import src.api.main as api
        import json
        from pathlib import Path
        sid = client.post("/sessions", json={"case_id": case_id}).json()["session_id"]
        schemas = json.loads(Path("frontend/js/utils/puzzle_schemas.js").read_text(encoding="utf-8").replace("export const CASE_SCHEMAS = ", "").strip().rstrip(";"))
        fields = schemas[case_id]["P01"]["schema"]["fields"]
        payload = {key: field["value"] for key, field in fields.items()}
        payload["solve_time"] = 11.0
        response = client.post(f"/sessions/{sid}/puzzles/{schemas[case_id]['P01']['endpoint']}", json=payload)
        assert response.status_code == 200, response.text
        assert response.json()["correct"] is True
        assert api.sessions[sid]["player"].solve_times == [11.0]
        connection = get_connection()
        try:
            assert connection.execute("SELECT puzzles_solved FROM player_behaviour").fetchone()[0] == 1
            assert connection.execute("SELECT result, time_taken FROM puzzle_logs").fetchone() == ("success", 11.0)
        finally:
            connection.close()

    def test_ai_context_uses_selected_case(self, client, monkeypatch):
        import src.api.main as api
        sid = client.post("/sessions", json={"case_id": "001"}).json()["session_id"]
        captured = {}
        def respond(game_state, message, case_context=None):
            captured.update(case_context)
            return "Case-specific response"
        monkeypatch.setattr(api.sessions[sid]["adaptive_ai"], "generate_ai_response", respond)
        assert client.post(f"/sessions/{sid}/ai", json={"message": "What can I investigate?"}).status_code == 200
        case = client.get("/cases/001").json()
        assert captured["victim"] == case["victim"]["name"]
        assert captured["unlocked_evidence"] == []

    def test_routes_are_unique(self, client):
        import src.api.main as api
        keys = [(method, route.path) for route in api.app.routes for method in getattr(route, "methods", [])]
        assert len(keys) == len(set(keys))

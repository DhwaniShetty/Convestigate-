from uuid import uuid4

from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from src.case.case_loader import load_case

from src.game.game_state import GameState
from src.game.timeline_puzzle import TimelinePuzzle
from src.game.employment_puzzle import EmploymentPuzzle
from src.game.connection_puzzle import ConnectionPuzzle
from src.game.contradictory_puzzle import ContradictoryPuzzle
from src.game.missing_record_puzzle import MissingRecordPuzzle

from src.player.player_model import PlayerModel
from src.ai.adaptive_ai import AdaptiveAI

app = FastAPI(title="Convestigate API")


# ---------------------------------------------------------
# TEMPORARY IN-MEMORY SESSION STORAGE
# ---------------------------------------------------------

sessions = {}


# ---------------------------------------------------------
# REQUEST MODELS
# ---------------------------------------------------------

class CreateSessionRequest(BaseModel):

    case_id: str
    player_count: int = 1


class TimelineAnswer(BaseModel):

    order: list[str]
    solve_time: Optional[float] = None


class EmploymentAnswer(BaseModel):

    answer: str
    solve_time: Optional[float] = None


class ConnectionAnswer(BaseModel):

    answer: str
    solve_time: Optional[float] = None


class ContradictoryAnswer(BaseModel):

    answer: str
    solve_time: Optional[float] = None


class MissingRecordAnswer(BaseModel):

    answer: str
    solve_time: Optional[float] = None


class AIResponseRequest(BaseModel):

    message: str


class HintRequest(BaseModel):
    """Sent by the client when the player requests a hint."""

    puzzle_id: Optional[str] = None


class FinalReasoningRequest(BaseModel):
    """Hypothesis submission for final case resolution."""

    hypothesis_id: str
    reasoning: str


# ---------------------------------------------------------
# HELPER FUNCTION
# ---------------------------------------------------------

def get_session_or_404(session_id: str):

    if session_id not in sessions:

        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    return sessions[session_id]


# ---------------------------------------------------------
# HOME
# ---------------------------------------------------------

@app.get("/")
def home():

    return {
        "message": "Convestigate API is running"
    }


# ---------------------------------------------------------
# CASE API
# ---------------------------------------------------------

@app.get("/cases/{case_id}")
def get_case(case_id: str):

    if case_id != "014":

        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    case = load_case()

    return {
        "case_id": case.case_id,
        "title": case.title,
        "victim": case.victim,
        "suspects": case.suspects,
        "timeline": case.timeline,
        "evidence": case.evidence,
        "puzzles": case.puzzles
    }


# ---------------------------------------------------------
# CREATE SESSION
# ---------------------------------------------------------

@app.post("/sessions")
def create_session(request: CreateSessionRequest):

    if request.case_id != "014":

        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    if request.player_count < 1 or request.player_count > 6:

        raise HTTPException(
            status_code=400,
            detail="Player count must be between 1 and 6"
        )

    session_id = str(uuid4())

    game_state = GameState(
        request.case_id
    )

    player = PlayerModel()

    adaptive_ai = AdaptiveAI()

    sessions[session_id] = {

        "session_id": session_id,

        "case_id": request.case_id,

        "player_count": request.player_count,

        "game_state": game_state,

        "player": player,

        "adaptive_ai": adaptive_ai
    }

    return {

        "session_id": session_id,

        "case_id": request.case_id,

        "player_count": request.player_count,

        "current_puzzle": game_state.current_puzzle,

        "solved_puzzles": game_state.solved_puzzles,

        "unlocked_evidence": game_state.unlocked_evidence,

        "inspected_evidence": game_state.inspected_evidence,

        "hints_used": game_state.hints_used,

        "mistakes": game_state.mistakes,

        "ai_trust": game_state.ai_trust,

        "ai_thrill": game_state.ai_thrill,

        "ai_threat": game_state.ai_threat,

        "ai_state": adaptive_ai.get_state(game_state),

        "ai_action": adaptive_ai.choose_action(game_state),

        "ai_vanished": game_state.ai_vanished,

        "countdown_active": game_state.countdown_active,

        "game_over": game_state.game_over
    }


# ---------------------------------------------------------
# GET SESSION
# ---------------------------------------------------------

@app.get("/sessions/{session_id}")
def get_session(session_id: str):

    session = get_session_or_404(
        session_id
    )

    game_state = session["game_state"]

    player = session["player"]

    adaptive_ai = session["adaptive_ai"]

    return {

        "session_id": session["session_id"],

        "case_id": session["case_id"],

        "player_count": session["player_count"],

        "current_puzzle": game_state.current_puzzle,

        "solved_puzzles": game_state.solved_puzzles,

        "unlocked_evidence": game_state.unlocked_evidence,

        "inspected_evidence": game_state.inspected_evidence,

        "hints_used": game_state.hints_used,

        "mistakes": game_state.mistakes,

        "player_skill_level": player.get_skill_level(),

        "player_behavior_profile": player.get_behavior_profile(),

        "ai_trust": game_state.ai_trust,

        "ai_thrill": game_state.ai_thrill,

        "ai_threat": game_state.ai_threat,

        "ai_state": adaptive_ai.get_state(game_state),

        "ai_action": adaptive_ai.choose_action(game_state),

        "ai_vanished": game_state.ai_vanished,

        "countdown_active": game_state.countdown_active,

        "game_over": game_state.game_over,

        "player_observations": game_state.player_observations
    }


# ---------------------------------------------------------
# ADAPTIVE AI RESPONSE
# ---------------------------------------------------------

@app.post("/sessions/{session_id}/ai")
def get_ai_response(
    session_id: str,
    request: AIResponseRequest
):

    session = get_session_or_404(
        session_id
    )

    game_state = session["game_state"]

    adaptive_ai = session["adaptive_ai"]

    player = session["player"]

    if game_state.game_over:

        raise HTTPException(
            status_code=400,
            detail="Game is already over."
        )

    if game_state.ai_vanished:

        raise HTTPException(
            status_code=400,
            detail="The AI has vanished."
        )

    # -----------------------------------------------------
    # RECORD PLAYER INPUT
    # -----------------------------------------------------

    if request.message.strip():

        game_state.player_observations.append(
            request.message.strip()
        )

    # -----------------------------------------------------
    # DETERMINE CURRENT PLAYER BEHAVIOR
    # -----------------------------------------------------

    behavior = player.get_behavior_profile()

    # -----------------------------------------------------
    # UPDATE ADAPTIVE AI BASED ON PLAYER BEHAVIOR
    # (idempotent — counters only change on profile change)
    # -----------------------------------------------------

    adaptive_ai.decide(
        behavior,
        game_state
    )

    # -----------------------------------------------------
    # BUILD CASE CONTEXT FOR GEMINI
    # Only unlocked evidence names are included; locked
    # evidence is intentionally excluded.
    # -----------------------------------------------------

    case = load_case()

    victim_name = case.victim.get("name", "the victim")

    suspect_names = [
        s.get("name", "") for s in case.suspects
    ]

    # Map evidence IDs to names for readability.
    evidence_by_id = {
        e["id"]: e["name"] for e in case.evidence
    }

    unlocked_names = [
        evidence_by_id[eid]
        for eid in game_state.unlocked_evidence
        if eid in evidence_by_id
    ]

    case_context = {
        "victim": victim_name,
        "suspects": suspect_names,
        "unlocked_evidence": unlocked_names,
        "solved_puzzles": list(game_state.solved_puzzles),
    }

    # -----------------------------------------------------
    # GENERATE AI RESPONSE
    # -----------------------------------------------------

    response = adaptive_ai.generate_ai_response(
        game_state,
        request.message,
        case_context=case_context
    )

    # -----------------------------------------------------
    # CHECK WHETHER AI SHOULD VANISH
    # -----------------------------------------------------

    vanish_result = adaptive_ai.trigger_vanish(
        game_state
    )

    return {

        "response": response,

        "ai_state": adaptive_ai.get_state(
            game_state
        ),

        "ai_action": adaptive_ai.choose_action(
            game_state
        ),

        "ai_trust": game_state.ai_trust,

        "ai_thrill": game_state.ai_thrill,

        "ai_threat": game_state.ai_threat,

        "ai_vanished": game_state.ai_vanished,

        "countdown_active": game_state.countdown_active,

        "vanish_result": vanish_result,

        "player_behavior": behavior
    }

# ---------------------------------------------------------
# TIMELINE PUZZLE
# ---------------------------------------------------------

@app.post(
    "/sessions/{session_id}/puzzles/timeline"
)
def solve_timeline(
    session_id: str,
    answer: TimelineAnswer
):

    session = get_session_or_404(
        session_id
    )

    game_state = session["game_state"]

    player = session["player"]

    adaptive_ai = session["adaptive_ai"]

    case = load_case()

    puzzle_data = None

    for puzzle in case.puzzles:

        if puzzle.get("type") == "timeline":

            puzzle_data = puzzle

            break

    if puzzle_data is None:

        raise HTTPException(
            status_code=404,
            detail="Timeline puzzle not found"
        )

    puzzle = TimelinePuzzle(
        case.timeline,
        case.evidence,
        puzzle_data
    )

    correct = puzzle.check_answer(
        answer.order
    )

    if correct:

        if "timeline" not in game_state.solved_puzzles:

            game_state.solved_puzzles.append(
                "timeline"
            )

        # Record optional solve time for behaviour profiling.
        if answer.solve_time is not None:
            player.record_solve_time(answer.solve_time)

        # Notify the AI so it can update its emotional state.
        adaptive_ai.react_to_puzzle("timeline", game_state)

        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:

                game_state.unlocked_evidence.append(
                    evidence_id
                )

        game_state.current_puzzle = None

        return {

            "correct": True,

            "message": "Correct! Timeline reconstructed.",

            "solved_puzzles": game_state.solved_puzzles,

            "unlocked_evidence": game_state.unlocked_evidence,

            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    player.record_mistake()

    return {

        "correct": False,

        "message": "Incorrect order. Try again.",

        "mistakes": game_state.mistakes
    }


# ---------------------------------------------------------
# EMPLOYMENT PUZZLE
# ---------------------------------------------------------

@app.post(
    "/sessions/{session_id}/puzzles/employment"
)
def solve_employment(
    session_id: str,
    answer: EmploymentAnswer
):

    session = get_session_or_404(
        session_id
    )

    game_state = session["game_state"]

    player = session["player"]

    adaptive_ai = session["adaptive_ai"]

    case = load_case()

    puzzle_data = None

    for puzzle in case.puzzles:

        if puzzle.get("id") == "P02":

            puzzle_data = puzzle

            break

    if puzzle_data is None:

        raise HTTPException(
            status_code=404,
            detail="Employment puzzle not found"
        )

    puzzle = EmploymentPuzzle(
        puzzle_data
    )

    correct = puzzle.check_answer(
        answer.answer
    )

    if correct:

        if "employment" not in game_state.solved_puzzles:

            game_state.solved_puzzles.append(
                "employment"
            )

        if answer.solve_time is not None:
            player.record_solve_time(answer.solve_time)

        adaptive_ai.react_to_puzzle("employment", game_state)

        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:

                game_state.unlocked_evidence.append(
                    evidence_id
                )

        return {

            "correct": True,

            "message": "Correct! Employment history verified.",

            "solved_puzzles": game_state.solved_puzzles,

            "unlocked_evidence": game_state.unlocked_evidence,

            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    player.record_mistake()

    return {

        "correct": False,

        "message": "Incorrect verification. Try again.",

        "mistakes": game_state.mistakes
    }


# ---------------------------------------------------------
# CONNECTION PUZZLE
# ---------------------------------------------------------

@app.post(
    "/sessions/{session_id}/puzzles/connection"
)
def solve_connection(
    session_id: str,
    answer: ConnectionAnswer
):

    session = get_session_or_404(
        session_id
    )

    game_state = session["game_state"]

    player = session["player"]

    adaptive_ai = session["adaptive_ai"]

    case = load_case()

    puzzle_data = None

    for puzzle in case.puzzles:

        if puzzle.get("id") == "P03":

            puzzle_data = puzzle

            break

    if puzzle_data is None:

        raise HTTPException(
            status_code=404,
            detail="Connection puzzle not found"
        )

    puzzle = ConnectionPuzzle(
        puzzle_data
    )

    correct = puzzle.check_answer(
        answer.answer
    )

    if correct:

        if "connection" not in game_state.solved_puzzles:

            game_state.solved_puzzles.append(
                "connection"
            )

        player.record_correct_connection()

        if answer.solve_time is not None:
            player.record_solve_time(answer.solve_time)

        adaptive_ai.react_to_puzzle("connection", game_state)

        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:

                game_state.unlocked_evidence.append(
                    evidence_id
                )

        return {

            "correct": True,

            "message": "Correct! Connection established.",

            "solved_puzzles": game_state.solved_puzzles,

            "unlocked_evidence": game_state.unlocked_evidence,

            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    player.record_mistake()

    player.record_unsupported_connection()

    return {

        "correct": False,

        "message": "Incorrect connection. Try again.",

        "mistakes": game_state.mistakes
    }


# ---------------------------------------------------------
# CONTRADICTORY PUZZLE
# ---------------------------------------------------------

@app.post(
    "/sessions/{session_id}/puzzles/contradictory"
)
def solve_contradictory(
    session_id: str,
    answer: ContradictoryAnswer
):

    session = get_session_or_404(
        session_id
    )

    game_state = session["game_state"]

    player = session["player"]

    adaptive_ai = session["adaptive_ai"]

    case = load_case()

    puzzle_data = None

    for puzzle in case.puzzles:

        if puzzle.get("id") == "P04":

            puzzle_data = puzzle

            break

    if puzzle_data is None:

        raise HTTPException(
            status_code=404,
            detail="Contradictory puzzle not found"
        )

    puzzle = ContradictoryPuzzle(
        puzzle_data
    )

    correct = puzzle.check_answer(
        answer.answer
    )

    if correct:

        if "contradictory" not in game_state.solved_puzzles:

            game_state.solved_puzzles.append(
                "contradictory"
            )

        if answer.solve_time is not None:
            player.record_solve_time(answer.solve_time)

        adaptive_ai.react_to_puzzle("contradictory", game_state)

        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:

                game_state.unlocked_evidence.append(
                    evidence_id
                )

        return {

            "correct": True,

            "message": "Correct! Witness contradiction identified.",

            "solved_puzzles": game_state.solved_puzzles,

            "unlocked_evidence": game_state.unlocked_evidence,

            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    player.record_mistake()

    return {

        "correct": False,

        "message": "Incorrect analysis. Try again.",

        "mistakes": game_state.mistakes
    }


# ---------------------------------------------------------
# INSPECT EVIDENCE
# ---------------------------------------------------------

@app.post(
    "/sessions/{session_id}/evidence/{evidence_id}"
)
def inspect_evidence(
    session_id: str,
    evidence_id: str
):

    session = get_session_or_404(
        session_id
    )

    game_state = session["game_state"]

    player = session["player"]

    if evidence_id not in game_state.unlocked_evidence:

        raise HTTPException(
            status_code=403,
            detail="Evidence not unlocked"
        )

    if evidence_id not in game_state.inspected_evidence:

        game_state.inspected_evidence.append(
            evidence_id
        )

        player.record_evidence_inspection()

    return {

        "evidence_id": evidence_id,

        "message": "Evidence inspected successfully.",

        "inspected_evidence": game_state.inspected_evidence
    }


# ---------------------------------------------------------
# MISSING RECORD PUZZLE
# ---------------------------------------------------------

@app.post(
    "/sessions/{session_id}/puzzles/missing-record"
)
def solve_missing_record(
    session_id: str,
    answer: MissingRecordAnswer
):

    session = get_session_or_404(
        session_id
    )

    game_state = session["game_state"]

    player = session["player"]

    adaptive_ai = session["adaptive_ai"]

    case = load_case()

    puzzle_data = None

    for puzzle in case.puzzles:

        if puzzle.get("id") == "P05":

            puzzle_data = puzzle

            break

    if puzzle_data is None:

        raise HTTPException(
            status_code=404,
            detail="Missing record puzzle not found"
        )

    puzzle = MissingRecordPuzzle(
        puzzle_data
    )

    correct = puzzle.check_answer(
        answer.answer
    )

    if correct:

        if "missing_record" not in game_state.solved_puzzles:

            game_state.solved_puzzles.append(
                "missing_record"
            )

        if answer.solve_time is not None:
            player.record_solve_time(answer.solve_time)

        adaptive_ai.react_to_puzzle("missing_record", game_state)

        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:

                game_state.unlocked_evidence.append(
                    evidence_id
                )

        return {

            "correct": True,

            "message": "Correct! Missing record identified.",

            "solved_puzzles": game_state.solved_puzzles,

            "unlocked_evidence": game_state.unlocked_evidence,

            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    player.record_mistake()

    return {

        "correct": False,

        "message": "Incorrect investigation gap. Try again.",

        "mistakes": game_state.mistakes
    }


# ---------------------------------------------------------
# HINT
# ---------------------------------------------------------

@app.post(
    "/sessions/{session_id}/hint"
)
def request_hint(
    session_id: str,
    request: HintRequest
):
    """
    Record that the player has requested a hint.

    This increments hints_used on both GameState (for
    session-level display) and PlayerModel (so that
    get_behavior_profile() can classify the player as
    HINT_DEPENDENT once the threshold is reached).

    The endpoint also runs AdaptiveAI.decide() so that the AI
    state is updated immediately — even before the next chat
    message is sent.
    """

    session = get_session_or_404(session_id)

    game_state = session["game_state"]

    player = session["player"]

    adaptive_ai = session["adaptive_ai"]

    if game_state.game_over:

        raise HTTPException(
            status_code=400,
            detail="Game is already over."
        )

    if game_state.ai_vanished:

        raise HTTPException(
            status_code=400,
            detail="The AI has vanished."
        )

    # Record on both tracking objects.
    game_state.hints_used += 1

    player.record_hint()

    # Re-evaluate behaviour and update AI state.
    behavior = player.get_behavior_profile()

    adaptive_ai.decide(behavior, game_state)

    return {

        "hints_used": game_state.hints_used,

        "player_behavior": behavior,

        "ai_state": adaptive_ai.get_state(game_state),

        "ai_action": adaptive_ai.choose_action(game_state),

        "ai_trust": game_state.ai_trust,

        "ai_thrill": game_state.ai_thrill,

        "ai_threat": game_state.ai_threat,

        "puzzle_id": request.puzzle_id
    }


# ---------------------------------------------------------
# FINAL REASONING
# ---------------------------------------------------------

@app.post(
    "/sessions/{session_id}/final-reasoning"
)
def submit_final_reasoning(
    session_id: str,
    request: FinalReasoningRequest
):
    """
    Submit the player's final hypothesis and reasoning.

    Validates the hypothesis_id against the case's hypothesis
    list, evaluates whether it is supported/contradicted, feeds
    the result into AdaptiveAI.react_to_final_reasoning(), and
    triggers the vanish check.  Sets game_over = True.
    """

    session = get_session_or_404(session_id)

    game_state = session["game_state"]

    adaptive_ai = session["adaptive_ai"]

    if game_state.game_over:

        raise HTTPException(
            status_code=400,
            detail="Game is already over."
        )

    case = load_case()

    # Find the matching hypothesis.
    selected = None

    for hypothesis in case.hypotheses:

        if hypothesis.get("id") == request.hypothesis_id:

            selected = hypothesis

            break

    if selected is None:

        raise HTTPException(
            status_code=404,
            detail=(
                f"Hypothesis '{request.hypothesis_id}' not found. "
                f"Valid IDs: "
                f"{[h['id'] for h in case.hypotheses]}"
            )
        )

    # Evaluate the hypothesis outcome.
    final_status = selected.get("final_status", "unknown")

    if final_status == "supported":
        hypothesis_result = "SUPPORTED"

    elif final_status == "contradicted":
        hypothesis_result = "CONTRADICTED"

    else:
        hypothesis_result = "NOT_ESTABLISHED"

    # React — this may push ai_threat high enough to vanish.
    ai_final_state = adaptive_ai.react_to_final_reasoning(
        hypothesis_result,
        game_state
    )

    # Trigger vanish if threat is high enough.
    vanish_result = adaptive_ai.trigger_vanish(game_state)

    # Mark the session complete.
    game_state.game_over = True

    return {

        "hypothesis_id": selected["id"],

        "hypothesis_statement": selected.get("statement", ""),

        "player_reasoning": request.reasoning,

        "hypothesis_result": hypothesis_result,

        "ai_state": ai_final_state,

        "ai_action": adaptive_ai.choose_action(game_state),

        "ai_trust": game_state.ai_trust,

        "ai_thrill": game_state.ai_thrill,

        "ai_threat": game_state.ai_threat,

        "ai_vanished": game_state.ai_vanished,

        "countdown_active": game_state.countdown_active,

        "vanish_result": vanish_result,

        "game_over": game_state.game_over,

        "solved_puzzles": game_state.solved_puzzles
    }
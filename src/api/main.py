from uuid import uuid4

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from src.case.case_loader import load_case
from src.game.game_state import GameState
from src.game.timeline_puzzle import TimelinePuzzle
from src.game.employment_puzzle import EmploymentPuzzle
from src.game.connection_puzzle import ConnectionPuzzle
from src.game.contradictory_puzzle import ContradictoryPuzzle
from src.game.missing_record_puzzle import MissingRecordPuzzle

app = FastAPI(title="Convestigate API")

# Puzzle progression
PUZZLE_ORDER = [
    "timeline",
    "employment",
    "connection",
    "contradictory",
    "missing_record"
]

# Temporary in-memory session storage
sessions = {}

def is_puzzle_unlocked(game_state, puzzle_name):
    if puzzle_name not in PUZZLE_ORDER:
        return False

    puzzle_index = PUZZLE_ORDER.index(puzzle_name)

    # First puzzle is always available
    if puzzle_index == 0:
        return True

    previous_puzzle = PUZZLE_ORDER[puzzle_index - 1]

    return previous_puzzle in game_state.solved_puzzles

class CreateSessionRequest(BaseModel):
    case_id: str
    player_count: int = 1

class TimelineAnswer(BaseModel):
    order: list[str]

class EmploymentAnswer(BaseModel):
    employment_verified: bool
    transfer_verified: bool

class ConnectionItem(BaseModel):
    from_node: str
    to_node: str
    status: str


class ConnectionAnswer(BaseModel):
    case_id: str
    connections: list[ConnectionItem]

class ContradictoryAnswer(BaseModel):
    case_id: str
    unreliable_witness: str

class MissingRecordAnswer(BaseModel):
    case_id: str
    missing_record: str
    location: str
    credential_use: bool
    avoids_direct_accusation: bool

@app.get("/")
def home():
    return {
        "message": "Convestigate API is running"
    }


# -------------------------
# CASE API
# -------------------------

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


# -------------------------
# SESSION API
# -------------------------

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

    game_state = GameState(request.case_id)

    sessions[session_id] = {
        "session_id": session_id,
        "case_id": request.case_id,
        "player_count": request.player_count,
        "game_state": game_state
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
        "game_over": game_state.game_over
    }


@app.get("/sessions/{session_id}")
def get_session(session_id: str):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

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
        "ai_trust": game_state.ai_trust,
        "ai_thrill": game_state.ai_thrill,
        "ai_threat": game_state.ai_threat,
        "game_over": game_state.game_over,
        "player_observations": game_state.player_observations
    }
@app.post("/sessions/{session_id}/puzzles/timeline")
def solve_timeline(session_id: str, answer: TimelineAnswer):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    # Load case
    case = load_case()

    # Get timeline puzzle data
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

    # Create puzzle
    puzzle = TimelinePuzzle(
        case.timeline,
        case.evidence,
        puzzle_data
    )

    # Check player's answer
    correct = puzzle.check_answer(answer.order)

    if correct:

        # Save puzzle as solved
        if "timeline" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("timeline")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = None

        return {
            "correct": True,
            "message": "Correct! Timeline reconstructed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect order. Try again.",
            "mistakes": game_state.mistakes
        }
@app.post("/sessions/{session_id}/puzzles/employment")
def solve_employment(session_id: str, answer: EmploymentAnswer):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if not is_puzzle_unlocked(game_state, "employment"):
        raise HTTPException(
            status_code=403,
            detail="Employment puzzle is locked. Solve the timeline puzzle first."
        )

    # Load case
    case = load_case()

    # Find P02
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

    # Create puzzle
    puzzle = EmploymentPuzzle(puzzle_data)

    # Check player's answer
    correct = puzzle.check_answer(
    {
        "employment_verified": answer.employment_verified,
        "transfer_verified": answer.transfer_verified
    }
    )

    if correct:

        if "employment" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("employment")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        return {
            "correct": True,
            "message": "Correct! Employment history verified.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect verification. Try again.",
            "mistakes": game_state.mistakes
        }
@app.post("/sessions/{session_id}/puzzles/connection")
def solve_connection(session_id: str, answer: ConnectionAnswer):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if not is_puzzle_unlocked(game_state, "connection"):
        raise HTTPException(
            status_code=403,
            detail="Connection puzzle is locked. Solve the employment puzzle first."
        )

    # Load case
    case = load_case()

    # Find P03
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

    # Create puzzle
    puzzle = ConnectionPuzzle(puzzle_data)

    # Check player's answer
    correct = puzzle.check_answer(
    [
        {
            "from": connection.from_node,
            "to": connection.to_node,
            "status": connection.status
        }
        for connection in answer.connections
    ]
)

    if correct:

        if "connection" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("connection")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        return {
            "correct": True,
            "message": "Correct! Connection established.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect connection. Try again.",
            "mistakes": game_state.mistakes
        }
@app.post("/sessions/{session_id}/puzzles/contradictory")
def solve_contradictory(session_id: str, answer: ContradictoryAnswer):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if not is_puzzle_unlocked(game_state, "contradictory"):
        raise HTTPException(
            status_code=403,
            detail="Contradictory witness puzzle is locked. Solve the connection puzzle first."
        )

    # Load case
    case = load_case()

    # Find P04
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

    # Create puzzle
    puzzle = ContradictoryPuzzle(puzzle_data)

    # Check player's answer
    correct = puzzle.check_answer(
    {
        "unreliable_witness": answer.unreliable_witness
    }
)

    if correct:

        if "contradictory" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("contradictory")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        return {
            "correct": True,
            "message": "Correct! Witness contradiction identified.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect analysis. Try again.",
            "mistakes": game_state.mistakes
        }
@app.post("/sessions/{session_id}/evidence/{evidence_id}")
def inspect_evidence(session_id: str, evidence_id: str):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    # Check whether evidence has been unlocked
    if evidence_id not in game_state.unlocked_evidence:
        raise HTTPException(
            status_code=403,
            detail="Evidence not unlocked"
        )

    # Avoid adding the same evidence twice
    if evidence_id not in game_state.inspected_evidence:
        game_state.inspected_evidence.append(evidence_id)

    return {
        "evidence_id": evidence_id,
        "message": "Evidence inspected successfully.",
        "inspected_evidence": game_state.inspected_evidence
    }
@app.post("/sessions/{session_id}/puzzles/missing-record")
def solve_missing_record(
    session_id: str,
    answer: MissingRecordAnswer
):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if not is_puzzle_unlocked(game_state, "missing_record"):
        raise HTTPException(
            status_code=403,
            detail="Missing record puzzle is locked. Solve the contradictory witness puzzle first."
        )

    # Load case
    case = load_case()

    # Find P05
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

    # Create puzzle
    puzzle = MissingRecordPuzzle(puzzle_data)

    # Check player's answer
    correct = puzzle.check_answer(
    {
        "missing_record": answer.missing_record,
        "location": answer.location,
        "credential_use": answer.credential_use,
        "avoids_direct_accusation": answer.avoids_direct_accusation
    }
)

    if correct:

        if "missing_record" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("missing_record")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        return {
            "correct": True,
            "message": "Correct! Missing record identified.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect investigation gap. Try again.",
            "mistakes": game_state.mistakes
        }
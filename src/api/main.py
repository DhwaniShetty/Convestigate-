from uuid import uuid4

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from src.case.case_loader import load_case
from src.game import game_state
from src.game.game_state import GameState
from src.game.timeline_puzzle import TimelinePuzzle
from src.game.employment_puzzle import EmploymentPuzzle
from src.game.document_analysis_puzzle import DocumentAnalysisPuzzle
from src.game.behavior_comparison_puzzle import BehaviorComparisonPuzzle
from src.game.connection_puzzle import ConnectionPuzzle
from src.game.relationship_mapping_puzzle import RelationshipMappingPuzzle
from src.game.forensic_analysis_puzzle import ForensicAnalysisPuzzle
from src.game.field_evidence_analysis_puzzle import FieldEvidenceAnalysisPuzzle
from src.game.contradictory_puzzle import ContradictoryPuzzle
from src.game.missing_record_puzzle import MissingRecordPuzzle
from src.game.hypothesis_management_puzzle import HypothesisManagementPuzzle
from src.game.timeline_reconstruction_puzzle import TimelineReconstructionPuzzle
from src.game.physical_evidence_analysis_puzzle import PhysicalEvidenceAnalysisPuzzle
from src.game.case015_hypothesis_puzzle import Case015HypothesisPuzzle
from src.database.player_session import create_player, create_game_session, add_player_to_session
from src.database.puzzle_logger import log_puzzle_attempt, get_puzzle_attempt_count
from src.database.action_logger import log_player_action
from src.database.behaviour import calculate_player_behaviour

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
    username: str

class TimelineAnswer(BaseModel):
    order: list[str]

class EmploymentAnswer(BaseModel):
    employment_verified: bool
    transfer_verified: bool

class BehaviorComparisonAnswer(BaseModel):
    directly_observed: list[str]
    narrative_added_afterward: list[str]

class ConnectionItem(BaseModel):
    from_node: str
    to_node: str
    status: str

class ConnectionAnswer(BaseModel):
    case_id: str
    connections: list[ConnectionItem]

class ForensicAnalysisAnswer(BaseModel):
    case_id: str
    establishes: str
    does_not_establish: str

class FieldEvidenceAnalysisAnswer(BaseModel):
    case_id: str
    significance: str
    limitation: str

class ContradictoryAnswer(BaseModel):
    case_id: str
    unreliable_witness: str | None = None
    significance: str | None = None
    limitation: str | None = None

class MissingRecordAnswer(BaseModel):
    case_id: str
    missing_record: str | None = None
    location: str | None = None
    credential_use: bool | None = None
    avoids_direct_accusation: bool | None = None
    hypotheses: list[str] | None = None

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

    file_path = f"data/case_{case_id.zfill(3)}.json"

    try:
        case = load_case(file_path)
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

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

    case_file = f"data/case_{request.case_id.zfill(3)}.json"

    try:
        load_case(case_file)
    except FileNotFoundError:
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

    db_session_id = create_game_session(request.case_id)
    player_id = create_player(request.username)
    add_player_to_session(db_session_id, player_id)

    sessions[session_id] = {
    "session_id": session_id,
    "db_session_id": db_session_id,
    "player_id": player_id,
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

    # Load the case selected for this session
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

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

    attempt_number = get_puzzle_attempt_count(
    session["db_session_id"],
    session["player_id"],
    "P01"
    ) + 1

    log_puzzle_attempt(
    session["db_session_id"],
    session["player_id"],
    "P01",
    attempt_number,
    "success" if correct else "failure",
    None
    )
    if correct:

        # Save puzzle as solved
        if "timeline" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("timeline")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "employment"

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

@app.post("/sessions/{session_id}/puzzles/document-analysis")
def solve_document_analysis(
    session_id: str,
    answer: dict
    ):

        if session_id not in sessions:
            raise HTTPException(
                status_code=404,
                detail="Session not found"
            )

        session = sessions[session_id]
        game_state = session["game_state"]

        # Load the case selected for this session
        case_file = f"data/case_{session['case_id'].zfill(3)}.json"
        case = load_case(case_file)

        # Get document analysis puzzle data
        puzzle_data = None

        for puzzle in case.puzzles:
            if puzzle.get("type") == "document_analysis":
                puzzle_data = puzzle
                break

        if puzzle_data is None:
            raise HTTPException(
                status_code=404,
                detail="Document analysis puzzle not found"
            )

        # Create puzzle
        puzzle = DocumentAnalysisPuzzle(puzzle_data)

        # Check player's answer
        correct = puzzle.check_answer(answer)

        attempt_number = get_puzzle_attempt_count(
            session["db_session_id"],
            session["player_id"],
            "P01"
        ) + 1

        log_puzzle_attempt(
            session["db_session_id"],
            session["player_id"],
            "P01",
            attempt_number,
            "success" if correct else "failure",
            None
        )

        if correct:

            # Save puzzle as solved
            if "document_analysis" not in game_state.solved_puzzles:
                game_state.solved_puzzles.append("document_analysis")

            # Unlock evidence
            for evidence_id in puzzle.get_unlocked_evidence():

                if evidence_id not in game_state.unlocked_evidence:
                    game_state.unlocked_evidence.append(evidence_id)

            game_state.current_puzzle = "relationship_mapping"

            return {
                "correct": True,
                "message": "Correct! Document analysis completed.",
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
    
@app.post("/sessions/{session_id}/puzzles/employment")
def solve_employment(
    session_id: str,
    answer: dict
):

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
            detail="P02 puzzle is locked. Solve the timeline puzzle first."
        )

    # Load the case selected for this session
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Find P02
    puzzle_data = None

    for puzzle in case.puzzles:
        if puzzle.get("id") == "P02":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="P02 puzzle not found"
        )

    # Choose the puzzle implementation based on the JSON type
    puzzle_type = puzzle_data.get("type")

    if puzzle_type == "employment" or puzzle_type == "record_check":
        puzzle = EmploymentPuzzle(puzzle_data)

    elif puzzle_type == "behavior_comparison":
        puzzle = BehaviorComparisonPuzzle(puzzle_data)

    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported P02 puzzle type: {puzzle_type}"
        )

    # Check player's answer
    correct = puzzle.check_answer(answer)

    # Log attempt
    attempt_number = get_puzzle_attempt_count(
        session["db_session_id"],
        session["player_id"],
        "P02"
    ) + 1

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P02",
        attempt_number,
        "success" if correct else "failure",
        None
    )

    if correct:

        if "P02" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("employment")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        # Move to next puzzle
        game_state.current_puzzle = "connection"

        return {
            "correct": True,
            "message": "Correct! P02 solved.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect answer. Try again.",
            "mistakes": game_state.mistakes
        }
    
@app.post("/sessions/{session_id}/puzzles/connection")
def solve_connection(
    session_id: str,
    answer: dict
    ):
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

    # Load the case selected for this session
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

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

    # Create the appropriate puzzle implementation
    puzzle_type = puzzle_data.get("type")

    if puzzle_type == "forensic_analysis":
        puzzle = ForensicAnalysisPuzzle(puzzle_data)

    elif puzzle_type == "connection" or puzzle_type == "relationship_mapping":
        puzzle = ConnectionPuzzle(puzzle_data)

    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported P03 puzzle type: {puzzle_type}"
        )

    # Check player's answer
    if puzzle_type == "forensic_analysis":
        correct = puzzle.check_answer(answer)

    else:
        correct = puzzle.check_answer(
            [
                {
                    "from": connection["from"],
                    "to": connection["to"],
                    "status": connection["status"]
                }
                for connection in answer["connections"]
            ]
        )

    attempt_number = get_puzzle_attempt_count(
    session["db_session_id"],
    session["player_id"],
    "P03"
    ) + 1

    log_puzzle_attempt(
    session["db_session_id"],
    session["player_id"],
    "P03",
    attempt_number,
    "success" if correct else "failure",
    None
    )

    if correct:

        if "connection" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("connection")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

            # Move to next puzzle
            game_state.current_puzzle = "contradictory"

        return {
            "correct": True,
            "message": "Correct! Crash scene analysis completed.",
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

    # Load session-specific case
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

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
    puzzle_type = puzzle_data.get("type")

    if puzzle_type == "field_evidence_analysis":
        puzzle = FieldEvidenceAnalysisPuzzle(puzzle_data)
    elif puzzle_type == "contradictory" or puzzle_type == "statement_analysis":
        puzzle = ContradictoryPuzzle(puzzle_data)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported P04 puzzle type: {puzzle_type}"
        )

    # Check player's answer
    if puzzle_type == "field_evidence_analysis":
        correct = puzzle.check_answer(
            {
                "significance": answer.significance,
                "limitation": answer.limitation
            }
        )

    else:
        correct = puzzle.check_answer(
            {
                "unreliable_witness": answer.unreliable_witness
            }
        )

    attempt_number = get_puzzle_attempt_count(
    session["db_session_id"],
    session["player_id"],
    "P04"
    ) + 1

    log_puzzle_attempt(
    session["db_session_id"],
    session["player_id"],
    "P04",
    attempt_number,
    "success" if correct else "failure",
    None
    )

    if correct:

        if "contradictory" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("contradictory")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        # Move to next puzzle
        game_state.current_puzzle = "missing_record"    

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

    log_player_action(
        session_id=session["db_session_id"],
        player_id=session["player_id"],
        action_type="inspect_evidence",
        target_id=evidence_id,
        stage=game_state.current_puzzle,
        result="success"
    )

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

    # Load session-specific case
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

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

    # Create puzzle based on P05 type
    puzzle_type = puzzle_data.get("type")

    if puzzle_type == "hypothesis_management":
        puzzle = HypothesisManagementPuzzle(puzzle_data)
    elif puzzle_type == "missing_record" or puzzle_type == "investigation_gap":
        puzzle = MissingRecordPuzzle(puzzle_data)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported P05 puzzle type: {puzzle_type}"
        )

    # Check player's answer
    if puzzle_type == "hypothesis_management":

        correct = puzzle.check_answer(
            {
                "hypotheses": answer.hypotheses
            }
        )

    else:

        correct = puzzle.check_answer(
            {
                "missing_record": answer.missing_record,
                "location": answer.location,
                "credential_use": answer.credential_use,
                "avoids_direct_accusation": answer.avoids_direct_accusation
            }
        )

    attempt_number = get_puzzle_attempt_count(
    session["db_session_id"],
    session["player_id"],
    "P05"
    ) + 1

    log_puzzle_attempt(
    session["db_session_id"],
    session["player_id"],
    "P05",
    attempt_number,
    "success" if correct else "failure",
    None
    )

    if correct:

        if "missing_record" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("missing_record")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        # Investigation completed
        game_state.current_puzzle = None
        game_state.game_over = True

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

@app.get("/sessions/{session_id}/behaviour")
def get_player_behaviour(session_id: str):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]

    calculate_player_behaviour(
        session["db_session_id"],
        session["player_id"]
    )

    return {
        "message": "Player behaviour calculated successfully."
    }

@app.post("/sessions/{session_id}/puzzles/relationship-mapping")
def solve_relationship_mapping(
    session_id: str,
    answer: dict
):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    # Load the case selected for this session
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Get relationship mapping puzzle data
    puzzle_data = None

    for puzzle_data_item in case.puzzles:
        if puzzle_data_item.get("type") == "relationship_mapping":
            puzzle_data = puzzle_data_item
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Relationship mapping puzzle not found"
        )

    # Create puzzle
    puzzle = RelationshipMappingPuzzle(puzzle_data)

    # Check player's answer
    correct = puzzle.check_answer(answer)

    attempt_number = get_puzzle_attempt_count(
        session["db_session_id"],
        session["player_id"],
        "P02"
    ) + 1

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P02",
        attempt_number,
        "success" if correct else "failure",
        None
    )

    if correct:

        # Save puzzle as solved
        if "relationship_mapping" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("relationship_mapping")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "timeline_reconstruction"

        return {
            "correct": True,
            "message": "Correct! Relationship mapping completed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect relationship analysis. Try again.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/timeline-reconstruction")
def solve_timeline_reconstruction(
    session_id: str,
    answer: dict
):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    # Load the case selected for this session
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Get timeline reconstruction puzzle data
    puzzle_data = None

    for puzzle_data_item in case.puzzles:
        if puzzle_data_item.get("type") == "timeline_reconstruction":
            puzzle_data = puzzle_data_item
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Timeline reconstruction puzzle not found"
        )

    # Create puzzle
    puzzle = TimelineReconstructionPuzzle(puzzle_data)

    # Check player's answer
    correct = puzzle.check_answer(answer)

    attempt_number = get_puzzle_attempt_count(
        session["db_session_id"],
        session["player_id"],
        "P03"
    ) + 1

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P03",
        attempt_number,
        "success" if correct else "failure",
        None
    )

    if correct:

        if "timeline_reconstruction" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("timeline_reconstruction")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "physical_evidence_analysis"

        return {
            "correct": True,
            "message": "Correct! Timeline reconstruction completed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect timeline reconstruction. Try again.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/physical-evidence-analysis")
def solve_physical_evidence_analysis(
    session_id: str,
    answer: dict
):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    # Load the case selected for this session
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Get physical evidence analysis puzzle data
    puzzle_data = None

    for puzzle_data_item in case.puzzles:
        if puzzle_data_item.get("type") == "physical_evidence_analysis":
            puzzle_data = puzzle_data_item
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Physical evidence analysis puzzle not found"
        )

    # Create puzzle
    puzzle = PhysicalEvidenceAnalysisPuzzle(puzzle_data)

    # Check player's answer
    correct = puzzle.check_answer(answer)

    attempt_number = get_puzzle_attempt_count(
        session["db_session_id"],
        session["player_id"],
        "P04"
    ) + 1

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P04",
        attempt_number,
        "success" if correct else "failure",
        None
    )

    if correct:

        if "physical_evidence_analysis" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("physical_evidence_analysis")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "hypothesis_management"

        return {
            "correct": True,
            "message": "Correct! Physical evidence analysis completed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect physical evidence analysis. Try again.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case015-hypothesis")
def solve_case015_hypothesis(
    session_id: str,
    answer: dict
):
    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    # Load the case
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Make sure this endpoint is only used for Case 015
    if session["case_id"] != "015":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is only available for Case 015"
        )

    puzzle_data = None

    for puzzle_data_item in case.puzzles:
        if puzzle_data_item.get("type") == "hypothesis_management":
            puzzle_data = puzzle_data_item
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Hypothesis management puzzle not found"
        )

    puzzle = Case015HypothesisPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    attempt_number = get_puzzle_attempt_count(
        session["db_session_id"],
        session["player_id"],
        "P05"
    ) + 1

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P05",
        attempt_number,
        "success" if correct else "failure",
        None
    )

    if correct:

        if "hypothesis_management" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("hypothesis_management")

        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.game_over = True

        return {
            "correct": True,
            "message": "Correct! Final causal graph completed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect final causal graph. Try again.",
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }
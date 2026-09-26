from urllib import request
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src import case
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
from src.game.asset_tracing_puzzle import AssetTracingPuzzle
from src.game.case013_relationship_mapping_puzzle import Case013RelationshipMappingPuzzle
from src.game.case013_narrative_synthesis_puzzle import Case013NarrativeSynthesisPuzzle
from src.game.case013_hypothesis_puzzle import Case013HypothesisPuzzle
from src.game.object_analysis_puzzle import ObjectAnalysisPuzzle
from src.game.pattern_mapping_puzzle import PatternMappingPuzzle
from src.game.case009_timeline_reconstruction_puzzle import Case009TimelineReconstructionPuzzle
from src.game.case009_hypothesis_test_puzzle import Case009HypothesisTestPuzzle
from src.game.case009_hypothesis_management_puzzle import Case009HypothesisManagementPuzzle
from src.game.case001_timeline_maintenance_puzzle import Case001TimelineMaintenancePuzzle
from src.game.case001_motive_analysis_puzzle import Case001MotiveAnalysisPuzzle
from src.game.case001_damage_analysis_puzzle import Case001DamageAnalysisPuzzle
from src.game.case001_communication_analysis_puzzle import Case001CommunicationAnalysisPuzzle
from src.game.case001_hypothesis_management_puzzle import Case001HypothesisManagementPuzzle
from src.game.case002_contradiction_analysis_puzzle import Case002ContradictionAnalysisPuzzle
from src.game.case002_forensic_analysis_puzzle import Case002ForensicAnalysisPuzzle
from src.game.case002_provenance_review_puzzle import Case002ProvenanceReviewPuzzle
from src.game.case002_timeline_access_mapping_puzzle import Case002TimelineAccessMappingPuzzle
from src.game.case002_hypothesis_management_puzzle import Case002HypothesisManagementPuzzle
from src.game.case003_timeline_reconstruction_puzzle import Case003TimelineReconstructionPuzzle
from src.game.case003_evidence_classification_puzzle import Case003EvidenceClassificationPuzzle
from src.game.case003_field_investigation_puzzle import Case003FieldInvestigationPuzzle
from src.game.case003_institutional_review_puzzle import Case003InstitutionalReviewPuzzle
from src.game.case003_hypothesis_management_puzzle import Case003HypothesisManagementPuzzle
from src.game.case004_digital_alibi_map_puzzle import Case004DigitalAlibiMapPuzzle
from src.game.case004_time_of_death_reconciliation_puzzle import Case004TimeOfDeathReconciliationPuzzle
from src.game.case004_metadata_authentication_puzzle import Case004MetadataAuthenticationPuzzle
from src.game.case004_financial_motive_audit_puzzle import Case004FinancialMotiveAuditPuzzle
from src.game.case004_final_reconstruction_puzzle import Case004FinalReconstructionPuzzle
from src.game.case005_comparative_analysis_puzzle import Case005ComparativeAnalysisPuzzle
from src.game.case005_provenance_tracing_puzzle import Case005ProvenanceTracingPuzzle
from src.game.case005_chain_analysis_puzzle import Case005ChainAnalysisPuzzle
from src.game.case005_evidentiary_standard_puzzle import Case005EvidentiaryStandardPuzzle
from src.game.case005_hypothesis_management_puzzle import Case005HypothesisManagementPuzzle
from src.game.case006_evidence_generation_puzzle import Case006EvidenceGenerationPuzzle
from src.game.case006_evidence_classification_puzzle import Case006EvidenceClassificationPuzzle
from src.game.case006_timeline_reconstruction_puzzle import Case006TimelineReconstructionPuzzle
from src.game.case006_hypothesis_test_puzzle import Case006HypothesisTestPuzzle
from src.game.case006_hypothesis_management_puzzle import Case006HypothesisManagementPuzzle

from src.game.case007_timeline_reconstruction_puzzle import Case007TimelineReconstructionPuzzle
from src.game.case007_forensic_analysis_puzzle import Case007ForensicAnalysisPuzzle
from src.game.case007_trace_evidence_analysis_puzzle import Case007TraceEvidenceAnalysisPuzzle

from src.game.case012_fact_listing_puzzle import Case012FactListingPuzzle
from src.game.case012_identity_verification_puzzle import Case012IdentityVerificationPuzzle
from src.game.case012_field_investigation_puzzle import Case012FieldInvestigationPuzzle
from src.game.case012_digital_forensics_puzzle import Case012DigitalForensicsPuzzle
from src.game.case012_motive_analysis_puzzle import Case012MotiveAnalysisPuzzle

from src.database.player_session import (
    create_player,
    create_game_session,
    add_player_to_session
)
from src.database.puzzle_logger import (
    log_puzzle_attempt,
    get_puzzle_attempt_count
)
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
<<<<<<< ours
    username: str = "Guest"
=======
    username: str
>>>>>>> theirs

class TimelineAnswer(BaseModel):
    order: list[str]

class EmploymentAnswer(BaseModel):
    employment_verified: bool
    transfer_verified: bool

<<<<<<< ours
=======
class BehaviorComparisonAnswer(BaseModel):
    directly_observed: list[str]
    narrative_added_afterward: list[str]

>>>>>>> theirs
class ConnectionItem(BaseModel):
    from_node: str
    to_node: str
    status: str

<<<<<<< ours

=======
>>>>>>> theirs
class ConnectionAnswer(BaseModel):
    case_id: str
    connections: list[ConnectionItem]

<<<<<<< ours
class ContradictoryAnswer(BaseModel):
    case_id: str
    unreliable_witness: str

class MissingRecordAnswer(BaseModel):
    case_id: str
    missing_record: str
    location: str
    credential_use: bool
    avoids_direct_accusation: bool
=======
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
>>>>>>> theirs

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

<<<<<<< ours
    try:
        case = load_case(case_id)

        return {
            "case_id": case.case_id,
            "title": case.title,
            "victim": case.victim,
            "suspects": case.suspects,
            "timeline": case.timeline,
            "evidence": case.evidence,
            "puzzles": case.puzzles
        }

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=f"Case {case_id} not found"
        )
    case = load_case()
=======
    file_path = f"data/case_{case_id.zfill(3)}.json"

    try:
        case = load_case(case_file)
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )
>>>>>>> theirs

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

<<<<<<< ours
    try:
     load_case(request.case_id)
    except FileNotFoundError:
     raise HTTPException(
        status_code=404,
        detail=f"Case {request.case_id} not found"
    )
=======
    case_file = f"data/case_{request.case_id.zfill(3)}.json"

    try:
        case = load_case(case_file)
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )
>>>>>>> theirs

    if request.player_count < 1 or request.player_count > 6:
        raise HTTPException(
            status_code=400,
            detail="Player count must be between 1 and 6"
        )

    session_id = str(uuid4())
<<<<<<< ours

    # Create player in database
    username = request.username

    if username == "Guest":
        username = f"Guest_{uuid4().hex[:8]}"

    player_id = create_player(username)

    # Create game session in database
    db_session_id = create_game_session(request.case_id)

    # Connect player to the session
    add_player_to_session(db_session_id, player_id)

    game_state = GameState(request.case_id)

    sessions[session_id] = {
        "session_id": session_id,
        "db_session_id": db_session_id,
        "player_id": player_id,
        "case_id": request.case_id,
        "player_count": request.player_count,
        "game_state": game_state
    }
=======
    game_state = GameState(request.case_id)

    # Start with the first puzzle defined in the case
    if case.puzzles:
        game_state.current_puzzle = case.puzzles[0].get("type")

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

>>>>>>> theirs
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

<<<<<<< ours
    # Load case
    case = load_case(session["case_id"])
=======
    # Load the case selected for this session
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)
>>>>>>> theirs

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

<<<<<<< ours
=======
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
>>>>>>> theirs
    if correct:

        # Save puzzle as solved
        if "timeline" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("timeline")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

<<<<<<< ours
        game_state.current_puzzle = None
=======
        game_state.current_puzzle = "employment"
>>>>>>> theirs

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
<<<<<<< ours
@app.post("/sessions/{session_id}/puzzles/employment")
def solve_employment(session_id: str, answer: EmploymentAnswer):
=======

@app.post("/sessions/{session_id}/puzzles/asset-tracing")
def solve_asset_tracing(session_id: str, answer: dict):
>>>>>>> theirs

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

<<<<<<< ours
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
=======
    # Make sure this endpoint is being used for Case 013
    if session["case_id"] != "013":
        raise HTTPException(
            status_code=400,
            detail="Asset tracing puzzle is only available for Case 013"
        )

    # Load the case
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Get asset tracing puzzle data
    puzzle_data = None

    for puzzle in case.puzzles:
        if puzzle.get("type") == "asset_tracing":
>>>>>>> theirs
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
<<<<<<< ours
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
=======
            detail="Asset tracing puzzle not found"
        )

    # Create puzzle
    puzzle = AssetTracingPuzzle(puzzle_data)

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
>>>>>>> theirs
    )

    if correct:

<<<<<<< ours
        if "employment" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("employment")
=======
        # Save puzzle as solved
        if "asset_tracing" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("asset_tracing")
>>>>>>> theirs

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

<<<<<<< ours
        return {
            "correct": True,
            "message": "Correct! Employment history verified.",
=======
        # Move to Case 013 P03
        game_state.current_puzzle = "relationship_mapping"

        return {
            "correct": True,
            "message": "Correct! Weapon and radio traced.",
>>>>>>> theirs
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
<<<<<<< ours
            "message": "Incorrect verification. Try again.",
            "mistakes": game_state.mistakes
        }
@app.post("/sessions/{session_id}/puzzles/connection")
def solve_connection(session_id: str, answer: ConnectionAnswer):
=======
            "message": "Incorrect asset tracing. Try again.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case013-relationship-mapping")
def solve_case013_relationship_mapping(session_id: str, answer: dict):
>>>>>>> theirs

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

<<<<<<< ours
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
=======
    if session["case_id"] != "013":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is only available for Case 013"
        )

    # Load the case
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Get relationship mapping puzzle data
    puzzle_data = None

    for puzzle in case.puzzles:
        if puzzle.get("type") == "relationship_mapping":
>>>>>>> theirs
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
<<<<<<< ours
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
=======
            detail="Relationship mapping puzzle not found"
        )

    # Create puzzle
    puzzle = Case013RelationshipMappingPuzzle(puzzle_data)

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

        if "relationship_mapping" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("relationship_mapping")
>>>>>>> theirs

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

<<<<<<< ours
        return {
            "correct": True,
            "message": "Correct! Connection established.",
=======
        # Move to Case 013 P04
        game_state.current_puzzle = "narrative_synthesis"

        return {
            "correct": True,
            "message": "Correct! Financial and contact connections mapped.",
>>>>>>> theirs
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
<<<<<<< ours
            "message": "Incorrect connection. Try again.",
            "mistakes": game_state.mistakes
        }
@app.post("/sessions/{session_id}/puzzles/contradictory")
def solve_contradictory(session_id: str, answer: ContradictoryAnswer):
=======
            "message": "Incorrect relationship mapping. Try again.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case013-narrative-synthesis")
def solve_case013_narrative_synthesis(session_id: str, answer: dict):
>>>>>>> theirs

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

<<<<<<< ours
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
=======
    if session["case_id"] != "013":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is only available for Case 013"
        )

    # Load the case
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Get narrative synthesis puzzle data
    puzzle_data = None

    for puzzle_data_item in case.puzzles:
        if puzzle_data_item.get("type") == "narrative_synthesis":
            puzzle_data = puzzle_data_item
>>>>>>> theirs
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
<<<<<<< ours
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
=======
            detail="Narrative synthesis puzzle not found"
        )

    # Create puzzle
    puzzle = Case013NarrativeSynthesisPuzzle(puzzle_data)

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

        if "narrative_synthesis" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("narrative_synthesis")
>>>>>>> theirs

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

<<<<<<< ours
        return {
            "correct": True,
            "message": "Correct! Witness contradiction identified.",
=======
        # Move to Case 013 P05
        game_state.current_puzzle = "hypothesis_management"

        return {
            "correct": True,
            "message": "Correct! Secret life reconstructed.",
>>>>>>> theirs
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
<<<<<<< ours
            "message": "Incorrect analysis. Try again.",
            "mistakes": game_state.mistakes
        }
@app.post("/sessions/{session_id}/evidence/{evidence_id}")
def inspect_evidence(session_id: str, evidence_id: str):
=======
            "message": "Incorrect narrative reconstruction. Try again.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case013-hypothesis")
def solve_case013_hypothesis(session_id: str, answer: dict):
>>>>>>> theirs

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

<<<<<<< ours
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
=======
    if session["case_id"] != "013":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is only available for Case 013"
        )

    # Load the case
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Get hypothesis management puzzle data
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

    # Create puzzle
    puzzle = Case013HypothesisPuzzle(puzzle_data)

    # Check player's answer
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

        # P05 is the final puzzle for Case 013
        game_state.current_puzzle = None
        game_state.game_over = True

        return {
            "correct": True,
            "message": "Correct! Motive and responsibility separated.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect hypothesis analysis. Try again.",
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
>>>>>>> theirs
):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

<<<<<<< ours
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
=======
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
>>>>>>> theirs
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
<<<<<<< ours
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
=======
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
>>>>>>> theirs

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

<<<<<<< ours
        return {
            "correct": True,
            "message": "Correct! Missing record identified.",
=======
        # Move to next puzzle
        game_state.current_puzzle = "connection"

        return {
            "correct": True,
            "message": "Correct! P02 solved.",
>>>>>>> theirs
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
<<<<<<< ours
            "message": "Incorrect investigation gap. Try again.",
            "mistakes": game_state.mistakes
        }
=======
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
@app.post("/sessions/{session_id}/puzzles/object-analysis")
def solve_object_analysis(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    # Make sure this endpoint is being used for Case 009
    if session["case_id"] != "009":
        raise HTTPException(
            status_code=400,
            detail="Object analysis puzzle is only available for Case 009"
        )

    # Load the case
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Get object analysis puzzle data
    puzzle_data = None

    for puzzle in case.puzzles:
        if puzzle.get("type") == "object_analysis":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Object analysis puzzle not found"
        )

    # Create puzzle
    puzzle = ObjectAnalysisPuzzle(puzzle_data)

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
        if "object_analysis" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("object_analysis")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        # Move to Case 009 P02
        game_state.current_puzzle = "pattern_mapping"

        return {
            "correct": True,
            "message": "Correct! The mismatched key is meaningful evidence.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect object analysis. Try again.",
            "mistakes": game_state.mistakes
        }
@app.post("/sessions/{session_id}/puzzles/pattern-mapping")
def solve_pattern_mapping(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    # Make sure this endpoint is being used for Case 009
    if session["case_id"] != "009":
        raise HTTPException(
            status_code=400,
            detail="Pattern mapping puzzle is only available for Case 009"
        )

    # Load the case
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Get pattern mapping puzzle data
    puzzle_data = None

    for puzzle in case.puzzles:
        if puzzle.get("type") == "pattern_mapping":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Pattern mapping puzzle not found"
        )

    # Create puzzle
    puzzle = PatternMappingPuzzle(puzzle_data)

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
        if "pattern_mapping" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("pattern_mapping")

        # Unlock evidence
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        # Move to Case 009 P03
        game_state.current_puzzle = "timeline_reconstruction"

        return {
            "correct": True,
            "message": "Correct! The route forms a deliberate pattern.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect pattern mapping. Try again.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case009-timeline-reconstruction")
def solve_case009_timeline_reconstruction(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    # Make sure this endpoint is only used for Case 009
    if session["case_id"] != "009":
        raise HTTPException(
            status_code=400,
            detail="Timeline reconstruction puzzle is only available for Case 009"
        )

    # Load Case 009
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Find P03
    puzzle_data = None

    for puzzle in case.puzzles:
        if puzzle.get("type") == "timeline_reconstruction":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Case 009 timeline reconstruction puzzle not found"
        )

    # Create puzzle
    puzzle = Case009TimelineReconstructionPuzzle(puzzle_data)

    # Check answer
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

        # Mark P03 as solved
        if "timeline_reconstruction" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("timeline_reconstruction")

        # Unlock E04 and E05
        for evidence_id in puzzle.get_unlocked_evidence():

            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        # Move to P04
        game_state.current_puzzle = "hypothesis_test"

        return {
            "correct": True,
            "message": "Correct! The forty-minute room gap remains unexplained.",
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

@app.post("/sessions/{session_id}/puzzles/case009-hypothesis-test")
def solve_case009_hypothesis_test(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    # Make sure this endpoint is only used for Case 009
    if session["case_id"] != "009":
        raise HTTPException(
            status_code=400,
            detail="Hypothesis test puzzle is only available for Case 009"
        )

    # Load Case 009
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Find P04
    puzzle_data = None

    for puzzle in case.puzzles:
        if puzzle.get("type") == "hypothesis_test":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Case 009 hypothesis test puzzle not found"
        )

    # Create puzzle
    puzzle = Case009HypothesisTestPuzzle(puzzle_data)

    # Check answer
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

        # Mark P04 as solved
        if "hypothesis_test" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("hypothesis_test")

        # No evidence is unlocked by P04

        # Move to P05
        game_state.current_puzzle = "hypothesis_management"

        return {
            "correct": True,
            "message": "Correct! The planned route is supported, but the intended meeting person remains unidentified.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect hypothesis analysis. Try again.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case009-hypothesis-management")
def solve_case009_hypothesis_management(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    # Make sure this endpoint is only used for Case 009
    if session["case_id"] != "009":
        raise HTTPException(
            status_code=400,
            detail="Hypothesis management puzzle is only available for Case 009"
        )

    # Load Case 009
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Find P05
    puzzle_data = None

    for puzzle in case.puzzles:
        if puzzle.get("type") == "hypothesis_management":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Case 009 hypothesis management puzzle not found"
        )

    # Create puzzle
    puzzle = Case009HypothesisManagementPuzzle(puzzle_data)

    # Check answer
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

        # Mark P05 as solved
        if "hypothesis_management" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("hypothesis_management")

        # No additional evidence is unlocked by P05

        # Case 009 is now complete
        game_state.current_puzzle = None
        game_state.game_over = True

        return {
            "correct": True,
            "message": "Correct! The itinerary shows a coordinated pattern, but the other participant and killer remain unidentified.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect final hypothesis analysis. Try again.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case001-timeline-maintenance")
def solve_case001_timeline_maintenance(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    # Make sure this endpoint is only used for Case 001
    if session["case_id"] != "001":
        raise HTTPException(
            status_code=400,
            detail="Timeline and maintenance puzzle is only available for Case 001"
        )

    # Load Case 001
    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    # Find P01
    puzzle_data = None

    for puzzle in case.puzzles:
        if puzzle.get("type") == "timeline_and_maintenance_analysis":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Case 001 timeline and maintenance puzzle not found"
        )

    # Create puzzle
    puzzle = Case001TimelineMaintenancePuzzle(puzzle_data)

    # Check answer
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

        # Mark P01 as solved
        if "timeline_and_maintenance_analysis" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append(
                "timeline_and_maintenance_analysis"
            )

        # Unlock P01 evidence
        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        # Move to P02
        game_state.current_puzzle = "motive_analysis"

        return {
            "correct": True,
            "message": "Correct! The voyage timeline and maintenance records reveal an important inconsistency.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:

        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect timeline or maintenance analysis. Try again.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case001-motive-analysis")
def solve_case001_motive_analysis(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "001":
        raise HTTPException(
            status_code=400,
            detail="Motive analysis puzzle is only available for Case 001"
        )

    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    puzzle_data = None
    for puzzle in case.puzzles:
        if puzzle.get("type") == "motive_analysis":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Case 001 motive analysis puzzle not found"
        )

    puzzle = Case001MotiveAnalysisPuzzle(puzzle_data)
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
        if "motive_analysis" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("motive_analysis")

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "forensic_analysis"

        return {
            "correct": True,
            "message": "Correct! The financial evidence establishes a possible motive, while the family-history pattern is a red herring.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:
        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect motive analysis. Re-examine the financial, estate, and account-access evidence.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case001-damage-analysis")
def solve_case001_damage_analysis(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "001":
        raise HTTPException(
            status_code=400,
            detail="Damage analysis puzzle is only available for Case 001"
        )

    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    puzzle_data = None
    for puzzle in case.puzzles:
        if puzzle.get("type") == "forensic_analysis":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Case 001 damage analysis puzzle not found"
        )

    puzzle = Case001DamageAnalysisPuzzle(puzzle_data)
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
        if "forensic_analysis" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("forensic_analysis")

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "timeline_and_document_analysis"

        return {
            "correct": True,
            "message": "Correct! The damage pattern is inconsistent with simple mechanical failure, and the repair records reveal a possible sabotage opportunity.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:
        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect damage analysis. Re-examine the damage pattern and original repair documentation.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case001-communication-analysis")
def solve_case001_communication_analysis(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "001":
        raise HTTPException(
            status_code=400,
            detail="Communication analysis puzzle is only available for Case 001"
        )

    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    puzzle_data = None
    for puzzle in case.puzzles:
        if puzzle.get("type") == "timeline_and_document_analysis":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Case 001 communication analysis puzzle not found"
        )

    puzzle = Case001CommunicationAnalysisPuzzle(puzzle_data)
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
        if "timeline_and_document_analysis" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append(
                "timeline_and_document_analysis"
            )

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "hypothesis_management"

        return {
            "correct": True,
            "message": "Correct! The communication record contradicts Adrian's account, and Eleanor's note reveals her concerns about his financial irregularities.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:
        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect communication analysis. Re-examine the emergency timing and Eleanor's private note.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case001-hypothesis-management")
def solve_case001_hypothesis_management(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "001":
        raise HTTPException(
            status_code=400,
            detail="Hypothesis management puzzle is only available for Case 001"
        )

    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    puzzle_data = None
    for puzzle in case.puzzles:
        if puzzle.get("type") == "hypothesis_management":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Case 001 hypothesis management puzzle not found"
        )

    puzzle = Case001HypothesisManagementPuzzle(puzzle_data)
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
            game_state.solved_puzzles.append(
                "hypothesis_management"
            )

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = None
        game_state.game_over = True

        return {
            "correct": True,
            "message": "Correct! Adrian's revised statement contradicts his original account, while the evidence supports the sabotage hypothesis without establishing the exact mechanism or moment of Eleanor's death.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    else:
        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect final reconstruction. Re-examine Adrian's statements and distinguish what the evidence establishes from what remains unresolved.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case002-contradiction-analysis")
def solve_case002_contradiction_analysis(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "002":
        raise HTTPException(
            status_code=400,
            detail="Contradiction analysis puzzle is only available for Case 002"
        )

    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    puzzle_data = None
    for puzzle in case.puzzles:
        if puzzle.get("type") == "contradiction_analysis":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Case 002 contradiction analysis puzzle not found"
        )

    puzzle = Case002ContradictionAnalysisPuzzle(puzzle_data)
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
        if "contradiction_analysis" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append(
                "contradiction_analysis"
            )

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "forensic_analysis"

        return {
            "correct": True,
            "message": "Correct! The scene records and evidence-handling history reveal contradictions and a break in the chain of custody.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:
        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect reconstruction. Re-examine the scene records and chain-of-custody history.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case002-forensic-analysis")
def solve_case002_forensic_analysis(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "002":
        raise HTTPException(
            status_code=400,
            detail="Forensic analysis puzzle is only available for Case 002"
        )

    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    puzzle_data = None
    for puzzle in case.puzzles:
        if puzzle.get("type") == "forensic_analysis":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Case 002 forensic analysis puzzle not found"
        )

    puzzle = Case002ForensicAnalysisPuzzle(puzzle_data)
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
        if "forensic_analysis" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append(
                "forensic_analysis"
            )

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "provenance_review"

        return {
            "correct": True,
            "message": "Correct! The missing weapon and trajectory evidence challenge the original single-attacker interpretation and raise concerns about the reliability of the physical evidence.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:
        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect forensic analysis. Re-examine the missing weapon and projectile trajectories.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case002-provenance-review")
def solve_case002_provenance_review(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "002":
        raise HTTPException(
            status_code=400,
            detail="Provenance review puzzle is only available for Case 002"
        )

    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    puzzle_data = None
    for puzzle in case.puzzles:
        if puzzle.get("type") == "provenance_review":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Case 002 provenance review puzzle not found"
        )

    puzzle = Case002ProvenanceReviewPuzzle(puzzle_data)
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
        if "provenance_review" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append(
                "provenance_review"
            )

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "timeline_and_access_mapping"

        return {
            "correct": True,
            "message": "Correct! The independent storage evidence and recovered photographs expose weaknesses in the original Arjun-focused narrative.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:
        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect provenance review. Re-examine the storage evidence, Arjun-related evidence, and recovered photographs.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case002-timeline-access")
def solve_case002_timeline_access(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "002":
        raise HTTPException(
            status_code=400,
            detail="Timeline and access mapping puzzle is only available for Case 002"
        )

    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    puzzle_data = None
    for puzzle in case.puzzles:
        if puzzle.get("type") == "timeline_and_access_mapping":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Case 002 timeline and access mapping puzzle not found"
        )

    puzzle = Case002TimelineAccessMappingPuzzle(puzzle_data)
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
        if "timeline_and_access_mapping" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append(
                "timeline_and_access_mapping"
            )

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "hypothesis_management"

        return {
            "correct": True,
            "message": "Correct! Daniel's timeline requires verification, while Vikram's access establishes an opportunity to manipulate evidence without by itself proving murder involvement.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:
        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect timeline and access analysis. Re-examine Daniel's movements and Vikram's evidence access.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case002-hypothesis-management")
def solve_case002_hypothesis_management(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "002":
        raise HTTPException(
            status_code=400,
            detail="Hypothesis management puzzle is only available for Case 002"
        )

    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    puzzle_data = None

    for puzzle in case.puzzles:
        if puzzle.get("type") == "hypothesis_management":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Case 002 hypothesis management puzzle not found"
        )

    puzzle = Case002HypothesisManagementPuzzle(puzzle_data)
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
            game_state.solved_puzzles.append(
                "hypothesis_management"
            )

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = None
        game_state.game_over = True

        return {
            "correct": True,
            "message": "Correct! The final reconstruction separates the murder from the later evidence manipulation, rejects the original Arjun narrative, identifies Daniel as the supported murderer hypothesis, and preserves uncertainty where the evidence is insufficient.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    else:
        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect final reconstruction. Reassess which hypotheses are supported, contradicted, or unresolved.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case003-timeline-reconstruction")
def solve_case003_timeline_reconstruction(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "003":
        raise HTTPException(
            status_code=400,
            detail="Timeline reconstruction puzzle is only available for Case 003"
        )

    case_file = f"data/case_{session['case_id'].zfill(3)}.json"
    case = load_case(case_file)

    puzzle_data = None

    for puzzle in case.puzzles:
        if puzzle.get("type") == "timeline_reconstruction":
            puzzle_data = puzzle
            break

    if puzzle_data is None:
        raise HTTPException(
            status_code=404,
            detail="Case 003 timeline reconstruction puzzle not found"
        )

    puzzle = Case003TimelineReconstructionPuzzle(puzzle_data)
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
        if "timeline_reconstruction" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append(
                "timeline_reconstruction"
            )

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "evidence_classification"

        return {
            "correct": True,
            "message": "Correct! The night timeline connects the pub encounter, the journey home, the job-related call, the unknown man's presence inside the home, and the final residence call before the family's disappearance.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    else:
        game_state.mistakes += 1

        return {
            "correct": False,
            "message": "Incorrect timeline reconstruction. Re-examine the sequence of events from the pub encounter through the family's disappearance.",
            "mistakes": game_state.mistakes
        }

@app.post("/sessions/{session_id}/puzzles/case003-evidence-classification")
def solve_case003_evidence_classification(session_id: str, answer: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]

    if session["case_id"] != "003":
        raise HTTPException(status_code=400, detail="This puzzle belongs to Case 003")

    case = load_case("data/case_003.json")

    puzzle_data = next(
        puzzle for puzzle in case.puzzles
        if puzzle["type"] == "evidence_classification"
    )

    puzzle = Case003EvidenceClassificationPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    game_state = session["game_state"]

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P02",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        if "evidence_classification" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("evidence_classification")

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "field_investigation"

        return {
            "correct": True,
            "message": "Correct! The evidence separates what was actually observed from assumptions about the job offer, family preparation, the jacket logo, and the unknown man's description.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect classification. Reconsider what the evidence actually establishes versus what remains unproven.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes
    }

@app.post("/sessions/{session_id}/puzzles/case003-field-investigation")
def solve_case003_field_investigation(session_id: str, answer: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]

    if session["case_id"] != "003":
        raise HTTPException(status_code=400, detail="This puzzle belongs to Case 003")

    case = load_case("data/case_003.json")

    puzzle_data = next(
        puzzle for puzzle in case.puzzles
        if puzzle["type"] == "field_investigation"
    )

    puzzle = Case003FieldInvestigationPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    game_state = session["game_state"]

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P03",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        if "field_investigation" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("field_investigation")

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "institutional_review"

        return {
            "correct": True,
            "message": "Correct! The investigation did not confirm the alleged logging camp or job location, weakening the original employment theory without proving what happened to the family.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect investigation analysis. Reconsider what the logging-camp search actually established and what remains unverified.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes
    }

@app.post("/sessions/{session_id}/puzzles/case003-institutional-review")
def solve_case003_institutional_review(session_id: str, answer: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]

    if session["case_id"] != "003":
        raise HTTPException(status_code=400, detail="This puzzle belongs to Case 003")

    case = load_case("data/case_003.json")

    puzzle_data = next(
        puzzle for puzzle in case.puzzles
        if puzzle["type"] == "institutional_review"
    )

    puzzle = Case003InstitutionalReviewPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    game_state = session["game_state"]

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P04",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        if "institutional_review" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("institutional_review")

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "hypothesis_management"

        return {
            "correct": True,
            "message": "Correct! The review identifies how the initial voluntary-departure theory and an incorrect family-found report affected the investigation and communication of the case.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect institutional review. Reconsider the initial theory, the incorrect report, and their impact on the investigation.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes
    }

@app.post("/sessions/{session_id}/puzzles/case003-hypothesis-management")
def solve_case003_hypothesis_management(session_id: str, answer: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]

    if session["case_id"] != "003":
        raise HTTPException(status_code=400, detail="This puzzle belongs to Case 003")

    case = load_case("data/case_003.json")

    puzzle_data = next(
        puzzle for puzzle in case.puzzles
        if puzzle["type"] == "hypothesis_management"
    )

    puzzle = Case003HypothesisManagementPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    game_state = session["game_state"]

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P05",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        if "hypothesis_management" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("hypothesis_management")

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = None
        game_state.game_over = True

        return {
            "correct": True,
            "message": "Correct! The available evidence does not establish a definitive explanation for the family's disappearance. All hypotheses remain unresolved, and insufficient evidence is the appropriate final conclusion.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect conclusion. The evidence is insufficient to resolve the competing hypotheses or establish a definitive explanation.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case004-digital-alibi-map")
def solve_case004_digital_alibi_map(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "004":
        raise HTTPException(
            status_code=400,
            detail="This puzzle belongs to Case 004"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P01"
    )

    puzzle = Case004DigitalAlibiMapPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P01",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:

        if "digital_alibi_map" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("digital_alibi_map")

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "time_of_death_reconciliation"

        return {
            "correct": True,
            "message": "Correct! The suspects' digital alibis have been mapped.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect digital alibi analysis. Try again.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes
    }

@app.post("/sessions/{session_id}/puzzles/case004-time-of-death-reconciliation")
def solve_case004_time_of_death_reconciliation(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "004":
        raise HTTPException(
            status_code=400,
            detail="This puzzle belongs to Case 004"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P02"
    )

    puzzle = Case004TimeOfDeathReconciliationPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P02",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:

        if "time_of_death_reconciliation" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append(
                "time_of_death_reconciliation"
            )

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "metadata_authentication"

        return {
            "correct": True,
            "message": "Correct! The alibis have been reconciled with the forensic time-of-death window.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect time-of-death reconciliation. Try again.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes
    }

@app.post("/sessions/{session_id}/puzzles/case004-metadata-authentication")
def solve_case004_metadata_authentication(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "004":
        raise HTTPException(
            status_code=400,
            detail="This puzzle belongs to Case 004"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P03"
    )

    puzzle = Case004MetadataAuthenticationPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P03",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:

        if "metadata_authentication" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append(
                "metadata_authentication"
            )

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "financial_motive_audit"

        return {
            "correct": True,
            "message": "Correct! Device presence has been distinguished from person presence.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect metadata analysis. Re-examine the digital trail and distinguish device presence from person presence.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes
    }

@app.post("/sessions/{session_id}/puzzles/case004-financial-motive-audit")
def solve_case004_financial_motive_audit(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "004":
        raise HTTPException(
            status_code=400,
            detail="This puzzle belongs to Case 004"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P04"
    )

    puzzle = Case004FinancialMotiveAuditPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P04",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:

        if "financial_motive_audit" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append(
                "financial_motive_audit"
            )

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "final_reconstruction"

        return {
            "correct": True,
            "message": "Correct! The suspects' financial motives have been examined independently.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect financial motive analysis. Try again.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes
    }

@app.post("/sessions/{session_id}/puzzles/case004-final-reconstruction")
def solve_case004_final_reconstruction(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    session = sessions[session_id]
    game_state = session["game_state"]

    if session["case_id"] != "004":
        raise HTTPException(
            status_code=400,
            detail="This puzzle belongs to Case 004"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P05"
    )

    puzzle = Case004FinalReconstructionPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P05",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:

        if "final_reconstruction" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append(
                "final_reconstruction"
            )

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = None
        game_state.game_over = True

        return {
            "correct": True,
            "message": "Correct! The final reconstruction identifies Rhea as the killer and explains the constructed alibi.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect final reconstruction. Re-examine the alibis, metadata, financial motive, and independent corroboration.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case005-comparative-analysis")
def solve_case005_comparative_analysis(session_id: str, answer: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]

    if session["case_id"] != "005":
        raise HTTPException(status_code=400, detail="This puzzle belongs to Case 005")

    case = load_case("data/case_005.json")

    puzzle_data = next(
        puzzle for puzzle in case.puzzles
        if puzzle["type"] == "comparative_analysis"
    )

    puzzle = Case005ComparativeAnalysisPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    game_state = session["game_state"]

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P01",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        if "comparative_analysis" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("comparative_analysis")

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "provenance_tracing"

        return {
            "correct": True,
            "message": "Correct! Profile X is repeatedly reported but questioned, while Profile Y is an authenticated competing result. Repetition alone does not establish biological authenticity.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect comparison. Repeated Profile X results must be distinguished from the authenticated Profile Y result and its stronger evidentiary basis.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes
    }

@app.post("/sessions/{session_id}/puzzles/case005-provenance-tracing")
def solve_case005_provenance_tracing(session_id: str, answer: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]

    if session["case_id"] != "005":
        raise HTTPException(status_code=400, detail="This puzzle belongs to Case 005")

    case = load_case("data/case_005.json")

    puzzle_data = next(
        puzzle for puzzle in case.puzzles
        if puzzle["type"] == "provenance_tracing"
    )

    puzzle = Case005ProvenanceTracingPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    game_state = session["game_state"]

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P02",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        if "provenance_tracing" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("provenance_tracing")

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "chain_analysis"

        return {
            "correct": True,
            "message": "Correct! The sample origin and initial handling have been traced, establishing the provenance chain separately from the biological result.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect provenance analysis. Trace the sample origin and initial handling before evaluating the biological result.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes
    }

@app.post("/sessions/{session_id}/puzzles/case005-chain-analysis")
def solve_case005_chain_analysis(session_id: str, answer: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]

    if session["case_id"] != "005":
        raise HTTPException(status_code=400, detail="This puzzle belongs to Case 005")

    case = load_case("data/case_005.json")

    puzzle_data = next(
        puzzle for puzzle in case.puzzles
        if puzzle["type"] == "chain_analysis"
    )

    puzzle = Case005ChainAnalysisPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    game_state = session["game_state"]

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P03",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        if "chain_analysis" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("chain_analysis")

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "evidentiary_standard"

        return {
            "correct": True,
            "message": "Correct! The laboratory processing chain has been reconstructed and the possible contamination or substitution points have been identified.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect chain analysis. Review the laboratory processing steps and identify where contamination or substitution could have occurred.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes
    }

@app.post("/sessions/{session_id}/puzzles/case005-evidentiary-standard")
def solve_case005_evidentiary_standard(session_id: str, answer: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]

    if session["case_id"] != "005":
        raise HTTPException(status_code=400, detail="This puzzle belongs to Case 005")

    case = load_case("data/case_005.json")

    puzzle_data = next(
        puzzle for puzzle in case.puzzles
        if puzzle["type"] == "evidentiary_standard"
    )

    puzzle = Case005EvidentiaryStandardPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    game_state = session["game_state"]

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P04",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        if "evidentiary_standard" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("evidentiary_standard")

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = "hypothesis_management"

        return {
            "correct": True,
            "message": "Correct! Profile Y is authenticated, while Profile X lacks formal authentication. Repeated reports do not equal authentication.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect evidentiary analysis. Distinguish repeated Profile X reports from the formal authentication supporting Profile Y.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes
    }

@app.post("/sessions/{session_id}/puzzles/case005-hypothesis-management")
def solve_case005_hypothesis_management(session_id: str, answer: dict):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]

    if session["case_id"] != "005":
        raise HTTPException(status_code=400, detail="This puzzle belongs to Case 005")

    case = load_case("data/case_005.json")

    puzzle_data = next(
        puzzle for puzzle in case.puzzles
        if puzzle["type"] == "hypothesis_management"
    )

    puzzle = Case005HypothesisManagementPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    game_state = session["game_state"]

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P05",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        if "hypothesis_management" not in game_state.solved_puzzles:
            game_state.solved_puzzles.append("hypothesis_management")

        for evidence_id in puzzle.get_unlocked_evidence():
            if evidence_id not in game_state.unlocked_evidence:
                game_state.unlocked_evidence.append(evidence_id)

        game_state.current_puzzle = None
        game_state.game_over = True

        return {
            "correct": True,
            "message": "Correct! Profile X is contradicted, Profile Y is supported, and the contamination and substitution hypotheses remain unresolved. The authenticated Profile Y conclusion is the supportable forensic conclusion.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect reconstruction. Review the authentication, provenance, and competing profile evidence before determining the final supportable conclusion.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case006-evidence-generation")
def solve_case006_evidence_generation(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "evidence_generation":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P01"
    )

    puzzle = Case006EvidenceGenerationPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P01",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("evidence_generation")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "evidence_classification"

        return {
            "correct": True,
            "message": "Correct! The $10 withdrawal, vehicle inventory, and missing possessions have been analyzed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect analysis. Re-examine the $10 balance and the possessions left or missing from the vehicle.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case006-evidence-classification")
def solve_case006_evidence_classification(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "evidence_classification":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P02"
    )

    puzzle = Case006EvidenceClassificationPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P02",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("evidence_classification")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "timeline_reconstruction"

        return {
            "correct": True,
            "message": "Correct! The identification left in the vehicle creates a contradiction, while the silent call remains low-reliability evidence.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect analysis. Re-examine the identification left in the vehicle and the evidentiary weight of the silent call.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case006-timeline-reconstruction")
def solve_case006_timeline_reconstruction(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "timeline_reconstruction":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P03"
    )

    puzzle = Case006TimelineReconstructionPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P03",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("timeline_reconstruction")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "hypothesis_test"

        return {
            "correct": True,
            "message": "Correct! The last reliable portion of Tim's journey reaches the Atlanta terminal.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect reconstruction. Re-examine the credit-card purchase and the abandoned car near the Atlanta terminal.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case006-hypothesis-test")
def solve_case006_hypothesis_test(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "hypothesis_test":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P04"
    )

    puzzle = Case006HypothesisTestPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P04",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("hypothesis_test")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "hypothesis_management"

        return {
            "correct": True,
            "message": "Correct! The Atlanta-to-Wisconsin route remains unexplained, so both theories must be evaluated without inventing a confirmed route.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect analysis. Re-examine the unexplained gap between Atlanta and Wisconsin and compare both theories carefully.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case006-hypothesis-management")
def solve_case006_hypothesis_management(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "hypothesis_management":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P05"
    )

    puzzle = Case006HypothesisManagementPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P05",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("hypothesis_management")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = None
        game_state.game_over = True

        return {
            "correct": True,
            "message": "Correct! Tim's genuine intention to disappear is supported, but the later interception, exact route, and cause of death remain unresolved.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect conclusion. Revisit all four hypotheses and distinguish what is supported from what remains unresolved.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case007-timeline-reconstruction")
def solve_case007_timeline_reconstruction(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "timeline_reconstruction":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P01"
    )

    puzzle = Case007TimelineReconstructionPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P01",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("timeline_reconstruction")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "forensic_analysis"

        return {
            "correct": True,
            "message": "Correct! The final vehicle movement sequence has been reconstructed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect reconstruction. Re-examine the departure, toll record, final vehicle movement, and following morning discovery.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case007-forensic-analysis")
def solve_case007_forensic_analysis(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "forensic_analysis":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P02"
    )

    puzzle = Case007ForensicAnalysisPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P02",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("forensic_analysis")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "trace_evidence_analysis"

        return {
            "correct": True,
            "message": "Correct! The two blood sources and possible second contributor have been analyzed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect analysis. Re-examine Daniel's blood, the rear-seat blood event, and the possibility of a second contributor.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case007-trace-evidence-analysis")
def solve_case007_trace_evidence_analysis(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "trace_evidence_analysis":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P03"
    )

    puzzle = Case007TraceEvidenceAnalysisPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P03",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("trace_evidence_analysis")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "forensic_reconstruction"

        return {
            "correct": True,
            "message": "Correct! The partial fingerprint and possible second-person connection have been analyzed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect analysis. Re-examine the partial fingerprint and remember that it does not establish the identity of a second person.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case007-forensic-reconstruction")
def solve_case007_forensic_reconstruction(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "forensic_reconstruction":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P04"
    )

    puzzle = Case007ForensicReconstructionPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P04",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("forensic_reconstruction")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "hypothesis_management"

        return {
            "correct": True,
            "message": "Correct! The vehicle submersion, stab damage, and final vehicle movement have been reconstructed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect reconstruction. Re-examine the vehicle damage, submersion, final movement, and physical evidence of a second person.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case007-hypothesis-management")
def solve_case007_hypothesis_management(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "hypothesis_management":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P05"
    )

    puzzle = Case007HypothesisManagementPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P05",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("hypothesis_management")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = None
        game_state.game_over = True

        return {
            "correct": True,
            "message": "Correct! The evidence supports an ambiguous suicide-versus-homicide conclusion.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect hypothesis assessment. Re-examine the evidence supporting and contradicting each hypothesis.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case010-comparative-analysis")
def solve_case010_comparative_analysis(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "comparative_analysis":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P01"
    )

    puzzle = Case010ComparativeAnalysisPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P01",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("comparative_analysis")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "comparative_analysis"

        return {
            "correct": True,
            "message": "Correct! The five cases have been compared and the victim pattern has been documented.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect comparison. Re-examine the locations, dates, circumstances, and victim patterns across the five cases.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case010-comparative-similarity")
def solve_case010_comparative_similarity(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "comparative_analysis":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P02"
    )

    puzzle = Case010ComparativeSimilarityPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P02",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("comparative_similarity")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "source_analysis"

        return {
            "correct": True,
            "message": "Correct! Genuine similarities, superficial similarities, and meaningful differences have been analyzed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect comparison. Re-examine the wound patterns, circumstances, similarities, and meaningful differences.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case010-source-analysis")
def solve_case010_source_analysis(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "source_analysis":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P03"
    )

    puzzle = Case010SourceAnalysisPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P03",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("source_analysis")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "hypothesis_management"

        return {
            "correct": True,
            "message": "Correct! The letter provenance, authenticity, authorship, and press influence have been analyzed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect source analysis. Re-examine the letter's authenticity, provenance, authorship, and distribution history.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case010-hypothesis-management")
def solve_case010_hypothesis_management(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "hypothesis_management":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P04"
    )

    puzzle = Case010HypothesisManagementPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P04",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("hypothesis_management")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "conclusion_writing"

        return {
            "correct": True,
            "message": "Correct! The suspect matrix has been assessed against the available evidence.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect hypothesis assessment. Re-examine the evidence supporting and contradicting each suspect hypothesis.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case010-conclusion-writing")
def solve_case010_conclusion_writing(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "conclusion_writing":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P05"
    )

    puzzle = Case010ConclusionWritingPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P05",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("conclusion_writing")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = None
        game_state.game_over = True

        return {
            "correct": True,
            "message": "Correct! The final evidence report distinguishes established facts, plausible inferences, and unresolved questions.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect conclusion. Re-examine the established facts, plausible inferences, unresolved questions, and limits of the evidence.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case011-spatial-analysis")
def solve_case011_spatial_analysis(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "spatial_analysis":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P01"
    )

    puzzle = Case011SpatialAnalysisPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P01",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("spatial_analysis")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "document_reconstruction"

        return {
            "correct": True,
            "message": "Correct! The four attack locations and their spatial pattern have been analyzed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect spatial analysis. Re-examine the four attack locations, victim relationships, and overall spatial pattern.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case011-document-reconstruction")
def solve_case011_document_reconstruction(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "document_reconstruction":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P02"
    )

    puzzle = Case011DocumentReconstructionPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P02",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("document_reconstruction")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "source_analysis"

        return {
            "correct": True,
            "message": "Correct! The Jazz Letter has been reconstructed from the available evidence.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect reconstruction. Re-examine the available evidence and reconstruct the letter carefully.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case011-source-analysis")
def solve_case011_source_analysis(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "source_analysis":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P03"
    )

    puzzle = Case011SourceAnalysisPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P03",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("source_analysis")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "comparative_analysis"

        return {
            "correct": True,
            "message": "Correct! The letter authorship, provenance, and connection to the attacks have been examined.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect source analysis. Re-examine the letter's authorship, provenance, and possible connection to the attacker.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case011-comparative-analysis")
def solve_case011_comparative_analysis(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "comparative_analysis":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P04"
    )

    puzzle = Case011ComparativeAnalysisPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P04",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("comparative_analysis")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "social_dynamics_model"

        return {
            "correct": True,
            "message": "Correct! The four attacks, weapon patterns, and victim patterns have been compared.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect comparison. Re-examine the attack patterns, weapons, victims, and differences between the four attacks.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case011-social-dynamics-model")
def solve_case011_social_dynamics_model(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "social_dynamics_model":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P05"
    )

    puzzle = Case011SocialDynamicsModelPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P05",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("social_dynamics_model")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = None
        game_state.game_over = True

        return {
            "correct": True,
            "message": "Correct! Public panic and the jazz response have been analyzed without treating public behavior as proof of attacker identity.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect social dynamics analysis. Re-examine the public panic, jazz response, threat influence, and competing hypotheses.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case012-fact-listing")
def solve_case012_fact_listing(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "fact_listing":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P01"
    )

    puzzle = Case012FactListingPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P01",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("fact_listing")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "identity_verification"

        return {
            "correct": True,
            "message": "Correct! The client claims and confirmed facts have been separated.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect fact listing. Re-examine the client claims, communication records, phone connections, and meeting connections.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case012-identity-verification")
def solve_case012_identity_verification(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "identity_verification":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P02"
    )

    puzzle = Case012IdentityVerificationPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P02",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("identity_verification")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "field_investigation"

        return {
            "correct": True,
            "message": "Correct! Steven's identity was checked against independent records.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect identity verification. Re-examine the government, financial, and independent witness records.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case012-field-investigation")
def solve_case012_field_investigation(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "field_investigation":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P03"
    )

    puzzle = Case012FieldInvestigationPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P03",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("field_investigation")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "digital_forensics"

        return {
            "correct": True,
            "message": "Correct! The isolated property and final job location have been traced.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect field investigation. Re-examine the isolated property, job location, property records, and booking history.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case012-field-investigation")
def solve_case012_field_investigation(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "field_investigation":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P03"
    )

    puzzle = Case012FieldInvestigationPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P03",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("field_investigation")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "digital_forensics"

        return {
            "correct": True,
            "message": "Correct! The isolated property and final job location have been traced.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect field investigation. Re-examine the isolated property, job location, property records, and booking history.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case012-digital-forensics")
def solve_case012_digital_forensics(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "digital_forensics":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P04"
    )

    puzzle = Case012DigitalForensicsPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P04",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("digital_forensics")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = "motive_analysis"

        return {
            "correct": True,
            "message": "Correct! Post-mortem account and phone activity has been analyzed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect digital forensics analysis. Re-examine the post-mortem account activity, phone activity, timing, and possible third-party access.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }

@app.post("/sessions/{session_id}/puzzles/case012-motive-analysis")
def solve_case012_motive_analysis(session_id: str, answer: dict):

    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    game_state = session["game_state"]

    if game_state.current_puzzle != "motive_analysis":
        raise HTTPException(
            status_code=400,
            detail="This puzzle is not the current puzzle"
        )

    case = load_case(
        f"data/case_{session['case_id'].zfill(3)}.json"
    )

    puzzle_data = next(
        p for p in case.puzzles
        if p["id"] == "P05"
    )

    puzzle = Case012MotiveAnalysisPuzzle(puzzle_data)

    correct = puzzle.check_answer(answer)

    log_puzzle_attempt(
        session["db_session_id"],
        session["player_id"],
        "P05",
        1,
        "correct" if correct else "incorrect",
        0
    )

    if correct:
        game_state.solved_puzzles.append("motive_analysis")
        game_state.unlocked_evidence.extend(
            puzzle.get_unlocked_evidence()
        )
        game_state.current_puzzle = None
        game_state.game_over = True

        return {
            "correct": True,
            "message": "Correct! The fabricated identity, beneficiaries, and possible motive have been analyzed.",
            "solved_puzzles": game_state.solved_puzzles,
            "unlocked_evidence": game_state.unlocked_evidence,
            "mistakes": game_state.mistakes,
            "game_over": game_state.game_over
        }

    game_state.mistakes += 1

    return {
        "correct": False,
        "message": "Incorrect motive analysis. Re-examine the beneficiaries, fabricated identity, real participants, and possible benefit from the death.",
        "solved_puzzles": game_state.solved_puzzles,
        "unlocked_evidence": game_state.unlocked_evidence,
        "mistakes": game_state.mistakes,
        "game_over": game_state.game_over
    }
>>>>>>> theirs

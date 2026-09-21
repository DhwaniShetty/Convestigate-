from src.game.evidence_system import EvidenceSystem
from src.case.case_loader import case
from src.game.timeline_puzzle import TimelinePuzzle
from src.game.game_state import GameState
from src.player.player_model import PlayerModel
from src.ai.adaptive_ai import AdaptiveAI
from src.game.pattern_puzzle import PatternPuzzle
from src.game.connection_graph import ConnectionGraphPuzzle

# -------------------------
# GAME SETUP
# -------------------------

puzzle = TimelinePuzzle(
    case.timeline,
    case.evidence,
    case.puzzles[0]
)

game_state = GameState(case.case_id)

player = PlayerModel()
evidence_system = EvidenceSystem(case.evidence)
adaptive_ai = AdaptiveAI()


# -------------------------
# P01 - TIMELINE
# -------------------------

solved, solve_time, mistakes = puzzle.play()

if solved:

    player.record_solve_time(solve_time)

    for _ in range(mistakes):
        player.record_mistake()

    game_state.current_puzzle = "P01"
    game_state.solved_puzzles.append("P01")

    ai_reaction = adaptive_ai.react_to_puzzle(
        "P01",
        game_state
    )

    print("AI reaction:", ai_reaction)

    unlocked = puzzle.get_unlocked_evidence()

    evidence_system.unlock_evidence(unlocked)
    game_state.unlocked_evidence.extend(unlocked)

    print("\nEvidence unlocked!")

    evidence_system.show_evidence()

    inspected = evidence_system.inspect_evidence()

    if inspected:
        game_state.inspected_evidence.append(inspected)
        player.record_evidence_inspection()


    # -------------------------
    # PLAYER MODEL
    # -------------------------

    print("\n--- GAME STATE ---")
    print("Case:", game_state.case_id)
    print("Solved puzzles:", game_state.solved_puzzles)
    print("Unlocked evidence:", game_state.unlocked_evidence)
    print("Inspected evidence:", game_state.inspected_evidence)

    print("\n--- PLAYER MODEL ---")
    print("Evidence inspected:", player.evidence_inspected)
    print("Mistakes:", player.mistakes)
    print("Hints used:", player.hints_used)
    print("Solve times:", player.solve_times)

    behavior = player.get_behavior_profile()

    print("Behavior profile:", behavior)

    ai_action = adaptive_ai.decide(
        behavior,
        game_state
    )

    ai_state = adaptive_ai.get_state(game_state)

    print("AI action:", ai_action)
    print("AI trust:", game_state.ai_trust)
    print("AI state:", ai_state)
    print("AI thrill:", game_state.ai_thrill)
    print("AI threat:", game_state.ai_threat)


    # -------------------------
    # P02 - EMPLOYMENT RECORDS
    # -------------------------

    p02 = PatternPuzzle(
        case.puzzles[1],
        case.evidence
    )

    print("\n==============================")
    print("PUZZLE P02")
    print("==============================")

    p02_solved, observation = p02.play()

    if p02_solved:

        game_state.current_puzzle = "P02"
        game_state.solved_puzzles.append("P02")

        game_state.player_observations.append(observation)
        ai_reaction = adaptive_ai.react_to_puzzle(
        "P02",
        game_state)
            
        unlocked = p02.unlocks

        evidence_system.unlock_evidence(unlocked)
        game_state.unlocked_evidence.extend(unlocked)

        print("\nEvidence unlocked from P02!")
        evidence_system.show_evidence()
    

        print("\n--- P02 STATE ---")
        print("Observation:", observation)
        print("Solved puzzles:", game_state.solved_puzzles)
        print("AI reaction:", ai_reaction)
        print("AI thrill:", game_state.ai_thrill)
        print("AI threat:", game_state.ai_threat)
        print("AI state:", adaptive_ai.get_state(game_state)) 
            # -------------------------
    # P03 - CONNECTION GRAPH
    # -------------------------

    p03 = ConnectionGraphPuzzle(
        case.puzzles[2]
    )

    print("\n==============================")
    print("PUZZLE P03")
    print("==============================")

    p03_solved, first, second , status = p03.play()

    if p03_solved:

        game_state.current_puzzle = "P03"
        game_state.solved_puzzles.append("P03")
        if status == "CONFIRMED":
           player.record_correct_connection()

        elif status == "NOT_ESTABLISHED":
            player.record_unsupported_connection()
        print("\n--- P03 STATE ---")
        print("First entity:", first)
        print("Second entity:", second)
        print("Connection status:", status)
        print("Solved puzzles:", game_state.solved_puzzles)